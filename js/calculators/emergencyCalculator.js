/**
 * Emergency & Resuscitation Protocols Calculator Engine
 *
 * AnesthesiaX — Phase 10.0 (Clinical Engine v10.0.0)
 * File: js/calculators/emergencyCalculator.js
 *
 * Pure Logic ES Module.
 * Strictly decoupled from DOM, UI, window, and State.
 * Consumes emergencyData.js and executes safe, validated Emergency Drug Calculations,
 * Unit Normalizations, and State Machine Transition Evaluations.
 */

import { emergencyData } from "../data/emergencyData.js";

export class EmergencyCalculator {

  // =========================================================================
  // 1. INPUT SANITIZATION & BOUNDARY VALIDATION
  // =========================================================================

  /**
   * Validates weight inputs against safety boundaries
   * @param {number|string} weightVal
   * @returns {Object} Validation status and warning flags
   */
  static validateWeight(weightVal) {
    const parsed = this._parseNum(weightVal);
    const rules = emergencyData.unitValidation.weightKg;

    if (parsed === null || parsed < rules.min) {
      return {
        isValid: false,
        errorCode: "WEIGHT_BELOW_MIN",
        errorMessage: "الوزن المدخل غير صالح. يجب إدخال وزن 1 kg على الأقل."
      };
    }

    if (parsed > rules.max) {
      return {
        isValid: false,
        errorCode: "WEIGHT_ABOVE_MAX",
        errorMessage: "الوزن المدخل أعلى من الحد المسموح (300 kg)."
      };
    }

    const hasWarning = parsed < rules.dangerousMin || parsed > rules.dangerousMax;
    let warningMessage = null;
    if (parsed < rules.dangerousMin) {
      warningMessage = "تنبيه: الوزن المدخل خفيف جداً أقل من 3 kg. يرجى التأكد من الجرعة.";
    } else if (parsed > rules.dangerousMax) {
      warningMessage = "تنبيه: الوزن المدخل أثقل من النطاق المعتاد (200 kg). يرجى التأكد من الحسابات السريرية.";
    }

    return {
      isValid: true,
      weightKg: parsed,
      hasWarning,
      warningMessage
    };
  }

  /**
   * Validates FiO2 boundaries
   */
  static validateFiO2(fio2Val) {
    const parsed = this._parseNum(fio2Val);
    const rules = emergencyData.unitValidation.fio2;

    if (parsed === null) {
      return { isValid: false, errorCode: "FIO2_REQUIRED" };
    }

    let decimalVal = parsed;
    if (parsed >= rules.minPercent && parsed <= rules.maxPercent) {
      decimalVal = parsed / 100.0;
    }

    if (decimalVal < rules.minDecimal) {
      return { isValid: false, errorCode: "FIO2_BELOW_MIN" };
    }
    if (decimalVal > rules.maxDecimal) {
      return { isValid: false, errorCode: "FIO2_ABOVE_MAX" };
    }

    return { isValid: true, fio2Decimal: decimalVal, fio2Percent: decimalVal * 100 };
  }

  /**
   * Validates EtCO2 boundaries
   */
  static validateEtCO2(etco2Val) {
    const parsed = this._parseNum(etco2Val);
    const rules = emergencyData.unitValidation.etco2;

    if (parsed === null) return { isValid: false, errorCode: "ETCO2_REQUIRED" };
    if (parsed > rules.maxMmHg) return { isValid: false, errorCode: "ETCO2_ABOVE_MAX" };

    const isNormal = parsed >= rules.normalMin && parsed <= rules.normalMax;
    return { isValid: true, etco2: parsed, isNormal };
  }

