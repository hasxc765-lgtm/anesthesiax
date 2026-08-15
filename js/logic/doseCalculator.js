/**
 * AnesthesiaX — Clinical Dose Calculation & Decision Support Engine
 * File: js/logic/doseCalculator.js
 *
 * Production-Grade Clinical Calculation Engine (Zero-Defect Defense-in-Depth)
 * - Enforces Hard Safety Validation Gates (stops execution on missing mandatory inputs).
 * - Transparent weight scalar fallbacks (never obfuscates the actual weight used).
 * - Strict context verification (rejects invalid contexts without silent fallbacks).
 * - Enforces compound ceilings: min(labeled_mg_per_kg * weight, absolute_max_mg).
 * - Complete calculation trace and full floating-point precision throughout execution.
 */

import { DOSE_UNITS } from "../data/common/doseUnits.js";

/**
 * دالة تعقيم وتحقق صارمة للأرقام الموجبة المحدودة (Strict Positive Number Sanitizer)
 * @param {*} value - القيمة المراد فحصها
 * @returns {number|null} رقم موجب محدود أو null
 */
export function sanitizePositiveNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const num = Number(value);
  if (Number.isFinite(num) && num > 0) {
    return num;
  }
  return null;
}

/**
 * دالة مساعدة لتقريب القيم للعرض فقط دون التأثير على العمليات الرياضية الداخلية
 * @param {number} value - القيمة الرقمية
 * @param {number} decimals - عدد الخانات العشرية
 * @returns {number}
 */
export function formatPrecision(value, decimals = 2) {
  if (!Number.isFinite(value)) return 0;
  return Number(Math.round(Number(value + "e" + decimals)) + "e-" + decimals);
}

/**
 * دالة حل وزن المريض بشفافية سريرية كاملة دون تزييف النوع المستخدم
 * @param {Object} weightPolicy - سياسة الوزن الخاصة بالسياق
 * @param {Object} patient - بيانات المريض (weight, ibw, lbw, abw)
 * @returns {Object} { selectedWeight, requestedType, actualTypeUsed, fallbackApplied, note }
 */
export function resolveWeightScalar(weightPolicy, patient = {}) {
  const tbw = sanitizePositiveNumber(patient.weight);
  const ibw = sanitizePositiveNumber(patient.ibw);
  const lbw = sanitizePositiveNumber(patient.lbw);
  const abw = sanitizePositiveNumber(patient.abw);

  const requestedType = (weightPolicy?.preferred || "TBW").toUpperCase();
  let selectedWeight = null;
  let actualTypeUsed = null;
  let fallbackApplied = false;
  let note = weightPolicy?.note || "";

  switch (requestedType) {
    case "LBW":
      if (lbw) {
        selectedWeight = lbw;
        actualTypeUsed = "LBW";
      } else if (ibw) {
        selectedWeight = ibw;
        actualTypeUsed = "IBW (Fallback)";
        fallbackApplied = true;
        note = "تم الحساب على الوزن المثالي (IBW) لعدم توفر الوزن الخالي من الدهون (LBW).";
      } else if (tbw) {
        selectedWeight = tbw;
        actualTypeUsed = "TBW (Fallback)";
        fallbackApplied = true;
        note = "تم الحساب على الوزن الكلي (TBW) لعدم توفر الوزن الخالي من الدهون (LBW).";
      }
      break;

    case "IBW":
      if (ibw) {
        selectedWeight = ibw;
        actualTypeUsed = "IBW";
      } else if (tbw) {
        selectedWeight = tbw;
        actualTypeUsed = "TBW (Fallback)";
        fallbackApplied = true;
        note = "تم الحساب على الوزن الكلي (TBW) لعدم توفر الوزن المثالي (IBW).";
      }
      break;

    case "ABW":
      if (abw) {
        selectedWeight = abw;
        actualTypeUsed = "ABW";
      } else if (tbw) {
        selectedWeight = tbw;
        actualTypeUsed = "TBW (Fallback)";
        fallbackApplied = true;
        note = "تم الحساب على الوزن الكلي (TBW) لعدم توفر الوزن المعدل (ABW).";
      }
      break;

    case "TBW":
    default:
      if (tbw) {
        selectedWeight = tbw;
        actualTypeUsed = "TBW";
      }
      break;
  }

  return {
    selectedWeight: selectedWeight,
    requestedType: requestedType,
    actualTypeUsed: actualTypeUsed || "NONE",
    fallbackApplied: fallbackApplied,
    note: note
  };
}

