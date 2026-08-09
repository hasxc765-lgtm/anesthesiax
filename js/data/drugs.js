export const drugsData = [
  {
    id: "propofol",
    name: "Propofol",
    arabicName: "بروبوفول",
    category: "Induction",
    searchKeywords: ["propofol", "بروبوفول", "diprivan"],
    safetyProfile: {
      isHighAlert: true,
      alertLevel: "WARNING",
      safetyNotes: "عالي الخطورة (ISMP). يُعطى فقط مع توفر وسائل تأمين مجرى الهواء والتهوية.",
      blackBoxWarning: null
    },
    indications: [
      {
        id: "ind_propofol_gen",
        title: "Induction of General Anesthesia",
        patientGroup: "Adult",
        route: "IV",
        doseConfig: {
          doseType: "mg/kg",
          doseMin: 1.5,
          doseMax: 2.5,
          fixedDoseValue: null,
          unitLabel: "mg/kg",
          maxDoseLimit: null,
          maxDoseUnit: "mg"
        },
        reference: "FDA Access Data - Diprivan Label"
      }
    ],
    concentrationConfig: {
      defaultUnit: "mg/mL",
      customAllowed: true,
      minCustomConcentration: 2.0,
      maxCustomConcentration: 20.0,
      availableConcentrations: [
        { id: "c1", value: 10, unit: "mg/mL", label: "10 mg/mL (1%)", isDefault: true },
        { id: "c2", value: 20, unit: "mg/mL", label: "20 mg/mL (2%)", isDefault: false }
      ]
    },
    dilutions: [
      {
        id: "dil_propofol_d5w",
        indicationRef: "ind_propofol_gen",
        sourceConcentration: 10,
        sourceUnit: "mg/mL",
        diluent: "D5W",
        resultingConcentration: 2,
        resultingUnit: "mg/mL",
        instructions: "يمكن تخفيفه بـ D5W بتركيز لا يقل عن 2 mg/mL.",
        reference: "FDA Access Data"
      }
    ],
    pharmacokinetics: {
      onset: "30-40 sec",
      duration: "4-8 min"
    },
    clinicalDetails: {
      administration: "حقن وريدي بطيء عبر وريد كبير.",
      warnings: ["قد يسبب هبوطاً حاداً في ضغط الدم (Hypotension) وتثبيط التنفس."],
      contraindications: ["حساسية مؤكدة للبيض أو الصويا أو البروبوفول."],
      reversal: "لا يوجد مضاد مباشر؛ العلاج تدعيمي."
    },
    references: [
      { topic: "FDA Label", source: "FDA Access Data (Diprivan)", citation: "Prescribing Information" }
    ]
  },
  {
    id: "ketamine",
    name: "Ketamine",
    arabicName: "كيتامين",
    category: "Induction",
    searchKeywords: ["ketamine", "كيتامين"],
    safetyProfile: {
      isHighAlert: true,
      alertLevel: "WARNING",
      safetyNotes: "عالي الخطورة (ISMP). قد يسبب هلوسة واضطرابات عند الإفاقة.",
      blackBoxWarning: null
    },
    indications: [
      {
        id: "ind_ketamine_gen",
        title: "Induction of General Anesthesia",
        patientGroup: "Adult",
        route: "IV",
        doseConfig: {
          doseType: "mg/kg",
          doseMin: 1.0,
          doseMax: 2.0,
          fixedDoseValue: null,
          unitLabel: "mg/kg",
          maxDoseLimit: null,
          maxDoseUnit: "mg"
        },
        reference: "Clinical Reference"
      }
    ],
    concentrationConfig: {
      defaultUnit: "mg/mL",
      customAllowed: true,
      minCustomConcentration: 10.0,
      maxCustomConcentration: 100.0,
      availableConcentrations: [
        { id: "c1", value: 50, unit: "mg/mL", label: "50 mg/mL", isDefault: true }
      ]
    },
    dilutions: [],
    pharmacokinetics: {
      onset: "30-60 sec",
      duration: "10-20 min"
    },
    clinicalDetails: {
      administration: "حقن وريدي ببطء.",
      warnings: ["يحافظ على ضغط الدم والتنفس، وقد يسبب هلوسة عند الإفاقة."],
      contraindications: ["ارتفاع ضغط الدم الشديد غير المنضبط."],
      reversal: "لا يوجد مضاد مباشر."
    },
    references: [{ topic: "Dosing", source: "Clinical Guidelines", citation: "Standard Ref" }]
  },
  {
    id: "succinylcholine",
    name: "Succinylcholine (Scoline)",
    arabicName: "سكولين",
    category: "Muscle Relaxant",
    searchKeywords: ["succinylcholine", "scoline", "سكولين"],
    safetyProfile: {
      isHighAlert: true,
      alertLevel: "CRITICAL",
      safetyNotes: "⚠️ HIGH ALERT (ISMP): شلل عضلات كامل. يتطلب تهوية اصطناعية فورية.",
      blackBoxWarning: "قد يسبب ارتفاع البوتاسيوم وتوقف القلب لدى بعض الأطفال."
    },
    indications: [
      {
        id: "ind_scoline_intubation",
        title: "Endotracheal Intubation",
        patientGroup: "Adult",
        route: "IV",
        doseConfig: {
          doseType: "mg/kg",
          doseMin: 1.0,
          doseMax: 1.5,
          fixedDoseValue: null,
          unitLabel: "mg/kg",
          maxDoseLimit: null,
          maxDoseUnit: "mg"
        },
        reference: "FDA Access Data"
      }
    ],
    concentrationConfig: {
      defaultUnit: "mg/mL",
      customAllowed: true,
      minCustomConcentration: 10.0,
      maxCustomConcentration: 50.0,
      availableConcentrations: [
        { id: "c1", value: 50, unit: "mg/mL", label: "50 mg/mL", isDefault: true }
      ]
    },
    dilutions: [],
    pharmacokinetics: {
      onset: "30-60 sec",
      duration: "5-10 min"
    },
    clinicalDetails: {
      administration: "حقن وريدي سريع.",
      warnings: ["قد يسبب ارتفاع البوتاسيوم وارتفاع الحرارة الخبيث (Malignant Hyperthermia)."],
      contraindications: ["تاريخ عائلي للحرارة الخبيثة، والحروق الشديدة الحديثة."],
      reversal: "لا يوجد مضاد مباشر؛ ينتظر تفككه بالإنزيمات."
    },
    references: [{ topic: "Label", source: "FDA Access Data", citation: "Label Info" }]
  },
  {
    id: "ephedrine",
    name: "Ephedrine",
    arabicName: "إيفيدرين",
    category: "Vasopressor",
    searchKeywords: ["ephedrine", "إيفيدرين"],
    safetyProfile: {
      isHighAlert: true,
      alertLevel: "WARNING",
      safetyNotes: "رافع ضغط وعائي (ISMP). يجب مراقبة الضغط والنبض باستمرار.",
      blackBoxWarning: null
    },
    indications: [
      {
        id: "ind_ephedrine_hypotension",
        title: "Anesthesia-induced Hypotension",
        patientGroup: "Adult",
        route: "IV",
        doseConfig: {
          doseType: "fixed_mg",
          doseMin: 5,
          doseMax: 10,
          fixedDoseValue: 5,
          unitLabel: "mg (Bolus)",
          maxDoseLimit: 50,
          maxDoseUnit: "mg"
        },
        reference: "Clinical Guidelines"
      }
    ],
    concentrationConfig: {
      defaultUnit: "mg/mL",
      customAllowed: true,
      minCustomConcentration: 5.0,
      maxCustomConcentration: 50.0,
      availableConcentrations: [
        { id: "c1", value: 30, unit: "mg/mL", label: "30 mg/mL", isDefault: true }
      ]
    },
    dilutions: [],
    pharmacokinetics: {
      onset: "2-5 min",
      duration: "10-60 min"
    },
    clinicalDetails: {
      administration: "حقن وريدي بجرعات متقطعة (Bolus).",
      warnings: ["يستخدم لعلاج هبوط الضغط المصاحب للتخدير النصفي أو العام."],
      contraindications: ["تسارع دقات القلب الشديد."],
      reversal: "إيقاف الإعطاء وإعطاء مضادات البيتا عند الضرورة."
    },
    references: [{ topic: "Vasopressors", source: "Standard Anesthesia Ref", citation: "Ref" }]
  },
  {
    id: "fentanyl",
    name: "Fentanyl",
    arabicName: "فنتانيل",
    category: "Opioid",
    searchKeywords: ["fentanyl", "فنتانيل"],
    safetyProfile: {
      isHighAlert: true,
      alertLevel: "CRITICAL",
      safetyNotes: "⚠️ OPIOID HIGH ALERT (ISMP): مسكن أفيوني قوي جداً. خطر تثبيط التنفس.",
      blackBoxWarning: "خطر الإدمان وتثبيط التنفس الشديد."
    },
    indications: [
      {
        id: "ind_fentanyl_analgesia",
        title: "Surgical Analgesia",
        patientGroup: "Adult",
        route: "IV",
        doseConfig: {
          doseType: "mcg/kg",
          doseMin: 1.0,
          doseMax: 2.0,
          fixedDoseValue: null,
          unitLabel: "mcg/kg",
          maxDoseLimit: null,
          maxDoseUnit: "mcg"
        },
        reference: "Clinical Guidelines"
      }
    ],
    concentrationConfig: {
      defaultUnit: "mcg/mL",
      customAllowed: true,
      minCustomConcentration: 10.0,
      maxCustomConcentration: 100.0,
      availableConcentrations: [
        { id: "c1", value: 50, unit: "mcg/mL", label: "50 mcg/mL", isDefault: true }
      ]
    },
    dilutions: [],
    pharmacokinetics: {
      onset: "1-2 min",
      duration: "30-60 min"
    },
    clinicalDetails: {
      administration: "حقن وريدي بطيء.",
      warnings: ["قد يسبب تثبيط التنفس وتصلب الصدر عند الحقن السريع."],
      contraindications: ["تثبيط التنفس الحاد بدون جهاز تهوية."],
      reversal: "نالوكسون (Naloxone)."
    },
    references: [{ topic: "Opioids", source: "Clinical Guidelines", citation: "Ref" }]
  }
];
