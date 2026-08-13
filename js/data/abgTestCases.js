/**
 * ABG & Electrolytes Clinical Test Cases
 *
 * AnesthesiaX — Phase 9.0
 * File: js/data/abgTestCases.js
 *
 * Comprehensive Clinical Test Scenarios for Engine Verification & Boundary Auditing.
 */

export const abgTestCases = [
  {
    id: "hagma_pure",
    title: "حالة 1: حموضة استقلابية نقية ذات فجوة شاردية مرتفعة (Pure HAGMA)",
    inputs: { ph: 7.20, paco2: 25, hco3: 10, na: 140, cl: 100, albumin: 4.0 },
    expected: {
      primaryDisorder: "Metabolic Acidosis",
      anionGap: 30,
      isHagma: true,
      wintersTargetPaCO2Min: 21,
      wintersTargetPaCO2Max: 25,
      compensationStatus: "Adequately Compensated Respiratory Response (استجابة تنفسية ملائمة وفق معادلة Winter).",
      hasDeltaRatio: true,
      deltaRatioCategory: "Ratio 0.8 - 2.0: Suggests predominantly HAGMA."
    }
  },
  {
    id: "hagma_mixed_resp_acidosis",
    title: "حالة 2: حموضة استقلابية مرتفعة الفجوة مع حموضة تنفسية مرافقة (HAGMA + Mixed Respiratory Acidosis)",
    inputs: { ph: 7.12, paco2: 38, hco3: 10, na: 140, cl: 100, albumin: 4.0 },
    expected: {
      primaryDisorder: "Metabolic Acidosis",
      anionGap: 30,
      isHagma: true,
      wintersTargetPaCO2Min: 21,
      wintersTargetPaCO2Max: 25,
      compensationStatus: "Co-existing Respiratory Acidosis (Inadequate Compensation) (احتمال وجود حموضة تنفسية مرافقة).",
      hasDeltaRatio: true
    }
  },
  {
    id: "hagma_plus_metabolic_alkalosis",
    title: "حالة 3: حموضة استقلابية مرتفعة الفجوة مع قلوية استقلابية مرافقة (HAGMA + Metabolic Alkalosis)",
    inputs: { ph: 7.38, paco2: 40, hco3: 26, na: 145, cl: 95, albumin: 4.0 },
    expected: {
      anionGap: 24, // 145 - (95 + 26) = 24 (HAGMA present)
      isHagma: true,
      deltaHCO3: -2, // 24 - 26 = -2 (<= 0)
      deltaRatioInterpretation: "Ratio > 2.0: Suggests HAGMA with co-existing metabolic alkalosis or elevated baseline HCO₃⁻."
    }
  },
  {
    id: "resp_acidosis_acute",
    title: "حالة 4: حموضة تنفسية حادة (Acute Respiratory Acidosis)",
    inputs: { ph: 7.22, paco2: 65, hco3: 25, na: 138, cl: 102, albumin: 4.0 },
    expected: {
      primaryDisorder: "Respiratory Acidosis",
      isHagma: false,
      hasDeltaRatio: false
    }
  },
  {
    id: "hyperglycemia_hyponatremia",
    title: "حالة 5: هبوط الصوديوم التقديري بسبب ارتفاع السكر (Hyperglycemic Hyponatremia)",
    inputs: { na: 128, glucose: 600 },
    expected: {
      measuredNa: 128,
      katzCorrectedNa: 136,   // 128 + 1.6 * 5 = 136
      hillierCorrectedNa: 140 // 128 + 2.4 * 5 = 140
    }
  },
  {
    id: "calcium_normal_albumin",
    title: "حالة 6: تصحيح الكالسيوم والفجوة الشاردية عند ألبومين طبيعي (4.0 g/dL)",
    inputs: { calcium: 9.0, albumin: 4.0, na: 140, cl: 100, hco3: 24 },
    expected: {
      measuredCalcium: 9.0,
      correctedCalcium: 9.0,
      correctedAG: 16.0 // Should return 16.0 instead of null
    }
  }
];
