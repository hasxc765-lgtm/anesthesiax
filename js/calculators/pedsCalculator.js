/**
 * Pediatric Calculation & Safety Engine
 * AnesthesiaX — Phase 7.5 (Fully Audited & Patched)
 * File: js/logic/PedsCalculator.js
 * 
 * Clinical Reference & Standards:
 * - PALS / AHA Pediatric Resuscitation Standards
 * - Khine & Motoyama Cuffed/Uncuffed ETT Formulas (0.5 mm step standardization)
 * - Holliday-Segar Fluid Maintenance Framework
 */

import { pedsData } from "../data/pedsData.js";

// دالة مساعدة لتقريب قياسات الأنابيب لأقرب نصف مليمتر (0.5 mm)
function roundToHalf(value) {
  return Math.round(value * 2) / 2;
}

export class PedsCalculator {

  // =========================================================================
  // 1. STRICT INPUT VALIDATION & CLINICAL PLAUSIBILITY ENGINE
  // =========================================================================
  static validateInputs(weightKg, ageYears, ageDays = null) {
    const alerts = [];
    const errors = [];

    const weight = parseFloat(weightKg);
    let age = parseFloat(ageYears);

    if (ageDays !== null && !isNaN(parseFloat(ageDays))) {
      const days = parseFloat(ageDays);
      if (days >= 0) {
        age = days / 365.25;
      }
    }

    if (isNaN(weight) || weight <= 0) {
      errors.push(pedsData?.plausibilityConstraints?.messages?.invalidWeight || "يرجى إدخال وزن صحيح بالكيلوغرام.");
    }

    if (isNaN(age) || age < 0) {
      errors.push(pedsData?.plausibilityConstraints?.messages?.invalidAge || "يرجى إدخال عمر صحيح بالسنوات.");
    }

    if (weight > 150) {
      errors.push("الوزن المدخل يتجاوز النطاق المخصص لطب الأطفال (أقصى وزن 150 كغم).");
    }

    if (age > 18) {
      errors.push("العمر المدخل يتجاوز الفئة العمرية لطب الأطفال (الأعمار فوق 18 سنة تُحسب في حاسبة البالغين).");
    }

    // 🛡️ فحص التناسق السريري بين الوزن والعمر لمنع الأخطاء المطبعية (Sanity Check)
    if (!isNaN(weight) && !isNaN(age) && errors.length === 0) {
      if (age < 1 && weight > 15) {
        errors.push(`الوزن المدخل (${weight} كجم) مرتفع جداً وغير متوافق مع رضيع أقل من سنة.`);
      } else if (age <= 2 && weight > 35) {
        errors.push(`الوزن المدخل (${weight} كجم) غير منطقي لعمر (${age.toFixed(1)} سنة).`);
      } else if (age <= 6 && weight > 65) {
        errors.push(`الوزن المدخل (${weight} كجم) يتجاوز الحدود الفيزيولوجية لعمر (${age.toFixed(1)} سنة).`);
      } else if (age <= 12 && weight > 120) {
        errors.push(`الوزن المدخل (${weight} كجم) غير متناسب مع عمر (${age.toFixed(1)} سنة).`);
      }
    }

    if (pedsData?.plausibilityConstraints && errors.length === 0) {
      if (weight > pedsData.plausibilityConstraints.highWeightThresholdKg) {
        alerts.push(pedsData.plausibilityConstraints.messages.highWeightWarning);
      }
      if (age < (28 / 365.25)) {
        alerts.push(pedsData.plausibilityConstraints.messages.neonatalWarning);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      alerts,
      weight,
      age
    };
  }

  // =========================================================================
  // 2. ETT & AIRWAY ENGINE (معايرة 0.5 mm المعتمدة)
  // =========================================================================
  static calculateAirway(weightKg, ageYears) {
    const validation = this.validateInputs(weightKg, ageYears);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    const { weight, age } = validation;
    const warnings = [...validation.alerts];

    const minAgeFormulas = pedsData?.airwayRules?.childFormulas?.minAgeYearsInclusive ?? 1;

    // الرضع وحديثو الولادة (أقل من سنة واحدة - مطابقة الوزن)
    if (age < minAgeFormulas) {
      const ranges = pedsData?.airwayRules?.neonatalInfantRanges || [];
      const match = ranges.find(range => {
        const minOk = weight >= range.minWeightKgInclusive;
        const maxOk = range.maxWeightKgExclusive !== undefined
          ? weight < range.maxWeightKgExclusive
          : weight <= range.maxWeightKgInclusive;
        return minOk && maxOk;
      });

      const activeRange = match || ranges[ranges.length - 1] || {
        uncuffedSizeMm: 3.5,
        cuffedSizeMm: 3.0,
        estimatedOralDepthCm: 10,
        blade: "Miller 0 / 1"
      };

      const primaryUncuffed = activeRange.uncuffedSizeMm;
      const primaryCuffed = activeRange.cuffedSizeMm;

      return {
        success: true,
        method: match ? "weight_based_lookup" : "weight_based_fallback",
        isNeonatalInfant: true,
        uncuffedSizeMm: primaryUncuffed,
        cuffedSizeMm: primaryCuffed,
        cuffedDisplay: `${primaryCuffed.toFixed(1)} mm (احتياطي: ${(primaryCuffed - 0.5).toFixed(1)} / ${(primaryCuffed + 0.5).toFixed(1)})`,
        uncuffedDisplay: `${primaryUncuffed.toFixed(1)} mm (احتياطي: ${(primaryUncuffed - 0.5).toFixed(1)} / ${(primaryUncuffed + 0.5).toFixed(1)})`,
        estimatedOralDepthCm: activeRange.estimatedOralDepthCm,
        oralDepthRangeCm: activeRange.oralDepthRangeMinCm ? `${activeRange.oralDepthRangeMinCm}–${activeRange.oralDepthRangeMaxCm}` : `${activeRange.estimatedOralDepthCm}`,
        estimatedNasalDepthCm: activeRange.estimatedNasalDepthCm || (activeRange.estimatedOralDepthCm + 2),
        blade: activeRange.blade,
        backupSizesMm: {
          smaller: parseFloat((primaryUncuffed - 0.5).toFixed(1)),
          larger: parseFloat((primaryUncuffed + 0.5).toFixed(1))
        },
        warnings: [...warnings, pedsData?.airwayRules?.clinicalWarnings?.depthWarning || "تحقق من عمق الأنبوب بسماع الأصوات التنفسية وتخطيط الـ Capnography."]
      };
    }

    // معادلات الأطفال من عمر سنة فما فوق بنظام التقريب لـ 0.5 mm
    const rawUncuffed = (age / 4) + 4.0;
    const rawCuffed = (age / 4) + 3.5;
    
    // التقريب الدقيق لأقرب 0.5 mm
    const primaryUncuffed = roundToHalf(rawUncuffed);
    const primaryCuffed = roundToHalf(rawCuffed);

    const oralDepth = (age / 2) + 12;
    const nasalDepth = (age / 2) + 15;

    let blade = "Macintosh 2";
    if (age < 2) blade = "Miller 1 / Mac 1";
    else if (age >= 2 && age <= 6) blade = "Macintosh 2 / Miller 2";
    else if (age > 6 && age <= 12) blade = "Macintosh 2 – 3";
    else blade = "Macintosh 3 / 4";

    return {
      success: true,
      method: "age_based_formula_rounded_0.5mm",
      isNeonatalInfant: false,
      uncuffedSizeMm: primaryUncuffed,
      cuffedSizeMm: primaryCuffed,
      cuffedDisplay: `${primaryCuffed.toFixed(1)} mm (احتياطي: ${(primaryCuffed - 0.5).toFixed(1)} / ${(primaryCuffed + 0.5).toFixed(1)})`,
      uncuffedDisplay: `${primaryUncuffed.toFixed(1)} mm (احتياطي: ${(primaryUncuffed - 0.5).toFixed(1)} / ${(primaryUncuffed + 0.5).toFixed(1)})`,
      estimatedOralDepthCm: parseFloat(oralDepth.toFixed(1)),
      estimatedNasalDepthCm: parseFloat(nasalDepth.toFixed(1)),
      blade,
      backupSizesMm: {
        smallerCuffed: parseFloat((primaryCuffed - 0.5).toFixed(1)),
        largerCuffed: parseFloat((primaryCuffed + 0.5).toFixed(1)),
        smallerUncuffed: parseFloat((primaryUncuffed - 0.5).toFixed(1)),
        largerUncuffed: parseFloat((primaryUncuffed + 0.5).toFixed(1))
      },
      warnings: [
        ...warnings,
        "مقاس الأنبوب الرغامي مقرب لأقرب 0.5 mm مع تجهيز مقاس احتياطي أصغر وأكبر.",
        pedsData?.airwayRules?.clinicalWarnings?.cuffPressureWarning || "حافظ على ضغط الكاف أقل من 20 cmH2O في الأنابيب ذات الكاف."
      ]
    };
  }

  // =========================================================================
  // 3. EMERGENCY DRUG CALCULATION ENGINE
  // =========================================================================
  static calculateDrugDose(drugId, indicationId, weightKg, ageYears, selectedMgPerMl = null) {
    const validation = this.validateInputs(weightKg, ageYears);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    const { weight, age } = validation;
    const emergencyDrugs = pedsData?.emergencyDrugs || [];
    const drug = emergencyDrugs.find(d => d.id === drugId);
    if (!drug) {
      return { success: false, errors: [`الدواء المطلوب (${drugId}) غير موجود في قاعدة بيانات الأطفال.`] };
    }

    const indication = drug.indications?.find(i => i.id === indicationId);
    if (!indication) {
      return { success: false, errors: [`الاستطباب المطلوب (${indicationId}) غير متوفر للدواء ${drug.name}.`] };
    }

    const safetyAlerts = [...validation.alerts];
    if (drug.isHighAlert) {
      safetyAlerts.push(`⚠️ دواء عال الخطورة (HIGH ALERT): أعد التأكد من التركيز والجرعة بشكل مستقل.`);
    }
    if (indication.warnings && indication.warnings.length > 0) {
      safetyAlerts.push(...indication.warnings);
    }

    let concentrationMgPerMl = selectedMgPerMl;
    if (!concentrationMgPerMl) {
      if (indication.concentration && indication.concentration.mgPerMl) {
        concentrationMgPerMl = indication.concentration.mgPerMl;
      } else if (indication.concentrationOptions && indication.concentrationOptions.length > 0) {
        concentrationMgPerMl = indication.concentrationOptions[0].mgPerMl;
      }
    }

    let rawDose = 0;
    let minDose = null;
    let maxDose = null;
    let defaultDose = null;
    let unit = indication.doseUnit || "mg";

    if (indication.doseType === "fixed_mg_kg") {
      rawDose = weight * indication.doseValue;
      unit = "mg";
    } else if (indication.doseType === "fixed_mcg_kg") {
      rawDose = weight * indication.doseValue;
      unit = "mcg";
    } else if (indication.doseType === "range_mg_kg") {
      minDose = weight * indication.doseMin;
      maxDose = weight * indication.doseMax;
      defaultDose = weight * (indication.defaultDoseValue || indication.doseMin);
      rawDose = defaultDose;
      unit = "mg";
    } else if (indication.doseType === "range_mcg_kg") {
      minDose = weight * indication.doseMin;
      maxDose = weight * indication.doseMax;
      defaultDose = weight * (indication.defaultDoseValue || indication.doseMin);
      rawDose = defaultDose;
      unit = "mcg";
    } else if (indication.doseType === "fixed_ml_kg" || indication.doseType === "fixed_meq_kg") {
      rawDose = weight * indication.doseValue;
      unit = indication.doseType.includes("ml") ? "mL" : "mEq";
    } else if (indication.doseType === "range_ml_kg" || indication.doseType === "range_meq_kg") {
      minDose = weight * indication.doseMin;
      maxDose = weight * indication.doseMax;
      defaultDose = weight * (indication.defaultDoseValue || indication.doseMin);
      rawDose = defaultDose;
      unit = indication.doseType.includes("ml") ? "mL" : "mEq";
    } else if (indication.doseType === "fixed_absolute") {
      rawDose = indication.doseValue;
    }

    let maxLimit = null;

    if (unit === "mcg") {
      if (indication.maxSingleDoseMcg) maxLimit = indication.maxSingleDoseMcg;
      else if (indication.maxSingleDoseMg) maxLimit = indication.maxSingleDoseMg * 1000;
    } else if (unit === "mg") {
      if (indication.maxSingleDoseMg) maxLimit = indication.maxSingleDoseMg;
      else if (indication.maxSingleDoseMcg) maxLimit = indication.maxSingleDoseMcg / 1000;
    } else {
      maxLimit = indication.maxSingleDoseMeq || indication.maxSingleVolumeMl || indication.maxSingleDoseSaltMg || null;
    }

    if (indication.maxSingleDoseRules && indication.maxSingleDoseRules.length > 0) {
      const activeRule = indication.maxSingleDoseRules.find(rule => {
        if (rule.maxAgeYearsInclusive !== undefined && age <= rule.maxAgeYearsInclusive) return true;
        if (rule.minAgeYearsExclusive !== undefined && age > rule.minAgeYearsExclusive) return true;
        return false;
      });
      if (activeRule) {
        maxLimit = unit === "mcg" ? activeRule.maxDoseMg * 1000 : activeRule.maxDoseMg;
      }
    }

    let appliedDose = rawDose;
    let isCapped = false;
    let isMinEnforced = false;

    if (indication.minSingleDoseMg && unit === "mg" && appliedDose < indication.minSingleDoseMg) {
      appliedDose = indication.minSingleDoseMg;
      isMinEnforced = true;
      safetyAlerts.push(`تم تطبيق الحد الأدنى للجرعة (${indication.minSingleDoseMg} mg).`);
    }

    if (maxLimit !== null && appliedDose > maxLimit) {
      appliedDose = maxLimit;
      isCapped = true;
      safetyAlerts.push(`الجرعة المحسوبة (${rawDose.toFixed(2)} ${unit}) تتجاوز الحد الأقصى الآمن (${maxLimit} ${unit}). تم تقييد الجرعة عند ${maxLimit} ${unit}.`);
    }

    let calculatedVolumeMl = null;
    if (indication.doseType.includes("ml_kg")) {
      calculatedVolumeMl = appliedDose;
    } else if (unit === "mcg" && concentrationMgPerMl && concentrationMgPerMl > 0) {
      calculatedVolumeMl = (appliedDose / 1000) / concentrationMgPerMl;
    } else if (concentrationMgPerMl && concentrationMgPerMl > 0) {
      calculatedVolumeMl = appliedDose / concentrationMgPerMl;
    }

    let elementalCalciumInfo = null;
    if (indication.concentration && indication.concentration.elementalCaMgPerMl) {
      const elementalCaMgPerMl = indication.concentration.elementalCaMgPerMl;
      const saltMgPerMl = indication.concentration.saltMgPerMl;
      const elementalCaDeliveredMg = calculatedVolumeMl ? calculatedVolumeMl * elementalCaMgPerMl : 0;
      elementalCalciumInfo = {
        saltSubstance: indication.concentration.substanceName || drug.name,
        saltMgPerMl,
        elementalCaMgPerMl,
        deliveredElementalCaMg: parseFloat(elementalCaDeliveredMg.toFixed(2))
      };
    }

    return {
      success: true,
      drugName: drug.name,
      arabicName: drug.arabicName,
      indicationTitle: indication.title,
      route: indication.route,
      context: indication.context,
      rawCalculatedDose: parseFloat(rawDose.toFixed(3)),
      appliedDose: parseFloat(appliedDose.toFixed(3)),
      doseUnit: unit,
      minDose: minDose ? parseFloat(minDose.toFixed(3)) : null,
      maxDose: maxDose ? parseFloat(maxDose.toFixed(3)) : null,
      maxConfiguredLimit: maxLimit,
      isCapped,
      isMinEnforced,
      requiresReview: indication.requiresClinicalReview || isCapped,
      concentrationMgPerMl,
      calculatedVolumeMl: calculatedVolumeMl !== null ? parseFloat(calculatedVolumeMl.toFixed(2)) : null,
      elementalCalciumInfo,
      safetyAlerts
    };
  }

  // =========================================================================
  // 4. MAINTENANCE FLUID ENGINE (Holliday-Segar)
  // =========================================================================
  static calculateMaintenanceFluids(weightKg, ageDays = 30) {
    const validation = this.validateInputs(weightKg, null, ageDays);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    const { weight } = validation;
    const warnings = [...validation.alerts];

    const minAgeDays = pedsData?.maintenanceFluidRules?.scope?.minAgeDays ?? 28;
    if (ageDays < minAgeDays) {
      warnings.push("عمر المريض أقل من 28 يوماً. تنطبق بروتوكولات سوائل حديثي الولادة (NICU).");
    }

    let hourlyRateMlHr = 0;
    if (weight <= 10) {
      hourlyRateMlHr = weight * 4;
    } else if (weight <= 20) {
      hourlyRateMlHr = 40 + ((weight - 10) * 2);
    } else {
      hourlyRateMlHr = 60 + ((weight - 20) * 1);
    }

    const dailyVolumeMl24h = hourlyRateMlHr * 24;

    return {
      success: true,
      hourlyRateMlHr: parseFloat(hourlyRateMlHr.toFixed(1)),
      dailyVolumeMl24h: parseFloat(dailyVolumeMl24h.toFixed(1)),
      method: pedsData?.maintenanceFluidRules?.ruleName || "Holliday-Segar (4-2-1 Rule)",
      guidanceTitle: pedsData?.maintenanceFluidRules?.compositionGuidance?.title || "تركيب السوائل الموصى به:",
      guidanceRecommendation: pedsData?.maintenanceFluidRules?.compositionGuidance?.recommendation || "استخدم سوائل متوازنة المحاليل (Isotonic) لتجنب انخفاض صوديوم الدم.",
      guidanceDisclaimer: pedsData?.maintenanceFluidRules?.compositionGuidance?.disclaimer || "تنسق السوائل حسب الحالة السريرية ونسبة الجفاف.",
      warnings
    };
  }
}