  /**
   * Validates Temperature boundaries and cooling thresholds
   */
  static validateTemperature(tempVal) {
    const parsed = this._parseNum(tempVal);
    const rules = emergencyData.unitValidation.tempCelsius;

    if (parsed === null) return { isValid: false, errorCode: "TEMP_REQUIRED" };
    if (parsed < rules.min) return { isValid: false, errorCode: "TEMP_BELOW_MIN" };
    if (parsed > rules.max) return { isValid: false, errorCode: "TEMP_ABOVE_MAX" };

    const isNormal = parsed >= rules.normalMin && parsed <= rules.normalMax;
    const coolingRequired = parsed >= rules.mhCoolingStartThreshold;
    const coolingStopReached = parsed <= rules.mhCoolingStopThreshold;

    return {
      isValid: true,
      tempCelsius: parsed,
      isNormal,
      coolingRequired,
      coolingStopReached
    };
  }

  // =========================================================================
  // 2. PROTOCOL SPECIFIC DOSING ENGINE
  // =========================================================================

  /**
   * Calculates Dantrolene dosing and vial requirements
   */
  static calculateDantrolene(weightKg, formulationKey) {
    const weightValidation = this.validateWeight(weightKg);
    if (!weightValidation.isValid) return weightValidation;

    if (!formulationKey || formulationKey === "") {
      return { isValid: false, errorCode: "FORMULATION_REQUIRED" };
    }

    const formulation = emergencyData.formulations.dantrolene[formulationKey];
    if (!formulation) {
      return { isValid: false, errorCode: "INVALID_FORMULATION" };
    }

    const rule = emergencyData.drugDosingRules.dantrolene_mh;
    const weight = weightValidation.weightKg;

    const calculatedDoseMg = parseFloat((weight * rule.dosePerKg).toFixed(1));
    const vialCount = Math.ceil(calculatedDoseMg / formulation.vialSizeMg);
    const diluentVolumeMl = vialCount * formulation.vialDiluentMl;
    const reEvaluationThresholdMg = parseFloat((weight * rule.reEvaluationThresholdMgKg).toFixed(1));

    return {
      isValid: true,
      hasWarning: weightValidation.hasWarning,
      warningMessage: weightValidation.warningMessage,
      weightKg: weight,
      formulationResolved: formulation.id,
      formulationName: formulation.name,
      calculatedDoseMg,
      vialCount,
      vialSizeMg: formulation.vialSizeMg,
      vialDiluentMl: formulation.vialDiluentMl,
      diluentVolumeMl,
      reconstitutedConcMgMl: formulation.reconstitutedConcMgMl,
      reEvaluationThresholdMg,
      instructions: formulation.instructions
    };
  }

  /**
   * Calculates 20% Lipid Emulsion Rescue dosing for LAST
   */
  static calculateLipidRescue(weightKg) {
    const weightValidation = this.validateWeight(weightKg);
    if (!weightValidation.isValid) return weightValidation;

    const weight = weightValidation.weightKg;
    const rule = emergencyData.drugDosingRules.lipid_emulsion_20;

    const bolusVolumeMl = parseFloat((weight * rule.bolusMlKg).toFixed(1));
    const initialInfusionRateMlMin = parseFloat((weight * rule.infusionMlKgMin).toFixed(2));
    const doubleInfusionRateMlMin = parseFloat((weight * rule.doubleInfusionMlKgMin).toFixed(2));
    const maxCumulativeVolumeMl = parseFloat((weight * rule.maxCumulativeMlKg).toFixed(1));

    return {
      isValid: true,
      hasWarning: weightValidation.hasWarning,
      warningMessage: weightValidation.warningMessage,
      weightKg: weight,
      bolusVolumeMl,
      initialInfusionRateMlMin,
      doubleInfusionRateMlMin,
      maxCumulativeVolumeMl,
      notes: rule.notes
    };
  }

