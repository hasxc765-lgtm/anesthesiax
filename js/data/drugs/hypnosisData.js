/**
 * AnesthesiaX — Drug Center: Hypnosis & Induction Data Module
 * Component: Anesthesia Triad — Part 2 (Hypnosis, Sedation & Inhalation)
 * File: js/data/drugs/hypnosisData.js
 *
 * Production-Grade Clinical Reference Dataset
 * Validated against FDA Approved Prescribing Information (2024–2026),
 * Miller's Anesthesia 9th Ed, and Pediatric Anesthesia Guidelines.
 */

import { DOSE_UNITS } from "../common/doseUnits.js";

export const hypnosisData = [
  // =========================================================================
  // A) INTRAVENOUS INDUCTION AGENTS (أدوية التنويم والاستحثاث الوريدي)
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
    safety: {
      highRiskMedication: true,
      requiresAirwayReady: true,
      requiresRespiratoryMonitoring: true
    },
    clinicalFlags: ["resp_depression", "hypotension_risk", "pain_on_injection", "lipid_emulsion"],
    indications: [
      { id: "ga_induction", label: { en: "Induction of general anesthesia (Adult & Pediatric)", ar: "استحثاث التخدير العام للبالغين والأطفال" } },
      { id: "ga_maintenance", label: { en: "Maintenance of general anesthesia (TIVA / Balanced)", ar: "المداومة على التخدير العام بالتسريب المستمر" } },
      { id: "monitored_sedation", label: { en: "Monitored anesthesia care (MAC) sedation", ar: "التهدئة الإجرائية المراقبة" } }
    ],
    presentations: [
      { value: 10, concentration: 10, unit: DOSE_UNITS.MG_PER_ML, label: "10 mg/mL (مستحلب 1% القياسي — 20 مل)", isDefault: true },
      { value: 20, concentration: 20, unit: DOSE_UNITS.MG_PER_ML, label: "20 mg/mL (مستحلب 2% عالي التركيز)", isDefault: false }
    ],
    pharmacodynamics: {
      onset: "30 – 45 ثانية (زمن دوران ذراع - دماغ)",
      peak: "1 دقيقة",
      clinicalDuration: "4 – 8 دقائق بعد الجرعة المفردة"
    },
    clinicalContexts: [
      {
        id: "healthy_adult_induction",
        population: "adult_healthy_under_65",
        route: "IV",
        label: "استحثاث البالغين الأصحاء (< 65 عاماً / ASA I-II)",
        doseMin: 2.0,
        doseMax: 2.5,
        unit: DOSE_UNITS.MG_PER_KG,
        doseType: "weight_bolus",
        isDefault: true,
        note: "تُعاير الجرعة سريرياً؛ الاستخدام المسبق للأفيونات يخفض الجرعة المطلوبة."
      },
      {
        id: "pediatric_induction",
        population: "pediatric_3_to_16",
        route: "IV",
        label: "استحثاث الأطفال (Pediatric Induction: 3 – 16 سنة)",
        doseMin: 2.5,
        doseMax: 3.5,
        unit: DOSE_UNITS.MG_PER_KG,
        doseType: "weight_bolus",
        note: "يحتاج الأطفال لجرعات أعلى لكبر حجم التوزيع وسرعة الاستقلاب."
      },
      {
        id: "elderly_debilitated_induction",
        population: "elderly_or_asa_3_4",
        route: "IV",
        label: "كبار السن (≥ 65 عاماً) أو الحالات الحرجة ASA III-IV",
        doseMin: 1.0,
        doseMax: 1.5,
        unit: DOSE_UNITS.MG_PER_KG,
        doseType: "weight_bolus",
        note: "معايرة بطيئة جداً لتفادي هبوط الضغط الشديد والانهيار الوعائي."
      },
      {
        id: "tiva_maintenance",
        population: "adult",
        route: "IV",
        label: "جرعة المداومة بالتسريب المستمر (TIVA Maintenance)",
        doseMin: 100,
        doseMax: 200,
        unit: DOSE_UNITS.MCG_PER_KG_MIN,
        doseType: "weight_infusion_min",
        note: "تُعاير وفق الاستجابة وعمق التخدير والتخطيط الدماغي (BIS 40-60)."
      }
    ],
    warnings: [
      "هبوط الجهد الشرياني وبطء القلب، خصوصاً في مرضى نقص الحجم الدموي والتجفاف.",
      "تثبيط تنفسي عميق وانقطاع نفس (Apnea) يتطلب الجاهزية الفورية للتهوية بالماسك.",
      "ألم عند الحقن الوريدي (يمكن تخفيفه بحقن 20-40 ملغ ليدوكايين مسبقاً).",
      "⚠️ متلازمة تسريب البروبوفول (PRIS): خطر نادر وقاتل مرتبط بالتسريب المطول بجرعات عالية (>4 mg/kg/h لأكثر من 48 ساعة)."
    ],
    contraindications: [
      "فرط الحساسية المثبتة للبروبوفول أو مكونات المستحلب الدهني (الحساسية التأقية الشديدة للبيض/الصويا).",
      "الاستخدام دون جاهزية فورية لتأمين المجرى الهوائي والتهوية بالضغط الموجب."
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
    safety: {
      highRiskMedication: true,
      requiresAirwayReady: true,
      requiresRespiratoryMonitoring: true
    },
    clinicalFlags: ["hemodynamic_stability", "adrenal_suppression", "myoclonus", "ponv_risk"],
    indications: [
      { id: "hemodynamic_unstable_induction", label: { en: "Induction in hemodynamically compromised and cardiac patients", ar: "استحثاث التخدير العام لمرضى القلب والصدمة وعدم الاستقرار الوعائي" } }
    ],
    presentations: [
      { value: 2, concentration: 2, unit: DOSE_UNITS.MG_PER_ML, label: "2 mg/mL (أمبولة جاهزة 20 ملغ في 10 مل)", isDefault: true }
    ],
    pharmacodynamics: {
      onset: "30 – 60 ثانية",
      peak: "1 دقيقة",
      clinicalDuration: "3 – 8 دقائق"
    },
    clinicalContexts: [
      {
        id: "induction_standard",
        population: "adult",
        route: "IV",
        label: "جرعة الاستحثاث القياسية لمرضى القلب والصدمة (Induction Bolus)",
        doseMin: 0.2,
        doseMax: 0.3,
        unit: DOSE_UNITS.MG_PER_KG,
        doseType: "weight_bolus",
        isDefault: true,
        note: "حقن وريدي بطيء على مدى 30-60 ثانية؛ يتميز بالثبات القلبي الوعائي الفائق."
      }
    ],
    warnings: [
      "⚠️ التثبيط الكظري: تثبيط مؤقت لتخليق الكورتيزول يستمر لساعات حتى بعد جرعة الاستحثاث المفردة.",
      "الرمع العضلي (Myoclonus) شائع جداً أثناء التحريض (يخف بإعطاء فنتانيل مسبقاً).",
      "ألم موضعي عند الحقن الوريدي، ومعدل مرتفع نسبياً للغثيان والقيء بعد العمليات (PONV)."
    ],
    contraindications: [
      "فرط الحساسية المثبتة للإيتوميدات.",
      "المرضى المصابون بالقصور الكظري الصريح أو البورفيريا الحادة."
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
    safety: {
      highRiskMedication: true,
      requiresAirwayReady: true,
      requiresRespiratoryMonitoring: true
    },
    clinicalFlags: ["sympathetic_stimulation", "bronchodilator", "dissociative_anesthesia", "emergence_delirium"],
    indications: [
      { id: "induction_shock_bronchospasm", label: { en: "Induction in shock, hemodynamic instability, or severe bronchospasm", ar: "الاستحثاث في حالات الصدمة وتشنج القصبات الحاد" } },
      { id: "short_procedures", label: { en: "Anesthesia for short procedures and IM induction", ar: "تخدير الإجراءات القصيرة والتحريض العضلي" } }
    ],
    presentations: [
      { value: 10, concentration: 10, unit: DOSE_UNITS.MG_PER_ML, label: "10 mg/mL (تخفيف 50 ملغ في 5 مل سالاين)", isDefault: true },
      { value: 50, concentration: 50, unit: DOSE_UNITS.MG_PER_ML, label: "50 mg/mL (أمبولة أصلية 500 ملغ في 10 مل)" },
      { value: 100, concentration: 100, unit: DOSE_UNITS.MG_PER_ML, label: "100 mg/mL (أمبولة مركزة - تتطلب التخفيف الإلزامي للوريد)" }
    ],
    pharmacodynamics: {
      onset: "30 – 60 ثانية (وريدياً) / 3 – 4 دقائق (عضلياً)",
      peak: "1 – 2 دقيقة (IV)",
      clinicalDuration: "10 – 20 دقيقة (IV) / 15 – 25 دقيقة (IM)"
    },
    clinicalContexts: [
      {
        id: "iv_induction_typical",
        population: "adult_pediatric",
        route: "IV",
        label: "جرعة الاستحثاث الوريدي الكامل (IV Induction Bolus)",
        doseMin: 1.0,
        doseMax: 2.0,
        unit: DOSE_UNITS.MG_PER_KG,
        doseType: "weight_bolus",
        isDefault: true,
        note: "حقن وريدي بطيء على مدى 60 ثانية؛ يُنتج حالة تخدير انفصالي (Dissociative Anesthesia)."
      },
      {
        id: "im_induction_surgical",
        population: "pediatric_uncooperative",
        route: "IM",
        label: "جرعة الاستحثاث العضلي للأطفال غير المتعاونين (IM Induction)",
        doseMin: 6.5,
        doseMax: 10.0,
        unit: DOSE_UNITS.MG_PER_KG,
        doseType: "weight_bolus",
        note: "حقن عضلي عميق؛ ينتج تخديراً جراحياً خلال 3 – 4 دقائق."
      }
    ],
    warnings: [
      "تنبيه القلب والأوعية الدموية (يرفع النبض والضغط عبر التنبيه الودي غير المباشر).",
      "ردود فعل الإفاقة (Emergence Delirium): هلوسات وأحلام مزعجة (تُعالج بإعطاء الميدازولام).",
      "زيادة الإفرازات اللعابية والتنفسية؛ جاهزية جهاز الشفط إلزامية."
    ],
    contraindications: [
      "ارتفاع ضغط الدم الشديد غير المضبوط، تسلخ الشريان الأبهر، وتمدد الأوعية الدموية (Aneurysm).",
      "ارتفاع الضغط داخل الجمجمة المهدد للحياة وأورام الدماغ المشغلة للحيز.",
      "فرط الحساسية المثبتة للكيتامين."
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
    safety: {
      highRiskMedication: true,
      requiresAirwayReady: true,
      requiresRespiratoryMonitoring: true
    },
    clinicalFlags: ["porphyria_trigger", "tissue_necrosis_risk", "resp_depression", "icp_reduction"],
    indications: [
      { id: "ga_induction", label: { en: "Induction of general anesthesia and rapid sequence induction (RSI)", ar: "استحثاث التخدير العام والتنبيب السريع المتسلسل" } },
      { id: "status_epilepticus", label: { en: "Control of convulsive states and brain protection", ar: "السيطرة على النوبات الصرعية والحماية الدماغية" } }
    ],
    presentations: [
      { value: 25, concentration: 25, unit: DOSE_UNITS.MG_PER_ML, label: "25 mg/mL (محلول 2.5% محضر حديثاً)", isDefault: true }
    ],
    pharmacodynamics: {
      onset: "20 – 30 ثانية",
      peak: "40 ثانية",
      clinicalDuration: "5 – 10 دقائق (إعادة توزيع سريع)"
    },
    clinicalContexts: [
      {
        id: "adult_induction",
        population: "adult",
        route: "IV",
        label: "جرعة الاستحثاث الوريدية القياسية (Standard Adult Induction)",
        doseMin: 3.0,
        doseMax: 5.0,
        unit: DOSE_UNITS.MG_PER_KG,
        doseType: "weight_bolus",
        isDefault: true,
        note: "محلول شديد القلوية (pH ≈ 10.5)؛ يخفض استهلاك الأكسجين الدماغي (CMRO2) والضغط داخل القحف."
      }
    ],
    warnings: [
      "⚠️ الحقن الشرياني الخاطئ: يسبب تشنجاً شريانياً حاداً وتخثراً ونخراً نسيجياً شديداً قد ينتهي ببتر الطرف.",
      "التسرب خارج الوريد (Extravasation): يسبب تخريشاً نسيجياً شديداً وتنخراً.",
      "تثبيط تنفسي وتوسع وعائي يؤدي لهبوط ملحوظ في ضغط الدم."
    ],
    contraindications: [
      "الأنماط الحادة من البورفيريا (Acute Porphyria) — مانع استعمال مطلق.",
      "فرط الحساسية للباربيتورات.",
      "الربو القصبي الحاد الشديد غير المستقر."
    ]
  },

  // =========================================================================
  // B) SEDATIVES & ANXIOLYTICS (المهدئات ومضادات القلق)
  // =========================================================================
  {
    id: "midazolam",
    name: {
      generic: "Midazolam HCl",
      arabic: "ميدازولام",
      brandNames: ["Versed", "Dormicum"]
    },
    classification: {
      triadComponent: "sedation",
      category: "sedatives",
      subcategory: "benzodiazepine"
    },
    safety: {
      highRiskMedication: true,
      requiresAirwayReady: true,
      requiresRespiratoryMonitoring: true
    },
    clinicalFlags: ["resp_depression", "anterograde_amnesia", "synergistic_effect"],
    indications: [
      { id: "premedication_anxiolysis", label: { en: "Preoperative sedation, anxiolysis, and anterograde amnesia", ar: "التهدئة وإزالة القلق وفقدان الذاكرة التقدمي قبل العمليات" } },
      { id: "procedural_sedation", label: { en: "Sedation for diagnostic and therapeutic procedures", ar: "التهدئة المراقبة للإجراءات التنظيرية والموضعية" } }
    ],
    presentations: [
      { value: 1, concentration: 1, unit: DOSE_UNITS.MG_PER_ML, label: "1 mg/mL (أمبولة مخففة جاهزة — 5 مل)", isDefault: true },
      { value: 5, concentration: 5, unit: DOSE_UNITS.MG_PER_ML, label: "5 mg/mL (أمبولة مركزة 5 ملغ / 1 مل)" }
    ],
    pharmacodynamics: {
      onset: "1 – 2 دقيقة (وريدياً)",
      peak: "3 – 5 دقائق",
      clinicalDuration: "30 – 60 دقيقة"
    },
    clinicalContexts: [
      {
        id: "preop_sedation_bolus",
        population: "adult",
        route: "IV",
        label: "تهدئة ما قبل العمليات (Preop Anxiolysis Bolus)",
        doseMin: 0.02,
        doseMax: 0.04,
        unit: DOSE_UNITS.MG_PER_KG,
        doseType: "weight_bolus",
        isDefault: true,
        note: "جرعة خفيفة (1 – 2 ملغ للبالغين) تُعطى قبل الدخول للصالة للمعايرة اللطيفة."
      },
      {
        id: "procedural_sedation_adult",
        population: "adult",
        route: "IV",
        label: "التهدئة الإجرائية للعمليات الموضعية (Procedural Sedation)",
        doseMin: 0.05,
        doseMax: 0.1,
        unit: DOSE_UNITS.MG_PER_KG,
        doseType: "weight_bolus",
        note: "حقن مجزأ ببطء بجرعات 0.5-1 ملغ مع الانتظار دقيقتين لتقييم التأثير. الترياق: Flumazenil."
      }
    ],
    warnings: [
      "تثبيط تنفسي شديد وتآزر خطير عند المشاركة مع الأفيونات (فنتانيل/مورفين).",
      "تفاعلات تناقضية (Paradoxical Reaction) من الهياج قد تحدث لدى كبار السن والأطفال.",
      "تأخر الإفاقة وبطء التخلص لدى كبار السن وقصور الكبد/الكلى."
    ],
    contraindications: [
      "الزرق مغلق الزاوية الحاد (Acute Narrow-Angle Glaucoma).",
      "الوهن العضلي الوبيل الشديد (Myasthenia Gravis) غير المضبوط.",
      "القصور التنفسي الحاد في غياب دعم التهوية."
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
      triadComponent: "sedation",
      category: "sedatives",
      subcategory: "alpha2_agonist"
    },
    safety: {
      highRiskMedication: true,
      requiresAirwayReady: false,
      requiresRespiratoryMonitoring: true
    },
    clinicalFlags: ["bradycardia_risk", "hypotension_risk", "spontaneous_resp_preserved"],
    indications: [
      { id: "icu_sedation", label: { en: "Sedation of intubated/ventilated ICU patients", ar: "تهدئة مرضى العناية المركزة المنبوبين" } },
      { id: "procedural_sedation", label: { en: "Procedural sedation in non-intubated patients", ar: "التهدئة الإجرائية الواعية دون تثبيط التنفس" } }
    ],
    presentations: [
      { value: 4, concentration: 4, unit: DOSE_UNITS.MCG_PER_ML, label: "4 mcg/mL (محلول تسريب جاهز RTU — 100 mcg / 25 mL)", isDefault: true },
      { value: 100, concentration: 100, unit: DOSE_UNITS.MCG_PER_ML, label: "100 mcg/mL (مركز — يتطلب التخفيف الإلزامي في سالاين)" }
    ],
    pharmacodynamics: {
      onset: "5 – 10 دقائق",
      peak: "15 – 30 دقيقة",
      clinicalDuration: "60 – 120 دقيقة بعد إيقاف التسريب"
    },
    clinicalContexts: [
      {
        id: "loading_infusion",
        population: "adult",
        route: "IV",
        label: "جرعة تحميل بطيئة خلال 10 دقائق (Loading Infusion: 0.5 - 1.0 mcg/kg)",
        doseMin: 0.5,
        doseMax: 1.0,
        unit: DOSE_UNITS.MCG_PER_KG,
        doseType: "weight_bolus",
        isDefault: true,
        note: "تُعطى عبر مضخة التسريب حصراً على مدى 10 دقائق؛ يمنع الحقن الدفعي المباشر السريع."
      },
      {
        id: "maintenance_infusion",
        population: "adult",
        route: "IV",
        label: "المداومة بالتسريب المستمر (Maintenance Infusion)",
        doseMin: 0.2,
        doseMax: 0.7,
        unit: DOSE_UNITS.MCG_PER_KG_HOUR,
        doseType: "weight_infusion_hour",
        note: "تسريب مستمر يحافظ على استجابة المريض وتنفسه التلقائي دون تثبيط للمراكز التنفسية."
      }
    ],
    warnings: [
      "بطء قلب ملحوظ (Sinus Bradycardia) وهبوط في ضغط الدم نتيجة تثبيط السيالة الودية.",
      "الحقن السريع قد يؤدي إلى ارتفاع ضغط عابر متناقض بسبب تحفيز مستقبلات ألفا-2B الوعائية المحيطية.",
      "يُعطى بالتسريب البطيء بمضخة المحاقن حصراً."
    ],
    contraindications: [
      "إحصار القلب المتقدم من الدرجة الثانية أو الثالثة (Advanced AV Block) دون ناظم خطى.",
      "بطء القلب الشديد غير المعالج وهبوط الضغط الحاد."
    ]
  },

  // =========================================================================
  // C) VOLATILE INHALATIONAL ANESTHETICS (الغازات الاستنشاقية ومبخرات الـ MAC)
  // =========================================================================
  {
    id: "sevoflurane",
    name: {
      generic: "Sevoflurane",
      arabic: "سيفوفلوران",
      brandNames: ["Ultane", "Sevorane"]
    },
    classification: {
      triadComponent: "inhalation",
      category: "volatile_anesthetic",
      subcategory: "halogenated_ether"
    },
    safety: {
      highRiskMedication: true,
      requiresAirwayReady: true
    },
    clinicalFlags: ["mh_trigger", "bronchodilator", "emergence_agitation", "compound_a_risk"],
    indications: [
      { id: "induction_and_maintenance", label: { en: "Induction and maintenance of general anesthesia", ar: "استحثاث والمداومة على التخدير العام للبالغين والأطفال" } }
    ],
    presentations: [
      { value: 100, concentration: 100, unit: DOSE_UNITS.PERCENT_LIQUID, label: "100% Volatile Liquid (مخصص للمبخرة الصفراء)", isDefault: true }
    ],
    pharmacodynamics: {
      onset: "سريع جداً (استنشاقي)",
      clinicalDuration: "إفاقة سريعة حسب مدة التعرض وإيقاف المبخرة"
    },
    macModel: {
      referenceAge: 40,
      referenceValue: 2.05,
      carrierGas: "100% O2",
      unit: DOSE_UNITS.PERCENT_MAC
    },
    warnings: [
      "⚠️ محرض قوي لمتلازمة فرط الحرارة الخبيث (Malignant Hyperthermia Trigger).",
      "تشكل المركب A (Compound A) عند التفاعل مع جير الصودا الجاف في دارات التخدير المغلقة بتدفق غازات منخفض جداً.",
      "هياج الإفاقة (Emergence Agitation) شائع لدى الأطفال بعد الاستيقاظ السريع."
    ],
    contraindications: [
      "الاستعداد الوراثي المعروف لمتلازمة فرط الحرارة الخبيث (MH).",
      "سوابق اعتلال كبدي أو يرقان غير مفسر متصل بالتعرض للغازات الهالوجينية."
    ]
  },

  {
    id: "isoflurane",
    name: {
      generic: "Isoflurane",
      arabic: "آيزوفلوران",
      brandNames: ["Forane"]
    },
    classification: {
      triadComponent: "inhalation",
      category: "volatile_anesthetic",
      subcategory: "halogenated_ether"
    },
    safety: {
      highRiskMedication: true,
      requiresAirwayReady: true
    },
    clinicalFlags: ["mh_trigger", "airway_irritant", "hemodynamic_stability"],
    indications: [
      { id: "maintenance_general", label: { en: "Maintenance of general anesthesia", ar: "المداومة على التخدير العام في الجراحات الطويلة وجراحة الأعصاب" } }
    ],
    presentations: [
      { value: 100, concentration: 100, unit: DOSE_UNITS.PERCENT_LIQUID, label: "100% Volatile Liquid (مخصص للمبخرة البنفسجية)", isDefault: true }
    ],
    pharmacodynamics: {
      onset: "متوسط السرعة (استنشاقي)",
      clinicalDuration: "إفاقة متوسطة تعتمد على التهوية ومدة التخدير"
    },
    macModel: {
      referenceAge: 40,
      referenceValue: 1.15,
      carrierGas: "100% O2",
      unit: DOSE_UNITS.PERCENT_MAC
    },
    warnings: [
      "⚠️ محرض لمتلازمة فرط الحرارة الخبيث (MH).",
      "رائحة نفاذة ومخرشة للمجرى التنفسي؛ لا يناسب استحثاث الأطفال بالكمامة لمنع السعال وتشنج القصبات.",
      "توسع وعائي محيطي وهبوط في المقاومة الوعائية الجهازية (SVR)."
    ],
    contraindications: [
      "الاستعداد الوراثي المعروف لفرط الحرارة الخبيث.",
      "فرط الحساسية للغازات الهالوجينية."
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
      triadComponent: "inhalation",
      category: "volatile_anesthetic",
      subcategory: "fluorinated_ether"
    },
    safety: {
      highRiskMedication: true,
      requiresAirwayReady: true
    },
    clinicalFlags: ["mh_trigger", "sympathetic_stimulation", "airway_irritant"],
    indications: [
      { id: "maintenance_rapid_emergence", label: { en: "Maintenance of general anesthesia with ultra-rapid emergence", ar: "المداومة على التخدير العام مع إفاقة فائقة السرعة لجراحات السمنة وجراحة اليوم الواحد" } }
    ],
    presentations: [
      { value: 100, concentration: 100, unit: DOSE_UNITS.PERCENT_LIQUID, label: "100% Volatile Liquid (مخصص للمبخرة المدفأة الزرقاء Tec 6)", isDefault: true }
    ],
    pharmacodynamics: {
      onset: "فائق السرعة (استنشاقي)",
      clinicalDuration: "إفاقة فائقة السرعة ومستقلة نسبياً عن مدة التخدير"
    },
    macModel: {
      referenceAge: 40,
      referenceValue: 6.0,
      carrierGas: "100% O2",
      unit: DOSE_UNITS.PERCENT_MAC
    },
    warnings: [
      "⚠️ محرض قوي لمتلازمة فرط الحرارة الخبيث (MH).",
      "تنبيه وتنشيط ودي مفاجئ: الرفع السريع لتركيز الديسفلوران يسبب تسارع القلب وارتفاع ضغط الدم.",
      "تخريش شديد للمجرى الهوائي؛ يمنع استخدامه كلياً للتحريض الاستنشاقي بالماسك لخطورة حدوث تشنج الحنجرة (Laryngospasm)."
    ],
    contraindications: [
      "الاستعداد الوراثي المعروف لمتلازمة فرط الحرارة الخبيث.",
      "فرط الحساسية للغازات الهالوجينية."
    ]
  }
];

export default hypnosisData;
