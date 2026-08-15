/**
 * AnesthesiaX — Drug Center: Muscle Relaxation & Reversals Data Module
 * Component: Anesthesia Triad — Part 3 (Muscle Relaxation & Neuromuscular Block Management)
 * File: js/data/drugs/relaxationData.js
 *
 * Advanced Clinical Decision Support (CDS) Dataset — Canonical Draft Schema (Revision Pass 2)
 * Imports centralized DOSE_UNITS and adheres to strict NMT (Neuromuscular Transmission) monitoring semantics.
 */

import { DOSE_UNITS } from "../common/doseUnits.js";

export const relaxationData = [
  // =========================================================================
  // A) DEPOLARIZING NEUROMUSCULAR BLOCKING AGENTS (المرخيات المزيلة للاستقطاب)
  // =========================================================================
  {
    id: "succinylcholine",
    name: {
      generic: "Succinylcholine Chloride (Suxamethonium)",
      arabic: "سكوسينيل كولين (سوكساميثونيوم)",
      brandNames: ["Anectine", "Quelicin"]
    },
    classification: {
      triadComponent: "muscle_relaxation",
      category: "depolarizing_nmba",
      subcategory: "acetylcholine_receptor_agonist"
    },
    availability: {
      status: "standard",
      regionDependent: true
    },
    evidence: {
      status: "pending_formal_clinician_review",
      sourceOrganization: "FDA",
      documentTitle: "Succinylcholine Chloride Injection Prescribing Information",
      evidenceLevel: "regulatory"
    },
    safety: {
      highRiskMedication: true,
      operationalSafetyRequirements: [
        "airway_equipment_available",
        "bag_valve_mask_ready",
        "continuous_respiratory_monitoring",
        "hemodynamic_monitoring",
        "defibrillator_available"
      ]
    },
    calculationPolicy: {
      mode: "reference_only_with_non_actionable_math",
      automaticDoseCalculation: false,
      permittedCalculations: ["volume_conversion_for_display", "unit_conversion_for_review"],
      prohibitedCalculations: ["automatic_bolus_order", "patient_specific_prescription"],
      requireClinicianConfirmation: true
    },
    clinicalFlags: [
      "mh_trigger",
      "hyperkalemia_risk",
      "fasciculations",
      "bradycardia_risk",
      "black_box_warning"
    ],
    indications: [
      {
        id: "rsi_intubation",
        label: { en: "Rapid sequence intubation (RSI)", ar: "التنبيب الرغامي السريع لتأمين المجرى الهوائي" }
      },
      {
        id: "short_procedures",
        label: { en: "Procedures requiring brief skeletal muscle relaxation", ar: "إرخاء العضلات قصير الأمد للإجراءات الجراحية السريعة" }
      }
    ],
    presentations: [
      {
        concentration: 20,
        unit: DOSE_UNITS.MG_PER_ML,
        label: "20 mg/mL",
        isDefault: true
      },
      {
        concentration: 50,
        unit: DOSE_UNITS.MG_PER_ML,
        label: "50 mg/mL (Concentrate - requires dilution/special handling)"
      }
    ],
    pharmacodynamics: {
      onset: "30 – 60 ثانية",
      timeToMaxBlock: "1 – 1.5 دقيقة",
      duration: "5 – 10 دقائق (استقلاب سريع بإنزيم البوتيريل كولينستراز البلازمي)",
      variabilityFactors: [
        "pseudocholinesterase_activity",
        "dose",
        "organ_perfusion",
        "body_temperature"
      ]
    },
    storage: {
      source: "manufacturer_label",
      productSpecific: true,
      note: "يُحفظ مبرداً وفق تعليمات النشرة المحلية للمستحضر."
    },
    neuromuscularMonitoring: {
      required: false,
      modality: "qualitative_or_quantitative",
      notes: "لا يتطلب مراقبة كمية روتينية للجرعة المفردة القصيرة، ولكن تُستخدم المراقبة عند الاشتباه في نقص الكولينستراز أو الحصر الممتد (Phase II Block)."
    },
    clinicalContexts: [
      {
        id: "adult_rsi_induction",
        population: "adult",
        route: "IV",
        label: "التنبيب السريع للبالغين (Adult RSI / Standard Intubation)",
        doseMin: 1.0,
        doseMax: 1.5,
        unit: DOSE_UNITS.MG_PER_KG,
        doseType: "weight_bolus",
        basis: "weight_based_reference",
        administration: {
          method: "rapid_iv_push"
        },
        weightPolicy: {
          allowed: ["TBW", "IBW", "ABW"],
          preferred: "TBW",
          note: "توصي العديد من المراجع بالحساب على الوزن الكلي (TBW) نظراً لحجم التوزيع ونشاط الكولينستراز؛ راجع بروتوكول المؤسسة في السمنة المفرطة."
        },
        validation: {
          requireAge: true,
          requireWeight: true,
          requireAllergyReview: true,
          requireMonitoringConfirmation: true
        },
        isDefault: true,
        note: "تسبق الشلل العضلي ارتعاشات عضلية عابرة (Fasciculations)."
      },
      {
        id: "infant_rsi",
        population: "infant",
        route: "IV",
        label: "التنبيب للرضع (Infant Intubation)",
        doseMin: 1.5,
        doseMax: 2.0,
        unit: DOSE_UNITS.MG_PER_KG,
        doseType: "weight_bolus",
        basis: "weight_based_reference",
        administration: {
          method: "rapid_iv_push"
        },
        weightPolicy: {
          allowed: ["TBW"],
          preferred: "TBW"
        },
        validation: {
          requireAge: true,
          requireWeight: true
        },
        note: "يتطلب الرضع جرعات أعلى نسبياً لزيادة حجم السائل خارج الخلوي؛ يوصى بمراعاة إعطاء الأتروبين وقائياً لتجنب بطء القلب الشديد."
      },
      {
        id: "child_rsi",
        population: "child",
        route: "IV",
        label: "التنبيب للأطفال (Child Intubation)",
        doseMin: 1.0,
        doseMax: 1.5,
        unit: DOSE_UNITS.MG_PER_KG,
        doseType: "weight_bolus",
        basis: "weight_based_reference",
        administration: {
          method: "rapid_iv_push"
        },
        weightPolicy: {
          allowed: ["TBW"],
          preferred: "TBW"
        },
        validation: {
          requireAge: true,
          requireWeight: true
        }
      }
    ],
    interactions: [
      { agent: "volatile_anesthetics", effect: "تحريض متلازمة فرط الحرارة الخبيث (Malignant Hyperthermia)" },
      { agent: "anticholinesterases", effect: "إطالة مدة الشلل العضلي بتثبيط استقلاب السكوسينيل كولين" }
    ],
    toxicitySignals: ["hyperkalemic_cardiac_arrest", "malignant_hyperthermia", "masseter_spasm", "prolonged_apnea"],
    warnings: [
      "⚠️ تحذير الصندوق الأسود (Black Box Warning): خطر توقف القلب الحاد الناجم عن فرط بوتاسيوم الدم المفاجئ، لا سيما لدى الأطفال واليافعين المصابين باعتلالات عضلية هيكلية غير مشخصة (مثل داء دوشين Duchenne).",
      "⚠️ محرض لمتلازمة فرط الحرارة الخبيث (Malignant Hyperthermia Trigger): راجع بروتوكول الطوارئ المخصص للتعامل مع الحالة فوراً.",
      "يرفع مستوى بوتاسيوم المصل بمقدار 0.5 - 1.0 mEq/L في المرضى السليمين، وقد يسبب ارتفاعاً خطيراً في حالات الحروق والرضوض والأذيات العصبية.",
      "قد يسبب بطء قلب جيبي حاد وتوقف انقباض؛ يجب توفر الأتروبين جاهزاً."
    ],
    precautions: [
      "نقص إنزيم الكولينستراز الكاذب (Pseudocholinesterase Deficiency): يسبب شللاً عضلياً ممتداً يتطلب استمرار التهوية الآلية حتى التعافي التلقائي.",
      "تجنب تكرار الجرعات لتفادي حدوث حصر الطور الثاني (Phase II Block)."
    ],
    contraindications: [
      "الاستعداد الوراثي أو السوابق العائلية لمتلازمة فرط الحرارة الخبيث.",
      "فرط بوتاسيوم الدم المثبت أو الحالات ذات الخطورة العالية لتحرر البوتاسيوم (الحروق الواسعة، الرضوض الشديدة، الأذيات المزيلة للتعصيب بعد مرور >24-48 ساعة).",
      "الاعتلالات العضلية الهيكلية الوراثية (مثل Duchenne Muscular Dystrophy).",
      "نقص إنزيم الكولينستراز البلازمي الوراثي المتماثل الزيجوت (Homozygous Atypical Pseudocholinesterase)."
    ],
    references: [
      {
        organization: "FDA",
        title: "Succinylcholine Chloride Injection Prescribing Information & Boxed Warning",
        documentId: null,
        revisionDate: null,
        url: null,
        evidenceLevel: "regulatory",
        verificationStatus: "pending",
        accessedAt: null
      }
    ]
  },

  // =========================================================================
  // B) NON-DEPOLARIZING NEUROMUSCULAR BLOCKING AGENTS (المرخيات غير المزيلة للاستقطاب)
  // =========================================================================
  {
    id: "rocuronium",
    name: {
      generic: "Rocuronium Bromide",
      arabic: "روكورونيوم",
      brandNames: ["Zemuron", "Esmeron"]
    },
    classification: {
      triadComponent: "muscle_relaxation",
      category: "non_depolarizing_nmba",
      subcategory: "aminosteroid"
    },
    availability: {
      status: "standard",
      regionDependent: false
    },
    evidence: {
      status: "pending_formal_clinician_review",
      sourceOrganization: "FDA",
      documentTitle: "Zemuron (Rocuronium Bromide Injection) Prescribing Information",
      evidenceLevel: "regulatory"
    },
    safety: {
      highRiskMedication: true,
      operationalSafetyRequirements: [
        "airway_equipment_available",
        "bag_valve_mask_ready",
        "continuous_respiratory_monitoring",
        "quantitative_neuromuscular_monitor_available"
      ]
    },
    calculationPolicy: {
      mode: "reference_only_with_non_actionable_math",
      automaticDoseCalculation: false,
      permittedCalculations: ["volume_conversion_for_display", "unit_conversion_for_review"],
      prohibitedCalculations: ["automatic_bolus_order", "patient_specific_prescription"],
      requireClinicianConfirmation: true
    },
    clinicalFlags: ["reversal_with_sugammadex", "aminosteroid", "intermediate_acting", "rsi_alternative"],
    indications: [
      {
        id: "routine_intubation",
        label: { en: "Routine endotracheal intubation", ar: "التنبيب الرغامي الروتيني للعمليات الجراحية" }
      },
      {
        id: "rsi_intubation",
        label: { en: "Rapid sequence intubation (RSI)", ar: "التنبيب الرغامي السريع كبديل للسكوسينيل كولين" }
      },
      {
        id: "intraop_maintenance",
        label: { en: "Intraoperative skeletal muscle relaxation", ar: "المحافظة على إرخاء العضلات أثناء الجراحة والتهوية الآلية" }
      }
    ],
    presentations: [
      {
        concentration: 10,
        unit: DOSE_UNITS.MG_PER_ML,
        label: "10 mg/mL",
        isDefault: true
      }
    ],
    pharmacodynamics: {
      onset: "60 – 90 ثانية (بجرعة 0.6 mg/kg) / 45 – 60 ثانية (بجرعة 1.0 - 1.2 mg/kg)",
      timeToMaxBlock: "1 – 2 دقيقة",
      duration: "30 – 60 دقيقة (يمتد إلى >60 دقيقة بجرعات RSI العالية)",
      variabilityFactors: [
        "dose",
        "age",
        "hepatic_function",
        "renal_function",
        "volatile_anesthetic_exposure",
        "body_temperature"
      ]
    },
    storage: {
      source: "manufacturer_label",
      productSpecific: true,
      note: "يُحفظ في الثلاجة (2°C - 8°C). يحدد الملصق المحلي مدة الصلاحية عند التخزين بدرجة حرارة الغرفة."
    },
    neuromuscularMonitoring: {
      required: true,
      modality: "quantitative_preferred",
      metrics: ["TOF_count", "TOF_ratio", "PTC"],
      extubationTarget: {
        metric: "TOF_ratio",
        threshold: 0.9,
        note: "يوصى بعدم نزع الأنبوب إلا بعد تعافي نسبة TOF إلى ≥ 0.9 كمياً."
      }
    },
    clinicalContexts: [
      {
        id: "standard_intubation",
        population: "adult",
        route: "IV",
        label: "التنبيب الرغامي القياسي (Standard Intubation - 2x ED95)",
        doseMin: 0.6,
        doseMax: 0.6,
        unit: DOSE_UNITS.MG_PER_KG,
        doseType: "weight_bolus",
        basis: "weight_based_reference",
        administration: {
          method: "rapid_iv_push"
        },
        weightPolicy: {
          allowed: ["IBW", "LBW", "TBW", "ABW"],
          preferred: "IBW",
          note: "تختلف المراجع بين الاعتماد على IBW لتجنب إطالة الحصر أو TBW لسرعة البدء؛ راجع بروتوكول المؤسسة في السمنة."
        },
        validation: {
          requireAge: true,
          requireWeight: true,
          requireWeightType: true,
          requireAllergyReview: true,
          requireMonitoringConfirmation: true
        },
        isDefault: true,
        note: "يوفر ظروف تنبيب ملائمة خلال 60 إلى 90 ثانية."
      },
      {
        id: "rsi_intubation",
        population: "adult",
        route: "IV",
        label: "التنبيب السريع (RSI Intubation - High Dose)",
        doseMin: 1.0,
        doseMax: 1.2,
        unit: DOSE_UNITS.MG_PER_KG,
        doseType: "weight_bolus",
        basis: "weight_based_reference",
        administration: {
          method: "rapid_iv_push"
        },
        weightPolicy: {
          allowed: ["IBW", "LBW", "TBW", "ABW"],
          preferred: "IBW"
        },
        validation: {
          requireAge: true,
          requireWeight: true,
          requireWeightType: true
        },
        note: "يوفر ظروف تنبيب سريعة خلال 45-60 ثانية مع إطالة زمن التعافي السريري."
      },
      {
        id: "maintenance_bolus",
        population: "adult",
        route: "IV",
        label: "جرعات المحافظة الجراحية (Maintenance Bolus)",
        doseMin: 0.1,
        doseMax: 0.2,
        unit: DOSE_UNITS.MG_PER_KG,
        doseType: "weight_bolus",
        basis: "guided_by_nmt",
        titration: {
          guidedBy: "quantitative_NMT",
          triggerMetric: "TOF_count_reappearance (T1 or T2)",
          avoidFixedIntervalDosing: true
        },
        administration: {
          method: "slow_push"
        },
        weightPolicy: {
          allowed: ["IBW", "TBW"],
          preferred: "IBW"
        },
        validation: {
          requireMonitoringConfirmation: true
        },
        note: "تُعطى استرشاداً بالمراقبة العضلية عند ظهور النفضة الأولى أو الثانية (T1/T2)."
      }
    ],
    interactions: [
      { agent: "volatile_anesthetics", effect: "تعزيز وتمديد قوة ومدة الحصر العصبي العضلي" },
      { agent: "sugammadex", effect: "عكس نوعي للحصر العصبي العضلي بالارتباط المباشر" },
      { agent: "magnesium_sulfate", effect: "تعزيز وإطالة مدة الحصر العضلي" }
    ],
    toxicitySignals: ["prolonged_neuromuscular_blockade"],
    warnings: [
      "شلل عضلي كامل يشمل عضلات التنفس؛ يتطلب التهوية الآلية الفورية وتأمين المجرى الهوائي.",
      "تطول مدة المفعول في مرضى القصور الكبدي والانسداد الصفراوي (طريق الإطراح الكبدي الأساسي).",
      "في حالات العكس الفوري الطارئ لجرعات RSI العالية ($1.2\text{ mg/kg}$)، يشير ملصق Sugammadex إلى جرعة $16\text{ mg/kg}$."
    ],
    precautions: [
      "تأكد من استقرار الدواء وتاريخ سحبه من الثلاجة وفق ملصق الشركة المصنعة."
    ],
    contraindications: [
      "فرط الحساسية المعروفة للروكورونيوم أو لمركبات الأمينوستيرويد."
    ],
    references: [
      {
        organization: "FDA",
        title: "Zemuron (Rocuronium Bromide) Prescribing Information",
        documentId: null,
        revisionDate: null,
        url: null,
        evidenceLevel: "regulatory",
        verificationStatus: "pending",
        accessedAt: null
      }
    ]
  },

  {
    id: "vecuronium",
    name: {
      generic: "Vecuronium Bromide",
      arabic: "فيكورونيوم",
      brandNames: ["Norcuron"]
    },
    classification: {
      triadComponent: "muscle_relaxation",
      category: "non_depolarizing_nmba",
      subcategory: "aminosteroid"
    },
    availability: {
      status: "standard",
      regionDependent: false
    },
    evidence: {
      status: "pending_formal_clinician_review",
      sourceOrganization: "FDA",
      documentTitle: "Norcuron (Vecuronium Bromide for Injection) Prescribing Information",
      evidenceLevel: "regulatory"
    },
    safety: {
      highRiskMedication: true,
      operationalSafetyRequirements: [
        "airway_equipment_available",
        "bag_valve_mask_ready",
        "continuous_respiratory_monitoring",
        "quantitative_neuromuscular_monitor_available"
      ]
    },
    calculationPolicy: {
      mode: "reference_only_with_non_actionable_math",
      automaticDoseCalculation: false,
      permittedCalculations: ["volume_conversion_for_display"],
      prohibitedCalculations: ["automatic_bolus_order"],
      requireClinicianConfirmation: true
    },
    clinicalFlags: ["reversal_with_sugammadex", "aminosteroid", "intermediate_acting", "requires_reconstitution"],
    indications: [
      {
        id: "routine_intubation",
        label: { en: "Routine endotracheal intubation", ar: "التنبيب الرغامي في التخدير العام" }
      },
      {
        id: "intraop_maintenance",
        label: { en: "Maintenance of neuromuscular blockade", ar: "المحافظة على الحصر العصبي العضلي أثناء الجراحة" }
      }
    ],
    presentations: [
      {
        concentration: 1,
        unit: DOSE_UNITS.MG_PER_ML,
        label: "1 mg/mL (10 mg Powder Reconstituted in 10 mL Sterile Water)",
        isDefault: true,
        requiresReconstitution: true
      },
      {
        concentration: 2,
        unit: DOSE_UNITS.MG_PER_ML,
        label: "2 mg/mL (10 mg Powder Reconstituted in 5 mL Sterile Water)",
        requiresReconstitution: true
      }
    ],
    pharmacodynamics: {
      onset: "2 – 3 دقائق",
      timeToMaxBlock: "3 – 5 دقائق",
      duration: "25 – 40 دقيقة",
      variabilityFactors: [
        "dose",
        "age",
        "renal_function",
        "hepatic_function",
        "volatile_anesthetics"
      ]
    },
    storage: {
      source: "manufacturer_label",
      productSpecific: true,
      note: "يأتي كمسحوق جاف؛ مدة ثبات المحلول بعد الحل تعتمد على نشرة المستحضر وسائله المستخدم."
    },
    neuromuscularMonitoring: {
      required: true,
      modality: "quantitative_preferred",
      metrics: ["TOF_count", "TOF_ratio", "PTC"],
      extubationTarget: {
        metric: "TOF_ratio",
        threshold: 0.9
      }
    },
    clinicalContexts: [
      {
        id: "standard_intubation",
        population: "adult",
        route: "IV",
        label: "التنبيب الرغامي القياسي (Standard Intubation Bolus)",
        doseMin: 0.08,
        doseMax: 0.1,
        unit: DOSE_UNITS.MG_PER_KG,
        doseType: "weight_bolus",
        basis: "weight_based_reference",
        administration: {
          method: "slow_push"
        },
        weightPolicy: {
          allowed: ["IBW", "LBW", "TBW"],
          preferred: "IBW",
          note: "توصي مراجع التخدير بالحساب على الوزن المثالي (IBW) في مرضى السمنة."
        },
        validation: {
          requireAge: true,
          requireWeight: true,
          requireWeightType: true,
          requireAllergyReview: true,
          requireMonitoringConfirmation: true
        },
        isDefault: true,
        note: "يتطلب الحل بالماء المعقم للحقن قبل الاستعمال."
      },
      {
        id: "maintenance_bolus",
        population: "adult",
        route: "IV",
        label: "جرعات المحافظة (Maintenance Bolus - FDA Labeled Range)",
        doseMin: 0.01,
        doseMax: 0.015,
        unit: DOSE_UNITS.MG_PER_KG,
        doseType: "weight_bolus",
        basis: "guided_by_nmt",
        titration: {
          guidedBy: "quantitative_NMT",
          triggerMetric: "TOF_count_reappearance"
        },
        administration: {
          method: "slow_push"
        },
        weightPolicy: {
          allowed: ["IBW"]
        },
        validation: {
          requireMonitoringConfirmation: true
        },
        note: "تُعطى عند بدء استعادة الاستجابة في مراقبة TOF (نطاق النشرة المعتمد 0.01 - 0.015 mg/kg)."
      }
    ],
    interactions: [
      { agent: "sugammadex", effect: "عكس نوعي للحصر العضلي بالارتباط المباشر" },
      { agent: "volatile_anesthetics", effect: "تمديد مدة الحصر العصبي العضلي" }
    ],
    toxicitySignals: ["prolonged_paralysis_renal_failure"],
    warnings: [
      "شلل عضلات التنفس؛ يتطلب التهوية الآلية الفورية.",
      "قد يطول مفعوله في حالات القصور الكلوي أو الكبدي الشديد.",
      "يتميز بالثبات القلبي الوعائي النسبي وعدم تحرير الهيستامين الملحوظ."
    ],
    contraindications: [
      "فرط الحساسية للفيكورونيوم أو مركبات الأمينوستيرويد."
    ],
    references: [
      {
        organization: "FDA",
        title: "Norcuron (Vecuronium Bromide) Prescribing Information",
        documentId: null,
        revisionDate: null,
        url: null,
        evidenceLevel: "regulatory",
        verificationStatus: "pending",
        accessedAt: null
      }
    ]
  },

  {
    id: "cisatracurium",
    name: {
      generic: "Cisatracurium Besylate",
      arabic: "سيسأتراكوريوم",
      brandNames: ["Nimbex"]
    },
    classification: {
      triadComponent: "muscle_relaxation",
      category: "non_depolarizing_nmba",
      subcategory: "benzylisoquinolinium"
    },
    availability: {
      status: "standard",
      regionDependent: false
    },
    evidence: {
      status: "pending_formal_clinician_review",
      sourceOrganization: "FDA",
      documentTitle: "Nimbex (Cisatracurium Besylate Injection) Prescribing Information",
      evidenceLevel: "regulatory"
    },
    safety: {
      highRiskMedication: true,
      operationalSafetyRequirements: [
        "airway_equipment_available",
        "bag_valve_mask_ready",
        "continuous_respiratory_monitoring",
        "quantitative_neuromuscular_monitor_available"
      ]
    },
    calculationPolicy: {
      mode: "reference_only_with_non_actionable_math",
      automaticDoseCalculation: false,
      permittedCalculations: ["volume_conversion_for_display", "unit_conversion_for_review"],
      prohibitedCalculations: ["automatic_bolus_order", "automatic_infusion_start"],
      requireClinicianConfirmation: true
    },
    clinicalFlags: ["hofmann_elimination", "organ_independent", "renal_failure_option", "no_histamine_release"],
    indications: [
      {
        id: "routine_intubation",
        label: { en: "Endotracheal intubation and skeletal muscle relaxation", ar: "التنبيب الرغامي وإرخاء العضلات أثناء التخدير العام" }
      },
      {
        id: "icu_paralysis",
        label: { en: "Neuromuscular blockade in ICU mechanically ventilated patients", ar: "إرخاء العضلات لمرضى العناية المركزة لتسهيل التهوية المتزامنة" }
      }
    ],
    presentations: [
      {
        concentration: 2,
        unit: DOSE_UNITS.MG_PER_ML,
        label: "2 mg/mL",
        isDefault: true
      },
      {
        concentration: 10,
        unit: DOSE_UNITS.MG_PER_ML,
        label: "10 mg/mL (ICU Infusion Concentrate)"
      }
    ],
    pharmacodynamics: {
      onset: "2 – 3 دقائق (بجرعة 0.15 mg/kg) / 1.5 – 2 دقيقة (بجرعة 0.2 mg/kg)",
      timeToMaxBlock: "3 – 5 دقائق",
      duration: "45 – 60 دقيقة (استقلاب ذاتي عبر تفاعل هوفمان Hofmann Elimination والتحلل الإستري)",
      variabilityFactors: [
        "body_temperature",
        "acid_base_status",
        "dose",
        "volatile_anesthetics"
      ]
    },
    storage: {
      source: "manufacturer_label",
      productSpecific: true,
      note: "يُحفظ مبرداً (2°C - 8°C) ومحمياً من الضوء وفق نشرة المستحضر."
    },
    neuromuscularMonitoring: {
      required: true,
      modality: "quantitative_preferred",
      metrics: ["TOF_count", "TOF_ratio", "PTC"],
      extubationTarget: {
        metric: "TOF_ratio",
        threshold: 0.9
      }
    },
    clinicalContexts: [
      {
        id: "standard_intubation",
        population: "adult",
        route: "IV",
        label: "التنبيب الرغامي القياسي (Standard Intubation - 3x ED95)",
        doseMin: 0.15,
        doseMax: 0.2,
        unit: DOSE_UNITS.MG_PER_KG,
        doseType: "weight_bolus",
        basis: "weight_based_reference",
        administration: {
          method: "slow_iv_push"
        },
        weightPolicy: {
          allowed: ["IBW", "LBW", "TBW"],
          preferred: "IBW"
        },
        validation: {
          requireAge: true,
          requireWeight: true,
          requireWeightType: true,
          requireAllergyReview: true,
          requireMonitoringConfirmation: true
        },
        isDefault: true,
        note: "الاستقلاب غير المعتمد على الأعضاء يجعل السيسأتراكوريوم خياراً مفيداً سريرياً في القصور الكلوي أو الكبدي."
      },
      {
        id: "maintenance_bolus",
        population: "adult",
        route: "IV",
        label: "جرعات المحافظة الجراحية (Maintenance Bolus)",
        doseMin: 0.03,
        doseMax: 0.03,
        unit: DOSE_UNITS.MG_PER_KG,
        doseType: "weight_bolus",
        basis: "guided_by_nmt",
        titration: {
          guidedBy: "quantitative_NMT",
          triggerMetric: "TOF_count_reappearance"
        },
        administration: {
          method: "slow_push"
        },
        weightPolicy: {
          allowed: ["IBW"]
        },
        validation: {
          requireMonitoringConfirmation: true
        },
        note: "توفر نحو 20 دقيقة إضافية من الإرخاء العضلي الجراحي."
      },
      {
        id: "icu_continuous_infusion",
        population: "adult_icu",
        route: "IV",
        label: "التسريب المستمر في العناية المركزة (ICU Infusion Rate)",
        doseMin: 1.0,
        doseMax: 3.0,
        unit: DOSE_UNITS.MCG_PER_KG_MIN,
        doseType: "weight_infusion_min",
        basis: "titrated_to_tof_target",
        administration: {
          method: "continuous_infusion_only"
        },
        weightPolicy: {
          allowed: ["IBW"]
        },
        validation: {
          requireWeight: true,
          requireMonitoringConfirmation: true
        },
        note: "يُعاير التسريب للحفاظ على عمق الحصر المستهدف بمراقبة TOF."
      }
    ],
    interactions: [
      { agent: "sugammadex", effect: "غير مصرح به لعكس السيسأتراكوريوم (not indicated for reversal of cisatracurium)؛ يُعكس بالنيوستيغمين" },
      { agent: "volatile_anesthetics", effect: "تعزيز الحصر العصبي العضلي" }
    ],
    toxicitySignals: ["prolonged_blockade_hypothermia_acidosis"],
    warnings: [
      "يتأثر تفاعل هوفمان بحرارة الجسم ودرجة الحموضة؛ انخفاض الحرارة والحماض يبطئان الاستقلاب ويطيلان مدة الشلل.",
      "لا يُعكس بالسوجاماديكس (Not reversed by sugammadex)؛ يتطلب استخدام النيوستيغمين بعد بدء التعافي التلقائي.",
      "لا يحرر الهيستامين بجرعاته السريرية المعتادة ويتميز بالثبات القلبي الوعائي."
    ],
    contraindications: [
      "فرط الحساسية للسيسأتراكوريوم أو الأتراكوريوم أو حمض البنزين سلفونيك."
    ],
    references: [
      {
        organization: "FDA",
        title: "Nimbex (Cisatracurium Besylate) Prescribing Information",
        documentId: null,
        revisionDate: null,
        url: null,
        evidenceLevel: "regulatory",
        verificationStatus: "pending",
        accessedAt: null
      }
    ]
  },

  {
    id: "atracurium",
    name: {
      generic: "Atracurium Besylate",
      arabic: "أتراكوريوم",
      brandNames: ["Tracrium"]
    },
    classification: {
      triadComponent: "muscle_relaxation",
      category: "non_depolarizing_nmba",
      subcategory: "benzylisoquinolinium"
    },
    availability: {
      status: "standard",
      regionDependent: false
    },
    evidence: {
      status: "pending_formal_clinician_review",
      sourceOrganization: "FDA",
      documentTitle: "Tracrium (Atracurium Besylate Injection) Prescribing Information",
      evidenceLevel: "regulatory"
    },
    safety: {
      highRiskMedication: true,
      operationalSafetyRequirements: [
        "airway_equipment_available",
        "bag_valve_mask_ready",
        "continuous_respiratory_monitoring",
        "quantitative_neuromuscular_monitor_available"
      ]
    },
    calculationPolicy: {
      mode: "reference_only_with_non_actionable_math",
      automaticDoseCalculation: false,
      permittedCalculations: ["volume_conversion_for_display"],
      prohibitedCalculations: ["automatic_bolus_order"],
      requireClinicianConfirmation: true
    },
    clinicalFlags: ["hofmann_elimination", "histamine_release", "organ_independent", "laudanosine_metabolite"],
    indications: [
      {
        id: "routine_intubation",
        label: { en: "Endotracheal intubation and surgical relaxation", ar: "التنبيب الرغامي وإرخاء العضلات الجراحي" }
      }
    ],
    presentations: [
      {
        concentration: 10,
        unit: DOSE_UNITS.MG_PER_ML,
        label: "10 mg/mL",
        isDefault: true
      }
    ],
    pharmacodynamics: {
      onset: "2 – 2.5 دقيقة",
      timeToMaxBlock: "3 – 5 دقائق",
      duration: "30 – 45 دقيقة (استقلاب هوفمان + تحلل إستري غير نوعي)",
      variabilityFactors: [
        "body_temperature",
        "acid_base_status",
        "dose"
      ]
    },
    storage: {
      source: "manufacturer_label",
      productSpecific: true,
      note: "يُحفظ مبرداً (2°C - 8°C) وفق نشرة المستحضر."
    },
    neuromuscularMonitoring: {
      required: true,
      modality: "quantitative_preferred",
      metrics: ["TOF_count", "TOF_ratio", "PTC"],
      extubationTarget: {
        metric: "TOF_ratio",
        threshold: 0.9
      }
    },
    clinicalContexts: [
      {
        id: "standard_intubation",
        population: "adult",
        route: "IV",
        label: "جرعة التنبيب القياسية (Standard Intubation Bolus)",
        doseMin: 0.4,
        doseMax: 0.5,
        unit: DOSE_UNITS.MG_PER_KG,
        doseType: "weight_bolus",
        basis: "weight_based_reference",
        administration: {
          method: "slow_push",
          duration: "حقن وريدي بطيء على مدى دقيقة لتقليل احتمالية تحرر الهيستامين"
        },
        weightPolicy: {
          allowed: ["IBW", "LBW", "TBW"],
          preferred: "IBW"
        },
        validation: {
          requireAge: true,
          requireWeight: true,
          requireAllergyReview: true,
          requireMonitoringConfirmation: true
        },
        isDefault: true,
        note: "الحقن البطيء يقلل من مخاطر هبوط الضغط وتورد الوجه."
      },
      {
        id: "maintenance_bolus",
        population: "adult",
        route: "IV",
        label: "جرعات المحافظة (Maintenance Bolus)",
        doseMin: 0.08,
        doseMax: 0.1,
        unit: DOSE_UNITS.MG_PER_KG,
        doseType: "weight_bolus",
        basis: "guided_by_nmt",
        titration: {
          guidedBy: "quantitative_NMT",
          triggerMetric: "TOF_count_reappearance"
        },
        administration: {
          method: "slow_push"
        },
        weightPolicy: {
          allowed: ["IBW"]
        },
        validation: {
          requireMonitoringConfirmation: true
        },
        note: "تُكرر استرشاداً بالمراقبة العضلية كل 15-25 دقيقة بحسب الحاجة."
      }
    ],
    interactions: [
      { agent: "sugammadex", effect: "لا يُعكس بالسوجاماديكس (not reversed by sugammadex)؛ يتطلب النيوستيغمين بعد بدء التعافي التلقائي" }
    ],
    toxicitySignals: ["histamine_induced_bronchospasm", "severe_hypotension"],
    warnings: [
      "قد يحرر مادة الهيستامين عند الحقن السريع مسبباً تورد الوجه، هبوط الضغط، أو تشنج القصبات لدى المرضى المعرضين.",
      "مستقلبه (لودانوزين Laudanosine) قد يمتلك تأثيراً منبهاً عصبياً عند التسريب المطول جداً في العناية المركزة.",
      "لا يستجيب للسوجاماديكس؛ يتطلب النيوستيغمين للعكس."
    ],
    contraindications: [
      "فرط الحساسية المعروفة للأتراكوريوم أو السيسأتراكوريوم."
    ],
    references: [
      {
        organization: "FDA",
        title: "Tracrium (Atracurium Besylate) Prescribing Information",
        documentId: null,
        revisionDate: null,
        url: null,
        evidenceLevel: "regulatory",
        verificationStatus: "pending",
        accessedAt: null
      }
    ]
  },

  // =========================================================================
  // C) REVERSAL AGENTS & ANTIMUSCARINICS (مضادات الحصر العصبي العضلي)
  // =========================================================================
  {
    id: "sugammadex",
    name: {
      generic: "Sugammadex Sodium",
      arabic: "سوجاماديكس (بريديون)",
      brandNames: ["Bridion"]
    },
    classification: {
      triadComponent: "muscle_relaxation",
      category: "selective_relaxant_binding_agent",
      subcategory: "modified_gamma_cyclodextrin"
    },
    availability: {
      status: "standard",
      regionDependent: false
    },
    evidence: {
      status: "pending_formal_clinician_review",
      sourceOrganization: "FDA",
      documentTitle: "Bridion (Sugammadex Injection) Prescribing Information",
      evidenceLevel: "regulatory"
    },
    safety: {
      highRiskMedication: true,
      operationalSafetyRequirements: [
        "quantitative_neuromuscular_monitor_available",
        "atropine_available_for_bradycardia",
        "continuous_hemodynamic_monitoring"
      ]
    },
    calculationPolicy: {
      mode: "reference_only_with_non_actionable_math",
      automaticDoseCalculation: false,
      permittedCalculations: ["volume_conversion_for_display", "unit_conversion_for_review"],
      prohibitedCalculations: ["automatic_bolus_order", "patient_specific_prescription"],
      requireClinicianConfirmation: true
    },
    clinicalFlags: [
      "depth_dependent_dosing",
      "rocuronium_vecuronium_specific",
      "contraceptive_interaction",
      "bradycardia_risk"
    ],
    indications: [
      {
        id: "reversal_rocuronium_vecuronium",
        label: { en: "Reversal of neuromuscular blockade induced by rocuronium or vecuronium", ar: "عكس الحصر العصبي العضلي الناجم عن الروكورونيوم أو الفيكورونيوم في البالغين والأطفال" }
      }
    ],
    presentations: [
      {
        concentration: 100,
        unit: DOSE_UNITS.MG_PER_ML,
        label: "100 mg/mL",
        isDefault: true
      }
    ],
    pharmacodynamics: {
      onset: "سريع (ارتباط جزيئي مباشر بنسبة 1:1 مع الروكورونيوم/الفيكورونيوم)",
      recoveryProfile: {
        endpoint: "TOF_ratio_0.9",
        dependsOn: [
          "block_depth_at_administration",
          "dose_administered",
          "target_nmba",
          "patient_renal_function",
          "quantitative_monitoring_guidance"
        ]
      },
      duration: "إطراح كلوي للمركب المعقد دون تبدل استقلابي"
    },
    neuromuscularMonitoring: {
      required: true,
      modality: "quantitative_preferred",
      metrics: ["TOF_count", "TOF_ratio", "PTC"],
      extubationTarget: {
        metric: "TOF_ratio",
        threshold: 0.9,
        note: "تأكيد الوصول لنسبة TOF ≥ 0.9 كمياً قبل نزع الأنبوب الرغامي."
      }
    },
    clinicalContexts: [
      {
        id: "moderate_block_reversal",
        population: "adult_pediatric",
        route: "IV",
        label: "عكس الحصر المتوسط (Moderate Block Reversal - At least T2 reappearance)",
        doseMin: 2.0,
        doseMax: 2.0,
        unit: DOSE_UNITS.MG_PER_KG,
        doseType: "weight_bolus",
        basis: "weight_based_tbw",
        nmtCriteria: {
          metric: "TOF_count",
          threshold: "≥ 2 twitches",
          note: "ظهور النفضة الثانية (T2) على الأقل في قطار الأربعة."
        },
        administration: {
          method: "rapid_iv_bolus",
          duration: "حقن وريدي دفعي مباشر خلال 10 ثوانٍ"
        },
        weightPolicy: {
          allowed: ["TBW"],
          preferred: "TBW",
          note: "تنص النشرة المعتمدة على الحساب على الوزن الفعلي الكلي (TBW) حتى في مرضى السمنة."
        },
        validation: {
          requireAge: true,
          requireWeight: true,
          requireWeightType: true,
          requireIndication: true,
          requireMonitoringConfirmation: true
        },
        isDefault: true
      },
      {
        id: "deep_block_reversal",
        population: "adult_pediatric",
        route: "IV",
        label: "عكس الحصر العميق (Deep Block Reversal - 1-2 PTC, 0 TOF)",
        doseMin: 4.0,
        doseMax: 4.0,
        unit: DOSE_UNITS.MG_PER_KG,
        doseType: "weight_bolus",
        basis: "weight_based_tbw",
        nmtCriteria: {
          metric: "PTC",
          threshold: "1 – 2 post-tetanic twitches (with 0 TOF responses)",
          note: "غياب استجابة TOF مع ظهور 1-2 نفضة في العد التالي للتكزز (PTC)."
        },
        administration: {
          method: "rapid_iv_bolus"
        },
        weightPolicy: {
          allowed: ["TBW"],
          preferred: "TBW"
        },
        validation: {
          requireAge: true,
          requireWeight: true,
          requireWeightType: true,
          requireMonitoringConfirmation: true
        }
      },
      {
        id: "immediate_rescue_reversal",
        population: "adult",
        route: "IV",
        label: "العكس الفوري بعد جرعة روكورونيوم عالية (Immediate Reversal after 1.2 mg/kg Rocuronium)",
        doseMin: 16.0,
        doseMax: 16.0,
        unit: DOSE_UNITS.MG_PER_KG,
        doseType: "weight_bolus",
        basis: "weight_based_tbw",
        nmtCriteria: {
          context: "Immediate rescue after 1.2 mg/kg rocuronium bolus",
          note: "يُعطى بعد نحو 3 دقائق من إعطاء جرعة الروكورونيوم العالية عند الحاجة للعكس الفوري."
        },
        administration: {
          method: "rapid_iv_bolus"
        },
        weightPolicy: {
          allowed: ["TBW"],
          preferred: "TBW"
        },
        validation: {
          requireAge: true,
          requireWeight: true,
          requireWeightType: true
        },
        note: "خيار إنقاذ دوائي مرجعي؛ راجع بروتوكول المجرى الهوائي الصعب في حالات CICO."
      }
    ],
    interactions: [
      {
        agent: "hormonal_contraceptives",
        effect: "يرتبط بالمركبات الهرمونية؛ يماثل نسيان جرعة يومية من موانع الحمل الفموية (يوصى باستخدام وسيلة حماية إضافية غير هرمونية لمدة 7 أيام وفق النشرة)."
      },
      {
        agent: "benzylisoquinoliniums (atracurium/cisatracurium)",
        effect: "لا يؤثر عليها ولا يعكس الحصر الناجم عنها."
      }
    ],
    toxicitySignals: ["marked_bradycardia_asystole", "anaphylaxis"],
    warnings: [
      "⚠️ بطء قلب ملحوظ: قد يحدث بطء قلب حاد في غضون دقائق من الحقن؛ يوصى بالمراقبة المستمرة وتوفر الأتروبين.",
      "تفاعلات تحسسية وتأقية موثقة نادراً.",
      "تداخل موانع الحمل الهرمونية: يجب إرشاد المريضات لاستخدام وسيلة حماية غير هرمونية إضافية لمدة 7 أيام.",
      "تطاول طفيف وعابر في مؤشرات التخثر (aPTT / PT) خلال الدقائق الأولى بعد الحقن."
    ],
    precautions: [
      "القصور الكلوي الشديد (CrCl < 30 mL/min): لا توصي النشرات الرسمية باستخدامه لعدم كفاية بيانات السلامة وتأخر تصفية المعقد الدوائي."
    ],
    contraindications: [
      "فرط الحساسية المعروفة للسوجاماديكس أو مكونات المستحضر."
    ],
    references: [
      {
        organization: "FDA",
        title: "Bridion (Sugammadex Injection) Prescribing Information",
        documentId: null,
        revisionDate: null,
        url: null,
        evidenceLevel: "regulatory",
        verificationStatus: "pending",
        accessedAt: null
      }
    ]
  },

  {
    id: "neostigmine",
    name: {
      generic: "Neostigmine Methylsulfate",
      arabic: "نيوستيغمين",
      brandNames: ["Bloxiverz", "Prostigmin"]
    },
    classification: {
      triadComponent: "muscle_relaxation",
      category: "acetylcholinesterase_inhibitor",
      subcategory: "quaternary_ammonium_compound"
    },
    availability: {
      status: "standard",
      regionDependent: false
    },
    evidence: {
      status: "pending_formal_clinician_review",
      sourceOrganization: "FDA",
      documentTitle: "Bloxiverz (Neostigmine Methylsulfate Injection) Prescribing Information",
      evidenceLevel: "regulatory"
    },
    safety: {
      highRiskMedication: true,
      operationalSafetyRequirements: [
        "antimuscarinic_coadministration_mandatory",
        "quantitative_neuromuscular_monitor_available",
        "continuous_ecg_monitoring",
        "airway_equipment_available"
      ]
    },
    calculationPolicy: {
      mode: "reference_only_with_non_actionable_math",
      automaticDoseCalculation: false,
      permittedCalculations: ["volume_conversion_for_display"],
      prohibitedCalculations: ["automatic_bolus_order"],
      requireClinicianConfirmation: true
    },
    clinicalFlags: [
      "requires_antimuscarinic",
      "ceiling_effect",
      "spontaneous_recovery_dependent",
      "muscarinic_side_effects"
    ],
    indications: [
      {
        id: "ndnmba_reversal",
        label: { en: "Reversal of non-depolarizing neuromuscular blockade after spontaneous recovery has begun", ar: "عكس الحصر العصبي العضلي غير المزيل للاستقطاب بعد بدء التعافي التلقائي" }
      }
    ],
    presentations: [
      {
        concentration: 0.5,
        unit: DOSE_UNITS.MG_PER_ML,
        label: "0.5 mg/mL",
        isDefault: true
      },
      {
        concentration: 1.0,
        unit: DOSE_UNITS.MG_PER_ML,
        label: "1.0 mg/mL"
      }
    ],
    pharmacodynamics: {
      onset: "1 – 3 دقائق",
      peak: "7 – 10 دقائق (ذروة تثبيط الإنزيم)",
      duration: "50 – 90 دقيقة",
      variabilityFactors: [
        "degree_of_spontaneous_recovery",
        "antimuscarinic_agent_used",
        "renal_function"
      ]
    },
    doseLimits: {
      maximumLabeledDose: "0.07 mg/kg or 5 mg (whichever is less)",
      note: "الحد الأقصى الموصى به في النشرة الرسمية هو 0.07 mg/kg أو 5 mg أيهما أقل."
    },
    neuromuscularMonitoring: {
      required: true,
      modality: "quantitative_preferred",
      metrics: ["TOF_count", "TOF_ratio"],
      extubationTarget: {
        metric: "TOF_ratio",
        threshold: 0.9,
        note: "تأكيد تعافي نسبة TOF إلى ≥ 0.9 كمياً قبل نزع الأنبوب الرغامي."
      }
    },
    clinicalContexts: [
      {
        id: "greater_recovery_reversal",
        population: "adult_pediatric",
        route: "IV",
        label: "عكس الحصر مع تعافٍ تلقائي متقدم (Significant Spontaneous Recovery)",
        doseMin: 0.03,
        doseMax: 0.03,
        unit: DOSE_UNITS.MG_PER_KG,
        doseType: "weight_bolus",
        basis: "spontaneous_recovery_guided",
        nmtCriteria: {
          metric: "TOF_count / TOF_ratio",
          guidance: "يُستخدم عند وجود تعافٍ تلقائي متقدم (مثل عودة النفضات الأربع TOF 4/4 مع تلاشٍ بسيط)."
        },
        administration: {
          method: "slow_iv_push_with_antimuscarinic",
          duration: "حقن وريدي بطيء بالمشاركة المتزامنة مع مضاد مسكاريني (غليكوبيرولات أو أتروبين)"
        },
        weightPolicy: {
          allowed: ["IBW", "TBW"],
          preferred: "IBW"
        },
        validation: {
          requireAge: true,
          requireWeight: true,
          requireMonitoringConfirmation: true
        },
        isDefault: true,
        note: "تُحدد الجرعة وفق درجة التعافي التلقائي للمريض."
      },
      {
        id: "moderate_recovery_reversal",
        population: "adult_pediatric",
        route: "IV",
        label: "عكس الحصر مع تعافٍ تلقائي أقل (Less Spontaneous Recovery)",
        doseMin: 0.07,
        doseMax: 0.07,
        unit: DOSE_UNITS.MG_PER_KG,
        doseType: "weight_bolus",
        basis: "spontaneous_recovery_guided",
        nmtCriteria: {
          metric: "TOF_count",
          guidance: "يُستخدم عند وجود تعافٍ تلقائي أقل، شريطة وجود استجابة عضلية واضحة (Twitch response present)."
        },
        administration: {
          method: "slow_iv_push_with_antimuscarinic"
        },
        weightPolicy: {
          allowed: ["IBW", "TBW"],
          preferred: "IBW"
        },
        validation: {
          requireAge: true,
          requireWeight: true,
          requireMonitoringConfirmation: true
        },
        note: "بما لا يتجاوز الحد الأقصى الإجمالي (5 mg)."
      }
    ],
    interactions: [
      {
        agent: "glycopyrrolate",
        effect: "مشاركة إلزامية للحد من التأثيرات المسكارينية المفرطة للنيوستيغمين"
      },
      {
        agent: "atropine",
        effect: "مشاركة بديلة مناسبة للحد من التأثيرات المسكارينية"
      }
    ],
    toxicitySignals: ["severe_bradycardia_asystole", "cholinergic_crisis", "bronchospasm_hypersalivation"],
    warnings: [
      "⚠️ بطء قلب شديد وتوقف انقباض: يُلزم إعطاء مضاد مسكاريني (Glycopyrrolate أو Atropine) بالتزامن لمنع التأثيرات المسكارينية القلبية.",
      "تأثيرات كولينية جانبية: فرط الإفرازات اللعابية والتنفسية، تشنج القصبات، زيادة حركة الأمعاء.",
      "الجرعات المفرطة قد تؤدي إلى ضعف عضلي تناقضي وزيادة الحصر."
    ],
    precautions: [
      "يجب ألا يتم نزع الأنبوب الرغامي إلا بعد التحقق من كفاية التعافي العصبي العضلي (ويفضل وصول نسبة TOF إلى ≥ 0.9 كمياً)."
    ],
    contraindications: [
      "الانسداد الميكانيكي للأمعاء أو المسالك البولية.",
      "التهاب البريتون الحاد.",
      "فرط الحساسية للنيوستيغمين أو مكوناته."
    ],
    references: [
      {
        organization: "FDA",
        title: "Bloxiverz (Neostigmine Methylsulfate) Prescribing Information",
        documentId: null,
        revisionDate: null,
        url: null,
        evidenceLevel: "regulatory",
        verificationStatus: "pending",
        accessedAt: null
      }
    ]
  },

  {
    id: "glycopyrrolate",
    name: {
      generic: "Glycopyrrolate",
      arabic: "غليكوبيرولات (روبينول)",
      brandNames: ["Robinul"]
    },
    classification: {
      triadComponent: "muscle_relaxation",
      category: "antimuscarinic",
      subcategory: "quaternary_ammonium_anticholinergic"
    },
    availability: {
      status: "standard",
      regionDependent: true
    },
    evidence: {
      status: "pending_formal_clinician_review",
      sourceOrganization: "FDA",
      documentTitle: "Robinul (Glycopyrrolate Injection) Prescribing Information",
      evidenceLevel: "regulatory"
    },
    safety: {
      highRiskMedication: false,
      operationalSafetyRequirements: [
        "hemodynamic_monitoring",
        "continuous_ecg_monitoring"
      ]
    },
    calculationPolicy: {
      mode: "reference_only_with_non_actionable_math",
      automaticDoseCalculation: false,
      permittedCalculations: ["volume_conversion_for_display"],
      prohibitedCalculations: ["automatic_bolus_order"],
      requireClinicianConfirmation: true
    },
    clinicalFlags: ["reversal_adjunct", "antisialagogue", "quaternary_amine_no_cns_entry"],
    indications: [
      {
        id: "neostigmine_adjunct",
        label: { en: "Protection against muscarinic side effects of neostigmine during NMBA reversal", ar: "الحد من الآثار المسكارينية للنيوستيغمين أثناء عكس الحصر العضلي" }
      },
      {
        id: "antisialagogue_premed",
        label: { en: "Reduction of salivary and respiratory secretions", ar: "تقليل المفرزات اللعابية والتنفسية قبل التخدير والعمليات" }
      }
    ],
    presentations: [
      {
        concentration: 0.2,
        unit: DOSE_UNITS.MG_PER_ML,
        label: "0.2 mg/mL",
        isDefault: true
      }
    ],
    pharmacodynamics: {
      onset: "حوالي دقيقة واحدة (وريدياً)",
      peak: "5 – 10 دقائق (يتطابق زمنياً مع ذروة النيوستيغمين)",
      duration: "2 – 4 ساعات (التأثير المهبط للإفراز يدوم فترة أطول)"
    },
    clinicalContexts: [
      {
        id: "neostigmine_pairing",
        population: "adult_pediatric",
        route: "IV",
        label: "المشاركة المتزامنة مع النيوستيغمين (Neostigmine Reversal Pairing Ratio)",
        pairing: {
          targetAgentId: "neostigmine",
          ratioMgPerMg: 0.2,
          ruleDescription: "0.2 mg غليكوبيرولات لكل 1.0 mg نيوستيغمين"
        },
        doseMin: 0.2,
        doseMax: 0.2,
        unit: DOSE_UNITS.MG_PER_ML,
        doseType: "fixed",
        basis: "fixed_ratio_with_neostigmine",
        administration: {
          method: "slow_iv_push",
          note: "يُحقن متزامناً مع النيوستيغمين أو قبله مباشرة في نفس المحقنة أو وريدياً ببطء."
        },
        weightPolicy: {
          allowed: ["IBW", "TBW"],
          preferred: "IBW"
        },
        validation: {
          requireMonitoringConfirmation: true
        },
        isDefault: true,
        note: "النسبة المعيارية الشائعة: 0.2 mg غليكوبيرولات لكل 1 mg نيوستيغمين."
      }
    ],
    interactions: [
      { agent: "neostigmine", effect: "يحد من بطء القلب، فرط الإفرازات اللعابية، والتشنج القصبي المحرض بالنيوستيغمين" }
    ],
    toxicitySignals: ["severe_tachycardia", "urinary_retention"],
    warnings: [
      "مركب أمونيومي رباعي لا يعبر الحاجز الدموي الدماغي (BBB) بشكل ملحوظ مقارنة بالأتروبين.",
      "تسارع ضربات القلب وجفاف الفم.",
      "احتباس البول وتأخر إفراغ المثانة."
    ],
    precautions: [
      "الزرق ضيق الزاوية وتسرع القلب غير المستقر."
    ],
    contraindications: [
      "الانسداد البولي أو الهضمي الميكانيكي.",
      "فرط الحساسية للغليكوبيرولات."
    ],
    references: [
      {
        organization: "FDA",
        title: "Robinul (Glycopyrrolate) Prescribing Information",
        documentId: null,
        revisionDate: null,
        url: null,
        evidenceLevel: "regulatory",
        verificationStatus: "pending",
        accessedAt: null
      }
    ]
  }
];
