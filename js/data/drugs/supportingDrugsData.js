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
    availability: {
      status: "standard",
      regionDependent: false
    },
    evidence: {
      sourceOrganization: "FDA",
      documentTitle: "Ephedrine Sulfate Injection Prescribing Information",
      evidenceLevel: "regulatory"
    },
    safety: {
      highRiskMedication: false,
      operationalSafetyRequirements: [
        "continuous_hemodynamic_monitoring",
        "continuous_ecg_monitoring"
      ]
    },
    calculationPolicy: {
      mode: "reference_only_with_non_actionable_math",
      automaticDoseCalculation: false,
      permittedCalculations: ["volume_conversion_for_display"],
      prohibitedCalculations: ["automatic_bolus_order"],
      requireClinicianConfirmation: true
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
      clinicalDuration: "10 – 60 دقيقة",
      variabilityFactors: ["endogenous_catecholamine_stores", "repeat_dosing"]
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
        doseLimits: {
          maximumSingleDoseMg: 10.0,
          tachyphylaxisThresholdMg: 50.0,
          note: "تكرار الجرعات يؤدي لظاهرة زوال الاستجابة (Tachyphylaxis) لنفاد مخازن النورأدرينالين الذاتية؛ يلزم التبديل لرافع ضغط مباشر عند انعدام الاستجابة."
        },
        validation: {
          requireMonitoringConfirmation: true
        },
        isDefault: true,
        note: "يرفع الضغط الشرياني والنبض والنتاج القلبي عبر تنبيه مستقبلات ألفا وبيتا المباشر وغير المباشر."
      }
    ],
    toxicitySignals: ["severe_hypertension", "tachyarrhythmias"],
    warnings: [
      "تسرع ضربات القلب اللانظمي وخطر نقص تروية العضلة القلبية في مرضى داء الشرايين التاجية.",
      "ظاهرة زوال الاستجابة السريع (Tachyphylaxis) مع تكرار الجرعات."
    ],
    contraindications: [
      "فرط الحساسية للإفيدرين.",
      "تزامن الاستخدام مع مثبطات MAOIs."
    ],
    references: [
      {
        organization: "FDA",
        title: "Ephedrine Sulfate Injection Prescribing Information",
        year: "2024",
        evidenceLevel: "regulatory"
      }
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
    availability: {
      status: "standard",
      regionDependent: false
    },
    evidence: {
      sourceOrganization: "FDA",
      documentTitle: "Phenylephrine Hydrochloride Injection Prescribing Information",
      evidenceLevel: "regulatory"
    },
    safety: {
      highRiskMedication: true,
      operationalSafetyRequirements: [
        "continuous_hemodynamic_monitoring",
        "continuous_ecg_monitoring"
      ]
    },
    calculationPolicy: {
      mode: "reference_only_with_non_actionable_math",
      automaticDoseCalculation: false,
      permittedCalculations: ["volume_conversion_for_display"],
      prohibitedCalculations: ["automatic_bolus_order", "automatic_infusion_start"],
      requireClinicianConfirmation: true
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
      },
      {
        id: "weight_based_infusion",
        population: "adult",
        route: "IV Infusion",
        label: "تسريب وريدي معتمد على وزن المريض (Weight-Based Infusion)",
        doseMin: 0.1,
        doseMax: 0.5,
        unit: DOSE_UNITS.MCG_PER_KG_MIN,
        doseType: "weight_infusion_min",
        basis: "titrated_to_map_target",
        administration: {
          method: "infusion_pump_only"
        },
        weightPolicy: {
          allowed: ["TBW", "IBW"],
          preferred: "TBW"
        },
        validation: {
          requireWeight: true,
          requireMonitoringConfirmation: true
        },
        note: "تتم المعايرة لتحقيق ضغط شرياني وسطي (MAP ≥ 65 mmHg)."
      }
    ],
    toxicitySignals: ["severe_hypertension", "marked_reflex_bradycardia", "reduced_cardiac_output"],
    warnings: [
      "بطء قلب انعكاسي (Reflex Bradycardia) ناجم عن التنبيه المبهمي استجابة لارتفاع الضغط؛ يُستخدم بحذر إذا كان النبض منخفضاً.",
      "زيادة الحمل اللاحق (Afterload) وخفض النتاج القلبي في مرضى القصور القلبي الشديد."
    ],
    contraindications: [
      "ارتفاع الضغط الشرياني الشديد.",
      "تسرع القلب البطيني أو الرجفان.",
      "فرط الحساسية للفينيليفرين."
    ],
    references: [
      {
        organization: "FDA",
        title: "Neo-Synephrine (Phenylephrine HCl Injection) Prescribing Information",
        year: "2024",
        evidenceLevel: "regulatory"
      }
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
    availability: {
      status: "standard",
      regionDependent: false
    },
    evidence: {
      sourceOrganization: "FDA",
      documentTitle: "Levophed (Norepinephrine Bitartrate Injection) Prescribing Information",
      evidenceLevel: "regulatory"
    },
    safety: {
      highRiskMedication: true,
      operationalSafetyRequirements: [
        "central_venous_access_preferred",
        "continuous_arterial_line_or_nibp",
        "continuous_ecg_monitoring",
        "infusion_pump_mandatory"
      ]
    },
    calculationPolicy: {
      mode: "reference_only_with_non_actionable_math",
      automaticDoseCalculation: false,
      permittedCalculations: ["volume_conversion_for_display", "unit_conversion_for_review"],
      prohibitedCalculations: ["automatic_infusion_start", "patient_specific_prescription"],
      requireClinicianConfirmation: true
    },
    clinicalFlags: ["central_line_preferred", "first_line_septic_shock", "tissue_necrosis_risk", "potent_vasoconstrictor"],
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
      },
      {
        value: 1,
        concentration: 1,
        unit: DOSE_UNITS.MG_PER_ML,
        label: "1 mg/mL Concentrate (أمبولة مركزة 4 ملغ في 4 مل - تتطلب التخفيف الإلزامي)",
        requiresDilution: true
      }
    ],
    pharmacodynamics: {
      onset: "1 – 2 دقيقة من بدء التسريب",
      peak: "سريع",
      clinicalDuration: "1 – 2 دقيقة بعد إيقاف التسريب (عمر نصف بلازمي فائق القصر)"
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
          dilutionProtocol: "تُخفف أمبولة 4 ملغ في 250-500 مل ديكستروز 5% (D5W) أو ديكستروز سالاين (D5NS). يُمنع التخفيف بالسالاين المنفرد لتجنب تأكسد الدواء وفقدان فعاليته."
        },
        weightPolicy: {
          allowed: ["TBW", "IBW"],
          preferred: "TBW"
        },
        validation: {
          requireWeight: true,
          requireMonitoringConfirmation: true
        },
        isDefault: true,
        note: "تتم المعايرة لتحقيق ضغط شرياني وسطي (MAP ≥ 65 mmHg)؛ الجرعات القصوى قد تتجاوز 1 mcg/kg/min في الصدمة المعندة."
      }
    ],
    toxicitySignals: ["peripheral_ischemia", "tissue_necrosis_extravasation", "severe_arrhythmias"],
    warnings: [
      "⚠️ خطر النخر النسيجي والتنخر الإقفاري الشديد (Extravasation Necrosis): يجب تفضيل القثطرة المركزية؛ عند حدوث تسرب محيطي، يُحقن فوراً مضاد ألفا (Phentolamine 5-10 mg في 10 مل سالاين) موضعياً في موقع التسرب.",
      "نقص تروية الأعضاء المحيطية والأطراف والكلية عند الجرعات العالية جداً في غياب الإنعاش الكافي بالسوائل."
    ],
    contraindications: [
      "نقص حجم الدم غير المعوض بالسوائل (إلا كإجراء طارئ مؤقت أثناء الإنعاش بالسوائل)."
    ],
    references: [
      {
        organization: "FDA",
        title: "Levophed (Norepinephrine Bitartrate) Prescribing Information",
        year: "2024",
        evidenceLevel: "regulatory"
      }
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
    availability: {
      status: "standard",
      regionDependent: false
    },
    evidence: {
      sourceOrganization: "AHA / FDA",
      documentTitle: "AHA ACLS Guidelines & Adrenalin Injection Labeling",
      evidenceLevel: "regulatory_and_guideline"
    },
    safety: {
      highRiskMedication: true,
      operationalSafetyRequirements: [
        "defibrillator_available",
        "continuous_ecg_monitoring",
        "hemodynamic_monitoring"
      ]
    },
    calculationPolicy: {
      mode: "reference_only_with_non_actionable_math",
      automaticDoseCalculation: false,
      permittedCalculations: ["volume_conversion_for_display"],
      prohibitedCalculations: ["automatic_bolus_order", "automatic_infusion_start"],
      requireClinicianConfirmation: true
    },
    clinicalFlags: ["anaphylaxis_first_line", "acls_cardiac_arrest", "potent_inotrope", "high_alert"],
    indications: [
      {
        id: "cardiac_arrest_acls",
        label: { en: "Cardiac arrest (VF, pVT, Asystole, PEA)", ar: "إنعاش توقف القلب في بروتوكول ACLS (الرجفان البطيني، اللانَبضية، تفارق النشاط الكهربائي)" }
      },
      {
        id: "anaphylaxis_severe",
        label: { en: "Severe anaphylaxis and life-threatening bronchospasm", ar: "الصدمة التحسسية التأقية الشديدة والتشنج القصبي الحرج" }
      },
      {
        id: "post_cardiac_surgery_inotropic",
        label: { en: "Cardiogenic shock and inotropic support", ar: "الصدمة القلبية والدعم المنشط للقلوصية بعد جراحة القلب" }
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
      },
      {
        value: 16,
        concentration: 16,
        unit: DOSE_UNITS.MCG_PER_ML,
        label: "16 mcg/mL (محلول تسريب: 4 ملغ في 250 مل D5W)"
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
      },
      {
        id: "inotropic_vasopressor_infusion",
        population: "adult",
        route: "IV Infusion",
        label: "التسريب الوريدي المنشط والرافع للضغط (Continuous Inotropic Infusion)",
        doseMin: 0.01,
        doseMax: 0.5,
        unit: DOSE_UNITS.MCG_PER_KG_MIN,
        doseType: "weight_infusion_min",
        basis: "titrated_to_hemodynamic_target",
        administration: {
          method: "infusion_pump_only",
          note: "الجرعات المنخفضة (0.01-0.05) تسيطر عليها تأثيرات بيتا المنشطة للقلوصية؛ الجرعات العالية (>0.1) تسيطر عليها تأثيرات ألفا القابضة للأوعية."
        },
        weightPolicy: {
          allowed: ["TBW", "IBW"],
          preferred: "TBW"
        },
        validation: {
          requireWeight: true,
          requireMonitoringConfirmation: true
        }
      }
    ],
    toxicitySignals: ["ventricular_fibrillation", "myocardial_ischemia", "severe_hypertension", "hyperglycemia"],
    warnings: [
      "⚠️ خطأ الجرعة والتراكيز: الخلط بين تركيز 1:1,000 (الحقن العضلي) و 1:10,000 (الحقن الوريدي) يسبب نوبات فرط ضغط كارثية واحتشاء عضلة القلب ورجفان بطيني.",
      "يرفع استهلاك القلب للأكسجين ويزيد بشكل ملحوظ مستوى سكر الدم وحمض اللاكتيك."
    ],
    contraindications: [
      "لا توجد موانع استعمال مطلقة في حالات الطوارئ القاتلة (توقف القلب والصدمة التأقية الشديدة)."
    ],
    references: [
      {
        organization: "AHA",
        title: "ACLS Guidelines for Cardiopulmonary Resuscitation and Emergency Cardiovascular Care",
        year: "2024",
        evidenceLevel: "guideline"
      }
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
    availability: {
      status: "standard",
      regionDependent: false
    },
    evidence: {
      sourceOrganization: "FDA / AHA",
      documentTitle: "Dopamine Hydrochloride Injection Prescribing Information",
      evidenceLevel: "regulatory_and_guideline"
    },
    safety: {
      highRiskMedication: true,
      operationalSafetyRequirements: [
        "continuous_ecg_monitoring",
        "continuous_hemodynamic_monitoring",
        "infusion_pump_mandatory"
      ]
    },
    calculationPolicy: {
      mode: "reference_only_with_non_actionable_math",
      automaticDoseCalculation: false,
      permittedCalculations: ["volume_conversion_for_display"],
      prohibitedCalculations: ["automatic_infusion_start"],
      requireClinicianConfirmation: true
    },
    clinicalFlags: ["dose_dependent_receptors", "tachyarrhythmia_risk", "extravasation_risk"],
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
      },
      {
        value: 1.6,
        concentration: 1.6,
        unit: DOSE_UNITS.MG_PER_ML,
        label: "1.6 mg/mL = 1600 mcg/mL (محلول تسريب: 400 ملغ في 250 مل D5W)"
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
          allowed: ["TBW", "IBW"],
          preferred: "TBW"
        },
        validation: {
          requireWeight: true,
          requireMonitoringConfirmation: true
        },
        isDefault: true,
        note: "الجرعة المتوسطة (2-10 mcg/kg/min) تنبه مستقبلات بيتا-1 فتزيد من قلوصية العضلة القلبية والنبض والنتاج القلبي."
      },
      {
        id: "vasopressor_infusion_high",
        population: "adult",
        route: "IV Infusion",
        label: "التسريب الرافع للضغط (Alpha-1 Vasopressor Range)",
        doseMin: 10.0,
        doseMax: 20.0,
        unit: DOSE_UNITS.MCG_PER_KG_MIN,
        doseType: "weight_infusion_min",
        basis: "titrated_to_target_map",
        administration: {
          method: "continuous_infusion_only"
        },
        weightPolicy: {
          allowed: ["TBW", "IBW"],
          preferred: "TBW"
        },
        validation: {
          requireWeight: true,
          requireMonitoringConfirmation: true
        },
        note: "الجرعة العالية (>10 mcg/kg/min) تسيطر عليها تأثيرات ألفا-1 القابضة للأوعية؛ تزيد من خطر اللانظميات التسرعية ونقص التروية المحيطية."
      }
    ],
    toxicitySignals: ["severe_tachyarrhythmias", "tissue_necrosis_extravasation", "myocardial_ischemia"],
    warnings: [
      "معدل مرتفع لحدوث تسرع القلب اللانظمي والرجفان الأذيني والبطيني مقارنة بالنورأدرينالين.",
      "⚠️ مفهوم الجرعة الكلوية المنخفضة (Renal-dose Dopamine <2 mcg/kg/min) لم يعد مدعوماً بالأدلة السريرية الحديثة لحماية الكلى.",
      "التسرب المحيطي يسبب نخراً نسيجياً (يُعالج بحقن الفنتولامين موضعياً)."
    ],
    contraindications: [
      "الرجفان البطيني وتسرع القلب البطيني غير المسيطر عليه.",
      "ورم القواتم (Pheochromocytoma)."
    ],
    references: [
      {
        organization: "FDA",
        title: "Dopamine Hydrochloride Injection Prescribing Information",
        year: "2024",
        evidenceLevel: "regulatory"
      }
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
    availability: {
      status: "standard",
      regionDependent: false
    },
    evidence: {
      sourceOrganization: "AHA / FDA",
      documentTitle: "AHA ACLS Guidelines for Bradycardia & Atropine Labeling",
      evidenceLevel: "regulatory_and_guideline"
    },
    safety: {
      highRiskMedication: false,
      operationalSafetyRequirements: [
        "continuous_ecg_monitoring",
        "hemodynamic_monitoring"
      ]
    },
    calculationPolicy: {
      mode: "reference_only_with_non_actionable_math",
      automaticDoseCalculation: false,
      permittedCalculations: ["volume_conversion_for_display"],
      prohibitedCalculations: ["automatic_bolus_order"],
      requireClinicianConfirmation: true
    },
    clinicalFlags: ["paradoxical_bradycardia_low_dose", "crosses_bbb", "acls_bradycardia"],
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
        doseLimits: {
          maximumCumulativeDoseMg: 3.0,
          note: "الجرعة الإجمالية القصوى 3.0 mg (تحقق الحصار المبهمي الكامل)."
        },
        validation: {
          requireMonitoringConfirmation: true
        },
        isDefault: true,
        note: "توصي إرشادات ACLS بجرعة بدئية معيارية 1.0 mg وريدياً (لتفادي بطء القلب التناقضي)، وتُكرر كل 3-5 دقائق عند الحاجة (بحد أقصى 3 mg)."
      }
    ],
    toxicitySignals: ["severe_tachycardia", "anticholinergic_syndrome_cns", "urinary_retention"],
    warnings: [
      "⚠️ بطء قلب تناقضي (Paradoxical Bradycardia): إعطاء جرعات وريدية منخفضة جداً (<0.5 mg) أو الحقن البطيء جداً يسبب بطء قلب تناقضياً ناجم عن تنبيه مبهمي مركزي ومحيطي.",
      "يعبر الحاجز الدموي الدماغي (BBB) وقد يسبب متلازمة مضادات الكولين المركزية (Central Anticholinergic Syndrome) والتخليط العقلي والهذيان خاصة في كبار السن (يُعكس بالفيزوستيغمين Physostigmine).",
      "غير فعال في حصار القلب من الدرجة الثانية النوع الثاني (Mobitz II) وحصار القلب التام (Third-degree AV Block) مع مركب QRS عريض."
    ],
    contraindications: [
      "الزرق ضيق الزاوية الحاد غير المعالج.",
      "الانسداد البولي أو الهضمي الميكانيكي."
    ],
    references: [
      {
        organization: "AHA",
        title: "ACLS Management of Bradycardia Guidelines",
        year: "2024",
        evidenceLevel: "guideline"
      }
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
    availability: {
      status: "standard",
      regionDependent: false
    },
    evidence: {
      sourceOrganization: "AHA / FDA",
      documentTitle: "Amiodarone Hydrochloride Injection Prescribing Information",
      evidenceLevel: "regulatory_and_guideline"
    },
    safety: {
      highRiskMedication: true,
      operationalSafetyRequirements: [
        "continuous_ecg_monitoring",
        "continuous_hemodynamic_monitoring",
        "defibrillator_available"
      ]
    },
    calculationPolicy: {
      mode: "reference_only_with_non_actionable_math",
      automaticDoseCalculation: false,
      permittedCalculations: ["volume_conversion_for_display"],
      prohibitedCalculations: ["automatic_bolus_order", "automatic_infusion_start"],
      requireClinicianConfirmation: true
    },
    clinicalFlags: ["acls_antiarrhythmic", "hypotension_risk", "prolonged_half_life"],
    indications: [
      {
        id: "acls_pulseless_vf_vt",
        label: { en: "Pulseless VF and VT unresponsive to CPR and defibrillation", ar: "إنعاش الرجفان البطيني وتسرع القلب البطيني عديم النبض المعند على الصدمات" }
      },
      {
        id: "stable_wide_complex_tachycardia",
        label: { en: "Hemodynamically stable wide-complex monomorphic VT", ar: "علاج تسرع القلب البطيني المستقر ذو المركب العريض" }
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
      },
      {
        id: "stable_vt_infusion",
        population: "adult",
        route: "IV Infusion",
        label: "تسريب تسرع القلب البطيني النبضي المستقر (Stable VT with Pulse Loading)",
        doseMin: 150.0,
        doseMax: 150.0,
        unit: DOSE_UNITS.MG_FIXED,
        doseType: "fixed_infusion_min",
        basis: "acls_guideline_protocol",
        administration: {
          method: "slow_infusion_over_time",
          duration: "تُحل 150 ملغ في 100 مل ديكستروز 5% وتُسرّب على مدى 10 دقائق."
        },
        validation: {
          requireMonitoringConfirmation: true
        },
        note: "تليها جرعة صيانة تسريب 1 mg/min لمدة 6 ساعات ثم 0.5 mg/min لمدة 18 ساعة."
      }
    ],
    toxicitySignals: ["severe_hypotension", "severe_bradycardia", "qt_prolongation_torsades"],
    warnings: [
      "هبوط حاد في الضغط الشرياني وبطء القلب أثناء التسريب السريع في المرضى ذوي النبض بسبب المذيبات (Polysorbate 80 / Benzyl alcohol).",
      "تطاول فاصل QT واحتمالية تحريض اللانظميات البطينية (Torsades de Pointes)."
    ],
    contraindications: [
      "الصدمة القلبية وبطء القلب الشديد في غياب ناظمة قلبية (في المرضى ذوي النبض المستقر).",
      "فرط الحساسية لليود أو الأميودارون."
    ],
    references: [
      {
        organization: "AHA",
        title: "ACLS Cardiac Arrest & Arrhythmia Guidelines",
        year: "2024",
        evidenceLevel: "guideline"
      }
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
    availability: {
      status: "standard",
      regionDependent: false
    },
    evidence: {
      sourceOrganization: "FDA / ACLS",
      documentTitle: "Calcium Chloride 10% Injection USP Prescribing Information",
      evidenceLevel: "regulatory_and_guideline"
    },
    safety: {
      highRiskMedication: true,
      operationalSafetyRequirements: [
        "continuous_ecg_monitoring",
        "secure_iv_or_central_line",
        "extravasation_monitoring"
      ]
    },
    calculationPolicy: {
      mode: "reference_only_with_non_actionable_math",
      automaticDoseCalculation: false,
      permittedCalculations: ["volume_conversion_for_display"],
      prohibitedCalculations: ["automatic_bolus_order"],
      requireClinicianConfirmation: true
    },
    clinicalFlags: ["hyperkalemia_membrane_stabilizer", "severe_tissue_necrosis_risk", "central_line_preferred"],
    indications: [
      {
        id: "hyperkalemia_cardiac_protection",
        label: { en: "Cardiac membrane stabilization in severe hyperkalemia / hypermagnesemia", ar: "تثبيت الغشاء الخلوي القلبي والوقاية من توقف القلب في فرط البوتاسيوم وفرط المغنيسيوم الشديد" }
      },
      {
        id: "ccb_overdose_hypocalcemia",
        label: { en: "Calcium channel blocker overdose and acute severe hypocalcemia", ar: "علاج التسمم بحاصرات قنوات الكالسيوم ونقص الكالسيوم الحاد بعد نقل الدم الكتلي" }
      }
    ],
    presentations: [
      {
        value: 100,
        concentration: 100,
        unit: DOSE_UNITS.MG_PER_ML,
        label: "10% Solution (100 mg/mL = 1 g / 10 mL = 270 mg Elemental Calcium = 13.6 mEq Ca2+)",
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
        note: "يحتوي على ثلاثة أضعاف كمية الكالسيوم الشاردي مقارنة بغلوكونات الكالسيوم (27 mg elemental Ca/mL مقابل 9 mg/mL)."
      }
    ],
    toxicitySignals: ["severe_tissue_necrosis", "hypercalcemia", "bradycardia_rapid_iv"],
    warnings: [
      "⚠️ خطر النخر النسيجي الكارثي (Severe Extravasation Necrosis): التسرب خارج الوريد يسبب حروقاً كيميائية وتنخراً خلوياً شديداً؛ يُفضل الحقن عبر خط وريدي مركزي أو وريد محيطي كبير وسليم.",
      "الحقن الوريدي السريع قد يسبب بطء قلب حاد، هبوط ضغط، وتوقف انقباض.",
      "يُمنع خلطه في نفس الخط الوريدي مع بيكربونات الصوديوم لتفادي ترسب كربونات الكالسيوم غير المنحلة."
    ],
    contraindications: [
      "الرجفان البطيني أثناء الإنعاش القلبي (إلا إذا كان ناجماً عن فرط البوتاسيوم أو نقص الكالسيوم).",
      "فرط كالسيوم الدم المثبت وتسمم الديجوكسين (خطر تحريض اللانظميات القاتلة Stone Heart)."
    ],
    references: [
      {
        organization: "FDA / AHA",
        title: "Calcium Chloride Injection USP Guidelines",
        year: "2024",
        evidenceLevel: "regulatory_and_guideline"
      }
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
    availability: {
      status: "standard",
      regionDependent: false
    },
    evidence: {
      sourceOrganization: "FDA / Guidelines",
      documentTitle: "Calcium Gluconate Injection USP Prescribing Information",
      evidenceLevel: "regulatory_and_guideline"
    },
    safety: {
      highRiskMedication: false,
      operationalSafetyRequirements: [
        "continuous_ecg_monitoring"
      ]
    },
    calculationPolicy: {
      mode: "reference_only_with_non_actionable_math",
      automaticDoseCalculation: false,
      permittedCalculations: ["volume_conversion_for_display"],
      prohibitedCalculations: ["automatic_bolus_order"],
      requireClinicianConfirmation: true
    },
    clinicalFlags: ["hyperkalemia_membrane_stabilizer", "peripheral_line_safer"],
    indications: [
      {
        id: "hyperkalemia_peripheral_safe",
        label: { en: "Cardiac membrane stabilization in hyperkalemia (peripheral IV preferred)", ar: "تثبيت الغشاء القلبي في فرط البوتاسيوم (الخيار المفضل والأكثر أماناً للحقن المحيطي)" }
      },
      {
        id: "hypocalcemia_tetany",
        label: { en: "Treatment of acute hypocalcemia and tetany", ar: "علاج نقص الكالسيوم الحاد والتكزز العضلي ونقص الكالسيوم بعد نقل الدم" }
      }
    ],
    presentations: [
      {
        value: 100,
        concentration: 100,
        unit: DOSE_UNITS.MG_PER_ML,
        label: "10% Solution (100 mg/mL = 1 g / 10 mL = 90 mg Elemental Calcium = 4.6 mEq Ca2+)",
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
        note: "أقل تهييجاً وتخريشاً للأوردة المحيطية مقارنة بكلوريد الكالسيوم؛ يحتوي على ثلث كمية الكالسيوم الشاردي لكل مل مقارنة بالكلوريد."
      }
    ],
    toxicitySignals: ["hypercalcemia", "bradycardia_rapid_push"],
    warnings: [
      "الحقن السريع جداً يسبب بطء القلب، تورد الوجه، وهبوط الضغط.",
      "يُمنع الخلط مع بيكربونات الصوديوم في نفس الخط الوريدي."
    ],
    contraindications: [
      "فرط كالسيوم الدم وتسمم الديجوكسين."
    ],
    references: [
      {
        organization: "FDA",
        title: "Calcium Gluconate Injection USP Labeling",
        year: "2024",
        evidenceLevel: "regulatory"
      }
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
    availability: {
      status: "standard",
      regionDependent: false
    },
    evidence: {
      sourceOrganization: "FDA / ACLS",
      documentTitle: "Sodium Bicarbonate 8.4% Injection Prescribing Information",
      evidenceLevel: "regulatory_and_guideline"
    },
    safety: {
      highRiskMedication: true,
      operationalSafetyRequirements: [
        "arterial_blood_gas_monitoring",
        "adequate_ventilation_ensured"
      ]
    },
    calculationPolicy: {
      mode: "reference_only_with_non_actionable_math",
      automaticDoseCalculation: false,
      permittedCalculations: ["volume_conversion_for_display"],
      prohibitedCalculations: ["automatic_bolus_order"],
      requireClinicianConfirmation: true
    },
    clinicalFlags: ["tca_toxicity_antidote", "hyperkalemia_adjunct", "hyperosmolar", "abg_guided"],
    indications: [
      {
        id: "tca_sodium_channel_toxicity",
        label: { en: "Tricyclic antidepressant (TCA) and sodium-channel blocker toxicity with wide QRS", ar: "الترياق النوعي لتسمم مضادات الاكتئاب ثلاثية الحلقات (TCA) وتطاول QRS وتسمم حاصرات قنوات الصوديوم" }
      },
      {
        id: "severe_metabolic_acidosis",
        label: { en: "Severe metabolic acidosis (pH < 7.1) and hyperkalemia adjunct", ar: "علاج الحماض الاستقلابي الشديد (pH < 7.1) والمساعدة في إدخال البوتاسيوم للخلايا" }
      }
    ],
    presentations: [
      {
        value: 1,
        concentration: 1,
        unit: DOSE_UNITS.MEQ_PER_ML,
        label: "8.4% Solution (1 mEq/mL = 84 mg/mL in 50 mL Vial = 50 mEq)",
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
          method: "rapid_iv_push",
          note: "حقن وريدي مباشر بهدف قلوية الدم (Target Arterial pH 7.45 - 7.55 وتضييق مركب QRS)."
        },
        weightPolicy: {
          allowed: ["TBW", "IBW"],
          preferred: "TBW"
        },
        validation: {
          requireWeight: true,
          requireMonitoringConfirmation: true
        },
        isDefault: true,
        note: "تُعطى 1 - 2 mEq/kg (تقريباً 50-100 mL من محلول 8.4%) حتى تراجع عرض مركب QRS."
      },
      {
        id: "severe_acidosis_cardiac_arrest",
        population: "adult",
        route: "IV",
        label: "الحماض الاستقلابي الشديد في توقف القلب المطول (Arrest Acidosis Bolus)",
        doseMin: 50.0,
        doseMax: 50.0,
        unit: DOSE_UNITS.MEQ_FIXED,
        doseType: "fixed_bolus",
        basis: "acls_guideline_protocol",
        administration: {
          method: "slow_iv_push"
        },
        validation: {
          requireMonitoringConfirmation: true
        },
        note: "50 mEq (قارورة 50 مل كاملة)؛ يُشترط كفاية التهوية للتخلص من غاز CO2 الناتج عن التعديل."
      }
    ],
    toxicitySignals: ["severe_alkalosis", "hypernatremia", "hypokalemia", "paradoxical_csf_acidosis"],
    warnings: [
      "تعديل البيكربونات يولد غاز CO2؛ إذا لم تكن التهوية الآلية كافية لطرحه، يعبر CO2 إلى داخل الخلايا والدماغ مسبباً حماضاً خلوياً ودماغياً تناقضياً (Paradoxical Intracellular Acidosis).",
      "محلول عالي التناضح (Hyperosmolar ≈ 2000 mOsm/L) يسبب فرط صوديوم الدم وهبوط بوتاسيوم الدم الحاد.",
      "⚠️ غير متوافق تماماً مع محاليل الكالسيوم أو الكاتيكولامينات؛ يجب غسل الوريد بالسالاين جيداً قبل وبعد الحقن."
    ],
    contraindications: [
      "القلاء الاستقلابي أو التنفسي.",
      "نقص بوتاسيوم الدم الشديد ونقص كالسيوم الدم الحاد."
    ],
    references: [
      {
        organization: "FDA / ACLS",
        title: "Sodium Bicarbonate 8.4% Injection Prescribing Information",
        year: "2024",
        evidenceLevel: "regulatory_and_guideline"
      }
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
    availability: {
      status: "institution_dependent",
      regionDependent: true,
      note: "ترياق طوارئ نوعي وإلزامي التوفر في كل مركز يستخدم غازات التخدير الهالوجينية أو السكوسينيل كولين."
    },
    evidence: {
      sourceOrganization: "MHAUS / FDA",
      documentTitle: "MHAUS Malignant Hyperthermia Treatment Protocol & Dantrium Labeling",
      evidenceLevel: "regulatory_and_guideline"
    },
    safety: {
      highRiskMedication: true,
      operationalSafetyRequirements: [
        "mh_treatment_cart_available",
        "core_temperature_monitoring",
        "continuous_etco2_monitoring",
        "arterial_blood_gas_available"
      ]
    },
    calculationPolicy: {
      mode: "reference_only_with_non_actionable_math",
      automaticDoseCalculation: false,
      permittedCalculations: ["volume_conversion_for_display"],
      prohibitedCalculations: ["automatic_bolus_order"],
      requireClinicianConfirmation: true
    },
    clinicalFlags: ["malignant_hyperthermia_antidote", "ryanodine_blocker", "life_saving"],
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
      onset: "سريع (خلال دقائق من الحقن الوريدي المباشر)",
      peak: "سريع",
      clinicalDuration: "4 – 8 ساعات (تثبيط تحرر الكالسيوم من الشبكة الهيولية العضلية)"
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
          allowed: ["TBW"],
          preferred: "TBW"
        },
        validation: {
          requireWeight: true,
          requireMonitoringConfirmation: true
        },
        isDefault: true,
        note: "تُكرر الجرعة (2.5 mg/kg) كل 5-10 دقائق حتى هبوط الـ EtCO2 واسترخاء العضلات واستقرار الحرارة والنبض (الجرعة الإجمالية قد تتجاوز 10 mg/kg)."
      }
    ],
    toxicitySignals: ["marked_muscle_weakness", "phlebitis", "hepatotoxicity_chronic"],
    warnings: [
      "⚠️ يُمنع إعطاء حاصرات قنوات الكالسيوم (CCBs مثل الفيراباميل أو الديلتيازيم) تزامناً مع الدانترولين لخطورة حدوث انهيار قلبي وعائي وفرط بوتاسيوم دم قاتل.",
      "ضعف عضلي عام وشديد بعد الإعطاء يتطلب استمرار دعم المجرى الهوائي والتهوية الآلية."
    ],
    contraindications: [
      "لا توجد موانع استعمال في تدبير أزمة فرط الحرارة الخبيث المهددة للحياة."
    ],
    references: [
      {
        organization: "MHAUS",
        title: "Malignant Hyperthermia Emergency Management Protocol",
        year: "2024",
        evidenceLevel: "guideline"
      }
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
    availability: {
      status: "standard",
      regionDependent: false,
      note: "ترياق طوارئ نوعي وإلزامي التوفر في كل موقع يُجرى فيه تخدير نصفي أو موضعي بحجوم كبيرة."
    },
    evidence: {
      sourceOrganization: "ASRA",
      documentTitle: "ASRA Practice Advisory on Local Anesthetic Systemic Toxicity (LAST)",
      evidenceLevel: "guideline"
    },
    safety: {
      highRiskMedication: true,
      operationalSafetyRequirements: [
        "defibrillator_available",
        "airway_equipment_available",
        "continuous_ecg_monitoring"
      ]
    },
    calculationPolicy: {
      mode: "reference_only_with_non_actionable_math",
      automaticDoseCalculation: false,
      permittedCalculations: ["volume_conversion_for_display"],
      prohibitedCalculations: ["automatic_bolus_order", "automatic_infusion_start"],
      requireClinicianConfirmation: true
    },
    clinicalFlags: ["last_antidote", "lipid_sink", "asra_checklist"],
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
      onset: "فوري (امتصاص السموم الجزيئية الدهنية Lipid Sink وتنشيط استقلاب القلب)",
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
          allowed: ["TBW", "IBW"],
          preferred: "IBW",
          note: "في مرضى السمنة المفرطة، توصي إرشادات ASRA بالحساب على الوزن المثالي (IBW)."
        },
        validation: {
          requireWeight: true,
          requireMonitoringConfirmation: true
        },
        isDefault: true,
        note: "تُتبع فوراً ببدء التسريب المستمر (0.25 mL/kg/min)؛ يمكن تكرار الجرعة الدفعية مرة أو مرتين إذا استمر عدم الاستقرار القلبي."
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
        doseLimits: {
          maximumCumulativeDoseMlKg: 12.0,
          note: "الحد الأقصى التراكمي الموصى به للإعطاء خلال أول 30 دقيقة هو 10 - 12 mL/kg."
        },
        weightPolicy: {
          allowed: ["IBW"]
        },
        validation: {
          requireWeight: true,
          requireMonitoringConfirmation: true
        },
        note: "يستمر التسريب لمدة لا تقل عن 10 دقائق بعد استقرار المؤشرات الديناميكية الوعائية."
      }
    ],
    toxicitySignals: ["hypertriglyceridemia", "pancreatitis", "interference_with_lab_tests"],
    warnings: [
      "الإنعاش المتقدم في LAST: يجب خفض جرعات الأدرينالين (Epinephrine) الفردية إلى <1 mcg/kg وتجنب حاصرات بيتا وحاصرات قنوات الكالسيوم والفازوبريسين.",
      "يسبب عكارة شديدة في الدم قد تتداخل مع الفحوصات المخبرية الدموية."
    ],
    contraindications: [
      "لا توجد موانع استعمال في تدبير أزمة LAST المهددة للحياة."
    ],
    references: [
      {
        organization: "ASRA",
        title: "Checklist for Treatment of Local Anesthetic Systemic Toxicity",
        year: "2024",
        evidenceLevel: "guideline"
      }
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
    availability: {
      status: "standard",
      regionDependent: false
    },
    evidence: {
      sourceOrganization: "FDA",
      documentTitle: "Zofran (Ondansetron HCl Injection) Prescribing Information",
      evidenceLevel: "regulatory"
    },
    safety: {
      highRiskMedication: false,
      operationalSafetyRequirements: [
        "continuous_ecg_monitoring_if_long_qt"
      ]
    },
    calculationPolicy: {
      mode: "reference_only_with_non_actionable_math",
      automaticDoseCalculation: false,
      permittedCalculations: ["volume_conversion_for_display"],
      prohibitedCalculations: ["automatic_bolus_order"],
      requireClinicianConfirmation: true
    },
    clinicalFlags: ["ponv_prophylaxis", "qt_prolongation_risk"],
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
      },
      {
        id: "ponv_prophylaxis_pediatric",
        population: "pediatric",
        route: "IV",
        label: "الوقاية للأطفال (Pediatric PONV Prophylaxis)",
        doseMin: 0.1,
        doseMax: 0.1,
        unit: DOSE_UNITS.MG_PER_KG,
        doseType: "weight_bolus",
        basis: "weight_based_reference",
        doseLimits: {
          maximumSingleDoseMg: 4.0
        },
        validation: {
          requireAge: true,
          requireWeight: true
        },
        note: "0.1 mg/kg بحد أقصى 4 mg وريدياً."
      }
    ],
    toxicitySignals: ["qt_prolongation", "serotonin_syndrome"],
    warnings: [
      "تطاول فاصل QT المعتمد على الجرعة؛ يُستخدم بحذر في مرضى متلازمة QT الطويلة الخلقية أو عند التزامن مع أدوية تطيل فاصل QT.",
      "الصداع والإمساك العابر من أكثر الآثار الجانبية شيوعاً."
    ],
    contraindications: [
      "الاستخدام المتزامن مع دواء الأبومورفين (Apomorphine) لخطورة حدوث هبوط ضغط حاد وفقدان وعي.",
      "فرط الحساسية للأوندانسيترون أو مضادات 5-HT3 الأخرى."
    ],
    references: [
      {
        organization: "FDA",
        title: "Zofran (Ondansetron Hydrochloride) Prescribing Information",
        year: "2024",
        evidenceLevel: "regulatory"
      }
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
    availability: {
      status: "standard",
      regionDependent: false
    },
    evidence: {
      sourceOrganization: "FDA",
      documentTitle: "Dexamethasone Sodium Phosphate Injection Prescribing Information",
      evidenceLevel: "regulatory"
    },
    safety: {
      highRiskMedication: false,
      operationalSafetyRequirements: []
    },
    calculationPolicy: {
      mode: "reference_only_with_non_actionable_math",
      automaticDoseCalculation: false,
      permittedCalculations: ["volume_conversion_for_display"],
      prohibitedCalculations: ["automatic_bolus_order"],
      requireClinicianConfirmation: true
    },
    clinicalFlags: ["ponv_prophylaxis", "airway_edema_reduction", "perineal_burning_awake"],
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
      },
      {
        value: 8,
        concentration: 8,
        unit: DOSE_UNITS.MG_PER_ML,
        label: "8 mg/mL (فيال عالي التركيز)"
      }
    ],
    pharmacodynamics: {
      onset: "1 – 2 ساعة (يتطلب وقتاً للتأثير الجيني والخلوي)",
      peak: "4 – 8 ساعات",
      clinicalDuration: "24 – 72 ساعة (تأثير ممتد طويل الأمد)"
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
        note: "إعطاؤه في بداية العملية أفضل بكثير من نهايتها؛ يقلل أيضاً من آلام ما بعد الجراحة واستهلاك الأفيونات."
      }
    ],
    toxicitySignals: ["transient_hyperglycemia", "perineal_pruritus_burning"],
    warnings: [
      "حقنه وريدياً بسرعة للمريض المستيقظ يسبب حرقة وألماً عجانياً شرجياً عابراً ومزعجاً جداً (Perineal Burning)؛ يُفضل إعطاؤه بعد تنويم المريض.",
      "ارتفاع عابر في سكر الدم (Hyperglycemia) يستمر 24 ساعة؛ يُراعى ضبط جرعات الأنسولين لدى مرضى السكري."
    ],
    contraindications: [
      "الإنتان الفطري الجهازي غير المعالج.",
      "فرط الحساسية للديكساميثازون."
    ],
    references: [
      {
        organization: "FDA",
        title: "Dexamethasone Sodium Phosphate Injection Labeling",
        year: "2024",
        evidenceLevel: "regulatory"
      }
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
    availability: {
      status: "standard",
      regionDependent: false
    },
    evidence: {
      sourceOrganization: "FDA",
      documentTitle: "Reglan (Metoclopramide Injection) Prescribing Information",
      evidenceLevel: "regulatory"
    },
    safety: {
      highRiskMedication: false,
      operationalSafetyRequirements: []
    },
    calculationPolicy: {
      mode: "reference_only_with_non_actionable_math",
      automaticDoseCalculation: false,
      permittedCalculations: ["volume_conversion_for_display"],
      prohibitedCalculations: ["automatic_bolus_order"],
      requireClinicianConfirmation: true
    },
    clinicalFlags: ["prokinetic", "lower_esophageal_sphincter_tone", "extrapyramidal_symptoms_risk"],
    indications: [
      {
        id: "gastric_emptying_aspiration_prophylaxis",
        label: { en: "Acceleration of gastric emptying and aspiration prophylaxis", ar: "تسريع إفراغ المعدة وزيادة مقوية معصرة المريء السفلية للوقاية من الارتجاف الرئوي" }
      },
      {
        id: "ponv_treatment",
        label: { en: "Prevention and treatment of postoperative nausea and vomiting", ar: "علاج والوقاية من الغثيان والقيء بعد العمليات الجراحية" }
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
          duration: "حقن وريدي بطيء على مدى 2 إلى 3 دقائق لتجنب القلق والتململ الحركي الحاد (Akathisia)"
        },
        validation: {
          requireAge: true
        },
        isDefault: true,
        note: "تُعطى 10 mg وريدياً ببطء قبل العملية بـ 15-30 دقيقة في حالات المعدة الممتلئة والعمليات الطارئة."
      }
    ],
    toxicitySignals: ["extrapyramidal_symptoms", "acute_dystonia", "akathisia", "tardive_dyskinesia"],
    warnings: [
      "أعراض خارج هرمية واختلاجات عضلية حادة (Extrapyramidal Symptoms / Acute Dystonia) خاصة لدى اليافعين والشباب؛ تُعالج فوراً بالدايفينهيدرامين (Diphenhydramine) أو البنزوتروبين.",
      "الحقن الوريدي السريع يسبب شعوراً شديداً بالتململ الحركي والذعر والتوتر المفاجئ (Akathisia)."
    ],
    contraindications: [
      "الانسداد أو الانثقاب أو النزف الهضمي الميكانيكي.",
      "مرض باركنسون واضطرابات الحركة الصرعية.",
      "ورم القواتم (Pheochromocytoma).",
      "فرط الحساسية للميتوكلوبراميد."
    ],
    references: [
      {
        organization: "FDA",
        title: "Reglan (Metoclopramide Injection) Prescribing Information & Boxed Warning",
        year: "2024",
        evidenceLevel: "regulatory"
      }
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
    availability: {
      status: "standard",
      regionDependent: false,
      note: "البديل الحديث والآمن لمثبطات H2 بعد السحب العالمي لعقار الرانيتيدين."
    },
    evidence: {
      sourceOrganization: "FDA",
      documentTitle: "Pepcid (Famotidine Injection) Prescribing Information",
      evidenceLevel: "regulatory"
    },
    safety: {
      highRiskMedication: false,
      operationalSafetyRequirements: []
    },
    calculationPolicy: {
      mode: "reference_only_with_non_actionable_math",
      automaticDoseCalculation: false,
      permittedCalculations: ["volume_conversion_for_display"],
      prohibitedCalculations: ["automatic_bolus_order"],
      requireClinicianConfirmation: true
    },
    clinicalFlags: ["aspiration_risk_reduction", "ph_elevation"],
    indications: [
      {
        id: "aspiration_prophylaxis",
        label: { en: "Reduction of gastric acid volume and elevation of gastric pH", ar: "الوقاية من متلازمة الارتجاف الرئوي الحامضي (Mendelson's Syndrome) في المرضى المعرضين للارتجاع" }
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
          duration: "تُخفف في 5-10 مل سالاين وتُحقن ببطء على مدى دقيقتين لتفادي بطء القلب وهبوط الضغط."
        },
        validation: {
          requireAge: true
        },
        isDefault: true,
        note: "تُعطى قبل العملية بـ 45-60 دقيقة لرفع درجة حموضة محتوى المعدة (>2.5)."
      }
    ],
    toxicitySignals: ["bradycardia_rapid_iv", "headache"],
    warnings: [
      "الحقن الوريدي السريع قد يسبب هبوطاً عابراً في ضغط الدم وبطء قلب نادراً.",
      "تتطلب خفض الجرعة إلى 50% أو إطالة الفاصل الزمني في مرضى القصور الكلوي الشديد (CrCl < 50 mL/min)."
    ],
    contraindications: [
      "فرط الحساسية المعروفة للفاموتيدين أو مضادات مستقبلات H2 الأخرى."
    ],
    references: [
      {
        organization: "FDA",
        title: "Pepcid (Famotidine) Injection Prescribing Information",
        year: "2024",
        evidenceLevel: "regulatory"
      }
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
    availability: {
      status: "standard",
      regionDependent: true
    },
    evidence: {
      sourceOrganization: "FDA / Anesthesia Guidelines",
      documentTitle: "Sodium Citrate Oral Solution USP Labeling",
      evidenceLevel: "regulatory"
    },
    safety: {
      highRiskMedication: false,
      operationalSafetyRequirements: []
    },
    calculationPolicy: {
      mode: "reference_only_with_non_actionable_math",
      automaticDoseCalculation: false,
      permittedCalculations: [],
      prohibitedCalculations: ["automatic_bolus_order"],
      requireClinicianConfirmation: true
    },
    clinicalFlags: ["emergency_c_section", "rapid_gastric_neutralization", "non_particulate"],
    indications: [
      {
        id: "emergency_aspiration_prophylaxis",
        label: { en: "Rapid neutralization of gastric acidity prior to emergency anesthesia / Cesarean section", ar: "المعادلة الفورية السريعة لحموضة المعدة قبل عمليات الولادة القيصرية الإسعافية وحالات المعدة الممتلئة" }
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
      onset: "فوري (خلال 5 – 10 دقائق من الشرب الفموي)",
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
        note: "مضاد حموضة غير جزيئي (Non-particulate)؛ لا يسبب أذية رئة حبيبية عند الارتجاف الرئوي بخلاف هيدروكسيد المغنيسيوم/الألمنيوم."
      }
    ],
    toxicitySignals: ["nausea_vomiting_unpleasant_taste"],
    warnings: [
      "يرفع حجم محتوى المعدة بشكل طفيف ولكنه يرفع درجة الـ pH إلى > 5.0 مما يلغي خطر الحروق الكيميائية الرئوية (Mendelson's Syndrome).",
      "غير مخصص للحقن الوريدي؛ يُعطى فموياً حصراً."
    ],
    contraindications: [
      "القصور الكلوي الحاد الشديد أو فرط صوديوم الدم الحاد.",
      "المرضى الفاقدون للوعي قبل تأمين المجرى الهوائي."
    ],
    references: [
      {
        organization: "FDA",
        title: "Sodium Citrate and Citric Acid Oral Solution USP",
        year: "2024",
        evidenceLevel: "regulatory"
      }
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
    availability: {
      status: "standard",
      regionDependent: false
    },
    evidence: {
      sourceOrganization: "FDA",
      documentTitle: "Marcaine (Bupivacaine HCl) Injection Prescribing Information",
      evidenceLevel: "regulatory"
    },
    safety: {
      highRiskMedication: true,
      operationalSafetyRequirements: [
        "lipid_emulsion_20_available",
        "continuous_ecg_monitoring",
        "resuscitation_equipment_ready"
      ]
    },
    calculationPolicy: {
      mode: "reference_only_with_non_actionable_math",
      automaticDoseCalculation: false,
      permittedCalculations: ["volume_conversion_for_display"],
      prohibitedCalculations: ["automatic_bolus_order"],
      requireClinicianConfirmation: true
    },
    clinicalFlags: ["cardiotoxicity_high_risk", "spinal_heavy_vs_plain", "last_risk", "long_acting"],
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
      onset: "5 – 15 دقيقة (حصر محيطي) / 2 – 5 دقائق (تخدير نصفي شوكي)",
      peak: "15 – 30 دقيقة",
      clinicalDuration: "3 – 6 ساعات (تخدير طويل الأمد)"
    },
    doseLimits: {
      maxSingleDosePlainMgKg: 2.0,
      absoluteMaxPlainMg: 175.0,
      maxWithEpiMgKg: 2.5,
      absoluteMaxWithEpiMg: 225.0,
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
    toxicitySignals: ["refractory_ventricular_arrhythmias", "seizures", "cardiovascular_collapse"],
    warnings: [
      "⚠️ سمية قلبية شديدة (Severe Cardiotoxicity): يرتبط بقوة وبشكل غير عكوس بقنوات الصوديوم القلبية؛ الحقن الوريدي غير المقصود يسبب رجفاناً بطينياً معنداً وتوقف قلب حاد يصعب إنعاشه.",
      "⚠️ يُمنع منعاً باتاً استخدامه في التخدير الناحي الوريدي (Bier Block).",
      "الشفط السلبي المتكرر (Aspiration) قبل وأثناء الحقن إلزامي لاستبعاد الدخول الوعائي."
    ],
    contraindications: [
      "التخدير الناحي الوريدي (IVRA / Bier Block) — مانع استعمال مطلق لخطورة الوفاة.",
      "فرط الحساسية للمخدرات الموضعية من زمرة الأميدات.",
      "موانع التخدير النصفي الشوكي (رفض المريض، اعتلال الخثرة الحاد، إنتان موقع الحقن، الصدمة نقص الحجم الشديدة)."
    ],
    references: [
      {
        organization: "FDA",
        title: "Marcaine (Bupivacaine HCl) Prescribing Information & Boxed Warnings",
        year: "2024",
        evidenceLevel: "regulatory"
      }
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
    availability: {
      status: "standard",
      regionDependent: false
    },
    evidence: {
      sourceOrganization: "FDA / AHA",
      documentTitle: "Xylocaine (Lidocaine HCl Injection) Prescribing Information",
      evidenceLevel: "regulatory_and_guideline"
    },
    safety: {
      highRiskMedication: true,
      operationalSafetyRequirements: [
        "lipid_emulsion_20_available",
        "resuscitation_equipment_ready",
        "continuous_ecg_monitoring"
      ]
    },
    calculationPolicy: {
      mode: "reference_only_with_non_actionable_math",
      automaticDoseCalculation: false,
      permittedCalculations: ["volume_conversion_for_display", "unit_conversion_for_review"],
      prohibitedCalculations: ["automatic_bolus_order"],
      requireClinicianConfirmation: true
    },
    clinicalFlags: ["last_risk", "iv_blunting_airway", "antiarrhythmic_class_1b", "infiltration_max_dose"],
    indications: [
      {
        id: "local_infiltration_nerve_block",
        label: { en: "Local infiltration anesthesia and peripheral nerve blocks", ar: "التخدير الارتشاحي الموضعي وحصر الأعصاب المحيطية" }
      },
      {
        id: "iv_intubation_blunting",
        label: { en: "IV blunting of airway reflexes and intubation response", ar: "تثبيط ردود الفعل الحنجرية والوعائية للتنبيب وتقليل ألم حقن البروبوفول" }
      },
      {
        id: "ventricular_arrhythmias_acls",
        label: { en: "Treatment of ventricular arrhythmias (VT/VF in ACLS)", ar: "علاج اللانظميات البطينية كبديل للأميودارون في بروتوكول ACLS" }
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
      },
      {
        value: 10,
        concentration: 10,
        unit: DOSE_UNITS.MG_PER_ML,
        percentage: 1.0,
        label: "1% with Epinephrine 1:100,000 (10 mg/mL + 10 mcg/mL Epi)"
      },
      {
        value: 20,
        concentration: 20,
        unit: DOSE_UNITS.MG_PER_ML,
        percentage: 2.0,
        label: "2% with Epinephrine 1:200,000 (20 mg/mL + 5 mcg/mL Epi)"
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
          allowed: ["TBW", "IBW"],
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
        id: "acls_vt_vf_arrest_bolus",
        population: "adult",
        route: "IV",
        label: "اللانظميات البطينية في توقف القلب (ACLS Refractory VF/pVT Bolus)",
        doseMin: 1.0,
        doseMax: 1.5,
        unit: DOSE_UNITS.MG_PER_KG,
        doseType: "weight_bolus",
        basis: "acls_guideline_protocol",
        administration: {
          method: "rapid_iv_push"
        },
        weightPolicy: {
          allowed: ["TBW", "IBW"],
          preferred: "TBW"
        },
        validation: {
          requireWeight: true,
          requireMonitoringConfirmation: true
        },
        note: "الجرعة الأولى 1.0 - 1.5 mg/kg؛ يمكن تكرار 0.5 - 0.75 mg/kg كل 5-10 دقائق (الحد الأقصى الإجمالي 3 mg/kg)."
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
          allowed: ["IBW", "TBW"],
          preferred: "IBW"
        },
        validation: {
          requireWeight: true
        },
        note: "تأكد من عدم تجاوز السقف الحجمي المسموح به بناءً على تركيز المحلول المستخدم."
      }
    ],
    toxicitySignals: ["metallic_taste", "perioral_numbness", "tinnitus", "seizures", "cardiac_arrest"],
    warnings: [
      "⚠️ علامات التسمم الجهازي الباكرة (LAST Early Signs): طعم معدني في الفم، خدر حول الشفاه، طنين في الأذن، رجفان، تلعثم الكلام، يليه اختلاجات صرعية وتثبيط قلبي وعائي.",
      "يُمنع استخدام المحاليل المحتوية على الأدرينالين في التخدير الموضعي للأطراف والنهايات الحركية المعلقة (الأصابع، الأنف، صيوان الأذن، القضيب) لخطر النخر الإقفاري."
    ],
    contraindications: [
      "فرط الحساسية للمخدرات الموضعية من زمرة الأميدات.",
      "حصار القلب المتقدم من الدرجة الثانية أو الثالثة (عند الاستخدام الوريدي كخافض للنظم)."
    ],
    references: [
      {
        organization: "FDA",
        title: "Xylocaine (Lidocaine HCl) Prescribing Information",
        year: "2024",
        evidenceLevel: "regulatory"
      }
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
    availability: {
      status: "standard",
      regionDependent: false
    },
    evidence: {
      sourceOrganization: "FDA",
      documentTitle: "Naropin (Ropivacaine HCl Injection) Prescribing Information",
      evidenceLevel: "regulatory"
    },
    safety: {
      highRiskMedication: true,
      operationalSafetyRequirements: [
        "lipid_emulsion_20_available",
        "resuscitation_equipment_ready",
        "continuous_ecg_monitoring"
      ]
    },
    calculationPolicy: {
      mode: "reference_only_with_non_actionable_math",
      automaticDoseCalculation: false,
      permittedCalculations: ["volume_conversion_for_display"],
      prohibitedCalculations: ["automatic_bolus_order"],
      requireClinicianConfirmation: true
    },
    clinicalFlags: ["reduced_cardiotoxicity", "motor_sparing", "epidural_nerve_blocks", "long_acting"],
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
      },
      {
        value: 10,
        concentration: 10,
        unit: DOSE_UNITS.MG_PER_ML,
        percentage: 1.0,
        label: "1.0% (10 mg/mL - للتخدير الجراحي العميق فوق الجافية)"
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
      maxWithEpiMgKg: 3.5,
      absoluteMaxWithEpiMg: 250.0,
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
        note: "يتميز بخاصية الحفاظ الحركي (Motor Sparing) حيث يوفر تسكيناً حسياً ممتازاً مع شلل حركي أقل بكثير من البوبيفاكايين."
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
        note: "يوفر تسكيناً جراحياً ممتداً يدوم حتى 12-24 ساعة عند المشاركة في تسكين ما بعد العمليات."
      }
    ],
    toxicitySignals: ["cns_toxicity", "cardiovascular_depression"],
    warnings: [
      "على الرغم من أن الروبيفاكايين يمتلك هامش أمان قلبي وعائي أوسع وأقل سمية قلبية من البوبيفاكايين (لأنه S-enantiomer نقي)، إلا أن التسمم الجهازي (LAST) وارد الحدوث عند الحقن الوعائي الخاطئ.",
      "الشفط السلبي المتكرر قبل وأثناء الحقن إلزامي."
    ],
    contraindications: [
      "فرط الحساسية للمخدرات الموضعية من زمرة الأميدات.",
      "التخدير الناحي الوريدي (Bier Block)."
    ],
    references: [
      {
        organization: "FDA",
        title: "Naropin (Ropivacaine HCl) Prescribing Information",
        year: "2024",
        evidenceLevel: "regulatory"
      }
    ]
  }
];

export default supportingDrugsData;
