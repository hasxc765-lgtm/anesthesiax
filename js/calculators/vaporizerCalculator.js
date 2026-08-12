/**
 * Vaporizers & MAC Calculation Engine
 *
 * AnesthesiaX — Phase 8.2
 * File: js/calculators/vaporizerCalculator.js
 *
 * Architecture:
 * Pure Calculation ES Module.
 *
 * No DOM.
 * No HTML.
 * No UI logic.
 */

import { volatileAgentsData } from "../data/volatileAgentsData.js";

export class VaporizerCalculator {
  // =========================================================================
  // INTERNAL HELPERS
  // =========================================================================

  static toNumber(value, fallback = NaN) {
    const number = Number.parseFloat(value);
    return Number.isFinite(number) ? number : fallback;
  }

  static round(value, decimals = 2) {
    if (!Number.isFinite(value)) return null;

    const factor = 10 ** decimals;

    return Math.round((value + Number.EPSILON) * factor) / factor;
  }

  static getAgent(agentId) {
    if (!agentId) return null;

    return volatileAgentsData.agents[agentId] || null;
  }

  // =========================================================================
  // 1. INPUT VALIDATION
  // =========================================================================

  static validateInputs(params = {}) {
    const errors = [];
    const warnings = [];

    const constraints = volatileAgentsData.constraints;

    const agentId = params.agentId;

    const age = this.toNumber(params.ageYears);
    const endTidal = this.toNumber(params.endTidalPercent);

    const fgf = this.toNumber(params.fgfLmin);
    const dial = this.toNumber(params.dialPercent);
    const duration = this.toNumber(params.durationHours);

    const n2o =
      params.n2oPercent === undefined ||
      params.n2oPercent === null ||
      params.n2oPercent === ""
        ? 0
        : this.toNumber(params.n2oPercent);

    // -----------------------------------------------------------------------
    // Agent
    // -----------------------------------------------------------------------

    const agent = this.getAgent(agentId);

    if (!agent) {
      errors.push("الغاز الاستنشاقي المحدد غير معروف.");
    }

    // -----------------------------------------------------------------------
    // Age
    // -----------------------------------------------------------------------

    if (
      !Number.isFinite(age) ||
      age < constraints.ageYears.minInclusive ||
      age > constraints.ageYears.maxInclusive
    ) {
      errors.push(
        `العمر يجب أن يكون رقمًا بين ${constraints.ageYears.minInclusive} و ${constraints.ageYears.maxInclusive} سنة.`
      );
    }

    // -----------------------------------------------------------------------
    // End-Tidal
    // -----------------------------------------------------------------------

    if (
      !Number.isFinite(endTidal) ||
      endTidal < constraints.endTidalPercent.minInclusive ||
      endTidal > constraints.endTidalPercent.maxInclusive
    ) {
      errors.push(
        `تركيز End-Tidal يجب أن يكون بين ${constraints.endTidalPercent.minInclusive}% و ${constraints.endTidalPercent.maxInclusive}%.`
      );
    }

    // -----------------------------------------------------------------------
    // N2O
    // -----------------------------------------------------------------------

    if (
      !Number.isFinite(n2o) ||
      n2o < constraints.n2oPercent.minInclusive ||
      n2o > constraints.n2oPercent.maxInclusive
    ) {
      errors.push(
        `تركيز N₂O يجب أن يكون بين ${constraints.n2oPercent.minInclusive}% و ${constraints.n2oPercent.maxInclusive}%.`
      );
    }

    // -----------------------------------------------------------------------
    // Consumption inputs
    // -----------------------------------------------------------------------

    if (params.checkConsumption !== false) {
      if (
        !Number.isFinite(fgf) ||
        fgf < constraints.fgfLmin.minInclusive ||
        fgf > constraints.fgfLmin.maxInclusive
      ) {
        errors.push(
          `تدفق الغاز النقي FGF يجب أن يكون بين ${constraints.fgfLmin.minInclusive} و ${constraints.fgfLmin.maxInclusive} L/min.`
        );
      }

      if (
        !Number.isFinite(dial) ||
        dial < constraints.dialPercent.minInclusive ||
        dial > constraints.dialPercent.maxInclusive
      ) {
        errors.push(
          `تركيز الـ Dial Setting يجب أن يكون بين ${constraints.dialPercent.minInclusive}% و ${constraints.dialPercent.maxInclusive}%.`
        );
      }

      if (
        !Number.isFinite(duration) ||
        duration < constraints.durationHours.minInclusive ||
        duration > constraints.durationHours.maxInclusive
      ) {
        errors.push(
          `مدة التخدير يجب أن تكون بين ${constraints.durationHours.minInclusive} و ${constraints.durationHours.maxInclusive} ساعة.`
        );
      }

      // Agent-specific vaporizer maximum.
      if (
        agent &&
        Number.isFinite(dial) &&
        dial > agent.concentrations.maxVaporizerDialPercent
      ) {
        errors.push(
          `إعداد الـ Dial للـ ${agent.name} لا يجب أن يتجاوز ${agent.concentrations.maxVaporizerDialPercent}%.`
        );
      }
    }

    // -----------------------------------------------------------------------
    // Warnings
    // -----------------------------------------------------------------------

    if (n2o > 0) {
      warnings.push(
        volatileAgentsData.nitrousOxide.calculatorPolicy.warning
      );
    }

    if (agent && agent.warnings) {
      warnings.push(...agent.warnings);
    }

    return {
      isValid: errors.length === 0,

      errors,

      warnings,

      cleanValues: {
        agentId,
        age,
        endTidal,
        fgf,
        dial,
        duration,
        n2o,
        hasOpioid: Boolean(params.hasOpioid)
      }
    };
  }

