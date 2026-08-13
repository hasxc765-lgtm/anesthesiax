/**
 * Emergency & Resuscitation Protocols Test Cases
 *
 * AnesthesiaX — Phase 10.0
 * File: js/data/emergencyTestCases.js
 *
 * Comprehensive Clinical & Boundary Validation Suite for Emergency Engine.
 *
 * Coverage:
 * - Drug dose calculations
 * - Dantrolene formulation calculations
 * - Vial counts
 * - Diluent volumes
 * - LAST lipid rescue calculations
 * - Perioperative anaphylaxis dosing
 * - Laryngospasm succinylcholine dosing
 * - Unit validation boundaries
 * - Dangerous-range warnings
 * - Protocol state transitions
 * - Invalid input handling
 *
 * Architecture:
 * Pure Data ES Module.
 *
 * IMPORTANT:
 * This file contains TEST EXPECTATIONS only.
 * It must NOT introduce clinical rules that do not exist
 * in emergencyData.js.
 */

export const emergencyTestCases = [

  // =========================================================================
  // 1. MALIGNANT HYPERTHERMIA — DANTROLENE
  // =========================================================================

  {
    id: "mh_dantrolene_standard_adult_dantrium",
    protocolId: "mh",
    title: "حالة 1: MH - بالغ 70 kg باستخدام Dantrium التقليدي",
    inputs: {
      weightKg: 70,
      formulation: "dantrium"
    },
    expected: {
      isValid: true,
      calculatedDoseMg: 175.0,
      vialCount: 9,
      diluentVolumeMl: 540,
      reconstitutedConcMgMl: 0.333,
      reEvaluationThresholdMg: 700
    }
  },

  {
    id: "mh_dantrolene_standard_adult_100kg_dantrium",
    protocolId: "mh",
    title: "حالة 2: MH - بالغ 100 kg باستخدام Dantrium",
    inputs: {
      weightKg: 100,
      formulation: "dantrium"
    },
    expected: {
      isValid: true,
      calculatedDoseMg: 250.0,
      vialCount: 13,
      diluentVolumeMl: 780,
      reconstitutedConcMgMl: 0.333,
      reEvaluationThresholdMg: 1000
    }
  },

  {
    id: "mh_dantrolene_severe_obesity_ryanodex",
    protocolId: "mh",
    title: "حالة 3: MH - وزن 140 kg باستخدام Ryanodex",
    inputs: {
      weightKg: 140,
      formulation: "ryanodex"
    },
    expected: {
      isValid: true,
      calculatedDoseMg: 350.0,
      vialCount: 2,
      diluentVolumeMl: 10,
      reconstitutedConcMgMl: 50.0,
      reEvaluationThresholdMg: 1400
    }
  },

  {
    id: "mh_dantrolene_pediatric_dantrium",
    protocolId: "mh",
    title: "حالة 4: MH - طفل 18 kg باستخدام Dantrium",
    inputs: {
      weightKg: 18,
      formulation: "dantrium"
    },
    expected: {
      isValid: true,
      calculatedDoseMg: 45.0,
      vialCount: 3,
      diluentVolumeMl: 180,
      reconstitutedConcMgMl: 0.333,
      reEvaluationThresholdMg: 180
    }
  },

  {
    id: "mh_dantrolene_minimum_valid_weight",
    protocolId: "mh",
    title: "حالة 5: MH - الحد الأدنى المسموح للوزن 1 kg",
    inputs: {
      weightKg: 1,
      formulation: "dantrium"
    },
    expected: {
      isValid: true,
      calculatedDoseMg: 2.5,
      vialCount: 1,
      diluentVolumeMl: 60,
      reEvaluationThresholdMg: 10
    }
  },

  {
    id: "mh_dantrolene_dangerous_low_weight",
    protocolId: "mh",
    title: "حالة 6: MH - وزن أقل من النطاق المعتاد 2 kg",
    inputs: {
      weightKg: 2,
      formulation: "dantrium"
    },
    expected: {
      isValid: true,
      hasWarning: true,
      calculatedDoseMg: 5.0,
      vialCount: 1,
      diluentVolumeMl: 60
    }
  },

  {
    id: "mh_dantrolene_dangerous_high_weight",
    protocolId: "mh",
    title: "حالة 7: MH - وزن أعلى من النطاق المعتاد 220 kg",
    inputs: {
      weightKg: 220,
      formulation: "dantrium"
    },
    expected: {
      isValid: true,
      hasWarning: true,
      calculatedDoseMg: 550.0,
      vialCount: 28,
      diluentVolumeMl: 1680,
      reEvaluationThresholdMg: 2200
    }
  },

  {
    id: "mh_dantrolene_max_valid_weight",
    protocolId: "mh",
    title: "حالة 8: MH - الحد الأعلى المسموح للوزن 300 kg",
    inputs: {
      weightKg: 300,
      formulation: "dantrium"
    },
    expected: {
      isValid: true,
      calculatedDoseMg: 750.0,
      vialCount: 38,
      diluentVolumeMl: 2280,
      reEvaluationThresholdMg: 3000
    }
  },

  // =========================================================================
  // 2. LAST — 20% LIPID EMULSION
  // =========================================================================

  {
    id: "last_lipid_standard_adult_70kg",
    protocolId: "last",
    title: "حالة 9: LAST - بالغ 70 kg",
    inputs: {
      weightKg: 70
    },
    expected: {
      isValid: true,
      bolusVolumeMl: 105.0,
      initialInfusionRateMlMin: 17.5,
      doubleInfusionRateMlMin: 35.0,
      maxCumulativeVolumeMl: 840.0
    }
  },

  {
    id: "last_lipid_low_weight_45kg",
    protocolId: "last",
    title: "حالة 10: LAST - مريض 45 kg",
    inputs: {
      weightKg: 45
    },
    expected: {
      isValid: true,
      bolusVolumeMl: 67.5,
      initialInfusionRateMlMin: 11.25,
      doubleInfusionRateMlMin: 22.5,
      maxCumulativeVolumeMl: 540.0
    }
  },

  {
    id: "last_lipid_minimum_valid_weight",
    protocolId: "last",
    title: "حالة 11: LAST - الحد الأدنى المسموح للوزن 1 kg",
    inputs: {
      weightKg: 1
    },
    expected: {
      isValid: true,
      bolusVolumeMl: 1.5,
      initialInfusionRateMlMin: 0.25,
      doubleInfusionRateMlMin: 0.5,
      maxCumulativeVolumeMl: 12.0
    }
  },

  {
    id: "last_lipid_maximum_valid_weight",
    protocolId: "last",
    title: "حالة 12: LAST - الحد الأعلى المسموح للوزن 300 kg",
    inputs: {
      weightKg: 300
    },
    expected: {
      isValid: true,
      hasWarning: true,
      bolusVolumeMl: 450.0,
      initialInfusionRateMlMin: 75.0,
      doubleInfusionRateMlMin: 150.0,
      maxCumulativeVolumeMl: 3600.0
    }
  },

  // =========================================================================
  // 3. PERIOPERATIVE ANAPHYLAXIS
  // =========================================================================

  {
    id: "anaphylaxis_perioperative_iv_adult",
    protocolId: "anaphylaxis",
    title: "حالة 13: Perioperative Anaphylaxis - بالغ مع IV access ووجود دوران",
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
      repeatIntervalText: "Titrate 20-50 mcg every 1-2 minutes according to response",
      crystalloidBolusMl: "500-1000 mL"
    }
  },

  {
    id: "anaphylaxis_im_fallback_under_cap",
    protocolId: "anaphylaxis",
    title: "حالة 14: Perioperative Anaphylaxis - IM عند عدم توفر IV، وزن 40 kg",
    inputs: {
      weightKg: 40,
      hasIvAccess: false,
      hasSpontaneousCirculation: true
    },
    expected: {
      isValid: true,
      recommendedRoute: "IM (Mid-Outer Thigh)",
      calculatedDoseMcg: 400.0,
      isCapped: false
    }
  },

  {
    id: "anaphylaxis_im_fallback_at_cap",
    protocolId: "anaphylaxis",
    title: "حالة 15: Perioperative Anaphylaxis - IM عند حد 500 mcg",
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

  {
    id: "anaphylaxis_im_fallback_above_cap",
    protocolId: "anaphylaxis",
    title: "حالة 16: Perioperative Anaphylaxis - IM يتجاوز الحد الأقصى",
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

  // =========================================================================
  // 4. LARYNGOSPASM — SUCCINYLCHOLINE
  // =========================================================================

  {
    id: "laryngospasm_succinylcholine_60kg",
    protocolId: "laryngospasm",
    title: "حالة 17: Laryngospasm - مريض 60 kg",
    inputs: {
      weightKg: 60
    },
    expected: {
      isValid: true,
      ivSuccinylcholineDoseMg: 60.0,
      imSuccinylcholineDoseMg: 240.0
    }
  },

  {
    id: "laryngospasm_succinylcholine_70kg",
    protocolId: "laryngospasm",
    title: "حالة 18: Laryngospasm - بالغ 70 kg",
    inputs: {
      weightKg: 70
    },
    expected: {
      isValid: true,
      ivSuccinylcholineDoseMg: 70.0,
      imSuccinylcholineDoseMg: 280.0
    }
  },

  {
    id: "laryngospasm_succinylcholine_pediatric_18kg",
    protocolId: "laryngospasm",
    title: "حالة 19: Laryngospasm - طفل 18 kg",
    inputs: {
      weightKg: 18
    },
    expected: {
      isValid: true,
      ivSuccinylcholineDoseMg: 18.0,
      imSuccinylcholineDoseMg: 72.0,
      pediatricAtropineNoteExpected: true
    }
  },

  // =========================================================================
  // 5. UNIT VALIDATION — WEIGHT
  // =========================================================================

  {
    id: "boundary_zero_weight",
    title: "حالة 20: وزن صفر - يجب رفض الإدخال",
    inputs: {
      weightKg: 0
    },
    expected: {
      isValid: false,
      errorCode: "WEIGHT_BELOW_MIN"
    }
  },

  {
    id: "boundary_negative_weight",
    title: "حالة 21: وزن سالب - يجب رفض الإدخال",
    inputs: {
      weightKg: -70
    },
    expected: {
      isValid: false,
      errorCode: "WEIGHT_BELOW_MIN"
    }
  },

  {
    id: "boundary_below_minimum_weight",
    title: "حالة 22: وزن 0.9 kg - أقل من الحد الأدنى",
    inputs: {
      weightKg: 0.9
    },
    expected: {
      isValid: false,
      errorCode: "WEIGHT_BELOW_MIN"
    }
  },

  {
    id: "boundary_minimum_weight",
    title: "حالة 23: وزن 1 kg - الحد الأدنى الصحيح",
    inputs: {
      weightKg: 1
    },
    expected: {
      isValid: true
    }
  },

  {
    id: "boundary_dangerous_low_weight",
    title: "حالة 24: وزن 2 kg - صالح مع تحذير",
    inputs: {
      weightKg: 2
    },
    expected: {
      isValid: true,
      hasWarning: true
    }
  },

  {
    id: "boundary_normal_weight_lower_edge",
    title: "حالة 25: وزن 3 kg - بداية النطاق المعتاد",
    inputs: {
      weightKg: 3
    },
    expected: {
      isValid: true,
      hasWarning: false
    }
  },

  {
    id: "boundary_normal_weight",
    title: "حالة 26: وزن 70 kg - نطاق طبيعي للاختبار",
    inputs: {
      weightKg: 70
    },
    expected: {
      isValid: true,
      hasWarning: false
    }
  },

  {
    id: "boundary_dangerous_high_weight",
    title: "حالة 27: وزن 201 kg - صالح مع تحذير",
    inputs: {
      weightKg: 201
    },
    expected: {
      isValid: true,
      hasWarning: true
    }
  },

  {
    id: "boundary_maximum_weight",
    title: "حالة 28: وزن 300 kg - الحد الأعلى الصحيح",
    inputs: {
      weightKg: 300
    },
    expected: {
      isValid: true,
      hasWarning: true
    }
  },

  {
    id: "boundary_above_maximum_weight",
    title: "حالة 29: وزن 300.1 kg - أعلى من الحد الأقصى",
    inputs: {
      weightKg: 300.1
    },
    expected: {
      isValid: false,
      errorCode: "WEIGHT_ABOVE_MAX"
    }
  },

  // =========================================================================
  // 6. UNIT VALIDATION — FiO2
  // =========================================================================

  {
    id: "fio2_decimal_minimum",
    title: "حالة 30: FiO2 = 0.21 - الحد الأدنى",
    inputs: {
      fio2: 0.21
    },
    expected: {
      isValid: true
    }
  },

  {
    id: "fio2_decimal_maximum",
    title: "حالة 31: FiO2 = 1.00 - الحد الأعلى",
    inputs: {
      fio2: 1.0
    },
    expected: {
      isValid: true
    }
  },

  {
    id: "fio2_decimal_below_minimum",
    title: "حالة 32: FiO2 أقل من 0.21",
    inputs: {
      fio2: 0.20
    },
    expected: {
      isValid: false,
      errorCode: "FIO2_BELOW_MIN"
    }
  },

  {
    id: "fio2_decimal_above_maximum",
    title: "حالة 33: FiO2 أعلى من 1.00",
    inputs: {
      fio2: 1.01
    },
    expected: {
      isValid: false,
      errorCode: "FIO2_ABOVE_MAX"
    }
  },

  // =========================================================================
  // 7. UNIT VALIDATION — ETCO2
  // =========================================================================

  {
    id: "etco2_normal_lower_boundary",
    title: "حالة 34: ETCO2 = 35 mmHg - الحد الطبيعي الأدنى",
    inputs: {
      etco2: 35
    },
    expected: {
      isValid: true,
      isNormal: true
    }
  },

  {
    id: "etco2_normal_upper_boundary",
    title: "حالة 35: ETCO2 = 45 mmHg - الحد الطبيعي الأعلى",
    inputs: {
      etco2: 45
    },
    expected: {
      isValid: true,
      isNormal: true
    }
  },

  {
    id: "etco2_above_normal",
    title: "حالة 36: ETCO2 = 50 mmHg - أعلى من الطبيعي",
    inputs: {
      etco2: 50
    },
    expected: {
      isValid: true,
      isNormal: false
    }
  },

  {
    id: "etco2_above_maximum",
    title: "حالة 37: ETCO2 = 151 mmHg - أعلى من الحد المسموح",
    inputs: {
      etco2: 151
    },
    expected: {
      isValid: false,
      errorCode: "ETCO2_ABOVE_MAX"
    }
  },

  // =========================================================================
  // 8. TEMPERATURE VALIDATION
  // =========================================================================

  {
    id: "temperature_normal",
    title: "حالة 38: حرارة 37°C - ضمن الطبيعي",
    inputs: {
      tempCelsius: 37
    },
    expected: {
      isValid: true,
      isNormal: true,
      coolingRequired: false
    }
  },

  {
    id: "temperature_mh_cooling_threshold",
    title: "حالة 39: حرارة 39°C - بداية عتبة التبريد",
    inputs: {
      tempCelsius: 39
    },
    expected: {
      isValid: true,
      coolingRequired: true
    }
  },

  {
    id: "temperature_mh_high",
    title: "حالة 40: حرارة 40°C - MH cooling required",
    inputs: {
      tempCelsius: 40
    },
    expected: {
      isValid: true,
      coolingRequired: true
    }
  },

  {
    id: "temperature_cooling_stop_threshold",
    title: "حالة 41: حرارة 38°C - عتبة إيقاف التبريد",
    inputs: {
      tempCelsius: 38
    },
    expected: {
      isValid: true,
      coolingStopReached: true
    }
  },

  {
    id: "temperature_below_minimum",
    title: "حالة 42: حرارة 19.9°C - أقل من الحد المسموح",
    inputs: {
      tempCelsius: 19.9
    },
    expected: {
      isValid: false,
      errorCode: "TEMP_BELOW_MIN"
    }
  },

  {
    id: "temperature_above_maximum",
    title: "حالة 43: حرارة 45.1°C - أعلى من الحد المسموح",
    inputs: {
      tempCelsius: 45.1
    },
    expected: {
      isValid: false,
      errorCode: "TEMP_ABOVE_MAX"
    }
  },

  // =========================================================================
  // 9. FORMULATION VALIDATION
  // =========================================================================

  {
    id: "dantrolene_valid_dantrium_formulation",
    protocolId: "mh",
    title: "حالة 44: اختيار Dantrium الصحيح",
    inputs: {
      weightKg: 70,
      formulation: "dantrium"
    },
    expected: {
      isValid: true,
      formulationResolved: "dantrium",
      vialSizeMg: 20,
      vialDiluentMl: 60
    }
  },

  {
    id: "dantrolene_valid_ryanodex_formulation",
    protocolId: "mh",
    title: "حالة 45: اختيار Ryanodex الصحيح",
    inputs: {
      weightKg: 70,
      formulation: "ryanodex"
    },
    expected: {
      isValid: true,
      formulationResolved: "ryanodex",
      vialSizeMg: 250,
      vialDiluentMl: 5
    }
  },

  {
    id: "dantrolene_missing_formulation",
    protocolId: "mh",
    title: "حالة 46: عدم تحديد تركيبة Dantrolene",
    inputs: {
      weightKg: 70
    },
    expected: {
      isValid: false,
      errorCode: "FORMULATION_REQUIRED"
    }
  },

  {
    id: "dantrolene_invalid_formulation",
    protocolId: "mh",
    title: "حالة 47: تركيبة Dantrolene غير معروفة",
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
  // 10. ACLS STATE MACHINE
  // =========================================================================

  {
    id: "acls_initial_state",
    protocolId: "acls",
    title: "حالة 48: ACLS - التحقق من الحالة الابتدائية",
    inputs: {},
    expected: {
      isValid: true,
      initialState: "RHYTHM_CHECK"
    }
  },

  {
    id: "acls_rhythm_to_shockable",
    protocolId: "acls",
    title: "حالة 49: ACLS - الانتقال من Rhythm Check إلى Shockable Loop",
    inputs: {
      currentState: "RHYTHM_CHECK",
      branchTarget: "SHOCKABLE_LOOP"
    },
    expected: {
      isValid: true,
      nextState: "SHOCKABLE_LOOP"
    }
  },

  {
    id: "acls_rhythm_to_nonshockable",
    protocolId: "acls",
    title: "حالة 50: ACLS - الانتقال إلى Non-Shockable Loop",
    inputs: {
      currentState: "RHYTHM_CHECK",
      branchTarget: "NON_SHOCKABLE_LOOP"
    },
    expected: {
      isValid: true,
      nextState: "NON_SHOCKABLE_LOOP"
    }
  },

  {
    id: "acls_shockable_loop_repeat",
    protocolId: "acls",
    title: "حالة 51: ACLS - استمرار VF/pVT",
    inputs: {
      currentState: "SHOCKABLE_LOOP",
      branchTarget: "SHOCKABLE_LOOP"
    },
    expected: {
      isValid: true,
      nextState: "SHOCKABLE_LOOP"
    }
  },

  {
    id: "acls_shockable_to_nonshockable",
    protocolId: "acls",
    title: "حالة 52: ACLS - VF/pVT يتحول إلى PEA/Asystole",
    inputs: {
      currentState: "SHOCKABLE_LOOP",
      branchTarget: "NON_SHOCKABLE_LOOP"
    },
    expected: {
      isValid: true,
      nextState: "NON_SHOCKABLE_LOOP"
    }
  },

  {
    id: "acls_shockable_to_rosC",
    protocolId: "acls",
    title: "حالة 53: ACLS - ROSC بعد المسار القابل للصدمة",
    inputs: {
      currentState: "SHOCKABLE_LOOP",
      branchTarget: "POST_ROSC"
    },
    expected: {
      isValid: true,
      nextState: "POST_ROSC"
    }
  },

  {
    id: "acls_nonshockable_to_shockable",
    protocolId: "acls",
    title: "حالة 54: ACLS - PEA/Asystole يتحول إلى VF/pVT",
    inputs: {
      currentState: "NON_SHOCKABLE_LOOP",
      branchTarget: "SHOCKABLE_LOOP"
    },
    expected: {
      isValid: true,
      nextState: "SHOCKABLE_LOOP"
    }
  },

  {
    id: "acls_nonshockable_to_rosC",
    protocolId: "acls",
    title: "حالة 55: ACLS - ROSC بعد المسار غير القابل للصدمة",
    inputs: {
      currentState: "NON_SHOCKABLE_LOOP",
      branchTarget: "POST_ROSC"
    },
    expected: {
      isValid: true,
      nextState: "POST_ROSC"
    }
  },

  // =========================================================================
  // 11. MALIGNANT HYPERTHERMIA STATE MACHINE
  // =========================================================================

  {
    id: "mh_initial_state",
    protocolId: "mh",
    title: "حالة 56: MH - الحالة الابتدائية",
    inputs: {},
    expected: {
      isValid: true,
      initialState: "RECOGNITION"
    }
  },

  {
    id: "mh_recognition_to_immediate_actions",
    protocolId: "mh",
    title: "حالة 57: MH - Recognition إلى Immediate Actions",
    inputs: {
      currentState: "RECOGNITION",
      branchTarget: "IMMEDIATE_ACTIONS"
    },
    expected: {
      isValid: true,
      nextState: "IMMEDIATE_ACTIONS"
    }
  },

  {
    id: "mh_immediate_to_dantrolene",
    protocolId: "mh",
    title: "حالة 58: MH - Immediate Actions إلى Dantrolene",
    inputs: {
      currentState: "IMMEDIATE_ACTIONS",
      branchTarget: "DANTROLENE_ADMINISTRATION"
    },
    expected: {
      isValid: true,
      nextState: "DANTROLENE_ADMINISTRATION"
    }
  },

  {
    id: "mh_dantrolene_to_supportive",
    protocolId: "mh",
    title: "حالة 59: MH - Dantrolene إلى Supportive Care",
    inputs: {
      currentState: "DANTROLENE_ADMINISTRATION",
      branchTarget: "SUPPORTIVE_CARE"
    },
    expected: {
      isValid: true,
      nextState: "SUPPORTIVE_CARE"
    }
  },

  // =========================================================================
  // 12. LAST STATE MACHINE
  // =========================================================================

  {
    id: "last_initial_state",
    protocolId: "last",
    title: "حالة 60: LAST - الحالة الابتدائية",
    inputs: {},
    expected: {
      isValid: true,
      initialState: "RECOGNITION"
    }
  },

  {
    id: "last_recognition_to_management",
    protocolId: "last",
    title: "حالة 61: LAST - Recognition إلى Immediate Management",
    inputs: {
      currentState: "RECOGNITION",
      branchTarget: "IMMEDIATE_MANAGEMENT"
    },
    expected: {
      isValid: true,
      nextState: "IMMEDIATE_MANAGEMENT"
    }
  },

  {
    id: "last_management_to_lipid",
    protocolId: "last",
    title: "حالة 62: LAST - Immediate Management إلى Lipid Therapy",
    inputs: {
      currentState: "IMMEDIATE_MANAGEMENT",
      branchTarget: "LIPID_EMULSION_THERAPY"
    },
    expected: {
      isValid: true,
      nextState: "LIPID_EMULSION_THERAPY"
    }
  },

  {
    id: "last_lipid_to_observation",
    protocolId: "last",
    title: "حالة 63: LAST - Lipid Therapy إلى Observation",
    inputs: {
      currentState: "LIPID_EMULSION_THERAPY",
      branchTarget: "POST_LAST_OBSERVATION"
    },
    expected: {
      isValid: true,
      nextState: "POST_LAST_OBSERVATION"
    }
  },

  // =========================================================================
  // 13. ANAPHYLAXIS STATE MACHINE
  // =========================================================================

  {
    id: "anaphylaxis_initial_state",
    protocolId: "anaphylaxis",
    title: "حالة 64: Anaphylaxis - الحالة الابتدائية",
    inputs: {},
    expected: {
      isValid: true,
      initialState: "RECOGNITION"
    }
  },

  {
    id: "anaphylaxis_recognition_to_first_line",
    protocolId: "anaphylaxis",
    title: "حالة 65: Anaphylaxis - Recognition إلى First-Line",
    inputs: {
      currentState: "RECOGNITION",
      branchTarget: "IMMEDIATE_FIRST_LINE"
    },
    expected: {
      isValid: true,
      nextState: "IMMEDIATE_FIRST_LINE"
    }
  },

  {
    id: "anaphylaxis_first_line_to_post",
    protocolId: "anaphylaxis",
    title: "حالة 66: Anaphylaxis - First-Line إلى Second-Line/Post",
    inputs: {
      currentState: "IMMEDIATE_FIRST_LINE",
      branchTarget: "SECOND_LINE_AND_POST"
    },
    expected: {
      isValid: true,
      nextState: "SECOND_LINE_AND_POST"
    }
  },

  // =========================================================================
  // 14. DIFFICULT AIRWAY STATE MACHINE
  // =========================================================================

  {
    id: "airway_initial_state",
    protocolId: "airway",
    title: "حالة 67: Difficult Airway - الحالة الابتدائية Plan A",
    inputs: {},
    expected: {
      isValid: true,
      initialState: "PLAN_A"
    }
  },

  {
    id: "airway_plan_a_success",
    protocolId: "airway",
    title: "حالة 68: Airway - نجاح Plan A",
    inputs: {
      currentState: "PLAN_A",
      branchTarget: "SUCCESS_CONFIRMED"
    },
    expected: {
      isValid: true,
      nextState: "SUCCESS_CONFIRMED"
    }
  },

  {
    id: "airway_plan_a_to_plan_b",
    protocolId: "airway",
    title: "حالة 69: Airway - فشل Plan A والانتقال إلى Plan B",
    inputs: {
      currentState: "PLAN_A",
      branchTarget: "PLAN_B"
    },
    expected: {
      isValid: true,
      nextState: "PLAN_B"
    }
  },

  {
    id: "airway_plan_b_success",
    protocolId: "airway",
    title: "حالة 70: Airway - نجاح SGA في Plan B",
    inputs: {
      currentState: "PLAN_B",
      branchTarget: "SGA_SUCCESS"
    },
    expected: {
      isValid: true,
      nextState: "SGA_SUCCESS"
    }
  },

  {
    id: "airway_plan_b_to_plan_c",
    protocolId: "airway",
    title: "حالة 71: Airway - فشل Plan B والانتقال إلى Plan C",
    inputs: {
      currentState: "PLAN_B",
      branchTarget: "PLAN_C"
    },
    expected: {
      isValid: true,
      nextState: "PLAN_C"
    }
  },

  {
    id: "airway_plan_c_success",
    protocolId: "airway",
    title: "حالة 72: Airway - نجاح Face Mask Ventilation",
    inputs: {
      currentState: "PLAN_C",
      branchTarget: "FACEMASK_SUCCESS"
    },
    expected: {
      isValid: true,
      nextState: "FACEMASK_SUCCESS"
    }
  },

  {
    id: "airway_plan_c_to_plan_d",
    protocolId: "airway",
    title: "حالة 73: Airway - CICO والانتقال إلى Plan D/eFONA",
    inputs: {
      currentState: "PLAN_C",
      branchTarget: "PLAN_D_EFONA"
    },
    expected: {
      isValid: true,
      nextState: "PLAN_D_EFONA",
      emergencyCico: true
    }
  },

  // =========================================================================
  // 15. LARYNGOSPASM PROTOCOL
  // =========================================================================

  {
    id: "laryngospasm_initial_state",
    protocolId: "laryngospasm",
    title: "حالة 74: Laryngospasm - التحقق من الحالة الابتدائية",
    inputs: {},
    expected: {
      isValid: true,
      initialState: "ALGORITHM",
      terminal: true
    }
  },

  // =========================================================================
  // 16. INVALID STATE TRANSITION TESTS
  // =========================================================================

  {
    id: "invalid_acls_transition",
    protocolId: "acls",
    title: "حالة 75: ACLS - انتقال غير موجود يجب رفضه",
    inputs: {
      currentState: "RHYTHM_CHECK",
      branchTarget: "POST_ROSC"
    },
    expected: {
      isValid: false,
      errorCode: "INVALID_STATE_TRANSITION"
    }
  },

  {
    id: "invalid_mh_transition",
    protocolId: "mh",
    title: "حالة 76: MH - انتقال غير موجود يجب رفضه",
    inputs: {
      currentState: "RECOGNITION",
      branchTarget: "SUPPORTIVE_CARE"
    },
    expected: {
      isValid: false,
      errorCode: "INVALID_STATE_TRANSITION"
    }
  },

  {
    id: "invalid_airway_transition",
    protocolId: "airway",
    title: "حالة 77: Airway - الانتقال من Plan A مباشرة إلى Plan D يجب رفضه",
    inputs: {
      currentState: "PLAN_A",
      branchTarget: "PLAN_D_EFONA"
    },
    expected: {
      isValid: false,
      errorCode: "INVALID_STATE_TRANSITION"
    }
  },

  // =========================================================================
  // 17. TERMINAL STATE VALIDATION
  // =========================================================================

  {
    id: "acls_post_rosc_terminal",
    protocolId: "acls",
    title: "حالة 78: ACLS - POST_ROSC حالة نهائية",
    inputs: {
      stateId: "POST_ROSC"
    },
    expected: {
      isValid: true,
      terminal: true
    }
  },

  {
    id: "mh_supportive_care_terminal",
    protocolId: "mh",
    title: "حالة 79: MH - Supportive Care حالة نهائية",
    inputs: {
      stateId: "SUPPORTIVE_CARE"
    },
    expected: {
      isValid: true,
      terminal: true
    }
  },

  {
    id: "last_post_observation_terminal",
    protocolId: "last",
    title: "حالة 80: LAST - Post Observation حالة نهائية",
    inputs: {
      stateId: "POST_LAST_OBSERVATION"
    },
    expected: {
      isValid: true,
      terminal: true
    }
  },

  {
    id: "anaphylaxis_post_terminal",
    protocolId: "anaphylaxis",
    title: "حالة 81: Anaphylaxis - Second Line/Post حالة نهائية",
    inputs: {
      stateId: "SECOND_LINE_AND_POST"
    },
    expected: {
      isValid: true,
      terminal: true
    }
  },

  {
    id: "airway_efona_terminal",
    protocolId: "airway",
    title: "حالة 82: Airway - eFONA حالة نهائية طارئة",
    inputs: {
      stateId: "PLAN_D_EFONA"
    },
    expected: {
      isValid: true,
      terminal: true,
      isEmergencyCico: true
    }
  },

  {
    id: "laryngospasm_terminal",
    protocolId: "laryngospasm",
    title: "حالة 83: Laryngospasm - Algorithm حالة نهائية",
    inputs: {
      stateId: "ALGORITHM"
    },
    expected: {
      isValid: true,
      terminal: true
    }
  }

];
