/**
 * Arterial Blood Gas (ABG) & Electrolytes Calculator Engine
 *
 * AnesthesiaX — Phase 9.0 (Audited Edition)
 * File: js/calculators/abgCalculator.js
 *
 * Pure Logic Module.
 * Strictly decoupled from DOM, UI, window, and State.
 * Implements Acute vs Chronic Respiratory Compensation, Winter's Margin, Unit Conversions, and Smart Defaults.
 */

import { abgData } from "../data/abgData.js";

export class AbgCalculator {
  /**
   * Main calculation entry point
   * @param {Object} inputs - Clinical parameters object
   * @returns {Object} Standardized result object
   */
  static calculate(inputs = {}) {
    try {
      const defaults = abgData.smartDefaults;
      const constants = abgData.clinicalConstants;

      // 1. Sanitize & Apply Smart Defaults for Optional Lab Values
      const ph = this._parseNum(inputs.ph);
      const paco2 = this._parseNum(inputs.paco2);
      const hco3 = this._parseNum(inputs.hco3);
      const pao2 = this._parseNum(inputs.pao2);
      const rawFiO2 = this._parseNum(inputs.fio2);
      
      const na = this._parseNum(inputs.na, defaults.na);
      const k = this._parseNum(inputs.k, defaults.k);
      const cl = this._parseNum(inputs.cl, defaults.cl);
      const albumin = this._parseNum(inputs.albumin, defaults.albumin);
      const calcium = this._parseNum(inputs.calcium, defaults.calcium);
      
      const rawGlucose = this._parseNum(inputs.glucose, defaults.glucose);
      const glucoseUnit = inputs.glucoseUnit === "mmol/L" ? "mmol/L" : "mg/dL";
      
      const age = this._parseNum(inputs.age, defaults.age);
      const weight = this._parseNum(inputs.weight, defaults.weight);
      const gender = inputs.gender === "female" ? "female" : "male";
      const timeline = inputs.respiratoryTimeline === "chronic" ? "chronic" : "acute";

      // 2. Validate Physiological Boundary Inputs
      const validationError = this._validateInputs(ph, paco2, hco3, pao2, rawFiO2, rawGlucose, glucoseUnit);
      if (validationError) {
        return {
          success: false,
          validationError: validationError,
          meta: { disclaimer: abgData.meta.disclaimer }
        };
      }

      // 3. Convert Glucose to mg/dL if provided in mmol/L
      const glucoseMgDl = glucoseUnit === "mmol/L" ? parseFloat((rawGlucose * constants.mmolToMgDlFactor).toFixed(1)) : rawGlucose;

      // 4. Primary Acid-Base Analysis with Acute/Chronic Compensation
      const acidBaseResult = this._evaluateAcidBase(ph, paco2, hco3, timeline);

      // 5. Anion Gap & Delta Ratio Calculation
      const anionGapResult = this._evaluateAnionGap(na, cl, hco3, albumin, acidBaseResult.isMetabolicAcidosis);

      // 6. Oxygenation & P/F Ratio Evaluation
      const oxygenationResult = this._evaluateOxygenation(pao2, rawFiO2);

      // 7. Corrected Sodium & Free Water Deficit Evaluation
      const sodiumResult = this._evaluateSodium(na, glucoseMgDl, age, weight, gender);

      // 8. Corrected Calcium Evaluation
      const calciumResult = this._evaluateCalcium(calcium, albumin);

      // 9. Potassium Alert Evaluation
      const potassiumAlert = this._evaluatePotassium(k);

      // 10. Generate ICU Progress Note Text Summary
      const icuNote = this._generateIcuNote({
        ph, paco2, hco3, pao2, rawFiO2, oxygenationResult,
        acidBaseResult, anionGapResult, sodiumResult, calciumResult, potassiumAlert,
        na, k, cl, albumin, glucoseMgDl, timeline
      });

      return {
        success: true,
        acidBase: acidBaseResult,
        anionGap: anionGapResult,
        oxygenation: oxygenationResult,
        sodium: sodiumResult,
        calcium: calciumResult,
        potassiumAlert: potassiumAlert,
        icuNote: icuNote,
        meta: {
          reference: abgData.meta.reference,
          disclaimer: abgData.meta.disclaimer
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error?.message || "حدث خطأ غير متوقع أثناء الحساب",
        meta: { disclaimer: abgData.meta.disclaimer }
      };
    }
  }

  /**
   * Validates physiological boundaries for safety
   */
  static _validateInputs(ph, paco2, hco3, pao2, rawFiO2, rawGlucose, glucoseUnit) {
    const ranges = abgData.validRanges;

    if (ph !== null && (ph < ranges.ph.min || ph > ranges.ph.max)) {
      return `قيمة pH غير فسيولوجية (${ph}). يرجى إدخال قيمة بين ${ranges.ph.min} و ${ranges.ph.max}.`;
    }
    if (paco2 !== null && (paco2 < ranges.paco2.min || paco2 > ranges.paco2.max)) {
      return `قيمة PaCO₂ غير فسيولوجية (${paco2} mmHg). يرجى إدخال قيمة بين ${ranges.paco2.min} و ${ranges.paco2.max}.`;
    }
    if (hco3 !== null && (hco3 < ranges.hco3.min || hco3 > ranges.hco3.max)) {
      return `قيمة HCO₃⁻ غير فسيولوجية (${hco3} mEq/L). يرجى إدخال قيمة بين ${ranges.hco3.min} و ${ranges.hco3.max}.`;
    }
    if (pao2 !== null && (pao2 < ranges.pao2.min || pao2 > ranges.pao2.max)) {
      return `قيمة PaO₂ غير فسيولوجية (${pao2} mmHg). يرجى إدخال قيمة بين ${ranges.pao2.min} و ${ranges.pao2.max}.`;
    }

    if (rawGlucose !== null) {
      if (glucoseUnit === "mmol/L" && (rawGlucose < ranges.glucoseMmol.min || rawGlucose > ranges.glucoseMmol.max)) {
        return `قيمة السكر غير فسيولوجية (${rawGlucose} mmol/L).`;
      } else if (glucoseUnit === "mg/dL" && (rawGlucose < ranges.glucoseMgDl.min || rawGlucose > ranges.glucoseMgDl.max)) {
        return `قيمة السكر غير فسيولوجية (${rawGlucose} mg/dL).`;
      }
    }

    return null;
  }

  /**
   * Evaluates Primary Acid-Base, Acute vs Chronic Respiratory Compensation, & Winter's Margin
   */
  static _evaluateAcidBase(ph, paco2, hco3, timeline) {
    if (ph === null || paco2 === null || hco3 === null) {
      return {
        status: "Incomplete Inputs",
        primaryDisorder: "غير محدد (يتطلب مدخلات مكتملة)",
        isMetabolicAcidosis: false,
        wintersFormula: null,
        compensationStatus: "تتطلب الحالة إدخال قيم pH و PaCO₂ و HCO₃⁻."
      };
    }

    const { ph: phRange, paco2: paco2Range, hco3: hco3Range } = abgData.normalRanges;
    const constants = abgData.clinicalConstants;

    let primaryDisorder = "Normal Acid-Base Pattern";
    let isAcidemia = ph < phRange.min;
    let isAlkalemia = ph > phRange.max;
    let isMetabolicAcidosis = false;
    let isRespiratoryAcidosis = false;
    let isRespiratoryAlkalosis = false;

    if (isAcidemia) {
      if (paco2 > paco2Range.max && hco3 < hco3Range.min) {
        primaryDisorder = "Mixed Metabolic and Respiratory Acidosis";
        isMetabolicAcidosis = true;
        isRespiratoryAcidosis = true;
      } else if (paco2 > paco2Range.max) {
        primaryDisorder = timeline === "chronic" ? "Chronic Respiratory Acidosis" : "Acute Respiratory Acidosis";
        isRespiratoryAcidosis = true;
      } else if (hco3 < hco3Range.min) {
        primaryDisorder = "Metabolic Acidosis";
        isMetabolicAcidosis = true;
      } else {
        primaryDisorder = "Acidemia (Unclassified Pattern)";
      }
    } else if (isAlkalemia) {
      if (paco2 < paco2Range.min && hco3 > hco3Range.max) {
        primaryDisorder = "Mixed Metabolic and Respiratory Alkalosis";
        isRespiratoryAlkalosis = true;
      } else if (paco2 < paco2Range.min) {
        primaryDisorder = timeline === "chronic" ? "Chronic Respiratory Alkalosis" : "Acute Respiratory Alkalosis";
        isRespiratoryAlkalosis = true;
      } else if (hco3 > hco3Range.max) {
        primaryDisorder = "Metabolic Alkalosis";
      } else {
        primaryDisorder = "Alkalemia (Unclassified Pattern)";
      }
    } else {
      if (paco2 > paco2Range.max || hco3 < hco3Range.min) {
        primaryDisorder = "Fully Compensated Acid-Base Disturbance / Mixed Pattern";
        if (hco3 < hco3Range.min) isMetabolicAcidosis = true;
        if (paco2 > paco2Range.max) isRespiratoryAcidosis = true;
      }
    }

    // 1. Winter's Formula applied STRICTLY for Metabolic Acidosis
    let wintersFormula = null;
    let compensationStatus = "لا توجد استجابة تعويضية خاصة حاسمة مبيّنة.";

    if (isMetabolicAcidosis) {
      const expectedPaCO2Base = 1.5 * hco3 + 8;
      const expectedPaCO2Min = parseFloat((expectedPaCO2Base - 2).toFixed(1));
      const expectedPaCO2Max = parseFloat((expectedPaCO2Base + 2).toFixed(1));

      wintersFormula = {
        expectedPaCO2Base: parseFloat(expectedPaCO2Base.toFixed(1)),
        min: expectedPaCO2Min,
        max: expectedPaCO2Max,
        formulaText: `Expected PaCO₂ = 1.5 × ${hco3} + 8 ± 2 = ${expectedPaCO2Min} - ${expectedPaCO2Max} mmHg`
      };

      if (paco2 >= expectedPaCO2Min && paco2 <= expectedPaCO2Max) {
        compensationStatus = "Adequately Compensated Respiratory Response (استجابة تنفسية تعويضية ملائمة ضمن هامش ±2 مع معادلة Winter).";
      } else if (paco2 > expectedPaCO2Max) {
        compensationStatus = "Co-existing Respiratory Acidosis (Inadequate Compensation) (PaCO₂ أعلى من المتوقع يشير لحُماض تنفسي مرافق).";
      } else if (paco2 < expectedPaCO2Min) {
        compensationStatus = "Co-existing Respiratory Alkalosis (PaCO₂ أقل من المتوقع يشير لقلوية تنفسية مرافقة).";
      }
    }

    // 2. Acute vs Chronic Respiratory Acidosis Compensation
    if (isRespiratoryAcidosis && !isMetabolicAcidosis) {
      const deltaPaCO2 = paco2 - constants.normalPaCO2;
      let expectedHCO3Base = 24.0;

      if (timeline === "chronic") {
        expectedHCO3Base = 24.0 + (deltaPaCO2 / 10.0) * 3.5; // 3.5 - 4 mEq/L per 10 mmHg
      } else {
        expectedHCO3Base = 24.0 + (deltaPaCO2 / 10.0) * 1.0; // 1 mEq/L per 10 mmHg
      }

      const expectedHCO3Min = parseFloat((expectedHCO3Base - 2).toFixed(1));
      const expectedHCO3Max = parseFloat((expectedHCO3Base + 2).toFixed(1));

      if (hco3 >= expectedHCO3Min && hco3 <= expectedHCO3Max) {
        compensationStatus = `Appropriate Renal Compensation for ${timeline.toUpperCase()} Respiratory Acidosis (HCO₃⁻ متوقع: ${expectedHCO3Min} - ${expectedHCO3Max} mEq/L).`;
      } else if (hco3 < expectedHCO3Min) {
        compensationStatus = `Inadequate Renal Compensation or Co-existing Metabolic Acidosis (HCO₃⁻ أقل من المتوقع).`;
      } else {
        compensationStatus = `Co-existing Metabolic Alkalosis (HCO₃⁻ أعلى من التعويض المتوقع).`;
      }
    }

    return {
      ph,
      paco2,
      hco3,
      timeline,
      primaryDisorder,
      isMetabolicAcidosis,
      wintersFormula,
      compensationStatus
    };
  }

  /**
   * Evaluates Anion Gap, Albumin Correction, & Gracefully handles Division by Zero in Delta Ratio
   */
  static _evaluateAnionGap(na, cl, hco3, albumin, isMetabolicAcidosis) {
    if (na === null || cl === null || hco3 === null) {
      return { calculated: false, message: "يتطلب حساب الفجوة الشاردية توفر Na⁺ و Cl⁻ و HCO₃⁻." };
    }

    const { normalAnionGap, normalHco3, normalAlbumin, anionGapAlbuminCoefficient } = abgData.clinicalConstants;

    const standardAG = parseFloat((na - (cl + hco3)).toFixed(1));
    const effectiveAlbumin = albumin !== null && albumin > 0 ? albumin : normalAlbumin;
    const correctedAG = parseFloat((standardAG + anionGapAlbuminCoefficient * (normalAlbumin - effectiveAlbumin)).toFixed(1));
    const isAlbuminCorrected = effectiveAlbumin !== normalAlbumin;

    const effectiveAGValue = isAlbuminCorrected ? correctedAG : standardAG;
    const isHagma = effectiveAGValue > normalAnionGap;

    // Delta Ratio calculated if HAGMA is present (Handles Division by Zero smoothly)
    let deltaRatioResult = null;
    if (isHagma) {
      const deltaAG = effectiveAGValue - normalAnionGap;
      const deltaHCO3 = normalHco3 - hco3;

      // Division by Zero or negative Delta HCO3 handling
      if (deltaHCO3 <= 0) {
        deltaRatioResult = {
          ratio: "> 2.0",
          deltaAG: parseFloat(deltaAG.toFixed(1)),
          deltaHCO3: parseFloat(deltaHCO3.toFixed(1)),
          interpretation: "Ratio > 2.0: Suggests HAGMA with co-existing metabolic alkalosis or elevated baseline HCO₃⁻."
        };
      } else {
        const ratio = parseFloat((deltaAG / deltaHCO3).toFixed(2));
        let interpretation = "";

        if (ratio < 0.4) {
          interpretation = "Ratio < 0.4: Suggests predominant NAGMA (Hyperchloremic Normal Anion Gap Acidosis).";
        } else if (ratio >= 0.4 && ratio < 0.8) {
          interpretation = "Ratio 0.4 - 0.8: Suggests mixed HAGMA and NAGMA.";
        } else if (ratio >= 0.8 && ratio <= 2.0) {
          interpretation = "Ratio 0.8 - 2.0: Suggests predominantly HAGMA.";
        } else {
          interpretation = "Ratio > 2.0: Suggests HAGMA with co-existing metabolic alkalosis or elevated baseline HCO₃⁻.";
        }

        deltaRatioResult = {
          ratio,
          deltaAG: parseFloat(deltaAG.toFixed(1)),
          deltaHCO3: parseFloat(deltaHCO3.toFixed(1)),
          interpretation
        };
      }
    }

    return {
      calculated: true,
      standardAG,
      correctedAG,
      effectiveAG: effectiveAGValue,
      isAlbuminCorrected,
      isHagma,
      deltaRatio: deltaRatioResult
    };
  }

  /**
   * Evaluates Oxygenation and P/F Ratio
   */
  static _evaluateOxygenation(pao2, rawFiO2) {
    if (pao2 === null) {
      return { calculated: false, message: "يتطلب حساب نسبة الأكسجة توفر PaO₂." };
    }

    if (rawFiO2 === null || rawFiO2 === undefined || rawFiO2 === "") {
      return {
        calculated: false,
        message: "أدخل نسبة FiO₂ (بين 21% و 100% أو 0.21 و 1.0) لحساب P/F Ratio."
      };
    }

    const { fio2MinDecimal, fio2MaxDecimal, fio2MinPercent, fio2MaxPercent } = abgData.clinicalConstants;
    let fio2Decimal = rawFiO2;

    if (rawFiO2 >= fio2MinPercent && rawFiO2 <= fio2MaxPercent) {
      fio2Decimal = rawFiO2 / 100.0;
    }

    if (fio2Decimal < fio2MinDecimal || fio2Decimal > fio2MaxDecimal) {
      return {
        calculated: false,
        message: "قيمة FiO₂ غير صالحة. يرجى إدخال نسبة بين 0.21 و 1.00 (أو 21% و 100%)."
      };
    }

    const pfRatio = parseFloat((pao2 / fio2Decimal).toFixed(1));
    let severityLabel = "Normal Oxygenation (P/F Ratio > 300)";

    if (pfRatio <= 100) {
      severityLabel = "Severe Hypoxemia (Compatible with Severe ARDS criteria if PEEP/CPAP ≥ 5 cmH₂O)";
    } else if (pfRatio <= 200) {
      severityLabel = "Moderate Hypoxemia (Compatible with Moderate ARDS criteria if PEEP/CPAP ≥ 5 cmH₂O)";
    } else if (pfRatio <= 300) {
      severityLabel = "Mild Hypoxemia (Compatible with Mild ARDS criteria if PEEP/CPAP ≥ 5 cmH₂O)";
    }

    return {
      calculated: true,
      pao2,
      fio2Percent: parseFloat((fio2Decimal * 100).toFixed(0)),
      pfRatio,
      severityLabel,
      clinicalNotice: abgData.clinicalAlerts.ards.pfNotice
    };
  }

  /**
   * Evaluates Corrected Sodium and Free Water Deficit
   */
  static _evaluateSodium(na, glucoseMgDl, age, weight, gender) {
    if (na === null) {
      return { calculated: false, message: "لم يتم إدخال الصوديوم." };
    }

    const { glucoseBaselineMgDl, katzCoefficientPerHundred, hillierCoefficientPerHundred, sodiumReference } = abgData.clinicalConstants;

    let katzCorrectedNa = na;
    let hillierCorrectedNa = na;

    if (glucoseMgDl > glucoseBaselineMgDl) {
      const excessGlucoseHundred = (glucoseMgDl - glucoseBaselineMgDl) / 100.0;
      katzCorrectedNa = parseFloat((na + katzCoefficientPerHundred * excessGlucoseHundred).toFixed(1));
      hillierCorrectedNa = parseFloat((na + hillierCoefficientPerHundred * excessGlucoseHundred).toFixed(1));
    }

    let freeWaterDeficitLiters = null;
    if (na > 145) {
      let tbwFactor = abgData.tbwFactors.maleYoung;
      if (gender === "female") {
        tbwFactor = age >= 65 ? abgData.tbwFactors.femaleElderly : abgData.tbwFactors.femaleYoung;
      } else {
        tbwFactor = age >= 65 ? abgData.tbwFactors.maleElderly : abgData.tbwFactors.maleYoung;
      }

      const tbw = weight * tbwFactor;
      freeWaterDeficitLiters = parseFloat((tbw * ((na / sodiumReference) - 1.0)).toFixed(1));
    }

    return {
      calculated: true,
      measuredNa: na,
      katzCorrectedNa,
      hillierCorrectedNa,
      freeWaterDeficitLiters,
      rateNotice: freeWaterDeficitLiters !== null ? abgData.clinicalAlerts.freeWater.rateNotice : null
    };
  }

  /**
   * Evaluates Albumin-Corrected Calcium
   */
  static _evaluateCalcium(calcium, albumin) {
    if (calcium === null) {
      return { calculated: false, message: "لم يتم إدخال الكالسيوم الكلي." };
    }

    const { normalAlbumin, calciumAlbuminCoefficient } = abgData.clinicalConstants;
    const effectiveAlbumin = albumin !== null && albumin > 0 ? albumin : normalAlbumin;
    const correctedCalcium = parseFloat((calcium + calciumAlbuminCoefficient * (normalAlbumin - effectiveAlbumin)).toFixed(1));

    return {
      calculated: true,
      measuredCalcium: calcium,
      correctedCalcium: correctedCalcium,
      hypoNotice: abgData.clinicalAlerts.calcium.hypoNotice
    };
  }

  /**
   * Evaluates Potassium Clinical Alerts
   */
  static _evaluatePotassium(k) {
    if (k === null) return null;

    if (k < 2.5) {
      return { level: "severeHypo", alertText: abgData.clinicalAlerts.potassium.severeHypo };
    } else if (k >= 2.5 && k < 3.5) {
      return { level: "mildHypo", alertText: abgData.clinicalAlerts.potassium.mildHypo };
    } else if (k > 5.0 && k <= 6.0) {
      return { level: "mildHyper", alertText: abgData.clinicalAlerts.potassium.mildHyper };
    } else if (k > 6.0) {
      return { level: "severeHyper", alertText: abgData.clinicalAlerts.potassium.severeHyper };
    }
    return { level: "normal", alertText: abgData.clinicalAlerts.potassium.normal };
  }

  /**
   * Formats a clean ICU Progress Note Summary string for one-click copying
   */
  static _generateIcuNote(data) {
    const lines = [];
    lines.push(`--- ICU ABG & ELECTROLYTES SUMMARY ---`);
    lines.push(`• Primary ABG: pH ${data.ph || '—'} | PaCO2 ${data.paco2 || '—'} mmHg | HCO3 ${data.hco3 || '—'} mEq/L`);
    lines.push(`• Diagnosis: ${data.acidBaseResult?.primaryDisorder || 'N/A'}`);
    lines.push(`• Compensation: ${data.acidBaseResult?.compensationStatus || 'N/A'}`);
    
    if (data.oxygenationResult?.calculated) {
      lines.push(`• Oxygenation: PaO2 ${data.pao2} mmHg (FiO2 ${data.oxygenationResult.fio2Percent}%) -> P/F Ratio: ${data.oxygenationResult.pfRatio} [${data.oxygenationResult.severityLabel}]`);
    }

    if (data.anionGapResult?.calculated) {
      lines.push(`• Anion Gap: ${data.anionGapResult.effectiveAG} mEq/L ${data.anionGapResult.isAlbuminCorrected ? '(Albumin-Corrected)' : ''}`);
      if (data.anionGapResult.deltaRatio) {
        lines.push(`• Delta Ratio: ${data.anionGapResult.deltaRatio.ratio} -> ${data.anionGapResult.deltaRatio.interpretation}`);
      }
    }

    lines.push(`• Electrolytes: Na ${data.na} | K ${data.k} | Cl ${data.cl} | Albumin ${data.albumin} g/dL | Glucose ${data.glucoseMgDl} mg/dL`);
    
    if (data.sodiumResult?.katzCorrectedNa !== data.na) {
      lines.push(`• Corrected Na (Hyperglycemia): Katz ${data.sodiumResult.katzCorrectedNa} mEq/L | Hillier ${data.sodiumResult.hillierCorrectedNa} mEq/L`);
    }
    
    if (data.calciumResult?.calculated) {
      lines.push(`• Corrected Ca (Payne): ${data.calciumResult.correctedCalcium} mg/dL`);
    }

    lines.push(`----------------------------------------`);
    return lines.join('\n');
  }

  /**
   * Helper to parse and sanitize numerical values cleanly
   */
  static _parseNum(val, fallback = null) {
    if (val === null || val === undefined || val === "") return fallback;
    const parsed = parseFloat(val);
    return isNaN(parsed) ? fallback : parsed;
  }
}
