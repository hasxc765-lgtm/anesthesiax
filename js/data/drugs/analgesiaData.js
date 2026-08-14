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
    indications: [
      "تثبيط الاستجابة الكاتيكولامينية والودية (Sympathetic response) لتنظير الحنجرة والتنبيب الرغامي.",
      "التسكين أثناء التخدير العام المتوازن (Balanced Anesthesia Maintenance).",
      "تسكين الألم الحاد والمعايرة التدريجية في وحدة الإفاقة (PACU Titration)."
    ],
    routes: ["IV", "IM"],
    weightScalar: "Individualized / Titrate to clinical effect",
    obesityDosingNotes: "شديد الذوبان في الدهون؛ لا توجد قاعدة وزنية واحدة ثابتة لجميع الحالات. يُوصى بالبدء بجرعات حذرة ومعايرتها بحسب الاستجابة السريرية والعمر والحالة العامة، مع خفض الجرعة البدئية في كبار السن والسمنة المفرطة.",
    concentrations: [
      { value: 50, unit: "mcg/mL", label: "50 mcg/mL (أمبولة جاهزة 2 مل / 10 مل)", isDefault: true }
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
      dilution: "يمكن إعطاؤه بتركيزه الأصلي (50 mcg/mL) أو تخفيفه في محلول سالاين 0.9% لتسهيل المعايرة الدقيقة."
    },
    clinicalContexts: [
      {
        id: "intubation_blunting",
        label: "تثبيط استجابة التنبيب (Induction Bolus)",
        doseMin: 1.0,
        doseMax: 2.0,
        unit: "mcg/kg",
        doseType: "weight_bolus",
        isDefault: true,
        note: "تُعطى عادة قبل التحفيز الجراحي أو تنظير الحنجرة بعد تقدير زمن بدء المفعول والاستجابة السريرية."
      },
      {
        id: "balanced_maintenance",
        label: "التسكين أثناء التخدير المتوازن (Maintenance Bolus)",
        doseMin: 0.5,
        doseMax: 1.5,
        unit: "mcg/kg",
        doseType: "weight_bolus",
        note: "جرعات دفعية متكررة ومعايرة سريرياً كل 30-45 دقيقة بحسب استجابة الجهاز العصبي الذاتي والمؤشرات الحيوية."
      },
      {
        id: "higher_dose_technique",
        label: "تقنية التسكين بجرعات عالية (Higher-dose intraoperative technique)",
        doseMin: 2.0,
        doseMax: 5.0,
        unit: "mcg/kg",
        doseType: "weight_bolus",
        note: "جرعات عالية مخصصة لتقنيات جراحية معينة كجراحات القلب؛ ليست جرعة روتينية وتتطلب تهوية آلية ومراقبة مستمرة."
      },
      {
        id: "pacu_rescue",
        label: "تسكين الألم في وحدة الإفاقة (PACU Incremental Bolus)",
        doseMin: 25.0,
        doseMax: 50.0,
        unit: "mcg (fixed)",
        doseType: "fixed_bolus",
        note: "جرعات تدريجية مجزأة (25-50 mcg) كل 5 دقائق مع المعايرة والمراقبة اللصيقة لمعدل التنفس ومستوى الوعي وSpO2."
      }
    ],
    warnings: [
      "تثبيط تنفسي معتمد على الجرعة يتطلب الجاهزية الفورية لدعم التهوية بالضغط الموجب وتأمين المجرى الهوائي.",
      "الحقن الوريدي السريع بجرعات عالية قد يسبب تصلب عضلات جدار الصدر (Chest Wall / Wooden Rigidity).",
      "يعزز هبوط ضغط الدم وبطء القلب عند مشاركته مع المنومات (مثل البروبوفول) أو المهدئات."
    ],
    contraindications: [
      "فرط الحساسية المعروفة للفنتانيل أو مشتقات الفينيل بيبيريدين.",
      "لا يُعطى دون توفر مراقبة مناسبة وتجهيزات دعم المجرى الهوائي والتهوية بالضغط الموجب."
    ],
    references: [
      {
        type: "regulatory",
        organization: "FDA",
        title: "Fentanyl Citrate Injection Prescribing Information",
        year: "2024"
      },
      {
        type: "textbook",
        organization: "Miller",
        title: "Miller's Anesthesia, 9th Ed. — Opioid Pharmacology & Dosing",
        year: "2020"
      }
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
    indications: [
      "التسكين والتحكم الاستجابتي الفائق أثناء التحريض والتنبيب الرغامي تحت التخدير العام.",
      "التسكين المستمر كجزء من التخدير الوريدي الكلي (TIVA) أو التخدير المتوازن مع التهوية الآلية.",
      "توفير تسكين عميق قصير الأمد أثناء الإجراءات الجراحية مع إفاقة سريعة ومستقلة عن مدة التسريب."
    ],
    routes: ["IV Infusion", "IV Bolus (Airway Secured)"],
    weightScalar: "IBW (in severe obesity) / Titrate to clinical response",
    obesityDosingNotes: "في حالات السمنة الشديدة، ترتبط خصائص التوزيع والتصفية بالوزن المثالي (IBW) بشكل أدق. يجب دائماً معايرة معدل التسريب بحسب الاستجابة السريرية وتجنب الحساب على الوزن الكلي لتفادي بطء القلب وهبوط الضغط الحاد.",
    concentrations: [
      { value: 20, unit: "mcg/mL", label: "20 mcg/mL (تخفيف 1 ملغ في 50 مل سالاين)", isDefault: true },
      { value: 50, unit: "mcg/mL", label: "50 mcg/mL (تخفيف 2 ملغ في 40 مل سالاين)" }
    ],
    pharmacodynamics: {
      onset: "1 – 1.5 دقيقة",
      peak: "1.5 – 2 دقيقة",
      clinicalDuration: "3 – 8 دقائق (استقلاب سريع للغاية بإسترازات الدم والأنسجة غير النوعية)"
    },
    administration: {
      route: "IV",
      method: "infusion_preferred",
      pushSpeed: "الحقن الدفعي (Bolus) يتم ببطء شديد على مدى لا يقل عن 30-60 ثانية وفقط في وجود مجرى هوائي مؤمن. يُفضل دائماً الإعطاء عبر التسريب المستمر بمضخة المحاقن.",
      dilution: "يأتي كمسحوق جاف (1 ملغ أو 2 ملغ) ويُحل في سالاين 0.9% أو ديكستروز 5% ليصبح بتركيز 20-50 mcg/mL."
    },
    clinicalContexts: [
      {
        id: "induction_bolus",
        label: "جرعة التحريض والتنبيب (Induction Bolus - Airway Control)",
        doseMin: 0.5,
        doseMax: 1.0,
        unit: "mcg/kg",
        doseType: "weight_bolus",
        isDefault: true,
        note: "تُعطى ببطء على مدى 30-60 ثانية قبل التنبيب وفقط مع الجاهزية التامة لإدارة المجرى الهوائي والتهوية الآلية."
      },
      {
        id: "maintenance_infusion",
        label: "التسريب المستمر مع التهوية الآلية (Maintenance Infusion)",
        doseMin: 0.1,
        doseMax: 0.5,
        unit: "mcg/kg/min",
        doseType: "weight_infusion_min",
        note: "تتم المعايرة بزيادة أو خفض 0.05 mcg/kg/min حسب المؤشرات الحيوية وعمق التسكين المطلوب."
      },
      {
        id: "mac_spontaneous_breathing",
        label: "رعاية التخدير المراقبة والتنفس التلقائي (MAC – Spontaneous Breathing)",
        doseMin: 0.025,
        doseMax: 0.2,
        unit: "mcg/kg/min",
        doseType: "weight_infusion_min",
        note: "جرعة البدء الشائعة 0.05 - 0.1 mcg/kg/min وتُعاير تدريجياً؛ لا يُنصح بإعطاء جرعات دفعية (Bolus) متزامنة لدى المرضى ذوي التنفس التلقائي. يتطلب مراقبة مستمرة للمجرى الهوائي والأكسجة."
      }
    ],
    warnings: [
      "مفعوله التسكيني ينتهي خلال 5-10 دقائق من إيقاف التسريب؛ يجب تأمين خطة تسكين انتقالية (مثل المورفين أو الباراسيتامول) قبل نهاية العملية.",
      "قد يسبب انقطاع نفس فوري (Apnea)، بطء قلب شديد، هبوطاً حاداً في ضغط الدم، وتصلب جدار الصدر عند الحقن السريع.",
      "قد يحرض فرط التحسس للألم الارتدادي (Opioid-Induced Hyperalgesia) عند التوقف المفاجئ بعد الجرعات العالية."
    ],
    contraindications: [
      "الحقن فوق الجافية أو داخل النخاع (Epidural/Intrathecal) لاحتواء المستحضر على مادة الغلايسين.",
      "فرط الحساسية لمركبات الفنتانيل ومشتقاتها."
    ],
    references: [
      {
        type: "regulatory",
        organization: "FDA",
        title: "Ultiva (Remifentanil HCl) for Injection Prescribing Information",
        year: "2024"
      },
      {
        type: "textbook",
        organization: "Miller",
        title: "Miller's Anesthesia, 9th Ed. — Context-Sensitive Half-Time & Metabolism",
        year: "2020"
      }
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
    indications: [
      "تسكين الألم الجراحي المتوسط إلى الشديد ممتد المفعول.",
      "التسكين الوقائي والاستباقي قبل نهاية الجراحة لضمان إفاقة مريحة في الـ PACU.",
      "تسكين الألم في احتشاء عضلة القلب والوذمة الرئوية الحادة."
    ],
    routes: ["IV", "IM", "SC"],
    weightScalar: "Individualized / Reduced initial dose in elderly, renal impairment, and opioid-naïve",
    obesityDosingNotes: "يجب تفصيل الجرعة ومعايرتها بحذر؛ يُفضل خفض الجرعة البدئية في حالات السمنة وكبار السن مع المراقبة لتفادي التراكم والتثبيط التنفسي المتأخر.",
    concentrations: [
      { value: 10, unit: "mg/mL", label: "10 mg/mL (أمبولة أصلية مركزة 1 مل)" },
      { value: 1, unit: "mg/mL", label: "1 mg/mL (تخفيف 10 ملغ في 10 مل سالاين 0.9%)", isDefault: true }
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
      dilution: "يُوصى بسحب أمبولة 10 ملغ وتخفيفها إلى 10 مل بسالاين 0.9% لتصبح بتركيز 1 mg/mL لضمان المعايرة الآمنة."
    },
    clinicalContexts: [
      {
        id: "intraop_loading",
        label: "جرعة التسكين أثناء العمليات (Intraop Pre-emergence Bolus)",
        doseMin: 0.05,
        doseMax: 0.15,
        unit: "mg/kg",
        doseType: "weight_bolus",
        isDefault: true,
        note: "تُعطى قبل نهاية العملية بـ 20-30 دقيقة ليتزامن وقت الذروة مع الإفاقة؛ تخضع لمعايرة دقيقة بحسب استجابة المريض."
      },
      {
        id: "pacu_titration",
        label: "معايرة الألم في وحدة الإفاقة (PACU Incremental Titration)",
        doseMin: 1.0,
        doseMax: 2.0,
        unit: "mg (fixed)",
        doseType: "fixed_bolus",
        note: "تُعطى 1-2 ملغ كل 5-10 دقائق مع المعايرة الحذرة وفق شدة الألم، العمر، وظائف الكلى، ودرجة اليقظة. لا تتعجل تكرار الجرعات الكبيرة لتجنب التراكم (Dose Stacking)."
      }
    ],
    warnings: [
      "تأخر ذروة التأثير التسكيني والتنفسي حتى 20-30 دقيقة وريدياً؛ تكرار الجرعات السريع يؤدي إلى تراكم الجرعة وحدوث تثبيط تنفسي متأخر.",
      "يحرر مادة الهيستامين، مما قد يسبب هبوط ضغط شرياني، احمرار الجلد، وتشنج القصبات؛ يُستخدم بحذر شديد في مرضى الربو القصبي غير المستقر.",
      "تتراكم مستقلباته النشطة (Morphine-6-Glucuronide) في مرضى قصور وظائف الكلى مسببة تثبيطاً تنفسياً ممتداً وتهدئة عميقة؛ يتطلب خفض الجرعات ومراقبة لصيقة."
    ],
    contraindications: [
      "فرط الحساسية المعروفة للمورفين.",
      "التثبيط التنفسي الشديد الحاد أو انسداد المجرى الهوائي العلوي في غياب التهوية الآلية.",
      "انسداد الأمعاء الشللي (Paralytic Ileus)."
    ],
    references: [
      {
        type: "regulatory",
        organization: "FDA",
        title: "Morphine Sulfate Injection Prescribing Information",
        year: "2024"
      },
      {
        type: "guideline",
        organization: "Oxford",
        title: "Oxford Handbook of Anaesthesia, 5th Ed. — Opioids in Renal Disease",
        year: "2022"
      }
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
    indications: [
      "تسكين الإجراءات الجراحية القصيرة والمؤلمة (مثل تنظير الحنجرة، تنظير القصبات).",
      "تثبيط الاستجابة الوعائية والحنجرية للتنبيب كجزء من تقنيات التخدير الموجهة.",
      "التسكين المستمر لجراحات اليوم الواحد مع إفاقة سريعة."
    ],
    routes: ["IV"],
    weightScalar: "Individualized / Titrate to effect",
    obesityDosingNotes: "يُعاير بحسب الحالة السريرية ونوع الإجراء؛ يجب توخي الحذر وخفض الجرعة في كبار السن والمرضى ذوي الحالة الحرجة.",
    concentrations: [
      { value: 500, unit: "mcg/mL", label: "500 mcg/mL (0.5 mg/mL أمبولة جاهزة)", isDefault: true }
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
      dilution: "يُعطى بتركيزه الأصلي (500 mcg/mL) أو مخففاً إلى 100 mcg/mL في سالاين 0.9%."
    },
    clinicalContexts: [
      {
        id: "rapid_onset_technique",
        label: "تقنية التسكين سريع البدء للإجراءات المحددة (Rapid-onset opioid technique)",
        doseMin: 10.0,
        doseMax: 20.0,
        unit: "mcg/kg",
        doseType: "weight_bolus",
        isDefault: true,
        note: "الجرعة تعتمد بشدة على التقنية التخديرية ونوع الإجراء والأدوية المصاحبة؛ لا تُستخدم كجرعة روتينية عامة للتنبيب لجميع المرضى، وتتطلب جاهزية التهوية الفورية."
      },
      {
        id: "short_procedure",
        label: "تسكين الإجراءات القصيرة المراقبة (Monitored Short Procedure)",
        doseMin: 5.0,
        doseMax: 10.0,
        unit: "mcg/kg",
        doseType: "weight_bolus",
        note: "تُعطى بحذر مع الجاهزية لدعم التنفس والأكسجة."
      },
      {
        id: "maintenance_infusion",
        label: "التسريب المستمر أثناء الجراحة (Maintenance Infusion)",
        doseMin: 0.5,
        doseMax: 1.5,
        unit: "mcg/kg/min",
        doseType: "weight_infusion_min",
        note: "يُوقف قبل نهاية العملية بـ 10-15 دقيقة."
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
      {
        type: "regulatory",
        organization: "FDA",
        title: "Alfentanil Injection Prescribing Information",
        year: "2023"
      },
      {
        type: "textbook",
        organization: "Morgan & Mikhail",
        title: "Clinical Anesthesiology, 7th Ed. — Rapid-acting Opioids",
        year: "2022"
      }
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
    indications: [
      "عامل تسكين مساعد في التخدير العام المتوازن للعمليات الجراحية الكبرى.",
      "عامل تخدير أولي أساسي في جراحات القلب والأوعية الدموية والجراحة العصبية الكبرى.",
      "تسكين المخاض والولادة عبر القثطرة فوق الجافية (Epidural Analgesia with local anesthetics)."
    ],
    routes: ["IV", "Epidural (Labor & Delivery)"],
    weightScalar: "Individualized / Titrate to effect",
    obesityDosingNotes: "أقوى من الفنتانيل بنحو 5 إلى 10 أضعاف؛ يتطلب المعايرة الحذرة وتفصيل الجرعة وفق الحالة السريرية ونوع التخدير.",
    concentrations: [
      { value: 5, unit: "mcg/mL", label: "5 mcg/mL (أمبولة مخففة)", isDefault: true },
      { value: 50, unit: "mcg/mL", label: "50 mcg/mL (أمبولة مركزة)" }
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
      dilution: "يُفضل التخفيف إلى تركيز 5 mcg/mL لتفادي أخطاء الجرعات المفرطة."
    },
    clinicalContexts: [
      {
        id: "analgesic_adjunct",
        label: "عامل تسكين مساعد في التخدير المتوازن (Analgesic Adjunct)",
        doseMin: 0.2,
        doseMax: 0.6,
        unit: "mcg/kg",
        doseType: "weight_bolus",
        isDefault: true,
        note: "يُعطى كعامل مساعد للتسكين مع أدوية التخدير الأخرى أثناء الجراحات العامة."
      },
      {
        id: "primary_anesthetic_cardiac",
        label: "عامل تخدير أساسي لجراحات القلب الكبرى (Primary Anesthetic - Cardiac)",
        doseMin: 1.0,
        doseMax: 3.0,
        unit: "mcg/kg",
        doseType: "weight_bolus",
        note: "تُعطى الجرعات العالية مع الأكسجين بنسبة 100% والمرخيات العضلية، وتتطلب تهوية آلية ممتدة ومراقبة مكثفة."
      },
      {
        id: "epidural_labor",
        label: "تسكين المخاض فوق الجافية (Epidural Labor Analgesia)",
        doseMin: 10.0,
        doseMax: 15.0,
        unit: "mcg (fixed)",
        doseType: "fixed",
        note: "تُعطى جرعة 10-15 mcg بالمشاركة مع بوبيفاكايين 0.125%؛ يجب التحقق الصارم من موضع القثطرة لمنع الحقن داخل القراب أو الأوعية."
      }
    ],
    warnings: [
      "⚠️ تحذير رسمي من FDA: هذا المستحضر مخصص للحقن الوريدي أو فوق الجافية (Epidural) فقط. الحقن غير المقصود داخل القراب (Intrathecal) أو داخل الأوعية قد يكون قاتلاً؛ يجب التأكد الصارم من موضع القثطرة قبل الحقن.",
      "فائق القوة (5-10 أضعاف الفنتانيل)، وأي خطأ حسابي يؤدي لتثبيط تنفسي فوري وعميق وبطء قلب شديد.",
      "خطر تصلب عضلات جدار الصدر وهبوط الضغط الحاد عند الحقن السريع."
    ],
    contraindications: [
      "فرط الحساسية المعروفة للسوفنتانيل أو مشتقات الفنتانيل.",
      "الحقن غير المقصود داخل القراب أو داخل الأوعية الدموية.",
      "الاستخدام دون توفر أجهزة التهوية والمراقبة المتقدمة."
    ],
    references: [
      {
        type: "regulatory",
        organization: "FDA",
        title: "Sufenta (Sufentanil Citrate Injection) Prescribing Information",
        year: "2024"
      },
      {
        type: "textbook",
        organization: "Miller",
        title: "Miller's Anesthesia, 9th Ed. — Potent Opioid Pharmacology",
        year: "2020"
      }
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
    indications: [
      "علاج ومنع الرعشة والارتجاف بعد التخدير النصفي أو العام (Post-Anesthetic Shivering).",
      "تسكين الألم الحاد متوسط الشدة وتسكين آلام المخاض قصيرة الأمد عند عدم توفر البدائل الأنسب."
    ],
    routes: ["IV", "IM"],
    weightScalar: "Fixed small dose for shivering / Individualized for acute pain",
    obesityDosingNotes: "يُفضل الاعتماد على الجرعات الثابتة المنخفضة لعلاج الرعشة وتجنب الحساب على الوزن الكلي المفرط لتفادي تراكم المستقلبات السامة.",
    concentrations: [
      { value: 50, unit: "mg/mL", label: "50 mg/mL (أمبولة 100 ملغ في 2 مل)", isDefault: true },
      { value: 10, unit: "mg/mL", label: "10 mg/mL (تخفيف 100 ملغ في 10 مل سالاين)" }
    ],
    pharmacodynamics: {
      onset: "2 – 5 دقائق (وريدياً)",
      peak: "15 – 30 دقيقة",
      clinicalDuration: "2 – 4 ساعات"
    },
    administration: {
      route: "IV / IM",
      method: "slow_push",
      pushSpeed: "حقن وريدي بطيء على مدى 2 – 3 دقائق؛ يسبب تهيجاً وعائياً وهبوط ضغط إذا حُقن سريعاً.",
      dilution: "يُوصى بتخفيفه في 10 مل سالاين 0.9% لتسهيل إعطاء جرعات دقيقة وصغيرة لعلاج الرعشة."
    },
    clinicalContexts: [
      {
        id: "anti_shivering",
        label: "علاج الرعشة بعد التخدير (Anti-Shivering)",
        doseMin: 12.5,
        doseMax: 25.0,
        unit: "mg (fixed)",
        doseType: "fixed_bolus",
        isDefault: true,
        note: "جرعة ثابتة صغيرة (12.5 إلى 25 ملغ وريدياً ببطء) كافية عادة لإنهاء الرعشة وتثبيط مركز تنظيم الحرارة."
      },
      {
        id: "acute_analgesia",
        label: "تسكين الألم الحاد البديل (Acute Pain Bolus)",
        doseMin: 25.0,
        doseMax: 50.0,
        unit: "mg (fixed)",
        doseType: "fixed_bolus",
        note: "استخدام محدود وقصير الأمد فقط؛ تجنب الجرعات المتكررة بسبب خطر تراكم مادة normeperidine، خصوصاً في قصور وظائف الكلى."
      }
    ],
    warnings: [
      "⚠️ تحذير حرج: تراكم المستقلب النشط (نوربيثيدين - Normeperidine) يسبب سمية عصبية واضحة (Neurotoxicity) تشمل الرعاش، الرمع العضلي (Myoclonus)، والاختلاجات والصرع، خصوصاً مع الجرعات المتكررة، الاستخدام لأكثر من 48 ساعة، أو في قصور وظائف الكلى.",
      "⚠️ خطر مميت: يُمنع الاستخدام المتزامن مع مثبطات المونوامين أوكسيديز (MAOIs) لخطورة حدوث متلازمة السيروتونين القاتلة (Serotonin Syndrome) وفرط الحرارة الشديد وهبوط/ارتفاع الضغط الحاد.",
      "يمتلك تأثيراً شبيهاً بالأتروبين (Atropine-like effect) فيسبب تسارع نبضات القلب وجفاف الفم، بخلاف باقي الأفيونات."
    ],
    contraindications: [
      "الاستخدام المتزامن أو خلال 14 يوماً من تناول أدوية MAOIs (خطر متلازمة السيروتونين).",
      "فرط الحساسية المعروفة للبيثيدين / الميبيريدين.",
      "قصور وظائف الكلى الشديد لخطورة تراكم النوربيثيدين المحدث للاختلاجات.",
      "المرضى الذين لديهم سوابق اختلاجات أو صرع."
    ],
    references: [
      {
        type: "regulatory",
        organization: "FDA",
        title: "Demerol (Meperidine HCl) Prescribing Information",
        year: "2023"
      },
      {
        type: "textbook",
        organization: "Miller",
        title: "Miller's Anesthesia, 9th Ed. — Postoperative Shivering Management",
        year: "2020"
      }
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
    indications: [
      "تسكين الألم الجراحي المتوسط إلى الشديد كجزء من التسكين متعدد الوسائط (Multimodal Analgesia).",
      "تسكين ألم ما بعد العمليات الجراحية اليومية والمتوسطة.",
      "خيار بديل لعلاج الرعشة والارتجاف بعد التخدير."
    ],
    routes: ["IV", "IM"],
    weightScalar: "Fixed dose (Adults) / Individualized titration",
    obesityDosingNotes: "للبالغين: يُفضل الاعتماد على الجرعات الثابتة (50-100 ملغ) مع الالتزام بالحد الأقصى للجرعة المفردة (100 ملغ) والجرعة اليومية (400 ملغ/يوم) بغض النظر عن وزن الجسم.",
    concentrations: [
      { value: 50, unit: "mg/mL", label: "50 mg/mL (أمبولة 100 ملغ في 2 مل)", isDefault: true }
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
      dilution: "يُفضل تخفيفه في 10-20 مل سالاين 0.9% لتفادي الدوار والغثيان الحاد."
    },
    clinicalContexts: [
      {
        id: "postop_analgesia",
        label: "تسكين الألم بعد العمليات (Adult Postop Analgesia)",
        doseMin: 50.0,
        doseMax: 100.0,
        unit: "mg (fixed)",
        doseType: "fixed",
        isDefault: true,
        note: "50 إلى 100 ملغ وريدياً ببطء كل 6 ساعات حسب الحاجة (الحد الأقصى للجرعة المفردة 100 ملغ، والحد الأقصى اليومي 400 ملغ/يوم)."
      },
      {
        id: "anti_shivering",
        label: "علاج الرعشة بعد التخدير (Anti-Shivering)",
        doseMin: 50.0,
        doseMax: 50.0,
        unit: "mg (fixed)",
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
      {
        type: "regulatory",
        organization: "FDA",
        title: "Ultram (Tramadol HCl) Prescribing Information",
        year: "2023"
      },
      {
        type: "regulatory",
        organization: "eMC",
        title: "Tramadol 50mg/ml Solution for Injection SmPC",
        year: "2024"
      }
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
    indications: [
      "الركيزة الأساسية الأولى للتسكين متعدد الوسائط (Multimodal Analgesia) لجميع الفئات الجراحية.",
      "تسكين الألم الخفيف إلى المتوسط، والمساهمة في خفض الاحتياج الكلي للأفيونات (Opioid-sparing effect).",
      "علاج وخفض الحمى والحرارة المرتفعة أثناء وبعد الجراحة."
    ],
    routes: ["IV Infusion"],
    weightScalar: "Fixed (for ≥50 kg) / Weight-based (for <50 kg)",
    obesityDosingNotes: "للبالغين ذوي الوزن 50 كجم فأكثر: يُعطى بالجرعة الثابتة القياسية 1000 ملغ. في البالغين ذوي الوزن أقل من 50 كجم والأطفال: يجب الحساب الدقيق بالوزن (15 mg/kg) لتجنب الجرعات الزائدة.",
    concentrations: [
      { value: 10, unit: "mg/mL", label: "10 mg/mL (قارورة جاهزة 1000 ملغ في 100 مل)", isDefault: true }
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
      dilution: "يأتي في قارورة جاهزة للتقطير الوريدي المباشر بتركيز 10 mg/mL."
    },
    clinicalContexts: [
      {
        id: "adult_standard",
        label: "البالغين والمراهقين ذوي الوزن ≥50 كجم (Standard Adult Dose)",
        doseMin: 1000,
        doseMax: 1000,
        unit: "mg (fixed)",
        doseType: "fixed_infusion",
        isDefault: true,
        note: "1000 ملغ (100 مل) بالتسريب الوريدي على مدى 15 دقيقة كل 6 ساعات، أو 650 ملغ كل 4 ساعات (الحد الأقصى اليومي 4000 ملغ/يوم من جميع المصادر)."
      },
      {
        id: "weight_based",
        label: "البالغين والمراهقين ذوي الوزن <50 كجم والأطفال (Weight-based Dosing)",
        doseMin: 15.0,
        doseMax: 15.0,
        unit: "mg/kg",
        doseType: "weight_bolus",
        note: "15 mg/kg بالتسريب الوريدي كل 6 ساعات، أو 12.5 mg/kg كل 4 ساعات وفق النظام المتبع. يجب ألا يتجاوز إجمالي الأسيتامينوفين من جميع الطرق 75 mg/kg/day، وبحد أقصى 3750 mg/day لهذه الفئة وفق ملصق FDA."
      }
    ],
    warnings: [
      "خطر السمية والقصور الكبدي الحاد عند تجاوز الجرعة اليومية القصوى (4 غرام/يوم للبالغين السليمين، وتُخفض إلى 2-3 غرام/يوم في قصور الكبد وسوء التغذية وإدمان الكحول).",
      "يجب التحقق من أي جرعات باراسيتامول تم إعطاؤها فموياً أو ضمن مركبات أخرى قبل الجراحة لتفادي تجاوز الحد الأقصى.",
      "قد يسبب هبوطاً عابراً في ضغط الدم أثناء التسريب لدى المرضى ذوي الحالات الحرجة في العناية المركزة."
    ],
    contraindications: [
      "القصور الكبدي الحاد الشديد أو المرض الكبدي النشط غير المعاوض.",
      "فرط الحساسية المعروفة للباراسيتامول أو الأسيتامينوفين أو البروباسيتامول."
    ],
    references: [
      {
        type: "regulatory",
        organization: "FDA",
        title: "Ofirmev (Acetaminophen Injection) Prescribing Information",
        year: "2024"
      },
      {
        type: "textbook",
        organization: "Miller",
        title: "Miller's Anesthesia, 9th Ed. — Multimodal Analgesia Strategies",
        year: "2020"
      }
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
    indications: [
      "التدبير قصير الأمد للألم الحاد المتوسط إلى الشديد بعد العمليات الجراحية (NSAID قوي).",
      "المساهمة في تقليل استهلاك الأفيونات والحد من آثارها الجانبية كالغثيان والتهدئة الزائدة.",
      "تسكين آلام المغص الكلوي الحاد."
    ],
    routes: ["IV", "IM"],
    weightScalar: "Fixed dose based on age, weight, and renal status",
    obesityDosingNotes: "تُستخدم الجرعات الثابتة المحددة للفئة السريرية؛ لا تُرفع الجرعة بحسب زيادة وزن المريض في السمنة لتفادي السمية الكلوية والنزف.",
    concentrations: [
      { value: 30, unit: "mg/mL", label: "30 mg/mL (أمبولة 1 مل)", isDefault: true }
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
      dilution: "يمكن إعطاؤه غير مخفف أو مخففاً في سالاين 0.9%."
    },
    clinicalContexts: [
      {
        id: "adult_standard",
        label: "البالغين (<65 سنة ووزن ≥50 كجم بدون قصور كلوي)",
        doseMin: 30.0,
        doseMax: 30.0,
        unit: "mg (fixed)",
        doseType: "fixed",
        isDefault: true,
        note: "30 ملغ وريدياً أو عضلياً كل 6 ساعات حسب الحاجة (الحد الأقصى اليومي 120 ملغ/يوم، ولمدة أقصاها 5 أيام متتالية فقط من جميع الطرق)."
      },
      {
        id: "high_risk_population",
        label: "الفئات عالية الخطورة (≥65 سنة، وزن <50 كجم، أو قصور كلوي)",
        doseMin: 15.0,
        doseMax: 15.0,
        unit: "mg (fixed)",
        doseType: "fixed",
        note: "15 ملغ وريدياً أو عضلياً كل 6 ساعات (الحد الأقصى اليومي 60 ملغ/يوم، ولمدة أقصاها 5 أيام)."
      }
    ],
    warnings: [
      "يثبط تراكم الصفائح الدموية ويزيد وقت النزف؛ يجب تجنبه أو استخدامه بحذر شديد عندما تكون مخاطر النزف الجراحي غير مقبولة أو يتطلب الإجراء إرقاءً دقيقاً وصارماً.",
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
      {
        type: "regulatory",
        organization: "FDA",
        title: "Toradol (Ketorolac Tromethamine) Injection Boxed Warning & Label",
        year: "2023"
      },
      {
        type: "textbook",
        organization: "Morgan & Mikhail",
        title: "Clinical Anesthesiology, 7th Ed. — NSAIDs & Perioperative Bleeding",
        year: "2022"
      }
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
    indications: [
      "تسكين الألم الحاد بعد العمليات الجراحية كجزء من التسكين متعدد الوسائط.",
      "علاج المغص الكلوي والمراري الحاد.",
      "علاج الالتهاب والتورم الحاد المرافق للإجراءات الجراحية والعظمية."
    ],
    routes: ["IM (Deep)", "IV Infusion"],
    weightScalar: "Fixed dose (Adults)",
    obesityDosingNotes: "جرعة محددة ثابتة للبالغين؛ لا تُحسب بضرب الوزن لتفادي السمية الكلوية والوعائية.",
    concentrations: [
      { value: 25, unit: "mg/mL", label: "25 mg/mL (أمبولة 75 ملغ في 3 مل)", isDefault: true }
    ],
    pharmacodynamics: {
      onset: "15 – 30 دقيقة",
      peak: "30 – 60 دقيقة",
      clinicalDuration: "6 – 8 ساعات"
    },
    administration: {
      route: "IM / IV Infusion",
      method: "infusion_or_deep_im",
      pushSpeed: "حقن عضلي عميق في الربع العلوي الخارجي للإلية. للإعطاء الوريدي: يجب تخفيف 75 ملغ في 100-500 مل سالاين والتسريب على مدى 30 إلى 120 دقيقة.",
      dilution: "لا يُحقن وريدياً كدفعة سريعة (IV Bolus) غير مخففة لتفادي الألم الشديد والتهيج الوعائي."
    },
    clinicalContexts: [
      {
        id: "standard_parenteral",
        label: "الجرعة الوريدية بالتسريب أو العضلية (Standard Parenteral Dose)",
        doseMin: 75.0,
        doseMax: 75.0,
        unit: "mg (fixed)",
        doseType: "fixed_infusion",
        isDefault: true,
        note: "75 ملغ بالتسريب الوريدي البطيء على مدى 30-120 دقيقة أو عضلياً عميقاً (الحد الأقصى 150 ملغ في 24 ساعة، ولمدة علاج حقني لا تتجاوز يومين)."
      }
    ],
    warnings: [
      "يرفع احتمالية المخاطر الخثارية القلبية الوعائية (Cardiovascular Thrombotic Events)؛ يُستخدم بأقل جرعة فعالة ولأقصر مدة ممكنة.",
      "خطر النزف والتقرح الهضمي وتثبيط التروية الكلوية لدى المرضى الذين يعانون من نقص السوائل.",
      "الحقن العضلي يجب أن يكون عميقاً جداً لتجنب تلف الأنسجة والأعصاب المحيطية."
    ],
    contraindications: [
      "القرحة الهضمية النشطة أو النزف المعوي.",
      "قصور وظائف الكلى أو الكبد الشديد والقصور القلبي الحاد غير المستقر.",
      "مرضى الربو المحرض بمضادات الالتهاب غير الستيرويدية."
    ],
    references: [
      {
        type: "regulatory",
        organization: "eMC",
        title: "Voltarol (Diclofenac Sodium) 75mg/3ml Injection SmPC",
        year: "2024"
      },
      {
        type: "textbook",
        organization: "Oxford",
        title: "Oxford Handbook of Anaesthesia, 5th Ed. — Non-Opioid Analgesics",
        year: "2022"
      }
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
    indications: [
      "تسكين الألم الحاد بعد العمليات الجراحية عبر التثبيط الانتقائي لأنزيم (COX-2 Selective Inhibitor).",
      "تسكين الألم الجراحي مع تأثير أقل على وظيفة الصفائح الدموية مقارنة بـ NSAIDs غير الانتقائية.",
      "تقليل استهلاك الأفيونات في جراحات العظام والجراحة العامة الكبرى."
    ],
    routes: ["IV", "IM"],
    weightScalar: "Fixed dose (Adults)",
    obesityDosingNotes: "جرعة قياسية ثابتة للبالغين 40 ملغ وريدياً دون الحاجة لتعديل الجرعة في السمنة.",
    concentrations: [
      { value: 20, unit: "mg/mL", label: "20 mg/mL (فيال 40 ملغ يُحل في 2 مل سالاين)", isDefault: true }
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
      dilution: "يأتي كمسحوق جاف (40 ملغ) ويُحل في 2 مل سالاين 0.9% ليصبح بتركيز 20 mg/mL."
    },
    clinicalContexts: [
      {
        id: "adult_standard",
        label: "الجرعة القياسية للبالغين (Standard Adult Dose)",
        doseMin: 40.0,
        doseMax: 40.0,
        unit: "mg (fixed)",
        doseType: "fixed",
        isDefault: true,
        note: "40 ملغ وريدياً أو عضلياً، تليها 20-40 ملغ كل 6-12 ساعة حسب الحاجة (الحد الأقصى 80 ملغ/يوم)."
      },
      {
        id: "elderly_reduced",
        label: "كبار السن (≥65 سنة) أو وزن <50 كجم",
        doseMin: 20.0,
        doseMax: 20.0,
        unit: "mg (fixed)",
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
      {
        type: "regulatory",
        organization: "EMA",
        title: "Dynastat (Parecoxib Sodium) SmPC",
        year: "2024"
      },
      {
        type: "textbook",
        organization: "Miller",
        title: "Miller's Anesthesia, 9th Ed. — Selective COX-2 Inhibitors",
        year: "2020"
      }
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
    indications: [
      "تثبيط مستقبلات NMDA لمنع التحسس المركزي للألم وتخفيف فرط التحسس (Anti-Hyperalgesia).",
      "تسكين الألم الحاد الشديد وتقليل استهلاك الأفيونات كجزء من التسكين متعدد الوسائط.",
      "تسكين آلام المرضى المعتادين على الأفيونات (Opioid-Tolerant Patients) وآلام الجراحات الكبرى المؤلمة."
    ],
    routes: ["IV Bolus", "IV Infusion"],
    weightScalar: "Weight-based; consider adjusted/ideal body weight in obesity according to institutional protocol",
    obesityDosingNotes: "يُعاير بحسب بروتوكول المؤسسة والوزن المثالي أو المعدل في السمنة لتقليل الآثار النفسية غير المرغوبة ومنع تأخر الإفاقة.",
    concentrations: [
      { value: 10, unit: "mg/mL", label: "10 mg/mL (تخفيف 50 ملغ في 5 مل سالاين)", isDefault: true },
      { value: 50, unit: "mg/mL", label: "50 mg/mL (أمبولة أصلية 500 ملغ في 10 مل)" }
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
      dilution: "يُسحب 1 مل (50 ملغ) ويُخفف في 4 مل سالاين ليصبح التركيز 10 mg/mL لتسهيل المعايرة الدقيقة للجرعات المسكنة المنخفضة."
    },
    clinicalContexts: [
      {
        id: "low_dose_bolus",
        label: "جرعة مسكنة منخفضة محيطة بالجراحة (Low-dose perioperative analgesic bolus)",
        doseMin: 0.15,
        doseMax: 0.35,
        unit: "mg/kg",
        doseType: "weight_bolus",
        isDefault: true,
        note: "تُعطى بعد التحريض وقبل الشق الجراحي أو أثناء الجراحة؛ الجرعات تحت التخديرية (<0.35 mg/kg) نادراً ما تسبب اضطرابات نفسية عند الإفاقة."
      },
      {
        id: "low_dose_infusion",
        label: "تسريب مسكن مستمر أثناء الجراحة (Low-Dose Infusion)",
        doseMin: 0.1,
        doseMax: 0.2,
        unit: "mg/kg/h",
        doseType: "weight_infusion_hour",
        note: "تسريب وريدي منخفض الجرعة أثناء العمليات الكبرى؛ يُوقف قبل نهاية العملية بنحو 30 دقيقة لتجنب تأخر الإفاقة."
      }
    ],
    warnings: [
      "بالجرعات المسكنة المنخفضة تكون الآثار النفسية نادرة، لكنها قد تحدث وتتطلب التقييم والمراقبة السريرية.",
      "يحافظ على التنفس التلقائي ومنعكسات المجرى الهوائي بشكل أفضل من معظم أدوية التخدير، لكن هذا ليس ضماناً مطلقاً؛ فقد يحدث انقطاع نفس أو انسداد مجرى الهواء أو تشنج الحنجرة خاصة مع الحقن السريع.",
      "تنبيه الجهاز العصبي الودي قد يرفع النبض وضغط الدم بشكل طفيف عبر تحرير الكاتيكولامينات."
    ],
    contraindications: [
      "ارتفاع ضغط الدم الشديد غير المنضبط أو داء الشريان التاجي غير المستقر.",
      "الذهان الحاد والاضطرابات النفسية الشديدة النشطة.",
      "يُستخدم بحذر وتقييم سريري دقيق ومراقبة مستمرة في المرضى الذين يعانون من أمراض داخل القحف أو ارتفاع الضغط داخل الجمجمة."
    ],
    references: [
      {
        type: "guideline",
        organization: "ASRA-AAPM",
        title: "Consensus Guidelines on the Use of Intravenous Ketamine for Acute Pain Management",
        year: "2018"
      },
      {
        type: "textbook",
        organization: "Miller",
        title: "Miller's Anesthesia, 9th Ed. — NMDA Antagonists & Adjuvant Analgesia",
        year: "2020"
      }
    ]
  }
];
