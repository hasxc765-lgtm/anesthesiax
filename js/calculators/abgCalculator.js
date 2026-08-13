/**
 * Arterial Blood Gas (ABG) & Electrolytes Calculator Engine
 *
 * AnesthesiaX — Phase 9.0
 * File: js/calculators/abgCalculator.js
 *
 * Pure Logic Module.
 * Strictly decoupled from DOM, UI, window, and State.
 * Consumes abgData.js constants and executes safe, validated ABG, Anion Gap, P/F Ratio, and Electrolyte calculations.
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
      // 1. Sanitize Numerical Inputs
      const ph = this._parseNum(inputs.ph);
      const paco2 = this._parseNum(inputs.paco2);
      const hco3 = this._parseNum(inputs.hco3);
      const pao2 = this._parseNum(inputs.pao2);
      const rawFiO2 = this._parseNum(inputs.fio2);
      const na = this._parseNum(inputs.na);
      const k = this._parseNum(inputs.k);
      const cl = this._parseNum(inputs.cl);
      const albumin = this._parseNum(inputs.albumin);
      const glucose = this._parseNum(inputs.glucose);
      const calcium = this._parseNum(inputs.calcium);
      const age = this._parseNum(inputs.age, 45);
      const weight = this._parseNum(inputs.weight, 70);
      const gender = inputs.gender === "female" ? "female" : "male";

      // 2. Primary Acid-Base Analysis
      const acidBaseResult = this._evaluateAcidBase(ph, paco2, hco3);

      // 3. Anion Gap & Delta Ratio Calculation
      const anionGapResult = this._evaluateAnionGap(na, cl, hco3, albumin, acidBaseResult.isMetabolicAcidosis);

      // 4. Oxygenation & P/F Ratio Evaluation
      const oxygenationResult = this._evaluateOxygenation(pao2, rawFiO2);

      // 5. Corrected Sodium & Free Water Deficit Evaluation
      const sodiumResult = this._evaluateSodium(na, glucose, age, weight, gender);

      // 6. Corrected Calcium Evaluation
      const calciumResult = this._evaluateCalcium(calcium, albumin);

      // 7. Potassium Alert Evaluation
      const potassiumAlert = this._evaluatePotassium(k);

      return {
        success: true,
        acidBase: acidBaseResult,
        anionGap: anionGapResult,
        oxygenation: oxygenationResult,
        sodium: sodiumResult,
        calcium: calciumResult,
        potassiumAlert: potassiumAlert,
        meta: {
          reference: abgData.meta.reference,
          disclaimer: abgData.meta.disclaimer
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error?.message || "Unknown error during ABG calculation",
        meta: { disclaimer: abgData.meta.disclaimer }
      };
    }
  }

  /**
   * Evaluates Acid-Base Disorder, Winter's Formula, and Secondary Respiratory Responses
   */
  static _evaluateAcidBase(ph, paco2, hco3) {
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

    let primaryDisorder = "Normal Acid-Base Pattern";
    let isAcidemia = ph < phRange.min;
    let isAlkalemia = ph > phRange.max;
    let isMetabolicAcidosis = false;

    if (isAcidemia) {
      if (paco2 > paco2Range.max && hco3 < hco3Range.min) {
        primaryDisorder = "Mixed Metabolic and Respiratory Acidosis";
        isMetabolicAcidosis = true;
      } else if (paco2 > paco2Range.max) {
        primaryDisorder = "Respiratory Acidosis";
      } else if (hco3 < hco3Range.min) {
        primaryDisorder = "Metabolic Acidosis";
        isMetabolicAcidosis = true;
      } else {
        primaryDisorder = "Acidemia (Unclassified Pattern)";
      }
    } else if (isAlkalemia) {
      if (paco2 < paco2Range.min && hco3 > hco3Range.max) {
        primaryDisorder = "Mixed Metabolic and Respiratory Alkalosis";
      } else if (paco2 < paco2Range.min) {
        primaryDisorder = "Respiratory Alkalosis";
      } else if (hco3 > hco3Range.max) {
        primaryDisorder = "Metabolic Alkalosis";
      } else {
        primaryDisorder = "Alkalemia (Unclassified Pattern)";
      }
    } else {
      if (paco2 > paco2Range.max || hco3 < hco3Range.min) {
        primaryDisorder = "Normal pH with Compensated or Mixed Pattern (Evaluate Clinical Timeline)";
        if (hco3 < hco3Range.min) isMetabolicAcidosis = true;
      }
    }

    // Winter's Formula applied STRICTLY for Metabolic Acidosis
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
        compensationStatus = "Adequately Compensated Respiratory Response (استجابة تنفسية ملائمة وفق معادلة Winter).";
      } else if (paco2 > expectedPaCO2Max) {
        compensationStatus = "Co-existing Respiratory Acidosis (Inadequate Compensation) (احتمال وجود حموضة تنفسية مرافقة).";
      } else if (paco2 < expectedPaCO2Min) {
        compensationStatus = "Co-existing Respiratory Alkalosis (انخفاض إضافي في PaCO₂ يشير لقلوية تنفسية مرافقة).";
      }
    }

    return {
      ph,
      paco2,
      hco3,
      primaryDisorder,
      isMetabolicAcidosis,
      wintersFormula,
      compensationStatus
    };
  }

  /**
   * Evaluates Standard Anion Gap, Albumin-Corrected Anion Gap, and Delta Ratio
   */
  static _evaluateAnionGap(na, cl, hco3, albumin, isMetabolicAcidosis) {
    if (na === null || cl === null || hco3 === null) {
      return { calculated: false, message: "يتطلب حساب الفجوة الشاردية توفر Na⁺ و Cl⁻ و HCO₃⁻." };
    }

    const { normalAnionGap, normalHco3, normalAlbumin, anionGapAlbuminCoefficient } = abgData.clinicalConstants;

    const standardAG = parseFloat((na - (cl + hco3)).toFixed(1));
    let correctedAG = standardAG;
    let isAlbuminCorrected = false;

    if (albumin !== null && albumin > 0) {
      correctedAG = parseFloat((standardAG + anionGapAlbuminCoefficient * (normalAlbumin - albumin)).toFixed(1));
      isAlbuminCorrected = true;
    }

    const effectiveAG = isAlbuminCorrected ? correctedAG : standardAG;
    const isHagma = effectiveAG > normalAnionGap;

    // Delta Ratio calculated STRICTLY if HAGMA is present
    let deltaRatioResult = null;
    if (isHagma) {
      const deltaAG = effectiveAG - normalAnionGap;
      const deltaHCO3 = normalHco3 - hco3;

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
      correctedAG: isAlbuminCorrected ? correctedAG : standardAG,
      effectiveAG,
      isAlbuminCorrected,
      isHagma,
      deltaRatio: deltaRatioResult
    };
  }

  /**
   * Evaluates Oxygenation and P/F Ratio with Strict FiO2 Validation
   */
  static _evaluateOxygenation(pao2, rawFiO2) {
    if (pao2 === null) {
      return { calculated: false, message: "يتطلب حساب نسبة الأكسجة توفر PaO₂." };
    }

    // Require explicit FiO2 input
    if (rawFiO2 === null || rawFiO2 === undefined) {
      return {
        calculated: false,
        message: "أدخل نسبة FiO₂ (بين 21% و 100% أو 0.21 و 1.0) لحساب P/F Ratio."
      };
    }

    const { fio2MinDecimal, fio2MaxDecimal, fio2MinPercent, fio2MaxPercent } = abgData.clinicalConstants;
    let fio2Decimal = rawFiO2;

    // Convert percentage if provided
    if (rawFiO2 >= fio2MinPercent && rawFiO2 <= fio2MaxPercent) {
      fio2Decimal = rawFiO2 / 100.0;
    }

    // Strict Guard Range Validation
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
   * Evaluates Corrected Sodium (Katz & Hillier) and Estimated Free Water Deficit
   */
  static _evaluateSodium(na, glucose, age, weight, gender) {
    if (na === null) {
      return { calculated: false, message: "لم يتم إدخال الصوديوم." };
    }

    const { glucoseBaseline, katzCoefficientPerHundred, hillierCoefficientPerHundred, sodiumReference } = abgData.clinicalConstants;

    let katzCorrectedNa = null;
    let hillierCorrectedNa = null;

    if (glucose !== null && glucose > glucoseBaseline) {
      const excessGlucoseHundred = (glucose - glucoseBaseline) / 100.0;
      katzCorrectedNa = parseFloat((na + katzCoefficientPerHundred * excessGlucoseHundred).toFixed(1));
      hillierCorrectedNa = parseFloat((na + hillierCoefficientPerHundred * excessGlucoseHundred).toFixed(1));
    }

    // Free Water Deficit Estimate if Na > 145
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
   * Evaluates Albumin-Corrected Calcium (Payne Formula Estimate)
   */
  static _evaluateCalcium(calcium, albumin) {
    if (calcium === null) {
      return { calculated: false, message: "لم يتم إدخال الكالسيوم الكلي." };
    }

    const { normalAlbumin, calciumAlbuminCoefficient } = abgData.clinicalConstants;

    let correctedCalcium = calcium;
    if (albumin !== null && albumin > 0) {
      correctedCalcium = parseFloat((calcium + calciumAlbuminCoefficient * (normalAlbumin - albumin)).toFixed(1));
    }

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
   * Helper to parse and sanitize numerical values cleanly
   */
  static _parseNum(val, fallback = null) {
    if (val === null || val === undefined || val === "") return fallback;
    const parsed = parseFloat(val);
    return isNaN(parsed) ? fallback : parsed;
  }
}
