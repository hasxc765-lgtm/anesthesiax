// ============================================================
// AnesthesiaX - Drug Center
// Version: 2.5
// Compatible with:
//   - js/app.js
//   - js/calculators/doseCalculator.js
//
// IMPORTANT:
// مرجع تعليمي وسريري فقط.
// يجب دائماً التحقق من البروتوكول المحلي،
// حالة المريض، تركيز الدواء المتوفر ومتطلبات المراقبة.
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

    searchKeywords: [
      "propofol",
      "diprivan",
      "بروبوفول",
      "تحريض",
      "induction"
    ],

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
        {
          value: 10,
          label: "10 mg/mL",
          isDefault: true
        },
        {
          value: 20,
          label: "20 mg/mL",
          isDefault: false
        }
      ],
      customAllowed: true,
      minCustomConcentration: 1,
      maxCustomConcentration: 20
    },

    pharmacokinetics: {
      onset: "30–60 ثانية",
      duration: "5–10 دقائق"
    },

    safetyProfile: {
      isHighAlert: true,
      safetyNotes:
        "قد يسبب انخفاض ضغط الدم وتثبيط التنفس، خاصة عند إعطائه بسرعة أو عند استخدامه مع أدوية مهدئة أخرى."
    },

    clinicalDetails: {
      administration:
        "يُعطى عن طريق الوريد ببطء مع معايرة الجرعة وفق الاستجابة السريرية.",
      warnings: [
        "انخفاض ضغط الدم",
        "تثبيط التنفس",
        "انقطاع التنفس",
        "ألم أثناء الحقن"
      ],
      contraindications: [
        "فرط الحساسية المعروف للبروبوفول أو لأحد مكونات المستحضر"
      ],
      reversal:
        "لا يوجد مضاد نوعي؛ يجب توفير دعم مجرى الهواء والدعم التنفسي والقلبـي الوعائي عند الحاجة."
    },

    dilutions: [
      {
        instructions:
          "يُستخدم حسب تركيبة المستحضر والبروتوكول المحلي. تجنب التخفيف غير الضروري إلا عند وجود استطباب واضح."
      }
    ],

    references: [
      {
        source: "Miller's Anesthesia",
        topic: "Intravenous Anesthetic Drugs"
      },
      {
        source: "Morgan & Mikhail's Clinical Anesthesiology",
        topic: "Propofol"
      }
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

    searchKeywords: [
      "ketamine",
      "ketalar",
      "كيتامين",
      "تحريض",
      "تسكين",
      "induction",
      "analgesia"
    ],

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
        {
          value: 10,
          label: "10 mg/mL",
          isDefault: false
        },
        {
          value: 50,
          label: "50 mg/mL",
          isDefault: true
        },
        {
          value: 100,
          label: "100 mg/mL",
          isDefault: false
        }
      ],
      customAllowed: true,
      minCustomConcentration: 1,
      maxCustomConcentration: 500
    },

    pharmacokinetics: {
      onset: "30–60 ثانية IV",
      duration: "10–20 دقيقة"
    },

    safetyProfile: {
      isHighAlert: true,
      safetyNotes:
        "قد يسبب ارتفاع ضغط الدم ومعدل القلب وزيادة الإفرازات، وقد يسبب أحياناً ظواهر الاستيقاظ غير المريحة."
    },

    clinicalDetails: {
      administration:
        "يُعطى وريدياً ببطء مع معايرة الجرعة وفق الاستجابة السريرية.",
      warnings: [
        "ارتفاع ضغط الدم",
        "تسرع القلب",
        "زيادة الإفرازات",
        "تفاعلات الاستيقاظ"
      ],
      contraindications: [
        "فرط الحساسية المعروف",
        "الحالات التي يكون فيها ارتفاع ضغط الدم أمراً خطيراً"
      ],
      reversal:
        "لا يوجد مضاد نوعي؛ يجب توفير الدعم المناسب لمجرى الهواء والجهازين التنفسي والقلبـي الوعائي."
    },

    dilutions: [
      {
        instructions:
          "يعتمد التخفيف على تركيز المستحضر وطريقة الاستخدام المقصودة؛ يجب اتباع البروتوكول المحلي."
      }
    ],

    references: [
      {
        source: "Miller's Anesthesia",
        topic: "Ketamine"
      },
      {
        source: "Morgan & Mikhail's Clinical Anesthesiology",
        topic: "Intravenous Anesthetics"
      }
    ]
  },


  // ==========================================================
  // 3. ROCURONIUM
  // ==========================================================
  {
    id: "rocuronium",
    name: "Rocuronium",
    arabicName: "روكورونيوم",
    category: "Muscle Relaxant",

    searchKeywords: [
      "rocuronium",
      "esmeron",
      "zemuron",
      "روكورونيوم",
      "مرخي عضلات",
      "NMB",
      "RSI",
      "intubation"
    ],

    indications: [
      {
        id: "intubation",
        title: "التنبيب الرغامي",
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
        title: "التنبيب بالتسلسل السريع RSI",
        route: "وريدي IV",
        doseConfig: {
          doseType: "mg/kg",
          doseMin: 0.6,
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
      availableConcentrations: [
        {
          value: 10,
          label: "10 mg/mL",
          isDefault: true
        }
      ],
      customAllowed: true,
      minCustomConcentration: 1,
      maxCustomConcentration: 20
    },

    pharmacokinetics: {
      onset: "60–90 ثانية",
      duration: "30–45 دقيقة"
    },

    safetyProfile: {
      isHighAlert: true,
      safetyNotes:
        "مرخٍ للعضلات. يسبب شللاً في العضلات الهيكلية بما فيها عضلات التنفس. يجب توفر وسائل تأمين مجرى الهواء والتهوية والمراقبة المناسبة فوراً."
    },

    clinicalDetails: {
      administration:
        "يُعطى وريدياً فقط. يجب استخدامه مع تأمين مناسب لمجرى الهواء والتهوية والمراقبة العصبية العضلية.",
      warnings: [
        "شلل كامل لعضلات التنفس",
        "تفاعلات الحساسية المفرطة",
        "إطالة مدة التأثير لدى بعض المرضى",
        "ضرورة المراقبة العصبية العضلية"
      ],
      contraindications: [
        "فرط الحساسية المعروف للروكورونيوم أو لمرخيات العضلات الأخرى"
      ],
      reversal:
        "يمكن استخدام Sugammadex أو Neostigmine مع مضاد مسكاريني مناسب عندما يكون ذلك ملائماً سريرياً."
    },

    dilutions: [
      {
        instructions:
          "يمكن تخفيفه بمحاليل وريدية متوافقة مثل محلول كلوريد الصوديوم 0.9% وفق تعليمات المستحضر والبروتوكول المحلي."
      }
    ],

    references: [
      {
        source: "FDA Prescribing Information",
        topic: "Rocuronium Bromide Injection"
      },
      {
        source: "Miller's Anesthesia",
        topic: "Neuromuscular Blocking Drugs"
      },
      {
        source: "Morgan & Mikhail's Clinical Anesthesiology",
        topic: "Neuromuscular Blockade"
      }
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

    searchKeywords: [
      "fentanyl",
      "sublimaze",
      "فنتانيل",
      "أفيوني",
      "تسكين",
      "opioid",
      "analgesia"
    ],

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
        title: "تقنية الأفيونات بجرعات أعلى",
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
      availableConcentrations: [
        {
          value: 50,
          label: "50 mcg/mL",
          isDefault: true
        }
      ],
      customAllowed: true,
      minCustomConcentration: 1,
      maxCustomConcentration: 1000
    },

    pharmacokinetics: {
      onset: "1–2 دقيقة IV",
      duration: "30–60 دقيقة"
    },

    safetyProfile: {
      isHighAlert: true,
      safetyNotes:
        "أفيون قوي. قد يسبب تثبيط التنفس وتيبس جدار الصدر عند الجرعات العالية أو الإعطاء السريع وبطء القلب وانخفاض ضغط الدم."
    },

    clinicalDetails: {
      administration:
        "يُعطى وريدياً ببطء مع معايرة الجرعة وفق الاستجابة المسكنة والتنفسية.",
      warnings: [
        "تثبيط التنفس",
        "بطء القلب",
        "انخفاض ضغط الدم",
        "تيبس جدار الصدر عند الإعطاء السريع"
      ],
      contraindications: [
        "فرط الحساسية المعروف",
        "تثبيط تنفسي شديد دون مراقبة مناسبة"
      ],
      reversal:
        "يمكن استخدام Naloxone لعلاج تثبيط التنفس المهم الناتج عن الأفيونات."
    },

    dilutions: [
      {
        instructions:
          "يمكن تخفيفه بمحاليل وريدية متوافقة وفق البروتوكول المحلي."
      }
    ],

    references: [
      {
        source: "Miller's Anesthesia",
        topic: "Opioid Analgesics"
      },
      {
        source: "Morgan & Mikhail's Clinical Anesthesiology",
        topic: "Opioids"
      }
    ]
  },


  // ==========================================================
  // 5. ATROPINE
  // ==========================================================
  {
    id: "atropine",
    name: "Atropine",
    arabicName: "أتروبين",
    category: "Vasopressor",

    searchKeywords: [
      "atropine",
      "atropine sulfate",
      "أتروبين",
      "بطء القلب",
      "مضاد كولين",
      "bradycardia",
      "anticholinergic"
    ],

    indications: [
      {
        id: "bradycardia",
        title: "بطء القلب العرضي",
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
        id: "neostigmine",
        title: "مع عكس تأثير النيوستغمين",
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
        {
          value: 1,
          label: "1 mg/mL",
          isDefault: true
        },
        {
          value: 0.5,
          label: "0.5 mg/mL",
          isDefault: false
        },
        {
          value: 0.6,
          label: "0.6 mg/mL",
          isDefault: false
        }
      ],
      customAllowed: true,
      minCustomConcentration: 0.1,
      maxCustomConcentration: 10
    },

    pharmacokinetics: {
      onset: "1–2 دقيقة IV",
      duration: "2–4 ساعات"
    },

    safetyProfile: {
      isHighAlert: true,
      safetyNotes:
        "قد يسبب تسرع القلب وجفاف الفم واحتباس البول وتوسع الحدقة وتأثيرات مضادة للكولين."
    },

    clinicalDetails: {
      administration:
        "في حالة بطء القلب العرضي، يُعطى وريدياً وفق إرشادات الإنعاش الحالية وتُكرر الجرعة حسب الاستجابة السريرية.",
      warnings: [
        "تسرع القلب",
        "تأثيرات مضادة للكولين",
        "احتباس البول",
        "توسع الحدقة"
      ],
      contraindications: [
        "فرط الحساسية المعروف",
        "يُستخدم بحذر في الحالات التي قد تكون فيها التأثيرات المضادة للكولين خطرة"
      ],
      reversal:
        "لا يوجد عكس نوعي روتيني؛ تُعالج سمية مضادات الكولين وفق البروتوكول السريري."
    },

    dilutions: [
      {
        instructions:
          "يُستخدم التركيز المتوفر وفق الاستطباب والبروتوكول المحلي."
      }
    ],

    references: [
      {
        source: "AHA ACLS Guidelines",
        topic: "Adult Bradycardia"
      },
      {
        source: "Morgan & Mikhail's Clinical Anesthesiology",
        topic: "Anticholinergic Drugs"
      }
    ]
  },


  // ==========================================================
  // 6. ATRACURIUM
  // ==========================================================
  {
    id: "atracurium",
    name: "Atracurium",
    arabicName: "أتراكوريوم",
    category: "Muscle Relaxant",

    searchKeywords: [
      "atracurium",
      "tracrium",
      "أتراكوريوم",
      "مرخي عضلات",
      "NMB",
      "muscle relaxant"
    ],

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
      availableConcentrations: [
        {
          value: 10,
          label: "10 mg/mL",
          isDefault: true
        }
      ],
      customAllowed: true,
      minCustomConcentration: 1,
      maxCustomConcentration: 20
    },

    pharmacokinetics: {
      onset: "2–3 دقائق",
      duration: "20–35 دقيقة"
    },

    safetyProfile: {
      isHighAlert: true,
      safetyNotes:
        "قد يسبب إطلاق الهيستامين مع احمرار وانخفاض ضغط الدم أو تشنج قصبي، خاصة عند الإعطاء السريع."
    },

    clinicalDetails: {
      administration:
        "يُعطى وريدياً. قد يساعد الإعطاء البطيء على تقليل التأثيرات القلبية الوعائية المرتبطة بإطلاق الهيستامين.",
      warnings: [
        "شلل عضلات التنفس",
        "إطلاق الهيستامين",
        "انخفاض ضغط الدم",
        "تشنج قصبي"
      ],
      contraindications: [
        "فرط الحساسية المعروف للأتراكوريوم"
      ],
      reversal:
        "يمكن استخدام Neostigmine مع مضاد مسكاريني مناسب عند وجود استطباب سريري."
    },

    dilutions: [
      {
        instructions:
          "يمكن إعطاؤه وريدياً وفق تعليمات المستحضر والبروتوكول المحلي."
      }
    ],

    references: [
      {
        source: "FDA Prescribing Information",
        topic: "Atracurium Besylate"
      },
      {
        source: "Miller's Anesthesia",
        topic: "Neuromuscular Blocking Drugs"
      }
    ]
  },


  // ==========================================================
  // 7. SUCCINYLCHOLINE
  // ==========================================================
  {
    id: "succinylcholine",
    name: "Succinylcholine",
    arabicName: "سكسينيل كولين",
    category: "Muscle Relaxant",

    searchKeywords: [
      "succinylcholine",
      "suxamethonium",
      "sux",
      "سكسينيل كولين",
      "RSI",
      "مرخي مزيل للاستقطاب",
      "depolarizing"
    ],

    indications: [
      {
        id: "intubation",
        title: "التنبيب الرغامي / التنبيب بالتسلسل السريع",
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
        {
          value: 20,
          label: "20 mg/mL",
          isDefault: true
        },
        {
          value: 50,
          label: "50 mg/mL",
          isDefault: false
        }
      ],
      customAllowed: true,
      minCustomConcentration: 1,
      maxCustomConcentration: 100
    },

    pharmacokinetics: {
      onset: "30–60 ثانية",
      duration: "5–10 دقائق"
    },

    safetyProfile: {
      isHighAlert: true,
      safetyNotes:
        "مرخٍ سريع المفعول ومزيل للاستقطاب. من أهم المخاطر فرط بوتاسيوم الدم وفرط الحرارة الخبيث واضطرابات النظم وبطء القلب."
    },

    clinicalDetails: {
      administration:
        "يُعطى وريدياً بواسطة مختصين مستعدين لتأمين مجرى الهواء وتوفير التهوية الميكانيكية.",
      warnings: [
        "فرط بوتاسيوم الدم",
        "فرط الحرارة الخبيث",
        "بطء القلب",
        "انقطاع التنفس المطول",
        "تشنج عضلة الفك"
      ],
      contraindications: [
        "القابلية المعروفة للإصابة بفرط الحرارة الخبيث",
        "وجود خطر مهم معروف لفرط بوتاسيوم الدم",
        "بعض الاضطرابات العصبية العضلية",
        "فرط الحساسية المعروف"
      ],
      reversal:
        "لا يوجد مضاد عكسي مباشر. يجب توفير دعم مجرى الهواء والتهوية حتى عودة الوظيفة العضلية تلقائياً."
    },

    dilutions: [
      {
        instructions:
          "يُستخدم وفق تركيبة المستحضر والبروتوكول المحلي."
      }
    ],

    references: [
      {
        source: "Miller's Anesthesia",
        topic: "Depolarizing Neuromuscular Blockade"
      },
      {
        source: "Morgan & Mikhail's Clinical Anesthesiology",
        topic: "Succinylcholine"
      }
    ]
  },


  // ==========================================================
  // 8. EPHEDRINE
  // ==========================================================
  {
    id: "ephedrine",
    name: "Ephedrine",
    arabicName: "إيفيدرين",
    category: "Vasopressor",

    searchKeywords: [
      "ephedrine",
      "إيفيدرين",
      "انخفاض ضغط الدم",
      "مقبض وعائي",
      "hypotension",
      "vasopressor"
    ],

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
        {
          value: 5,
          label: "5 mg/mL",
          isDefault: true
        },
        {
          value: 30,
          label: "30 mg/mL",
          isDefault: false
        },
        {
          value: 50,
          label: "50 mg/mL",
          isDefault: false
        }
      ],
      customAllowed: true,
      minCustomConcentration: 0.1,
      maxCustomConcentration: 100
    },

    pharmacokinetics: {
      onset: "1–2 دقيقة IV",
      duration: "10–60 دقيقة"
    },

    safetyProfile: {
      isHighAlert: true,
      safetyNotes:
        "دواء محاكي للجهاز الودي. قد يسبب تسرع القلب وارتفاع ضغط الدم واضطرابات نظم القلب."
    },

    clinicalDetails: {
      administration:
        "تُعطى الجرعة الوريدية تدريجياً وفق ضغط الدم ومعدل القلب والاستجابة السريرية.",
      warnings: [
        "تسرع القلب",
        "ارتفاع ضغط الدم",
        "اضطرابات نظم القلب",
        "انخفاض الاستجابة مع تكرار الجرعات"
      ],
      contraindications: [
        "فرط الحساسية المعروف",
        "يُستخدم بحذر في أمراض القلب والأوعية الدموية المهمة"
      ],
      reversal:
        "لا يوجد مضاد نوعي؛ تُعالج التأثيرات المفرطة للدواء بشكل داعم وفق البروتوكول السريري."
    },

    dilutions: [
      {
        instructions:
          "يجب التحقق من تركيز الأمبول وتخفيفه إلى تركيز عملي واضح ومُعنون قبل الإعطاء الوريدي."
      }
    ],

    references: [
      {
        source: "Miller's Anesthesia",
        topic: "Vasopressors"
      },
      {
        source: "Morgan & Mikhail's Clinical Anesthesiology",
        topic: "Hemodynamic Drugs"
      }
    ]
  },


  // ==========================================================
  // 9. NEOSTIGMINE
  // ==========================================================
  {
    id: "neostigmine",
    name: "Neostigmine",
    arabicName: "نيوستغمين",
    category: "Muscle Relaxant",

    searchKeywords: [
      "neostigmine",
      "prostigmin",
      "نيوستغمين",
      "عكس المرخيات",
      "عكس الحصر العصبي العضلي",
      "reversal",
      "NMB reversal"
    ],

    indications: [
      {
        id: "reversal",
        title: "عكس الحصر العصبي العضلي غير مزيل الاستقطاب",
        route: "وريدي IV",
        doseConfig: {
          doseType: "mg/kg",
          doseMin: 0.03,
          doseMax: 0.07,
          maxDoseLimit: 5,
          unitLabel: "mg/kg"
        }
      }
    ],

    concentrationConfig: {
      defaultUnit: "mg/mL",
      availableConcentrations: [
        {
          value: 0.5,
          label: "0.5 mg/mL",
          isDefault: true
        },
        {
          value: 2.5,
          label: "2.5 mg/mL",
          isDefault: false
        }
      ],
      customAllowed: true,
      minCustomConcentration: 0.1,
      maxCustomConcentration: 5
    },

    pharmacokinetics: {
      onset: "3–10 دقائق",
      duration: "40–60 دقيقة"
    },

    safetyProfile: {
      isHighAlert: true,
      safetyNotes:
        "يجب إعطاؤه فقط عند وجود عودة مناسبة سريرياً من الحصر العصبي العضلي ومع استخدام مضاد مسكاريني مناسب."
    },

    clinicalDetails: {
      administration:
        "يُعطى وريدياً. تُحدد الجرعة وفق درجة الحصر العصبي العضلي والسياق السريري.",
      warnings: [
        "بطء القلب",
        "تشنج قصبي",
        "زيادة الإفرازات",
        "تأثيرات كولينية"
      ],
      contraindications: [
        "فرط الحساسية المعروف",
        "الانسداد الميكانيكي للأمعاء",
        "الانسداد الميكانيكي للمسالك البولية"
      ],
      reversal:
        "النيوستغمين نفسه دواء لعكس الحصر العصبي العضلي؛ ويُعطى مع مضاد مسكاريني مناسب مثل الأتروبين أو الغليكوبيرولات."
    },

    dilutions: [
      {
        instructions:
          "يُخفف أو يُعطى وفق التركيز المتوفر وبحسب بروتوكول عكس الحصر العصبي العضلي المحلي."
      }
    ],

    references: [
      {
        source: "FDA / DailyMed",
        topic: "Neostigmine Methylsulfate"
      },
      {
        source: "Miller's Anesthesia",
        topic: "Reversal of Neuromuscular Block"
      }
    ]
  },


  // ==========================================================
  // 10. MIDAZOLAM
  // ==========================================================
  {
    id: "midazolam",
    name: "Midazolam",
    arabicName: "ميدازولام",
    category: "Induction",

    searchKeywords: [
      "midazolam",
      "versed",
      "dormicum",
      "ميدازولام",
      "بنزوديازيبين",
      "تهدئة",
      "benzodiazepine",
      "sedation"
    ],

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
      },
      {
        id: "premedication",
        title: "التهدئة قبل العملية",
        route: "وريدي IV",
        doseConfig: {
          doseType: "mg/kg",
          doseMin: 0.02,
          doseMax: 0.05,
          unitLabel: "mg/kg"
        }
      }
    ],

    concentrationConfig: {
      defaultUnit: "mg/mL",
      availableConcentrations: [
        {
          value: 1,
          label: "1 mg/mL",
          isDefault: true
        },
        {
          value: 5,
          label: "5 mg/mL",
          isDefault: false
        }
      ],
      customAllowed: true,
      minCustomConcentration: 0.1,
      maxCustomConcentration: 10
    },

    pharmacokinetics: {
      onset: "1–3 دقائق",
      duration: "30–80 دقيقة"
    },

    safetyProfile: {
      isHighAlert: true,
      safetyNotes:
        "قد يسبب تثبيط التنفس وانقطاعه وانخفاض ضغط الدم. يزداد الخطر عند استخدامه مع الأفيونات ومثبطات الجهاز العصبي المركزي الأخرى."
    },

    clinicalDetails: {
      administration:
        "يُعطى ببطء مع معايرة الجرعة للوصول إلى مستوى التهدئة المطلوب، مع ضرورة المراقبة المستمرة للحالة التنفسية والقلبية الوعائية.",
      warnings: [
        "تثبيط التنفس",
        "انقطاع التنفس",
        "انخفاض ضغط الدم",
        "زيادة التأثير عند استخدامه مع الأفيونات"
      ],
      contraindications: [
        "فرط الحساسية المعروف للبنزوديازيبينات",
        "الزرق الحاد ضيق الزاوية"
      ],
      reversal:
        "يمكن استخدام Flumazenil لعكس تأثير البنزوديازيبينات في حالات مختارة، مع مراعاة احتمال عودة التهدئة وخطر الاختلاجات."
    },

    dilutions: [
      {
        instructions:
          "يمكن تخفيفه بمحاليل وريدية متوافقة وفق تعليمات المستحضر والبروتوكول المحلي."
      }
    ],

    references: [
      {
        source: "FDA Prescribing Information",
        topic: "Midazolam Injection"
      },
      {
        source: "Miller's Anesthesia",
        topic: "Benzodiazepines"
      }
    ]
  },


  // ==========================================================
  // 11. EPINEPHRINE / ADRENALINE
  // ==========================================================
  {
    id: "epinephrine",
    name: "Epinephrine",
    arabicName: "إبينفرين / أدرينالين",
    category: "Vasopressor",

    searchKeywords: [
      "epinephrine",
      "adrenaline",
      "epi",
      "أدرينالين",
      "إبينفرين",
      "التأق",
      "توقف القلب",
      "مقبض وعائي",
      "anaphylaxis",
      "cardiac arrest",
      "vasopressor"
    ],

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
        title: "توقف القلب عند البالغين",
        route: "وريدي / داخل العظم IV / IO",
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
        title: "ضخ مقبض وعائي",
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
        {
          value: 1,
          label: "1 mg/mL (1:1000)",
          isDefault: true
        },
        {
          value: 0.1,
          label: "0.1 mg/mL (1:10,000)",
          isDefault: false
        }
      ],
      customAllowed: true,
      minCustomConcentration: 0.001,
      maxCustomConcentration: 1
    },

    pharmacokinetics: {
      onset: "سريع",
      duration: "5–10 دقائق IV"
    },

    safetyProfile: {
      isHighAlert: true,
      safetyNotes:
        "دواء عالي الخطورة. تختلف تراكيز الإبينفرين وطرق إعطائه حسب الاستطباب. يجب دائماً التحقق من التركيز والطريق والاستطباب قبل الإعطاء."
    },

    clinicalDetails: {
      administration:
        "يعتمد الطريق والتركيز على الاستطباب. في حالات التأق، يُعطى عضلياً في الجانب الأمامي الوحشي من الفخذ. أما في توقف القلب فتُتبع إرشادات الإنعاش الحالية.",
      warnings: [
        "اضطرابات نظم القلب",
        "ارتفاع شديد في ضغط الدم",
        "نقص تروية عضلة القلب",
        "أخطاء التركيز الدوائي",
        "خطر مرتفع لأخطاء الجرعات"
      ],
      contraindications: [
        "لا يوجد مانع استعمال مطلق في التأق المهدد للحياة أو توقف القلب؛ يجب استخدامه وفق الاستطباب والطريق المناسبين."
      ],
      reversal:
        "لا يوجد مضاد نوعي. تُعالج التأثيرات القلبية الوعائية المفرطة بشكل داعم وفق البروتوكول السريري."
    },

    dilutions: [
      {
        instructions:
          "عند الإعطاء الوريدي، يجب استخدام تركيز معروف ومُحضّر ومُعنون بشكل واضح وفق البروتوكول السريري المحدد. لا تفترض أن تركيز الإعطاء العضلي في التأق قابل للاستبدال مباشرة مع تركيز الإنعاش القلبي الوريدي."
      }
    ],

    references: [
      {
        source: "AHA ACLS Guidelines",
        topic: "Adult Cardiac Arrest"
      },
      {
        source: "FDA Prescribing Information",
        topic: "Epinephrine Injection"
      },
      {
        source: "Miller's Anesthesia",
        topic: "Vasopressors and Sympathomimetics"
      }
    ]
  },


  // ==========================================================
  // 12. DEXAMETHASONE
  // ==========================================================
  {
    id: "dexamethasone",
    name: "Dexamethasone",
    arabicName: "ديكساميثازون",
    category: "Induction",

    searchKeywords: [
      "dexamethasone",
      "decadron",
      "ديكساميثازون",
      "الغثيان والقيء بعد العملية",
      "مضاد للقيء",
      "PONV",
      "antiemetic"
    ],

    indications: [
      {
        id: "ponv",
        title: "الوقاية من الغثيان والقيء بعد العملية",
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
        title: "وذمة مجرى الهواء / الاستخدام المضاد للالتهاب",
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
        {
          value: 4,
          label: "4 mg/mL",
          isDefault: true
        },
        {
          value: 10,
          label: "10 mg/mL",
          isDefault: false
        }
      ],
      customAllowed: true,
      minCustomConcentration: 0.1,
      maxCustomConcentration: 40
    },

    pharmacokinetics: {
      onset: "خلال ساعات",
      duration: "عدة ساعات"
    },

    safetyProfile: {
      isHighAlert: false,
      safetyNotes:
        "يجب مراعاة احتمال ارتفاع سكر الدم وخطر العدوى والتأثيرات الأخرى المرتبطة بالكورتيكوستيرويدات حسب الجرعة وحالة المريض."
    },

    clinicalDetails: {
      administration:
        "يُعطى وريدياً أو بطريق مناسب آخر حسب الاستطباب والبروتوكول المحلي.",
      warnings: [
        "ارتفاع سكر الدم",
        "احتمال زيادة خطر العدوى",
        "تأثيرات على الجهاز الهضمي",
        "آثار مرتبطة بالكورتيكوستيرويدات عند الاستخدام المتكرر"
      ],
      contraindications: [
        "فرط الحساسية المعروف للديكساميثازون أو لأحد مكونات المستحضر"
      ],
      reversal:
        "لا يوجد مضاد نوعي."
    },

    dilutions: [
      {
        instructions:
          "يُستخدم محلول وريدي متوافق عند الحاجة إلى التخفيف وفق تعليمات المستحضر والبروتوكول المحلي."
      }
    ],

    references: [
      {
        source: "Miller's Anesthesia",
        topic: "Postoperative Nausea and Vomiting"
      },
      {
        source: "Morgan & Mikhail's Clinical Anesthesiology",
        topic: "Antiemetic Therapy"
      }
    ]
  }

];
