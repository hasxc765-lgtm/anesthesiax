/**
 * AnesthesiaX — Drug Center: Hypnosis & Induction Data Module
 * Component: Anesthesia Triad — Part 2 (Hypnosis)
 * File: js/data/drugs/hypnosisData.js
 *
 * Advanced Clinical Decision Support (CDS) Dataset
 * Canonical Schema — Validated against FDA Approved Prescribing Information (2024–2026),
 * Miller's Anesthesia 9th Ed, and Pediatric Anesthesia Guidelines.
 */

import { DOSE_UNITS } from "../common/doseUnits.js";

export const hypnosisData = [
  // =========================================================================
  // A) INTRAVENOUS INDUCTION AGENTS (أدوية التحريض والتنويم الوريدي)
  // =========================================================================
  {
    id: "propofol",
    name: {
      generic: "Propofol",
      arabic: "بروبوفول",
      brandNames: ["Diprivan", "Propoven"]
    },
    classification: {
      triadComponent: "hypnosis",
      category: "iv_hypnotic",
      subcategory: "alkylphenol_derivative"
    },
    availability: {
      status: "standard",
      regionDependent: true,
      note: "متوفر عالمياً بتركيز 1% وبشكل محدود بتركيز 2%."
    },
    evidence: {
      sourceOrganization: "FDA",
      documentTitle: "Diprivan (Propofol) Injectable Emulsion Prescribing Information",
      revisionDate: "2026-01",
      evidenceLevel: "regulatory"
    },
    safety: {
      highRiskMedication: true,
      operationalSafetyRequirements: [
        "airway_equipment_available",
        "continuous_respiratory_monitoring",
        "hemodynamic_monitoring"
      ]
    },
    calculationPolicy: {
      mode: "reference_only_with_non_actionable_math",
      automaticDoseCalculation: false,
      permittedCalculations: ["volume_conversion_for_display", "unit_conversion_for_review"],
      prohibitedCalculations: ["automatic_bolus_order", "automatic_infusion_start", "patient_specific_prescription"],
      requireClinicianConfirmation: true
    },
    clinicalFlags: ["resp_depression", "hypotension_risk", "pain_on_injection", "lipid_emulsion"],
    indications: [
      {
        id: "ga_induction",
        label: { en: "Induction of general anesthesia (Adult & Pediatric)", ar: "استحثاث التخدير العام للبالغين والأطفال" }
      },
      {
        id: "ga_maintenance",
        label: { en: "Maintenance of general anesthesia (TIVA / Balanced)", ar: "المداومة على التخدير العام بالتسريب المستمر" }
      },
      {
        id: "monitored_sedation",
        label: { en: "Monitored anesthesia care (MAC) sedation", ar: "التهدئة الإجرائية المراقبة" }
      },
      {
        id: "icu_sedation_adult",
        label: { en: "Sedation of intubated, mechanically ventilated adult ICU patients", ar: "تهدئة مرضى العناية المركزة البالغين المنبوبين والخاضعين للتهوية الآلية" }
      }
    ],
    presentations: [
      { value: 10, concentration: 10, unit: DOSE_UNITS.MG_PER_ML, label: "10 mg/mL (مستحلب 1% جاهز)", isDefault: true },
      { value: 20, concentration: 20, unit: DOSE_UNITS.MG_PER_ML, label: "20 mg/mL (مستحلب 2% عالي التركيز)", isDefault: false }
    ],
    pharmacodynamics: {
      onset: "30 – 45 ثانية (زمن دوران ذراع - دماغ)",
      timeToHypnosis: "حوالي دقيقة واحدة",
      clinicalDuration: "4 – 8 دقائق بعد الجرعة المفردة (إعادة توزيع سريع)"
    },
    doseLimits: {
      prisRiskSignal: {
        threshold: 67,
        unit: DOSE_UNITS.MCG_PER_KG_MIN,
        durationHours: 48,
        type: "risk_signal_not_absolute_maximum",
        action: "require_clinician_review",
        note: "التسريب المطول لأكثر من 48 ساعة بجرعات تتجاوز 4 mg/kg/h (~67 mcg/kg/min) يرتبط بمتلازمة تسريب البروبوفول (PRIS)."
      }
    },
    clinicalContexts: [
      {
        id: "healthy_adult_induction",
        population: "adult_healthy_under_65",
        route: "IV",
        label: "جرعة الاستحثاث للبالغين الأصحاء (< 65 عاماً / ASA I-II)",
        doseMin: 2.0,
        doseMax: 2.5,
        unit: DOSE_UNITS.MG_PER_KG,
        doseType: "weight_bolus",
        basis: "titrated_to_effect",
        administration: {
          method: "titrated_push",
          typicalIncrement: "20 – 40 mg كل 10 ثوانٍ حتى فقدان منعكس الرمش"
        },
        weightPolicy: {
          allowed: ["TBW", "LBW", "IBW"],
          note: "تُعاير الجرعة سريرياً؛ في حالات السمنة المفرطة، يُراعى البدء بجرعات محسوبة على الوزن الخالي من الدهون (LBW) لتفادي الهبوط الوعائي الحاد."
        },
        validation: {
          requireAge: true,
          requireWeight: true,
          requireWeightType: true,
          requireIndication: true,
          requireAllergyReview: true,
          requireMonitoringConfirmation: true
        },
        isDefault: true,
        note: "الاستخدام المسبق للمسكنات الأفيونية يقلل الجرعة المطلوبة بشكل ملحوظ."
      },
      {
        id: "pediatric_induction",
        population: "pediatric_3_to_16",
        route: "IV",
        label: "جرعة الاستحثاث للأطفال (Pediatric Induction: 3 – 16 سنة)",
        doseMin: 2.5,
        doseMax: 3.5,
        unit: DOSE_UNITS.MG_PER_KG,
        doseType: "weight_bolus",
        basis: "weight_and_age_adjusted",
        administration: {
          method: "titrated_push",
          typicalIncrement: "حقن وريدي معاير ببطء على مدى 20 – 30 ثانية"
        },
        weightPolicy: {
          allowed: ["TBW"],
          note: "يحتاج الأطفال لجرعات استحثاث أعلى (2.5 – 3.5 mg/kg) لكبر حجم التوزيع (Vd) وسرعة الاستقلاب مقارنة بالبالغين."
        },
        validation: {
          requireAge: true,
          requireWeight: true,
          requireAllergyReview: true,
          requireMonitoringConfirmation: true
        },
        note: "تُعاير الجرعة ببطء مع مراقبة استقرار ضغط الدم؛ قد يتطلب الرضع جرعات تصل إلى 3.5 - 4.0 mg/kg."
      },
      {
        id: "elderly_debilitated_induction",
        population: "elderly_or_asa_3_4",
        route: "IV",
        label: "جرعة الاستحثاث لكبار السن (≥ 65 عاماً) أو ASA III-IV",
        doseMin: 1.0,
        doseMax: 1.5,
        unit: DOSE_UNITS.MG_PER_KG,
        doseType: "weight_bolus",
        basis: "titrated_to_effect_slowly",
        administration: {
          method: "slow_titrated_push",
          typicalIncrement: "10 – 20 mg كل 10 ثوانٍ مع مراقبة الضغط الشرياني"
        },
        weightPolicy: {
          allowed: ["TBW", "LBW", "IBW"]
        },
        validation: {
          requireAge: true,
          requireWeight: true,
          requireWeightType: true,
          requireMonitoringConfirmation: true
        },
        note: "تتطلب المعايرة الحذرة جداً بمعدل إعطاء بطيء لتجنب الانهيار الديناميكي الوعائي."
      },
      {
        id: "tiva_maintenance",
        population: "adult",
        route: "IV",
        label: "جرعة المداومة بالتسريب المستمر (TIVA Maintenance Infusion)",
        doseMin: 100,
        doseMax: 200,
        unit: DOSE_UNITS.MCG_PER_KG_MIN,
        doseType: "weight_infusion_min",
        basis: "titrated_to_depth",
        weightPolicy: {
          allowed: ["TBW", "LBW", "ABW"],
          note: "يُعاير التسريب سريرياً وفق الاستجابة الفردية وعمق التخدير والتخطيط الدماغي (BIS 40-60)."
        },
        validation: {
          requireWeight: true,
          requireMonitoringConfirmation: true
        },
        note: "النطاق النموذجي؛ يتغير الاحتياج بمشاركة الأفيونات والغازات."
      }
    ],
    interactions: [
      { agent: "opioids", effect: "تآزر مهبط للضغط والتنفس وخفض جرعة التحريض" },
      { agent: "benzodiazepines", effect: "تعزيز التأثير المنوم وإطالة زمن الإفاقة" }
    ],
    toxicitySignals: ["metabolic_acidosis", "rhabdomyolysis", "cardiac_failure", "hyperkalemia"],
    warnings: [
      "هبوط الجهد الشرياني وبطء القلب، خصوصاً في مرضى نقص الحجم الدموي.",
      "تثبيط تنفسي عميق وانقطاع نفس (Apnea).",
      "ألم عند الحقن الوريدي (يمكن تخفيفه بالحقن المسبق لليدوكايين أو استخدام الأوردة الكبيرة).",
      "⚠️ متلازمة تسريب البروبوفول (PRIS): خطر نادر وقاتل مرتبط بالتسريب المطول بجرعات عالية."
    ],
    precautions: [
      "حساسية البيض أو الصويا: التحسس الغذائي البسيط لا يشكل مانعاً مطلقاً، ولكن يوصى بالحذر الشديد والرجوع للنشرة المحلية في الحساسية التأقية الشديدة.",
      "الالتزام الصارم بالتعقيم والتخلص من الفيال وفق التوجيهات لتفادي النمو الجرثومي السريع في المستحلب الدهني."
    ],
    contraindications: [
      "فرط الحساسية المثبتة والصريحة للبروبوفول أو مكونات المستحلب.",
      "الاستخدام دون جاهزية فورية لتأمين المجرى الهوائي والتهوية بالضغط الموجب."
    ],
    references: [
      {
        organization: "FDA",
        title: "Diprivan (Propofol) Injectable Emulsion Prescribing Information",
        revisionDate: "2026-01",
        evidenceLevel: "regulatory"
      }
    ]
  },

  {
    id: "etomidate",
    name: {
      generic: "Etomidate",
      arabic: "إيتوميدات",
      brandNames: ["Amidate"]
    },
    classification: {
      triadComponent: "hypnosis",
      category: "iv_hypnotic",
      subcategory: "carboxylated_imidazole"
    },
    availability: {
      status: "standard",
      regionDependent: false
    },
    evidence: {
      sourceOrganization: "FDA",
      documentTitle: "Amidate (Etomidate Injection) Prescribing Information",
      revisionDate: "2023-05",
      evidenceLevel: "regulatory"
    },
    safety: {
      highRiskMedication: true,
      operationalSafetyRequirements: [
        "airway_equipment_available",
        "continuous_respiratory_monitoring",
        "hemodynamic_monitoring"
      ]
    },
    calculationPolicy: {
      mode: "reference_only_with_non_actionable_math",
      automaticDoseCalculation: false,
      permittedCalculations: ["volume_conversion_for_display"],
      prohibitedCalculations: ["automatic_bolus_order"],
      requireClinicianConfirmation: true
    },
    clinicalFlags: ["hemodynamic_stability", "adrenal_suppression", "myoclonus", "ponv_risk"],
    indications: [
      {
        id: "hemodynamic_unstable_induction",
        label: { en: "Induction of general anesthesia in hemodynamically compromised patients", ar: "استحثاث التخدير العام في حالات عدم الاستقرار الديناميكي الوعائي وأمراض القلب" }
      }
    ],
    presentations: [
      { value: 2, concentration: 2, unit: DOSE_UNITS.MG_PER_ML, label: "2 mg/mL (أمبولة 20 ملغ في 10 مل)", isDefault: true }
    ],
    pharmacodynamics: {
      onset: "30 – 60 ثانية",
      timeToHypnosis: "أقل من دقيقة واحدة",
      clinicalDuration: "3 – 8 دقائق"
    },
    clinicalContexts: [
      {
        id: "induction_standard",
        population: "adult",
        route: "IV",
        label: "جرعة الاستحثاث القياسية (Standard Induction Bolus)",
        doseMin: 0.2,
        doseMax: 0.3,
        unit: DOSE_UNITS.MG_PER_KG,
        doseType: "weight_bolus",
        basis: "titrated_to_effect",
        administration: {
          method: "slow_push",
          duration: "على مدى 30 إلى 60 ثانية"
        },
        weightPolicy: {
          allowed: ["TBW", "IBW"],
          note: "تُعاير بناءً على الاستجابة السريرية؛ استخدم إرشادات المؤسسة لضبط الوزن في السمنة."
        },
        validation: {
          requireAge: true,
          requireWeight: true,
          requireAllergyReview: true,
          requireMonitoringConfirmation: true
        },
        isDefault: true,
        note: "يتميز بالثبات القلبي الوعائي الفائق مقارنة بالبروبوفول."
      }
    ],
    interactions: [
      { agent: "fentanyl", effect: "إعطاء جرعة مسبقة من الفنتانيل يقلل من حدوث الرمع العضلي (Myoclonus)" }
    ],
    toxicitySignals: ["adrenal_insufficiency"],
    warnings: [
      "⚠️ التثبيط الكظري (Adrenocortical Suppression): تثبيط مؤقت لأنزيم 11-beta-hydroxylase يستمر لساعات حتى بعد جرعة استحثاث مفردة.",
      "الرمع العضلي (Myoclonus) شائع جداً أثناء التحريض.",
      "ألم موضعي عند الحقن الوريدي بسبب مذيب البروبيلين غليكول.",
      "معدل مرتفع نسبياً للغثيان والقيء بعد العمليات (PONV)."
    ],
    precautions: [
      "غير موصى به تماماً للتسريب المستمر (Not recommended for continuous infusion) لتفادي القصور الكظري الممتد.",
      "الإنتان الحاد (Severe Sepsis): يُقيّم بحذر مع موازنة الفائدة في الثبات الوعائي مقابل مخاطر التثبيط الكظري المؤقت."
    ],
    contraindications: [
      "فرط الحساسية المثبتة للإيتوميدات."
    ],
    references: [
      {
        organization: "FDA",
        title: "Amidate (Etomidate Injection) Prescribing Information",
        revisionDate: "2023-05",
        evidenceLevel: "regulatory"
      }
    ]
  },

  {
    id: "ketamine",
    name: {
      generic: "Ketamine HCl",
      arabic: "كيتامين",
      brandNames: ["Ketalar"]
    },
    classification: {
      triadComponent: "hypnosis",
      category: "dissociative_anesthetic",
      subcategory: "nmda_receptor_antagonist"
    },
    availability: {
      status: "standard",
      regionDependent: false
    },
    evidence: {
      sourceOrganization: "FDA",
      documentTitle: "Ketalar (Ketamine HCl Injection) Prescribing Information",
      revisionDate: "2025-10",
      evidenceLevel: "regulatory"
    },
    safety: {
      highRiskMedication: true,
      operationalSafetyRequirements: [
        "airway_equipment_available",
        "suction_available",
        "continuous_respiratory_monitoring",
        "hemodynamic_monitoring"
      ]
    },
    calculationPolicy: {
      mode: "reference_only_with_non_actionable_math",
      automaticDoseCalculation: false,
      permittedCalculations: ["volume_conversion_for_display"],
      prohibitedCalculations: ["automatic_bolus_order"],
      requireClinicianConfirmation: true
    },
    clinicalFlags: ["sympathetic_stimulation", "bronchodilator", "dissociative_anesthesia", "emergence_delirium"],
    indications: [
      {
        id: "induction_shock_bronchospasm",
        label: { en: "Induction in hemodynamically unstable patients or severe bronchospasm", ar: "الاستحثاث عند عدم الاستقرار الوعائي، الصدمة، أو تشنج القصبات" }
      },
      {
        id: "short_procedures",
        label: { en: "Anesthesia for short diagnostic and surgical procedures", ar: "تخدير الإجراءات الجراحية والتشخيصية القصيرة" }
      }
    ],
    presentations: [
      { value: 10, concentration: 10, unit: DOSE_UNITS.MG_PER_ML, label: "10 mg/mL (تخفيف 50 ملغ في 5 مل سالاين)", isDefault: true },
      { value: 50, concentration: 50, unit: DOSE_UNITS.MG_PER_ML, label: "50 mg/mL (أمبولة أصلية 500 ملغ في 10 مل)" },
      { value: 100, concentration: 100, unit: DOSE_UNITS.MG_PER_ML, label: "100 mg/mL (أمبولة مركزة - تتطلب التخفيف الإلزامي للحقن الوريدي)" }
    ],
    pharmacodynamics: {
      onset: "30 – 60 ثانية (IV) / 3 – 4 دقائق (IM)",
      timeToHypnosis: "1 – 2 دقيقة (IV)",
      clinicalDuration: "10 – 20 دقيقة (IV) / 12 – 25 دقيقة (IM)"
    },
    clinicalContexts: [
      {
        id: "iv_induction_typical",
        population: "adult_pediatric",
        route: "IV",
        label: "جرعة الاستحثاث الوريدي النموذجي (Typical IV Induction)",
        doseMin: 1.0,
        doseMax: 2.0,
        unit: DOSE_UNITS.MG_PER_KG,
        doseType: "weight_bolus",
        basis: "titrated_based_on_hemodynamics",
        administration: {
          method: "slow_push",
          duration: "حقن وريدي بطيء على مدى 60 ثانية لتفادي التثبيط التنفسي العابر",
          dilutionRequirement: "تركيز 100 mg/mL لا يُعطى وريدياً إلا بعد تخفيفه بحجم مساوٍ على الأقل من ماء الحقن أو السالاين."
        },
        weightPolicy: {
          allowed: ["TBW", "IBW"],
          note: "نطاق النشرة الرسمية للتحريض الوريدي يمتد بين 1.0 إلى 4.5 mg/kg (متوسط 2 mg/kg). تُخفض الجرعة في الصدمة الشديدة المستنفدة للكاتيكولامينات."
        },
        validation: {
          requireAge: true,
          requireWeight: true,
          requireAllergyReview: true,
          requireMonitoringConfirmation: true
        },
        isDefault: true,
        note: "يُنتج حالة تخدير انفصالي (Dissociative Anesthesia) مع بقاء العينين مفتوحتين."
      },
      {
        id: "im_induction_surgical",
        population: "pediatric_uncooperative",
        route: "IM",
        label: "جرعة الاستحثاث العضلي للتخدير الجراحي (IM Surgical Induction)",
        doseMin: 6.5,
        doseMax: 13.0,
        unit: DOSE_UNITS.MG_PER_KG,
        doseType: "weight_bolus",
        basis: "protocol_and_weight_based",
        administration: {
          method: "deep_im",
          note: "جرعة 9 – 13 mg/kg تنتج عادةً تخديراً جراحياً خلال 3 – 4 دقائق."
        },
        weightPolicy: {
          allowed: ["TBW", "IBW"]
        },
        validation: {
          requireAge: true,
          requireWeight: true,
          requireMonitoringConfirmation: true
        },
        note: "تُستخدم عند صعوبة تأمين وصول وريدي في الأطفال أو المرضى غير المتعاونين."
      },
      {
        id: "im_procedural_sedation",
        population: "pediatric_adult",
        route: "IM",
        label: "التهدئة والتسكين العضلي للإجراءات غير الجراحية (IM Procedural Sedation)",
        doseMin: 2.0,
        doseMax: 4.0,
        unit: DOSE_UNITS.MG_PER_KG,
        doseType: "weight_bolus",
        basis: "titrated_to_target",
        administration: {
          method: "deep_im"
        },
        weightPolicy: {
          allowed: ["TBW", "IBW"]
        },
        validation: {
          requireAge: true,
          requireWeight: true
        },
        note: "جرعة تسكين وتهدئة للإجراءات القصيرة والأقل إيلاماً وليست للتحريض الجراحي الكامل."
      }
    ],
    toxicitySignals: ["severe_hypertension", "tachycardia", "laryngospasm"],
    warnings: [
      "تنبيه القلب والأوعية الدموية (يرفع النبض والضغط عبر التنبيه الودي غير المباشر).",
      "ردود فعل الإفاقة (Emergence Reactions): هلوسات وأحلام مزعجة.",
      "زيادة الإفرازات اللعابية والتنفسية؛ جاهزية جهاز الشفط إلزامية.",
      "الحقن الوريدي السريع قد يسبب انقطاع نفس عابر وتثبيطاً تنفسياً."
    ],
    precautions: [
      "في جراحة الأعصاب وارتفاع الضغط القحفي (ICP): قد يُستخدم وفق تقييم اختصاصي مع تأمين التهوية وضبط اعتدال غازات الدم (Normocapnia).",
      "الذهان والاضطرابات النفسية: يُستخدم بحذر وموازنة سريرية دقيقة."
    ],
    contraindications: [
      "الحالات التي يشكل فيها ارتفاع ضغط الدم خطراً جسيماً مهدداً للحياة (مثل تسلخ الأبهر، التمدد الوعائي غير المعالج).",
      "فرط الحساسية المثبتة للكيتامين."
    ],
    references: [
      {
        organization: "FDA",
        title: "Ketalar (Ketamine HCl Injection) Prescribing Information",
        revisionDate: "2025-10",
        evidenceLevel: "regulatory"
      }
    ]
  },

  {
    id: "thiopental",
    name: {
      generic: "Thiopental Sodium",
      arabic: "ثيوبنتال الصوديوم",
      brandNames: ["Pentothal", "Nesdonal"]
    },
    classification: {
      triadComponent: "hypnosis",
      category: "barbiturate",
      subcategory: "thiobarbiturate"
    },
    availability: {
      status: "institution_dependent",
      regionDependent: true,
      note: "توفر المستحضر متفاوت ومقيد في العديد من المراكز."
    },
    evidence: {
      sourceOrganization: "Historical Regulatory",
      documentTitle: "Thiopental Sodium for Injection Labeling",
      revisionDate: "2020-01",
      evidenceLevel: "historical_regulatory"
    },
    safety: {
      highRiskMedication: true,
      operationalSafetyRequirements: [
        "adequate_iv_access",
        "intra_arterial_injection_avoidance",
        "airway_equipment_available",
        "continuous_respiratory_monitoring",
        "hemodynamic_monitoring"
      ]
    },
    calculationPolicy: {
      mode: "reference_only_with_non_actionable_math",
      automaticDoseCalculation: false,
      permittedCalculations: ["volume_conversion_for_display"],
      prohibitedCalculations: ["automatic_bolus_order"],
      requireClinicianConfirmation: true
    },
    clinicalFlags: ["porphyria_trigger", "tissue_necrosis_risk", "resp_depression", "icp_reduction"],
    indications: [
      {
        id: "ga_induction",
        label: { en: "Induction of general anesthesia", ar: "استحثاث التخدير العام" }
      },
      {
        id: "status_epilepticus",
        label: { en: "Control of convulsive states", ar: "السيطرة على النوبات الصرعية المستمرة" }
      }
    ],
    presentations: [
      { value: 25, concentration: 25, unit: DOSE_UNITS.MG_PER_ML, label: "25 mg/mL (محلول 2.5% محضر حديثاً)", isDefault: true }
    ],
    pharmacodynamics: {
      onset: "20 – 30 ثانية",
      timeToHypnosis: "40 ثانية",
      clinicalDuration: "5 – 10 دقائق (إعادة توزيع سريع إلى العضلات والدهون)"
    },
    clinicalContexts: [
      {
        id: "adult_induction",
        population: "adult",
        route: "IV",
        label: "جرعة الاستحثاث الوريدية للبالغين (Standard Adult Induction)",
        doseMin: 3.0,
        doseMax: 5.0,
        unit: DOSE_UNITS.MG_PER_KG,
        doseType: "weight_bolus",
        basis: "titrated_to_effect",
        administration: {
          method: "slow_push",
          note: "يجب التحقق الصارم من التواجد داخل الوريد لتفادي الحقن الشرياني. المحلول شديد القلوية (pH ≈ 10.5)."
        },
        weightPolicy: {
          allowed: ["TBW", "IBW"],
          note: "تُخفض الجرعة وتُعاير بحذر شديد في كبار السن ومرضى نقص الحجم (Hypovolemia)."
        },
        validation: {
          requireAge: true,
          requireWeight: true,
          requireAllergyReview: true,
          requireMonitoringConfirmation: true
        },
        isDefault: true,
        note: "يخفض معدل استهلاك الأكسجين الدماغي (CMRO2) والضغط داخل الجمجمة."
      }
    ],
    toxicitySignals: ["arterial_thrombosis", "tissue_necrosis", "severe_hypotension"],
    warnings: [
      "⚠️ الحقن الشرياني (Intra-arterial Injection): كارثة وعائية تسبب تشنجاً شريانياً وتخثراً ونخراً قد ينتهي ببتر الطرف.",
      "التسرب خارج الوريد (Extravasation): يسبب تخريشاً نسيجياً شديداً وتنخراً.",
      "تثبيط تنفسي وتوسع وعائي يؤدي لهبوط ملحوظ في ضغط الدم."
    ],
    contraindications: [
      "الأنماط الحادة أو المتنوعة من البورفيريا (Acute intermittent or variegate porphyria) — مانع استعمال مطلق.",
      "فرط الحساسية للباربيتورات."
    ],
    references: [
      {
        organization: "FDA / Historical Reference",
        title: "Pentothal Labeling",
        revisionDate: "2020-01",
        evidenceLevel: "historical_regulatory"
      }
    ]
  },

  // =========================================================================
  // B) SEDATIVES & ANXIOLYTICS (المهدئات)
  // =========================================================================
  {
    id: "midazolam",
    name: {
      generic: "Midazolam HCl",
      arabic: "ميدازولام",
      brandNames: ["Versed"]
    },
    classification: {
      triadComponent: "hypnosis",
      category: "benzodiazepine",
      subcategory: "short_acting_gaba_agonist"
    },
    availability: {
      status: "standard",
      regionDependent: false
    },
    evidence: {
      sourceOrganization: "FDA",
      documentTitle: "Midazolam HCl Injection Prescribing Information",
      revisionDate: "2024-07",
      evidenceLevel: "regulatory"
    },
    safety: {
      highRiskMedication: true,
      operationalSafetyRequirements: [
        "airway_equipment_available",
        "continuous_respiratory_monitoring",
        "hemodynamic_monitoring"
      ]
    },
    calculationPolicy: {
      mode: "reference_only_with_non_actionable_math",
      automaticDoseCalculation: false,
      permittedCalculations: ["volume_conversion_for_display"],
      prohibitedCalculations: ["automatic_bolus_order", "automatic_infusion_start"],
      requireClinicianConfirmation: true
    },
    clinicalFlags: ["resp_depression", "anterograde_amnesia", "synergistic_effect"],
    indications: [
      {
        id: "premedication_anxiolysis",
        label: { en: "Preoperative sedation and anxiolysis", ar: "التهدئة وإزالة القلق وفقدان الذاكرة التقدمي قبل العمليات" }
      },
      {
        id: "procedural_sedation",
        label: { en: "Sedation for diagnostic and therapeutic procedures", ar: "التهدئة المراقبة للإجراءات التنظيرية والتشخيصية" }
      }
    ],
    presentations: [
      { value: 1, concentration: 1, unit: DOSE_UNITS.MG_PER_ML, label: "1 mg/mL (أمبولة مخففة جاهزة)", isDefault: true },
      { value: 5, concentration: 5, unit: DOSE_UNITS.MG_PER_ML, label: "5 mg/mL (أمبولة مركزة 5 ملغ / 1 مل)" }
    ],
    pharmacodynamics: {
      onset: "1 – 2 دقيقة (IV) / 10 – 15 دقيقة (IM)",
      peak: "3 – 5 دقائق (IV)",
      clinicalDuration: "30 – 90 دقيقة (يمتد في كبار السن وقصور الكبد/الكلى)"
    },
    clinicalContexts: [
      {
        id: "procedural_sedation_adult",
        population: "adult_healthy_under_60",
        route: "IV",
        label: "التهدئة الإجرائية للبالغين (< 60 عاماً)",
        doseType: "incremental_weight_based",
        initialDose: { min: 0.01, max: 0.02, unit: DOSE_UNITS.MG_PER_KG },
        incrementalDose: { min: 0.5, max: 1.0, unit: DOSE_UNITS.MG_FIXED, reassessmentMinutes: 3 },
        basis: "incremental_titration",
        administration: {
          method: "slow_incremental_push",
          duration: "حقن مجزأ ببطء على مدى دقيقتين مع الانتظار 3 دقائق لتقييم التأثير"
        },
        weightPolicy: {
          allowed: ["TBW", "IBW"],
          preferred: "IBW"
        },
        validation: {
          requireAge: true,
          requireWeight: true,
          requireAllergyReview: true,
          requireMonitoringConfirmation: true
        },
        isDefault: true,
        note: "تُعاير تدريجياً؛ لا تتجاوز عادة جرعة إجمالية 2.5 إلى 5 mg في التهدئة الواعية المعتادة."
      },
      {
        id: "elderly_debilitated_sedation",
        population: "elderly_or_chronically_ill",
        route: "IV",
        label: "كبار السن (≥ 60 عاماً) أو المرضى الواهنون",
        doseType: "incremental_weight_based",
        initialDose: { min: 0.005, max: 0.01, unit: DOSE_UNITS.MG_PER_KG },
        incrementalDose: { min: 0.25, max: 0.5, unit: DOSE_UNITS.MG_FIXED, reassessmentMinutes: 5 },
        basis: "incremental_titration",
        administration: {
          method: "slow_incremental_push"
        },
        weightPolicy: {
          allowed: ["TBW", "IBW"],
          preferred: "IBW"
        },
        validation: {
          requireAge: true,
          requireWeight: true,
          requireMonitoringConfirmation: true
        },
        note: "خفض الجرعة بنسبة 50% على الأقل مع إطالة زمن التقييم بين الجرعات إلى 5 دقائق."
      }
    ],
    interactions: [
      { agent: "opioids", effect: "تآزر شديد يزيد خطر انقطاع النفس والتثبيط التنفسي العميق" },
      { agent: "cyp3a4_inhibitors", effect: "تأخر استقلاب الميدازولام وإطالة مدة التهدئة" }
    ],
    warnings: [
      "تثبيط تنفسي يعتمد على الجرعة، وتآزر خطير مع الأفيونات.",
      "تفاعلات تناقضية (Paradoxical Agitation) قد تحدث لدى كبار السن والأطفال."
    ],
    precautions: [
      "الزرق ضيق الزاوية الحاد (Acute narrow-angle glaucoma): راجع توجيهات أطباء العيون والنشرة المحلية.",
      "المضاد النوعي (Flumazenil): يُستخدم بحذر لمعاكسة التهدئة مع مراقبة عودة التهدئة (Resedation) لقصر عمر نصف الفلومازينيل."
    ],
    contraindications: [
      "فرط الحساسية للبنزوديازيبينات."
    ],
    references: [
      {
        organization: "FDA",
        title: "Midazolam HCl Injection Prescribing Information",
        revisionDate: "2024-07",
        evidenceLevel: "regulatory"
      }
    ]
  },

  {
    id: "dexmedetomidine",
    name: {
      generic: "Dexmedetomidine HCl",
      arabic: "ديكسميديتوميدين",
      brandNames: ["Precedex"]
    },
    classification: {
      triadComponent: "hypnosis",
      category: "alpha2_agonist",
      subcategory: "selective_alpha2_adrenoceptor_agonist"
    },
    availability: {
      status: "standard",
      regionDependent: false
    },
    evidence: {
      sourceOrganization: "FDA",
      documentTitle: "Precedex (Dexmedetomidine HCl) Prescribing Information",
      revisionDate: "2026-05",
      evidenceLevel: "regulatory"
    },
    safety: {
      highRiskMedication: true,
      operationalSafetyRequirements: [
        "airway_equipment_available",
        "continuous_respiratory_monitoring",
        "hemodynamic_monitoring"
      ]
    },
    calculationPolicy: {
      mode: "reference_only_with_non_actionable_math",
      automaticDoseCalculation: false,
      permittedCalculations: ["volume_conversion_for_display"],
      prohibitedCalculations: ["automatic_infusion_start", "automatic_bolus_order"],
      requireClinicianConfirmation: true
    },
    clinicalFlags: ["bradycardia_risk", "hypotension_risk", "spontaneous_resp_preserved"],
    indications: [
      {
        id: "icu_sedation",
        label: { en: "Sedation of initially intubated and mechanically ventilated adult ICU patients", ar: "تهدئة مرضى العناية المركزة البالغين المنبوبين والخاضعين للتهوية الآلية" }
      },
      {
        id: "procedural_sedation_adult",
        label: { en: "Procedural sedation in non-intubated adult patients", ar: "التهدئة الإجرائية الواعية للمرضى البالغين غير المنبوبين" }
      }
    ],
    presentations: [
      {
        value: 4,
        concentration: 4,
        unit: DOSE_UNITS.MCG_PER_ML,
        label: "4 mcg/mL Ready-to-Use (محلول جاهز للحقن RTU في سالاين 0.9%)",
        requiresDilution: false,
        isDefault: true
      },
      {
        value: 100,
        concentration: 100,
        unit: DOSE_UNITS.MCG_PER_ML,
        label: "100 mcg/mL Concentrate (مركز - يتطلب التخفيف الإلزامي في سالاين 0.9%)",
        requiresDilution: true
      }
    ],
    pharmacodynamics: {
      onset: "5 – 10 دقائق",
      peak: "15 – 30 دقيقة من بدء التسريب",
      clinicalDuration: "60 – 120 دقيقة بعد إيقاف التسريب"
    },
    doseLimits: {
      maximumLabeledDurationHours: 24,
      action: "require_clinician_review_if_exceeded",
      note: "نشرة FDA المعتمدة تنص على ألا يتجاوز تسريب العناية المركزة 24 ساعة؛ الاستخدام الأطول يخضع للبروتوكول المحلي."
    },
    clinicalContexts: [
      {
        id: "icu_sedation_adult",
        population: "adult_icu",
        route: "IV",
        label: "تسريب العناية المركزة للبالغين (Adult ICU Sedation)",
        loadingDose: {
          min: 1.0,
          max: 1.0,
          unit: DOSE_UNITS.MCG_PER_KG,
          durationMinutes: 10,
          optional: true,
          omissionReason: ["bradycardia_risk", "hypotension_risk", "conversion_from_other_sedative"]
        },
        doseMin: 0.2,
        doseMax: 0.7,
        unit: DOSE_UNITS.MCG_PER_KG_HOUR,
        doseType: "weight_infusion_hour",
        basis: "titrated_to_target",
        administration: {
          method: "continuous_infusion_only",
          note: "يُعطى عبر مضخة محاقن حصراً."
        },
        weightPolicy: {
          allowed: ["TBW", "IBW"],
          preferred: "TBW"
        },
        validation: {
          requireAge: true,
          requireWeight: true,
          requireMonitoringConfirmation: true
        },
        isDefault: true
      },
      {
        id: "procedural_sedation_adult",
        population: "adult_procedural",
        route: "IV",
        label: "التهدئة الإجرائية للبالغين (Adult Procedural Sedation)",
        loadingDose: {
          min: 0.5,
          max: 1.0,
          unit: DOSE_UNITS.MCG_PER_KG,
          durationMinutes: 10,
          optional: true,
          omissionReason: ["elderly", "less_painful_procedure"]
        },
        doseMin: 0.2,
        doseMax: 1.0,
        unit: DOSE_UNITS.MCG_PER_KG_HOUR,
        doseType: "weight_infusion_hour",
        basis: "titrated_to_target",
        administration: {
          method: "continuous_infusion_only",
          initialMaintenanceRate: "0.6 mcg/kg/hour"
        },
        weightPolicy: {
          allowed: ["TBW", "IBW"],
          preferred: "TBW"
        },
        validation: {
          requireAge: true,
          requireWeight: true
        },
        requiresLocalProtocol: true
      }
    ],
    toxicitySignals: ["severe_bradycardia", "severe_hypotension", "av_block"],
    warnings: [
      "بطء القلب الملحوظ وهبوط ضغط الدم بسبب تثبيط السيالة الودية المركزية.",
      "المراقبة التنفسية وجاهزية المجرى الهوائي إلزامية؛ التهدئة العميقة قد تؤدي لانسداد المجرى الهوائي الميكانيكي الوضعي."
    ],
    contraindications: [
      "فرط الحساسية للديكسميديتوميدين."
    ],
    references: [
      {
        organization: "FDA",
        title: "Precedex (Dexmedetomidine HCl) Prescribing Information",
        revisionDate: "2026-05",
        evidenceLevel: "regulatory"
      }
    ]
  },

  // =========================================================================
  // C) VOLATILE INHALATIONAL ANESTHETICS (الغازات الاستنشاقية)
  // =========================================================================
  {
    id: "sevoflurane",
    name: {
      generic: "Sevoflurane",
      arabic: "سيفوفلوران",
      brandNames: ["Ultane", "Sevorane"]
    },
    classification: {
      triadComponent: "hypnosis",
      category: "volatile_anesthetic",
      subcategory: "fluorinated_methyl_isopropyl_ether"
    },
    availability: {
      status: "standard",
      regionDependent: false
    },
    evidence: {
      sourceOrganization: "FDA",
      documentTitle: "Ultane (Sevoflurane) Volatile Liquid for Inhalation Prescribing Information",
      revisionDate: "2025-01",
      evidenceLevel: "regulatory"
    },
    safety: {
      highRiskMedication: true,
      operationalSafetyRequirements: [
        "vaporizer_calibrated",
        "airway_equipment_available",
        "end_tidal_monitoring",
        "mh_treatment_cart_available"
      ]
    },
    calculationPolicy: {
      mode: "display_reference_only",
      automaticDoseCalculation: false,
      permittedCalculations: ["mac_age_adjustment_display"],
      prohibitedCalculations: ["automatic_vaporizer_setting"],
      requireClinicianConfirmation: true
    },
    validation: {
      requirePatientAge: true,
      requireAllergyReview: true,
      requireVaporizerVerification: true,
      requireEndTidalMonitoring: true,
      requireMalignantHyperthermiaScreening: true
    },
    clinicalFlags: ["mh_trigger", "bronchodilator", "emergence_agitation", "compound_a_risk"],
    indications: [
      {
        id: "induction_and_maintenance",
        label: { en: "Induction and maintenance of general anesthesia in adult and pediatric patients", ar: "استحثاث والمداومة على التخدير العام للبالغين والأطفال" }
      }
    ],
    presentations: [
      {
        value: 100,
        concentration: 100,
        unit: DOSE_UNITS.PERCENT_LIQUID,
        label: "100% Volatile Liquid (سائل استنشاقي مخصص للمبخرة الصفراء)",
        administrationDevice: "agent_specific_vaporizer (Yellow)",
        isDefault: true
      }
    ],
    displayWarning: {
      ar: "تركيز السائل في العبوة (100%) ليس تركيز الغاز المستنشق لدى المريض؛ يتم التبخير عبر جهاز التخدير.",
      en: "Liquid bottle concentration (100%) is not the patient's inhaled concentration; agent is vaporized via calibrated equipment."
    },
    pharmacodynamics: {
      bloodGasPartitionCoefficient: 0.65,
      oilGasPartitionCoefficient: 50,
      onsetSpeed: "سريع جداً (سرعة ارتفاع التركيز السنخي FA/FI)",
      emergenceSpeed: "إفاقة سريعة تعتمد على التهوية ومدة التعرض"
    },
    macModel: {
      referenceAge: 40,
      referenceValue: 2.1,
      carrierGas: "100% O2",
      unit: DOSE_UNITS.PERCENT_MAC,
      ageAdjustmentFormula: "MAC decreases approximately 6% per decade of age above 40.",
      modifiers: ["opioids", "nitrous_oxide", "hypothermia", "pregnancy"]
    },
    inhalationalDelivery: {
      route: "Inhalation via Vaporizer",
      typicalTargetRanges: [
        {
          population: "adult",
          context: "Surgical Maintenance (Age 40 reference)",
          guidanceEtRange: "0.5 – 1.3 MAC (تقريباً 1.0 – 2.7% End-Tidal وفق مشاركة الأفيونات وN2O)",
          unit: DOSE_UNITS.PERCENT_END_TIDAL
        }
      ]
    },
    warnings: [
      "⚠️ محرض قوي لمتلازمة فرط الحرارة الخبيث (Malignant Hyperthermia Trigger).",
      "تثبيط تنفسي وتوسع وعائي وهبوط ضغط شرياني معتمد على الجرعة.",
      "تشكل المركب A (Compound A): اتبع نشرة المنتج وبروتوكول المؤسسة ونوع ممتص ثاني أكسيد الكربون.",
      "هياج الإفاقة (Emergence Agitation) شائع لدى الأطفال بعد الإفاقة السريعة."
    ],
    precautions: [
      "يجب مراقبة تركيز الغاز نهاية الزفير (End-Tidal) باستمرار لضبط عمق التخدير وتجنب الوعي أثناء الجراحة."
    ],
    contraindications: [
      "الاستعداد الوراثي المعروف لمتلازمة فرط الحرارة الخبيث.",
      "فرط الحساسية للغازات الهالوجينية (مثل سوابق التهاب كبدي غير مفسر متصل بالتخدير)."
    ],
    references: [
      {
        organization: "FDA",
        title: "Ultane (Sevoflurane) Volatile Liquid Prescribing Information",
        revisionDate: "2025-01",
        evidenceLevel: "regulatory"
      }
    ]
  },

  {
    id: "desflurane",
    name: {
      generic: "Desflurane",
      arabic: "ديسفلوران",
      brandNames: ["Suprane"]
    },
    classification: {
      triadComponent: "hypnosis",
      category: "volatile_anesthetic",
      subcategory: "fluorinated_methyl_ethyl_ether"
    },
    availability: {
      status: "standard",
      regionDependent: false
    },
    evidence: {
      sourceOrganization: "FDA",
      documentTitle: "Suprane (Desflurane) Volatile Liquid Prescribing Information",
      revisionDate: "2024-02",
      evidenceLevel: "regulatory"
    },
    safety: {
      highRiskMedication: true,
      operationalSafetyRequirements: [
        "heated_vaporizer_required",
        "airway_equipment_available",
        "end_tidal_monitoring",
        "mh_treatment_cart_available"
      ]
    },
    calculationPolicy: {
      mode: "display_reference_only",
      automaticDoseCalculation: false,
      permittedCalculations: ["mac_age_adjustment_display"],
      prohibitedCalculations: ["automatic_vaporizer_setting"],
      requireClinicianConfirmation: true
    },
    validation: {
      requirePatientAge: true,
      requireAllergyReview: true,
      requireVaporizerVerification: true,
      requireEndTidalMonitoring: true,
      requireMalignantHyperthermiaScreening: true
    },
    clinicalFlags: ["mh_trigger", "sympathetic_stimulation", "airway_irritant", "avoid_rapid_concentration_increase"],
    indications: [
      {
        id: "maintenance_rapid_emergence",
        label: { en: "Maintenance of general anesthesia in adults and children", ar: "المداومة على التخدير العام للبالغين والأطفال مع إفاقة فائقة السرعة" }
      }
    ],
    presentations: [
      {
        value: 100,
        concentration: 100,
        unit: DOSE_UNITS.PERCENT_LIQUID,
        label: "100% Volatile Liquid (سائل استنشاقي مخصص للمبخرة المدفأة الزرقاء Tec 6)",
        administrationDevice: "heated_agent_specific_vaporizer (Tec 6 / Blue)",
        isDefault: true
      }
    ],
    displayWarning: {
      ar: "تركيز السائل في العبوة (100%) ليس تركيز الغاز المستنشق؛ يتطلب مبخرة كهربائية مخصصة ومدفأة.",
      en: "Liquid bottle concentration is not the patient's inhaled concentration; requires heated pressurized vaporizer."
    },
    pharmacodynamics: {
      bloodGasPartitionCoefficient: 0.42,
      oilGasPartitionCoefficient: 18.7,
      onsetSpeed: "فائق السرعة (الأدنى في الذوبان بالدم)",
      emergenceSpeed: "إفاقة فائقة السرعة ومستقلة نسبياً عن مدة التخدير"
    },
    macModel: {
      referenceAge: 40,
      referenceValue: 6.6,
      carrierGas: "100% O2",
      unit: DOSE_UNITS.PERCENT_MAC,
      modifiers: ["opioids", "nitrous_oxide", "hypothermia"]
    },
    inhalationalDelivery: {
      route: "Inhalation via Heated Vaporizer",
      typicalTargetRanges: [
        {
          population: "adult",
          context: "Surgical Maintenance (Age 40 reference)",
          guidanceEtRange: "0.5 – 1.3 MAC (تقريباً 3.0 – 8.5% End-Tidal وفق المواد المرافقة)",
          unit: DOSE_UNITS.PERCENT_END_TIDAL
        }
      ]
    },
    warnings: [
      "⚠️ محرض قوي لمتلازمة فرط الحرارة الخبيث (Malignant Hyperthermia Trigger).",
      "تنبيه ودي مفاجئ: الرفع السريع لتركيز الديسفلوران الشهيقي يحرض تحرير الكاتيكولامينات مسبباً تسارع القلب وارتفاع الضغط.",
      "تخريش شديد للمجرى الهوائي: غير موصى به إطلاقاً للتحريض الاستنشاقي بالماسك لخطورة حدوث سعال وحبس نفس وتشنج حنجري (Laryngospasm)."
    ],
    precautions: [
      "زيادة التركيز يجب أن تتم بتدرج تدريجي مع إعطاء مسكن أفيوني لتفادي التنبيه القلبي الوعائي المفاجئ."
    ],
    contraindications: [
      "الاستعداد الوراثي المعروف لمتلازمة فرط الحرارة الخبيث.",
      "فرط الحساسية للغازات الهالوجينية."
    ],
    references: [
      {
        organization: "FDA",
        title: "Suprane (Desflurane) Prescribing Information",
        revisionDate: "2024-02",
        evidenceLevel: "regulatory"
      }
    ]
  }
];

export default hypnosisData;
