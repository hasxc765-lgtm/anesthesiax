/**
 * Emergency & Resuscitation Protocols Test Cases
 *
 * AnesthesiaX — Phase 10.0
 * File: js/data/emergencyTestCases.js
 *
 * Comprehensive Clinical & Boundary Validation Suite for Emergency Engine.
 *
 * Validates:
 * - Weight validation and safety warnings
 * - FiO2 normalization and boundaries
 * - EtCO2 validation
 * - Temperature validation and MH cooling thresholds
 * - Dantrolene dose / vial / diluent calculations
 * - 20% Lipid Emulsion rescue calculations
 * - Perioperative anaphylaxis epinephrine pathways
 * - Succinylcholine dosing for laryngospasm
 * - Protocol state-machine transitions
 * - Terminal-state behavior
 * - Invalid protocol / state / transition handling
 *
 * Architecture:
 * Pure Data ES Module.
 * No DOM / UI / State dependencies.
 *
 * IMPORTANT:
 * These expected values intentionally match the current
 * EmergencyCalculator contract and emergencyData source of truth.
 */

export const emergencyTestCases = [

  // =========================================================================
  // 1. WEIGHT VALIDATION
  // =========================================================================

  {
    id: "weight_standard_adult",
    testType: "weightValidation",
    title: "حالة 1: وزن بالغ قياسي 70 kg",
    inputs: {
      weightKg: 70
    },
    expected: {
      isValid: true,
      weightKg: 70,
      hasWarning: false,
      warningMessage: null
    }
  },

  {
    id: "weight_low_pediatric_warning",
    testType: "weightValidation",
    title: "حالة 2: وزن منخفض 2 kg مع تحذير سريري",
    inputs: {
      weightKg: 2
    },
    expected: {
      isValid: true,
      weightKg: 2,
      hasWarning: true,
      warningMessage:
        "تنبيه: الوزن المدخل خفيف جداً أقل من 3 kg. يرجى التأكد من الجرعة."
    }
  },

  {
    id: "weight_high_warning",
    testType: "weightValidation",
    title: "حالة 3: وزن 220 kg مع تحذير سريري",
    inputs: {
      weightKg: 220
    },
    expected: {
      isValid: true,
      weightKg: 220,
      hasWarning: true,
      warningMessage:
        "تنبيه: الوزن المدخل أثقل من النطاق المعتاد (200 kg). يرجى التأكد من الحسابات السريرية."
    }
  },

  {
    id: "weight_zero_invalid",
    testType: "weightValidation",
    title: "حالة 4: إدخال وزن صفر",
    inputs: {
      weightKg: 0
    },
    expected: {
      isValid: false,
      errorCode: "WEIGHT_BELOW_MIN",
      errorMessage:
        "الوزن المدخل غير صالح. يجب إدخال وزن 1 kg على الأقل."
    }
  },

  {
    id: "weight_negative_invalid",
    testType: "weightValidation",
    title: "حالة 5: إدخال وزن بالسالب",
    inputs: {
      weightKg: -70
    },
    expected: {
      isValid: false,
      errorCode: "WEIGHT_BELOW_MIN",
      errorMessage:
        "الوزن المدخل غير صالح. يجب إدخال وزن 1 kg على الأقل."
    }
  },

  {
    id: "weight_above_max_invalid",
    testType: "weightValidation",
    title: "حالة 6: وزن أعلى من الحد الأقصى 300 kg",
    inputs: {
      weightKg: 301
    },
    expected: {
      isValid: false,
      errorCode: "WEIGHT_ABOVE_MAX",
      errorMessage:
        "الوزن المدخل أعلى من الحد المسموح (300 kg)."
    }
  },

  {
    id: "weight_invalid_string",
    testType: "weightValidation",
    title: "حالة 7: إدخال وزن غير رقمي",
    inputs: {
      weightKg: "abc"
    },
    expected: {
      isValid: false,
      errorCode: "WEIGHT_BELOW_MIN",
      errorMessage:
        "الوزن المدخل غير صالح. يجب إدخال وزن 1 kg على الأقل."
    }
  },

  // =========================================================================
  // 2. MALIGNANT HYPERTHERMIA - DANTROLENE
  // =========================================================================

  {
    id: "mh_dantrolene_standard_adult_dantrium",
    protocolId: "mh",
    testType: "dantrolene",
    title:
      "حالة 8: MH - بالغ 70 kg باستخدام Dantrium التقليدي",
    inputs: {
      weightKg: 70,
      formulation: "dantrium"
    },
    expected: {
      isValid: true,
      weightKg: 70,
      formulationResolved: "dantrium",
      calculatedDoseMg: 175.0,
      vialCount: 9,
      vialSizeMg: 20.0,
      vialDiluentMl: 60.0,
      diluentVolumeMl: 540.0,
      reconstitutedConcMgMl: 0.333,
      reEvaluationThresholdMg: 700.0
    }
  },

  {
    id: "mh_dantrolene_severe_obesity_ryanodex",
    protocolId: "mh",
    testType: "dantrolene",
    title:
      "حالة 9: MH - وزن 140 kg باستخدام Ryanodex",
    inputs: {
      weightKg: 140,
      formulation: "ryanodex"
    },
    expected: {
      isValid: true,
      weightKg: 140,
      formulationResolved: "ryanodex",
      calculatedDoseMg: 350.0,
      vialCount: 2,
      vialSizeMg: 250.0,
      vialDiluentMl: 5.0,
      diluentVolumeMl: 10.0,
      reconstitutedConcMgMl: 50.0,
      reEvaluationThresholdMg: 1400.0
    }
  },

  {
    id: "mh_dantrolene_pediatric_dantrium",
    protocolId: "mh",
    testType: "dantrolene",
    title:
      "حالة 10: MH - طفل 18 kg باستخدام Dantrium",
    inputs: {
      weightKg: 18,
      formulation: "dantrium"
    },
    expected: {
      isValid: true,
      weightKg: 18,
      formulationResolved: "dantrium",
      calculatedDoseMg: 45.0,
      vialCount: 3,
      vialSizeMg: 20.0,
      vialDiluentMl: 60.0,
      diluentVolumeMl: 180.0,
      reconstitutedConcMgMl: 0.333,
      reEvaluationThresholdMg: 180.0
    }
  },

  {
    id: "mh_dantrolene_low_weight_warning",
    protocolId: "mh",
    testType: "dantrolene",
    title:
      "حالة 11: MH - وزن 2 kg مع تحذير الوزن المنخفض",
    inputs: {
      weightKg: 2,
      formulation: "dantrium"
    },
    expected: {
      isValid: true,
      weightKg: 2,
      hasWarning: true,
      calculatedDoseMg: 5.0,
      vialCount: 1,
      diluentVolumeMl: 60.0,
      reconstitutedConcMgMl: 0.333,
      reEvaluationThresholdMg: 20.0
    }
  },

  {
    id: "mh_dantrolene_missing_formulation",
    protocolId: "mh",
    testType: "dantrolene",
    title:
      "حالة 12: MH - عدم اختيار تركيبة Dantrolene",
    inputs: {
      weightKg: 70,
      formulation: ""
    },
    expected: {
      isValid: false,
      errorCode: "FORMULATION_REQUIRED"
    }
  },

  {
    id: "mh_dantrolene_invalid_formulation",
    protocolId: "mh",
    testType: "dantrolene",
    title:
      "حالة 13: MH - تركيبة Dantrolene غير معروفة",
    inputs: {
      weightKg: 70,
      formulation: "unknown_formulation"
    },
    expected: {
      isValid: false,
      errorCode: "INVALID_FORMULATION"
    }
  },

  // =========================================================================
  // 3. LAST - 20% LIPID EMULSION
  // =========================================================================

  {
    id: "last_lipid_standard_adult",
    protocolId: "last",
    testType: "lipidRescue",
    title:
      "حالة 14: LAST - بالغ 70 kg",
    inputs: {
      weightKg: 70
    },
    expected: {
      isValid: true,
      weightKg: 70,
      bolusVolumeMl: 105.0,
      initialInfusionRateMlMin: 17.5,
      doubleInfusionRateMlMin: 35.0,
      maxCumulativeVolumeMl: 840.0
    }
  },

  {
    id: "last_lipid_low_weight",
    protocolId: "last",
    testType: "lipidRescue",
    title:
      "حالة 15: LAST - مريض 45 kg",
    inputs: {
      weightKg: 45
    },
    expected: {
      isValid: true,
      weightKg: 45,
      bolusVolumeMl: 67.5,
      initialInfusionRateMlMin: 11.25,
      doubleInfusionRateMlMin: 22.5,
      maxCumulativeVolumeMl: 540.0
    }
  },

  {
    id: "last_lipid_pediatric_warning",
    protocolId: "last",
    testType: "lipidRescue",
    title:
      "حالة 16: LAST - وزن 2 kg مع تحذير الوزن",
    inputs: {
      weightKg: 2
    },
    expected: {
      isValid: true,
      weightKg: 2,
      hasWarning: true,
      bolusVolumeMl: 3.0,
      initialInfusionRateMlMin: 0.5,
      doubleInfusionRateMlMin: 1.0,
      maxCumulativeVolumeMl: 24.0
    }
  },

  {
    id: "last_lipid_invalid_weight",
    protocolId: "last",
    testType: "lipidRescue",
    title:
      "حالة 17: LAST - وزن غير صالح",
    inputs: {
      weightKg: 0
    },
    expected: {
      isValid: false,
      errorCode: "WEIGHT_BELOW_MIN"
    }
  },

  // =========================================================================
  // 4. PERIOPERATIVE ANAPHYLAXIS
  // =========================================================================

  {
    id: "anaphylaxis_perioperative_iv_adult",
    protocolId: "anaphylaxis",
    testType: "anaphylaxis",
    title:
      "حالة 18: Anaphylaxis - بالغ مع IV access ودوران تلقائي",
    inputs: {
      weightKg: 70,
      hasIvAccess: true,
      hasSpontaneousCirculation: true
    },
    expected: {
      isValid: true,
      recommendedRoute: "IV Titrated",
      recommendedDoseMcg: 50.0,
      dilutionRecommendation: "10 mcg/mL",
      repeatIntervalText:
        "Titrate 20-50 mcg every 1-2 minutes according to response",
      crystalloidBolusMl: "500-1000 mL"
    }
  },

  {
    id: "anaphylaxis_iv_default_access",
    protocolId: "anaphylaxis",
    testType: "anaphylaxis",
    title:
      "حالة 19: Anaphylaxis - عدم تحديد IV access ويُفترض توفره",
    inputs: {
      weightKg: 70
    },
    expected: {
      isValid: true,
      recommendedRoute: "IV Titrated",
      recommendedDoseMcg: 50.0,
      dilutionRecommendation: "10 mcg/mL",
      crystalloidBolusMl: "500-1000 mL"
    }
  },

  {
    id: "anaphylaxis_im_fallback",
    protocolId: "anaphylaxis",
    testType: "anaphylaxis",
    title:
      "حالة 20: Anaphylaxis - عدم توفر IV access مع جرعة IM",
    inputs: {
      weightKg: 80,
      hasIvAccess: false,
      hasSpontaneousCirculation: true
    },
    expected: {
      isValid: true,
      recommendedRoute: "IM (Mid-Outer Thigh)",
      calculatedDoseMcg: 500.0,
      isCapped: true
    }
  },

  {
    id: "anaphylaxis_im_weight_30",
    protocolId: "anaphylaxis",
    testType: "anaphylaxis",
    title:
      "حالة 21: Anaphylaxis - جرعة IM لمريض 30 kg",
    inputs: {
      weightKg: 30,
      hasIvAccess: false,
      hasSpontaneousCirculation: true
    },
    expected: {
      isValid: true,
      recommendedRoute: "IM (Mid-Outer Thigh)",
      calculatedDoseMcg: 300.0,
      isCapped: false
    }
  },

  {
    id: "anaphylaxis_im_exact_cap",
    protocolId: "anaphylaxis",
    testType: "anaphylaxis",
    title:
      "حالة 22: Anaphylaxis - وزن 50 kg يساوي حد 500 mcg تماماً",
    inputs: {
      weightKg: 50,
      hasIvAccess: false,
      hasSpontaneousCirculation: true
    },
    expected: {
      isValid: true,
      recommendedRoute: "IM (Mid-Outer Thigh)",
      calculatedDoseMcg: 500.0,
      isCapped: false
    }
  },

  // =========================================================================
  // 5. LARYNGOSPASM / SUCCINYLCHOLINE
  // =========================================================================

  {
    id: "laryngospasm_standard_adult",
    protocolId: "laryngospasm",
    testType: "laryngospasm",
    title:
      "حالة 23: Laryngospasm - بالغ 60 kg",
    inputs: {
      weightKg: 60
    },
    expected: {
      isValid: true,
      weightKg: 60,
      ivSuccinylcholineDoseMg: 60.0,
      imSuccinylcholineDoseMg: 240.0,
      pediatricAtropineNoteExpected: false
    }
  },

  {
    id: "laryngospasm_pediatric",
    protocolId: "laryngospasm",
    testType: "laryngospasm",
    title:
      "حالة 24: Laryngospasm - طفل 20 kg",
    inputs: {
      weightKg: 20
    },
    expected: {
      isValid: true,
      weightKg: 20,
      ivSuccinylcholineDoseMg: 20.0,
      imSuccinylcholineDoseMg: 80.0,
      pediatricAtropineNoteExpected: true
    }
  },

  {
    id: "laryngospasm_atropine_boundary",
    protocolId: "laryngospasm",
    testType: "laryngospasm",
    title:
      "حالة 25: Laryngospasm - وزن 25 kg عند حد Pediatric Atropine",
    inputs: {
      weightKg: 25
    },
    expected: {
      isValid: true,
      weightKg: 25,
      ivSuccinylcholineDoseMg: 25.0,
      imSuccinylcholineDoseMg: 100.0,
      pediatricAtropineNoteExpected: false
    }
  },

  // =========================================================================
  // 6. FiO2 VALIDATION
  // =========================================================================

  {
    id: "fio2_decimal_room_air",
    testType: "fio2Validation",
    title:
      "حالة 26: FiO2 بصيغة عشرية 0.21",
    inputs: {
      fio2: 0.21
    },
    expected: {
      isValid: true,
      fio2Decimal: 0.21,
      fio2Percent: 21
    }
  },

  {
    id: "fio2_decimal_100",
    testType: "fio2Validation",
    title:
      "حالة 27: FiO2 بصيغة عشرية 1.0",
    inputs: {
      fio2: 1.0
    },
    expected: {
      isValid: true,
      fio2Decimal: 1.0,
      fio2Percent: 100
    }
  },

  {
    id: "fio2_percent_21",
    testType: "fio2Validation",
    title:
      "حالة 28: FiO2 بصيغة مئوية 21%",
    inputs: {
      fio2: 21
    },
    expected: {
      isValid: true,
      fio2Decimal: 0.21,
      fio2Percent: 21
    }
  },

  {
    id: "fio2_percent_100",
    testType: "fio2Validation",
    title:
      "حالة 29: FiO2 بصيغة مئوية 100%",
    inputs: {
      fio2: 100
    },
    expected: {
      isValid: true,
      fio2Decimal: 1.0,
      fio2Percent: 100
    }
  },

  {
    id: "fio2_below_min",
    testType: "fio2Validation",
    title:
      "حالة 30: FiO2 أقل من الحد الأدنى",
    inputs: {
      fio2: 0.20
    },
    expected: {
      isValid: false,
      errorCode: "FIO2_BELOW_MIN"
    }
  },

  {
    id: "fio2_above_max",
    testType: "fio2Validation",
    title:
      "حالة 31: FiO2 أعلى من الحد الأقصى",
    inputs: {
      fio2: 1.01
    },
    expected: {
      isValid: false,
      errorCode: "FIO2_ABOVE_MAX"
    }
  },

  {
    id: "fio2_missing",
    testType: "fio2Validation",
    title:
      "حالة 32: عدم إدخال FiO2",
    inputs: {
      fio2: ""
    },
    expected: {
      isValid: false,
      errorCode: "FIO2_REQUIRED"
    }
  },

  // =========================================================================
  // 7. EtCO2 VALIDATION
  // =========================================================================

  {
    id: "etco2_normal",
    testType: "etco2Validation",
    title:
      "حالة 33: EtCO2 طبيعي 40 mmHg",
    inputs: {
      etco2: 40
    },
    expected: {
      isValid: true,
      etco2: 40,
      isNormal: true
    }
  },

  {
    id: "etco2_low",
    testType: "etco2Validation",
    title:
      "حالة 34: EtCO2 منخفض 30 mmHg",
    inputs: {
      etco2: 30
    },
    expected: {
      isValid: true,
      etco2: 30,
      isNormal: false
    }
  },

  {
    id: "etco2_high",
    testType: "etco2Validation",
    title:
      "حالة 35: EtCO2 مرتفع 60 mmHg",
    inputs: {
      etco2: 60
    },
    expected: {
      isValid: true,
      etco2: 60,
      isNormal: false
    }
  },

  {
    id: "etco2_max_boundary",
    testType: "etco2Validation",
    title:
      "حالة 36: EtCO2 عند الحد الأعلى 150 mmHg",
    inputs: {
      etco2: 150
    },
    expected: {
      isValid: true,
      etco2: 150,
      isNormal: false
    }
  },

  {
    id: "etco2_above_max",
    testType: "etco2Validation",
    title:
      "حالة 37: EtCO2 أعلى من الحد المسموح",
    inputs: {
      etco2: 151
    },
    expected: {
      isValid: false,
      errorCode: "ETCO2_ABOVE_MAX"
    }
  },

  {
    id: "etco2_missing",
    testType: "etco2Validation",
    title:
      "حالة 38: عدم إدخال EtCO2",
    inputs: {
      etco2: ""
    },
    expected: {
      isValid: false,
      errorCode: "ETCO2_REQUIRED"
    }
  },

  // =========================================================================
  // 8. TEMPERATURE / MH COOLING THRESHOLDS
  // =========================================================================

  {
    id: "temperature_normal",
    testType: "temperatureValidation",
    title:
      "حالة 39: درجة حرارة طبيعية 37°C",
    inputs: {
      temperatureCelsius: 37
    },
    expected: {
      isValid: true,
      tempCelsius: 37,
      isNormal: true,
      coolingRequired: false,
      coolingStopReached: false
    }
  },

  {
    id: "temperature_cooling_start_boundary",
    testType: "temperatureValidation",
    title:
      "حالة 40: الحرارة عند حد بدء التبريد 39°C",
    inputs: {
      temperatureCelsius: 39
    },
    expected: {
      isValid: true,
      tempCelsius: 39,
      isNormal: false,
      coolingRequired: true,
      coolingStopReached: false
    }
  },

  {
    id: "temperature_above_cooling_threshold",
    testType: "temperatureValidation",
    title:
      "حالة 41: حرارة 40°C تتطلب التبريد",
    inputs: {
      temperatureCelsius: 40
    },
    expected: {
      isValid: true,
      tempCelsius: 40,
      isNormal: false,
      coolingRequired: true,
      coolingStopReached: false
    }
  },

  {
    id: "temperature_cooling_stop_boundary",
    testType: "temperatureValidation",
    title:
      "حالة 42: الحرارة عند حد إيقاف التبريد 38°C",
    inputs: {
      temperatureCelsius: 38
    },
    expected: {
      isValid: true,
      tempCelsius: 38,
      isNormal: false,
      coolingRequired: false,
      coolingStopReached: true
    }
  },

  {
    id: "temperature_below_cooling_stop",
    testType: "temperatureValidation",
    title:
      "حالة 43: حرارة 37.5°C بعد التبريد",
    inputs: {
      temperatureCelsius: 37.5
    },
    expected: {
      isValid: true,
      tempCelsius: 37.5,
      isNormal: true,
      coolingRequired: false,
      coolingStopReached: true
    }
  },

  {
    id: "temperature_below_min",
    testType: "temperatureValidation",
    title:
      "حالة 44: درجة حرارة أقل من الحد المقبول",
    inputs: {
      temperatureCelsius: 19.9
    },
    expected: {
      isValid: false,
      errorCode: "TEMP_BELOW_MIN"
    }
  },

  {
    id: "temperature_above_max",
    testType: "temperatureValidation",
    title:
      "حالة 45: درجة حرارة أعلى من الحد المقبول",
    inputs: {
      temperatureCelsius: 45.1
    },
    expected: {
      isValid: false,
      errorCode: "TEMP_ABOVE_MAX"
    }
  },

  {
    id: "temperature_missing",
    testType: "temperatureValidation",
    title:
      "حالة 46: عدم إدخال درجة الحرارة",
    inputs: {
      temperatureCelsius: ""
    },
    expected: {
      isValid: false,
      errorCode: "TEMP_REQUIRED"
    }
  },

  // =========================================================================
  // 9. STATE MACHINE - ACLS
  // =========================================================================

  {
    id: "acls_initial_state",
    protocolId: "acls",
    testType: "stateTransition",
    title:
      "حالة 47: ACLS - الحصول على الحالة الابتدائية",
    inputs: {
      currentStateId: null
    },
    expected: {
      isValid: true,
      initialState: "RHYTHM_CHECK"
    }
  },

  {
    id: "acls_rhythm_to_shockable",
    protocolId: "acls",
    testType: "stateTransition",
    title:
      "حالة 48: ACLS - Rhythm Check إلى Shockable Loop",
    inputs: {
      currentStateId: "RHYTHM_CHECK",
      branchTargetId: "SHOCKABLE_LOOP"
    },
    expected: {
      isValid: true,
      nextState: "SHOCKABLE_LOOP",
      terminal: false,
      emergencyCico: false
    }
  },

  {
    id: "acls_rhythm_to_nonshockable",
    protocolId: "acls",
    testType: "stateTransition",
    title:
      "حالة 49: ACLS - Rhythm Check إلى Non-Shockable Loop",
    inputs: {
      currentStateId: "RHYTHM_CHECK",
      branchTargetId: "NON_SHOCKABLE_LOOP"
    },
    expected: {
      isValid: true,
      nextState: "NON_SHOCKABLE_LOOP",
      terminal: false,
      emergencyCico: false
    }
  },

  {
    id: "acls_shockable_to_post_rosc",
    protocolId: "acls",
    testType: "stateTransition",
    title:
      "حالة 50: ACLS - Shockable Loop إلى Post-ROSC",
    inputs: {
      currentStateId: "SHOCKABLE_LOOP",
      branchTargetId: "POST_ROSC"
    },
    expected: {
      isValid: true,
      nextState: "POST_ROSC",
      terminal: true,
      emergencyCico: false
    }
  },

  {
    id: "acls_invalid_transition",
    protocolId: "acls",
    testType: "stateTransition",
    title:
      "حالة 51: ACLS - انتقال غير مسموح",
    inputs: {
      currentStateId: "RHYTHM_CHECK",
      branchTargetId: "POST_ROSC"
    },
    expected: {
      isValid: false,
      errorCode: "INVALID_STATE_TRANSITION"
    }
  },

  // =========================================================================
  // 10. STATE MACHINE - MALIGNANT HYPERTHERMIA
  // =========================================================================

  {
    id: "mh_initial_state",
    protocolId: "mh",
    testType: "stateTransition",
    title:
      "حالة 52: MH - الحالة الابتدائية",
    inputs: {
      currentStateId: null
    },
    expected: {
      isValid: true,
      initialState: "RECOGNITION"
    }
  },

  {
    id: "mh_recognition_to_actions",
    protocolId: "mh",
    testType: "stateTransition",
    title:
      "حالة 53: MH - Recognition إلى Immediate Actions",
    inputs: {
      currentStateId: "RECOGNITION",
      branchTargetId: "IMMEDIATE_ACTIONS"
    },
    expected: {
      isValid: true,
      nextState: "IMMEDIATE_ACTIONS",
      terminal: false,
      emergencyCico: false
    }
  },

  {
    id: "mh_actions_to_dantrolene",
    protocolId: "mh",
    testType: "stateTransition",
    title:
      "حالة 54: MH - Immediate Actions إلى Dantrolene",
    inputs: {
      currentStateId: "IMMEDIATE_ACTIONS",
      branchTargetId: "DANTROLENE_ADMINISTRATION"
    },
    expected: {
      isValid: true,
      nextState: "DANTROLENE_ADMINISTRATION",
      terminal: false,
      emergencyCico: false
    }
  },

  {
    id: "mh_dantrolene_to_supportive",
    protocolId: "mh",
    testType: "stateTransition",
    title:
      "حالة 55: MH - Dantrolene إلى Supportive Care",
    inputs: {
      currentStateId: "DANTROLENE_ADMINISTRATION",
      branchTargetId: "SUPPORTIVE_CARE"
    },
    expected: {
      isValid: true,
      nextState: "SUPPORTIVE_CARE",
      terminal: true,
      emergencyCico: false
    }
  },

  // =========================================================================
  // 11. STATE MACHINE - LAST
  // =========================================================================

  {
    id: "last_initial_state",
    protocolId: "last",
    testType: "stateTransition",
    title:
      "حالة 56: LAST - الحالة الابتدائية",
    inputs: {
      currentStateId: null
    },
    expected: {
      isValid: true,
      initialState: "RECOGNITION"
    }
  },

  {
    id: "last_recognition_to_management",
    protocolId: "last",
    testType: "stateTransition",
    title:
      "حالة 57: LAST - Recognition إلى Immediate Management",
    inputs: {
      currentStateId: "RECOGNITION",
      branchTargetId: "IMMEDIATE_MANAGEMENT"
    },
    expected: {
      isValid: true,
      nextState: "IMMEDIATE_MANAGEMENT",
      terminal: false,
      emergencyCico: false
    }
  },

  {
    id: "last_management_to_lipid",
    protocolId: "last",
    testType: "stateTransition",
    title:
      "حالة 58: LAST - Immediate Management إلى Lipid Therapy",
    inputs: {
      currentStateId: "IMMEDIATE_MANAGEMENT",
      branchTargetId: "LIPID_EMULSION_THERAPY"
    },
    expected: {
      isValid: true,
      nextState: "LIPID_EMULSION_THERAPY",
      terminal: false,
      emergencyCico: false
    }
  },

  {
    id: "last_lipid_to_observation",
    protocolId: "last",
    testType: "stateTransition",
    title:
      "حالة 59: LAST - Lipid Therapy إلى Post Observation",
    inputs: {
      currentStateId: "LIPID_EMULSION_THERAPY",
      branchTargetId: "POST_LAST_OBSERVATION"
    },
    expected: {
      isValid: true,
      nextState: "POST_LAST_OBSERVATION",
      terminal: true,
      emergencyCico: false
    }
  },

  // =========================================================================
  // 12. STATE MACHINE - ANAPHYLAXIS
  // =========================================================================

  {
    id: "anaphylaxis_initial_state",
    protocolId: "anaphylaxis",
    testType: "stateTransition",
    title:
      "حالة 60: Anaphylaxis - الحالة الابتدائية",
    inputs: {
      currentStateId: null
    },
    expected: {
      isValid: true,
      initialState: "RECOGNITION"
    }
  },

  {
    id: "anaphylaxis_recognition_to_first_line",
    protocolId: "anaphylaxis",
    testType: "stateTransition",
    title:
      "حالة 61: Anaphylaxis - Recognition إلى First-Line",
    inputs: {
      currentStateId: "RECOGNITION",
      branchTargetId: "IMMEDIATE_FIRST_LINE"
    },
    expected: {
      isValid: true,
      nextState: "IMMEDIATE_FIRST_LINE",
      terminal: false,
      emergencyCico: false
    }
  },

  {
    id: "anaphylaxis_first_line_to_post",
    protocolId: "anaphylaxis",
    testType: "stateTransition",
    title:
      "حالة 62: Anaphylaxis - First-Line إلى Second-Line/Post",
    inputs: {
      currentStateId: "IMMEDIATE_FIRST_LINE",
      branchTargetId: "SECOND_LINE_AND_POST"
    },
    expected: {
      isValid: true,
      nextState: "SECOND_LINE_AND_POST",
      terminal: true,
      emergencyCico: false
    }
  },

  // =========================================================================
  // 13. STATE MACHINE - DIFFICULT AIRWAY
  // =========================================================================

  {
    id: "airway_initial_state",
    protocolId: "airway",
    testType: "stateTransition",
    title:
      "حالة 63: Difficult Airway - الحالة الابتدائية Plan A",
    inputs: {
      currentStateId: null
    },
    expected: {
      isValid: true,
      initialState: "PLAN_A"
    }
  },

  {
    id: "airway_plan_a_to_plan_b",
    protocolId: "airway",
    testType: "stateTransition",
    title:
      "حالة 64: Airway - فشل Plan A إلى Plan B",
    inputs: {
      currentStateId: "PLAN_A",
      branchTargetId: "PLAN_B"
    },
    expected: {
      isValid: true,
      nextState: "PLAN_B",
      terminal: false,
      emergencyCico: false
    }
  },

  {
    id: "airway_plan_b_to_plan_c",
    protocolId: "airway",
    testType: "stateTransition",
    title:
      "حالة 65: Airway - فشل Plan B إلى Plan C",
    inputs: {
      currentStateId: "PLAN_B",
      branchTargetId: "PLAN_C"
    },
    expected: {
      isValid: true,
      nextState: "PLAN_C",
      terminal: false,
      emergencyCico: false
    }
  },

  {
    id: "airway_plan_c_to_plan_d",
    protocolId: "airway",
    testType: "stateTransition",
    title:
      "حالة 66: Airway - CICO من Plan C إلى Plan D",
    inputs: {
      currentStateId: "PLAN_C",
      branchTargetId: "PLAN_D_EFONA"
    },
    expected: {
      isValid: true,
      nextState: "PLAN_D_EFONA",
      terminal: true,
      emergencyCico: true
    }
  },

  {
    id: "airway_plan_a_success",
    protocolId: "airway",
    testType: "stateTransition",
    title:
      "حالة 67: Airway - نجاح Plan A",
    inputs: {
      currentStateId: "PLAN_A",
      branchTargetId: "SUCCESS_CONFIRMED"
    },
    expected: {
      isValid: true,
      nextState: "SUCCESS_CONFIRMED",
      terminal: true,
      emergencyCico: false
    }
  },

  // =========================================================================
  // 14. STATE MACHINE - LARYNGOSPASM
  // =========================================================================

  {
    id: "laryngospasm_initial_state",
    protocolId: "laryngospasm",
    testType: "stateTransition",
    title:
      "حالة 68: Laryngospasm - الحالة الابتدائية",
    inputs: {
      currentStateId: null
    },
    expected: {
      isValid: true,
      initialState: "ALGORITHM"
    }
  },

  {
    id: "laryngospasm_terminal_state",
    protocolId: "laryngospasm",
    testType: "stateTransition",
    title:
      "حالة 69: Laryngospasm - الحالة النهائية",
    inputs: {
      currentStateId: "ALGORITHM"
    },
    expected: {
      isValid: true,
      terminal: true,
      isEmergencyCico: false
    }
  },

  // =========================================================================
  // 15. STATE MACHINE ERROR HANDLING
  // =========================================================================

  {
    id: "invalid_protocol_id",
    testType: "stateTransition",
    title:
      "حالة 70: Protocol ID غير صالح",
    inputs: {
      protocolId: "unknown_protocol",
      currentStateId: "RECOGNITION",
      branchTargetId: "IMMEDIATE_ACTIONS"
    },
    expected: {
      isValid: false,
      errorCode: "INVALID_PROTOCOL_ID"
    }
  },

  {
    id: "invalid_current_state",
    protocolId: "mh",
    testType: "stateTransition",
    title:
      "حالة 71: Current State غير صالح",
    inputs: {
      currentStateId: "UNKNOWN_STATE",
      branchTargetId: "IMMEDIATE_ACTIONS"
    },
    expected: {
      isValid: false,
      errorCode: "INVALID_CURRENT_STATE"
    }
  },

  {
    id: "invalid_state_transition",
    protocolId: "mh",
    testType: "stateTransition",
    title:
      "حالة 72: State Transition غير صالح",
    inputs: {
      currentStateId: "RECOGNITION",
      branchTargetId: "SUPPORTIVE_CARE"
    },
    expected: {
      isValid: false,
      errorCode: "INVALID_STATE_TRANSITION"
    }
  },

  {
    id: "terminal_state_without_target",
    protocolId: "mh",
    testType: "stateTransition",
    title:
      "حالة 73: فحص Terminal State بدون Target",
    inputs: {
      currentStateId: "SUPPORTIVE_CARE"
    },
    expected: {
      isValid: true,
      terminal: true,
      isEmergencyCico: false
    }
  },

  {
    id: "non_terminal_state_without_target",
    protocolId: "mh",
    testType: "stateTransition",
    title:
      "حالة 74: فحص Non-Terminal State بدون Target",
    inputs: {
      currentStateId: "RECOGNITION"
    },
    expected: {
      isValid: true,
      terminal: false,
      isEmergencyCico: false
    }
  }

];
