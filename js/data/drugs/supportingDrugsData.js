/**
 * AnesthesiaX — Drug Center: Supporting & Emergency Drugs Data Module
 * Component: Supporting Drugs (Vasopressors, Emergency/ACLS, Antiemetics, Aspiration Prophylaxis, Local Anesthetics)
 * File: js/data/drugs/supportingDrugsData.js
 *
 * Advanced Clinical Decision Support (CDS) Dataset — Final Verified Production-Grade Schema
 * Validated against FDA Prescribing Information, AHA/ACLS Guidelines, ASRA LAST Checklist, and MHAUS Protocols.
 */

import { DOSE_UNITS } from "../common/doseUnits.js";

export const supportingDrugsData = [
  // =========================================================================
  // A) VASOPRESSORS & INOTROPES (رافعات الضغط ومنشطات القلب)
  // =========================================================================
  {
    id: "ephedrine",
    name: {
      generic: "Ephedrine Sulfate",
      arabic: "إفيدرين",
      brandNames: ["Akovaz", "Corphedra"]
    },
    classification: {
      triadComponent: "supporting",
      category: "vasopressor_inotrope",
      subcategory: "mixed_sympathomimetic"
    },
    safety: {
      highRiskMedication: false,
      requiresAirwayReady: false,
      requiresRespiratoryMonitoring: false
    },
    clinicalFlags: ["tachyphylaxis_risk", "indirect_acting", "tachycardia_risk"],
    indications: [
      {
        id: "anesthesia_hypotension",
        label: { en: "Treatment of clinically important hypotension during anesthesia", ar: "علاج هبوط ضغط الدم المصاحب للتخدير العام أو النصفي خاصة عند ترافقه مع بطء القلب" }
      }
    ],
    presentations: [
      {
        value: 5,
        concentration: 5,
        unit: DOSE_UNITS.MG_PER_ML,
        label: "5 mg/mL (مخفف جاهز للحقن المباشر - 50 mg في 10 mL سالاين)",
        requiresDilution: false,
        isDefault: true
      },
      {
        value: 50,
        concentration: 50,
        unit: DOSE_UNITS.MG_PER_ML,
        label: "50 mg/mL Concentrate (أمبولة مركزة 1 مل - تتطلب التخفيف الإلزامي إلى 5 mg/mL)",
        requiresDilution: true
      }
    ],
    pharmacodynamics: {
      onset: "فوري (وريدياً)",
      peak: "2 – 5 دقائق",
      clinicalDuration: "10 – 60 دقيقة"
    },
    clinicalContexts: [
      {
        id: "iv_bolus_hypotension",
        population: "adult",
        route: "IV",
        label: "جرعة دفعية وريدية لمعايرة هبوط الضغط (IV Bolus Titration)",
        doseMin: 5.0,
        doseMax: 10.0,
        unit: DOSE_UNITS.MG_FIXED,
        doseType: "fixed_bolus",
        basis: "titrated_to_hemodynamic_target",
        administration: {
          method: "slow_iv_push",
          dilutionProtocol: "يُسحب 1 مل (50 ملغ) مع 9 مل سالاين ليصبح التركيز 5 ملغ/مل ويُحقن 1-2 مل لكل جرعة."
        },
        validation: {
          requireMonitoringConfirmation: true
        },
        isDefault: true,
        note: "يرفع الضغط الشرياني والنبض والنتاج القلبي عبر تنبيه مستقبلات ألفا وبيتا المباشر وغير المباشر."
      }
    ],
    warnings: [
      "تسرع ضربات القلب اللانظمي وخطر نقص تروية العضلة القلبية في مرضى داء الشرايين التاجية.",
      "ظاهرة زوال الاستجابة السريع (Tachyphylaxis) مع تكرار الجرعات نتيجة نفاد الكاتيكولامينات الذاتية."
    ],
    contraindications: [
      "فرط الحساسية للإفيدرين.",
      "تزامن الاستخدام مع مثبطات MAOIs."
    ]
  },

  {
    id: "phenylephrine",
    name: {
      generic: "Phenylephrine HCl",
      arabic: "فينيليفرين",
      brandNames: ["Neo-Synephrine", "Vazculep"]
    },
    classification: {
      triadComponent: "supporting",
      category: "vasopressor_inotrope",
      subcategory: "pure_alpha1_agonist"
    },
    safety: {
      highRiskMedication: true,
      requiresAirwayReady: false,
      requiresRespiratoryMonitoring: false
    },
    clinicalFlags: ["pure_vasoconstrictor", "reflex_bradycardia", "coronary_safe"],
    indications: [
      {
        id: "perioperative_hypotension",
        label: { en: "Treatment of perioperative hypotension (general/regional anesthesia)", ar: "علاج هبوط الضغط الشرياني أثناء التخدير العام أو النصفي خاصة عند تسرع القلب" }
      }
    ],
    presentations: [
      {
        value: 100,
        concentration: 100,
        unit: DOSE_UNITS.MCG_PER_ML,
        label: "100 mcg/mL (مخفف جاهز للحقن الدفعي - 10 mg في 100 mL سالاين)",
        requiresDilution: false,
        isDefault: true
      },
      {
        value: 50,
        concentration: 50,
        unit: DOSE_UNITS.MCG_PER_ML,
        label: "50 mcg/mL (مخفف للحقن الدفعي الدقيق)"
      },
      {
        value: 10,
        concentration: 10,
        unit: DOSE_UNITS.MG_PER_ML,
        label: "10 mg/mL Concentrate (أمبولة مركزة 1 مل - تتطلب التخفيف الإلزامي قبل الحقن)",
        requiresDilution: true
      }
    ],
    pharmacodynamics: {
      onset: "فوري تقريباً (وريدياً)",
      peak: "1 – 2 دقيقة",
      clinicalDuration: "5 – 15 دقيقة"
    },
    clinicalContexts: [
      {
        id: "iv_bolus_hypotension",
        population: "adult",
        route: "IV",
        label: "جرعة دفعية وريدية لمعايرة هبوط الضغط (IV Bolus Titration)",
        doseMin: 50.0,
        doseMax: 100.0,
        unit: DOSE_UNITS.MCG_FIXED,
        doseType: "fixed_bolus",
        basis: "titrated_to_hemodynamic_target",
        administration: {
          method: "rapid_iv_push",
          dilutionProtocol: "يُسحب 1 مل (10 ملغ) ويُحل في كيس 100 مل سالاين ليصبح بتركيز 100 mcg/mL ويُحقن 0.5-1 مل لكل جرعة."
        },
        validation: {
          requireMonitoringConfirmation: true
        },
        isDefault: true,
        note: "قابض وعائي نقي (Pure Alpha-1) يرفع المقاومة الوعائية الجهازية (SVR) بدون تنبيه مباشر لعضلة القلب."
      },
      {
        id: "fixed_rate_infusion",
        population: "adult",
        route: "IV Infusion",
        label: "تسريب وريدي بمعدل زمني ثابت (Fixed-Rate Continuous Infusion)",
        doseMin: 20.0,
        doseMax: 100.0,
        unit: DOSE_UNITS.MCG_PER_MIN,
        doseType: "fixed_infusion_min",
        basis: "titrated_to_map_target",
        administration: {
          method: "infusion_pump_only"
        },
        validation: {
          requireMonitoringConfirmation: true
        },
        note: "تسريب وريدي بمعدل ثابت بالدقيقة للمحافظة على الضغط الشرياني الوسطي (MAP)."
      }
    ],
    warnings: [
      "بطء قلب انعكاسي (Reflex Bradycardia) ناجم عن التنبيه المبهمي استجابة لارتفاع الضغط؛ يُستخدم بحذر إذا كان النبض منخفضاً.",
      "زيادة الحمل اللاحق (Afterload) وخفض النتاج القلبي في مرضى القصور القلبي الشديد."
    ],
    contraindications: [
      "ارتفاع الضغط الشرياني الشديد.",
      "تسرع القلب البطيني أو الرجفان.",
      "فرط الحساسية للفينيليفرين."
    ]
  },

  {
    id: "norepinephrine",
    name: {
      generic: "Norepinephrine Bitartrate (Noradrenaline)",
      arabic: "نورإبينفرين (نورأدرينالين)",
      brandNames: ["Levophed"]
    },
    classification: {
      triadComponent: "supporting",
      category: "vasopressor_inotrope",
      subcategory: "potent_alpha_beta1_agonist"
    },
    safety: {
      highRiskMedication: true,
      requiresAirwayReady: false,
      requiresRespiratoryMonitoring: false
    },
    clinicalFlags: ["central_line_preferred", "first_line_septic_shock", "potent_vasoconstrictor"],
    indications: [
      {
        id: "shock_hypotension",
        label: { en: "Restoration of blood pressure in acute hypotensive states and septic shock", ar: "رافع الضغط الخياري الأول في الصدمة الإنتانية والصدمة الوعائية وهبوط الضغط الحاد" }
      }
    ],
    presentations: [
      {
        value: 16,
        concentration: 16,
        unit: DOSE_UNITS.MCG_PER_ML,
        label: "16 mcg/mL (محلول تسريب قياسي: 4 ملغ في 250 مل D5W)",
        requiresDilution: false,
        isDefault: true
      },
      {
        value: 32,
        concentration: 32,
        unit: DOSE_UNITS.MCG_PER_ML,
        label: "32 mcg/mL (محلول تسريب مركز: 8 ملغ في 250 مل D5W)"
      }
    ],
    pharmacodynamics: {
      onset: "1 – 2 دقيقة من بدء التسريب",
      peak: "سريع",
      clinicalDuration: "1 – 2 دقيقة بعد إيقاف التسريب (عمر نصف فائق القصر)"
    },
    clinicalContexts: [
      {
        id: "septic_vasodilatory_shock",
        population: "adult",
        route: "IV Infusion",
        label: "التسريب المستمر لصدمة الإنتان وهبوط الضغط الحاد (Continuous Infusion Rate)",
        doseMin: 0.02,
        doseMax: 0.5,
        unit: DOSE_UNITS.MCG_PER_KG_MIN,
        doseType: "weight_infusion_min",
        basis: "titrated_to_target_map",
        administration: {
          method: "continuous_infusion_only",
          dilutionProtocol: "تُخفف أمبولة 4 ملغ في 250-500 مل ديكستروز 5% (D5W). يُمنع التخفيف بالسالاين المنفرد لتجنب تأكسد الدواء."
        },
        weightPolicy: {
          preferred: "TBW"
        },
        validation: {
          requireWeight: true,
          requireMonitoringConfirmation: true
        },
        isDefault: true,
        note: "تتم المعايرة لتحقيق ضغط شرياني وسطي (MAP ≥ 65 mmHg)."
      }
    ],
    warnings: [
      "⚠️ خطر النخر النسيجي عند التسرب المحيطي (Extravasation Necrosis): يجب تفضيل القثطرة المركزية؛ عند التسرب يُحقن الفنتولامين (Phentolamine) موضعياً.",
      "نقص تروية الأعضاء المحيطية والأطراف والكلية عند الجرعات العالية في غياب الإنعاش الكافي بالسوائل."
    ],
    contraindications: [
      "نقص حجم الدم غير المعوض بالسوائل (إلا كإجراء طارئ مؤقت أثناء الإنعاش بالسوائل)."
    ]
  },

  {
    id: "epinephrine",
    name: {
      generic: "Epinephrine (Adrenaline)",
      arabic: "إبينفرين (أدرينالين)",
      brandNames: ["Adrenalin"]
    },
    classification: {
      triadComponent: "supporting",
      category: "vasopressor_inotrope",
      subcategory: "potent_direct_alpha_beta_agonist"
    },
    safety: {
      highRiskMedication: true,
      requiresAirwayReady: false,
      requiresRespiratoryMonitoring: false
    },
    clinicalFlags: ["anaphylaxis_first_line", "acls_cardiac_arrest", "potent_inotrope"],
    indications: [
      {
        id: "cardiac_arrest_acls",
        label: { en: "Cardiac arrest (VF, pVT, Asystole, PEA)", ar: "إنعاش توقف القلب في بروتوكول ACLS (الرجفان البطيني، اللانَبضية، تفارق النشاط الكهربائي)" }
      },
      {
        id: "anaphylaxis_severe",
        label: { en: "Severe anaphylaxis and life-threatening bronchospasm", ar: "الصدمة التحسسية التأقية الشديدة والتشنج القصبي الحرج" }
      }
    ],
    presentations: [
      {
        value: 1,
        concentration: 1,
        unit: DOSE_UNITS.MG_PER_ML,
        label: "1 mg/mL (1:1,000 Ampoule - للحقن العضلي في التحسس أو التخفيف)",
        isDefault: true
      },
      {
        value: 100,
        concentration: 100,
        unit: DOSE_UNITS.MCG_PER_ML,
        label: "100 mcg/mL (1:10,000 Syringe - 1 mg / 10 mL مخصص لتوقف القلب ACLS)"
      }
    ],
    pharmacodynamics: {
      onset: "فوري (وريدياً) / 3 – 5 دقائق (عضلياً)",
      peak: "سريع",
      clinicalDuration: "5 – 10 دقائق (وريدياً)"
    },
    clinicalContexts: [
      {
        id: "acls_arrest_bolus",
        population: "adult",
        route: "IV",
        label: "إنعاش توقف القلب للبالغين (ACLS Cardiac Arrest IV Bolus)",
        doseMin: 1.0,
        doseMax: 1.0,
        unit: DOSE_UNITS.MG_FIXED,
        doseType: "fixed_bolus",
        basis: "acls_guideline_protocol",
        administration: {
          method: "rapid_iv_push",
          flushRequirement: "يُتبع بدفعة 20 مل سالاين مع رفع الطرف المصاب."
        },
        validation: {
          requireMonitoringConfirmation: true
        },
        isDefault: true,
        note: "تُكرر الجرعة (1 mg IV بتركيز 1:10,000) كل 3 إلى 5 دقائق أثناء الإنعاش القلبي الرئوي."
      },
      {
        id: "anaphylaxis_im_adult",
        population: "adult",
        route: "IM",
        label: "علاج الصدمة التأقية بالعضل (Anaphylaxis IM First-line)",
        doseMin: 0.3,
        doseMax: 0.5,
        unit: DOSE_UNITS.MG_FIXED,
        doseType: "fixed_bolus",
        basis: "emergency_guideline",
        administration: {
          method: "deep_im",
          site: "حقن عضلي في الوجه الأمامي الوحشي لمنتصف الفخذ (Anterolateral Thigh)"
        },
        validation: {
          requireAge: true
        },
        note: "يُستخدم تركيز 1:1,000 (1 mg/mL) غير مخفف؛ تُكرر الجرعة كل 5-15 دقيقة عند عدم الاستجابة."
      }
    ],
    warnings: [
      "⚠️ خطأ الجرعة والتراكيز: الخلط بين تركيز 1:1,000 (العضلي) و 1:10,000 (الوريدي) يسبب نوبات فرط ضغط كارثية ورجفان بطيني.",
      "يرفع استهلاك القلب للأكسجين ويزيد بشكل ملحوظ مستوى سكر الدم وحمض اللاكتيك."
    ],
    contraindications: [
      "لا توجد موانع استعمال مطلقة في حالات الطوارئ القاتلة (توقف القلب والصدمة التأقية الشديدة)."
    ]
  },

  {
    id: "dopamine",
    name: {
      generic: "Dopamine HCl",
      arabic: "دوبامين",
      brandNames: ["Intropin"]
    },
    classification: {
      triadComponent: "supporting",
      category: "vasopressor_inotrope",
      subcategory: "dose_dependent_inotropic_vasopressor"
    },
    safety: {
      highRiskMedication: true,
      requiresAirwayReady: false,
      requiresRespiratoryMonitoring: false
    },
    clinicalFlags: ["dose_dependent_receptors", "tachyarrhythmia_risk"],
    indications: [
      {
        id: "cardiogenic_distributive_shock",
        label: { en: "Hemodynamic support in shock and symptomatic bradycardia", ar: "دعم التروية الدموية في الصدمة القلبية وهبوط الضغط وبطء القلب العرضي المعند" }
      }
    ],
    presentations: [
      {
        value: 40,
        concentration: 40,
        unit: DOSE_UNITS.MG_PER_ML,
        label: "40 mg/mL (أمبولة 200 ملغ في 5 مل - مركز يتطلب التخفيف الإلزامي)",
        requiresDilution: true,
        isDefault: true
      }
    ],
    pharmacodynamics: {
      onset: "2 – 5 دقائق",
      peak: "سريع",
      clinicalDuration: "أقل من 10 دقائق بعد إيقاف التسريب"
    },
    clinicalContexts: [
      {
        id: "inotropic_infusion_intermediate",
        population: "adult",
        route: "IV Infusion",
        label: "التسريب المنشط للقلوصية (Beta-1 Inotropic Range)",
        doseMin: 2.0,
        doseMax: 10.0,
        unit: DOSE_UNITS.MCG_PER_KG_MIN,
        doseType: "weight_infusion_min",
        basis: "titrated_to_cardiac_output",
        administration: {
          method: "continuous_infusion_only",
          dilutionProtocol: "يُخفف 400 ملغ في 250 أو 500 مل ديكستروز 5% أو سالاين."
        },
        weightPolicy: {
          preferred: "TBW"
        },
        validation: {
          requireWeight: true,
          requireMonitoringConfirmation: true
        },
        isDefault: true,
        note: "الجرعة المتوسطة (2-10 mcg/kg/min) تزيد من قلوصية العضلة القلبية والنبض والنتاج القلبي."
      }
    ],
    warnings: [
      "معدل مرتفع لحدوث تسرع القلب اللانظمي والرجفان الأذيني مقارنة بالنورأدرينالين.",
      "التسرب المحيطي يسبب نخراً نسيجياً (يُعالج بحقن الفنتولامين موضعياً)."
    ],
    contraindications: [
      "الرجفان البطيني وتسرع القلب البطيني غير المسيطر عليه.",
      "ورم القواتم (Pheochromocytoma)."
    ]
  },

  // =========================================================================
  // B) EMERGENCY & RESUSCITATION (أدوية الإنعاش والطوارئ)
  // =========================================================================
  {
    id: "atropine",
    name: {
      generic: "Atropine Sulfate",
      arabic: "أتروبين",
      brandNames: ["Atropine"]
    },
    classification: {
      triadComponent: "supporting",
      category: "emergency_resuscitation",
      subcategory: "antimuscarinic_anticholinergic"
    },
    safety: {
      highRiskMedication: false,
      requiresAirwayReady: false,
      requiresRespiratoryMonitoring: false
    },
    clinicalFlags: ["acls_bradycardia"],
    indications: [
      {
        id: "symptomatic_bradycardia",
        label: { en: "Treatment of hemodynamically unstable symptomatic bradycardia", ar: "علاج بطء القلب العرضي غير المستقر ديناميكياً وفق بروتوكول ACLS" }
      }
    ],
    presentations: [
      {
        value: 1,
        concentration: 1,
        unit: DOSE_UNITS.MG_PER_ML,
        label: "1 mg/mL (أمبولة 1 ملغ في 1 مل)",
        isDefault: true
      },
      {
        value: 0.5,
        concentration: 0.5,
        unit: DOSE_UNITS.MG_PER_ML,
        label: "0.5 mg/mL (أمبولة 0.5 ملغ في 1 مل)"
      }
    ],
    pharmacodynamics: {
      onset: "فوري (وريدياً)",
      peak: "2 – 4 دقائق",
      clinicalDuration: "2 – 4 ساعات"
    },
    clinicalContexts: [
      {
        id: "acls_bradycardia_bolus_updated",
        population: "adult",
        route: "IV",
        label: "علاج بطء القلب العرضي (ACLS Symptomatic Bradycardia Bolus)",
        doseMin: 1.0,
        doseMax: 1.0,
        unit: DOSE_UNITS.MG_FIXED,
        doseType: "fixed_bolus",
        basis: "acls_guideline_protocol",
        administration: {
          method: "rapid_iv_push"
        },
        validation: {
          requireMonitoringConfirmation: true
        },
        isDefault: true,
        note: "توصي إرشادات ACLS بجرعة بدئية معيارية 1.0 mg وريدياً (لتفادي بطء القلب التناقضي)، وتُكرر كل 3-5 دقائق عند الحاجة (بحد أقصى 3 mg)."
      }
    ],
    warnings: [
      "⚠️ بطء قلب تناقضي (Paradoxical Bradycardia): إعطاء جرعات وريدية منخفضة جداً (<0.5 mg) أو الحقن البطيء جداً يسبب بطء قلب تناقضياً ناجم عن تنبيه مبهمي مركزي ومحيطي.",
      "يعبر الحاجز الدموي الدماغي (BBB) وقد يسبب متلازمة مضادات الكولين المركزية والتخليط العقلي لدى كبار السن."
    ],
    contraindications: [
      "الزرق ضيق الزاوية الحاد غير المعالج.",
      "الانسداد البولي أو الهضمي الميكانيكي."
    ]
  },

  {
    id: "amiodarone",
    name: {
      generic: "Amiodarone HCl",
      arabic: "أميودارون",
      brandNames: ["Cordarone", "Nexterone"]
    },
    classification: {
      triadComponent: "supporting",
      category: "emergency_resuscitation",
      subcategory: "class_iii_antiarrhythmic"
    },
    safety: {
      highRiskMedication: true,
      requiresAirwayReady: false,
      requiresRespiratoryMonitoring: false
    },
    clinicalFlags: ["acls_antiarrhythmic", "hypotension_risk"],
    indications: [
      {
        id: "acls_pulseless_vf_vt",
        label: { en: "Pulseless VF and VT unresponsive to CPR and defibrillation", ar: "إنعاش الرجفان البطيني وتسرع القلب البطيني عديم النبض المعند على الصدمات" }
      }
    ],
    presentations: [
      {
        value: 50,
        concentration: 50,
        unit: DOSE_UNITS.MG_PER_ML,
        label: "50 mg/mL (أمبولة 150 ملغ في 3 مل)",
        isDefault: true
      }
    ],
    pharmacodynamics: {
      onset: "فوري إلى دقائق",
      peak: "سريع",
      clinicalDuration: "عمر نصف إطراحي طويل جداً يمتد لأسابيع مع الجرعات المتكررة"
    },
    clinicalContexts: [
      {
        id: "acls_cardiac_arrest_first_dose",
        population: "adult",
        route: "IV",
        label: "الجرعة الأولى لتوقف القلب (ACLS Cardiac Arrest 1st Dose - VF/pVT)",
        doseMin: 300.0,
        doseMax: 300.0,
        unit: DOSE_UNITS.MG_FIXED,
        doseType: "fixed_bolus",
        basis: "acls_guideline_protocol",
        administration: {
          method: "rapid_iv_push",
          flushRequirement: "حقن وريدي دفعي سريع بعد الصدمة الثالثة متبوعاً بدفعة سالاين 20 مل."
        },
        validation: {
          requireMonitoringConfirmation: true
        },
        isDefault: true,
        note: "الجرعة الأولى 300 mg (أمبولتان) بعد الصدمة الكهربائية الثالثة."
      },
      {
        id: "acls_cardiac_arrest_second_dose",
        population: "adult",
        route: "IV",
        label: "الجرعة الثانية لتوقف القلب (ACLS Cardiac Arrest 2nd Dose - VF/pVT)",
        doseMin: 150.0,
        doseMax: 150.0,
        unit: DOSE_UNITS.MG_FIXED,
        doseType: "fixed_bolus",
        basis: "acls_guideline_protocol",
        administration: {
          method: "rapid_iv_push",
          flushRequirement: "حقن وريدي دفعي سريع متبوعاً بدفعة سالاين 20 مل."
        },
        validation: {
          requireMonitoringConfirmation: true
        },
        note: "الجرعة الثانية التكميلية 150 mg (أمبولة واحدة) بعد الصدمة التالية عند استمرار الرجفان."
      }
    ],
    warnings: [
      "هبوط حاد في الضغط الشرياني وبطء القلب أثناء التسريب السريع في المرضى ذوي النبض بسبب المذيبات.",
      "تطاول فاصل QT واحتمالية تحريض اللانظميات البطينية (Torsades de Pointes)."
    ],
    contraindications: [
      "الصدمة القلبية وبطء القلب الشديد في غياب ناظمة قلبية.",
      "فرط الحساسية لليود أو الأميودارون."
    ]
  },

  {
    id: "calcium_chloride",
    name: {
      generic: "Calcium Chloride 10%",
      arabic: "كلوريد الكالسيوم 10%",
      brandNames: ["Calcium Chloride"]
    },
    classification: {
      triadComponent: "supporting",
      category: "emergency_resuscitation",
      subcategory: "cardiac_membrane_stabilizer"
    },
    safety: {
      highRiskMedication: true,
      requiresAirwayReady: false,
      requiresRespiratoryMonitoring: false
    },
    clinicalFlags: ["hyperkalemia_risk", "central_line_preferred"],
    indications: [
      {
        id: "hyperkalemia_cardiac_protection",
        label: { en: "Cardiac membrane stabilization in severe hyperkalemia / hypermagnesemia", ar: "تثبيت الغشاء الخلوي القلبي والوقاية من توقف القلب في فرط البوتاسيوم وفرط المغنيسيوم الشديد" }
      }
    ],
    presentations: [
      {
        value: 100,
        concentration: 100,
        unit: DOSE_UNITS.MG_PER_ML,
        label: "10% Solution (100 mg/mL = 1 g / 10 mL = 270 mg Elemental Calcium)",
        isDefault: true
      }
    ],
    pharmacodynamics: {
      onset: "فوري (خلال 1 – 3 دقائق)",
      peak: "سريع",
      clinicalDuration: "20 – 60 دقيقة"
    },
    clinicalContexts: [
      {
        id: "hyperkalemia_emergency_bolus",
        population: "adult",
        route: "IV",
        label: "الجرعة الإسعافية لفرط البوتاسيوم (Emergency Hyperkalemia Bolus)",
        doseMin: 500.0,
        doseMax: 1000.0,
        unit: DOSE_UNITS.MG_FIXED,
        doseType: "fixed_bolus",
        basis: "emergency_guideline",
        administration: {
          method: "slow_iv_push",
          duration: "حقن وريدي بطيء على مدى 2 إلى 5 دقائق في وريد كبير أو قثطرة مركزية"
        },
        validation: {
          requireMonitoringConfirmation: true
        },
        isDefault: true,
        note: "يحتوي على ثلاثة أضعاف كمية الكالسيوم الشاردي مقارنة بغلوكونات الكالسيوم."
      }
    ],
    warnings: [
      "⚠️ خطر النخر النسيجي الشديد عند التسرب خارج الوريد؛ يُفضل الحقن عبر خط وريدي مركزي أو وريد كبير.",
      "الحقن السريع يسبب بطء قلب حاد وهبوط ضغط.",
      "يُمنع خلطه مع بيكربونات الصوديوم في نفس الخط لتفادي الترسب."
    ],
    contraindications: [
      "فرط كالسيوم الدم وتسمم الديجوكسين (خطر تحريض اللانظميات القاتلة Stone Heart)."
    ]
  },

  {
    id: "calcium_gluconate",
    name: {
      generic: "Calcium Gluconate 10%",
      arabic: "غلوكونات الكالسيوم 10%",
      brandNames: ["Calcium Gluconate"]
    },
    classification: {
      triadComponent: "supporting",
      category: "emergency_resuscitation",
      subcategory: "cardiac_membrane_stabilizer"
    },
    safety: {
      highRiskMedication: false,
      requiresAirwayReady: false,
      requiresRespiratoryMonitoring: false
    },
    clinicalFlags: ["hyperkalemia_risk"],
    indications: [
      {
        id: "hyperkalemia_peripheral_safe",
        label: { en: "Cardiac membrane stabilization in hyperkalemia (peripheral IV preferred)", ar: "تثبيت الغشاء القلبي في فرط البوتاسيوم (الخيار المفضل والأكثر أماناً للحقن المحيطي)" }
      }
    ],
    presentations: [
      {
        value: 100,
        concentration: 100,
        unit: DOSE_UNITS.MG_PER_ML,
        label: "10% Solution (100 mg/mL = 1 g / 10 mL = 90 mg Elemental Calcium)",
        isDefault: true
      }
    ],
    pharmacodynamics: {
      onset: "فوري (خلال 1 – 3 دقائق)",
      peak: "سريع",
      clinicalDuration: "30 – 60 دقيقة"
    },
    clinicalContexts: [
      {
        id: "hyperkalemia_gluconate_bolus",
        population: "adult",
        route: "IV",
        label: "الجرعة الإسعافية لفرط البوتاسيوم (Hyperkalemia Membrane Stabilization)",
        doseMin: 1000.0,
        doseMax: 2000.0,
        unit: DOSE_UNITS.MG_FIXED,
        doseType: "fixed_bolus",
        basis: "emergency_guideline",
        administration: {
          method: "slow_iv_push",
          duration: "حقن وريدي بطيء على مدى 5 إلى 10 دقائق (10 - 20 مل من محلول 10%)"
        },
        validation: {
          requireMonitoringConfirmation: true
        },
        isDefault: true,
        note: "أقل تهييجاً للأوردة المحيطية مقارنة بكلوريد الكالسيوم؛ يحتوي على ثلث كمية الكالسيوم الشاردي."
      }
    ],
    warnings: [
      "الحقن السريع جداً يسبب بطء القلب وتورد الوجه وهبوط الضغط.",
      "يُمنع الخلط مع بيكربونات الصوديوم في نفس الخط."
    ],
    contraindications: [
      "فرط كالسيوم الدم وتسمم الديجوكسين."
    ]
  },

  {
    id: "sodium_bicarbonate",
    name: {
      generic: "Sodium Bicarbonate 8.4%",
      arabic: "بيكربونات الصوديوم 8.4%",
      brandNames: ["Sodium Bicarbonate 8.4%"]
    },
    classification: {
      triadComponent: "supporting",
      category: "emergency_resuscitation",
      subcategory: "alkalinizing_agent"
    },
    safety: {
      highRiskMedication: true,
      requiresAirwayReady: false,
      requiresRespiratoryMonitoring: false
    },
    clinicalFlags: ["hyperkalemia_risk"],
    indications: [
      {
        id: "tca_sodium_channel_toxicity",
        label: { en: "Tricyclic antidepressant (TCA) toxicity with wide QRS", ar: "الترياق النوعي لتسمم مضادات الاكتئاب ثلاثية الحلقات (TCA) وتطاول مركب QRS" }
      },
      {
        id: "severe_metabolic_acidosis",
        label: { en: "Severe metabolic acidosis (pH < 7.1)", ar: "علاج الحماض الاستقلابي الشديد (pH < 7.1) والمساعدة في خفض البوتاسيوم" }
      }
    ],
    presentations: [
      {
        value: 1,
        concentration: 1,
        unit: DOSE_UNITS.MEQ_PER_ML,
        label: "8.4% Solution (1 mEq/mL in 50 mL Vial = 50 mEq)",
        isDefault: true
      }
    ],
    pharmacodynamics: {
      onset: "فوري (وريدياً)",
      peak: "سريع",
      clinicalDuration: "1 – 2 ساعة"
    },
    clinicalContexts: [
      {
        id: "tca_toxicity_bolus",
        population: "adult",
        route: "IV",
        label: "جرعة إنقاذ تسمم مضادات الاكتئاب TCA وتطاول QRS (TCA Toxicity Bolus)",
        doseMin: 1.0,
        doseMax: 2.0,
        unit: DOSE_UNITS.MEQ_PER_KG,
        doseType: "weight_bolus",
        basis: "emergency_toxicology_protocol",
        administration: {
          method: "rapid_iv_push"
        },
        weightPolicy: {
          preferred: "TBW"
        },
        validation: {
          requireWeight: true,
          requireMonitoringConfirmation: true
        },
        isDefault: true,
        note: "تُعطى 1 - 2 mEq/kg (تقريباً 50-100 mL من محلول 8.4%) لتضييق مركب QRS وقلوية الدم."
      }
    ],
    warnings: [
      "تعديل البيكربونات يولد CO2؛ يجب التأكد من كفاية التهوية للتخلص منه وتجنب الحماض الدماغي التناقضي.",
      "محلول عالي التناضح يسبب فرط صوديوم الدم وهبوط بوتاسيوم الدم الحاد.",
      "غير متوافق مع محاليل الكالسيوم أو الكاتيكولامينات؛ يجب غسل الوريد بالسالاين جيداً."
    ],
    contraindications: [
      "القلاء الاستقلابي أو التنفسي.",
      "نقص بوتاسيوم الدم الشديد ونقص كالسيوم الدم الحاد."
    ]
  },

  {
    id: "dantrolene",
    name: {
      generic: "Dantrolene Sodium",
      arabic: "دانترولين",
      brandNames: ["Dantrium", "Ryanodex", "Revonto"]
    },
    classification: {
      triadComponent: "supporting",
      category: "emergency_resuscitation",
      subcategory: "ryanodine_receptor_antagonist"
    },
    safety: {
      highRiskMedication: true,
      requiresAirwayReady: true,
      requiresRespiratoryMonitoring: true
    },
    clinicalFlags: ["mh_trigger"],
    indications: [
      {
        id: "malignant_hyperthermia_crisis",
        label: { en: "Specific treatment of malignant hyperthermia crisis", ar: "العلاج النوعي لإنقاذ أزمة فرط الحرارة الخبيث (Malignant Hyperthermia)" }
      }
    ],
    presentations: [
      {
        value: 0.33,
        concentration: 0.33,
        unit: DOSE_UNITS.MG_PER_ML,
        label: "Dantrium / Revonto: 20 mg/vial (يُحل في 60 mL ماء معقم = 0.33 mg/mL)",
        requiresReconstitution: true,
        isDefault: true
      },
      {
        value: 50,
        concentration: 50,
        unit: DOSE_UNITS.MG_PER_ML,
        label: "Ryanodex: 250 mg/vial (سريع الانحلال في 5 mL ماء معقم = 50 mg/mL)",
        requiresReconstitution: true
      }
    ],
    pharmacodynamics: {
      onset: "سريع (خلال دقائق من الحقن)",
      peak: "سريع",
      clinicalDuration: "4 – 8 ساعات"
    },
    clinicalContexts: [
      {
        id: "mh_crisis_initial_bolus",
        population: "adult_pediatric",
        route: "IV",
        label: "الجرعة البدئية الفورية لأزمة فرط الحرارة الخبيث (MH Initial Emergency Bolus)",
        doseMin: 2.5,
        doseMax: 2.5,
        unit: DOSE_UNITS.MG_PER_KG,
        doseType: "weight_bolus",
        basis: "mhaus_emergency_protocol",
        administration: {
          method: "rapid_iv_push",
          reconstitutionNote: "كل قارورة Dantrium (20 mg) تُحل حصراً بـ 60 مل ماء معقم للحقن خالٍ من المواد الحافظة وتُرج بقوة حتى تمام الشفافية."
        },
        weightPolicy: {
          preferred: "TBW"
        },
        validation: {
          requireWeight: true,
          requireMonitoringConfirmation: true
        },
        isDefault: true,
        note: "تُكرر الجرعة (2.5 mg/kg) كل 5-10 دقائق حتى هبوط الـ EtCO2 واسترخاء العضلات واستقرار الحرارة."
      }
    ],
    warnings: [
      "⚠️ يُمنع إعطاء حاصرات قنوات الكالسيوم (مثل الفيراباميل) تزامناً مع الدانترولين لخطورة حدوث انهيار قلبي وعائي وفرط بوتاسيوم مميت.",
      "ضعف عضلي عام وشديد بعد الإعطاء يتطلب استمرار دعم المجرى الهوائي والتهوية."
    ],
    contraindications: [
      "لا توجد موانع استعمال في تدبير أزمة فرط الحرارة الخبيث المهددة للحياة."
    ]
  },

  {
    id: "lipid_emulsion_20",
    name: {
      generic: "Lipid Emulsion 20% (Intralipid)",
      arabic: "مستحلب الدهون 20% (إنتراليبيد)",
      brandNames: ["Intralipid 20%", "Liposyn 20%"]
    },
    classification: {
      triadComponent: "supporting",
      category: "emergency_resuscitation",
      subcategory: "lipid_sink_antidote"
    },
    safety: {
      highRiskMedication: true,
      requiresAirwayReady: true,
      requiresRespiratoryMonitoring: true
    },
    clinicalFlags: ["last_risk"],
    indications: [
      {
        id: "last_resuscitation",
        label: { en: "Treatment of local anesthetic systemic toxicity (LAST)", ar: "العلاج النوعي لإنقاذ التسمم الجهازي بالمخدر الموضعي (LAST)" }
      }
    ],
    presentations: [
      {
        value: 20,
        concentration: 20,
        unit: DOSE_UNITS.PERCENT_LIQUID,
        label: "20% Lipid Emulsion (كيس 500 mL جاهز للتسريب)",
        isDefault: true
      }
    ],
    pharmacodynamics: {
      onset: "فوري (امتصاص السموم الجزيئية الدهنية Lipid Sink)",
      peak: "سريع",
      clinicalDuration: "مستمر أثناء التسريب"
    },
    clinicalContexts: [
      {
        id: "last_bolus_initial",
        population: "adult_pediatric",
        route: "IV",
        label: "الجرعة البدئية الدفعية للتسمم بالمخدر الموضعي (LAST Initial Bolus - ASRA)",
        doseMin: 1.5,
        doseMax: 1.5,
        unit: DOSE_UNITS.ML_PER_KG,
        doseType: "weight_bolus",
        basis: "asra_last_guideline",
        administration: {
          method: "rapid_iv_bolus",
          duration: "حقن وريدي دفعي على مدى 2 إلى 3 دقائق (حوالي 100 مل للبالغ بوزن 70 كجم)"
        },
        weightPolicy: {
          preferred: "IBW"
        },
        validation: {
          requireWeight: true,
          requireMonitoringConfirmation: true
        },
        isDefault: true,
        note: "تُتبع فوراً ببدء التسريب المستمر (0.25 mL/kg/min)؛ يمكن تكرار الجرعة الدفعية إذا استمر عدم الاستقرار القلبي."
      },
      {
        id: "last_continuous_infusion",
        population: "adult_pediatric",
        route: "IV Infusion",
        label: "التسريب المستمر للتسمم بالمخدر الموضعي (LAST Maintenance Infusion)",
        doseMin: 0.25,
        doseMax: 0.5,
        unit: DOSE_UNITS.ML_PER_KG_MIN,
        doseType: "weight_infusion_min",
        basis: "asra_last_guideline",
        administration: {
          method: "continuous_infusion_only"
        },
        weightPolicy: {
          preferred: "IBW"
        },
        validation: {
          requireWeight: true,
          requireMonitoringConfirmation: true
        },
        note: "يستمر التسريب لمدة لا تقل عن 10 دقائق بعد استقرار المؤشرات الديناميكية الوعائية."
      }
    ],
    warnings: [
      "الإنعاش في LAST: يجب خفض جرعات الأدرينالين الفردية إلى <1 mcg/kg وتجنب حاصرات بيتا وقنوات الكالسيوم والفازوبريسين.",
      "يسبب عكارة شديدة في الدم تتداخل مؤقتاً مع الفحوصات المخبرية."
    ],
    contraindications: [
      "لا توجد موانع استعمال في تدبير أزمة LAST المهددة للحياة."
    ]
  },

  // =========================================================================
  // C) ANTIEMETICS & ASPIRATION PROPHYLAXIS (مضادات القيء والارتجاع)
  // =========================================================================
  {
    id: "ondansetron",
    name: {
      generic: "Ondansetron HCl",
      arabic: "أوندانسيترون (زوفران)",
      brandNames: ["Zofran"]
    },
    classification: {
      triadComponent: "supporting",
      category: "antiemetic",
      subcategory: "5ht3_receptor_antagonist"
    },
    safety: {
      highRiskMedication: false,
      requiresAirwayReady: false,
      requiresRespiratoryMonitoring: false
    },
    clinicalFlags: ["ponv_prophylaxis"],
    indications: [
      {
        id: "ponv_prevention_treatment",
        label: { en: "Prevention and treatment of postoperative nausea and vomiting (PONV)", ar: "الوقاية من الغثيان والقيء بعد العمليات الجراحية وعلاجهما" }
      }
    ],
    presentations: [
      {
        value: 2,
        concentration: 2,
        unit: DOSE_UNITS.MG_PER_ML,
        label: "2 mg/mL (أمبولة 4 ملغ في 2 مل / 8 ملغ في 4 مل)",
        isDefault: true
      }
    ],
    pharmacodynamics: {
      onset: "15 – 30 دقيقة",
      peak: "سريع",
      clinicalDuration: "4 – 8 ساعات"
    },
    clinicalContexts: [
      {
        id: "ponv_prophylaxis_adult",
        population: "adult",
        route: "IV",
        label: "الوقاية من الغثيان والقيء للبالغين (Adult PONV Prophylaxis)",
        doseMin: 4.0,
        doseMax: 4.0,
        unit: DOSE_UNITS.MG_FIXED,
        doseType: "fixed_bolus",
        basis: "fixed_adult_dose",
        administration: {
          method: "slow_iv_push",
          timing: "يُحقن وريدياً ببطء على مدى 2-5 دقائق عند نهاية العملية الجراحية (قبل الإفاقة)."
        },
        validation: {
          requireAge: true
        },
        isDefault: true,
        note: "الجرعة القياسية الثابتة للبالغين هي 4 mg وريدياً."
      }
    ],
    warnings: [
      "تطاول فاصل QT المعتمد على الجرعة؛ يُستخدم بحذر في مرضى متلازمة QT الطويلة الخلقية.",
      "الصداع والإمساك العابر من أكثر الآثار الجانبية شيوعاً."
    ],
    contraindications: [
      "الاستخدام المتزامن مع دواء الأبومورفين (Apomorphine) لخطورة حدوث هبوط ضغط حاد.",
      "فرط الحساسية للأوندانسيترون."
    ]
  },

  {
    id: "dexamethasone",
    name: {
      generic: "Dexamethasone Sodium Phosphate",
      arabic: "ديكساميثازون",
      brandNames: ["Decadron"]
    },
    classification: {
      triadComponent: "supporting",
      category: "antiemetic",
      subcategory: "corticosteroid"
    },
    safety: {
      highRiskMedication: false,
      requiresAirwayReady: false,
      requiresRespiratoryMonitoring: false
    },
    clinicalFlags: ["ponv_prophylaxis", "bronchodilator"],
    indications: [
      {
        id: "ponv_prophylaxis",
        label: { en: "Prevention of postoperative nausea and vomiting", ar: "الوقاية من الغثيان والقيء بعد العمليات كجزء من العلاج متعدد الوسائط" }
      },
      {
        id: "airway_edema",
        label: { en: "Reduction of post-extubation laryngeal edema and stridor", ar: "الوقاية من وذمة الحنجرة والصرير بعد نزع أنبوب التنبيب" }
      }
    ],
    presentations: [
      {
        value: 4,
        concentration: 4,
        unit: DOSE_UNITS.MG_PER_ML,
        label: "4 mg/mL (أمبولة 4 ملغ في 1 مل / 8 ملغ في 2 مل)",
        isDefault: true
      }
    ],
    pharmacodynamics: {
      onset: "1 – 2 ساعة (يتطلب وقتاً للتأثير الخلوي)",
      peak: "4 – 8 ساعات",
      clinicalDuration: "24 – 72 ساعة (تأثير ممتد)"
    },
    clinicalContexts: [
      {
        id: "ponv_prophylaxis_induction",
        population: "adult",
        route: "IV",
        label: "الوقاية من القيء والغثيان عند الاستحثاث (PONV Induction Bolus)",
        doseMin: 4.0,
        doseMax: 8.0,
        unit: DOSE_UNITS.MG_FIXED,
        doseType: "fixed_bolus",
        basis: "fixed_adult_dose",
        administration: {
          method: "slow_iv_push",
          timing: "يُعطى بعد استحثاث التخدير مباشرة في بداية العملية لضمان وصول وقت الذروة مع الإفاقة."
        },
        validation: {
          requireAge: true
        },
        isDefault: true,
        note: "إعطاؤه في بداية العملية أفضل بكثير من نهايتها؛ يقلل أيضاً من آلام ما بعد الجراحة."
      }
    ],
    warnings: [
      "حقنه وريدياً بسرعة للمريض المستيقظ يسبب حرقة وألماً عجانياً عابراً؛ يُفضل إعطاؤه بعد تنويم المريض.",
      "ارتفاع عابر في سكر الدم (Hyperglycemia)؛ يُراعى ضبط جرعات الأنسولين لدى مرضى السكري."
    ],
    contraindications: [
      "الإنتان الفطري الجهازي غير المعالج.",
      "فرط الحساسية للديكساميثازون."
    ]
  },

  {
    id: "metoclopramide",
    name: {
      generic: "Metoclopramide HCl",
      arabic: "ميتوكلوبراميد (بلاسيل / ريغلان)",
      brandNames: ["Reglan", "Plasil"]
    },
    classification: {
      triadComponent: "supporting",
      category: "aspiration_prophylaxis",
      subcategory: "dopamine_d2_antagonist_prokinetic"
    },
    safety: {
      highRiskMedication: false,
      requiresAirwayReady: false,
      requiresRespiratoryMonitoring: false
    },
    clinicalFlags: ["ponv_prophylaxis"],
    indications: [
      {
        id: "gastric_emptying_aspiration_prophylaxis",
        label: { en: "Acceleration of gastric emptying and aspiration prophylaxis", ar: "تسريع إفراغ المعدة وزيادة مقوية معصرة المريء السفلية للوقاية من الارتجاف الرئوي" }
      }
    ],
    presentations: [
      {
        value: 5,
        concentration: 5,
        unit: DOSE_UNITS.MG_PER_ML,
        label: "5 mg/mL (أمبولة 10 ملغ في 2 مل)",
        isDefault: true
      }
    ],
    pharmacodynamics: {
      onset: "1 – 3 دقائق (وريدياً)",
      peak: "سريع",
      clinicalDuration: "1 – 2 ساعة"
    },
    clinicalContexts: [
      {
        id: "aspiration_prophylaxis_adult",
        population: "adult",
        route: "IV",
        label: "الجرعة الوريدية لتسريع إفراغ المعدة (Adult Prokinetic Bolus)",
        doseMin: 10.0,
        doseMax: 10.0,
        unit: DOSE_UNITS.MG_FIXED,
        doseType: "fixed_bolus",
        basis: "fixed_adult_dose",
        administration: {
          method: "slow_iv_push",
          duration: "حقن وريدي بطيء على مدى 2 إلى 3 دقائق لتجنب التململ الحركي الحاد (Akathisia)"
        },
        validation: {
          requireAge: true
        },
        isDefault: true,
        note: "تُعطى 10 mg وريدياً ببطء قبل العملية بـ 15-30 دقيقة في حالات المعدة الممتلئة."
      }
    ],
    warnings: [
      "أعراض خارج هرمية واختلاجات عضلية حادة (Extrapyramidal Symptoms)؛ تُعالج بالدايفينهيدرامين.",
      "الحقن الوريدي السريع يسبب شعوراً بالتململ الحركي والذعر والتوتر المفاجئ (Akathisia)."
    ],
    contraindications: [
      "الانسداد أو الانثقاب أو النزف الهضمي الميكانيكي.",
      "مرض باركنسون واضطرابات الحركة الصرعية.",
      "ورم القواتم (Pheochromocytoma)."
    ]
  },

  {
    id: "famotidine",
    name: {
      generic: "Famotidine",
      arabic: "فاموتيدين",
      brandNames: ["Pepcid"]
    },
    classification: {
      triadComponent: "supporting",
      category: "aspiration_prophylaxis",
      subcategory: "h2_receptor_antagonist"
    },
    safety: {
      highRiskMedication: false,
      requiresAirwayReady: false,
      requiresRespiratoryMonitoring: false
    },
    clinicalFlags: ["ponv_prophylaxis"],
    indications: [
      {
        id: "aspiration_prophylaxis",
        label: { en: "Reduction of gastric acid volume and elevation of gastric pH", ar: "الوقاية من متلازمة الارتجاف الرئوي الحامضي (Mendelson's Syndrome) في المعرضين للارتجاع" }
      }
    ],
    presentations: [
      {
        value: 10,
        concentration: 10,
        unit: DOSE_UNITS.MG_PER_ML,
        label: "10 mg/mL (فيال 20 ملغ في 2 مل)",
        isDefault: true
      }
    ],
    pharmacodynamics: {
      onset: "30 – 60 دقيقة (وريدياً)",
      peak: "1 – 3 ساعات",
      clinicalDuration: "10 – 12 ساعة"
    },
    clinicalContexts: [
      {
        id: "preop_aspiration_prophylaxis",
        population: "adult",
        route: "IV",
        label: "الجرعة الوقائية الوريدية قبل التخدير (Preop IV Dose)",
        doseMin: 20.0,
        doseMax: 20.0,
        unit: DOSE_UNITS.MG_FIXED,
        doseType: "fixed_bolus",
        basis: "fixed_adult_dose",
        administration: {
          method: "slow_iv_push",
          duration: "تُخفف في 5-10 مل سالاين وتُحقن ببطء على مدى دقيقتين."
        },
        validation: {
          requireAge: true
        },
        isDefault: true,
        note: "تُعطى قبل العملية بـ 45-60 دقيقة لرفع درجة حموضة محتوى المعدة (>2.5)."
      }
    ],
    warnings: [
      "الحقن الوريدي السريع قد يسبب هبوطاً عابراً في ضغط الدم.",
      "تتطلب خفض الجرعة إلى 50% في مرضى القصور الكلوي الشديد."
    ],
    contraindications: [
      "فرط الحساسية المعروفة للفاموتيدين أو مضادات مستقبلات H2 الأخرى."
    ]
  },

  {
    id: "sodium_citrate",
    name: {
      generic: "Sodium Citrate / Citric Acid (0.3M)",
      arabic: "سترات الصوديوم 0.3 مولار (بيكيترا)",
      brandNames: ["Bicitra", "Oracit"]
    },
    classification: {
      triadComponent: "supporting",
      category: "aspiration_prophylaxis",
      subcategory: "non_particulate_antacid"
    },
    safety: {
      highRiskMedication: false,
      requiresAirwayReady: false,
      requiresRespiratoryMonitoring: false
    },
    clinicalFlags: ["ponv_prophylaxis"],
    indications: [
      {
        id: "emergency_aspiration_prophylaxis",
        label: { en: "Rapid neutralization of gastric acidity prior to emergency Cesarean section", ar: "المعادلة الفورية السريعة لحموضة المعدة قبل عمليات الولادة القيصرية الإسعافية" }
      }
    ],
    presentations: [
      {
        value: 0.3,
        concentration: 0.3,
        unit: DOSE_UNITS.MOLAR,
        label: "0.3 Molar Oral Solution (محلول فموي جاهز للشرب 30 mL)",
        isDefault: true
      }
    ],
    pharmacodynamics: {
      onset: "فوري (خلال 5 – 10 دقائق فموياً)",
      peak: "فوري",
      clinicalDuration: "1 – 2 ساعة"
    },
    clinicalContexts: [
      {
        id: "emergency_preop_oral",
        population: "adult_obstetric",
        route: "Oral",
        label: "الجرعة الفموية الإسعافية الفورية (Emergency Preop Oral Dose)",
        doseMin: 30.0,
        doseMax: 30.0,
        unit: DOSE_UNITS.ML_FIXED,
        doseType: "fixed",
        basis: "fixed_adult_dose",
        administration: {
          method: "oral_ingestion",
          timing: "يُشرب فموياً قبل الاستحثاث بـ 15 إلى 30 دقيقة."
        },
        validation: {
          requireAge: true
        },
        isDefault: true,
        note: "مضاد حموضة غير جزيئي (Non-particulate)؛ لا يسبب أذية رئة حبيبية عند الارتجاف الرئوي."
      }
    ],
    warnings: [
      "يرفع درجة الـ pH إلى > 5.0 مما يلغي خطر الحروق الكيميائية الرئوية (Mendelson's Syndrome).",
      "غير مخصص للحقن الوريدي؛ يُعطى فموياً حصراً."
    ],
    contraindications: [
      "القصور الكلوي الحاد الشديد أو فرط صوديوم الدم الحاد.",
      "المرضى الفاقدون للوعي قبل تأمين المجرى الهوائي."
    ]
  },

  // =========================================================================
  // D) LOCAL & REGIONAL ANESTHETICS (أدوية التخدير النصفي والموضعي)
  // =========================================================================
  {
    id: "bupivacaine",
    name: {
      generic: "Bupivacaine HCl",
      arabic: "بوبيفاكايين (ماركايين)",
      brandNames: ["Marcaine", "Sensorcaine"]
    },
    classification: {
      triadComponent: "supporting",
      category: "local_regional_anesthetic",
      subcategory: "amino_amide"
    },
    safety: {
      highRiskMedication: true,
      requiresAirwayReady: false,
      requiresRespiratoryMonitoring: false
    },
    clinicalFlags: ["cardiotoxicity_high_risk", "last_risk"],
    indications: [
      {
        id: "spinal_anesthesia",
        label: { en: "Spinal anesthesia for surgery (Cesarean, lower limb, urology)", ar: "التخدير النصفي الشوكي للعمليات القيصرية، جراحة العظام السفلية والمسالك" }
      },
      {
        id: "epidural_and_blocks",
        label: { en: "Epidural anesthesia and peripheral nerve blocks", ar: "التخدير فوق الجافية وتسكين آلام المخاض وحصر الأعصاب المحيطية" }
      }
    ],
    presentations: [
      {
        value: 5,
        concentration: 5,
        unit: DOSE_UNITS.MG_PER_ML,
        percentage: 0.5,
        label: "0.5% Heavy (5 mg/mL with 8.25% Dextrose - مخصص للتخدير النصفي الشوكي Spinal)",
        isDefault: true
      },
      {
        value: 5,
        concentration: 5,
        unit: DOSE_UNITS.MG_PER_ML,
        percentage: 0.5,
        label: "0.5% Plain (5 mg/mL Isobaric - للتخدير فوق الجافية وحصر الأعصاب)"
      },
      {
        value: 2.5,
        concentration: 2.5,
        unit: DOSE_UNITS.MG_PER_ML,
        percentage: 0.25,
        label: "0.25% Plain (2.5 mg/mL - للرشح الموضعي وتسكين الإبيديورال)"
      }
    ],
    pharmacodynamics: {
      onset: "5 – 15 دقيقة (حصر محيطي) / 2 – 5 دقائق (شوكي)",
      peak: "15 – 30 دقيقة",
      clinicalDuration: "3 – 6 ساعات (تخدير طويل الأمد)"
    },
    doseLimits: {
      maxSingleDosePlainMgKg: 2.0,
      absoluteMaxPlainMg: 175.0,
      note: "الحد الأقصى للجرعة الساذجة هو 2.0 mg/kg بما لا يتجاوز 175 mg لتفادي التسمم الجهازي."
    },
    clinicalContexts: [
      {
        id: "spinal_cesarean_section",
        population: "adult_obstetric",
        route: "Intrathecal (Spinal)",
        label: "التخدير الشوكي للعملية القيصرية (Cesarean Spinal - 0.5% Heavy)",
        doseMin: 8.0,
        doseMax: 12.5,
        unit: DOSE_UNITS.MG_FIXED,
        doseType: "fixed",
        basis: "height_and_context_guided",
        administration: {
          method: "intrathecal_slow_injection",
          note: "يُحقن 1.6 - 2.5 مل من محلول 0.5% Heavy مع مراقبة مستوى الحصر الحسي (T4 المستهدف)."
        },
        validation: {
          requireAge: true,
          requireMonitoringConfirmation: true
        },
        isDefault: true,
        note: "المحلول الثقيل (Hyperbaric) يتحرك بفعل الجاذبية وفق وضعية المريض."
      },
      {
        id: "spinal_lower_limb_surgery",
        population: "adult",
        route: "Intrathecal (Spinal)",
        label: "التخدير الشوكي لجراحة الأطراف السفلية والمسالك (Lower Limb/Urology Spinal)",
        doseMin: 10.0,
        doseMax: 15.0,
        unit: DOSE_UNITS.MG_FIXED,
        doseType: "fixed",
        basis: "fixed_adult_dose",
        administration: {
          method: "intrathecal_slow_injection"
        },
        validation: {
          requireAge: true,
          requireMonitoringConfirmation: true
        },
        note: "يوفر حصراً حسياً وحركياً عميقاً يدوم 2 إلى 3 ساعات."
      }
    ],
    warnings: [
      "⚠️ سمية قلبية شديدة (Severe Cardiotoxicity): يرتبط بقوة وبطء بقنوات الصوديوم القلبية؛ الحقن الوريدي الخاطئ يسبب رجفاناً بطينياً معنداً وتوقف قلب حاد.",
      "⚠️ يُمنع منعاً باتاً استخدامه في التخدير الناحي الوريدي (Bier Block).",
      "الشفط السلبي المتكرر (Aspiration) قبل وأثناء الحقن إلزامي."
    ],
    contraindications: [
      "التخدير الناحي الوريدي (IVRA / Bier Block) — مانع استعمال مطلق لخطورة الوفاة.",
      "فرط الحساسية للمخدرات الموضعية من زمرة الأميدات.",
      "موانع التخدير النصفي الشوكي (رفض المريض، اعتلال الخثرة الحاد، إنتان موقع الحقن)."
    ]
  },

  {
    id: "lidocaine",
    name: {
      generic: "Lidocaine HCl (Lignocaine)",
      arabic: "ليدوكايين (زيلوكايين)",
      brandNames: ["Xylocaine"]
    },
    classification: {
      triadComponent: "supporting",
      category: "local_regional_anesthetic",
      subcategory: "amino_amide"
    },
    safety: {
      highRiskMedication: true,
      requiresAirwayReady: false,
      requiresRespiratoryMonitoring: false
    },
    clinicalFlags: ["last_risk", "cardiotoxicity_high_risk"],
    indications: [
      {
        id: "local_infiltration_nerve_block",
        label: { en: "Local infiltration anesthesia and peripheral nerve blocks", ar: "التخدير الارتشاحي الموضعي وحصر الأعصاب المحيطية" }
      },
      {
        id: "iv_intubation_blunting",
        label: { en: "IV blunting of airway reflexes and intubation response", ar: "تثبيط ردود الفعل الحنجرية والوعائية للتنبيب وتقليل ألم حقن البروبوفول" }
      }
    ],
    presentations: [
      {
        value: 10,
        concentration: 10,
        unit: DOSE_UNITS.MG_PER_ML,
        percentage: 1.0,
        label: "1% Plain (10 mg/mL - 100 mg / 10 mL or 200 mg / 20 mL)",
        isDefault: true
      },
      {
        value: 20,
        concentration: 20,
        unit: DOSE_UNITS.MG_PER_ML,
        percentage: 2.0,
        label: "2% Plain (20 mg/mL - 200 mg / 10 mL)"
      }
    ],
    pharmacodynamics: {
      onset: "سريع جداً (1 – 2 دقيقة رشحاً / فوري وريدياً)",
      peak: "3 – 5 دقائق",
      clinicalDuration: "30 – 120 دقيقة (يمتد إلى 2-4 ساعات مع الأدرينالين)"
    },
    doseLimits: {
      maxSingleDosePlainMgKg: 4.5,
      absoluteMaxPlainMg: 300.0,
      maxWithEpiMgKg: 7.0,
      absoluteMaxWithEpiMg: 500.0,
      note: "السقف الأقصى للرشح الساذج 4.5 mg/kg (بحد أقصى 300 mg)، ومع الأدرينالين 7.0 mg/kg (بحد أقصى 500 mg)."
    },
    clinicalContexts: [
      {
        id: "iv_induction_blunting",
        population: "adult",
        route: "IV",
        label: "تثبيط استجابة التنبيب وألم البروبوفول (IV Intubation Blunting)",
        doseMin: 1.0,
        doseMax: 1.5,
        unit: DOSE_UNITS.MG_PER_KG,
        doseType: "weight_bolus",
        basis: "weight_based_reference",
        administration: {
          method: "slow_iv_push",
          timing: "يُعطى وريدياً قبل تنظير الحنجرة بـ 90 ثانية أو متزامناً مع البروبوفول."
        },
        weightPolicy: {
          preferred: "IBW"
        },
        validation: {
          requireAge: true,
          requireWeight: true,
          requireAllergyReview: true
        },
        isDefault: true,
        note: "يقلل السعال والضغط الشرياني واستجابة القصبات أثناء إدخال الأنبوب الرغامي."
      },
      {
        id: "local_infiltration_max_dose",
        population: "adult_pediatric",
        route: "Infiltration",
        label: "الرشح الموضعي الجراحي (Local Infiltration - Max Safe Ceiling)",
        doseMin: 3.0,
        doseMax: 4.5,
        unit: DOSE_UNITS.MG_PER_KG,
        doseType: "weight_bolus",
        basis: "safe_ceiling_calculation",
        administration: {
          method: "subcutaneous_submucosal_infiltration",
          note: "يجب الشفط السلبي المستمر قبل الحقن لاستبعاد الدخول الوعائي غير المقصود."
        },
        weightPolicy: {
          preferred: "IBW"
        },
        validation: {
          requireWeight: true
        },
        note: "تأكد من عدم تجاوز السقف الحجمي المسموح به بناءً على تركيز المحلول المستخدم."
      }
    ],
    warnings: [
      "⚠️ علامات التسمم الجهازي الباكرة (LAST): طعم معدني، خدر حول الفم، طنين، رجفان، اختلاجات صرعية ثم تثبيط قلبي.",
      "يُمنع استخدام المحاليل المحتوية على الأدرينالين في التخدير الموضعي للأطراف والنهايات المعلقة (الأصابع، الأنف، القضيب)."
    ],
    contraindications: [
      "فرط الحساسية للمخدرات الموضعية من زمرة الأميدات.",
      "حصار القلب المتقدم من الدرجة الثانية أو الثالثة."
    ]
  },

  {
    id: "ropivacaine",
    name: {
      generic: "Ropivacaine HCl",
      arabic: "روبيفاكايين (ناروبين)",
      brandNames: ["Naropin"]
    },
    classification: {
      triadComponent: "supporting",
      category: "local_regional_anesthetic",
      subcategory: "pure_s_enantiomer_amino_amide"
    },
    safety: {
      highRiskMedication: true,
      requiresAirwayReady: false,
      requiresRespiratoryMonitoring: false
    },
    clinicalFlags: ["last_risk", "cardiotoxicity_high_risk"],
    indications: [
      {
        id: "epidural_labor_surgery",
        label: { en: "Epidural block for surgery, Cesarean section, and labor pain management", ar: "التخدير فوق الجافية وتسكين آلام المخاض وجراحة العمليات القيصرية" }
      },
      {
        id: "major_nerve_blocks",
        label: { en: "Major peripheral nerve blocks and postoperative infiltration", ar: "حصر الأعصاب المحيطية الكبرى والتسكين الارتشاحي بعد العمليات" }
      }
    ],
    presentations: [
      {
        value: 2,
        concentration: 2,
        unit: DOSE_UNITS.MG_PER_ML,
        percentage: 0.2,
        label: "0.2% (2 mg/mL - مخصص لتسكين الولادة الإبيديورال والتسريب المستمر)",
        isDefault: true
      },
      {
        value: 5,
        concentration: 5,
        unit: DOSE_UNITS.MG_PER_ML,
        percentage: 0.5,
        label: "0.5% (5 mg/mL - لحصر الأعصاب المحيطية والتخدير الإبيديورال)"
      },
      {
        value: 7.5,
        concentration: 7.5,
        unit: DOSE_UNITS.MG_PER_ML,
        percentage: 0.75,
        label: "0.75% (7.5 mg/mL - للتخدير الجراحي فوق الجافية للجراحة والقيصرية)"
      }
    ],
    pharmacodynamics: {
      onset: "10 – 20 دقيقة (فوق الجافية / حصر محيطي)",
      peak: "15 – 30 دقيقة",
      clinicalDuration: "3 – 8 ساعات (تخدير وتسكين ممتد)"
    },
    doseLimits: {
      maxSingleDosePlainMgKg: 3.0,
      absoluteMaxPlainMg: 225.0,
      note: "السقف الأقصى الموصى به للجرعة المفردة هو 3.0 mg/kg بما لا يتجاوز 225 mg."
    },
    clinicalContexts: [
      {
        id: "labor_epidural_analgesia",
        population: "adult_obstetric",
        route: "Epidural",
        label: "تسكين المخاض فوق الجافية (Labor Epidural Analgesia - 0.2%)",
        doseMin: 10.0,
        doseMax: 20.0,
        unit: DOSE_UNITS.MG_FIXED,
        doseType: "fixed",
        basis: "fixed_volume_titration",
        administration: {
          method: "slow_epidural_injection",
          note: "يُحقن 6 إلى 14 مل من محلول 0.2% (12-28 mg) ببطء عبر قثطرة الإبيديورال مع الشفط السلبي."
        },
        validation: {
          requireMonitoringConfirmation: true
        },
        isDefault: true,
        note: "يتميز بخاصية الحفاظ الحركي (Motor Sparing)؛ تسكين حسي مع شلل حركي أقل بكثير من البوبيفاكايين."
      },
      {
        id: "peripheral_nerve_block",
        population: "adult",
        route: "Infiltration",
        label: "حصر الأعصاب المحيطية الكبرى (Peripheral Nerve Block - 0.5%)",
        doseMin: 50.0,
        doseMax: 150.0,
        unit: DOSE_UNITS.MG_FIXED,
        doseType: "fixed",
        basis: "block_specific_volume",
        administration: {
          method: "ultrasound_guided_injection",
          note: "يُحقن 10 إلى 30 مل من محلول 0.5% تحت التوجيه بالأمواج فوق الصوتية."
        },
        validation: {
          requireMonitoringConfirmation: true
        },
        note: "يوفر تسكيناً جراحياً ممتداً يدوم حتى 12-24 ساعة."
      }
    ],
    warnings: [
      "أقل سمية قلبية من البوبيفاكايين (S-enantiomer نقي)، لكن التسمم الجهازي (LAST) وارد عند الحقن الوعائي الخاطئ.",
      "الشفط السلبي المتكرر قبل وأثناء الحقن إلزامي."
    ],
    contraindications: [
      "فرط الحساسية للمخدرات الموضعية من زمرة الأميدات.",
      "التخدير الناحي الوريدي (Bier Block)."
    ]
  }
];

export default supportingDrugsData;