  /**
   * Calculates Epinephrine dosing for Perioperative Anaphylaxis
   */
  static calculateAnaphylaxis(inputs = {}) {
    const weightValidation = this.validateWeight(inputs.weightKg);
    if (!weightValidation.isValid) return weightValidation;

    const weight = weightValidation.weightKg;
    const hasIvAccess = inputs.hasIvAccess !== false;

    if (hasIvAccess) {
      const rule = emergencyData.drugDosingRules.epinephrine_anaphylaxis_iv;
      return {
        isValid: true,
        recommendedRoute: "IV Titrated",
        recommendedDoseMcg: rule.initialDoseMcg,
        dilutionRecommendation: "10 mcg/mL",
        repeatIntervalText: "Titrate 20-50 mcg every 1-2 minutes according to response",
        crystalloidBolusMl: "500-1000 mL",
        notes: rule.notes
      };
    } else {
      const rule = emergencyData.drugDosingRules.epinephrine_anaphylaxis_im;
      const rawMcg = weight * rule.dosePerKgMcg;
      const isCapped = rawMcg > rule.maxDoseMcg;
      const calculatedDoseMcg = isCapped ? rule.maxDoseMcg : parseFloat(rawMcg.toFixed(1));

      return {
        isValid: true,
        recommendedRoute: "IM (Mid-Outer Thigh)",
        calculatedDoseMcg,
        isCapped,
        notes: rule.notes
      };
    }
  }

  /**
   * Calculates Succinylcholine dosing for Laryngospasm
   */
  static calculateLaryngospasm(weightKg) {
    const weightValidation = this.validateWeight(weightKg);
    if (!weightValidation.isValid) return weightValidation;

    const weight = weightValidation.weightKg;
    const rule = emergencyData.drugDosingRules.succinylcholine_laryngospasm;

    const ivSuccinylcholineDoseMg = parseFloat((weight * rule.ivDoseMgKg).toFixed(1));
    const imSuccinylcholineDoseMg = parseFloat((weight * rule.imDoseMgKg).toFixed(1));
    const pediatricAtropineNoteExpected = weight < 25.0;

    return {
      isValid: true,
      weightKg: weight,
      ivSuccinylcholineDoseMg,
      imSuccinylcholineDoseMg,
      pediatricAtropineNoteExpected,
      notes: rule.notes
    };
  }

  // =========================================================================
  // 3. STATE MACHINE EVALUATOR & TRANSITION VALIDATOR
  // =========================================================================

  /**
   * Evaluates state machine transition validity
   */
  static validateStateTransition(protocolId, currentStateId, branchTargetId) {
    const protocol = emergencyData.protocols[protocolId];
    if (!protocol) {
      return { isValid: false, errorCode: "INVALID_PROTOCOL_ID" };
    }

    // Handles initial state check if currentStateId is missing
    if (!currentStateId) {
      return {
        isValid: true,
        initialState: protocol.initialState
      };
    }

    const stateObj = protocol.states[currentStateId];
    if (!stateObj) {
      return { isValid: false, errorCode: "INVALID_CURRENT_STATE" };
    }

    // Handles terminal state validation check
    if (branchTargetId === undefined || branchTargetId === null) {
      return {
        isValid: true,
        terminal: stateObj.terminal === true,
        isEmergencyCico: stateObj.isEmergencyCico === true
      };
    }

    const validBranches = Array.isArray(stateObj.branches) ? stateObj.branches : [];
    const isTargetAllowed = validBranches.some(b => b.targetState === branchTargetId);

    if (!isTargetAllowed) {
      return { isValid: false, errorCode: "INVALID_STATE_TRANSITION" };
    }

    const nextStateObj = protocol.states[branchTargetId];

    return {
      isValid: true,
      nextState: branchTargetId,
      terminal: nextStateObj?.terminal === true,
      emergencyCico: nextStateObj?.isEmergencyCico === true
    };
  }

  // =========================================================================
  // 4. HELPER METHOD
  // =========================================================================

  static _parseNum(val, fallback = null) {
    if (val === null || val === undefined || val === "") return fallback;
    const parsed = parseFloat(val);
    return isNaN(parsed) ? fallback : parsed;
  }
}
