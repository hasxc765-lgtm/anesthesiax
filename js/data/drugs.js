// ============================================================
// AnesthesiaX - Drug Center
// Version: 2.5
// Compatible with:
//   - js/app.js
//   - js/calculators/doseCalculator.js
//
// IMPORTANT:
// Educational / clinical reference only.
// Always verify local protocol, patient factors,
// available concentration and monitoring requirements.
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
        title: "Induction of General Anesthesia",
        route: "IV",
        doseConfig: {
          doseType: "mg/kg",
          doseMin: 1.5,
          doseMax: 2.5,
          unitLabel: "mg/kg"
        }
      },
      {
        id: "sedation",
        title: "Procedural / Sedation",
        route: "IV",
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
      onset: "30–60 sec",
      duration: "5–10 min"
    },

    safetyProfile: {
      isHighAlert: true,
      safetyNotes:
        "قد يسبب هبوط ضغط الدم وتثبيط التنفس، خاصة مع الجرعات السريعة أو عند مشاركته مع أدوية مهدئة أخرى."
    },

    clinicalDetails: {
      administration:
        "IV injection administered slowly and titrated according to clinical response.",
      warnings: [
        "Hypotension",
        "Respiratory depression",
        "Apnea",
        "Pain on injection"
      ],
      contraindications: [
        "Known hypersensitivity to propofol or formulation components"
      ],
      reversal:
        "No specific reversal agent; provide airway and cardiovascular support."
    },

    dilutions: [
      {
        instructions:
          "Use according to product formulation and local protocol. Avoid unnecessary dilution unless specifically indicated."
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
      "induction",
      "analgesia"
    ],

    indications: [
      {
        id: "induction",
        title: "Induction of General Anesthesia",
        route: "IV",
        doseConfig: {
          doseType: "mg/kg",
          doseMin: 1.0,
          doseMax: 2.0,
          unitLabel: "mg/kg"
        }
      },
      {
        id: "im",
        title: "IM Induction",
        route: "IM",
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
      onset: "30–60 sec IV",
      duration: "10–20 min"
    },

    safetyProfile: {
      isHighAlert: true,
      safetyNotes:
        "قد يسبب زيادة ضغط الدم ومعدل القلب، وزيادة الإفرازات، وأحيانًا ظواهر emergence."
    },

    clinicalDetails: {
      administration:
        "IV administration should be given slowly and titrated to clinical response.",
      warnings: [
        "Hypertension",
        "Tachycardia",
        "Increased secretions",
        "Emergence reactions"
      ],
      contraindications: [
        "Known hypersensitivity",
        "Situations where significant blood pressure elevation is hazardous"
      ],
      reversal:
        "No specific reversal agent; provide supportive airway and cardiovascular management."
    },

    dilutions: [
      {
        instructions:
          "Dilution depends on the formulation and intended administration; follow local protocol."
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
      "NMB",
      "RSI",
      "intubation"
    ],

    indications: [
      {
        id: "intubation",
        title: "Tracheal Intubation",
        route: "IV",
        doseConfig: {
          doseType: "mg/kg",
          doseMin: 0.6,
          doseMax: 0.6,
          unitLabel: "mg/kg"
        }
      },
      {
        id: "rsi",
        title: "Rapid Sequence Intubation (RSI)",
        route: "IV",
        doseConfig: {
          doseType: "mg/kg",
          doseMin: 0.6,
          doseMax: 1.2,
          unitLabel: "mg/kg"
        }
      },
      {
        id: "maintenance",
        title: "Maintenance Bolus",
        route: "IV",
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
      onset: "60–90 sec",
      duration: "30–45 min"
    },

    safetyProfile: {
      isHighAlert: true,
      safetyNotes:
        "Neuromuscular blocker. Causes skeletal muscle paralysis including respiratory muscles. Adequate airway management, ventilation and monitoring must be immediately available."
    },

    clinicalDetails: {
      administration:
        "IV administration only. Use with appropriate airway management and neuromuscular monitoring.",
      warnings: [
        "Complete respiratory muscle paralysis",
        "Anaphylaxis",
        "Prolonged effect in some patients",
        "Requires neuromuscular monitoring"
      ],
      contraindications: [
        "Known hypersensitivity to rocuronium or other neuromuscular blocking agents"
      ],
      reversal:
        "Sugammadex or neostigmine with an appropriate antimuscarinic when clinically appropriate."
    },

    dilutions: [
      {
        instructions:
          "May be diluted with compatible IV solutions such as 0.9% sodium chloride according to product and local protocol."
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
      "opioid",
      "analgesia"
    ],

    indications: [
      {
        id: "analgesia",
        title: "Perioperative Analgesia",
        route: "IV",
        doseConfig: {
          doseType: "mcg/kg",
          doseMin: 1,
          doseMax: 2,
          unitLabel: "mcg/kg"
        }
      },
      {
        id: "high_dose",
        title: "Higher-dose Opioid Technique",
        route: "IV",
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
      onset: "1–2 min IV",
      duration: "30–60 min"
    },

    safetyProfile: {
      isHighAlert: true,
      safetyNotes:
        "Potent opioid. May cause respiratory depression, chest wall rigidity with rapid/high doses, bradycardia and hypotension."
    },

    clinicalDetails: {
      administration:
        "Administer IV slowly and titrate according to analgesic and respiratory response.",
      warnings: [
        "Respiratory depression",
        "Bradycardia",
        "Hypotension",
        "Chest wall rigidity with rapid administration"
      ],
      contraindications: [
        "Known hypersensitivity",
        "Unmonitored severe respiratory depression"
      ],
      reversal:
        "Naloxone may be used for clinically significant opioid-induced respiratory depression."
    },

    dilutions: [
      {
        instructions:
          "May be diluted with compatible IV fluids according to local protocol."
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
      "bradycardia",
      "anticholinergic"
    ],

    indications: [
      {
        id: "bradycardia",
        title: "Symptomatic Bradycardia",
        route: "IV",
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
        title: "With Neostigmine Reversal",
        route: "IV",
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
      onset: "1–2 min IV",
      duration: "2–4 hours"
    },

    safetyProfile: {
      isHighAlert: true,
      safetyNotes:
        "May cause tachycardia, dry mouth, urinary retention, mydriasis and anticholinergic effects."
    },

    clinicalDetails: {
      administration:
        "For symptomatic bradycardia, administer IV according to current resuscitation guidance and repeat as clinically indicated.",
      warnings: [
        "Tachycardia",
        "Anticholinergic effects",
        "Urinary retention",
        "Mydriasis"
      ],
      contraindications: [
        "Known hypersensitivity",
        "Use cautiously in conditions where anticholinergic effects are hazardous"
      ],
      reversal:
        "No routine specific reversal; manage anticholinergic toxicity according to clinical protocol."
    },

    dilutions: [
      {
        instructions:
          "Use available concentration according to indication and local protocol."
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
      "NMB",
      "muscle relaxant"
    ],

    indications: [
      {
        id: "intubation",
        title: "Tracheal Intubation",
        route: "IV",
        doseConfig: {
          doseType: "mg/kg",
          doseMin: 0.4,
          doseMax: 0.5,
          unitLabel: "mg/kg"
        }
      },
      {
        id: "maintenance",
        title: "Maintenance",
        route: "IV",
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
      onset: "2–3 min",
      duration: "20–35 min"
    },

    safetyProfile: {
      isHighAlert: true,
      safetyNotes:
        "May cause histamine release with flushing, hypotension or bronchospasm, especially with rapid administration."
    },

    clinicalDetails: {
      administration:
        "Administer IV. Slow administration may reduce histamine-related cardiovascular effects.",
      warnings: [
        "Respiratory paralysis",
        "Histamine release",
        "Hypotension",
        "Bronchospasm"
      ],
      contraindications: [
        "Known hypersensitivity to atracurium"
      ],
      reversal:
        "Neostigmine with an appropriate antimuscarinic when clinically indicated."
    },

    dilutions: [
      {
        instructions:
          "May be administered IV according to product instructions and local protocol."
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
      "depolarizing"
    ],

    indications: [
      {
        id: "intubation",
        title: "Tracheal Intubation / RSI",
        route: "IV",
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
      onset: "30–60 sec",
      duration: "5–10 min"
    },

    safetyProfile: {
      isHighAlert: true,
      safetyNotes:
        "Rapid-onset depolarizing neuromuscular blocker. Major concerns include hyperkalemia, malignant hyperthermia and bradyarrhythmias."
    },

    clinicalDetails: {
      administration:
        "IV administration by clinicians prepared for airway management and mechanical ventilation.",
      warnings: [
        "Hyperkalemia",
        "Malignant hyperthermia",
        "Bradycardia",
        "Prolonged apnea",
        "Masseter spasm"
      ],
      contraindications: [
        "Known malignant hyperthermia susceptibility",
        "Known significant hyperkalemia risk",
        "Certain neuromuscular disorders",
        "Known hypersensitivity"
      ],
      reversal:
        "No direct reversal agent. Provide airway support and ventilation until spontaneous recovery."
    },

    dilutions: [
      {
        instructions:
          "Use according to formulation and local protocol."
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
      "hypotension",
      "vasopressor"
    ],

    indications: [
      {
        id: "hypotension",
        title: "Anesthesia-related Hypotension",
        route: "IV",
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
      onset: "1–2 min IV",
      duration: "10–60 min"
    },

    safetyProfile: {
      isHighAlert: true,
      safetyNotes:
        "Sympathomimetic drug. May cause tachycardia, hypertension and arrhythmias."
    },

    clinicalDetails: {
      administration:
        "IV bolus should be administered in a titrated manner according to blood pressure and heart rate.",
      warnings: [
        "Tachycardia",
        "Hypertension",
        "Arrhythmias",
        "Tachyphylaxis with repeated doses"
      ],
      contraindications: [
        "Known hypersensitivity",
        "Use cautiously in significant cardiovascular disease"
      ],
      reversal:
        "No specific reversal agent; manage excessive sympathomimetic effects supportively."
    },

    dilutions: [
      {
        instructions:
          "Verify ampoule concentration and dilute to a clearly labeled working concentration before IV administration."
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
      "reversal",
      "NMB reversal"
    ],

    indications: [
      {
        id: "reversal",
        title: "Reversal of Nondepolarizing Neuromuscular Block",
        route: "IV",
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
      onset: "3–10 min",
      duration: "40–60 min"
    },

    safetyProfile: {
      isHighAlert: true,
      safetyNotes:
        "Should be administered only when clinically appropriate recovery from neuromuscular blockade is present and with appropriate antimuscarinic protection."
    },

    clinicalDetails: {
      administration:
        "IV administration. Dose should be selected according to the depth of neuromuscular blockade and clinical context.",
      warnings: [
        "Bradycardia",
        "Bronchospasm",
        "Increased secretions",
        "Cholinergic effects"
      ],
      contraindications: [
        "Known hypersensitivity",
        "Mechanical intestinal obstruction",
        "Mechanical urinary tract obstruction"
      ],
      reversal:
        "Neostigmine itself is a reversal agent; administer with an appropriate antimuscarinic such as atropine or glycopyrrolate."
    },

    dilutions: [
      {
        instructions:
          "Dilute or administer according to available concentration and local reversal protocol."
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
      "benzodiazepine",
      "sedation"
    ],

    indications: [
      {
        id: "sedation",
        title: "IV Sedation",
        route: "IV",
        doseConfig: {
          doseType: "mg/kg",
          doseMin: 0.01,
          doseMax: 0.05,
          unitLabel: "mg/kg"
        }
      },
      {
        id: "premedication",
        title: "Preoperative Sedation",
        route: "IV",
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
      onset: "1–3 min",
      duration: "30–80 min"
    },

    safetyProfile: {
      isHighAlert: true,
      safetyNotes:
        "May cause respiratory depression, apnea and hypotension. Risk increases with opioids and other CNS depressants."
    },

    clinicalDetails: {
      administration:
        "Administer slowly and titrate to the desired level of sedation. Continuous monitoring of respiratory and cardiovascular status is required.",
      warnings: [
        "Respiratory depression",
        "Apnea",
        "Hypotension",
        "Enhanced effects with opioids"
      ],
      contraindications: [
        "Known hypersensitivity to benzodiazepines",
        "Acute narrow-angle glaucoma"
      ],
      reversal:
        "Flumazenil may reverse benzodiazepine effects in selected situations, but recurrent sedation and seizure risk must be considered."
    },

    dilutions: [
      {
        instructions:
          "May be diluted with compatible IV solutions according to product instructions and local protocol."
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
      "anaphylaxis",
      "cardiac arrest",
      "vasopressor"
    ],

    indications: [
      {
        id: "anaphylaxis",
        title: "Anaphylaxis",
        route: "IM",
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
        title: "Adult Cardiac Arrest",
        route: "IV / IO",
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
        title: "Vasopressor Infusion",
        route: "IV Infusion",
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
      onset: "Rapid",
      duration: "5–10 min IV"
    },

    safetyProfile: {
      isHighAlert: true,
      safetyNotes:
        "HIGH ALERT. Epinephrine concentrations and routes differ by indication. Always verify concentration, route and clinical indication before administration."
    },

    clinicalDetails: {
      administration:
        "Route and concentration depend on the indication. For anaphylaxis, IM administration into the anterolateral thigh is standard. Cardiac arrest dosing follows current resuscitation guidelines.",
      warnings: [
        "Arrhythmias",
        "Severe hypertension",
        "Myocardial ischemia",
        "Medication concentration errors",
        "High risk of dosing error"
      ],
      contraindications: [
        "No absolute contraindication in life-threatening anaphylaxis or cardiac arrest; use according to indication and route."
      ],
      reversal:
        "No specific reversal agent. Treat excessive cardiovascular effects supportively according to clinical protocol."
    },

    dilutions: [
      {
        instructions:
          "For IV administration, use a clearly identified and appropriately prepared concentration according to the specific clinical protocol. Do not assume that an IM anaphylaxis concentration is interchangeable with an IV cardiac-arrest concentration."
      }
    ],

    references: [
      {
        source: "AHA 2025 ACLS Guidelines",
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
      "PONV",
      "antiemetic"
    ],

    indications: [
      {
        id: "ponv",
        title: "PONV Prophylaxis",
        route: "IV",
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
        title: "Airway Edema / Inflammatory Use",
        route: "IV",
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
      onset: "Within hours",
      duration: "Several hours"
    },

    safetyProfile: {
      isHighAlert: false,
      safetyNotes:
        "Consider glucose elevation, infection risk and other corticosteroid-related effects depending on dose and patient factors."
    },

    clinicalDetails: {
      administration:
        "Administer IV or by another appropriate route according to the indication and local protocol.",
      warnings: [
        "Hyperglycemia",
        "Potential infection risk",
        "GI effects",
        "Steroid-related adverse effects with repeated use"
      ],
      contraindications: [
        "Known hypersensitivity to dexamethasone or formulation components"
      ],
      reversal:
        "No specific reversal agent."
    },

    dilutions: [
      {
        instructions:
          "Use compatible IV solution if dilution is required by the product or local protocol."
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