  // =========================================================================
  // 2. AGE-ADJUSTED MAC
  // =========================================================================

  static calculateAgeAdjustedMAC(agentId, ageYears) {
    const agent = this.getAgent(agentId);

    if (!agent) {
      return {
        mac: null,
        source: "unknown_agent",
        requiresClinicalReview: true,
        warning: "الغاز التخديري غير معرف."
      };
    }

    const age = this.toNumber(ageYears);

    if (!Number.isFinite(age) || age < 0) {
      return {
        mac: null,
        source: "invalid_age",
        requiresClinicalReview: true,
        warning: "العمر غير صحيح."
      };
    }

    // -----------------------------------------------------------------------
    // Pediatric reference has priority.
    // -----------------------------------------------------------------------

    if (age < agent.minimumAgeForAdultModel) {
      const pediatric = agent.pediatricMac;

      if (
        pediatric &&
        pediatric.available &&
        Array.isArray(pediatric.ageGroups)
      ) {
        const matchingGroup = pediatric.ageGroups.find(
          (group) =>
            age >= group.minAgeYearsInclusive &&
            age < group.maxAgeYearsExclusive
        );

        if (matchingGroup) {
          return {
            mac: matchingGroup.mac,

            source: "validated_pediatric_reference",

            label: matchingGroup.label,

            unit: matchingGroup.unit,

            requiresClinicalReview:
              Boolean(matchingGroup.requiresClinicalReview),

            reference: matchingGroup.reference,

            note: matchingGroup.note || pediatric.notes || null
          };
        }
      }

      return {
        mac: null,

        source: "unsupported_pediatric_range",

        requiresClinicalReview: true,

        warning:
          `لا يتوفر مرجع MAC للأطفال ضمن البيانات الحالية للغاز ${agent.name} ` +
          `في عمر ${age} سنة. لا يتم استخدام نموذج البالغين تلقائيًا.`
      };
    }

    // -----------------------------------------------------------------------
    // Adult model supported range.
    // -----------------------------------------------------------------------

    const model = volatileAgentsData.ageAdjustmentModel;

    if (
      age < model.clinicalChartAgeRange.minAgeYearsInclusive ||
      age > model.clinicalChartAgeRange.maxAgeYearsInclusive
    ) {
      return {
        mac: null,

        source: "outside_adult_model_range",

        requiresClinicalReview: true,

        warning:
          `العمر ${age} سنة خارج النطاق السريري المدعوم لنموذج العمر ` +
          `(${model.clinicalChartAgeRange.minAgeYearsInclusive}-${model.clinicalChartAgeRange.maxAgeYearsInclusive} سنة).`
      };
    }

    const mac40 = agent.macAt40;

    const coefficient = model.coefficient;

    const exponent = coefficient * (age - model.referenceAgeYears);

    const calculatedMac =
      mac40 * Math.pow(10, exponent);

    return {
      mac: this.round(calculatedMac, 2),

      source: "adult_age_adjusted_model",

      modelName: model.name,

      unit: "vol%",

      requiresClinicalReview: false,

      warning: null,

      reference: model.reference
    };
  }

