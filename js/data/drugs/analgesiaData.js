/**
 * AnesthesiaX — Drug Center: Analgesia Data Module
 * Component: Anesthesia Triad — Part 1 (Analgesia)
 * File: js/data/drugs/analgesiaData.js
 *
 * Production-Grade Clinical Reference Dataset
 * Validated against: 
 * - FDA Approved Prescribing Information (Fentanyl, Ultiva, Ofirmev, Toradol, Demerol, Ultram)
 * - UK Electronic Medicines Compendium (eMC) — Voltarol Ampoules SmPC
 * - European Medicines Agency (EMA) — Dynastat (Parecoxib) SmPC
 * - ASRA-AAPM Consensus Guidelines on Ketamine
 * - Miller's Anesthesia 9th Ed & Morgan & Mikhail's Clinical Anesthesiology 7th Ed.
 */

import { DOSE_UNITS } from "../common/doseUnits.js";

export const analgesiaData = [
  // =========================================================================
  // A) OPIOID ANALGESICS (المسكنات الأفيونية)
  // =========================================================================
  {
    id: "fentanyl",
    name: {
      generic: "Fentanyl Citrate",
      arabic: "فنتانيل",
      brandNames: ["Sublimaze"]
    },
    classification: {
      triadComponent: "analgesia",
      category: "analgesics",
      subcategory: "opioids"
    },
    safety: {
      highRiskMedication: true,
      requiresAirwayReady: true,
      requiresRespiratoryMonitoring: true
    },
    clinicalFlags: ["resp_depression", "chest_wall_rigidity_risk", "bradycardia_risk"],
    indications: [
      { id: "intubation_blunting", label: { ar: "تثبيط الاستجابة الودية لتنظير الحنجرة والتنبيب", en: "Blunting sympathetic response to laryngoscopy and tracheal intubation" } },
      { id: "balanced_maintenance", label: { ar: "التسكين أثناء التخدير العام المتوازن", en: "Intraoperative analgesia during balanced general anesthesia" } },
      { id: "pacu_rescue", label: { ar: "تسكين الألم الحاد والمعايرة في وحدة الإفاقة", en: "Postoperative acute pain titration in PACU" } }
    ],
    routes: ["IV", "IM"],
    weightPolicy: {
      preferred: "TBW",
      note: "شديد الذوبان في الدهون؛ يُعاير بحسب الاستجابة السريرية والعمر مع خفض الجرعة البدئية في كبار السن والسمنة المفرطة."
    },
    presentations: [
      { value: 50, concentration: 50, unit: DOSE_UNITS.MCG_PER_ML, label: "50 mcg/mL (أمبولة جاهزة 2 مل / 10 مل)", isDefault: true },
      { value: 10, concentration: 10, unit: DOSE_UNITS.MCG_PER_ML, label: "10 mcg/mL (مخفف: 100 مايكرو في 10 مل سالاين)" }
    ],
    pharmacodynamics: {
      onset: "1 – 2 دقيقة (وريدياً)",
      peak: "3 – 5 دقائق",
      clinicalDuration: "30 – 60 دقيقة (يمتد مع الجرعات التراكمية)"
    },
    administration: {
      route: "IV",
      method: "slow_push",
      pushSpeed: "حقن وريدي بطيء على مدى 1 – 2 دقيقة.",
      dilutionProtocol: "يمكن إعطاؤه بتركيزه الأصلي (50 mcg/mL) أو تخفيفه إلى 10 mcg/mL في سالاين 0.9% لتسهيل المعايرة الدقيقة للأطفال."
    },
    clinicalContexts: [
      {
        id: "intubation_blunting",
        label: "جرعة الاستحثاث وتثبيط استجابة التنبيب (Induction Bolus)",
        doseMin: 1.0,
        doseMax: 2.0,
        unit: DOSE_UNITS.MCG_PER_KG,
        doseType: "weight_bolus",
        isDefault: true,
        note: "تُعطى قبل تنظير الحنجرة بـ 2-3 دقائق لتتزامن ذروة التسكين مع التحفيز الودي."
      },
      {
        id: "balanced_maintenance",
        label: "جرعة المداومة أثناء التخدير المتوازن (Maintenance Bolus)",
        doseMin: 0.5,
        doseMax: 1.5,
        unit: DOSE_UNITS.MCG_PER_KG,
        doseType: "weight_bolus",
        note: "جرعات دفعية متكررة كل 30-45 دقيقة بحسب المؤشرات الحيوية واستجابة الجهاز العصبي الذاتي."
      },
      {
        id: "higher_dose_technique",
        label: "تقنية التسكين بجرعات عالية لجراحات القلب (Higher-Dose Technique)",
        doseMin: 2.0,
        doseMax: 5.0,
        unit: DOSE_UNITS.MCG_PER_KG,
        doseType: "weight_bolus",
        note: "مخصصة لجراحات القلب الكبرى؛ تتطلب تهوية آلية إلزامية ومراقبة لصيقة في العناية المركزة."
      },
      {
        id: "pacu_rescue",
        label: "تسكين الألم في وحدة الإفاقة (PACU Incremental Bolus)",
        doseMin: 25.0,
        doseMax: 50.0,
        unit: DOSE_UNITS.MCG_FIXED,
        doseType: "fixed_bolus",
        note: "جرعات تدريجية مجزأة (25-50 mcg) كل 5 دقائق مع المراقبة اللصيقة لمعدل التنفس ومستوى الوعي."
      }
    ],
    warnings: [
      "تثبيط تنفسي معتمد على الجرعة يتطلب الجاهزية الفورية لدعم التهوية بالضغط الموجب وتأمين المجرى الهوائي.",
      "الحقن الوريدي السريع بجرعات عالية قد يسبب تصلب عضلات جدار الصدر (Chest Wall / Wooden Rigidity).",
      "يعزز هبوط ضغط الدم وبطء القلب عند مشاركته مع المنومات (مثل البروبوفول) أو المهدئات."
    ],
    contraindications: [
      "فرط الحساسية المعروفة للفنتانيل أو مشتقات الفينيل بيبيريدين.",
      "عدم توفر مراقبة مناسبة وتجهيزات دعم المجرى الهوائي والتهوية بالضغط الموجب."
    ],
    references: [
      { type: "regulatory", organization: "FDA", title: "Fentanyl Citrate Injection Prescribing Information", year: "2024" },
      { type: "textbook", organization: "Miller", title: "Miller's Anesthesia, 9th Ed. — Opioid Pharmacology & Dosing", year: "2020" }
    ]
  },

  {
    id: "remifentanil",
    name: {
      generic: "Remifentanil HCl",
      arabic: "ريميفنتانيل",
      brandNames: ["Ultiva"]
    },
    classification: {
      triadComponent: "analgesia",
      category: "analgesics",
      subcategory: "opioids"
    },
    safety: {
      highRiskMedication: true,
      requiresAirwayReady: true,
      requiresRespiratoryMonitoring: true
    },
    clinicalFlags: ["resp_depression", "rapid_offset", "ultra_short_acting"],
    indications: [
      { id: "induction_bolus", label: { ar: "التسكين والتحكم الاستجابتي أثناء الاستحثاث والتنبيب", en: "Analgesia and blunting response during induction and intubation" } },
      { id: "maintenance_infusion", label: { ar: "التسكين المستمر كجزء من TIVA أو التخدير المتوازن", en: "Continuous infusion maintenance as part of TIVA or balanced anesthesia" } },
      { id: "mac_spontaneous_breathing", label: { ar: "رعاية التخدير المراقبة مع التنفس التلقائي", en: "Monitored anesthesia care (MAC) with spontaneous ventilation" } }
    ],
    routes: ["IV Infusion", "IV Bolus (Airway Secured)"],
    weightPolicy: {
      preferred: "IBW",
      note: "في السمنة الشديدة، ترتبط التصفية بالوزن المثالي (IBW) بدقة؛ يجب المعايرة السريرية لتفادي بطء القلب وهبوط الضغط الحاد."
    },
    presentations: [
      { value: 20, concentration: 20, unit: DOSE_UNITS.MCG_PER_ML, label: "20 mcg/mL (تخفيف 1 ملغ في 50 مل سالاين)", isDefault: true },
      { value: 50, concentration: 50, unit: DOSE_UNITS.MCG_PER_ML, label: "50 mcg/mL (تخفيف 2 ملغ في 40 مل سالاين)" }
    ],
    pharmacodynamics: {
      onset: "1 – 1.5 دقيقة",
      peak: "1.5 – 2 دقيقة",
      clinicalDuration: "3 – 8 دقائق (استقلاب فائق السرعة بإسترازات الدم والأنسجة غير النوعية)"
    },
    administration: {
      route: "IV",
      method: "infusion_preferred",
      pushSpeed: "الحقن الدفعي (Bolus) يتم ببطء شديد على مدى 30-60 ثانية وفقط في وجود مجرى هوائي مؤمن. يُفضل دائماً الإعطاء عبر التسريب بمضخة المحاقن.",
      dilutionProtocol: "يأتي كمسحوق جاف (1 ملغ أو 2 ملغ) ويُحل في سالاين 0.9% أو ديكستروز 5% ليصبح بتركيز 20-50 mcg/mL."
    },
    clinicalContexts: [
      {
        id: "induction_bolus",
        label: "جرعة الاستحثاث والتحكم بالمجرى الهوائي (Induction Bolus)",
        doseMin: 0.5,
        doseMax: 1.0,
        unit: DOSE_UNITS.MCG_PER_KG,
        doseType: "weight_bolus",
        isDefault: true,
        note: "تُعطى ببطء على مدى 30-60 ثانية قبل التنبيب وفقط مع الجاهزية التامة لإدارة المجرى الهوائي."
      },
      {
        id: "maintenance_infusion",
        label: "جرعة المداومة بالتسريب المستمر (Maintenance Infusion)",
        doseMin: 0.1,
        doseMax: 0.5,
        unit: DOSE_UNITS.MCG_PER_KG_MIN,
        doseType: "weight_infusion_min",
        note: "تتم المعايرة بزيادة أو خفض 0.05 mcg/kg/min حسب المؤشرات الحيوية وعمق التسكين المطلوب."
      },
      {
        id: "mac_spontaneous_breathing",
        label: "رعاية التخدير المراقبة والتنفس التلقائي (MAC – Spontaneous Breathing)",
        doseMin: 0.025,
        doseMax: 0.2,
        unit: DOSE_UNITS.MCG_PER_KG_MIN,
        doseType: "weight_infusion_min",
        note: "جرعة البدء الشائعة 0.05 - 0.1 mcg/kg/min؛ تجنب الجرعات الدفعية لمنع انقطاع النفس."
      }
    ],
    warnings: [
      "ينتهي مفعوله التسكيني خلال 5-10 دقائق من إيقاف التسريب؛ يجب إعطاء مسكن انتقالي (مثل المورفين أو الباراسيتامول) قبل نهاية الجراحة.",
      "قد يسبب انقطاع نفس فوري (Apnea)، بطء قلب شديد، وهبوطاً حاداً في ضغط الدم عند الحقن السريع.",
      "قد يحرض فرط التحسس للألم الارتدادي (Opioid-Induced Hyperalgesia) بعد التسريب بجرعات عالية."
    ],
    contraindications: [
      "الحقن فوق الجافية أو داخل النخاع (Epidural/Intrathecal) لاحتوائه على مادة الغلايسين.",
      "فرط الحساسية لمركبات الفنتانيل ومشتقاتها."
    ],
    references: [
      { type: "regulatory", organization: "FDA", title: "Ultiva (Remifentanil HCl) for Injection Prescribing Information", year: "2024" },
      { type: "textbook", organization: "Miller", title: "Miller's Anesthesia, 9th Ed. — Context-Sensitive Half-Time & Metabolism", year: "2020" }
    ]
  },

  {
    id: "morphine",
    name: {
      generic: "Morphine Sulfate",
      arabic: "مورفين",
      brandNames: ["Morphine"]
    },
    classification: {
      triadComponent: "analgesia",
      category: "analgesics",
      subcategory: "opioids"
    },
    safety: {
      highRiskMedication: true,
      requiresAirwayReady: true,
      requiresRespiratoryMonitoring: true
    },
    clinicalFlags: ["resp_depression", "histamine_release", "delayed_peak_risk"],
    indications: [
      { id: "intraop_loading", label: { ar: "تسكين الألم الجراحي المتوسط إلى الشديد ممتد المفعول", en: "Moderate to severe intraoperative and postoperative surgical analgesia" } },
      { id: "pacu_titration", label: { ar: "معايرة تسكين الألم الحاد في وحدة الإفاقة", en: "Acute postoperative pain titration in PACU" } }
    ],
    routes: ["IV", "IM", "SC"],
    weightPolicy: {
      preferred: "TBW",
      note: "يُعاير بحذر شديد مع خفض الجرعة البدئية في كبار السن وقصور الكلى لتفادي التراكم والتثبيط التنفسي المتأخر."
    },
    presentations: [
      { 
        value: 1, 
        concentration: 1, 
        unit: DOSE_UNITS.MG_PER_ML, 
        label: "1 mg/mL (مخفف آمن: 10 ملغ في 10 مل سالاين 0.9%)", 
        isDefault: true 
      },
      { 
        value: 10, 
        concentration: 10, 
        unit: DOSE_UNITS.MG_PER_ML, 
        label: "10 mg/mL (أمبولة أصلية مركزة 1 مل - تتطلب الحذر في السحب)", 
        isDefault: false 
      }
    ],
    pharmacodynamics: {
      onset: "5 – 10 دقائق (وريدياً)",
      peak: "20 – 30 دقيقة (تأخر الذروة الوريدية)",
      clinicalDuration: "3 – 5 ساعات"
    },
    administration: {
      route: "IV",
      method: "slow_push",
      pushSpeed: "حقن وريدي بطيء (1-2 ملغ على مدى دقيقة إلى دقيقتين) لتقليل تحرر الهيستامين وهبوط الضغط.",
      dilutionProtocol: "توصية أمان سريرية: تُسحب أمبولة 10 ملغ وتُخفف إلى 10 مل بسالاين 0.9% لتصبح بتركيز 1 mg/mL لضمان دقة السحب وتجنب أخطاء الحيز الميت (Dead Space) خاصة للأوزان الصغيرة."
    },
    clinicalContexts: [
      {
        id: "intraop_loading",
        label: "جرعة التسكين أثناء العملية (Intraop Pre-emergence Bolus)",
        doseMin: 0.05,
        doseMax: 0.15,
        unit: DOSE_UNITS.MG_PER_KG,
        doseType: "weight_bolus",
        isDefault: true,
        note: "تُعطى قبل نهاية العملية بـ 20-30 دقيقة ليتزامن وقت الذروة مع الإفاقة؛ تخضع لمعايرة دقيقة بحسب استجابة المريض."
      },
      {
        id: "pacu_titration",
        label: "معايرة الألم في وحدة الإفاقة (PACU Incremental Titration)",
        doseMin: 1.0,
        doseMax: 2.0,
        unit: DOSE_UNITS.MG_FIXED,
        doseType: "fixed_bolus",
        note: "تُعطى 1-2 ملغ كل 5-10 دقائق مع المعايرة الحذرة. تجنب تكرار الجرعات السريعة لمنع التراكم الدوائي (Dose Stacking)."
      }
    ],
    warnings: [
      "تأخر ذروة التأثير التسكيني والتنفسي حتى 20-30 دقيقة وريدياً؛ تكرار الجرعات السريع يؤدي إلى تراكم الجرعة وحدوث تثبيط تنفسي متأخر.",
      "يحرر الهيستامين مسبباً هبوط ضغط شرياني واحمرار الجلد وتشنج القصبات؛ يُستخدم بحذر في مرضى الربو غير المستقر.",
      "تتراكم مستقلباته النشطة (M6G) في قصور وظائف الكلى مسببة تثبيطاً تنفسياً ممتداً؛ يتطلب خفض الجرعات والمراقبة."
    ],
    contraindications: [
      "فرط الحساسية المعروفة للمورفين.",
      "التثبيط التنفسي الشديد أو انسداد المجرى الهوائي في غياب التهوية الآلية.",
      "انسداد الأمعاء الشللي (Paralytic Ileus)."
    ],
    references: [
      { type: "regulatory", organization: "FDA", title: "Morphine Sulfate Injection Prescribing Information", year: "2024" },
      { type: "guideline", organization: "Oxford", title: "Oxford Handbook of Anaesthesia, 5th Ed. — Opioids in Renal Disease", year: "2022" }
    ]
  },

  {
    id: "alfentanil",
    name: {
      generic: "Alfentanil HCl",
      arabic: "ألفنتانيل",
      brandNames: ["Rapifen"]
    },
    classification: {
      triadComponent: "analgesia",
      category: "analgesics",
      subcategory: "opioids"
    },
    safety: {
      highRiskMedication: true,
      requiresAirwayReady: true,
      requiresRespiratoryMonitoring: true
    },
    clinicalFlags: ["resp_depression", "rapid_onset", "chest_wall_rigidity_risk"],
    indications: [
      { id: "rapid_onset_technique", label: { ar: "تسكين الإجراءات القصيرة وتثبيط استجابة التنبيب", en: "Analgesia for short painful procedures and intubation blunting" } },
      { id: "maintenance_infusion", label: { ar: "التسريب المستمر لجراحات اليوم الواحد", en: "Continuous infusion for short outpatient surgical cases" } }
    ],
    routes: ["IV"],
    weightPolicy: {
      preferred: "TBW",
      note: "يُعاير بحسب الحالة السريرية ونوع الإجراء؛ يجب توخي الحذر وخفض الجرعة في كبار السن والمرضى ذوي الحالة الحرجة."
    },
    presentations: [
      { value: 500, concentration: 500, unit: DOSE_UNITS.MCG_PER_ML, label: "500 mcg/mL (0.5 mg/mL أمبولة جاهزة)", isDefault: true },
      { value: 100, concentration: 100, unit: DOSE_UNITS.MCG_PER_ML, label: "100 mcg/mL (مخفف في سالاين 0.9%)" }
    ],
    pharmacodynamics: {
      onset: "30 – 60 ثانية (بدء مفعول فائق السرعة لانخفاض pKa وارتفاع الكسر غير المتأين)",
      peak: "1.5 – 2 دقيقة",
      clinicalDuration: "10 – 15 دقيقة"
    },
    administration: {
      route: "IV",
      method: "slow_push",
      pushSpeed: "حقن وريدي بطيء على مدى 30-60 ثانية لتجنب هبوط الضغط وتصلب جدار الصدر.",
      dilutionProtocol: "يُعطى بتركيزه الأصلي (500 mcg/mL) أو مخففاً إلى 100 mcg/mL في سالاين 0.9%."
    },
    clinicalContexts: [
      {
        id: "rapid_onset_technique",
        label: "جرعة الاستحثاث سريع البدء (Rapid-Onset Technique)",
        doseMin: 10.0,
        doseMax: 20.0,
        unit: DOSE_UNITS.MCG_PER_KG,
        doseType: "weight_bolus",
        isDefault: true,
        note: "تعتمد الجرعة على الإجراء والأدوية المصاحبة؛ تتطلب جاهزية التهوية الفورية."
      },
      {
        id: "short_procedure",
        label: "تسكين الإجراءات القصيرة المراقبة (Monitored Short Procedure)",
        doseMin: 5.0,
        doseMax: 10.0,
        unit: DOSE_UNITS.MCG_PER_KG,
        doseType: "weight_bolus",
        note: "تُعطى بحذر مع الجاهزية لدعم التنفس والأكسجة."
      },
      {
        id: "maintenance_infusion",
        label: "جرعة المداومة بالتسريب المستمر (Maintenance Infusion)",
        doseMin: 0.5,
        doseMax: 1.5,
        unit: DOSE_UNITS.MCG_PER_KG_MIN,
        doseType: "weight_infusion_min",
        note: "يُوقف قبل نهاية العملية بـ 10-15 دقيقة لضمان إفاقة مريحة."
      }
    ],
    warnings: [
      "بدء مفعول سريع جداً يتزامن مع تثبيط تنفسي فوري؛ يتطلب جاهزية التهوية الآلية فوراً.",
      "قد يسبب بطء قلب حاد يتطلب العلاج بمضادات الكولين (مثل الأتروبين).",
      "خطر حدوث تصلب عضلات جدار الصدر عند الحقن السريع."
    ],
    contraindications: [
      "فرط الحساسية المعروفة للألفنتانيل أو مشتقات الفنتانيل.",
      "عدم جاهزية وسائل تأمين المجرى الهوائي والإنعاش."
    ],
    references: [
      { type: "regulatory", organization: "FDA", title: "Alfentanil Injection Prescribing Information", year: "2023" },
      { type: "textbook", organization: "Morgan & Mikhail", title: "Clinical Anesthesiology, 7th Ed. — Rapid-acting Opioids", year: "2022" }
    ]
  },

  {
    id: "sufentanil",
    name: {
      generic: "Sufentanil Citrate",
      arabic: "سوفنتانيل",
      brandNames: ["Sufenta"]
    },
    classification: {
      triadComponent: "analgesia",
      category: "analgesics",
      subcategory: "opioids"
    },
    safety: {
      highRiskMedication: true,
      requiresAirwayReady: true,
      requiresRespiratoryMonitoring: true
    },
    clinicalFlags: ["resp_depression", "ultra_potent", "chest_wall_rigidity_risk"],
    indications: [
      { id: "analgesic_adjunct", label: { ar: "عامل تسكين مساعد في التخدير العام المتوازن للعمليات الكبرى", en: "Analgesic adjunct in balanced general anesthesia" } },
      { id: "primary_anesthetic_cardiac", label: { ar: "عامل تخدير أساسي في جراحات القلب والأوعية الدموية", en: "Primary anesthetic agent in major cardiovascular surgeries" } },
      { id: "epidural_labor", label: { ar: "تسكين المخاض والولادة عبر القثطرة فوق الجافية", en: "Epidural labor and delivery analgesia" } }
    ],
    routes: ["IV", "Epidural (Labor & Delivery)"],
    weightPolicy: {
      preferred: "TBW",
      note: "أقوى من الفنتانيل بنحو 5 إلى 10 أضعاف؛ يتطلب المعايرة الحذرة وتفصيل الجرعة وفق الحالة ونوع الجراحة."
    },
    presentations: [
      { value: 5, concentration: 5, unit: DOSE_UNITS.MCG_PER_ML, label: "5 mcg/mL (أمبولة مخففة جاهزة)", isDefault: true },
      { value: 50, concentration: 50, unit: DOSE_UNITS.MCG_PER_ML, label: "50 mcg/mL (أمبولة مركزة)" }
    ],
    pharmacodynamics: {
      onset: "1 – 3 دقائق (وريدياً)",
      peak: "3 – 5 دقائق",
      clinicalDuration: "30 – 60 دقيقة (يمتد مع الجرعات التراكمية)"
    },
    administration: {
      route: "IV / Epidural",
      method: "slow_push",
      pushSpeed: "حقن وريدي بطيء ومعاير بدقة بالغة. في الاستخدام فوق الجافية: يجب شفط القثطرة للتأكد من عدم وجود دم أو سائل دماغي شوكي.",
      dilutionProtocol: "يُفضل التخفيف إلى تركيز 5 mcg/mL لتفادي أخطاء الجرعات المفرطة."
    },
    clinicalContexts: [
      {
        id: "analgesic_adjunct",
        label: "عامل تسكين مساعد في التخدير المتوازن (Analgesic Adjunct)",
        doseMin: 0.2,
        doseMax: 0.6,
        unit: DOSE_UNITS.MCG_PER_KG,
        doseType: "weight_bolus",
        isDefault: true,
        note: "يُعطى كعامل مساعد للتسكين مع أدوية التخدير الأخرى أثناء الجراحات العامة."
      },
      {
        id: "primary_anesthetic_cardiac",
        label: "عامل تخدير أساسي لجراحات القلب الكبرى (Primary Anesthetic - Cardiac)",
        doseMin: 1.0,
        doseMax: 3.0,
        unit: DOSE_UNITS.MCG_PER_KG,
        doseType: "weight_bolus",
        note: "تُعطى الجرعات العالية مع الأكسجين 100% والمرخيات العضلية، وتتطلب تهوية آلية ممتدة ومراقبة مكثفة."
      },
      {
        id: "epidural_labor",
        label: "تسكين المخاض فوق الجافية (Epidural Labor Analgesia)",
        doseMin: 10.0,
        doseMax: 15.0,
        unit: DOSE_UNITS.MCG_FIXED,
        doseType: "fixed",
        note: "تُعطى جرعة 10-15 mcg بالمشاركة مع بوبيفاكايين 0.125%؛ يجب التحقق الصارم من موضع القثطرة لمنع الحقن داخل القراب أو الأوعية."
      }
    ],
    warnings: [
      "⚠️ تحذير رسمي: مخصص للحقن الوريدي أو فوق الجافية (Epidural) فقط. الحقن غير المقصود داخل القراب (Intrathecal) أو الأوعية قد يكون قاتلاً.",
      "فائق القوة (5-10 أضعاف الفنتانيل)، وأي خطأ حسابي يؤدي لتثبيط تنفسي فوري وعميق وبطء قلب شديد.",
      "خطر تصلب عضلات جدار الصدر وهبوط الضغط الحاد عند الحقن السريع."
    ],
    contraindications: [
      "فرط الحساسية المعروفة للسوفنتانيل أو مشتقات الفنتانيل.",
      "الحقن غير المقصود داخل القراب أو داخل الأوعية الدموية.",
      "الاستخدام دون توفر أجهزة التهوية والمراقبة المتقدمة."
    ],
    references: [
      { type: "regulatory", organization: "FDA", title: "Sufenta (Sufentanil Citrate Injection) Prescribing Information", year: "2024" },
      { type: "textbook", organization: "Miller", title: "Miller's Anesthesia, 9th Ed. — Potent Opioid Pharmacology", year: "2020" }
    ]
  },

  {
    id: "pethidine",
    name: {
      generic: "Pethidine HCl (Meperidine)",
      arabic: "بيثيدين / ميبيريدين",
      brandNames: ["Demerol"]
    },
    classification: {
      triadComponent: "analgesia",
      category: "analgesics",
      subcategory: "opioids"
    },
    safety: {
      highRiskMedication: true,
      requiresAirwayReady: false,
      requiresRespiratoryMonitoring: true
    },
    clinicalFlags: ["neurotoxicity_risk", "serotonin_syndrome_risk", "tachycardia_risk"],
    indications: [
      { id: "anti_shivering", label: { ar: "علاج ومنع الرعشة والارتجاف بعد التخدير النصفي أو العام", en: "Treatment and prevention of post-anesthetic shivering" } },
      { id: "acute_analgesia", label: { ar: "تسكين الألم الحاد متوسط الشدة قصير الأمد", en: "Short-term relief of moderate to severe acute pain" } }
    ],
    routes: ["IV", "IM"],
    weightPolicy: {
      preferred: "TBW",
      note: "يُفضل الاعتماد على الجرعات الثابتة المنخفضة لعلاج الرعشة وتجنب الحساب على الوزن المفرط لتفادي تراكم المستقلبات السامة."
    },
    presentations: [
      { value: 50, concentration: 50, unit: DOSE_UNITS.MG_PER_ML, label: "50 mg/mL (أمبولة 100 ملغ في 2 مل)", isDefault: true },
      { value: 10, concentration: 10, unit: DOSE_UNITS.MG_PER_ML, label: "10 mg/mL (تخفيف 100 ملغ في 10 مل سالاين 0.9%)" }
    ],
    pharmacodynamics: {
      onset: "2 – 5 دقائق (وريدياً)",
      peak: "15 – 30 دقيقة",
      clinicalDuration: "2 – 4 ساعات"
    },
    administration: {
      route: "IV / IM",
      method: "slow_push",
      pushSpeed: "حقن وريدي بطيء على مدى 2 – 3 دقائق لتجنب التهيج الوعائي وهبوط الضغط.",
      dilutionProtocol: "يُوصى بتخفيفه في 10 مل سالاين 0.9% لتسهيل إعطاء جرعات دقيقة وصغيرة لعلاج الرعشة."
    },
    clinicalContexts: [
      {
        id: "anti_shivering",
        label: "علاج الرعشة بعد التخدير (Anti-Shivering)",
        doseMin: 12.5,
        doseMax: 25.0,
        unit: DOSE_UNITS.MG_FIXED,
        doseType: "fixed_bolus",
        isDefault: true,
        note: "جرعة ثابتة صغيرة (12.5 إلى 25 ملغ وريدياً ببطء) كافية لإنهاء الرعشة وتثبيط مركز تنظيم الحرارة."
      },
      {
        id: "acute_analgesia",
        label: "تسكين الألم الحاد البديل (Acute Pain Bolus)",
        doseMin: 25.0,
        doseMax: 50.0,
        unit: DOSE_UNITS.MG_FIXED,
        doseType: "fixed_bolus",
        note: "استخدام قصير الأمد؛ تجنب الجرعات المتكررة بسبب خطر تراكم مادة Normeperidine المحدثة للاختلاجات."
      }
    ],
    warnings: [
      "⚠️ تحذير حرج: تراكم المستقلب النشط (Normeperidine) يسبب سمية عصبية واضحة تشمل الرعاش والرمع العضلي والاختلاجات، خصوصاً في قصور الكلى أو الاستخدام لأكثر من 48 ساعة.",
      "⚠️ خطر مميت: يُمنع الاستخدام المتزامن مع مثبطات MAOIs لخطورة حدوث متلازمة السيروتونين القاتلة (Serotonin Syndrome) وفرط الحرارة الشديد.",
      "يمتلك تأثيراً شبيهاً بالأتروبين (Atropine-like) مسبباً تسارع نبضات القلب وجفاف الفم، بخلاف باقي الأفيونات."
    ],
    contraindications: [
      "الاستخدام المتزامن أو خلال 14 يوماً من تناول أدوية MAOIs.",
      "فرط الحساسية المعروفة للبيثيدين / الميبيريدين.",
      "قصور وظائف الكلى الشديد لخطورة تراكم النوربيثيدين المحدث للاختلاجات.",
      "المرضى الذين لديهم سوابق اختلاجات أو صرع."
    ],
    references: [
      { type: "regulatory", organization: "FDA", title: "Demerol (Meperidine HCl) Prescribing Information", year: "2023" },
      { type: "textbook", organization: "Miller", title: "Miller's Anesthesia, 9th Ed. — Postoperative Shivering Management", year: "2020" }
    ]
  },

  {
    id: "tramadol",
    name: {
      generic: "Tramadol HCl",
      arabic: "ترامادول",
      brandNames: ["Tramal", "Ultram"]
    },
    classification: {
      triadComponent: "analgesia",
      category: "analgesics",
      subcategory: "opioids"
    },
    safety: {
      highRiskMedication: false,
      requiresAirwayReady: false,
      requiresRespiratoryMonitoring: true
    },
    clinicalFlags: ["ponv_risk_high", "seizure_threshold_lowering", "serotonin_syndrome_risk"],
    indications: [
      { id: "postop_analgesia", label: { ar: "تسكين الألم الجراحي المتوسط إلى الشديد ضمن التسكين متعدد الوسائط", en: "Moderate to severe postoperative pain in multimodal analgesia" } },
      { id: "anti_shivering", label: { ar: "خيار بديل لعلاج الرعشة والارتجاف بعد التخدير", en: "Alternative option for post-anesthetic shivering" } }
    ],
    routes: ["IV", "IM"],
    weightPolicy: {
      preferred: "TBW",
      note: "للبالغين: يُفضل الاعتماد على الجرعات الثابتة (50-100 ملغ) مع الالتزام بالحد الأقصى للجرعة المفردة (100 ملغ) واليومية (400 ملغ/يوم)."
    },
    presentations: [
      { value: 50, concentration: 50, unit: DOSE_UNITS.MG_PER_ML, label: "50 mg/mL (أمبولة 100 ملغ في 2 مل)", isDefault: true }
    ],
    pharmacodynamics: {
      onset: "5 – 10 دقائق (وريدياً)",
      peak: "30 – 45 دقيقة",
      clinicalDuration: "4 – 6 ساعات"
    },
    administration: {
      route: "IV / IM",
      method: "slow_push_or_short_infusion",
      pushSpeed: "حقن وريدي بطيء جداً على مدى 2 – 3 دقائق، أو يوضع في محلول 100 مل سالاين ويُسرّب على مدى 15 دقيقة لتقليل الغثيان والقيء.",
      dilutionProtocol: "يُفضل تخفيفه في 10-20 مل سالاين 0.9% لتفادي الدوار والغثيان الحاد."
    },
    clinicalContexts: [
      {
        id: "postop_analgesia",
        label: "تسكين الألم بعد العمليات (Adult Postop Analgesia)",
        doseMin: 50.0,
        doseMax: 100.0,
        unit: DOSE_UNITS.MG_FIXED,
        doseType: "fixed",
        isDefault: true,
        note: "50 إلى 100 ملغ وريدياً ببطء كل 6 ساعات حسب الحاجة (الحد الأقصى للمفردة 100 ملغ، واليومي 400 ملغ/يوم)."
      },
      {
        id: "anti_shivering",
        label: "علاج الرعشة بعد التخدير (Anti-Shivering)",
        doseMin: 50.0,
        doseMax: 50.0,
        unit: DOSE_UNITS.MG_FIXED,
        doseType: "fixed",
        note: "50 ملغ وريدياً ببطء لعلاج رعشة ما بعد التخدير النصفي أو العام."
      }
    ],
    warnings: [
      "معدل مرتفع لحدوث الغثيان والقيء بعد العمليات (PONV)؛ يُنصح بالمشاركة الوقائية مع مضادات القيء (مثل أوندانسيترون/ديكساميثازون).",
      "يخفض عتبة الاختلاجات والصرع، خصوصاً لدى مرضى الصرع أو عند مشاركته مع الأدوية التي تخفض عتبة التشنج.",
      "خطر حدوث متلازمة السيروتونين (Serotonin Syndrome) عند المشاركة مع الأدوية السيروتونينية؛ يُمنع تماماً مع مثبطات MAOIs.",
      "يتطلب تعديل الجرعة وإطالة الفاصل الزمني في حالات قصور وظائف الكلى (CrCl < 30 mL/min) وقصور الكبد الشديد."
    ],
    contraindications: [
      "الاستخدام المتزامن مع مثبطات MAOIs أو خلال 14 يوماً من إيقافها.",
      "فرط الحساسية المعروفة للترامادول أو المواد الأفيونية.",
      "مرضى الصرع غير المسيطر عليه علاجياً."
    ],
    references: [
      { type: "regulatory", organization: "FDA", title: "Ultram (Tramadol HCl) Prescribing Information", year: "2023" },
      { type: "regulatory", organization: "eMC", title: "Tramadol 50mg/ml Solution for Injection SmPC", year: "2024" }
    ]
  },

  // =========================================================================
  // B) NON-OPIOID ANALGESICS (المسكنات غير الأفيونية)
  // =========================================================================
  {
    id: "paracetamol",
    name: {
      generic: "Paracetamol (Acetaminophen IV)",
      arabic: "باراسيتامول وريدي",
      brandNames: ["Perfalgan", "Ofirmev"]
    },
    classification: {
      triadComponent: "analgesia",
      category: "analgesics",
      subcategory: "non_opioids"
    },
    safety: {
      highRiskMedication: false,
      requiresAirwayReady: false,
      requiresRespiratoryMonitoring: false
    },
    clinicalFlags: ["opioid_sparing", "hepatic_monitoring_required"],
    indications: [
      { id: "adult_standard", label: { ar: "الركيزة الأساسية الأولى للتسكين متعدد الوسائط (Multimodal Analgesia)", en: "Foundation of multimodal perioperative analgesia" } },
      { id: "weight_based", label: { ar: "تسكين الألم وخفض الحرارة للأطفال والبالغين ذوي الوزن المنخفض", en: "Analgesia and antipyresis for pediatrics and adults <50 kg" } }
    ],
    routes: ["IV Infusion"],
    weightPolicy: {
      preferred: "TBW",
      note: "للبالغين ≥50 كجم: جرعة ثابتة 1000 ملغ. في البالغين <50 كجم والأطفال: حساب دقيق بالوزن (15 mg/kg)."
    },
    presentations: [
      { value: 10, concentration: 10, unit: DOSE_UNITS.MG_PER_ML, label: "10 mg/mL (قارورة جاهزة 1000 ملغ في 100 مل)", isDefault: true }
    ],
    pharmacodynamics: {
      onset: "5 – 10 دقائق من بدء التسريب",
      peak: "15 دقيقة (عند نهاية التسريب)",
      clinicalDuration: "4 – 6 ساعات"
    },
    administration: {
      route: "IV",
      method: "infusion",
      durationMinutes: 15,
      pushSpeed: "تسريب وريدي بطيء على مدى 15 دقيقة. لا يُحقن كدفعة سريعة (Bolus).",
      dilutionProtocol: "يأتي في قارورة جاهزة للتقطير الوريدي المباشر بتركيز 10 mg/mL."
    },
    clinicalContexts: [
      {
        id: "adult_standard",
        label: "البالغين والمراهقين ذوي الوزن ≥50 كجم (Standard Adult Dose)",
        doseMin: 1000,
        doseMax: 1000,
        unit: DOSE_UNITS.MG_FIXED,
        doseType: "fixed_bolus",
        isDefault: true,
        note: "1000 ملغ (100 مل) بالتسريب الوريدي على مدى 15 دقيقة كل 6 ساعات (الحد الأقصى اليومي 4000 ملغ/يوم من جميع المصادر)."
      },
      {
        id: "weight_based",
        label: "البالغين ذوي الوزن <50 كجم والأطفال (Weight-Based Dosing)",
        doseMin: 15.0,
        doseMax: 15.0,
        unit: DOSE_UNITS.MG_PER_KG,
        doseType: "weight_bolus",
        note: "15 mg/kg بالتسريب الوريدي كل 6 ساعات. الحد الأقصى اليومي 75 mg/kg/day (بحد أقصى مطلق 3750 mg/day لهذه الفئة)."
      }
    ],
    warnings: [
      "خطر السمية الكبدية عند تجاوز الجرعة اليومية القصوى (4 غرام/يوم للبالغين السليمين، وتُخفض إلى 2-3 غرام/يوم في قصور الكبد وسوء التغذية).",
      "يجب التحقق من أي جرعات باراسيتامول تم إعطاؤها فموياً أو ضمن مركبات أخرى لتفادي تجاوز الحد الأقصى.",
      "قد يسبب هبوطاً عابراً في ضغط الدم أثناء التسريب لدى المرضى ذوي الحالات الحرجة في العناية المركزة."
    ],
    contraindications: [
      "القصور الكبدي الحاد الشديد أو المرض الكبدي النشط غير المعاوض.",
      "فرط الحساسية المعروفة للباراسيتامول أو الأسيتامينوفين أو البروباسيتامول."
    ],
    references: [
      { type: "regulatory", organization: "FDA", title: "Ofirmev (Acetaminophen Injection) Prescribing Information", year: "2024" },
      { type: "textbook", organization: "Miller", title: "Miller's Anesthesia, 9th Ed. — Multimodal Analgesia Strategies", year: "2020" }
    ]
  },

  {
    id: "ketorolac",
    name: {
      generic: "Ketorolac Tromethamine",
      arabic: "كيتورولاك",
      brandNames: ["Toradol"]
    },
    classification: {
      triadComponent: "analgesia",
      category: "analgesics",
      subcategory: "non_opioids"
    },
    safety: {
      highRiskMedication: false,
      requiresAirwayReady: false,
      requiresRespiratoryMonitoring: false
    },
    clinicalFlags: ["bleeding_risk", "renal_toxicity_risk", "max_5_days_limit"],
    indications: [
      { id: "adult_standard", label: { ar: "التدبير قصير الأمد للألم الحاد المتوسط إلى الشديد بعد العمليات", en: "Short-term management of moderate to severe acute postoperative pain" } },
      { id: "high_risk_population", label: { ar: "تسكين الألم للفئات عالية الخطورة وكبار السن", en: "Analgesia for high-risk patients (elderly / reduced weight / renal risk)" } }
    ],
    routes: ["IV", "IM"],
    weightPolicy: {
      preferred: "TBW",
      note: "تُستخدم الجرعات الثابتة المحددة للفئة السريرية؛ لا تُرفع الجرعة بزيادة الوزن في السمنة لتفادي السمية الكلوية والنزف."
    },
    presentations: [
      { value: 30, concentration: 30, unit: DOSE_UNITS.MG_PER_ML, label: "30 mg/mL (أمبولة 1 مل)", isDefault: true },
      { value: 15, concentration: 15, unit: DOSE_UNITS.MG_PER_ML, label: "15 mg/mL (أمبولة مخففة)" }
    ],
    pharmacodynamics: {
      onset: "10 دقائق (وريدياً)",
      peak: "30 – 60 دقيقة",
      clinicalDuration: "6 – 8 ساعات"
    },
    administration: {
      route: "IV / IM",
      method: "slow_push",
      pushSpeed: "حقن وريدي بطيء على مدى لا يقل عن 15 ثانية أو حقن عضلي عميق.",
      dilutionProtocol: "يمكن إعطاؤه غير مخفف أو مخففاً في سالاين 0.9%."
    },
    clinicalContexts: [
      {
        id: "adult_standard",
        label: "البالغين (<65 سنة ووزن ≥50 كجم بدون قصور كلوي)",
        doseMin: 30.0,
        doseMax: 30.0,
        unit: DOSE_UNITS.MG_FIXED,
        doseType: "fixed",
        isDefault: true,
        note: "30 ملغ وريدياً أو عضلياً كل 6 ساعات حسب الحاجة (الحد الأقصى اليومي 120 ملغ/يوم، ولمدة أقصاها 5 أيام متتالية فقط)."
      },
      {
        id: "high_risk_population",
        label: "الفئات عالية الخطورة (≥65 سنة، وزن <50 كجم، أو قصور كلوي)",
        doseMin: 15.0,
        doseMax: 15.0,
        unit: DOSE_UNITS.MG_FIXED,
        doseType: "fixed",
        note: "15 ملغ وريدياً أو عضلياً كل 6 ساعات (الحد الأقصى اليومي 60 ملغ/يوم، ولمدة أقصاها 5 أيام متتالية)."
      }
    ],
    warnings: [
      "يثبط تراكم الصفائح الدموية ويزيد وقت النزف؛ يجب تجنبه عندما تكون مخاطر النزف الجراحي غير مقبولة.",
      "خطر حدوث قصور كلوي حاد ناتج عن تثبيط البروستاغلاندينات الكلوية، خصوصاً في حالات نقص السوائل والتجفاف (Hypovolemia).",
      "الاستخدام محدد بمدة أقصاها 5 أيام متتالية فقط لتجنب القرحات والنزف الهضمي والسمية الكلوية."
    ],
    contraindications: [
      "القرحة الهضمية النشطة أو وجود سوابق نزف أو انثقاب هضمي.",
      "قصور وظائف الكلى المتقدم أو الشديد، ومرضى التجفاف الحاد ونقص الحجم داخل الأوعية.",
      "الاستخدام المسكن الوقائي قبل العمليات الجراحية الكبرى أو أثناء عمليات تحويل مجرى الشريان التاجي (CABG).",
      "الحساسية المفرطة المعروفة للأسبرين أو مضادات NSAIDs الأخرى."
    ],
    references: [
      { type: "regulatory", organization: "FDA", title: "Toradol (Ketorolac Tromethamine) Injection Boxed Warning & Label", year: "2023" },
      { type: "textbook", organization: "Morgan & Mikhail", title: "Clinical Anesthesiology, 7th Ed. — NSAIDs & Perioperative Bleeding", year: "2022" }
    ]
  },

  {
    id: "diclofenac",
    name: {
      generic: "Diclofenac Sodium",
      arabic: "ديكلوفيناك (فولتارين)",
      brandNames: ["Voltaren", "Dyloject"]
    },
    classification: {
      triadComponent: "analgesia",
      category: "analgesics",
      subcategory: "non_opioids"
    },
    safety: {
      highRiskMedication: false,
      requiresAirwayReady: false,
      requiresRespiratoryMonitoring: false
    },
    clinicalFlags: ["cv_thrombotic_risk", "gi_ulcer_risk", "deep_im_only"],
    indications: [
      { id: "standard_parenteral", label: { ar: "تسكين الألم الحاد بعد العمليات الجراحية وعلاج المغص الكلوي", en: "Acute postoperative pain and acute renal/biliary colic" } }
    ],
    routes: ["IM (Deep)", "IV Infusion"],
    weightPolicy: {
      preferred: "TBW",
      note: "جرعة محددة ثابتة للبالغين؛ لا تُحسب بضرب الوزن لتفادي السمية الكلوية والوعائية."
    },
    presentations: [
      { value: 25, concentration: 25, unit: DOSE_UNITS.MG_PER_ML, label: "25 mg/mL (أمبولة 75 ملغ في 3 مل)", isDefault: true }
    ],
    pharmacodynamics: {
      onset: "15 – 30 دقيقة",
      peak: "30 – 60 دقيقة",
      clinicalDuration: "6 – 8 ساعات"
    },
    administration: {
      route: "IM / IV Infusion",
      method: "infusion_or_deep_im",
      pushSpeed: "حقن عضلي عميق في الإلية. للإعطاء الوريدي: يجب تخفيف 75 ملغ في 100-500 مل سالاين والتسريب على مدى 30 إلى 120 دقيقة.",
      dilutionProtocol: "لا يُحقن وريدياً كدفعة سريعة (IV Bolus) غير مخففة لتفادي الألم الشديد والتهيج الوعائي."
    },
    clinicalContexts: [
      {
        id: "standard_parenteral",
        label: "الجرعة الوريدية بالتسريب أو العضلية (Standard Parenteral Dose)",
        doseMin: 75.0,
        doseMax: 75.0,
        unit: DOSE_UNITS.MG_FIXED,
        doseType: "fixed",
        isDefault: true,
        note: "75 ملغ بالتسريب الوريدي البطيء على مدى 30-120 دقيقة أو عضلياً عميقاً (الحد الأقصى 150 ملغ في 24 ساعة، ولمدة لا تتجاوز يومين)."
      }
    ],
    warnings: [
      "يرفع احتمالية المخاطر الخثارية القلبية الوعائية؛ يُستخدم بأقل جرعة فعالة ولأقصر مدة ممكنة.",
      "خطر النزف والتقرح الهضمي وتثبيط التروية الكلوية لدى المرضى الذين يعانون من نقص السوائل.",
      "الحقن العضلي يجب أن يكون عميقاً جداً لتجنب تلف الأنسجة والأعصاب المحيطية."
    ],
    contraindications: [
      "القرحة الهضمية النشطة أو النزف المعوي.",
      "قصور وظائف الكلى أو الكبد الشديد والقصور القلبي الحاد غير المستقر.",
      "مرضى الربو المحرض بمضادات الالتهاب غير الستيرويدية."
    ],
    references: [
      { type: "regulatory", organization: "eMC", title: "Voltarol (Diclofenac Sodium) 75mg/3ml Injection SmPC", year: "2024" },
      { type: "textbook", organization: "Oxford", title: "Oxford Handbook of Anaesthesia, 5th Ed. — Non-Opioid Analgesics", year: "2022" }
    ]
  },

  {
    id: "parecoxib",
    name: {
      generic: "Parecoxib Sodium",
      arabic: "باريكوكسيب",
      brandNames: ["Dynastat"]
    },
    classification: {
      triadComponent: "analgesia",
      category: "analgesics",
      subcategory: "non_opioids"
    },
    safety: {
      highRiskMedication: false,
      requiresAirwayReady: false,
      requiresRespiratoryMonitoring: false
    },
    clinicalFlags: ["cox2_selective", "sulfa_allergy_risk", "cabg_contraindicated"],
    indications: [
      { id: "adult_standard", label: { ar: "تسكين الألم الحاد بعد العمليات الجراحية عبر التثبيط الانتقائي لـ COX-2", en: "Short-term management of acute postoperative pain (COX-2 selective)" } }
    ],
    routes: ["IV", "IM"],
    weightPolicy: {
      preferred: "TBW",
      note: "جرعة قياسية ثابتة للبالغين 40 ملغ وريدياً دون الحاجة لتعديل الجرعة في السمنة."
    },
    presentations: [
      { value: 20, concentration: 20, unit: DOSE_UNITS.MG_PER_ML, label: "20 mg/mL (فيال 40 ملغ يُحل في 2 مل سالاين)", isDefault: true }
    ],
    pharmacodynamics: {
      onset: "7 – 14 دقيقة",
      peak: "30 – 120 دقيقة (يتحول حيوياً إلى فالديكوكسيب النشط)",
      clinicalDuration: "6 – 12 ساعة"
    },
    administration: {
      route: "IV / IM",
      method: "push_or_im",
      pushSpeed: "حقن وريدي مباشر سريع أو بطيء، أو حقن عضلي عميق.",
      dilutionProtocol: "يأتي كمسحوق جاف (40 ملغ) ويُحل في 2 مل سالاين 0.9% ليصبح بتركيز 20 mg/mL."
    },
    clinicalContexts: [
      {
        id: "adult_standard",
        label: "الجرعة القياسية للبالغين (Standard Adult Dose)",
        doseMin: 40.0,
        doseMax: 40.0,
        unit: DOSE_UNITS.MG_FIXED,
        doseType: "fixed",
        isDefault: true,
        note: "40 ملغ وريدياً أو عضلياً، تليها 20-40 ملغ كل 6-12 ساعة حسب الحاجة (الحد الأقصى 80 ملغ/يوم)."
      },
      {
        id: "elderly_reduced",
        label: "كبار السن (≥65 سنة) أو وزن <50 كجم",
        doseMin: 20.0,
        doseMax: 20.0,
        unit: DOSE_UNITS.MG_FIXED,
        doseType: "fixed",
        note: "20 ملغ وريدياً كل 12 ساعة (الحد الأقصى 40 ملغ/يوم)."
      }
    ],
    warnings: [
      "يمتلك تأثيراً أقل على وظيفة الصفائح الدموية مقارنة بـ NSAIDs غير الانتقائية، لكنه يتطلب الحذر العام كباقي مضادات الالتهاب.",
      "خطر الحوادث الخثارية القلبية الوعائية؛ يُمنع في جراحة تحويل مجرى الشريان التاجي (CABG).",
      "قد يسبب تفاعلات جلدية تحسسية شديدة لدى المرضى الذين لديهم حساسية سابقة لمركبات السلفوناميد (Sulfonamides)."
    ],
    contraindications: [
      "جراحة تحويل مجرى الشريان التاجي (CABG Surgery).",
      "المرض القلبي الإقفاري الشديد وأمراض الشرايين الدماغية والمحيطية.",
      "فرط الحساسية المعروفة لمركبات السلفوناميد (Sulfa Allergy).",
      "القرحة الهضمية النشطة أو القصور الكبدي الشديد."
    ],
    references: [
      { type: "regulatory", organization: "EMA", title: "Dynastat (Parecoxib Sodium) SmPC", year: "2024" },
      { type: "textbook", organization: "Miller", title: "Miller's Anesthesia, 9th Ed. — Selective COX-2 Inhibitors", year: "2020" }
    ]
  },

  // =========================================================================
  // C) ANALGESIC ADJUNCTS (المسكنات المساعدة ومثبطات NMDA)
  // =========================================================================
  {
    id: "ketamine_analgesic",
    name: {
      generic: "Ketamine HCl (Subanesthetic Low-Dose)",
      arabic: "كيتامين (الجرعة المسكنة الخافضة)",
      brandNames: ["Ketalar"]
    },
    classification: {
      triadComponent: "analgesia",
      category: "analgesics",
      subcategory: "adjuncts"
    },
    safety: {
      highRiskMedication: true,
      requiresAirwayReady: true,
      requiresRespiratoryMonitoring: true
    },
    clinicalFlags: ["anti_hyperalgesia", "opioid_sparing", "bronchodilator"],
    indications: [
      { id: "low_dose_bolus", label: { ar: "تثبيط مستقبلات NMDA ومنع فرط التحسس للألم وتقليل استهلاك الأفيونات", en: "NMDA antagonism, anti-hyperalgesia, and opioid-sparing multimodal analgesia" } },
      { id: "low_dose_infusion", label: { ar: "تسريب مسكن مستمر منخفض الجرعة أثناء الجراحات الكبرى", en: "Low-dose intraoperative analgesic continuous infusion" } }
    ],
    routes: ["IV Bolus", "IV Infusion"],
    weightPolicy: {
      preferred: "IBW",
      note: "يُعاير بحسب بروتوكول المؤسسة والوزن المثالي أو المعدل في السمنة لتقليل الآثار النفسية ومنع تأخر الإفاقة."
    },
    presentations: [
      { value: 10, concentration: 10, unit: DOSE_UNITS.MG_PER_ML, label: "10 mg/mL (تخفيف 50 ملغ في 5 مل سالاين 0.9%)", isDefault: true },
      { value: 50, concentration: 50, unit: DOSE_UNITS.MG_PER_ML, label: "50 mg/mL (أمبولة أصلية 500 ملغ في 10 مل)" }
    ],
    pharmacodynamics: {
      onset: "30 – 60 ثانية (وريدياً)",
      peak: "1 – 2 دقيقة",
      clinicalDuration: "15 – 30 دقيقة (للجرعة الواحدة)"
    },
    administration: {
      route: "IV",
      method: "slow_push_or_infusion",
      pushSpeed: "حقن وريدي بطيء على مدى دقيقة إلى دقيقتين.",
      dilutionProtocol: "يُسحب 1 مل (50 ملغ) ويُخفف في 4 مل سالاين ليصبح التركيز 10 mg/mL لتسهيل المعايرة الدقيقة للجرعات المسكنة المنخفضة."
    },
    clinicalContexts: [
      {
        id: "low_dose_bolus",
        label: "جرعة مسكنة منخفضة محيطة بالجراحة (Low-Dose Analgesic Bolus)",
        doseMin: 0.15,
        doseMax: 0.35,
        unit: DOSE_UNITS.MG_PER_KG,
        doseType: "weight_bolus",
        isDefault: true,
        note: "تُعطى بعد التحريض وقبل الشق الجراحي؛ الجرعات تحت التخديرية (<0.35 mg/kg) نادراً ما تسبب اضطرابات نفسية عند الإفاقة."
      },
      {
        id: "low_dose_infusion",
        label: "جرعة المداومة بالتسريب المسكن المستمر (Low-Dose Maintenance Infusion)",
        doseMin: 0.1,
        doseMax: 0.2,
        unit: DOSE_UNITS.MG_PER_KG_HOUR,
        doseType: "weight_infusion_hour",
        note: "تسريب وريدي منخفض الجرعة أثناء العمليات الكبرى؛ يُوقف قبل نهاية العملية بنحو 30 دقيقة لتجنب تأخر الإفاقة."
      }
    ],
    warnings: [
      "بالجرعات المسكنة المنخفضة تكون الآثار النفسية نادرة، لكنها قد تحدث وتتطلب التقييم والمراقبة السريرية.",
      "يحافظ على التنفس التلقائي ومنعكسات المجرى الهوائي بشكل أفضل من معظم أدوية التخدير، لكن هذا ليس ضماناً مطلقاً؛ قد يحدث انقطاع نفس عند الحقن السريع.",
      "تنبيه الجهاز العصبي الودي قد يرفع النبض وضغط الدم بشكل طفيف عبر تحرير الكاتيكولامينات."
    ],
    contraindications: [
      "ارتفاع ضغط الدم الشديد غير المنضبط أو داء الشريان التاجي غير المستقر.",
      "الذهان الحاد والاضطرابات النفسية الشديدة النشطة.",
      "يُستخدم بحذر وتقييم سريري دقيق في المرضى الذين يعانون من ارتفاع الضغط داخل الجمجمة."
    ],
    references: [
      { type: "guideline", organization: "ASRA-AAPM", title: "Consensus Guidelines on the Use of Intravenous Ketamine for Acute Pain Management", year: "2018" },
      { type: "textbook", organization: "Miller", title: "Miller's Anesthesia, 9th Ed. — NMDA Antagonists & Adjuvant Analgesia", year: "2020" }
    ]
  }
];

export default analgesiaData;
