/**
 * Preoperative Risk Assessment Calculation Engine
 *
 * AnesthesiaX — Phase 8.3
 * File: js/calculators/preOpRiskCalculator.js
 *
 * Architecture:
 * Pure Calculation ES Module.
 * Strictly decoupled from UI / DOM / rendering.
 *
 * Single Source of Truth:
 * ../data/preOpRiskData.js
 *
 * Supported Assessment Systems:
 * 1. ASA Physical Status + Emergency Modifier
 * 2. Revised Cardiac Risk Index (RCRI)
 * 3. ARISCAT Postoperative Pulmonary Complication Risk
 */

import { preOpRiskData } from "../data/preOpRiskData.js";

export class PreOpRiskCalculator {

  // =========================================================================
  // 1. GENERIC HELPERS
  // =========================================================================

  static toNumber(value) {
    if (value === null || value === undefined || value === "") {
      return NaN;
    }
    const number = Number(value);
    return Number.isFinite(number) ? number : NaN;
  }

  static toBoolean(value) {
    if (typeof value === "boolean") {
      return value;
    }
    if (typeof value === "number") {
      return value === 1;
    }
    if (typeof value === "string") {
      const normalized = value.trim().toLowerCase();
      return ["true", "1", "yes", "y", "on"].includes(normalized);
    }
    return false;
  }

  static round(value, decimals = 1) {
    if (!Number.isFinite(value)) {
      return null;
    }
    const factor = 10 ** decimals;
    return Math.round((value + Number.EPSILON) * factor) / factor;
  }

  static getASAById(asaId) {
    if (!asaId) return null;
    return preOpRiskData.asa.categories.find(cat => cat.id === asaId) || null;
  }

  static getARISCATTier(score) {
    const tiers = preOpRiskData.ariscat.tiers;
    return tiers.find(tier => score >= tier.minPoints && score <= tier.maxPoints) || null;
  }

  static getRCRICategory(score) {
    const classes = preOpRiskData.rcri.classes;
    return classes.find(cat => {
      if (Number.isFinite(cat.score) && score === cat.score) return true;
      if (Number.isFinite(cat.scoreMin) && score >= cat.scoreMin) return true;
      return false;
    }) || null;
  }

  // =========================================================================
  // 2. ASA PHYSICAL STATUS
  // =========================================================================

  static calculateASA(asaId, isEmergency = false) {
    const category = this.getASAById(asaId);

    if (!category) {
      return {
        success: false,
        error: "فئة ASA المحددة غير صالحة أو غير موجودة في بيانات المرجع."
      };
    }

    const emergency = this.toBoolean(isEmergency);
    const emergencyCode = preOpRiskData.asa.emergencyModifier.code;

    return {
      success: true,
      asa: {
        id: category.id,
        code: category.code,
        title: category.title,
        description: category.desc,
        example: category.example
      },
      emergencyModifier: {
        applied: emergency,
        code: emergency ? emergencyCode : null,
        label: emergency ? preOpRiskData.asa.emergencyModifier.label : null
      },
      displayCode: emergency ? `${category.code}-${emergencyCode}` : category.code,
      clinicalNote: "تصنيف ASA هو تقدير سريري للحالة الجسدية ولا ينبغي تحديده آلياً اعتماداً على عامل واحد."
    };
  }

  // =========================================================================
  // 3. RCRI INPUT VALIDATION & CALCULATION
  // =========================================================================

