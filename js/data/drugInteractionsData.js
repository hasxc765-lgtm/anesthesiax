/**
 * Perioperative Chronic Medications & Drug Interactions Reference Data
 *
 * AnesthesiaX — Phase 11.0
 * Clinical Reference Data v11.0.0
 * File: js/data/drugInteractionsData.js
 *
 * Single Source of Truth for:
 * - Chronic medication perioperative management
 * - Day-of-surgery continuation / withholding decisions
 * - Preoperative hold considerations
 * - Postoperative restart considerations
 * - Neuraxial / regional anesthesia considerations
 * - Renal-function modifiers
 * - Major anesthesia-related drug interactions
 * - Evidence traceability
 *
 * Architecture:
 * Pure Data ES Module.
 * No DOM dependencies.
 * No UI dependencies.
 * No calculator dependencies.
 * No state dependencies.
 *
 * IMPORTANT:
 * This module is a clinical cognitive-aid reference dataset.
 * It must NOT be interpreted as an autonomous prescribing engine.
 * Medication decisions must be individualized according to the
 * indication, patient status, procedure, bleeding/thrombotic risk,
 * renal/hepatic function, anesthesia technique, and local policy.
 */

export const drugInteractionsData = {

  // ===========================================================================
  // 1. METADATA
  // ===========================================================================

  meta: {
    version: "11.0.0",
    dataRevision: "clinical-reference-v11.0.0",
    module: "Perioperative Chronic Medications & Drug Interactions Center",

    disclaimer:
      "أداة معرفية استرشادية لإدارة الأدوية المزمنة والتداخلات الدوائية حول الجراحة. " +
      "لا تستبدل الحكم السريري المباشر أو وصف الطبيب أو بروتوكول المستشفى المحلي. " +
      "قرارات الإيقاف والاستمرار وإعادة البدء يجب أن تُفصّل حسب حالة المريض، " +
      "نوع العملية، خطر النزف والتخثر، وظائف الكلى والكبد، ونوع التخدير.",

    clinicalScope: [
      "Elective non-cardiac surgery",
      "Perioperative medication reconciliation",
      "Day-of-surgery medication review",
      "Postoperative medication restart planning",
      "Major anesthesia-related drug interactions",
      "Neuraxial and deep regional anesthesia considerations"
    ],

    decisionStatuses: {
      CONTINUE: "الاستمرار عادةً",
      HOLD: "الإيقاف أو الحجب وفق القاعدة المحددة",
      INDIVIDUALIZE: "قرار فردي حسب عوامل الخطورة",
      SPECIALIST_REVIEW: "مراجعة اختصاصية مطلوبة",
      AVOID_INTERACTION: "الدواء المزمن قد يستمر لكن يجب تجنب تداخل محدد",
      EMERGENCY_EXCEPTION: "تُطبق قاعدة مختلفة في الجراحة الإسعافية"
    },

    evidenceSources: [

      {
        id: "src_acc_aha_periop_2024",
        organization:
          "American College of Cardiology / American Heart Association",
        document:
          "2024 AHA/ACC Guideline for Perioperative Cardiovascular Management for Noncardiac Surgery",
        year: 2024,
        evidenceType: "Guideline",
        domains: [
          "Cardiovascular medications",
          "SGLT2 inhibitors",
          "Beta blockers",
          "ACE inhibitors / ARBs",
          "Perioperative glucose management"
        ]
      },

      {
        id: "src_aha_acc_bp_2025",
        organization:
          "American Heart Association / American College of Cardiology",
        document:
          "2025 AHA/ACC Guideline for Prevention, Detection, Evaluation and Management of High Blood Pressure in Adults",
        year: 2025,
        evidenceType: "Guideline",
        domains: [
          "Perioperative antihypertensive management",
          "Beta blockers",
          "ACE inhibitors / ARBs"
        ]
      },

      {
        id: "src_ada_2026",
        organization:
          "American Diabetes Association",
        document:
          "Standards of Care in Diabetes — 2026, Section 16: Diabetes Care in the Hospital",
        year: 2026,
        evidenceType: "Guideline",
        domains: [
          "SGLT2 inhibitors",
          "GLP-1 receptor agonists",
          "Perioperative glycemic management"
        ]
      },

      {
        id: "src_spaqi_sglt2_2026",
        organization:
          "Society for Perioperative Assessment and Quality Improvement",
        document:
          "Multidisciplinary Consensus Statement on Perioperative Management of SGLT2 Inhibitors",
        year: 2026,
        evidenceType: "Consensus Statement",
        domains: [
          "SGLT2 inhibitors",
          "Euglycemic ketoacidosis",
          "Perioperative risk stratification"
        ]
      },

      {
        id: "src_multisociety_glp1_2024",
        organization:
          "Multi-Society Clinical Practice Guidance",
        document:
          "Multi-society Clinical Practice Guidance for the Safe Use of GLP-1 Receptor Agonists in the Perioperative Period",
        year: 2024,
        evidenceType: "Clinical Practice Guidance",
        domains: [
          "GLP-1 receptor agonists",
          "Delayed gastric emptying",
          "Aspiration risk"
        ]
      },

      {
        id: "src_glp1_consensus_2025",
        organization:
          "Multidisciplinary Perioperative Consensus Group",
        document:
          "Elective peri-operative management of adults taking GLP-1/GIP receptor agonists and SGLT2 inhibitors",
        year: 2025,
        evidenceType: "Consensus Statement",
        domains: [
          "GLP-1 receptor agonists",
          "GIP/GLP-1 receptor agonists",
          "SGLT2 inhibitors"
        ]
      },

      {
        id: "src_asra_5th_2025",
        organization:
          "American Society of Regional Anesthesia and Pain Medicine",
        document:
          "Regional Anesthesia in the Patient Receiving Antithrombotic or Thrombolytic Therapy — Fifth Edition",
        year: 2025,
        evidenceType: "Evidence-Based Guideline",
        domains: [
          "Neuraxial anesthesia",
          "Deep plexus / deep peripheral blocks",
          "DOACs",
          "Warfarin",
          "Antiplatelet agents",
          "LMWH",
          "UFH"
        ]
      },

      {
        id: "src_esaic_esra_2022",
        organization:
          "ESAIC / ESRA",
        document:
          "Regional Anaesthesia in Patients on Antithrombotic Drugs",
        year: 2022,
        evidenceType: "Guideline",
        domains: [
          "Regional anesthesia",
          "Antithrombotic therapy"
        ]
      },

      {
        id: "src_asa_glp1_2023",
        organization:
          "American Society of Anesthesiologists",
        document:
          "Consensus-Based Guidance on Preoperative Management of Patients on GLP-1 Receptor Agonists",
        year: 2023,
        evidenceType: "Historical Guidance",
        domains: [
          "GLP-1 receptor agonists"
        ],
        status: "superseded_or_modified_by_later_multisociety_guidance"
      },

      {
        id: "src_periop_medication_consensus",
        organization:
          "Perioperative Medicine / Anesthesia Reference Consensus",
        document:
          "Perioperative management principles for chronic medications",
        year: 2025,
        evidenceType: "Reference Consensus",
        domains: [
          "Lithium",
          "MAO inhibitors",
          "Parkinson medications",
          "Herbal supplements",
          "Psychiatric medications"
        ]
      }
    ]
  },


  // ===========================================================================
  // 2. STANDARDIZED DECISION CONTRACT
  // ===========================================================================

  decisionContract: {

    requiredPatientFactors: [
      "medication",
      "indication",
      "surgeryType",
      "surgeryUrgency",
      "anesthesiaType"
    ],

    optionalPatientFactors: [
      "renalFunction",
      "hepaticFunction",
      "bleedingRisk",
      "thromboticRisk",
      "aspirationRisk",
      "hemodynamicStatus",
      "electrolytes",
      "glucoseStatus",
      "gastricSymptoms",
      "doseLevel",
      "lastDoseDateTime",
      "plannedNeuraxialBlock"
    ],

    statuses: [
      "CONTINUE",
      "HOLD",
      "INDIVIDUALIZE",
      "SPECIALIST_REVIEW",
      "AVOID_INTERACTION",
      "EMERGENCY_EXCEPTION"
    ]
  },


  // ===========================================================================
  // 3. MEDICATION CLASSES
  // ===========================================================================

  medicationClasses: {

    DIABETES_ENDOCRINE: {
      id: "DIABETES_ENDOCRINE",
      title: "Diabetes & Endocrine"
    },

    CARDIOVASCULAR: {
      id: "CARDIOVASCULAR",
      title: "Cardiovascular"
    },

    ANTICOAGULANTS: {
      id: "ANTICOAGULANTS",
      title: "Anticoagulants"
    },

    ANTIPLATELETS: {
      id: "ANTIPLATELETS",
      title: "Antiplatelet Agents"
    },

    NEUROPSYCHIATRIC: {
      id: "NEUROPSYCHIATRIC",
      title: "Neuropsychiatric"
    },

    PARKINSON: {
      id: "PARKINSON",
      title: "Parkinson Disease Medications"
    },

    HERBAL_SUPPLEMENTS: {
      id: "HERBAL_SUPPLEMENTS",
      title: "Herbal & Dietary Supplements"
    },

    RESPIRATORY: {
      id: "RESPIRATORY",
      title: "Respiratory"
    },

    OTHER: {
      id: "OTHER",
      title: "Other Chronic Medications"
    }
  },


  // ===========================================================================
  // 4. RENAL FUNCTION CATEGORIES
  // ===========================================================================

  renalFunctionCategories: {

    NORMAL: {
      id: "NORMAL",
      label: "Normal / preserved renal function",
      egfrMin: 60
    },

    MODERATE_IMPAIRMENT: {
      id: "MODERATE_IMPAIRMENT",
      label: "Moderate renal impairment",
      egfrMin: 30,
      egfrMax: 59
    },

    SEVERE_IMPAIRMENT: {
      id: "SEVERE_IMPAIRMENT",
      label: "Severe renal impairment",
      egfrMin: 15,
      egfrMax: 29
    },

    KIDNEY_FAILURE: {
      id: "KIDNEY_FAILURE",
      label: "Kidney failure / dialysis",
      egfrMax: 14
    },

    UNKNOWN: {
      id: "UNKNOWN",
      label: "Renal function unknown"
    }
  },


  // ===========================================================================
  // 5. MEDICATION DATABASE
  // ===========================================================================

  medications: {

    // -------------------------------------------------------------------------
    // A. DIABETES / ENDOCRINE
    // -------------------------------------------------------------------------

    empagliflozin: {
      id: "empagliflozin",
      genericName: "Empagliflozin",
      aliases: ["Jardiance"],
      classId: "DIABETES_ENDOCRINE",
      category: "SGLT2 Inhibitor",

      indicationExamples: [
        "Type 2 diabetes",
        "Heart failure",
        "Chronic kidney disease"
      ],

      dayOfSurgery: {
        status: "HOLD",
        recommendation:
          "يُحجب قبل الجراحة المخططة لتقليل خطر الحماض الكيتوني السكري الطبيعي السكر.",
        defaultHoldDays: 3
      },

      preOpHold: {
        standardDays: 3,
        emergencySurgery:
          "لا تؤخر الجراحة الإسعافية لمجرد إيقاف الدواء؛ قيّم خطر euglycemic DKA وراقب الحماض والكيتونات حسب الحالة."
      },

      postoperativeRestart: {
        status: "INDIVIDUALIZE",
        recommendation:
          "إعادة البدء بعد استقرار الحالة وعودة تناول الطعام والسوائل وعدم وجود حماض أو ketosis، مع مراعاة الاستطباب القلبي أو الكلوي."
      },

      safetyFlags: [
        "EUGLYCEMIC_DKA",
        "DEHYDRATION",
        "METABOLIC_ACIDOSIS"
      ],

      monitoring: [
        "Blood glucose",
        "Ketones when clinically indicated",
        "Anion gap / bicarbonate when concerned",
        "Volume status"
      ],

      evidenceRef: [
        "src_acc_aha_periop_2024",
        "src_ada_2026",
        "src_spaqi_sglt2_2026"
      ]
    },


    dapagliflozin: {
      id: "dapagliflozin",
      genericName: "Dapagliflozin",
      aliases: ["Farxiga", "Forxiga"],
      classId: "DIABETES_ENDOCRINE",
      category: "SGLT2 Inhibitor",

      dayOfSurgery: {
        status: "HOLD",
        recommendation:
          "إيقاف الدواء قبل الجراحة المخططة بثلاثة أيام على الأقل."
      },

      preOpHold: {
        standardDays: 3,
        emergencySurgery:
          "في الجراحة الإسعافية لا تعتمد على وجود فترة إيقاف كاملة؛ يجب تقييم خطر الحماض الكيتوني."
      },

      postoperativeRestart: {
        status: "INDIVIDUALIZE",
        recommendation:
          "إعادة البدء بعد استقرار الحالة وعودة التغذية والترطيب وعدم وجود ketosis أو metabolic acidosis."
      },

      safetyFlags: [
        "EUGLYCEMIC_DKA",
        "DEHYDRATION",
        "METABOLIC_ACIDOSIS"
      ],

      evidenceRef: [
        "src_acc_aha_periop_2024",
        "src_ada_2026",
        "src_spaqi_sglt2_2026"
      ]
    },


    canagliflozin: {
      id: "canagliflozin",
      genericName: "Canagliflozin",
      aliases: ["Invokana"],
      classId: "DIABETES_ENDOCRINE",
      category: "SGLT2 Inhibitor",

      dayOfSurgery: {
        status: "HOLD",
        recommendation:
          "إيقاف الدواء قبل الجراحة المخططة بثلاثة أيام على الأقل."
      },

      preOpHold: {
        standardDays: 3
      },

      postoperativeRestart: {
        status: "INDIVIDUALIZE",
        recommendation:
          "إعادة البدء فقط بعد الاستقرار السريري وعودة التغذية والترطيب وغياب الحماض الكيتوني."
      },

      safetyFlags: [
        "EUGLYCEMIC_DKA",
        "DEHYDRATION"
      ],

      evidenceRef: [
        "src_acc_aha_periop_2024",
        "src_ada_2026"
      ]
    },


    ertugliflozin: {
      id: "ertugliflozin",
      genericName: "Ertugliflozin",
      aliases: ["Steglatro"],
      classId: "DIABETES_ENDOCRINE",
      category: "SGLT2 Inhibitor",

      dayOfSurgery: {
        status: "HOLD",
        recommendation:
          "إيقاف الدواء قبل الجراحة المخططة بأربعة أيام."
      },

      preOpHold: {
        standardDays: 4
      },

      postoperativeRestart: {
        status: "INDIVIDUALIZE",
        recommendation:
          "إعادة البدء بعد الاستقرار وعودة التغذية والترطيب وغياب الحماض."
      },

      safetyFlags: [
        "EUGLYCEMIC_DKA"
      ],

      evidenceRef: [
        "src_acc_aha_periop_2024",
        "src_ada_2026"
      ]
    },


    metformin: {
      id: "metformin",
      genericName: "Metformin",
      aliases: ["Glucophage"],
      classId: "DIABETES_ENDOCRINE",
      category: "Biguanide",

      dayOfSurgery: {
        status: "INDIVIDUALIZE",
        recommendation:
          "لا يُعامل الميتفورمين كقاعدة إيقاف عالمية؛ القرار يعتمد على نوع العملية، وظائف الكلى، خطر نقص الأكسجة/الصدمة، واحتمال استخدام contrast."
      },

      preOpHold: {
        recommendation:
          "يمكن الاستمرار في بعض المرضى المستقرين، بينما قد يُحجب يوم العملية في سياقات الصيام المطول أو عدم الاستقرار أو عوامل خطر lactic acidosis."
      },

      postoperativeRestart: {
        status: "INDIVIDUALIZE",
        recommendation:
          "إعادة البدء بعد استقرار الدورة الدموية ووظائف الكلى وعودة التغذية، مع مراعاة أي تعرض للـ contrast حسب البروتوكول المحلي."
      },

      safetyFlags: [
        "LACTIC_ACIDOSIS_RISK",
        "RENAL_DYSFUNCTION",
        "HEMODYNAMIC_INSTABILITY"
      ],

      evidenceRef: [
        "src_acc_aha_periop_2024",
        "src_ada_2026"
      ]
    },


    semaglutide: {
      id: "semaglutide",
      genericName: "Semaglutide",
      aliases: [
        "Ozempic",
        "Wegovy",
        "Rybelsus"
      ],
      classId: "DIABETES_ENDOCRINE",
      category: "GLP-1 Receptor Agonist",

      formulations: {
        weekly: "Injection",
        daily: "Oral"
      },

      dayOfSurgery: {
        status: "INDIVIDUALIZE",
        recommendation:
          "لا توجد قاعدة عامة آلية بإيقافه أسبوعاً لجميع المرضى. يجب تقييم خطر تأخر إفراغ المعدة والشفط الرئوي بشكل فردي."
      },

      riskModifiers: [
        "Dose escalation phase",
        "High dose",
        "Active nausea",
        "Vomiting",
        "Early satiety",
        "Bloating",
        "Known gastroparesis",
        "Other delayed gastric emptying conditions"
      ],

      riskMitigation: [
        "Consider prolonged liquid-only diet when clinically indicated",
        "Consider gastric ultrasound where expertise is available",
        "Consider aspiration-mitigating anesthesia strategy",
        "Consider postponement when aspiration risk remains unacceptably high"
      ],

      historicalHoldOption: {
        daily: "Day of surgery",
        weekly: "One week before surgery",
        note:
          "هذا يعكس توجيه ASA 2023 التاريخي، وليس قاعدة افتراضية حديثة لجميع المرضى."
      },

      postoperativeRestart: {
        status: "INDIVIDUALIZE",
        recommendation:
          "إعادة الجرعة بعد تقييم التغذية، الغثيان/القيء، خطر الجفاف، والحالة السكرية."
      },

      safetyFlags: [
        "DELAYED_GASTRIC_EMPTYING",
        "ASPIRATION_RISK",
        "NAUSEA",
        "VOMITING"
      ],

      evidenceRef: [
        "src_multisociety_glp1_2024",
        "src_glp1_consensus_2025",
        "src_ada_2026",
        "src_asa_glp1_2023"
      ]
    },


    tirzepatide: {
      id: "tirzepatide",
      genericName: "Tirzepatide",
      aliases: [
        "Mounjaro",
        "Zepbound"
      ],
      classId: "DIABETES_ENDOCRINE",
      category: "Dual GIP / GLP-1 Receptor Agonist",

      dayOfSurgery: {
        status: "INDIVIDUALIZE",
        recommendation:
          "يجب تقييم خطر تأخر إفراغ المعدة والشفط الرئوي بشكل فردي بدلاً من فرض إيقاف أسبوعي ثابت."
      },

      riskModifiers: [
        "Dose escalation",
        "High dose",
        "Nausea",
        "Vomiting",
        "Early satiety",
        "Bloating",
        "Known gastroparesis"
      ],

      riskMitigation: [
        "Individual aspiration-risk assessment",
        "Liquid diet strategy when indicated",
        "Gastric ultrasound when available and appropriate",
        "Aspiration-mitigating anesthesia plan when indicated"
      ],

      postoperativeRestart: {
        status: "INDIVIDUALIZE",
        recommendation:
          "إعادة الدواء بعد استقرار الحالة وعودة التغذية وفق الخطة العلاجية."
      },

      safetyFlags: [
        "DELAYED_GASTRIC_EMPTYING",
        "ASPIRATION_RISK"
      ],

      evidenceRef: [
        "src_multisociety_glp1_2024",
        "src_glp1_consensus_2025",
        "src_ada_2026"
      ]
    },


    insulin_basal: {
      id: "insulin_basal",
      genericName: "Basal Insulin",
      aliases: [
        "Glargine",
        "Detemir",
        "Degludec",
        "NPH"
      ],
      classId: "DIABETES_ENDOCRINE",
      category: "Insulin",

      dayOfSurgery: {
        status: "INDIVIDUALIZE",
        recommendation:
          "لا يُوقف الإنسولين الأساسي بصورة عشوائية؛ يجب تعديل الجرعة حسب نوع الإنسولين، خطر نقص السكر، نوع السكري، الصيام، والخطة السكرية."
      },

      preOpHold: {
        recommendation:
          "تُستخدم جرعة مخفضة أو استراتيجية خاصة حسب نوع الإنسولين والبروتوكول المؤسسي؛ لا يجوز استخدام نسبة موحدة لجميع المرضى."
      },

      postoperativeRestart: {
        status: "CONTINUE",
        recommendation:
          "يستمر basal insulin وفق الخطة السكرية مع التعديل حسب التغذية، glucose monitoring والحالة السريرية."
      },

      safetyFlags: [
        "HYPOGLYCEMIA",
        "HYPERGLYCEMIA",
        "DKA_IF_WITHHELD_IN_TYPE1"
      ],

      criticalNote:
        "في مرضى السكري النوع الأول، الإيقاف الكامل للإنسولين الأساسي قد يؤدي إلى DKA ولا ينبغي اعتباره قاعدة perioperative عامة.",

      evidenceRef: [
        "src_ada_2026"
      ]
    },


    insulin_prandial: {
      id: "insulin_prandial",
      genericName: "Prandial / Bolus Insulin",
      aliases: [
        "Lispro",
        "Aspart",
        "Glulisine",
        "Regular insulin"
      ],
      classId: "DIABETES_ENDOCRINE",
      category: "Insulin",

      dayOfSurgery: {
        status: "HOLD",
        recommendation:
          "تُحجب جرعة الإنسولين المرتبطة بالوجبة عندما يكون المريض صائماً، مع الاستمرار بالمراقبة السكرية."
      },

      postoperativeRestart: {
        status: "INDIVIDUALIZE",
        recommendation:
          "تُعاد مع استئناف التغذية وفق glucose monitoring."
      },

      safetyFlags: [
        "HYPOGLYCEMIA"
      ],

      evidenceRef: [
        "src_ada_2026"
      ]
    },


    // -------------------------------------------------------------------------
    // B. CARDIOVASCULAR
    // -------------------------------------------------------------------------

    ace_inhibitor: {
      id: "ace_inhibitor",
      genericName: "ACE Inhibitor",
      aliases: [
        "Enalapril",
        "Lisinopril",
        "Ramipril",
        "Perindopril"
      ],
      classId: "CARDIOVASCULAR",
      category: "RAAS Inhibitor",

      dayOfSurgery: {
        status: "INDIVIDUALIZE",
        recommendation:
          "يمكن التفكير في حجب ACE inhibitor قبل الجراحة لتقليل خطر hypotension، لكن القرار يعتمد على الاستطباب والحالة الهيموديناميكية."
      },

      preOpHold: {
        typicalConsideration:
          "قد يُحجب في اليوم السابق أو وفق بروتوكول المؤسسة، خصوصاً عندما يكون الهدف تقليل intraoperative hypotension."
      },

      exceptions: [
        "Individualized decision for heart failure or other compelling indications",
        "Hemodynamic instability",
        "Local institutional protocol"
      ],

      postoperativeRestart: {
        status: "INDIVIDUALIZE",
        recommendation:
          "إعادة البدء بعد استقرار الضغط ووظائف الكلى والبوتاسيوم."
      },

      safetyFlags: [
        "INTRAOPERATIVE_HYPOTENSION",
        "HYPERKALEMIA",
        "RENAL_DYSFUNCTION"
      ],

      evidenceRef: [
        "src_acc_aha_periop_2024",
        "src_aha_acc_bp_2025"
      ]
    },


    arb: {
      id: "arb",
      genericName: "Angiotensin II Receptor Blocker",
      aliases: [
        "Losartan",
        "Valsartan",
        "Candesartan",
        "Irbesartan"
      ],
      classId: "CARDIOVASCULAR",
      category: "RAAS Inhibitor",

      dayOfSurgery: {
        status: "INDIVIDUALIZE",
        recommendation:
          "قد يُحجب قبل الجراحة لتقليل خطر hypotension، مع موازنة الاستطباب القلبي والضغط."
      },

      preOpHold: {
        typicalConsideration:
          "قد يُحجب قبل العملية وفق بروتوكول المؤسسة، مع عدم تحويل ذلك إلى قاعدة إلزامية لكل مريض."
      },

      postoperativeRestart: {
        status: "INDIVIDUALIZE",
        recommendation:
          "إعادة البدء بعد استقرار الضغط ووظائف الكلى والبوتاسيوم."
      },

      safetyFlags: [
        "INTRAOPERATIVE_HYPOTENSION",
        "HYPERKALEMIA",
        "RENAL_DYSFUNCTION"
      ],

      evidenceRef: [
        "src_acc_aha_periop_2024",
        "src_aha_acc_bp_2025"
      ]
    },


    beta_blocker: {
      id: "beta_blocker",
      genericName: "Beta Blocker",
      aliases: [
        "Metoprolol",
        "Bisoprolol",
        "Atenolol",
        "Carvedilol"
      ],
      classId: "CARDIOVASCULAR",
      category: "Beta-Adrenergic Blocker",

      dayOfSurgery: {
        status: "CONTINUE",
        recommendation:
          "يُستمر عادةً بالـ beta blocker المزمن مع مراقبة الضغط والنبض."
      },

      preOpHold: {
        recommendation:
          "لا ينبغي إيقاف العلاج المزمن بشكل مفاجئ بسبب خطر rebound tachycardia/hypertension/ischemia."
      },

      postoperativeRestart: {
        status: "CONTINUE",
        recommendation:
          "استمراره أو استئنافه مبكراً عند الإمكان مع مراعاة hypotension/bradycardia."
      },

      contraindicationFlags: [
        "Severe bradycardia",
        "Hypotension",
        "High-grade AV block",
        "Acute decompensated heart failure"
      ],

      safetyFlags: [
        "BRADYCARDIA",
        "HYPOTENSION",
        "REBOUND_IF_ABRUPTLY_STOPPED"
      ],

      evidenceRef: [
        "src_acc_aha_periop_2024",
        "src_aha_acc_bp_2025"
      ]
    },


    calcium_channel_blocker: {
      id: "calcium_channel_blocker",
      genericName: "Calcium Channel Blocker",
      aliases: [
        "Amlodipine",
        "Diltiazem",
        "Verapamil",
        "Nifedipine"
      ],
      classId: "CARDIOVASCULAR",
      category: "Calcium Channel Blocker",

      dayOfSurgery: {
        status: "CONTINUE",
        recommendation:
          "يُستمر غالباً مع تقييم ضغط الدم والنبض ونوع الدواء."
      },

      postoperativeRestart: {
        status: "CONTINUE",
        recommendation:
          "استئناف الدواء عند القدرة على تناوله مع مراقبة hemodynamics."
      },

      safetyFlags: [
        "HYPOTENSION",
        "BRADYCARDIA",
        "AV_BLOCK"
      ],

      evidenceRef: [
        "src_aha_acc_bp_2025"
      ]
    },


    diuretic: {
      id: "diuretic",
      genericName: "Diuretic",
      aliases: [
        "Furosemide",
        "Hydrochlorothiazide",
        "Chlorthalidone",
        "Spironolactone"
      ],
      classId: "CARDIOVASCULAR",
      category: "Diuretic",

      dayOfSurgery: {
        status: "INDIVIDUALIZE",
        recommendation:
          "قد يُحجب صباح العملية في بعض المرضى لتقليل hypovolemia/electrolyte disturbance، لكن القرار يعتمد على الاستطباب والحالة."
      },

      postoperativeRestart: {
        status: "INDIVIDUALIZE",
        recommendation:
          "إعادة البدء حسب volume status، renal function، electrolytes والاستطباب."
      },

      safetyFlags: [
        "HYPOVOLEMIA",
        "HYPOKALEMIA",
        "HYPERKALEMIA",
        "HYPOTENSION"
      ],

      evidenceRef: [
        "src_aha_acc_bp_2025"
      ]
    },


    statin: {
      id: "statin",
      genericName: "Statin",
      aliases: [
        "Atorvastatin",
        "Rosuvastatin",
        "Simvastatin",
        "Pravastatin"
      ],
      classId: "CARDIOVASCULAR",
      category: "Lipid-Lowering Agent",

      dayOfSurgery: {
        status: "CONTINUE",
        recommendation:
          "يُستمر عادةً بالستاتين المزمن حول الجراحة."
      },

      postoperativeRestart: {
        status: "CONTINUE"
      },

      safetyFlags: [
        "MYOPATHY",
        "HEPATIC_DYSFUNCTION"
      ],

      evidenceRef: [
        "src_acc_aha_periop_2024"
      ]
    },


    // -------------------------------------------------------------------------
    // C. ANTICOAGULANTS
    // -------------------------------------------------------------------------

    warfarin: {
      id: "warfarin",
      genericName: "Warfarin",
      aliases: ["Coumadin"],
      classId: "ANTICOAGULANTS",
      category: "Vitamin K Antagonist",

      dayOfSurgery: {
        status: "HOLD",
        recommendation:
          "يتطلب الإيقاف قبل العمليات التي تتطلب hemostasis مناسباً، مع تحديد توقيت الإيقاف وخطة bridging حسب indication وخطر thrombosis."
      },

      preOpHold: {
        standardConsideration:
          "عادةً يحتاج عدة أيام للوصول إلى INR مناسب، لكن لا تُستخدم مدة ثابتة دون معرفة indication وINR."
      },

      neuraxial: {
        status: "SPECIALIST_REVIEW",
        requirement:
          "لا يُجرى neuraxial block اعتماداً على عدد أيام الإيقاف فقط؛ يجب تقييم INR والحالة السريرية وفق ASRA."
      },

      postoperativeRestart: {
        status: "INDIVIDUALIZE",
        recommendation:
          "إعادة warfarin بعد تحقيق hemostasis مناسب، مع تحديد الحاجة إلى bridging حسب خطر thrombosis."
      },

      safetyFlags: [
        "BLEEDING",
        "THROMBOEMBOLISM_IF_WITHHELD",
        "NEURAXIAL_HEMATOMA"
      ],

      evidenceRef: [
        "src_asra_5th_2025"
      ]
    },


    apixaban: {
      id: "apixaban",
      genericName: "Apixaban",
      aliases: ["Eliquis"],
      classId: "ANTICOAGULANTS",
      category: "Direct Factor Xa Inhibitor",

      dayOfSurgery: {
        status: "INDIVIDUALIZE",
        recommendation:
          "مدة الإيقاف تعتمد على الجرعة، خطر النزف، وظيفة الكلى، ونوع الإجراء."
      },

      doseClassification: {
        lowDose: "يُحدد من indication وdose regimen",
        highDose: "يُحدد من indication وdose regimen"
      },

      neuraxial: {
        status: "SPECIALIST_REVIEW",
        requirement:
          "استخدم أحدث ASRA guidance حسب low/high dose، وقت آخر جرعة، ووظائف الكلى. لا تعتمد على قاعدة عامة واحدة."
      },

      renalModifier: {
        required: true,
        note:
          "وظائف الكلى قد تؤثر في تقدير التعرض للدواء؛ يجب إدخال renal function في محرك القرار."
      },

      postoperativeRestart: {
        status: "INDIVIDUALIZE",
        recommendation:
          "إعادة العلاج بعد تحقيق hemostasis مناسب وبحسب indication وخطر thrombosis."
      },

      safetyFlags: [
        "BLEEDING",
        "NEURAXIAL_HEMATOMA",
        "THROMBOEMBOLISM_IF_WITHHELD"
      ],

      evidenceRef: [
        "src_asra_5th_2025"
      ]
    },


    rivaroxaban: {
      id: "rivaroxaban",
      genericName: "Rivaroxaban",
      aliases: ["Xarelto"],
      classId: "ANTICOAGULANTS",
      category: "Direct Factor Xa Inhibitor",

      dayOfSurgery: {
        status: "INDIVIDUALIZE",
        recommendation:
          "يُحدد توقيت الإيقاف وفق dose category، renal function، bleeding risk، ونوع الإجراء."
      },

      neuraxial: {
        status: "SPECIALIST_REVIEW",
        requirement:
          "تطبيق أحدث ASRA guidance وفق low/high dose وعوامل المريض."
      },

      renalModifier: {
        required: true
      },

      postoperativeRestart: {
        status: "INDIVIDUALIZE",
        recommendation:
          "إعادة الدواء بعد تحقيق hemostasis مناسب وموازنة خطر thrombosis والنزف."
      },

      safetyFlags: [
        "BLEEDING",
        "NEURAXIAL_HEMATOMA"
      ],

      evidenceRef: [
        "src_asra_5th_2025"
      ]
    },


    edoxaban: {
      id: "edoxaban",
      genericName: "Edoxaban",
      aliases: ["Savaysa", "Lixiana"],
      classId: "ANTICOAGULANTS",
      category: "Direct Factor Xa Inhibitor",

      dayOfSurgery: {
        status: "INDIVIDUALIZE"
      },

      neuraxial: {
        status: "SPECIALIST_REVIEW",
        requirement:
          "يجب تطبيق ASRA fifth edition وفق dose category والوقت منذ آخر جرعة."
      },

      renalModifier: {
        required: true
      },

      postoperativeRestart: {
        status: "INDIVIDUALIZE"
      },

      safetyFlags: [
        "BLEEDING",
        "NEURAXIAL_HEMATOMA"
      ],

      evidenceRef: [
        "src_asra_5th_2025"
      ]
    },


    dabigatran: {
      id: "dabigatran",
      genericName: "Dabigatran",
      aliases: ["Pradaxa"],
      classId: "ANTICOAGULANTS",
      category: "Direct Thrombin Inhibitor",

      dayOfSurgery: {
        status: "INDIVIDUALIZE",
        recommendation:
          "يتطلب اهتماماً خاصاً بوظيفة الكلى لأن clearance يعتمد بدرجة كبيرة على الكلية."
      },

      renalModifier: {
        required: true,
        highImportance: true
      },

      neuraxial: {
        status: "SPECIALIST_REVIEW",
        requirement:
          "لا يُعطى قرار neuraxial من اسم الدواء وحده؛ يجب دمج renal function وdose وtime since last dose وفق ASRA."
      },

      postoperativeRestart: {
        status: "INDIVIDUALIZE"
      },

      safetyFlags: [
        "BLEEDING",
        "RENAL_ACCUMULATION",
        "NEURAXIAL_HEMATOMA"
      ],

      evidenceRef: [
        "src_asra_5th_2025"
      ]
    },


    // -------------------------------------------------------------------------
    // D. ANTIPLATELETS
    // -------------------------------------------------------------------------

    aspirin: {
      id: "aspirin",
      genericName: "Aspirin",
      aliases: ["ASA"],
      classId: "ANTIPLATELETS",
      category: "Antiplatelet",

      dayOfSurgery: {
        status: "INDIVIDUALIZE",
        recommendation:
          "القرار يعتمد على indication، الجرعة، bleeding risk، cardiac/thrombotic risk، ونوع العملية."
      },

      neuraxial: {
        status: "INDIVIDUALIZE",
        requirement:
          "Aspirin alone لا يُعامل بنفس طريقة P2Y12 inhibitors؛ يجب تطبيق الإرشاد الخاص بالإجراء والدواء."
      },

      postoperativeRestart: {
        status: "INDIVIDUALIZE"
      },

      safetyFlags: [
        "BLEEDING",
        "THROMBOTIC_EVENT_IF_UNNECESSARILY_WITHHELD"
      ],

      evidenceRef: [
        "src_asra_5th_2025",
        "src_acc_aha_periop_2024"
      ]
    },


    clopidogrel: {
      id: "clopidogrel",
      genericName: "Clopidogrel",
      aliases: ["Plavix"],
      classId: "ANTIPLATELETS",
      category: "P2Y12 Inhibitor",

      dayOfSurgery: {
        status: "INDIVIDUALIZE",
        recommendation:
          "لا يُوقف بصورة آلية؛ يجب تحديد سبب العلاج، خصوصاً وجود coronary stent، وموازنة thrombosis مقابل bleeding."
      },

      neuraxial: {
        status: "SPECIALIST_REVIEW",
        requirement:
          "يجب تطبيق فترة الإيقاف الخاصة بـ neuraxial/deep regional anesthesia وفق ASRA."
      },

      postoperativeRestart: {
        status: "INDIVIDUALIZE",
        recommendation:
          "إعادة الدواء بعد hemostasis وبحسب indication، خصوصاً في المرضى ذوي خطر stent thrombosis."
      },

      safetyFlags: [
        "BLEEDING",
        "STENT_THROMBOSIS_IF_STOPPED"
      ],

      evidenceRef: [
        "src_asra_5th_2025",
        "src_acc_aha_periop_2024"
      ]
    },


    ticagrelor: {
      id: "ticagrelor",
      genericName: "Ticagrelor",
      aliases: ["Brilinta"],
      classId: "ANTIPLATELETS",
      category: "P2Y12 Inhibitor",

      dayOfSurgery: {
        status: "INDIVIDUALIZE",
        recommendation:
          "يجب تحديد ضرورة استمرار العلاج حسب coronary indication وstent history."
      },

      neuraxial: {
        status: "SPECIALIST_REVIEW",
        requirement:
          "تطبيق ASRA-specific interruption interval قبل neuraxial أو deep plexus block."
      },

      postoperativeRestart: {
        status: "INDIVIDUALIZE"
      },

      safetyFlags: [
        "BLEEDING",
        "STENT_THROMBOSIS"
      ],

      evidenceRef: [
        "src_asra_5th_2025"
      ]
    },


    prasugrel: {
      id: "prasugrel",
      genericName: "Prasugrel",
      aliases: ["Effient"],
      classId: "ANTIPLATELETS",
      category: "P2Y12 Inhibitor",

      dayOfSurgery: {
        status: "INDIVIDUALIZE",
        recommendation:
          "يجب عدم الإيقاف دون تقييم indication وخطر stent thrombosis."
      },

      neuraxial: {
        status: "SPECIALIST_REVIEW",
        requirement:
          "تطبيق ASRA interruption interval المحدد قبل neuraxial/deep regional anesthesia."
      },

      postoperativeRestart: {
        status: "INDIVIDUALIZE"
      },

      safetyFlags: [
        "BLEEDING",
        "STENT_THROMBOSIS"
      ],

      evidenceRef: [
        "src_asra_5th_2025"
      ]
    },


    // -------------------------------------------------------------------------
    // E. NEUROPSYCHIATRIC
    // -------------------------------------------------------------------------

    lithium: {
      id: "lithium",
      genericName: "Lithium",
      aliases: ["Lithium carbonate"],
      classId: "NEUROPSYCHIATRIC",
      category: "Mood Stabilizer",

      dayOfSurgery: {
        status: "INDIVIDUALIZE",
        recommendation:
          "يجب تقييم خطر السمية، الجفاف، وظائف الكلى، electrolytes، ونوع العملية بدلاً من اعتماد إيقاف موحد لجميع الحالات."
      },

      preOpHold: {
        commonConsideration:
          "قد يُحجب قبل العمليات الكبرى أو عندما يكون خطر dehydration/renal dysfunction مرتفعاً؛ التوقيت يحدد حسب الحالة والبروتوكول."
      },

      interactions: [
        "Prolongation of neuromuscular blockade",
        "Potential interaction with NSAIDs",
        "Potential increase with ACE inhibitors / ARBs",
        "Potential increase with thiazide diuretics",
        "Toxicity risk with dehydration"
      ],

      monitoring: [
        "Renal function",
        "Electrolytes",
        "Volume status",
        "Neuromuscular blockade"
      ],

      postoperativeRestart: {
        status: "INDIVIDUALIZE",
        recommendation:
          "إعادة الدواء بعد استقرار renal function وvolume status وelectrolytes."
      },

      safetyFlags: [
        "LITHIUM_TOXICITY",
        "PROLONGED_NEUROMUSCULAR_BLOCKADE",
        "RENAL_ACCUMULATION",
        "DEHYDRATION"
      ],

      evidenceRef: [
        "src_periop_medication_consensus"
      ]
    },


    maoi: {
      id: "maoi",
      genericName: "Monoamine Oxidase Inhibitor",
      aliases: [
        "Phenelzine",
        "Tranylcypromine",
        "Isocarboxazid",
        "Selegiline",
        "Rasagiline"
      ],
      classId: "NEUROPSYCHIATRIC",
      category: "MAOI",

      dayOfSurgery: {
        status: "INDIVIDUALIZE",
        recommendation:
          "لا يُفترض الإيقاف التلقائي؛ يتطلب الأمر خطة تخدير واعية بالتداخلات. الإيقاف قد يسبب withdrawal أو relapse."
      },

      majorInteractions: [
        "Meperidine / Pethidine",
        "Dextromethorphan",
        "Indirect sympathomimetics such as Ephedrine",
        "Other serotonergic agents"
      ],

      interactionManagement: {
        meperidine: "AVOID_INTERACTION",
        dextromethorphan: "AVOID_INTERACTION",
        ephedrine: "AVOID_OR_USE_ONLY_WITH_SPECIALIST_PLAN",
        phenylephrine:
          "May be preferred over indirect sympathomimetics when vasopressor therapy is required, with careful titration."
      },

      postoperativeRestart: {
        status: "CONTINUE",
        recommendation:
          "تجنب interruption غير الضروري ومراعاة التداخلات عند اختيار analgesics وvasopressors."
      },

      safetyFlags: [
        "SEROTONIN_SYNDROME",
        "HYPERTENSIVE_RESPONSE",
        "HYPOTENSION",
        "DRUG_INTERACTION"
      ],

      evidenceRef: [
        "src_periop_medication_consensus"
      ]
    },


    ssri: {
      id: "ssri",
      genericName: "Selective Serotonin Reuptake Inhibitor",
      aliases: [
        "Sertraline",
        "Fluoxetine",
        "Paroxetine",
        "Citalopram",
        "Escitalopram"
      ],
      classId: "NEUROPSYCHIATRIC",
      category: "SSRI",

      dayOfSurgery: {
        status: "CONTINUE",
        recommendation:
          "يُستمر عادةً لتجنب withdrawal والانتكاس، مع الانتباه لخطر النزف وبعض التداخلات السيروتونينية."
      },

      interactions: [
        "Serotonergic opioids",
        "Other serotonergic medications",
        "Potential platelet-mediated bleeding risk"
      ],

      postoperativeRestart: {
        status: "CONTINUE"
      },

      safetyFlags: [
        "SEROTONIN_SYNDROME",
        "BLEEDING_RISK",
        "WITHDRAWAL_IF_ABRUPTLY_STOPPED"
      ],

      evidenceRef: [
        "src_periop_medication_consensus"
      ]
    },


    // -------------------------------------------------------------------------
    // F. PARKINSON
    // -------------------------------------------------------------------------

    levodopa: {
      id: "levodopa",
      genericName: "Levodopa",
      aliases: [
        "Levodopa/Carbidopa",
        "Co-careldopa",
        "Co-beneldopa"
      ],
      classId: "PARKINSON",
      category: "Dopaminergic Therapy",

      dayOfSurgery: {
        status: "CONTINUE",
        recommendation:
          "يجب تجنب interruption غير الضروري. تُعطى الجرعة حتى صباح العملية عند الإمكان مع خطة لاستمرار dopaminergic therapy."
      },

      risksOfInterruption: [
        "Severe rigidity",
        "Worsening Parkinsonism",
        "Neuroleptic malignant-like syndrome / Parkinsonism-hyperpyrexia syndrome"
      ],

      interactionWarnings: [
        "Avoid dopamine-antagonist antiemetics when possible",
        "Plan alternative route if prolonged postoperative NPO is expected"
      ],

      postoperativeRestart: {
        status: "CONTINUE",
        recommendation:
          "إعادة العلاج بأسرع ما يمكن بعد العملية."
      },

      safetyFlags: [
        "WITHDRAWAL_SYNDROME",
        "RIGIDITY",
        "PARKINSONISM_HYPERPYREXIA"
      ],

      evidenceRef: [
        "src_periop_medication_consensus"
      ]
    },


    // -------------------------------------------------------------------------
    // G. HERBAL / SUPPLEMENTS
    // -------------------------------------------------------------------------

    st_johns_wort: {
      id: "st_johns_wort",
      genericName: "St. John's Wort",
      aliases: [
        "Hypericum perforatum"
      ],
      classId: "HERBAL_SUPPLEMENTS",
      category: "Herbal Supplement",

      dayOfSurgery: {
        status: "HOLD",
        recommendation:
          "يُفضل إيقافه قبل الجراحة الانتخابية بسبب التداخلات الدوائية المهمة."
      },

      preOpHold: {
        typicalDays: 14,
        note:
          "الفترة الدقيقة تعتمد على البروتوكول المحلي والتداخلات المتوقعة."
      },

      interactions: [
        "CYP3A4 induction",
        "Serotonergic medications",
        "Potential interaction with opioids and sedatives"
      ],

      postoperativeRestart: {
        status: "INDIVIDUALIZE"
      },

      safetyFlags: [
        "DRUG_INTERACTIONS",
        "SEROTONIN_SYNDROME_RISK",
        "ALTERED_DRUG_LEVELS"
      ],

      evidenceRef: [
        "src_periop_medication_consensus"
      ]
    },


    garlic_supplement: {
      id: "garlic_supplement",
      genericName: "Garlic Supplement",
      aliases: [
        "Allium sativum"
      ],
      classId: "HERBAL_SUPPLEMENTS",
      category: "Herbal Supplement",

      dayOfSurgery: {
        status: "HOLD",
        recommendation:
          "يُفضل إيقاف المكملات التي قد تؤثر على platelet function قبل الجراحة الانتخابية وفق البروتوكول المحلي."
      },

      preOpHold: {
        typicalDays: 7,
        maximumSuggestedDays: 14
      },

      safetyFlags: [
        "BLEEDING_RISK"
      ],

      evidenceRef: [
        "src_periop_medication_consensus"
      ]
    },


    ginkgo: {
      id: "ginkgo",
      genericName: "Ginkgo Biloba",
      aliases: [
        "Ginkgo"
      ],
      classId: "HERBAL_SUPPLEMENTS",
      category: "Herbal Supplement",

      dayOfSurgery: {
        status: "HOLD",
        recommendation:
          "يُفضل إيقافه قبل الجراحة الانتخابية بسبب احتمال زيادة خطر النزف والتداخلات الدوائية."
      },

      preOpHold: {
        typicalDays: 7,
        maximumSuggestedDays: 14
      },

      safetyFlags: [
        "BLEEDING_RISK",
        "DRUG_INTERACTIONS"
      ],

      evidenceRef: [
        "src_periop_medication_consensus"
      ]
    },


    ginseng: {
      id: "ginseng",
      genericName: "Ginseng",
      aliases: [
        "Panax ginseng"
      ],
      classId: "HERBAL_SUPPLEMENTS",
      category: "Herbal Supplement",

      dayOfSurgery: {
        status: "HOLD",
        recommendation:
          "يُفضل إيقافه قبل الجراحة الانتخابية بسبب عدم ثبات التركيب واحتمال التأثير على glucose وbleeding."
      },

      preOpHold: {
        typicalDays: 7,
        maximumSuggestedDays: 14
      },

      safetyFlags: [
        "HYPOGLYCEMIA",
        "BLEEDING_RISK",
        "DRUG_INTERACTIONS"
      ],

      evidenceRef: [
        "src_periop_medication_consensus"
      ]
    },


    // -------------------------------------------------------------------------
    // H. RESPIRATORY
    // -------------------------------------------------------------------------

    inhaled_bronchodilator: {
      id: "inhaled_bronchodilator",
      genericName: "Inhaled Bronchodilator",
      aliases: [
        "Salbutamol",
        "Albuterol",
        "Ipratropium",
        "Tiotropium"
      ],
      classId: "RESPIRATORY",
      category: "Bronchodilator",

      dayOfSurgery: {
        status: "CONTINUE",
        recommendation:
          "يُستمر عادةً بالعلاج الاستنشاقي المزمن ويُفضل تحسين السيطرة على airway disease قبل التخدير."
      },

      postoperativeRestart: {
        status: "CONTINUE"
      },

      safetyFlags: [
        "BRONCHOSPASM_IF_WITHHELD"
      ],

      evidenceRef: [
        "src_periop_medication_consensus"
      ]
    }
  },


  // ===========================================================================
  // 6. HIGH-RISK DRUG INTERACTIONS
  // ===========================================================================

  interactions: {

    maoi_meperidine: {
      id: "maoi_meperidine",
      medicationIds: [
        "maoi"
      ],
      interactingAgents: [
        "Meperidine",
        "Pethidine"
      ],

      severity: "CRITICAL",

      effect:
        "خطر تفاعل سيروتونيني شديد واضطراب مركزي/هيموديناميكي.",

      recommendation:
        "تجنب Meperidine/Pethidine في المرضى الذين يتناولون MAOI.",

      action: "AVOID_INTERACTION",

      evidenceRef: [
        "src_periop_medication_consensus"
      ]
    },


    maoi_ephedrine: {
      id: "maoi_ephedrine",
      medicationIds: [
        "maoi"
      ],
      interactingAgents: [
        "Ephedrine"
      ],

      severity: "HIGH",

      effect:
        "احتمال استجابة ضغطية وهيموديناميكية شديدة بسبب التداخل مع sympathomimetic activity.",

      recommendation:
        "تجنب أو لا تستخدم إلا ضمن خطة تخدير متخصصة مع titration دقيق.",

      action: "AVOID_INTERACTION",

      evidenceRef: [
        "src_periop_medication_consensus"
      ]
    },


    maoi_dextromethorphan: {
      id: "maoi_dextromethorphan",
      medicationIds: [
        "maoi"
      ],
      interactingAgents: [
        "Dextromethorphan"
      ],

      severity: "CRITICAL",

      effect:
        "خطر serotonin toxicity.",

      recommendation:
        "تجنب التداخل.",

      action: "AVOID_INTERACTION",

      evidenceRef: [
        "src_periop_medication_consensus"
      ]
    },


    lithium_nsaids: {
      id: "lithium_nsaids",
      medicationIds: [
        "lithium"
      ],
      interactingAgents: [
        "NSAIDs"
      ],

      severity: "HIGH",

      effect:
        "NSAIDs قد ترفع مستويات lithium وتزيد خطر السمية.",

      recommendation:
        "استخدم بحذر شديد وراقب renal function وclinical toxicity عند الحاجة.",

      action: "INDIVIDUALIZE",

      evidenceRef: [
        "src_periop_medication_consensus"
      ]
    },


    lithium_ace_arb: {
      id: "lithium_ace_arb",
      medicationIds: [
        "lithium"
      ],
      interactingAgents: [
        "ACE inhibitors",
        "ARBs"
      ],

      severity: "HIGH",

      effect:
        "قد ترتفع مستويات lithium بسبب انخفاض clearance.",

      recommendation:
        "تقييم renal function وlithium exposure عند الجمع.",

      action: "INDIVIDUALIZE",

      evidenceRef: [
        "src_periop_medication_consensus"
      ]
    },


    lithium_diuretics: {
      id: "lithium_diuretics",
      medicationIds: [
        "lithium"
      ],
      interactingAgents: [
        "Thiazide diuretics",
        "Some diuretics"
      ],

      severity: "HIGH",

      effect:
        "قد ينخفض lithium clearance وتزداد مستويات الدواء.",

      recommendation:
        "تجنب التغييرات غير الضرورية وراقب renal function/electrolytes/lithium عندما يكون ذلك مناسباً.",

      action: "INDIVIDUALIZE",

      evidenceRef: [
        "src_periop_medication_consensus"
      ]
    },


    lithium_neuromuscular_blockers: {
      id: "lithium_neuromuscular_blockers",
      medicationIds: [
        "lithium"
      ],

      interactingAgents: [
        "Non-depolarizing neuromuscular blockers",
        "Depolarizing neuromuscular blockers"
      ],

      severity: "HIGH",

      effect:
        "قد يطول تأثير neuromuscular blockade.",

      recommendation:
        "استخدم quantitative neuromuscular monitoring عند توفره وعدّل الجرعات حسب الاستجابة.",

      action: "AVOID_INTERACTION",

      evidenceRef: [
        "src_periop_medication_consensus"
      ]
    },


    ssri_serotonergic_opioids: {
      id: "ssri_serotonergic_opioids",
      medicationIds: [
        "ssri"
      ],

      interactingAgents: [
        "Tramadol",
        "Meperidine",
        "Other serotonergic opioids"
      ],

      severity: "HIGH",

      effect:
        "زيادة خطر serotonin toxicity.",

      recommendation:
        "تقييم البدائل وتجنب combinations عالية الخطورة متى أمكن.",

      action: "AVOID_INTERACTION",

      evidenceRef: [
        "src_periop_medication_consensus"
      ]
    },


    glp1_aspiration: {
      id: "glp1_aspiration",
      medicationIds: [
        "semaglutide",
        "tirzepatide"
      ],

      interactingAgents: [
        "General anesthesia",
        "Deep sedation"
      ],

      severity: "HIGH",

      effect:
        "تأخر gastric emptying قد يزيد residual gastric content وخطر aspiration لدى المرضى مرتفعي الخطورة.",

      recommendation:
        "قيّم أعراض GI ومرحلة dose escalation والجرعة والحالات المرافقة، واستخدم strategies لتقليل aspiration risk عندما تكون مطلوبة.",

      action: "INDIVIDUALIZE",

      evidenceRef: [
        "src_multisociety_glp1_2024",
        "src_glp1_consensus_2025",
        "src_ada_2026"
      ]
    },


    sglt2_euglycemic_dka: {
      id: "sglt2_euglycemic_dka",
      medicationIds: [
        "empagliflozin",
        "dapagliflozin",
        "canagliflozin",
        "ertugliflozin"
      ],

      interactingAgents: [
        "Perioperative fasting",
        "Surgical stress",
        "Reduced carbohydrate intake",
        "Dehydration"
      ],

      severity: "CRITICAL",

      effect:
        "زيادة خطر euglycemic diabetic ketoacidosis / metabolic acidosis.",

      recommendation:
        "احجب SGLT2 inhibitor قبل الجراحة المخططة حسب الدواء، وقيّم ketones/anion gap عند الاشتباه.",

      action: "HOLD",

      evidenceRef: [
        "src_acc_aha_periop_2024",
        "src_ada_2026",
        "src_spaqi_sglt2_2026"
      ]
    },


    anticoagulant_neuraxial: {
      id: "anticoagulant_neuraxial",
      medicationIds: [
        "warfarin",
        "apixaban",
        "rivaroxaban",
        "edoxaban",
        "dabigatran"
      ],

      interactingAgents: [
        "Neuraxial anesthesia",
        "Deep plexus block",
        "Deep peripheral block"
      ],

      severity: "CRITICAL",

      effect:
        "خطر neuraxial/deep-site hematoma مع احتمال عواقب عصبية كارثية.",

      recommendation:
        "لا يُتخذ قرار block من اسم الدواء فقط. يجب تطبيق ASRA guidance حسب الدواء، الجرعة، آخر جرعة، renal function، والمستوى المطلوب من anticoagulant activity.",

      action: "SPECIALIST_REVIEW",

      evidenceRef: [
        "src_asra_5th_2025"
      ]
    },


    antiplatelet_neuraxial: {
      id: "antiplatelet_neuraxial",
      medicationIds: [
        "clopidogrel",
        "ticagrelor",
        "prasugrel"
      ],

      interactingAgents: [
        "Neuraxial anesthesia",
        "Deep plexus block",
        "Deep peripheral block"
      ],

      severity: "CRITICAL",

      effect:
        "زيادة خطر النزف في المواقع غير القابلة للضغط.",

      recommendation:
        "تطبيق ASRA-specific interruption guidance وعدم الإيقاف دون موازنة خطر stent thrombosis أو ischemic events.",

      action: "SPECIALIST_REVIEW",

      evidenceRef: [
        "src_asra_5th_2025"
      ]
    },


    aspirin_bleeding: {
      id: "aspirin_bleeding",
      medicationIds: [
        "aspirin"
      ],

      interactingAgents: [
        "Surgery with high bleeding risk",
        "Other antithrombotic agents"
      ],

      severity: "MODERATE_TO_HIGH",

      effect:
        "زيادة خطر النزف بحسب العملية وتركيبة العلاج المضاد للتخثر/الصفيحات.",

      recommendation:
        "وازن indication وخطر thrombosis مقابل bleeding risk بدلاً من إيقاف aspirin بصورة آلية.",

      action: "INDIVIDUALIZE",

      evidenceRef: [
        "src_acc_aha_periop_2024",
        "src_asra_5th_2025"
      ]
    },


    levodopa_dopamine_antagonist: {
      id: "levodopa_dopamine_antagonist",
      medicationIds: [
        "levodopa"
      ],

      interactingAgents: [
        "Dopamine-antagonist antiemetics",
        "Certain antipsychotics"
      ],

      severity: "HIGH",

      effect:
        "قد تتفاقم أعراض Parkinsonism والrigidity عند حجب dopaminergic therapy أو إعطاء dopamine antagonists غير مناسبة.",

      recommendation:
        "استمر بالـ levodopa عند الإمكان وتجنب dopamine-antagonist agents عندما توجد بدائل مناسبة.",

      action: "AVOID_INTERACTION",

      evidenceRef: [
        "src_periop_medication_consensus"
      ]
    },


    herbal_bleeding: {
      id: "herbal_bleeding",
      medicationIds: [
        "garlic_supplement",
        "ginkgo",
        "ginseng"
      ],

      interactingAgents: [
        "Anticoagulants",
        "Antiplatelets",
        "High bleeding-risk surgery"
      ],

      severity: "MODERATE",

      effect:
        "قد تزداد مخاطر النزف أو تتغير تأثيرات أدوية أخرى.",

      recommendation:
        "اسأل تحديداً عن المكملات العشبية ولا تفترض أن المريض يعتبرها أدوية.",

      action: "HOLD",

      evidenceRef: [
        "src_periop_medication_consensus"
      ]
    }
  },


  // ===========================================================================
  // 7. NEURAXIAL / REGIONAL SAFETY MATRIX
  // ===========================================================================

  neuraxialSafety: {

    generalRule: {
      statement:
        "Neuraxial and deep plexus/deep peripheral blocks require medication-specific antithrombotic assessment.",

      requiredInputs: [
        "Medication",
        "Dose category",
        "Time since last dose",
        "Renal function",
        "Relevant laboratory data",
        "Planned block",
        "Restart timing"
      ],

      evidenceRef: [
        "src_asra_5th_2025"
      ]
    },

    anticoagulants: {
      warfarin: {
        medicationId: "warfarin",
        requiresINRAssessment: true,
        status: "SPECIALIST_REVIEW"
      },

      apixaban: {
        medicationId: "apixaban",
        requiresDoseClassification: true,
        requiresRenalAssessment: true,
        status: "SPECIALIST_REVIEW"
      },

      rivaroxaban: {
        medicationId: "rivaroxaban",
        requiresDoseClassification: true,
        requiresRenalAssessment: true,
        status: "SPECIALIST_REVIEW"
      },

      edoxaban: {
        medicationId: "edoxaban",
        requiresDoseClassification: true,
        requiresRenalAssessment: true,
        status: "SPECIALIST_REVIEW"
      },

      dabigatran: {
        medicationId: "dabigatran",
        requiresDoseClassification: true,
        requiresRenalAssessment: true,
        status: "SPECIALIST_REVIEW"
      }
    },

    antiplatelets: {

      aspirin: {
        medicationId: "aspirin",
        status: "INDIVIDUALIZE"
      },

      clopidogrel: {
        medicationId: "clopidogrel",
        status: "SPECIALIST_REVIEW"
      },

      ticagrelor: {
        medicationId: "ticagrelor",
        status: "SPECIALIST_REVIEW"
      },

      prasugrel: {
        medicationId: "prasugrel",
        status: "SPECIALIST_REVIEW"
      }
    }
  },


  // ===========================================================================
  // 8. PERIOPERATIVE DECISION RULES
  // ===========================================================================

  decisionRules: {

    electiveSurgery: {
      id: "electiveSurgery",
      description:
        "قاعدة القرار الأساسية للجراحة الانتخابية",

      steps: [
        "Confirm medication and indication",
        "Determine surgery bleeding risk",
        "Determine thrombotic risk",
        "Determine anesthesia technique",
        "Assess renal and hepatic function",
        "Assess aspiration risk",
        "Check last medication dose",
        "Apply medication-specific rule",
        "Create postoperative restart plan"
      ]
    },


    emergencySurgery: {
      id: "emergencySurgery",
      description:
        "في الجراحة الإسعافية لا تنتظر دائماً اكتمال فترة الإيقاف؛ يجب تقييم أثر الدواء الحالي ومخاطر التأخير.",

      steps: [
        "Identify last dose",
        "Identify medication and dose",
        "Assess bleeding risk",
        "Assess thrombotic risk",
        "Assess renal function",
        "Assess airway/aspiration risk",
        "Use reversal strategy only when clinically indicated",
        "Document multidisciplinary decision"
      ]
    },


    neuraxialDecision: {
      id: "neuraxialDecision",
      description:
        "قرار neuraxial/deep regional anesthesia",

      steps: [
        "Identify exact antithrombotic agent",
        "Identify low-dose vs high-dose regimen where applicable",
        "Calculate/verify time since last dose",
        "Assess renal function",
        "Review relevant laboratory or drug-specific assay when indicated",
        "Apply ASRA fifth-edition guidance",
        "Assess catheter insertion/removal timing",
        "Plan postoperative restart"
      ],

      evidenceRef: [
        "src_asra_5th_2025"
      ]
    },


    glp1AspirationDecision: {
      id: "glp1AspirationDecision",

      steps: [
        "Identify GLP-1/GIP agent",
        "Determine dose-escalation vs maintenance phase",
        "Ask about nausea",
        "Ask about vomiting",
        "Ask about bloating / early satiety",
        "Assess known gastroparesis or delayed gastric emptying",
        "Assess procedure/anesthesia aspiration risk",
        "Consider liquid-diet mitigation when indicated",
        "Consider gastric ultrasound where available",
        "Consider aspiration-mitigating anesthesia plan",
        "Consider postponement if risk remains unacceptable"
      ],

      evidenceRef: [
        "src_multisociety_glp1_2024",
        "src_glp1_consensus_2025"
      ]
    },


    sglt2Decision: {
      id: "sglt2Decision",

      steps: [
        "Identify exact SGLT2 inhibitor",
        "Determine scheduled surgery date",
        "Verify last dose",
        "Assess hydration",
        "Assess metabolic status",
        "Check ketones when clinically indicated",
        "Check anion gap/bicarbonate when clinically indicated",
        "Restart only after clinical recovery and adequate nutrition/hydration"
      ],

      evidenceRef: [
        "src_acc_aha_periop_2024",
        "src_ada_2026",
        "src_spaqi_sglt2_2026"
      ]
    }
  },


  // ===========================================================================
  // 9. RESTART PRINCIPLES
  // ===========================================================================

  postoperativeRestartPrinciples: {

    general: {
      id: "general",
      rules: [
        "Restart chronic medication only when clinically appropriate.",
        "Confirm adequate oral intake when the medication requires enteral administration.",
        "Confirm hemodynamic stability.",
        "Confirm renal/hepatic function where relevant.",
        "Confirm postoperative bleeding control.",
        "Reassess thrombosis risk after interruption.",
        "Avoid automatic restart of drugs with active contraindications."
      ]
    },

    anticoagulants: {
      rules: [
        "Hemostasis must be established.",
        "Restart timing depends on procedure bleeding risk.",
        "Neuraxial catheter status must be considered.",
        "Thrombotic indication must be reassessed."
      ],
      evidenceRef: [
        "src_asra_5th_2025"
      ]
    },

    diabetes: {
      rules: [
        "Resume glucose management according to nutritional status.",
        "Avoid hypoglycemia.",
        "Never omit essential basal insulin in type 1 diabetes without an alternative insulin strategy.",
        "SGLT2 inhibitors require special consideration after surgery."
      ],

      evidenceRef: [
        "src_ada_2026"
      ]
    },

    parkinson: {
      rules: [
        "Resume dopaminergic therapy as early as feasible.",
        "Avoid prolonged interruption.",
        "Plan alternative administration route when prolonged NPO is anticipated."
      ]
    }
  },


  // ===========================================================================
  // 10. CLINICAL SAFETY FLAGS
  // ===========================================================================

  safetyFlags: {

    EUGLYCEMIC_DKA: {
      severity: "CRITICAL",
      label: "Euglycemic diabetic ketoacidosis risk"
    },

    ASPIRATION_RISK: {
      severity: "HIGH",
      label: "Aspiration risk"
    },

    INTRAOPERATIVE_HYPOTENSION: {
      severity: "HIGH",
      label: "Intraoperative hypotension risk"
    },

    BLEEDING: {
      severity: "HIGH",
      label: "Bleeding risk"
    },

    NEURAXIAL_HEMATOMA: {
      severity: "CRITICAL",
      label: "Neuraxial/deep-site hematoma risk"
    },

    STENT_THROMBOSIS: {
      severity: "CRITICAL",
      label: "Coronary stent thrombosis risk"
    },

    THROMBOEMBOLISM_IF_WITHHELD: {
      severity: "HIGH",
      label: "Thromboembolic risk if medication withheld"
    },

    LITHIUM_TOXICITY: {
      severity: "HIGH",
      label: "Lithium toxicity"
    },

    PROLONGED_NEUROMUSCULAR_BLOCKADE: {
      severity: "HIGH",
      label: "Potential prolonged neuromuscular blockade"
    },

    SEROTONIN_SYNDROME: {
      severity: "CRITICAL",
      label: "Serotonin toxicity risk"
    },

    WITHDRAWAL_IF_ABRUPTLY_STOPPED: {
      severity: "HIGH",
      label: "Withdrawal/rebound risk"
    },

    BRONCHOSPASM_IF_WITHHELD: {
      severity: "HIGH",
      label: "Bronchospasm risk if chronic respiratory therapy withheld"
    },

    HYPOGLYCEMIA: {
      severity: "HIGH",
      label: "Hypoglycemia risk"
    },

    HYPERGLYCEMIA: {
      severity: "MODERATE",
      label: "Hyperglycemia risk"
    },

    RENAL_DYSFUNCTION: {
      severity: "HIGH",
      label: "Renal-function related risk"
    },

    HYPOTENSION: {
      severity: "HIGH",
      label: "Hypotension"
    },

    BRADYCARDIA: {
      severity: "HIGH",
      label: "Bradycardia"
    }
  },


  // ===========================================================================
  // 11. SEARCH / ALIAS INDEX
  // ===========================================================================

  aliasIndex: {

    ozempic: "semaglutide",
    wegovy: "semaglutide",
    rybelsus: "semaglutide",

    mounjaro: "tirzepatide",
    zepbound: "tirzepatide",

    jardiance: "empagliflozin",
    farxiga: "dapagliflozin",
    forxiga: "dapagliflozin",
    invokana: "canagliflozin",
    steglatro: "ertugliflozin",

    glucophage: "metformin",

    coumadin: "warfarin",

    eliquis: "apixaban",
    xarelto: "rivaroxaban",
    savaysa: "edoxaban",
    lixiana: "edoxaban",
    pradaxa: "dabigatran",

    plavix: "clopidogrel",
    brilinta: "ticagrelor",
    effient: "prasugrel",

    asa: "aspirin",

    lithiumcarbonate: "lithium",

    carbidopa: "levodopa",
    benserazide: "levodopa",

    hypericumperforatum: "st_johns_wort",
    ginkgo_biloba: "ginkgo",
    panax_ginseng: "ginseng"
  },


  // ===========================================================================
  // 12. SEARCH NORMALIZATION
  // ===========================================================================

  searchNormalization: {

    removeCharacters: [
      "-",
      "_",
      "/",
      ".",
      ",",
      "(",
      ")"
    ],

    lowercase: true,

    trimWhitespace: true,

    searchableFields: [
      "id",
      "genericName",
      "aliases",
      "category"
    ]
  },


  // ===========================================================================
  // 13. VERSION CHANGE LOG
  // ===========================================================================

  changeLog: [

    {
      version: "11.0.0",
      changes: [
        "Initial Phase 11.0 chronic medication reference dataset",
        "Added medication continuation/withholding contract",
        "Added GLP-1 individualized aspiration-risk model",
        "Added SGLT2 perioperative metabolic-risk model",
        "Added cardiovascular medication framework",
        "Added anticoagulant and antiplatelet framework",
        "Added neuraxial/regional anesthesia safety layer",
        "Added major anesthesia-related drug interactions",
        "Added postoperative restart principles",
        "Added renal-function modifiers",
        "Added evidence traceability"
      ]
    }
  ]
};
