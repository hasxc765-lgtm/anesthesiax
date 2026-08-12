/**
 * Vaporizers & MAC Calculation Engine
 * AnesthesiaX — Phase 8.0 (Step 2: Calculator Engine)
 * File: js/calculators/vaporizerCalculator.js
 * 
 * Architecture: Pure Calculation ES Module.
 * Strictly decoupled from UI/DOM layers.
 * Consumes clinical standards and constraints from ../data/volatileAgentsData.js.
 */

import { volatileAgentsData } from "../data/volatileAgentsData.js";

export class VaporizerCalculator {

  // =========================================================================
  // 1. INPUT VALIDATION & BOUNDARY CHECKING
  // =========================================================================
  static validateInputs(params) {
    const errors = [];
    const warnings = [];
    const constraints = volatileAgentsData.constraints;

    const age = parseFloat(params.ageYears);
    const endTidal = parseFloat(params.endTidalPercent);
    const fgf = parseFloat(params.fgfLmin);
    const dial = parseFloat(params.dialPercent);
    const duration = parseFloat(params.durationHours);
    const n2o = parseFloat(params.n2oPercent || 0);

    // فحص العمر
    if (isNaN(age) || age < constraints.ageYears.minInclusive || age > constraints.ageYears.maxInclusive) {
      errors.push(`العمر يجب أن يكون رلماً بين ${constraints.ageYears.minInclusive} و ${constraints.ageYears.maxInclusive} سنة.`);
    }

    // فحص تركيز الـ End-Tidal (الخاص بالحساب السنخي)
    if (isNaN(endTidal) || endTidal < constraints.endTidalPercent.minInclusive || endTidal > constraints.endTidalPercent.maxInclusive) {
      errors.push(`تركيز الـ End-Tidal يجب أن يكون بين ${constraints.endTidalPercent.minInclusive}% و ${constraints.endTidalPercent.maxInclusive}%.`);
    }

    // فحص مدخلات الاستهلاك (تدفق الغاز وتركيز المخرة والمدة)
    if (params.checkConsumption) {
      if (isNaN(fgf) || fgf < constraints.fgfLmin.minInclusive || fgf > constraints.fgfLmin.maxInclusive) {
        errors.push(`تدفق الغاز النقي (FGF) يجب أن يكون بين ${constraints.fgfLmin.minInclusive} و ${constraints.fgfLmin.maxInclusive} L/min.`);
      }

      if (isNaN(dial) || dial < constraints.dialPercent.minInclusive || dial > constraints.dialPercent.maxInclusive) {
        errors.push(`تركيز المخرة (Dial Setting) يجب أن يكون بين ${constraints.dialPercent.minInclusive}% و ${constraints.dialPercent.maxInclusive}%.`);
      }

      if (isNaN(duration) || duration <= 0) {
        errors.push("مدة التخدير يجب أن تكون رقماً أكبر من 0 ساعة.");
      }
    }

    // فحص تركيز N2O وحد الأكسجين الأدنى (FiO2 >= 30% -> N2O <= 70%)
    if (!isNaN(n2o)) {
      if (n2o < constraints.n2oPercent.minInclusive || n2o > constraints.n2oPercent.maxInclusive) {
        errors.push(`تركيز N₂O يجب أن يكون بين ${constraints.n2oPercent.minInclusive}% و ${constraints.n2oPercent.maxInclusive}% لحماية المريض من نقص الأكسجين.`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      cleanValues: { age, endTidal, fgf, dial, duration, n2o }
    };
  }

  // =========================================================================
  // 2. AGE-ADJUSTED MAC ENGINE (Pediatric Priority + Adult Logarithmic Model)
  // =========================================================================
  static calculateAgeAdjustedMAC(agentId, ageYears) {
    const agent = volatileAgentsData.agents[agentId];
    if (!agent) {
      return { mac: null, source: "unknown_agent", requiresClinicalReview: true, warning: "الغاز التخديري غير معرف." };
    }

    const age = parseFloat(ageYears);
    if (isNaN(age) || age < 0) {
      return { mac: null, source: "invalid_age", requiresClinicalReview: true, warning: "العمر غير صحيح." };
    }

    // 🛡️ القاعدة السريرية الأولى: إعطاء الأولوية لجداول الأطفال الموثقة (دون سن 5 سنوات)
    if (age < agent.minimumAgeForAdultModel) {
      if (agent.pediatricMac && agent.pediatricMac.available && agent.pediatricMac.ageGroups.length > 0) {
        const matchingGroup = agent.pediatricMac.ageGroups.find(
          group => age >= group.minAgeYearsInclusive && age < group.maxAgeYearsExclusive
        );

        if (matchingGroup) {
          return {
            mac: matchingGroup.mac,
            source: "validated_pediatric_reference",
            label: matchingGroup.label,
            unit: matchingGroup.unit,
            requiresClinicalReview: matchingGroup.requiresClinicalReview || false,
            reference: matchingGroup.reference
          };
        }
      }

      // في حال عدم توفر جدول أطفال معتمد (مثل Desflurane دون سن 5 سنوات) -> يمنع تطبيق نموذج البالغين
      return {
        mac: null,
        source: "unsupported_pediatric_range",
        requiresClinicalReview: true,
        warning: `لا يتوفر جدول أطفال معتمد للغاز (${agent.name}) لهذه الفئة العمرية (${age} سنة). يمنع استخدام نموذج البالغين دون 5 سنوات.`
      };
    }

    // 🛡️ القاعدة السريرية الثانية: تطبيق نموذج Nickalls & Mapleson للبالغين (5 - 95 سنة)
    const mac40 = agent.macAt40;
    const coeff = volatileAgentsData.ageAdjustmentModel.coefficient; // -0.00269
    const exponent = coeff * (age - 40);
    const calculatedMac = mac40 * Math.pow(10, exponent);
    const roundedMac = parseFloat(calculatedMac.toFixed(2));

    const isOutsideChartRange = age > volatileAgentsData.ageAdjustmentModel.clinicalChartAgeRange.maxAgeYearsInclusive;

    return {
      mac: roundedMac,
      source: "adult_age_adjusted_model",
      modelName: volatileAgentsData.ageAdjustmentModel.name,
      unit: "vol%",
      requiresClinicalReview: isOutsideChartRange,
      warning: isOutsideChartRange ? "العمر يتجاوز نطاق التحقق السريري لنموذج البالغين (5-95 سنة)." : null
    };
  }

  // =========================================================================
  // 3. MAC FRACTIONS & COMBINED MAC
  // =========================================================================
  static calculateMACFraction(endTidalPercent, macValue) {
    const et = parseFloat(endTidalPercent);
    const mac = parseFloat(macValue);

    if (isNaN(et) || isNaN(mac) || mac <= 0) return 0;

    return parseFloat((et / mac).toFixed(2));
  }

  static calculateN2OMACFraction(n2oPercent) {
    const n2o = parseFloat(n2oPercent);
    if (isNaN(n2o) || n2o <= 0) return 0;

    const n2oMacRef = volatileAgentsData.nitrousOxide.macAt40; // 104%
    return parseFloat((n2o / n2oMacRef).toFixed(2));
  }

  static calculateCombinedMAC(volatileMacFraction, n2oMacFraction) {
    const vMac = parseFloat(volatileMacFraction) || 0;
    const nMac = parseFloat(n2oMacFraction) || 0;

    return parseFloat((vMac + nMac).toFixed(2));
  }

  // =========================================================================
  // 4. VOLATILE LIQUID CONSUMPTION ENGINE (Dion Approximation)
  // Formula: mL/hr = FGF (L/min) * Dial (%) * AgentConsumptionFactor
  // =========================================================================
  static calculateLiquidConsumption(agentId, fgfLmin, dialPercent) {
    const agent = volatileAgentsData.agents[agentId];
    if (!agent) return 0;

    const fgf = parseFloat(fgfLmin);
    const dial = parseFloat(dialPercent);

    if (isNaN(fgf) || fgf <= 0 || isNaN(dial) || dial <= 0) return 0;

    const factor = agent.consumption.approximateLiquidConsumptionFactor;
    const rateMlHr = fgf * dial * factor;

    return parseFloat(rateMlHr.toFixed(2));
  }

  static calculateTotalConsumption(rateMlHr, durationHours) {
    const rate = parseFloat(rateMlHr);
    const duration = parseFloat(durationHours);

    if (isNaN(rate) || rate <= 0 || isNaN(duration) || duration <= 0) return 0;

    return parseFloat((rate * duration).toFixed(2));
  }

  // =========================================================================
  // 5. LOW-FLOW EFFICIENCY & SAVINGS COMPARISON
  // =========================================================================
  static calculateLowFlowSavings(agentId, dialPercent, durationHours, baselineFgf = 2.0, lowFgf = 0.5) {
    const baselineRate = this.calculateLiquidConsumption(agentId, baselineFgf, dialPercent);
    const lowFlowRate = this.calculateLiquidConsumption(agentId, lowFgf, dialPercent);

    const baselineTotal = this.calculateTotalConsumption(baselineRate, durationHours);
    const lowFlowTotal = this.calculateTotalConsumption(lowFlowRate, durationHours);

    const savedTotalMl = parseFloat((baselineTotal - lowFlowTotal).toFixed(2));
    const savingsPercent = baselineTotal > 0 ? parseFloat(((savedTotalMl / baselineTotal) * 100).toFixed(1)) : 0;

    return {
      baselineFgfLmin: baselineFgf,
      lowFgfLmin: lowFgf,
      baselineTotalMl: baselineTotal,
      lowFlowTotalMl: lowFlowTotal,
      estimatedSavedMl: savedTotalMl > 0 ? savedTotalMl : 0,
      estimatedSavingsPercent: savingsPercent > 0 ? savingsPercent : 0
    };
  }

  // =========================================================================
  // 6. MASTER ASSESSMENT FUNCTION
  // =========================================================================
  static processFullAssessment(params) {
    const validation = this.validateInputs(params);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    const { age, endTidal, fgf, dial, duration, n2o } = validation.cleanValues;
    const agent = volatileAgentsData.agents[params.agentId];
    const warnings = [...validation.warnings];

    // 1. حساب الـ MAC المكيّف
    const macResult = this.calculateAgeAdjustedMAC(params.agentId, age);
    if (macResult.warning) {
      warnings.push(macResult.warning);
    }

    // 2. حساب أجزاء الـ MAC
    const volatileMacFraction = macResult.mac ? this.calculateMACFraction(endTidal, macResult.mac) : 0;
    const n2oMacFraction = this.calculateN2OMACFraction(n2o);
    const estimatedCombinedMacFraction = this.calculateCombinedMAC(volatileMacFraction, n2oMacFraction);

    // 3. حساب استهلاك السائل والتدفق المنخفض
    const estimatedRateMlHr = this.calculateLiquidConsumption(params.agentId, fgf, dial);
    const estimatedTotalMl = this.calculateTotalConsumption(estimatedRateMlHr, duration);

    // تصنيف تدفق الغاز
    let fgfCategory = "Conventional Flow";
    if (fgf >= volatileAgentsData.lowFlow.highFlowThresholdLMin) {
      fgfCategory = "High Flow";
    } else if (fgf < volatileAgentsData.lowFlow.thresholdLMin) {
      fgfCategory = "Low Flow";
      warnings.push(volatileAgentsData.lowFlow.disclaimer);
    }

    const lowFlowSavings = this.calculateLowFlowSavings(params.agentId, dial, duration, 2.0, fgf < 1.0 ? fgf : 0.5);

    // 4. تنبيه الأفيونات المساعدة
    if (params.hasOpioid) {
      warnings.push(volatileAgentsData.opioidInteraction.clinicalNotice);
    }

    return {
      success: true,
      agentName: agent.name,
      arabicName: agent.arabicName,
      inputs: { age, endTidal, fgf, dial, duration, n2o, hasOpioid: params.hasOpioid || false },
      macAssessment: {
        ageAdjustedMac: macResult.mac,
        macSource: macResult.source,
        macSourceLabel: macResult.label || macResult.modelName || "N/A",
        volatileMacFraction,
        n2oMacFraction,
        estimatedCombinedMacFraction,
        requiresClinicalReview: macResult.requiresClinicalReview
      },
      consumptionAssessment: {
        estimatedRateMlHr,
        estimatedTotalMl,
        fgfCategory,
        lowFlowSavings
      },
      warnings
    };
  }
}