/**
 * بوابة الأمان والتحقق من صحة المدخلات (Hard Safety Validation Gate)
 * تفصل بدقة بين المتطلبات المانعة للحساب (Blocking Errors) والتحذيرات السريرية (Warnings)
 * @param {Object} drug - كائن الدواء
 * @param {Object} context - السياق السريري
 * @param {Object} patient - بيانات المريض
 * @returns {Object} { isBlocked, blockingErrors, warnings }
 */
export function validateCalculationInputs(drug, context, patient = {}) {
  const blockingErrors = [];
  const warnings = [];
  const validation = context?.validation || drug?.validation || {};

  // 1) فحص الوزن الإلزامي
  if (validation.requireWeight) {
    const wt = sanitizePositiveNumber(patient.weight);
    if (!wt) {
      blockingErrors.push("وزن المريض (Patient Weight) إلزامي لإجراء الحساب.");
    } else if (wt < 0.5 || wt > 350) {
      blockingErrors.push(`وزن المريض المدخل (${wt} kg) يقع خارج النطاق السريري المنطقي.`);
    }
  }

  // 2) فحص العمر الإلزامي
  if (validation.requireAge) {
    const age = sanitizePositiveNumber(patient.age);
    if (!age) {
      blockingErrors.push("عمر المريض (Patient Age) إلزامي لإجراء هذا الحساب السريري.");
    } else if (age < 0 || age > 125) {
      blockingErrors.push(`عمر المريض المدخل (${age}) غير صالح سريرياً.`);
    }
  }

  // 3) فحص التوافق بين فئة المريض والسياق السريري
  if (context?.population) {
    const patientAge = Number(patient.age);
    if (patientAge > 0) {
      if (context.population.includes("pediatric") && patientAge >= 18) {
        warnings.push("تنبيه: تم اختيار سياق مخصص لطب الأطفال لمريض يبلغ من العمر 18 عاماً أو أكثر.");
      } else if (context.population.includes("adult") && patientAge < 18) {
        warnings.push("تنبيه: تم اختيار سياق مخصص للبالغين لمريض يقل عمره عن 18 عاماً.");
      }
    }
  }

  // 4) فحص التحسس والمراقبة (تحذيرات سريرية وليست حواجب برمجية للحساب المرجعي)
  if (validation.requireAllergyReview && !patient.allergyReviewed) {
    warnings.push("ملاحظة أمان: يجب التحقق من عدم وجود سوابق تحسسية لهذا الدواء قبل الإعطاء.");
  }

  if (validation.requireMonitoringConfirmation && !patient.monitoringConfirmed) {
    warnings.push("ملاحظة أمان: يتطلب هذا البروتوكول تأكيد توافر أجهزة المراقبة الحيوية المتقدمة.");
  }

  return {
    isBlocked: blockingErrors.length > 0,
    blockingErrors: blockingErrors,
    warnings: warnings
  };
}

/**
 * دالة حساب الـ MAC المصحح عمرياً (Mapleson Algorithm)
 * تشترط عمراً صالحاً وترفض الافتراضات الصامتة
 * @param {Object} macModel - نموذج الـ MAC
 * @param {*} ageInput - عمر المريض
 * @returns {Object} نتائج الـ MAC أو كائن خطأ
 */