  // =========================================================================
  // 3. N2O AGE-ADJUSTED MAC
  // =========================================================================

  static calculateAgeAdjustedN2OMAC(ageYears) {
    const age = this.toNumber(ageYears);

    if (!Number.isFinite(age)) {
      return {
        mac: null,
        source: "invalid_age",
        requiresClinicalReview: true
      };
    }

    const model = volatileAgentsData.ageAdjustmentModel;

    if (
      age < model.clinicalChartAgeRange.minAgeYearsInclusive ||
      age > model.clinicalChartAgeRange.maxAgeYearsInclusive
    ) {
      return {
        mac: null,
        source: "outside_age_model_range",
        requiresClinicalReview: true
      };
    }

    const mac40 = volatileAgentsData.nitrousOxide.macAt40;

    const exponent =
      model.coefficient *
      (age - model.referenceAgeYears);

    const mac =
      mac40 * Math.pow(10, exponent);

    return {
      mac: this.round(mac, 2),

      source: "age_adjusted_n2o_model",

      requiresClinicalReview: false
    };
  }

  // =========================================================================
  // 4. MAC FRACTION
  // =========================================================================

  static calculateMACFraction(endTidalPercent, macValue) {
    const endTidal = this.toNumber(endTidalPercent);
    const mac = this.toNumber(macValue);

    if (
      !Number.isFinite(endTidal) ||
      !Number.isFinite(mac) ||
      mac <= 0
    ) {
      return null;
    }

    return this.round(endTidal / mac, 2);
  }

  // =========================================================================
  // 5. N2O MAC FRACTION
  // =========================================================================

  static calculateN2OMACFraction(n2oPercent, ageYears = null) {
    const n2o = this.toNumber(n2oPercent);

    if (!Number.isFinite(n2o) || n2o <= 0) {
      return 0;
    }

    let referenceMac =
      volatileAgentsData.nitrousOxide.macAt40;

    // Use age-adjusted N2O reference when age is within the
    // supported adult model range.
    if (ageYears !== null) {
      const ageAdjusted =
        this.calculateAgeAdjustedN2OMAC(ageYears);

      if (
        Number.isFinite(ageAdjusted.mac) &&
        ageAdjusted.mac > 0
      ) {
        referenceMac = ageAdjusted.mac;
      }
    }

    return this.calculateMACFraction(
      n2o,
      referenceMac
    );
  }

  // =========================================================================
  // 6. COMBINED MAC
  // =========================================================================

  static calculateCombinedMAC(
    volatileMacFraction,
    n2oMacFraction
  ) {
    const volatileMac =
      this.toNumber(volatileMacFraction, 0);

    const n2oMac =
      this.toNumber(n2oMacFraction, 0);

    return this.round(
      Math.max(0, volatileMac) +
        Math.max(0, n2oMac),
      2
    );
  }

  // =========================================================================
  // 7. LIQUID CONSUMPTION
  // =========================================================================

