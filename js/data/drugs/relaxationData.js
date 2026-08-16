/**
 * AnesthesiaX — Drug Center: Muscle Relaxation & Reversals Data Module
 * Component: Anesthesia Triad — Part 3 (Muscle Relaxation & Reversals)
 * File: js/data/drugs/relaxationData.js
 *
 * Advanced Clinical Decision Support (CDS) Dataset — Production-Grade Reference
 * Validated against FDA Approved Prescribing Information, ASA NMT Monitoring Guidelines (2023),
 * and Morgan & Mikhail's Clinical Anesthesiology 7th Ed.
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
    safety: {
      highRiskMedication: true,
      requiresAirwayReady: true,
      requiresRespiratoryMonitoring: true
    },
    clinicalFlags: [
      "black_box_warning",
      "mh_trigger",
      "hyperkalemia_risk",
      "bradycardia_risk"
    ],
    indications: [
      {
        id: "rsi_intubation",
        label: { en: "Rapid sequence intubation (RSI)", ar: "استحثاث التنبيب الرغامي السريع لتأمين المجرى الهوائي" }
      },
      {
        id: "short_procedures",
        label: { en: "Procedures requiring brief skeletal muscle relaxation", ar: "إرخاء العضلات قصير الأمد للإجراءات الجراحية السريعة" }
      }
    ],
    presentations: [
      {
        value: 20,
        concentration: 20,
        unit: DOSE_UNITS.MG_PER_ML,
        label: "20 mg/mL (أمبولة جاهزة 100 ملغ في 5 مل)",
        isDefault: true
      },
      {
        value: 50,
        concentration: 50,
        unit: DOSE_UNITS.MG_PER_ML,
        label: "50 mg/mL (أمبولة مركزة 100 ملغ في 2 مل)"
      }
    ],
    pharmacodynamics: {
      onset: "30 – 60 ثانية (بدء فائق السرعة)",
      peak: "1 – 1.5 دقيقة",
      clinicalDuration: "5 – 10 دقائق (استقلاب سريع بالكولينستراز البلازمي)"
    },
    neuromuscularMonitoring: {
      modality: "Qualitative/Quantitative NMT",
      notes: "لا يتطلب مراقبة كمية روتينية للجرعة المفردة، وتستخدم المراقبة عند الاشتباه في نقص الإنزيم أو حصر الطور الثاني."
    },
    clinicalContexts: [
      {
        id: "adult_rsi_induction",
        population: "adult",
        route: "IV",
        label: "جرعة الاستحثاث للتنبيب السريع للبالغين (Adult RSI Induction)",
        doseMin: 1.0,
        doseMax: 1.5,
        unit: DOSE_UNITS.MG_PER_KG,
        doseType: "weight_bolus",
        basis: "weight_based_reference",
        administration: {
          method: "rapid_iv_push"
        },
        weightPolicy: {
          preferred: "TBW",
          note: "الحساب على الوزن الكلي (TBW) نظراً لكبر حجم التوزيع ونشاط الكولينستراز البلازمي."
        },
        isDefault: true,
        note: "تسبق الشلل العضلي ارتعاشات عضلية حزمية عابرة (Fasciculations)."
      },
      {
        id: "infant_rsi",
        population: "infant",
        route: "IV",
        label: "جرعة الاستحثاث للرضع والأطفال (Infant/Pediatric RSI)",
        doseMin: 1.5,
        doseMax: 2.0,
        unit: DOSE_UNITS.MG_PER_KG,
        doseType: "weight_bolus",
        basis: "weight_based_reference",
        administration: {
          method: "rapid_iv_push"
        },
        weightPolicy: {
          preferred: "TBW"
        },
        note: "يتطلب الرضع جرعات أعلى نسبياً؛ يوصى بإعطاء الأتروبين وقائياً لتجنب بطء القلب الشديد."
      }
    ],
    warnings: [
      "⚠️ تحذير الصندوق الأسود: خطر توقف القلب الحاد الناجم عن فرط بوتاسيوم الدم المفاجئ، خاصة لدى الأطفال المصابين باعتلالات عضلية غير مشخصة (داء دوشين).",
      "⚠️ محرض قوي لمتلازمة فرط الحرارة الخبيث (Malignant Hyperthermia Trigger).",
      "يرفع مستوى بوتاسيوم المصل بمقدار 0.5 – 1.0 mEq/L في المرضى السليمين، وقد يسبب ارتفاعاً مميتاً في الحروق والرضوض والأذيات العصبية بعد >24-48 ساعة.",
      "قد يسبب بطء قلب جيبي حاد وتوقف انقباض؛ يجب توفر الأتروبين جاهزاً."
    ],
    contraindications: [
      "الاستعداد الوراثي أو السوابق العائلية لمتلازمة فرط الحرارة الخبيث (MH).",
      "فرط بوتاسيوم الدم المثبت أو الحالات عالية الخطورة (الحروق الواسعة، الرضوض الشديدة، الشلل الرباعي المزمن).",
      "الاعتلالات العضلية الهيكلية الوراثية (Duchenne Muscular Dystrophy).",
      "نقص إنزيم الكولينستراز البلازمي الوراثي (Atypical Pseudocholinesterase)."
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
    safety: {
      highRiskMedication: true,
      requiresAirwayReady: true,
      requiresRespiratoryMonitoring: true
    },
    clinicalFlags: ["reversal_with_sugammadex", "intermediate_acting", "hemodynamic_stability"],
    indications: [
      { id: "routine_intubation", label: { en: "Routine endotracheal intubation", ar: "استحثاث التنبيب الرغامي الروتيني" } },
      { id: "rsi_intubation", label: { en: "Rapid sequence intubation (RSI)", ar: "استحثاث التنبيب الرغامي السريع كبديل آمن للسكوسينيل كولين" } },
      { id: "intraop_maintenance", label: { en: "Intraoperative skeletal muscle relaxation", ar: "المداومة على إرخاء العضلات أثناء الجراحة" } }
    ],
    presentations: [
      {
        value: 10,
        concentration: 10,
        unit: DOSE_UNITS.MG_PER_ML,
        label: "10 mg/mL (فيال جاهز 50 ملغ في 5 مل)",
        isDefault: true
      }
    ],
    pharmacodynamics: {
      onset: "60 – 90 ثانية (بجرعة 0.6 mg/kg) / 45 – 60 ثانية (بجرعة RSI: 1.0 – 1.2 mg/kg)",
      peak: "1 – 2 دقيقة",
      clinicalDuration: "30 – 60 دقيقة (يمتد إلى >60 دقيقة بجرعات RSI العالية)"
    },
    neuromuscularMonitoring: {
      modality: "Quantitative NMT (AMG/EMG)",
      extubationTarget: "TOF Ratio ≥ 0.9"
    },
    clinicalContexts: [
      {
        id: "standard_intubation",
        population: "adult",
        route: "IV",
        label: "جرعة التنبيب القياسية (Standard Intubation - 2x ED95)",
        doseMin: 0.6,
        doseMax: 0.6,
        unit: DOSE_UNITS.MG_PER_KG,
        doseType: "weight_bolus",
        basis: "weight_based_reference",
        administration: {
          method: "rapid_iv_push"
        },
        weightPolicy: {
          preferred: "IBW",
          note: "يوصى بالاعتماد على الوزن المثالي (IBW) في السمنة لتجنب إطالة مدة الشلل العضلي."
        },
        isDefault: true,
        note: "يوفر ظروف تنبيب ممتازة خلال 60 إلى 90 ثانية."
      },
      {
        id: "rsi_intubation",
        population: "adult",
        route: "IV",
        label: "جرعة التنبيب السريع (RSI Intubation - High Dose)",
        doseMin: 1.0,
        doseMax: 1.2,
        unit: DOSE_UNITS.MG_PER_KG,
        doseType: "weight_bolus",
        basis: "weight_based_reference",
        administration: {
          method: "rapid_iv_push"
        },
        weightPolicy: {
          preferred: "IBW"
        },
        note: "يوفر ظروف تنبيب سريعة خلال 45-60 ثانية؛ الترياق الفوري عند الطوارئ: سوجاماديكس 16 mg/kg."
      },
      {
        id: "maintenance_bolus",
        population: "adult",
        route: "IV",
        label: "جرعة المداومة أثناء الجراحة (Maintenance Bolus)",
        doseMin: 0.1,
        doseMax: 0.2,
        unit: DOSE_UNITS.MG_PER_KG,
        doseType: "weight_bolus",
        basis: "guided_by_nmt",
        weightPolicy: {
          preferred: "IBW"
        },
        note: "تُعطى استرشاداً بمراقبة TOF عند ظهور النفضة الأولى أو الثانية (T1/T2)."
      }
    ],
    warnings: [
      "شلل عضلي كامل يشمل عضلات التنفس؛ يتطلب التهوية الآلية الفورية وتأمين المجرى الهوائي.",
      "تطول مدة المفعول في مرضى القصور الكبدي والانسداد الصفراوي (طريق الإطراح الأساسي).",
      "يُعكس بسرعة ونوعية بواسطة السوجاماديكس (Sugammadex)."
    ],
    contraindications: [
      "فرط الحساسية المعروفة للروكورونيوم أو لمركبات الأمينوستيرويد."
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
    safety: {
      highRiskMedication: true,
      requiresAirwayReady: true,
      requiresRespiratoryMonitoring: true
    },
    clinicalFlags: ["reversal_with_sugammadex", "intermediate_acting", "hemodynamic_stability"],
    indications: [
      { id: "routine_intubation", label: { en: "Routine endotracheal intubation", ar: "استحثاث التنبيب الرغامي في التخدير العام" } },
      { id: "intraop_maintenance", label: { en: "Maintenance of neuromuscular blockade", ar: "المداومة على الحصر العصبي العضلي أثناء الجراحة" } }
    ],
    presentations: [
      {
        value: 1,
        concentration: 1,
        unit: DOSE_UNITS.MG_PER_ML,
        label: "1 mg/mL (بودرة 10 ملغ محلولة في 10 مل ماء معقم)",
        isDefault: true
      },
      {
        value: 2,
        concentration: 2,
        unit: DOSE_UNITS.MG_PER_ML,
        label: "2 mg/mL (بودرة 10 ملغ محلولة في 5 مل ماء معقم)"
      }
    ],
    pharmacodynamics: {
      onset: "2 – 3 دقائق",
      peak: "3 – 5 دقائق",
      clinicalDuration: "25 – 40 دقيقة"
    },
    neuromuscularMonitoring: {
      modality: "Quantitative NMT",
      extubationTarget: "TOF Ratio ≥ 0.9"
    },
    clinicalContexts: [
      {
        id: "standard_intubation",
        population: "adult",
        route: "IV",
        label: "جرعة التنبيب القياسية (Standard Intubation Bolus)",
        doseMin: 0.08,
        doseMax: 0.1,
        unit: DOSE_UNITS.MG_PER_KG,
        doseType: "weight_bolus",
        basis: "weight_based_reference",
        administration: {
          method: "slow_push"
        },
        weightPolicy: {
          preferred: "IBW"
        },
        isDefault: true,
        note: "يتميز بالثبات القلبي الوعائي التام وعدم تحرير الهيستامين."
      },
      {
        id: "maintenance_bolus",
        population: "adult",
        route: "IV",
        label: "جرعة المداومة أثناء الجراحة (Maintenance Bolus)",
        doseMin: 0.01,
        doseMax: 0.015,
        unit: DOSE_UNITS.MG_PER_KG,
        doseType: "weight_bolus",
        basis: "guided_by_nmt",
        weightPolicy: {
          preferred: "IBW"
        },
        note: "تُعطى عند بدء استعادة الاستجابة العضلية في مراقبة TOF."
      }
    ],
    warnings: [
      "شلل عضلات التنفس؛ يتطلب التهوية الآلية الفورية.",
      "قد يطول مفعوله في حالات القصور الكلوي أو الكبدي الشديد.",
      "يُعكس بالسوجاماديكس أو النيوستيغمين."
    ],
    contraindications: [
      "فرط الحساسية للفيكورونيوم أو مركبات الأمينوستيرويد."
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
    safety: {
      highRiskMedication: true,
      requiresAirwayReady: true,
      requiresRespiratoryMonitoring: true
    },
    clinicalFlags: ["hofmann_elimination", "hemodynamic_stability", "no_histamine_release"],
    indications: [
      { id: "routine_intubation", label: { en: "Endotracheal intubation and surgical relaxation", ar: "استحثاث التنبيب الرغامي وإرخاء العضلات أثناء التخدير العام" } },
      { id: "icu_paralysis", label: { en: "Neuromuscular blockade in ICU mechanically ventilated patients", ar: "إرخاء العضلات لمرضى العناية المركزة (قصور الكلى والكبد)" } }
    ],
    presentations: [
      {
        value: 2,
        concentration: 2,
        unit: DOSE_UNITS.MG_PER_ML,
        label: "2 mg/mL (أمبولة جاهزة 10 ملغ في 5 مل)",
        isDefault: true
      },
      {
        value: 10,
        concentration: 10,
        unit: DOSE_UNITS.MG_PER_ML,
        label: "10 mg/mL (محلول مركز مخصص لتسريب العناية المركزة)"
      }
    ],
    pharmacodynamics: {
      onset: "2 – 3 دقائق (بجرعة 0.15 mg/kg) / 1.5 – 2 دقيقة (بجرعة 0.2 mg/kg)",
      peak: "3 – 5 دقائق",
      clinicalDuration: "45 – 60 دقيقة (استقلاب هوفمان الذاتي في البلازما)"
    },
    neuromuscularMonitoring: {
      modality: "Quantitative NMT",
      extubationTarget: "TOF Ratio ≥ 0.9"
    },
    clinicalContexts: [
      {
        id: "standard_intubation",
        population: "adult",
        route: "IV",
        label: "جرعة التنبيب القياسية (Standard Intubation - 3x ED95)",
        doseMin: 0.15,
        doseMax: 0.2,
        unit: DOSE_UNITS.MG_PER_KG,
        doseType: "weight_bolus",
        basis: "weight_based_reference",
        administration: {
          method: "slow_iv_push"
        },
        weightPolicy: {
          preferred: "IBW"
        },
        isDefault: true,
        note: "الاستقلاب الذاتي (Hofmann) يجعله الخيار الأول والآمن لمرضى القصور الكلوي أو الكبدي."
      },
      {
        id: "maintenance_bolus",
        population: "adult",
        route: "IV",
        label: "جرعة المداومة أثناء الجراحة (Maintenance Bolus)",
        doseMin: 0.03,
        doseMax: 0.03,
        unit: DOSE_UNITS.MG_PER_KG,
        doseType: "weight_bolus",
        basis: "guided_by_nmt",
        weightPolicy: {
          preferred: "IBW"
        },
        note: "توفر نحو 20 دقيقة إضافية من الإرخاء العضلي الجراحي."
      }
    ],
    warnings: [
      "يتأثر تفاعل هوفمان بحرارة الجسم ودرجة الحموضة؛ انخفاض الحرارة والحماض يطيلان مدة الشلل.",
      "⚠️ لا يُعكس بالسوجاماديكس إطلاقاً؛ يُعكس بالنيوستيغمين مع الغليكوبيرولات.",
      "لا يحرر الهيستامين ويتميز بثبات ديناميكي وعائي ممتاز."
    ],
    contraindications: [
      "فرط الحساسية للسيسأتراكوريوم أو الأتراكوريوم أو حمض البنزين سلفونيك."
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
    safety: {
      highRiskMedication: true,
      requiresAirwayReady: true,
      requiresRespiratoryMonitoring: true
    },
    clinicalFlags: ["hofmann_elimination", "histamine_release"],
    indications: [
      { id: "routine_intubation", label: { en: "Endotracheal intubation and surgical relaxation", ar: "استحثاث التنبيب الرغامي وإرخاء العضلات الجراحي" } }
    ],
    presentations: [
      {
        value: 10,
        concentration: 10,
        unit: DOSE_UNITS.MG_PER_ML,
        label: "10 mg/mL (أمبولة جاهزة 50 ملغ في 5 مل)",
        isDefault: true
      }
    ],
    pharmacodynamics: {
      onset: "2 – 2.5 دقيقة",
      peak: "3 – 5 دقائق",
      clinicalDuration: "30 – 45 دقيقة (استقلاب هوفمان + تحلل إستري)"
    },
    neuromuscularMonitoring: {
      modality: "Quantitative NMT",
      extubationTarget: "TOF Ratio ≥ 0.9"
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
          duration: "حقن وريدي بطيء على مدى دقيقة لتقليل تحرر الهيستامين"
        },
        weightPolicy: {
          preferred: "IBW"
        },
        isDefault: true,
        note: "الحقن البطيء يقلل من مخاطر هبوط الضغط وتورد الوجه."
      },
      {
        id: "maintenance_bolus",
        population: "adult",
        route: "IV",
        label: "جرعة المداومة أثناء الجراحة (Maintenance Bolus)",
        doseMin: 0.08,
        doseMax: 0.1,
        unit: DOSE_UNITS.MG_PER_KG,
        doseType: "weight_bolus",
        basis: "guided_by_nmt",
        weightPolicy: {
          preferred: "IBW"
        },
        note: "تُكرر استرشاداً بالمراقبة العضلية كل 15-25 دقيقة بحسب الحاجة."
      }
    ],
    warnings: [
      "قد يحرر الهيستامين عند الحقن السريع مسبباً تورد الوجه، هبوط الضغط، أو تشنج القصبات.",
      "⚠️ لا يستجيب للسوجاماديكس؛ يتطلب النيوستيغمين للعكس بعد بدء التعافي التلقائي.",
      "يُحفظ مبرداً في الثلاجة (2°C – 8°C)."
    ],
    contraindications: [
      "فرط الحساسية المعروفة للأتراكوريوم أو السيسأتراكوريوم."
    ]
  },

  // =========================================================================
  // C) REVERSAL AGENTS & ANTIMUSCARINICS (أدوية العكس والترياقات) -> Tab 6
  // =========================================================================
  {
    id: "sugammadex",
    name: {
      generic: "Sugammadex Sodium",
      arabic: "سوجاماديكس (بريديون)",
      brandNames: ["Bridion"]
    },
    classification: {
      triadComponent: "reversal_emergency",
      category: "reversal_agent",
      subcategory: "selective_relaxant_binding_agent"
    },
    safety: {
      highRiskMedication: true,
      requiresRespiratoryMonitoring: true
    },
    clinicalFlags: [
      "reversal_with_sugammadex",
      "bradycardia_risk"
    ],
    indications: [
      {
        id: "reversal_rocuronium_vecuronium",
        label: { en: "Reversal of rocuronium or vecuronium-induced block", ar: "عكس الحصر العصبي العضلي الناجم عن الروكورونيوم أو الفيكورونيوم" }
      }
    ],
    presentations: [
      {
        value: 100,
        concentration: 100,
        unit: DOSE_UNITS.MG_PER_ML,
        label: "100 mg/mL (فيال جاهز 200 ملغ في 2 مل / 500 ملغ في 5 مل)",
        isDefault: true
      }
    ],
    pharmacodynamics: {
      onset: "سريع جداً (< دقيقتين)",
      peak: "2 – 3 دقائق",
      clinicalDuration: "إطراح كلوي مباشر للمركب المعقد"
    },
    neuromuscularMonitoring: {
      modality: "Quantitative NMT",
      extubationTarget: "TOF Ratio ≥ 0.9"
    },
    clinicalContexts: [
      {
        id: "moderate_block_reversal",
        population: "adult_pediatric",
        route: "IV",
        label: "عكس الحصر المتوسط (Moderate Block - عودة T2 على الأقل)",
        doseMin: 2.0,
        doseMax: 2.0,
        unit: DOSE_UNITS.MG_PER_KG,
        doseType: "weight_bolus",
        basis: "weight_based_tbw",
        administration: {
          method: "rapid_iv_bolus",
          duration: "حقن وريدي دفعي مباشر خلال 10 ثوانٍ"
        },
        weightPolicy: {
          preferred: "TBW",
          note: "تنص النشرة المعتمدة على الحساب على الوزن الفعلي الكلي (TBW) حتى في مرضى السمنة."
        },
        isDefault: true,
        note: "يُعطى عند ظهور النفضة الثانية (T2) في مراقبة قطار الأربعة."
      },
      {
        id: "deep_block_reversal",
        population: "adult_pediatric",
        route: "IV",
        label: "عكس الحصر العميق (Deep Block - 1-2 PTC)",
        doseMin: 4.0,
        doseMax: 4.0,
        unit: DOSE_UNITS.MG_PER_KG,
        doseType: "weight_bolus",
        basis: "weight_based_tbw",
        administration: {
          method: "rapid_iv_bolus"
        },
        weightPolicy: {
          preferred: "TBW"
        },
        note: "غياب استجابة TOF مع ظهور 1-2 نفضة في العد التالي للتكزز (PTC)."
      },
      {
        id: "immediate_rescue_reversal",
        population: "adult",
        route: "IV",
        label: "العكس الفوري الطارئ لجرعة روكورونيوم عالية (RSI Rescue: 16 mg/kg)",
        doseMin: 16.0,
        doseMax: 16.0,
        unit: DOSE_UNITS.MG_PER_KG,
        doseType: "weight_bolus",
        basis: "weight_based_tbw",
        administration: {
          method: "rapid_iv_bolus"
        },
        weightPolicy: {
          preferred: "TBW"
        },
        note: "يُعطى فوراً لإنقاذ حالات تعذر التنبيب والتهوية (CICO) بعد إعطاء 1.2 mg/kg روكورونيوم."
      }
    ],
    warnings: [
      "⚠️ بطء قلب ملحوظ: قد يحدث بطء قلب حاد مفاجئ بعد الحقن؛ يوصى بمراقبة النبض وجاهزية الأتروبين.",
      "تداخل موانع الحمل الهرمونية: يرتبط بها ويقلل فعاليتها؛ يجب إرشاد المريضات لاستخدام وسيلة حماية إضافية لمدة 7 أيام.",
      "لا يعكس المرخيات من زمرة البنزيل إيزوكينولين (الأتراكوريوم والسيسأتراكوريوم)."
    ],
    contraindications: [
      "فرط الحساسية المعروفة للسوجاماديكس.",
      "القصور الكلوي الشديد في مرحلته النهائية أو الغسيل الكلوي (لعدم كفاية بيانات الأمان)."
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
      triadComponent: "reversal_emergency",
      category: "reversal_agent",
      subcategory: "acetylcholinesterase_inhibitor"
    },
    safety: {
      highRiskMedication: true,
      requiresRespiratoryMonitoring: true
    },
    clinicalFlags: [
      "bradycardia_risk"
    ],
    indications: [
      { id: "ndnmba_reversal", label: { en: "Reversal of non-depolarizing neuromuscular blockade", ar: "عكس الحصر العصبي العضلي غير المزيل للاستقطاب بعد بدء التعافي التلقائي" } }
    ],
    presentations: [
      {
        value: 0.5,
        concentration: 0.5,
        unit: DOSE_UNITS.MG_PER_ML,
        label: "0.5 mg/mL (أمبولة 2.5 ملغ في 5 مل)",
        isDefault: true
      },
      {
        value: 1.0,
        concentration: 1.0,
        unit: DOSE_UNITS.MG_PER_ML,
        label: "1.0 mg/mL (أمبولة مركزة)"
      }
    ],
    pharmacodynamics: {
      onset: "1 – 3 دقائق",
      peak: "7 – 10 دقائق (ذروة تثبيط الإنزيم)",
      clinicalDuration: "50 – 90 دقيقة"
    },
    neuromuscularMonitoring: {
      modality: "Quantitative NMT",
      extubationTarget: "TOF Ratio ≥ 0.9"
    },
    clinicalContexts: [
      {
        id: "greater_recovery_reversal",
        population: "adult_pediatric",
        route: "IV",
        label: "عكس الحصر مع تعافٍ تلقائي متقدم (Significant Recovery - TOF 4/4)",
        doseMin: 0.03,
        doseMax: 0.03,
        unit: DOSE_UNITS.MG_PER_KG,
        doseType: "weight_bolus",
        basis: "spontaneous_recovery_guided",
        administration: {
          method: "slow_iv_push_with_antimuscarinic",
          duration: "حقن وريدي بطيء بالمشاركة المتزامنة مع غليكوبيرولات أو أتروبين"
        },
        weightPolicy: {
          preferred: "IBW"
        },
        isDefault: true,
        note: "تُحدد الجرعة وفق درجة التعافي التلقائي للمريض (الحد الأقصى المطلق 5.0 ملغ)."
      },
      {
        id: "moderate_recovery_reversal",
        population: "adult_pediatric",
        route: "IV",
        label: "عكس الحصر مع تعافٍ تلقائي متوسط (Moderate Recovery)",
        doseMin: 0.05,
        doseMax: 0.07,
        unit: DOSE_UNITS.MG_PER_KG,
        doseType: "weight_bolus",
        basis: "spontaneous_recovery_guided",
        administration: {
          method: "slow_iv_push_with_antimuscarinic"
        },
        weightPolicy: {
          preferred: "IBW"
        },
        note: "الحد الأقصى المسموح به هو min(0.07 mg/kg, 5.0 mg)."
      }
    ],
    warnings: [
      "⚠️ بطء قلب شديد وتوقف انقباض: يُلزم إعطاء مضاد مسكاريني (Glycopyrrolate أو Atropine) بالتزامن لمنع التأثيرات المسكارينية القلبية.",
      "تأثيرات كولينية جانبية: فرط الإفرازات اللعابية والتنفسية، تشنج القصبات، زيادة حركة الأمعاء.",
      "الجرعات المفرطة قد تؤدي إلى ضعف عضلي تناقضي وزيادة الحصر (Cholinergic Block)."
    ],
    contraindications: [
      "الانسداد الميكانيكي للأمعاء أو المسالك البولية.",
      "التهاب البريتون الحاد.",
      "فرط الحساسية للنيوستيغمين."
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
      triadComponent: "reversal_emergency",
      category: "reversal_agent",
      subcategory: "antimuscarinic"
    },
    safety: {
      highRiskMedication: false,
      requiresRespiratoryMonitoring: false
    },
    clinicalFlags: ["hemodynamic_stability"],
    indications: [
      { id: "neostigmine_adjunct", label: { en: "Protection against muscarinic side effects of neostigmine", ar: "الحد من الآثار المسكارينية للنيوستيغمين أثناء عكس الحصر العضلي" } },
      { id: "antisialagogue_premed", label: { en: "Reduction of salivary and respiratory secretions", ar: "تقليل المفرزات اللعابية والتنفسية قبل التخدير" } }
    ],
    presentations: [
      {
        value: 0.2,
        concentration: 0.2,
        unit: DOSE_UNITS.MG_PER_ML,
        label: "0.2 mg/mL (أمبولة جاهزة 1 مل / 5 مل)",
        isDefault: true
      }
    ],
    pharmacodynamics: {
      onset: "حوالي دقيقة واحدة (وريدياً)",
      peak: "5 – 10 دقائق (يتطابق زمنياً مع ذروة النيوستيغمين)",
      clinicalDuration: "2 – 4 ساعات"
    },
    clinicalContexts: [
      {
        id: "neostigmine_pairing",
        population: "adult_pediatric",
        route: "IV",
        label: "المشاركة المتزامنة مع النيوستيغمين (Neostigmine Pairing Ratio)",
        pairing: {
          targetAgentId: "neostigmine",
          ratioMgPerMg: 0.2,
          ruleDescription: "0.2 mg غليكوبيرولات لكل 1.0 mg نيوستيغمين"
        },
        doseMin: 0.2,
        doseMax: 0.2,
        unit: DOSE_UNITS.MG_FIXED,
        doseType: "fixed",
        basis: "fixed_ratio_with_neostigmine",
        administration: {
          method: "slow_iv_push",
          note: "يُحقن متزامناً مع النيوستيغمين في نفس المحقنة أو وريدياً ببطء."
        },
        isDefault: true,
        note: "النسبة المعيارية: 0.2 mg غليكوبيرولات لكل 1.0 mg نيوستيغمين (أو 1 مل روبينول لكل 1 مل نيوستيغمين 0.5 mg/mL)."
      }
    ],
    warnings: [
      "مركب أمونيومي رباعي لا يعبر الحاجز الدموي الدماغي (BBB) مقارنة بالأتروبين.",
      "تسارع ضربات القلب وجفاف الفم.",
      "احتباس البول وتأخر إفراغ المثانة."
    ],
    contraindications: [
      "الانسداد البولي أو الهضمي الميكانيكي.",
      "الزرق ضيق الزاوية الحاد غير المعالج.",
      "فرط الحساسية للغليكوبيرولات."
    ]
  }
];

export default relaxationData;