  static validateRCRIInputs(params = {}) {
    const errors = [];
    let creatinine = this.toNumber(params.creatinineMgDl);
    let renallyImpaired = this.toBoolean(params.renallyImpaired);

    // Validate creatinine numeric value if provided
    if (params.creatinineMgDl !== undefined && params.creatinineMgDl !== null && params.creatinineMgDl !== "") {
      if (!Number.isFinite(creatinine) || creatinine < 0) {
        errors.push("قيمة كرياتينين المصل يجب أن تكون رقماً غير سالب بوحدة mg/dL.");
      } else if (creatinine > 2.0) {
        renallyImpaired = true;
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      cleanValues: {
        highRiskSurgery: this.toBoolean(params.highRiskSurgery),
        ischemicHeartDisease: this.toBoolean(params.ischemicHeartDisease),
        congestiveHeartFailure: this.toBoolean(params.congestiveHeartFailure),
        cerebrovascularDisease: this.toBoolean(params.cerebrovascularDisease),
        insulinDiabetes: this.toBoolean(params.insulinDiabetes),
        renallyImpaired,
        creatinineMgDl: Number.isFinite(creatinine) ? creatinine : null
      }
    };
  }

  static calculateRCRI(params = {}) {
    const validation = this.validateRCRIInputs(params);

    if (!validation.isValid) {
      return {
        success: false,
        errors: validation.errors
      };
    }

    const values = validation.cleanValues;
    const factors = preOpRiskData.rcri.factors;

    let score = 0;
    const positiveFactors = [];
    const factorResults = [];

    const factorKeys = [
      { key: "highRiskSurgery", id: "highRiskSurgery" },
      { key: "ischemicHeartDisease", id: "ischemicHeartDisease" },
      { key: "congestiveHeartFailure", id: "congestiveHeartFailure" },
      { key: "cerebrovascularDisease", id: "cerebrovascularDisease" },
      { key: "insulinDiabetes", id: "insulinDiabetes" },
      { key: "renallyImpaired", id: "renallyImpaired" }
    ];

    factorKeys.forEach(({ key, id }) => {
      const factorDef = factors.find(f => f.id === id);
      const isPositive = values[key];

      if (isPositive) {
        score += factorDef.points;
        positiveFactors.push(id);
      }

      factorResults.push({
        id,
        label: factorDef.label,
        positive: isPositive,
        points: isPositive ? factorDef.points : 0
      });
    });

    const classification = this.getRCRICategory(score);

    if (!classification) {
      return {
        success: false,
        errors: ["تعذر تحديد فئة RCRI من بيانات المرجع."]
      };
    }

    let clinicalLevel = "low";
    if (score === 2) {
      clinicalLevel = "moderate";
    } else if (score >= 3) {
      clinicalLevel = "high";
    }

    const clinicalMessage = preOpRiskData.clinicalConsiderations.cardiovascular[clinicalLevel];

    return {
      success: true,
      score,
      maximumScore: factors.length,
      classLabel: classification.classLabel,
      riskTier: classification.riskTier,
      maceRatePercent: classification.maceRatePercent,
      positiveFactorCount: positiveFactors.length,
      positiveFactors,
      factorResults,
      clinicalLevel,
      clinicalConsideration: clinicalMessage,
      inputs: values,
      reference: preOpRiskData.rcri.reference,
      rateInterpretation: preOpRiskData.rcri.note
    };
  }

  // =========================================================================
  // 4. ARISCAT INPUT VALIDATION & CALCULATION
  // =========================================================================

  static validateARISCATInputs(params = {}) {
    const errors = [];

    const age = this.toNumber(params.ageYears);
    const spo2 = this.toNumber(params.spo2Percent);
    const hemoglobin = this.toNumber(params.hemoglobinGdl);
    const duration = this.toNumber(params.surgeryDurationHours);

    if (!Number.isFinite(age) || age < 0) {
      errors.push("العمر يجب أن يكون رقماً غير سالب بالسنوات.");
    }

    if (!Number.isFinite(spo2) || spo2 < 0 || spo2 > 100) {
      errors.push("SpO₂ يجب أن تكون بين 0% و100%.");
    }

    if (!Number.isFinite(hemoglobin) || hemoglobin < 0) {
      errors.push("الهيموغلوبين يجب أن يكون رقماً غير سالب بوحدة g/dL.");
    }

    if (!Number.isFinite(duration) || duration <= 0) {
      errors.push("مدة الجراحة يجب أن تكون رقماً أكبر من صفر ساعة.");
    }

    const validIncisions = preOpRiskData.ariscat.factors.incisionOptions;
    const incision = params.incisionType;

    if (!incision || !Array.isArray(validIncisions) || !validIncisions.some(opt => opt.value === incision)) {
      errors.push("نوع الشق الجراحي غير صالح أو غير محدد.");
    }

    return {
      isValid: errors.length === 0,
      errors,
      cleanValues: {
        ageYears: age,
        spo2Percent: spo2,
        hemoglobinGdl: hemoglobin,
        surgeryDurationHours: duration,
        incisionType: incision,
        respiratoryInfection: this.toBoolean(params.respiratoryInfection),
        emergencyProcedure: this.toBoolean(params.emergencyProcedure)
      }
    };
  }

  static calculateARISCAT(params = {}) {
    const validation = this.validateARISCATInputs(params);

    if (!validation.isValid) {
      return {
        success: false,
        errors: validation.errors
      };
    }

    const values = validation.cleanValues;
    const data = preOpRiskData.ariscat;
    const factors = data.factors;

    let score = 0;
    const factorResults = [];

    // Age
    let ageOption = factors.ageOptions.find(opt => opt.value === (values.ageYears <= 50 ? 0 : values.ageYears <= 80 ? 1 : 2));
    score += ageOption.points;
    factorResults.push({ factor: "age", label: ageOption.label, points: ageOption.points, value: values.ageYears });

    // SpO2
    let spo2Option = factors.spo2Options.find(opt => opt.value === (values.spo2Percent >= 96 ? 0 : values.spo2Percent >= 91 ? 1 : 2));
    score += spo2Option.points;
    factorResults.push({ factor: "spo2", label: spo2Option.label, points: spo2Option.points, value: values.spo2Percent, condition: "Room Air" });

    // Respiratory Infection
    const respFactor = factors.respiratoryInfection;
    const hasRespInf = values.respiratoryInfection;
    if (hasRespInf) score += respFactor.points;
    factorResults.push({ factor: respFactor.id, label: respFactor.label, points: hasRespInf ? respFactor.points : 0, positive: hasRespInf });

    // Preop Anemia (Hb <= 10 g/dL)
    const anemiaFactor = factors.preopAnemia;
    const hasAnemia = values.hemoglobinGdl <= 10;
    if (hasAnemia) score += anemiaFactor.points;
    factorResults.push({ factor: anemiaFactor.id, label: anemiaFactor.label, points: hasAnemia ? anemiaFactor.points : 0, positive: hasAnemia, hemoglobinGdl: values.hemoglobinGdl });

    // Incision Type
    const incisionOption = factors.incisionOptions.find(opt => opt.value === values.incisionType);
    if (!incisionOption) {
      return { success: false, errors: ["نوع الشق الجراحي غير موجود في بيانات ARISCAT."] };
    }
    score += incisionOption.points;
    factorResults.push({ factor: "incisionType", label: incisionOption.label, points: incisionOption.points, value: incisionOption.value });

    // Surgery Duration
    const durationKey = values.surgeryDurationHours <= 2 ? "lte_2h" : values.surgeryDurationHours <= 3 ? "gt_2_3h" : "gt_3h";
    const durationOption = factors.durationOptions.find(opt => opt.value === durationKey);
    if (!durationOption) {
      return { success: false, errors: ["مدة الجراحة لا يمكن تصنيفها وفق بيانات ARISCAT."] };
    }
    score += durationOption.points;
    factorResults.push({ factor: "surgeryDuration", label: durationOption.label, points: durationOption.points, value: values.surgeryDurationHours });

    // Emergency Procedure
    const emergencyFactor = factors.emergencyProcedure;
    const isEmerg = values.emergencyProcedure;
    if (isEmerg) score += emergencyFactor.points;
    factorResults.push({ factor: emergencyFactor.id, label: emergencyFactor.label, points: isEmerg ? emergencyFactor.points : 0, positive: isEmerg });

    // Classification
    const tier = this.getARISCATTier(score);
    if (!tier) {
      return { success: false, errors: ["تعذر تحديد فئة ARISCAT من بيانات المرجع."] };
    }

    let clinicalLevel = tier.id === "intermediate" ? "intermediate" : tier.id === "high" ? "high" : "low";
    const clinicalMessage = preOpRiskData.clinicalConsiderations.pulmonary[clinicalLevel];

    return {
      success: true,
      score,
      maximumScore: 123,
      tierId: tier.id,
      tierLabel: tier.tierLabel,
      ppcRatePercent: tier.ppcRatePercent,
      clinicalLevel,
      clinicalConsideration: clinicalMessage,
      factorResults,
      inputs: values,
      reference: data.reference
    };
  }

  // =========================================================================
  // 5. FULL PREOPERATIVE ASSESSMENT
  // =========================================================================

  static processFullAssessment(params = {}) {
    const errors = [];
    const warnings = [];

    const asaResult = this.calculateASA(params.asaClass, params.emergencyProcedure);
    if (!asaResult.success) errors.push(asaResult.error);

    const rcriResult = this.calculateRCRI({
      highRiskSurgery: params.highRiskSurgery,
      ischemicHeartDisease: params.ischemicHeartDisease,
      congestiveHeartFailure: params.congestiveHeartFailure,
      cerebrovascularDisease: params.cerebrovascularDisease,
      insulinDiabetes: params.insulinDiabetes,
      renallyImpaired: params.renallyImpaired,
      creatinineMgDl: params.creatinineMgDl
    });
    if (!rcriResult.success) errors.push(...rcriResult.errors);

    const ariscatResult = this.calculateARISCAT({
      ageYears: params.ageYears,
      spo2Percent: params.spo2Percent,
      respiratoryInfection: params.respiratoryInfection,
      hemoglobinGdl: params.hemoglobinGdl,
      incisionType: params.incisionType,
      surgeryDurationHours: params.surgeryDurationHours,
      emergencyProcedure: params.emergencyProcedure
    });
    if (!ariscatResult.success) errors.push(...ariscatResult.errors);

    if (errors.length > 0) {
      return { success: false, errors };
    }

    if (params.emergencyProcedure) {
      warnings.push(preOpRiskData.clinicalConsiderations.emergencyNotice);
    }

    return {
      success: true,
      assessmentType: "Preoperative Risk Assessment",
      asa: asaResult,
      cardiovascular: rcriResult,
      pulmonary: ariscatResult,
      warnings,
      clinicalNotice: preOpRiskData.meta.clinicalNotice,
      disclaimer: preOpRiskData.meta.disclaimer
    };
  }

  // =========================================================================
  // 6. SAFE SUMMARY FOR UI
  // =========================================================================

  static getSummary(assessment) {
    if (!assessment || assessment.success !== true) {
      return {
        success: false,
        errors: assessment?.errors || ["لا توجد نتيجة تقييم صالحة."]
      };
    }

    return {
      success: true,
      asa: {
        code: assessment.asa.displayCode
      },
      cardiovascular: {
        score: assessment.cardiovascular.score,
        classLabel: assessment.cardiovascular.classLabel,
        riskTier: assessment.cardiovascular.riskTier,
        maceRatePercent: assessment.cardiovascular.maceRatePercent
      },
      pulmonary: {
        score: assessment.pulmonary.score,
        tierLabel: assessment.pulmonary.tierLabel,
        ppcRatePercent: assessment.pulmonary.ppcRatePercent
      },
      warnings: assessment.warnings || []
    };
  }
}

export default PreOpRiskCalculator;