  static calculateLiquidConsumption(
    agentId,
    fgfLmin,
    dialPercent
  ) {
    const agent = this.getAgent(agentId);

    if (!agent) {
      return null;
    }

    const fgf = this.toNumber(fgfLmin);

    const dial = this.toNumber(dialPercent);

    if (
      !Number.isFinite(fgf) ||
      fgf <= 0 ||
      !Number.isFinite(dial) ||
      dial <= 0
    ) {
      return 0;
    }

    const mw =
      agent.consumption.molecularWeightGperMol;

    const density =
      agent.consumption.liquidDensityGperMl;

    const conversionConstant =
      volatileAgentsData.consumptionModel.conversionConstant;

    if (
      !Number.isFinite(mw) ||
      !Number.isFinite(density) ||
      density <= 0
    ) {
      return null;
    }

    /*
     * Dion:
     *
     * mL/hr =
     * FGF(L/min) × dial(%) × MW × 60
     * --------------------------------
     * 2412 × density
     */

    const rate =
      (
        fgf *
        dial *
        mw *
        60
      ) /
      (
        conversionConstant *
        density
      );

    return this.round(rate, 2);
  }

  // =========================================================================
  // 8. TOTAL CONSUMPTION
  // =========================================================================

  static calculateTotalConsumption(
    rateMlHr,
    durationHours
  ) {
    const rate =
      this.toNumber(rateMlHr);

    const duration =
      this.toNumber(durationHours);

    if (
      !Number.isFinite(rate) ||
      rate < 0 ||
      !Number.isFinite(duration) ||
      duration <= 0
    ) {
      return 0;
    }

    return this.round(
      rate * duration,
      2
    );
  }

  // =========================================================================
  // 9. LOW FLOW SAVINGS
  // =========================================================================

  static calculateLowFlowSavings(
    agentId,
    dialPercent,
    durationHours,
    baselineFgf =
      volatileAgentsData.lowFlow.standardComparison.baselineFgfLMin,
    lowFgf =
      volatileAgentsData.lowFlow.standardComparison.lowFlowFgfLMin
  ) {
    const baselineRate =
      this.calculateLiquidConsumption(
        agentId,
        baselineFgf,
        dialPercent
      );

    const lowFlowRate =
      this.calculateLiquidConsumption(
        agentId,
        lowFgf,
        dialPercent
      );

    const baselineTotal =
      this.calculateTotalConsumption(
        baselineRate,
        durationHours
      );

    const lowFlowTotal =
      this.calculateTotalConsumption(
        lowFlowRate,
        durationHours
      );

    const savedTotal =
      Math.max(
        0,
        baselineTotal - lowFlowTotal
      );

    const savingsPercent =
      baselineTotal > 0
        ? (savedTotal / baselineTotal) * 100
        : 0;

    return {
      baselineFgfLmin: baselineFgf,

      lowFgfLmin: lowFgf,

      baselineTotalMl:
        this.round(baselineTotal, 2),

      lowFlowTotalMl:
        this.round(lowFlowTotal, 2),

      estimatedSavedMl:
        this.round(savedTotal, 2),

      estimatedSavingsPercent:
        this.round(savingsPercent, 1)
    };
  }

  // =========================================================================
  // 10. FGF CATEGORY
  // =========================================================================

  static classifyFreshGasFlow(fgfLmin) {
    const fgf = this.toNumber(fgfLmin);

    if (!Number.isFinite(fgf)) {
      return "Unknown";
    }

    const lowFlow =
      volatileAgentsData.lowFlow;

    if (
      fgf < lowFlow.thresholdLMin
    ) {
      return "Low Flow";
    }

    if (
      fgf >= lowFlow.highFlowThresholdLMin
    ) {
      return "High Flow";
    }

    return "Conventional Flow";
  }

  // =========================================================================
  // 11. MASTER ASSESSMENT
  // =========================================================================

