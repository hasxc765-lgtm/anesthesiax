// ============================================================
// AnesthesiaX - Drug Center
// Version: 2.6 (Clinically Audited & Corrected)
// Compatible with:
//   - js/app.js
//   - js/calculators/doseCalculator.js
// ============================================================

export const drugsData = [

  // ==========================================================
  // 1. PROPOFOL
  // ==========================================================
  {
    id: "propofol",
    name: "Propofol",
    arabicName: "بروبوفول",
    category: "Induction",

    searchKeywords: ["propofol", "diprivan", "بروبوفول", "تحريض", "induction"],

    indications: [
      {
        id: "induction",
        title: "تحريض التخدير العام",
        route: "وريدي IV",
        doseConfig: {
          doseType: "mg/kg",
          doseMin: 1.5,
          doseMax: 2.5,
          unitLabel: "mg/kg"
        }
      },
      {
        id: "sedation",
        title: "التهدئة / الإجراءات",
        route: "وريدي IV",
        doseConfig: {
          doseType: "mg/kg",
          doseMin: 0.5,
          doseMax: 1.0,
          unitLabel: "mg/kg"
        }
      }
    ],

    concentrationConfig: {
      defaultUnit: "mg/mL",
      availableConcentrations: [
        { value: 10, label: "10 mg/mL", isDefault: true },
        { value: 20, label: "20 mg/mL", isDefault: false }
      ],
      customAllowed: true,
      minCustomConcentration: 1,
      maxCustomConcentration: 20
    },

    pharmacokinetics: { onset: "30–60 ثانية", duration: "5–10 دقائق" },

    safetyProfile: {
      isHighAlert: true,
      safetyNotes: "قد يسبب انخفاض ضغط الدم وتثبيط التنفس، خاصة عند إعطائه بسرعة أو عند استخدامه مع أدوية مهدئة أخرى."
    },

    clinicalDetails: {
      administration: "يُعطى عن طريق الوريد ببطء مع معايرة الجرعة وفق الاستجابة السريرية.",
      warnings: ["انخفاض ضغط الدم", "تثبيط التنفس", "انقطاع التنفس", "ألم أثناء الحقن"],
      contraindications: ["فرط الحساسية المعروف للبروبوفول أو لأحد مكونات المستحضر"],
      reversal: "لا يوجد مضاد نوعي؛ يجب توفير دعم مجرى الهواء والدعم التنفسي والقلبي الوعائي عند الحاجة."
    },

    dilutions: [{ instructions: "يُستخدم حسب تركيبة المستحضر والبروتوكول المحلي. تجنب التخفيف غير الضروري." }],

    references: [
      { source: "Miller's Anesthesia", topic: "Intravenous Anesthetic Drugs" },
      { source: "Morgan & Mikhail's Clinical Anesthesiology", topic: "Propofol" }
    ]
  },

  // ==========================================================
  // 2. KETAMINE
  // ==========================================================
  {
    id: "ketamine",
    name: "Ketamine",
    arabicName: "كيتامين",
    category: "Induction",

    searchKeywords: ["ketamine", "ketalar", "كيتامين", "تحريض", "تسكين"],

    indications: [
      {
        id: "induction",
        title: "تحريض التخدير العام",
        route: "وريدي IV",
        doseConfig: {
          doseType: "mg/kg",
          doseMin: 1.0,
          doseMax: 2.0,
          unitLabel: "mg/kg"
        }
      },
      {
        id: "im",
        title: "تحريض عضلي IM",
        route: "عضلي IM",
        doseConfig: {
          doseType: "mg/kg",
          doseMin: 4.0,
          doseMax: 6.0,
          unitLabel: "mg/kg"
        }
      }
    ],

    concentrationConfig: {
      defaultUnit: "mg/mL",
      availableConcentrations: [
        { value: 10, label: "10 mg/mL", isDefault: false },
        { value: 50, label: "50 mg/mL", isDefault: true },
        { value: 100, label: "100 mg/mL", isDefault: false }
      ],
      customAllowed: true,
      minCustomConcentration: 1,
      maxCustomConcentration: 500
    },

    pharmacokinetics: { onset: "30–60 ثانية IV", duration: "10–20 دقيقة" },

    safetyProfile: {
      isHighAlert: true,
      safetyNotes: "قد يسبب ارتفاع ضغط الدم ومعدل القلب وزيادة الإفرازات، وقد يسبب ظواهر الاستيقاظ غير المريحة."
    },

    clinicalDetails: {
      administration: "يُعطى وريدياً ببطء مع معايرة الجرعة وفق الاستجابة السريرية.",
      warnings: ["ارتفاع ضغط الدم", "تسرع القلب", "زيادة الإفرازات", "تفاعلات الاستيقاظ"],
      contraindications: ["فرط الحساسية المعروف", "الحالات التي يكون فيها ارتفاع ضغط الدم أمراً خطيراً"],
      reversal: "لا يوجد مضاد نوعي؛ يجب توفير الدعم المناسب لمجرى الهواء والجهازين التنفسي والقلبي الوعائي."
    },

    dilutions: [{ instructions: "يعتمد التخفيف على تركيز المستحضر والبروتوكول المحلي." }],

    references: [
      { source: "Miller's Anesthesia", topic: "Ketamine" },
      { source: "Morgan & Mikhail's Clinical Anesthesiology", topic: "Intravenous Anesthetics" }
    ]
  },

  // ==========================================================
  // 3. ROCURONIUM (Corrected RSI Dosage)
  // ==========================================================
  {
    id: "rocuronium",
    name: "Rocuronium",
    arabicName: "روكورونيوم",
    category: "Muscle Relaxant",

    searchKeywords: ["rocuronium", "esmeron", "zemuron", "روكورونيوم", "مرخي عضلات", "NMB", "RSI"],

    indications: [
      {
        id: "intubation",
        title: "التنبيب الرغامي الروتيني",
        route: "وريدي IV",
        doseConfig: {
          doseType: "mg/kg",
          doseMin: 0.6,
          doseMax: 0.6,
          unitLabel: "mg/kg"
        }
      },
      {
        id: "rsi",
        title: "التنبيب بالتسلسل السريع RSI (المعدل سريرياً)",
        route: "وريدي IV",
        doseConfig: {
          doseType: "mg/kg",
          doseMin: 0.9,
          doseMax: 1.2,
          unitLabel: "mg/kg"
        }
      },
      {
        id: "maintenance",
        title: "جرعة الصيانة",
        route: "وريدي IV",
        doseConfig: {
          doseType: "mg/kg",
          doseMin: 0.1,
          doseMax: 0.15,
          unitLabel: "mg/kg"
        }
      }
    ],

    concentrationConfig: {
      defaultUnit: "mg/mL",
      availableConcentrations: [{ value: 10, label: "10 mg/mL", isDefault: true }],
      customAllowed: true,
      minCustomConcentration: 1,
      maxCustomConcentration: 20
    },

    pharmacokinetics: { onset: "60–90 ثانية (60 ثانية بجرعة RSI)", duration: "30–45 دقيقة" },

    safetyProfile: {
      isHighAlert: true,
      safetyNotes: "مرخٍ للعضلات. يسبب شللاً كاملاً لعضلات التنفس. يجب توفر وسائل تأمين مجرى الهواء والتهوية الميكانيكية فوراً."
    },

    clinicalDetails: {
      administration: "يُعطى وريدياً فقط مع مراقبة الحصر العصبي العضلي.",
      warnings: ["شلل عضلات التنفس", "تفاعلات الحساسية المفرطة", "ضرورة المراقبة العصبية العضلية"],
      contraindications: ["فرط الحساسية المعروف للروكورونيوم"],
      reversal: "يُعكس بـ Sugammadex أو Neostigmine مع مضاد مسكاريني."
    },

    dilutions: [{ instructions: "يمكن تخفيفه بمحلول كلوريد الصوديوم 0.9%." }],

    references: [
      { source: "FDA Prescribing Information", topic: "Rocuronium Bromide Injection" },
      { source: "Miller's Anesthesia", topic: "Neuromuscular Blocking Drugs" }
    ]
  },

  // ==========================================================
  // 4. FENTANYL
  // ==========================================================
  {
    id: "fentanyl",
    name: "Fentanyl",
    arabicName: "فنتانيل",
    category: "Opioid",

    searchKeywords: ["fentanyl", "sublimaze", "فنتانيل", "أفيوني", "تسكين"],

    indications: [
      {
        id: "analgesia",
        title: "التسكين حول العملية",
        route: "وريدي IV",
        doseConfig: {
          doseType: "mcg/kg",
          doseMin: 1,
          doseMax: 2,
          unitLabel: "mcg/kg"
        }
      },
      {
        id: "high_dose",
        title: "جرعات التسكين العالية",
        route: "وريدي IV",
        doseConfig: {
          doseType: "mcg/kg",
          doseMin: 2,
          doseMax: 5,
          unitLabel: "mcg/kg"
        }
      }
    ],

    concentrationConfig: {
      defaultUnit: "mcg/mL",
      availableConcentrations: [{ value: 50, label: "50 mcg/mL", isDefault: true }],
      customAllowed: true,
      minCustomConcentration: 1,
      maxCustomConcentration: 1000
    },

    pharmacokinetics: { onset: "1–2 دقيقة IV", duration: "30–60 دقيقة" },

    safetyProfile: {
      isHighAlert: true,
      safetyNotes: "أفيون قوي. قد يسبب تثبيط التنفس وتيبس جدار الصدر عند الإعطاء السريع."
    },

    clinicalDetails: {
      administration: "يُعطى وريدياً ببطء مع معايرة الجرعة وفق الاستجابة.",
      warnings: ["تثبيط التنفس", "بطء القلب", "انخفاض ضغط الدم", "تيبس جدار الصدر"],
      contraindications: ["فرط الحساسية المعروف"],
      reversal: "يُعكس بـ Naloxone."
    },

    dilutions: [{ instructions: "يمكن تخفيفه بمحاليل وريدية متوافقة." }],

    references: [{ source: "Miller's Anesthesia", topic: "Opioid Analgesics" }]
  },

  // ==========================================================
  // 5. ATROPINE (Corrected Category & Max Dose Cap)
  // ==========================================================
  {
    id: "atropine",
    name: "Atropine",
    arabicName: "أتروبين",
    category: "Anticholinergic", // Corrected from Vasopressor

    searchKeywords: ["atropine", "أتروبين", "بطء القلب", "مضاد كولين", "bradycardia", "anticholinergic"],

    indications: [
      {
        id: "bradycardia",
        title: "بطء القلب العرضي (ACLS)",
        route: "وريدي IV",
        doseConfig: {
          doseType: "fixed_mg",
          fixedDoseValue: 1,
          doseMin: 1,
          doseMax: 1,
          maxDoseLimit: 3, // Corrected Max Cumulative Dose Limit
          unitLabel: "mg"
        }
      },
      {
        id: "neostigmine",
        title: "مع عكس النيوستغمين",
        route: "وريدي IV",
        doseConfig: {
          doseType: "mg/kg",
          doseMin: 0.01,
          doseMax: 0.02,
          unitLabel: "mg/kg"
        }
      }
    ],

    concentrationConfig: {
      defaultUnit: "mg/mL",
      availableConcentrations: [
        { value: 1, label: "1 mg/mL", isDefault: true },
        { value: 0.5, label: "0.5 mg/mL", isDefault: false },
        { value: 0.6, label: "0.6 mg/mL", isDefault: false }
      ],
      customAllowed: true,
      minCustomConcentration: 0.1,
      maxCustomConcentration: 10
    },

    pharmacokinetics: { onset: "1–2 دقيقة IV", duration: "2–4 ساعات" },

    safetyProfile: {
      isHighAlert: true,
      safetyNotes: "مضاد كولين. يسبب تسرع القلب وجفاف الفم واحتباس البول. الحد الأقصى التراكمي للبالغين في بطء القلب هو 3 ملغم."
    },

    clinicalDetails: {
      administration: "يُعطى وريدياً سريعاً في بطء القلب العرضي.",
      warnings: ["تسرع القلب", "تأثيرات مضادة للكولين", "احتباس البول"],
      contraindications: ["فرط الحساسية المعروف"],
      reversal: "لا يوجد عكس نوعي روتيني."
    },

    dilutions: [{ instructions: "يُستخدم التركيز المتوفر وفق الاستطباب." }],

    references: [{ source: "AHA ACLS Guidelines", topic: "Adult Bradycardia" }]
  },

  // ==========================================================
  // 6. ATRACURIUM
  // ==========================================================
  {
    id: "atracurium",
    name: "Atracurium",
    arabicName: "أتراكوريوم",
    category: "Muscle Relaxant",

    searchKeywords: ["atracurium", "tracrium", "أتراكوريوم", "مرخي عضلات"],

    indications: [
      {
        id: "intubation",
        title: "التنبيب الرغامي",
        route: "وريدي IV",
        doseConfig: {
          doseType: "mg/kg",
          doseMin: 0.4,
          doseMax: 0.5,
          unitLabel: "mg/kg"
        }
      },
      {
        id: "maintenance",
        title: "جرعة الصيانة",
        route: "وريدي IV",
        doseConfig: {
          doseType: "mg/kg",
          doseMin: 0.08,
          doseMax: 0.1,
          unitLabel: "mg/kg"
        }
      }
    ],

    concentrationConfig: {
      defaultUnit: "mg/mL",
      availableConcentrations: [{ value: 10, label: "10 mg/mL", isDefault: true }],
      customAllowed: true,
      minCustomConcentration: 1,
      maxCustomConcentration: 20
    },

    pharmacokinetics: { onset: "2–3 دقائق", duration: "20–35 دقيقة" },

    safetyProfile: {
      isHighAlert: true,
      safetyNotes: "قد يسبب إطلاق الهيستامين وانخفاض ضغط الدم والتشنج القصبي عند الإعطاء السريع."
    },

    clinicalDetails: {
      administration: "يُعطى وريدياً ببطء لتقليل إطلاق الهيستامين.",
      warnings: ["شلل عضلات التنفس", "إطلاق الهيستامين", "انخفاض ضغط الدم"],
      contraindications: ["فرط الحساسية المعروف"],
      reversal: "يُعكس بـ Neostigmine مع مضاد مسكاريني."
    },

    dilutions: [{ instructions: "يُعطى وريدياً وفق التركيز المتوفر." }],

    references: [{ source: "Miller's Anesthesia", topic: "Neuromuscular Blocking Drugs" }]
  },

  // ==========================================================
  // 7. SUCCINYLCHOLINE
  // ==========================================================
  {
    id: "succinylcholine",
    name: "Succinylcholine",
    arabicName: "سكسينيل كولين",
    category: "Muscle Relaxant",

    searchKeywords: ["succinylcholine", "suxamethonium", "سكسينيل كولين", "RSI"],

    indications: [
      {
        id: "intubation",
        title: "التنبيب الرغامي / RSI",
        route: "وريدي IV",
        doseConfig: {
          doseType: "mg/kg",
          doseMin: 1.0,
          doseMax: 1.5,
          unitLabel: "mg/kg"
        }
      }
    ],

    concentrationConfig: {
      defaultUnit: "mg/mL",
      availableConcentrations: [
        { value: 20, label: "20 mg/mL", isDefault: true },
        { value: 50, label: "50 mg/mL", isDefault: false }
      ],
      customAllowed: true,
      minCustomConcentration: 1,
      maxCustomConcentration: 100
    },

    pharmacokinetics: { onset: "30–60 ثانية", duration: "5–10 دقائق" },

    safetyProfile: {
      isHighAlert: true,
      safetyNotes: "مرخٍ مزيل للاستقطاب. يرفع خطر فرط بوتاسيوم الدم الشديد وفرط الحرارة الخبيث (MH)."
    },

    clinicalDetails: {
      administration: "يُعطى وريدياً سريعا مع الجاهزية للتنبيب والتهوية.",
      warnings: ["فرط بوتاسيوم الدم", "فرط الحرارة الخبيث", "بطء القلب"],
      contraindications: ["خطر فرط بوتاسيوم الدم", "القابلية لفرط الحرارة الخبيث"],
      reversal: "لا يوجد مضاد؛ ينتهي تأثيره تلقائياً."
    },

    dilutions: [{ instructions: "يُستخدم وفق تركيبة المستحضر." }],

    references: [{ source: "Miller's Anesthesia", topic: "Depolarizing Neuromuscular Blockade" }]
  },

  // ==========================================================
  // 8. EPHEDRINE
  // ==========================================================
  {
    id: "ephedrine",
    name: "Ephedrine",
    arabicName: "إيفيدرين",
    category: "Vasopressor",

    searchKeywords: ["ephedrine", "إيفيدرين", "انخفاض ضغط الدم"],

    indications: [
      {
        id: "hypotension",
        title: "انخفاض ضغط الدم المرتبط بالتخدير",
        route: "وريدي IV",
        doseConfig: {
          doseType: "fixed_mg",
          fixedDoseValue: 5,
          doseMin: 5,
          doseMax: 10,
          unitLabel: "mg"
        }
      }
    ],

    concentrationConfig: {
      defaultUnit: "mg/mL",
      availableConcentrations: [
        { value: 5, label: "5 mg/mL", isDefault: true },
        { value: 30, label: "30 mg/mL", isDefault: false },
        { value: 50, label: "50 mg/mL", isDefault: false }
      ],
      customAllowed: true,
      minCustomConcentration: 0.1,
      maxCustomConcentration: 100
    },

    pharmacokinetics: { onset: "1–2 دقيقة IV", duration: "10–60 دقيقة" },

    safetyProfile: {
      isHighAlert: true,
      safetyNotes: "دواء محاكي للودي. قد يسبب تسرع القلب واضطرابات النظم."
    },

    clinicalDetails: {
      administration: "تُعطى الجرعة الوريدية تدريجياً حسب ضغط الدم والنبض.",
      warnings: ["تسرع القلب", "ارتفاع ضغط الدم"],
      contraindications: ["فرط الحساسية المعروف"],
      reversal: "لا يوجد مضاد نوعي."
    },

    dilutions: [{ instructions: "يُخفف إلى تركيز عملي (مثلاً 5 mg/mL) قبل الحقن." }],

    references: [{ source: "Miller's Anesthesia", topic: "Vasopressors" }]
  },

  // ==========================================================
  // 9. NEOSTIGMINE (Corrected Category)
  // ==========================================================
  {
    id: "neostigmine",
    name: "Neostigmine",
    arabicName: "نيوستغمين",
    category: "Reversal", // Corrected from Muscle Relaxant

    searchKeywords: ["neostigmine", "prostigmin", "نيوستغمين", "عكس المرخيات", "reversal"],

    indications: [
      {
        id: "reversal",
        title: "عكس الحصر العصبي العضلي غير مزيل الاستقطاب",
        route: "وريدي IV",
        doseConfig: {
          doseType: "mg/kg",
          doseMin: 0.03,
          doseMax: 0.07,
          maxDoseLimit: 5, // Maximum Dose Limit 5 mg
          unitLabel: "mg/kg"
        }
      }
    ],

    concentrationConfig: {
      defaultUnit: "mg/mL",
      availableConcentrations: [
        { value: 0.5, label: "0.5 mg/mL", isDefault: true },
        { value: 2.5, label: "2.5 mg/mL", isDefault: false }
      ],
      customAllowed: true,
      minCustomConcentration: 0.1,
      maxCustomConcentration: 5
    },

    pharmacokinetics: { onset: "3–10 دقائق", duration: "40–60 دقيقة" },

    safetyProfile: {
      isHighAlert: true,
      safetyNotes: "دواء لعكس المرخيات. يُعطى دائماً مع مضاد مسكاريني (أتروبين أو غليكوبيرولات) لتفادي بطء القلب الشديد. الحد الأقصى 5 ملغم."
    },

    clinicalDetails: {
      administration: "يُعطى وريدياً مع الأتروبين عند وجود استجابة عضلية أوليّة.",
      warnings: ["بطء القلب الشديد", "تشنج قصبي", "زيادة الإفرازات"],
      contraindications: ["الانسداد الميكانيكي للأمعاء أو المسالك البولية"],
      reversal: "هو دواء عكسي بذاته."
    },

    dilutions: [{ instructions: "يُعطى وفق تركيز الأمبول والبروتوكول المحلي." }],

    references: [{ source: "Miller's Anesthesia", topic: "Reversal of Neuromuscular Block" }]
  },

  // ==========================================================
  // 10. MIDAZOLAM
  // ==========================================================
  {
    id: "midazolam",
    name: "Midazolam",
    arabicName: "ميدازولام",
    category: "Sedative",

    searchKeywords: ["midazolam", "versed", "dormicum", "ميدازولام", "تهدئة"],

    indications: [
      {
        id: "sedation",
        title: "التهدئة الوريدية",
        route: "وريدي IV",
        doseConfig: {
          doseType: "mg/kg",
          doseMin: 0.01,
          doseMax: 0.05,
          unitLabel: "mg/kg"
        }
      }
    ],

    concentrationConfig: {
      defaultUnit: "mg/mL",
      availableConcentrations: [
        { value: 1, label: "1 mg/mL", isDefault: true },
        { value: 5, label: "5 mg/mL", isDefault: false }
      ],
      customAllowed: true,
      minCustomConcentration: 0.1,
      maxCustomConcentration: 10
    },

    pharmacokinetics: { onset: "1–3 دقائق", duration: "30–80 دقيقة" },

    safetyProfile: {
      isHighAlert: true,
      safetyNotes: "قد يسبب تثبيط التنفس، ويزداد الخطر عند مشاركته مع الأفيونيات."
    },

    clinicalDetails: {
      administration: "يُعطى ببطء مع معايرة الجرعة للوصول للتهدئة المطلوبة.",
      warnings: ["تثبيط التنفس", "انخفاض ضغط الدم"],
      contraindications: ["فرط الحساسية للبنزوديازيبينات"],
      reversal: "يُعكس بـ Flumazenil."
    },

    dilutions: [{ instructions: "يمكن تخفيفه بمحاليل وريدية متوافقة." }],

    references: [{ source: "Miller's Anesthesia", topic: "Benzodiazepines" }]
  },

  // ==========================================================
  // 11. EPINEPHRINE / ADRENALINE (Added mcg/min Infusion Support)
  // ==========================================================
  {
    id: "epinephrine",
    name: "Epinephrine",
    arabicName: "إبينفرين / أدرينالين",
    category: "Vasopressor",

    searchKeywords: ["epinephrine", "adrenaline", "أدرينالين", "إبينفرين", "التأق"],

    indications: [
      {
        id: "anaphylaxis",
        title: "التأق / الحساسية المفرطة",
        route: "عضلي IM",
        doseConfig: {
          doseType: "fixed_mg",
          fixedDoseValue: 0.5,
          doseMin: 0.3,
          doseMax: 0.5,
          unitLabel: "mg"
        }
      },
      {
        id: "cardiac_arrest",
        title: "توقف القلب عند البالغين (ACLS)",
        route: "وريدي IV",
        doseConfig: {
          doseType: "fixed_mg",
          fixedDoseValue: 1,
          doseMin: 1,
          doseMax: 1,
          unitLabel: "mg"
        }
      },
      {
        id: "hypotension_infusion",
        title: "تسريب مقبض وعائي (Infusion)",
        route: "تسريب وريدي IV Infusion",
        doseConfig: {
          doseType: "mcg/kg/min",
          doseMin: 0.01,
          doseMax: 0.5,
          unitLabel: "mcg/kg/min"
        }
      }
    ],

    concentrationConfig: {
      defaultUnit: "mg/mL",
      availableConcentrations: [
        { value: 1, label: "1 mg/mL (1:1000)", isDefault: true },
        { value: 0.1, label: "0.1 mg/mL (1:10,000)", isDefault: false }
      ],
      customAllowed: true,
      minCustomConcentration: 0.001,
      maxCustomConcentration: 1
    },

    pharmacokinetics: { onset: "سريع", duration: "5–10 دقائق IV" },

    safetyProfile: {
      isHighAlert: true,
      safetyNotes: "دواء عالي الخطورة. تختلف التراكيز وطرق الإعطاء حسب الاستطباب (IM للتأق، IV سريح للإعاش، وInfusion للضغط)."
    },

    clinicalDetails: {
      administration: "في التأق يُعطى عضلياً بالفخذ، وفي توقف القلب يُعطى وريدياً كل 3-5 دقائق.",
      warnings: ["اضطرابات النظم", "ارتفاع ضغط الدم الشديد"],
      contraindications: ["لا يوجد مانع مطلق في التأق أو توقف القلب المهدد للحياة."],
      reversal: "لا يوجد مضاد نوعي."
    },

    dilutions: [{ instructions: "تحقق دائماً من تركيز الأمبول (1:1000 أم 1:10,000) قبل الإعطاء." }],

    references: [{ source: "AHA ACLS Guidelines", topic: "Adult Cardiac Arrest" }]
  },

  // ==========================================================
  // 12. DEXAMETHASONE (Corrected Category)
  // ==========================================================
  {
    id: "dexamethasone",
    name: "Dexamethasone",
    arabicName: "ديكساميثازون",
    category: "Antiemetic", // Corrected from Induction

    searchKeywords: ["dexamethasone", "decadron", "ديكساميثازون", "PONV", "مضاد قيء"],

    indications: [
      {
        id: "ponv",
        title: "الوقاية من الغثيان والقيء بعد العملية (PONV)",
        route: "وريدي IV",
        doseConfig: {
          doseType: "fixed_mg",
          fixedDoseValue: 4,
          doseMin: 4,
          doseMax: 8,
          unitLabel: "mg"
        }
      },
      {
        id: "airway_edema",
        title: "وذمة مجرى الهواء / مضاد التهاب",
        route: "وريدي IV",
        doseConfig: {
          doseType: "fixed_mg",
          fixedDoseValue: 8,
          doseMin: 4,
          doseMax: 10,
          unitLabel: "mg"
        }
      }
    ],

    concentrationConfig: {
      defaultUnit: "mg/mL",
      availableConcentrations: [
        { value: 4, label: "4 mg/mL", isDefault: true },
        { value: 10, label: "10 mg/mL", isDefault: false }
      ],
      customAllowed: true,
      minCustomConcentration: 0.1,
      maxCustomConcentration: 40
    },

    pharmacokinetics: { onset: "خلال ساعات", duration: "عدة ساعات" },

    safetyProfile: {
      isHighAlert: false,
      safetyNotes: "قد يسبب ارتفاع سكر الدم المؤقت لدى مرضى السكري."
    },

    clinicalDetails: {
      administration: "يُعطى وريدياً عند تحريض التخدير لتدبير PONV.",
      warnings: ["ارتفاع سكر الدم"],
      contraindications: ["فرط الحساسية المعروف للديكساميثازون"],
      reversal: "لا يوجد مضاد نوعي."
    },

    dilutions: [{ instructions: "يُعطى بشكل مباشر أو مخفف بمحلول وريدي." }],

    references: [{ source: "Miller's Anesthesia", topic: "PONV Guidelines" }]
  }

];