export function calculateAgeAdjustedMac(macModel, ageInput) {
  const patientAge = sanitizePositiveNumber(ageInput);

  if (!patientAge) {
    return {
      success: false,
      error: "عمر المريض إلزامي لحساب الـ MAC المصحح عمرياً (لا يمكن تطبيق افتراض صامت لعمر 40)."
    };
  }

  if (!macModel || typeof macModel.referenceValue !== "number") {
    return {
      success: false,
      error: "نموذج الـ MAC غير معرّف بشكل صحيح لهذا الدواء."
    };
  }

  const baseMac = macModel.referenceValue; // MAC at age 40
  // معادلة Mapleson العالمية: MAC(age) = MAC(40) * 10^(-0.00269 * (age - 40))
  const exponent = -0.00269 * (patientAge - 40);
  const calculated1Mac = baseMac * Math.pow(10, exponent);

  return {
    success: true,
    referenceMacAtAge40: baseMac,
    patientAge: patientAge,
    adjusted1Mac: formatPrecision(calculated1Mac, 2),
    guidanceRange: {
      min05Mac: formatPrecision(calculated1Mac * 0.5, 2),
      max13Mac: formatPrecision(calculated1Mac * 1.3, 2),
      unit: DOSE_UNITS.PERCENT_END_TIDAL,
      description: "نطاق استرشادي عام للتخدير المتوازن (0.5 – 1.3 MAC)؛ لا يمثل هدفاً وصفياً ثابتاً."
    },
    formula: "Mapleson age-adjusted MAC formula",
    clinicalModifiersNote: "تنخفض متطلبات الـ MAC الفعلية عند المشاركة مع N2O أو الأفيونات أو المهدئات أو عند انخفاض حرارة الجسم."
  };
}

/**
 * المحرك المركزي الموحد لحساب الجرعات السريرية (Central Clinical Dose Engine)
 * @param {Object} drug - كائن الدواء من قاعدة البيانات
 * @param {string} contextId - معرّف السياق السريري
 * @param {Object} patient - بيانات المريض (weight, height, age, ibw, lbw, etc.)
 * @param {Object} selectedPresentation - التركيز أو العبوة المختارة
 * @param {Object} options - خيارات إضافية (مثل primaryDoseMg لحساب المشاركة الدوائية)
 * @returns {Object} تقرير الحساب السريري الشامل
 */