  static processFullAssessment(params = {}) {
    const validation =
      this.validateInputs(params);

    if (!validation.isValid) {
      return {
        success: false,

        errors: validation.errors,

        warnings: validation.warnings
      };
    }

    const {
      agentId,
      age,
      endTidal,
      fgf,
      dial,
      duration,
      n2o,
      hasOpioid
    } = validation.cleanValues;

    const agent =
      this.getAgent(agentId);

    const warnings =
      [...validation.warnings];

    // -----------------------------------------------------------------------
    // MAC
    // -----------------------------------------------------------------------

    const macResult =
      this.calculateAgeAdjustedMAC(
        agentId,
        age
      );

    if (macResult.warning) {
      warnings.push(
        macResult.warning
      );
    }

    // -----------------------------------------------------------------------
    // Volatile MAC
    // -----------------------------------------------------------------------

    let volatileMacFraction = null;

    if (
      Number.isFinite(macResult.mac)
    ) {
      volatileMacFraction =
        this.calculateMACFraction(
          endTidal,
          macResult.mac
        );
    }

    // -----------------------------------------------------------------------
    // N2O MAC
    // -----------------------------------------------------------------------

    const n2oMacFraction =
      this.calculateN2OMACFraction(
        n2o,
        age
      );

    // -----------------------------------------------------------------------
    // Combined MAC
    // -----------------------------------------------------------------------

    let combinedMac = null;

    if (
      volatileMacFraction !== null ||
      n2oMacFraction > 0
    ) {
      combinedMac =
        this.calculateCombinedMAC(
          volatileMacFraction || 0,
          n2oMacFraction
        );
    }

    // -----------------------------------------------------------------------
    // Consumption
    // -----------------------------------------------------------------------

    const estimatedRateMlHr =
      this.calculateLiquidConsumption(
        agentId,
        fgf,
        dial
      );

    const estimatedTotalMl =
      this.calculateTotalConsumption(
        estimatedRateMlHr,
        duration
      );

    // -----------------------------------------------------------------------
    // Flow classification
    // -----------------------------------------------------------------------

    const fgfCategory =
      this.classifyFreshGasFlow(fgf);

    if (
      fgf < volatileAgentsData.lowFlow.thresholdLMin
    ) {
      warnings.push(
        volatileAgentsData.lowFlow.disclaimer
      );
    }

    // -----------------------------------------------------------------------
    // Standard low-flow comparison
    // -----------------------------------------------------------------------

    const lowFlowSavings =
      this.calculateLowFlowSavings(
        agentId,
        dial,
        duration
      );

    // -----------------------------------------------------------------------
    // Opioids
    // -----------------------------------------------------------------------

    if (hasOpioid) {
      warnings.push(
        volatileAgentsData.opioidInteraction
          .clinicalNotice
      );
    }

    // -----------------------------------------------------------------------
    // MAC clinical review
    // -----------------------------------------------------------------------

    if (
      macResult.requiresClinicalReview
    ) {
      warnings.push(
        "هذه النتيجة تتطلب مراجعة سريرية ولا ينبغي تفسيرها كهدف تخديري فردي."
      );
    }

    return {
      success: true,

      agentId,

      agentName: agent.name,

      arabicName: agent.arabicName,

      inputs: {
        age,
        endTidal,
        fgf,
        dial,
        duration,
        n2o,
        hasOpioid
      },

      macAssessment: {
        ageAdjustedMac:
          macResult.mac,

        macSource:
          macResult.source,

        macSourceLabel:
          macResult.label ||
          macResult.modelName ||
          macResult.source,

        volatileMacFraction,

        n2oMacFraction,

        estimatedCombinedMacFraction:
          combinedMac,

        requiresClinicalReview:
          Boolean(
            macResult.requiresClinicalReview
          ),

        reference:
          macResult.reference || null
      },

      consumptionAssessment: {
        estimatedRateMlHr,

        estimatedTotalMl,

        fgfCategory,

        lowFlowSavings
      },

      warnings: [
        ...new Set(
          warnings.filter(Boolean)
        )
      ]
    };
  }
        }