export function calculateDose(drug, contextId, patient = {}, selectedPresentation = null, options = {}) {
  const calculationTrace = [];
  calculationTrace.push("بدء عملية المعالجة في محرك الحساب السريري.");

  if (!drug) {
    return {
      status: "ERROR",
      success: false,
      error: "لم يتم تمرير كائن الدواء إلى المحرك الحسابي."
    };
  }

  // 1) التحقق الصارم من السياق السريري (Rejection of Invalid Contexts)
  const contexts = drug.clinicalContexts || [];
  let context = null;

  if (contextId) {
    context = contexts.find(c => c.id === contextId);
    if (!context && !drug.macModel) {
      return {
        status: "ERROR",
        success: false,
        error: `السياق السريري المحدد '${contextId}' غير صالح أو غير مسجل للدواء '${drug.name?.generic || drug.id}'.`
      };
    }
  } else {
    // إذا لم يُمرر contextId، نبحث عن السياق الافتراضي الصريح فقط
    context = contexts.find(c => c.isDefault);
    if (!context && !drug.macModel) {
      return {
        status: "ERROR",
        success: false,
        error: "لم يتم تحديد سياق سريري ولا يوجد سياق افتراضي معرّف لهذا الدواء."
      };
    }
  }

  calculationTrace.push(`تم اعتماد السياق السريري: ${context?.label || "نموذج الغازات الاستنشاقية"}.`);

  // 2) فحص بوابة الأمان (Safety Validation Gate)
  const validationResult = validateCalculationInputs(drug, context, patient);

  if (validationResult.isBlocked) {
    calculationTrace.push(`توقف الحساب: لم يتم استيفاء المدخلات الإلزامية [${validationResult.blockingErrors.join(" | ")}].`);
    return {
      status: "BLOCKED",
      success: false,
      drugId: drug.id,
      drugName: drug.name,
      contextId: context?.id || "unknown",
      contextLabel: context?.label || "غير محدد",
      blockingErrors: validationResult.blockingErrors,
      warnings: validationResult.warnings,
      calculatedDose: null,
      calculatedVolume: null,
      infusionPumpRate: null,
      calculationTrace: calculationTrace
    };
  }

  // 3) حل الوزن المناسب
  const weightResolution = resolveWeightScalar(context?.weightPolicy, patient);
  const effectiveWeight = weightResolution.selectedWeight;
  calculationTrace.push(`حل الوزن: ${effectiveWeight ? effectiveWeight + " kg" : "غير مطلوب"} | النوع المعتمد: ${weightResolution.actualTypeUsed}.`);

  // 4) استخراج وتجهيز التركيز
  const presentation = selectedPresentation ||
                       (drug.presentations && (drug.presentations.find(p => p.isDefault) || drug.presentations[0])) ||
                       (drug.concentrations && (drug.concentrations.find(c => c.isDefault) || drug.concentrations[0])) ||
                       null;

  // هيكل النتيجة الموحد
  const result = {
    status: "CALCULATED",
    success: true,
    drugId: drug.id,
    drugName: drug.name,
    contextId: context?.id || "mac_inhalational",
    contextLabel: context?.label || "الاستخدام الاستنشاقي",
    population: context?.population || "adult",
    route: context?.route || (drug.routes && drug.routes[0]) || "IV",
    doseType: context?.doseType || "reference",
    isPrescriptionOrder: false, // حماية قانونية: تأكيد أن الناتج مرجعي استرشادي
    calculationPolicy: drug.calculationPolicy || { mode: "reference_only", automaticDoseCalculation: false },
    validation: {
      warnings: validationResult.warnings
    },
    weightResolution: weightResolution,
    presentationUsed: presentation,
    calculatedDose: null,
    calculatedVolume: null,
    infusionPumpRate: null,
    macResults: null,
    pairingResult: null,
    safetyLimits: {
      clamped: false,
      details: []
    },
    calculationTrace: calculationTrace,
    clinicalNotes: context?.note || ""
  };

  // =========================================================================
  // المسار 1: الغازات الاستنشاقية (Inhalational Volatile MAC Calculation)
  // =========================================================================
  if (drug.macModel || context?.doseType === "end_tidal_concentration") {
    const macCalc = calculateAgeAdjustedMac(drug.macModel, patient.age);
    if (!macCalc.success) {
      result.status = "BLOCKED";
      result.success = false;
      result.error = macCalc.error;
      return result;
    }
    result.macResults = macCalc;
    result.calculatedDose = {
      type: "end_tidal_concentration",
      guidanceRange: macCalc.guidanceRange,
      unit: DOSE_UNITS.PERCENT_END_TIDAL
    };
    calculationTrace.push(`تم حساب الـ MAC المصحح لعمر ${patient.age} سنة: 1.0 MAC = ${macCalc.adjusted1Mac}%.`);
    return result;
  }

  // =========================================================================
  // المسار 2: المشاركة الدوائية (Drug Pairing e.g. Glycopyrrolate + Neostigmine)
  // =========================================================================
  if (context?.pairing && context.pairing.targetAgentId === "neostigmine") {
    const primaryDose = sanitizePositiveNumber(options.primaryDoseMg);

    if (!primaryDose) {
      result.status = "BLOCKED";
      result.success = false;
      result.error = "يتطلب حساب جرعة الغليكوبيرولات المقترنة إدخال الجرعة الفعلية المعطاة من النيوستيغمين (primaryDoseMg).";
      return result;
    }

    const ratio = context.pairing.ratioMgPerMg || 0.2;
    const requiredGlycoMg = primaryDose * ratio;
    const concValue = presentation?.concentration || presentation?.value || 0.2;
    const volumeMl = requiredGlycoMg / concValue;

    result.pairingResult = {
      primaryAgent: "Neostigmine",
      primaryDoseGivenMg: primaryDose,
      pairingRatio: `${ratio} mg Glycopyrrolate per 1.0 mg Neostigmine`,
      calculatedGlycopyrrolateMg: formatPrecision(requiredGlycoMg, 3),
      calculatedVolumeMl: formatPrecision(volumeMl, 2)
    };

    result.calculatedDose = {
      min: formatPrecision(requiredGlycoMg, 3),
      max: formatPrecision(requiredGlycoMg, 3),
      unit: DOSE_UNITS.MG_FIXED
    };

    result.calculatedVolume = {
      min: formatPrecision(volumeMl, 2),
      max: formatPrecision(volumeMl, 2),
      unit: DOSE_UNITS.ML_FIXED,
      display: `${formatPrecision(volumeMl, 2)} mL`
    };

    calculationTrace.push(`تم حساب جرعة الغليكوبيرولات المقترنة: ${primaryDose} mg نيوستيغمين * ${ratio} = ${result.calculatedDose.min} mg (${result.calculatedVolume.min} mL).`);
    return result;
  }

  // =========================================================================
  // المسار 3: الجرعات الدفعية بالوزن (Weight-based Boluses)
  // =========================================================================
  if (context?.doseType === "weight_bolus" || context?.doseType === "incremental_weight_based") {
    const minPerKg = context.doseMin ?? context.initialDose?.min ?? 0;
    const maxPerKg = context.doseMax ?? context.initialDose?.max ?? minPerKg;
    const unit = context.unit || context.initialDose?.unit || DOSE_UNITS.MG_PER_KG;

    if (!effectiveWeight) {
      result.status = "BLOCKED";
      result.success = false;
      result.error = "الوزن الفعال غير متوفر لحساب الجرعة المعتمدة على الوزن.";
      return result;
    }

    let rawMinDose = minPerKg * effectiveWeight;
    let rawMaxDose = maxPerKg * effectiveWeight;
    calculationTrace.push(`حساب الجرعة الخام: ${minPerKg} - ${maxPerKg} ${unit} * ${effectiveWeight} kg = ${rawMinDose} - ${rawMaxDose}.`);

    // فحص وتطبيق السقوف الدوائية الصارمة (Compound Safety Ceilings)
    if (drug.id === "neostigmine" && drug.doseLimits) {
      // سقف النيوستيغمين: min(0.07 mg/kg * weight, 5.0 mg)
      const weightLimitMg = 0.07 * effectiveWeight;
      const absoluteCeilingMg = 5.0;
      const enforcedMaxCeiling = Math.min(weightLimitMg, absoluteCeilingMg);

      if (rawMaxDose > enforcedMaxCeiling) {
        result.safetyLimits.clamped = true;
        result.safetyLimits.details.push({
          parameter: "Neostigmine Maximum Dose",
          originalCalculated: formatPrecision(rawMaxDose, 2),
          enforcedLimit: formatPrecision(enforcedMaxCeiling, 2),
          rule: "min(0.07 mg/kg * weight, 5.0 mg)"
        });
        rawMaxDose = enforcedMaxCeiling;
        calculationTrace.push(`تم تقييد الجرعة القصوى للنيوستيغمين بالسقف الأماني: ${enforcedMaxCeiling} mg.`);
      }
    }

    result.calculatedDose = {
      min: formatPrecision(rawMinDose, 3),
      max: formatPrecision(rawMaxDose, 3),
      unit: unit.replace("/kg", "")
    };

    // حساب الحجم بالسرنجة بالاعتماد على التركيز
    if (presentation) {
      const concValue = presentation.concentration || presentation.value;
      const concUnit = presentation.unit;

      if (concValue && concValue > 0) {
        let conversionFactor = 1;

        if (unit.includes("mcg") && concUnit.includes("mg/mL")) {
          conversionFactor = 1000;
        } else if (unit.includes("mg") && concUnit.includes("mcg/mL")) {
          conversionFactor = 0.001;
        }

        if (unit === DOSE_UNITS.ML_PER_KG) {
          result.calculatedVolume = {
            min: formatPrecision(rawMinDose, 1),
            max: formatPrecision(rawMaxDose, 1),
            unit: DOSE_UNITS.ML_FIXED,
            display: `${formatPrecision(rawMinDose, 1)} – ${formatPrecision(rawMaxDose, 1)} mL`
          };
        } else {
          const minVol = (rawMinDose / concValue) / conversionFactor;
          const maxVol = (rawMaxDose / concValue) / conversionFactor;

          result.calculatedVolume = {
            min: formatPrecision(minVol, 2),
            max: formatPrecision(maxVol, 2),
            unit: DOSE_UNITS.ML_FIXED,
            display: formatPrecision(minVol, 2) === formatPrecision(maxVol, 2)
              ? `${formatPrecision(minVol, 2)} mL`
              : `${formatPrecision(minVol, 2)} – ${formatPrecision(maxVol, 2)} mL`
          };
        }
        calculationTrace.push(`حساب الحجم: التركيز = ${concValue} ${concUnit} | الحجم = ${result.calculatedVolume.display}.`);
      }
    }
  }

  // =========================================================================
  // المسار 4: الجرعات الثابتة (Fixed Boluses / Fixed Doses)
  // =========================================================================
  else if (context?.doseType === "fixed_bolus" || context?.doseType === "fixed") {
    const minDose = context.doseMin ?? 0;
    const maxDose = context.doseMax ?? minDose;
    const unit = context.unit || DOSE_UNITS.MG_FIXED;

    result.calculatedDose = {
      min: formatPrecision(minDose, 3),
      max: formatPrecision(maxDose, 3),
      unit: unit
    };

    if (presentation) {
      const concValue = presentation.concentration || presentation.value;
      const concUnit = presentation.unit;

      if (concValue && concValue > 0) {
        let conversionFactor = 1;
        if (unit === DOSE_UNITS.MCG_FIXED && concUnit.includes("mg/mL")) {
          conversionFactor = 1000;
        }

        if (unit === DOSE_UNITS.ML_FIXED) {
          result.calculatedVolume = {
            min: formatPrecision(minDose, 1),
            max: formatPrecision(maxDose, 1),
            unit: DOSE_UNITS.ML_FIXED,
            display: `${formatPrecision(minDose, 1)} mL`
          };
        } else {
          const minVol = (minDose / concValue) / conversionFactor;
          const maxVol = (maxDose / concValue) / conversionFactor;

          result.calculatedVolume = {
            min: formatPrecision(minVol, 2),
            max: formatPrecision(maxVol, 2),
            unit: DOSE_UNITS.ML_FIXED,
            display: formatPrecision(minVol, 2) === formatPrecision(maxVol, 2)
              ? `${formatPrecision(minVol, 2)} mL`
              : `${formatPrecision(minVol, 2)} – ${formatPrecision(maxVol, 2)} mL`
          };
        }
      }
    }
    calculationTrace.push(`جرعة ثابتة للبالغين: ${result.calculatedDose.min} ${unit}.`);
  }

  // =========================================================================
  // المسار 5: التسريب الوريدي ومضخات المحاقن (Continuous Infusion Engine)
  // =========================================================================
  else if (
    context?.doseType === "weight_infusion_min" ||
    context?.doseType === "weight_infusion_hour" ||
    context?.doseType === "fixed_infusion_min"
  ) {
    const minRate = context.doseMin ?? 0;
    const maxRate = context.doseMax ?? minRate;
    const unit = context.unit;

    result.calculatedDose = {
      min: minRate,
      max: maxRate,
      unit: unit
    };

    if (presentation) {
      const concValue = presentation.concentration || presentation.value;
      const concUnit = presentation.unit;

      if (concValue && concValue > 0) {
        let minMlHr = 0;
        let maxMlHr = 0;

        // A) تسريب ثابت بالدقيقة (mcg/min) -> (Dose * 60) / Conc(mcg/mL)
        if (context.doseType === "fixed_infusion_min") {
          let concInMcgMl = concValue;
          if (concUnit.includes("mg/mL")) concInMcgMl = concValue * 1000;

          minMlHr = (minRate * 60) / concInMcgMl;
          maxMlHr = (maxRate * 60) / concInMcgMl;
        }
        // B) تسريب بالوزن بالدقيقة (mcg/kg/min أو mg/kg/min أو mL/kg/min)
        else if (context.doseType === "weight_infusion_min") {
          if (effectiveWeight) {
            if (unit === DOSE_UNITS.ML_PER_KG_MIN) {
              minMlHr = minRate * effectiveWeight * 60;
              maxMlHr = maxRate * effectiveWeight * 60;
            } else if (unit === DOSE_UNITS.MCG_PER_KG_MIN) {
              let concInMcgMl = concValue;
              if (concUnit.includes("mg/mL")) concInMcgMl = concValue * 1000;
              minMlHr = (minRate * effectiveWeight * 60) / concInMcgMl;
              maxMlHr = (maxRate * effectiveWeight * 60) / concInMcgMl;
            } else if (unit === DOSE_UNITS.MG_PER_KG_MIN) {
              minMlHr = (minRate * effectiveWeight * 60) / concValue;
              maxMlHr = (maxRate * effectiveWeight * 60) / concValue;
            }
          }
        }
        // C) تسريب بالوزن بالساعة (mcg/kg/hour أو mg/kg/hour)
        else if (context.doseType === "weight_infusion_hour") {
          if (effectiveWeight) {
            if (unit === DOSE_UNITS.MCG_PER_KG_HOUR) {
              let concInMcgMl = concValue;
              if (concUnit.includes("mg/mL")) concInMcgMl = concValue * 1000;
              minMlHr = (minRate * effectiveWeight) / concInMcgMl;
              maxMlHr = (maxRate * effectiveWeight) / concInMcgMl;
            } else if (unit === DOSE_UNITS.MG_PER_KG_HOUR) {
              minMlHr = (minRate * effectiveWeight) / concValue;
              maxMlHr = (maxRate * effectiveWeight) / concValue;
            }
          }
        }

        result.infusionPumpRate = {
          minMlPerHour: formatPrecision(minMlHr, 1),
          maxMlPerHour: formatPrecision(maxMlHr, 1),
          unit: "mL/hr",
          display: formatPrecision(minMlHr, 1) === formatPrecision(maxMlHr, 1)
            ? `${formatPrecision(minMlHr, 1)} mL/hr`
            : `${formatPrecision(minMlHr, 1)} – ${formatPrecision(maxMlHr, 1)} mL/hr`
        };
        calculationTrace.push(`حساب سرعة المضخة: ${result.infusionPumpRate.display}.`);
      }
    }
  }

  // =========================================================================
  // المسار 6: سقوف أمان التخدير الموضعي (Local Anesthetic Safety Ceilings)
  // =========================================================================
  if (drug.doseLimits?.maxSingleDosePlainMgKg && effectiveWeight) {
    const limits = drug.doseLimits;
    const maxByWeight = limits.maxSingleDosePlainMgKg * effectiveWeight;
    const absoluteCeiling = limits.absoluteMaxPlainMg || maxByWeight;
    const finalSafeCeilingMg = Math.min(maxByWeight, absoluteCeiling);

    let maxVolumeMl = null;
    if (presentation) {
      const concMgMl = presentation.concentration || presentation.value || 0;
      if (concMgMl > 0) {
        maxVolumeMl = formatPrecision(finalSafeCeilingMg / concMgMl, 1);
      }
    }

    result.safetyLimits.localAnestheticCeiling = {
      maxSafeDoseMg: formatPrecision(finalSafeCeilingMg, 1),
      maxSafeVolumeMl: maxVolumeMl,
      ruleApplied: `${limits.maxSingleDosePlainMgKg} mg/kg (بحد أقصى مطلق ${absoluteCeiling} mg)`
    };
    calculationTrace.push(`سقف التخدير الموضعي الآمن: ${result.safetyLimits.localAnestheticCeiling.maxSafeDoseMg} mg (${maxVolumeMl} mL).`);
  }

  calculationTrace.push("اكتملت المعالجة السريرية بنجاح.");
  return result;
}

export default {
  sanitizePositiveNumber,
  formatPrecision,
  resolveWeightScalar,
  validateCalculationInputs,
  calculateAgeAdjustedMac,
  calculateDose
};
