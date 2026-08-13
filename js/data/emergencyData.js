/**
 * Emergency & Resuscitation Protocols Reference Data
 *
 * AnesthesiaX — Phase 10.0 (Clinical Reference v10.0.0 - Data Revision v2.1)
 * File: js/data/emergencyData.js
 *
 * Single Source of Truth for Emergency Protocols, State Machines, Drug Dosing Rules,
 * Unit Normalization, and Clinical Evidence Traceability.
 *
 * Primary Evidence Sources & Traceability:
 * 1. ACLS: American Heart Association (AHA) 2025 Guidelines for CPR and ECC - Adult Advanced Life Support.
 * 2. MH: MHAUS & European Malignant Hyperthermia Group (EMHG) 2024 Crisis Guidelines.
 * 3. LAST: American Society of Regional Anesthesia and Pain Medicine (ASRA) 2020 LAST Practice Advisory & Checklist.
 * 4. Anaphylaxis: Resuscitation Council UK (RCUK 2021) & Association of Anaesthetists Perioperative Anaphylaxis Guideline.
 * 5. Airway: Difficult Airway Society (DAS) 2025 Guidelines for Management of Unanticipated Difficult Intubation in Adults.
 *
 * Architecture: Pure Immutable Data ES Module. Standardized State Machine Contract. Zero DOM/UI dependencies.
 */

export const emergencyData = {
  meta: {
    version: "10.0.0",
    dataRevision: "clinical-reference-v2.1",
    module: "Emergency Protocols & Crisis Cognitive Aids",
    disclaimer: "Cognitive Aid استرشادي وتوجيهي أثناء الأزمات الطبية. لا يستبدل الحكم السريري المباشر أو البروتوكولات المحلية الخاصة بالمركز الطبي.",
    evidenceSources: [
      {
        id: "src_aha_2025",
        organization: "American Heart Association (AHA)",
        document: "2025 AHA Guidelines for CPR and ECC - Adult Advanced Life Support",
        year: 2025,
        url: "https://professional.heart.org"
      },
      {
        id: "src_mhaus_2024",
        organization: "MHAUS / EMHG",
        document: "Managing an Acute Malignant Hyperthermia Crisis Guidelines",
        year: 2024,
        url: "https://www.mhaus.org"
      },
      {
        id: "src_asra_2020",
        organization: "ASRA Pain Medicine",
        document: "Local Anesthetic Systemic Toxicity Checklist & Practice Advisory (2020 Edition)",
        year: 2020,
        url: "https://www.asra.com"
      },
      {
        id: "src_rcuk_2021",
        organization: "Resuscitation Council UK / Association of Anaesthetists",
        document: "Emergency Treatment of Anaphylaxis & Perioperative Anaphylaxis Guideline",
        year: 2021,
        url: "https://www.resus.org.uk"
      },
      {
        id: "src_das_2025",
        organization: "Difficult Airway Society (DAS)",
        document: "2025 Guidelines for Management of Unanticipated Difficult Intubation in Adults",
        year: 2025,
        url: "https://das.uk.com"
      }
    ]
  },

  // =========================================================================
  // 1. FORMULATIONS (MH DANTROLENE FORMULATION SPLIT)
  // =========================================================================
  formulations: {
    dantrolene: {
      dantrium: {
        id: "dantrium",
        name: "Dantrium / Revonto (Standard Dantrolene)",
        vialSizeMg: 20.0,
        vialDiluentMl: 60.0,
        reconstitutedConcMgMl: 0.333,
        instructions: "حل كل فيال (20 mg) بـ 60 mL ماء معقم للحقن ورجها جيدة دون إضاعة الوقت."
      },
      ryanodex: {
        id: "ryanodex",
        name: "Ryanodex (Concentrated Dantrolene Formulation)",
        vialSizeMg: 250.0,
        vialDiluentMl: 5.0,
        reconstitutedConcMgMl: 50.0,
        instructions: "حل كل فيال (250 mg) بـ 5 mL ماء معقم للحقن فقط ورجها لثوانٍ."
      }
    }
  },

  // =========================================================================
  // 2. CLINICAL EVIDENCE MATRIX & DRUG DOSING RULES
  // =========================================================================
  drugDosingRules: {
    epinephrine_acls: {
      id: "epinephrine_acls",
      name: "Epinephrine (Adrenaline)",
      indication: "Adult Cardiac Arrest (ACLS)",
      fixedDoseMg: 1.0,
      unit: "mg",
      route: "IV/IO",
      repeatInterval: "Every 3-5 minutes during CPR",
      evidenceRef: "src_aha_2025",
      notes: "تركيز 1:10,000 (0.1 mg/mL) - حجم 10 mL. غسل المنفذ الوريدي بـ 20 mL سوائل بعد كل جرعة."
    },

    amiodarone_acls: {
      id: "amiodarone_acls",
      name: "Amiodarone",
      indication: "Refractory VF / Pulseless VT",
      initialDoseMg: 300.0,
      repeatDoseMg: 150.0,
      repeatCondition: "Single repeat dose if refractory VF/pVT persists after next shock",
      unit: "mg",
      route: "IV/IO Bolus",
      evidenceRef: "src_aha_2025",
      notes: "بديل: Lidocaine 1.0-1.5 mg/kg IV كجرعة أولى، ثم 0.5-0.75 mg/kg عند الحاجة."
    },

    dantrolene_mh: {
      id: "dantrolene_mh",
      name: "Dantrolene Sodium",
      indication: "Malignant Hyperthermia Crisis",
      dosePerKg: 2.5,
      unit: "mg",
      route: "IV Rapid Push",
      repeatInterval: "Every 3-5 minutes as clinically indicated",
      reEvaluationThresholdMgKg: 10.0,
      evidenceRef: "src_mhaus_2024",
      notes: "إعطاء 2.5 mg/kg IV فوراً وتكرارها كل 3-5 دقائق. عتبة 10 mg/kg هي نقطة إعادة تقييم سريري وإعادة تفكير في التشخيص وليست حداً أقصى يمنع الجرعات التراكمية الأعلى عند استمرار النوبة."
    },

    lipid_emulsion_20: {
      id: "lipid_emulsion_20",
      name: "20% Lipid Emulsion (Intralipid)",
      indication: "Local Anesthetic Systemic Toxicity (LAST)",
      bolusMlKg: 1.5,
      infusionMlKgMin: 0.25,
      doubleInfusionMlKgMin: 0.50,
      maxCumulativeMlKg: 12.0,
      unit: "mL",
      route: "IV",
      evidenceRef: "src_asra_2020",
      notes: "إعطاء الدفعة خلال دقيقة واحدة، ثم بدء التسريب. تكرار الدفعة وتضاعف التسريب عند استمرار عدم الاستقرار الوعائي حتى الحد الأقصى 12 mL/kg."
    },

    epinephrine_anaphylaxis_iv: {
      id: "epinephrine_anaphylaxis_iv",
      name: "Epinephrine (Adrenaline) - Perioperative IV",
      indication: "Perioperative Anaphylaxis with Spontaneous Circulation and established IV access",
      initialDoseMcg: 50.0,
      unit: "mcg",
      route: "IV Titrated",
      repeatInterval: "Titrate 20-50 mcg every 1-2 minutes according to response",
      evidenceRef: "src_rcuk_2021",
      notes: "يُفضل استخدام محلول مخفف (10 mcg/mL) لإعطاء جرعات وريدية دقيقة. في حال حدوث توقف القلب (Cardiac Arrest) انتقل فوراً لجرعات ACLS المعتمدة (1 mg IV)."
    },

    epinephrine_anaphylaxis_im: {
      id: "epinephrine_anaphylaxis_im",
      name: "Epinephrine (Adrenaline) - IM Fallback",
      indication: "Perioperative Anaphylaxis WITHOUT established IV access",
      dosePerKgMcg: 10.0,
      maxDoseMcg: 500.0,
      unit: "mcg",
      route: "IM (Mid-Outer Thigh)",
      evidenceRef: "src_rcuk_2021",
      notes: "الخيار البديل فقط عند تعذر المنفذ الوريدي الفوري داخل غرفة العمليات."
    },

    succinylcholine_laryngospasm: {
      id: "succinylcholine_laryngospasm",
      name: "Succinylcholine (Scoline)",
      indication: "Severe/Persistent Laryngospasm",
      ivDoseMgKg: 1.0,
      imDoseMgKg: 4.0,
      unit: "mg",
      route: "IV or IM",
      evidenceRef: "src_das_2025",
      notes: "تُعطى 1.0 mg/kg وريدياً، أو 4.0 mg/kg عضلياً في حال عدم توفر منفذ وريدي. يُوصى بـ Atropine عند الأطفال لمنع تباطؤ القلب."
    }
  },

  // =========================================================================
  // 3. UNIT SAFETY AND NORMALIZATION RULES
  // =========================================================================
  unitValidation: {
    weightKg: { min: 1.0, max: 300.0, dangerousMin: 3.0, dangerousMax: 200.0, defaultUnit: "kg" },
    fio2: { minDecimal: 0.21, maxDecimal: 1.00, minPercent: 21.0, maxPercent: 100.0 },
    etco2: { minMmHg: 0, maxMmHg: 150, normalMin: 35, normalMax: 45 },
    tempCelsius: { min: 20.0, max: 45.0, normalMin: 36.0, normalMax: 37.5, mhCoolingStartThreshold: 39.0, mhCoolingStopThreshold: 38.0 }
  },

  // =========================================================================
  // 4. PROTOCOLS & STATE MACHINES (STANDARDIZED STATE CONTRACT)
  // =========================================================================
  protocols: {

    // -----------------------------------------------------------------------
    // A. ACLS / CARDIAC ARREST (AHA 2025)
    // -----------------------------------------------------------------------
    acls: {
      id: "acls",
      title: "بروتوكول الإنعاش القلبي الرئوي المتقدم للبالغين (Adult ACLS)",
      evidenceRef: "src_aha_2025",
      initialState: "RHYTHM_CHECK",
      states: {
        RHYTHM_CHECK: {
          id: "RHYTHM_CHECK",
          title: "فحص الإيقاع القلبي والنبض (Rhythm & Pulse Check)",
          terminal: false,
          actionItems: [
            { id: "check_pulse", label: "معاينة النبض الشرياني وإيقاع ECG (أقل من 10 ثوانٍ)", critical: true },
            { id: "call_code", label: "تفعيل فريق الإنعاش الإسعافي وتجهيز جهاز الصدمات (Defibrillator)", critical: true }
          ],
          branches: [
            { label: "إيقاع قابل للصدمة (VF / Pulueless VT)", targetState: "SHOCKABLE_LOOP" },
            { label: "إيقاع غير قابل للصدمة (PEA / Asystole)", targetState: "NON_SHOCKABLE_LOOP" }
          ]
        },

        SHOCKABLE_LOOP: {
          id: "SHOCKABLE_LOOP",
          title: "مسار الرجفان والتسارع البطيني اللاطبضي (VF / Pulseless VT Loop)",
          terminal: false,
          isShockable: true,
          actionItems: [
            { id: "defib_shock", label: "1. إعطاء الصدمة الكهربائية بجرعة Biphasic الموصى بها من المصنع (عادة 120-200J) أو الطاقة القصوى المتاحة", critical: true },
            { id: "cpr_2min_shockable", label: "2. بدء الإنعاش القلبي الرئوي (CPR 2 min) فوراً دون تأخير، مع التهوية بـ 100% O₂ وتأمين منفذ IV/IO", critical: true },
            { id: "epi_and_antiarrhythmia", label: "3. عند استمرار VF/pVT: إعطاء Epinephrine 1 mg كل 3-5 دقائق. إعطاء Amiodarone 300 mg (أو Lidocaine) بعد الصدمة الثالثة", critical: true }
          ],
          branches: [
            { label: "إعادة فحص الإيقاع واستمرار VF/pVT (كرر الدورة)", targetState: "SHOCKABLE_LOOP" },
            { label: "تحول الإيقاع إلى غير قابل للصدمة (PEA/Asystole)", targetState: "NON_SHOCKABLE_LOOP" },
            { label: "عودة الدوران التلقائي (ROSC)", targetState: "POST_ROSC" }
          ]
        },

        NON_SHOCKABLE_LOOP: {
          id: "NON_SHOCKABLE_LOOP",
          title: "مسار النشاط الكهربائي بلا نبض وتوقف الانقباض (PEA / Asystole Loop)",
          terminal: false,
          isShockable: false,
          actionItems: [
            { id: "immediate_epi", label: "1. إعطاء Epinephrine 1 mg IV/IO بأسرع ما يمكن فور التعرف على الإيقاع وتكراره كل 3-5 دقائق", critical: true },
            { id: "cpr_2min_nonshockable", label: "2. استمرار CPR متواصل دقيقتين مع التهوية المتقدمة ومراقبة Capnography", critical: true },
            { id: "search_hs_ts", label: "3. البحث الفوري وعلاج الأسباب القابلة للعكس (5 Hs & 5 Ts)", critical: true }
          ],
          branches: [
            { label: "إعادة فحص الإيقاع واستمرار PEA/Asystole (كرر الدورة)", targetState: "NON_SHOCKABLE_LOOP" },
            { label: "تحول الإيقاع إلى قابل للصدمة (VF/pVT)", targetState: "SHOCKABLE_LOOP" },
            { label: "عودة الدوران التلقائي (ROSC)", targetState: "POST_ROSC" }
          ]
        },

        POST_ROSC: {
          id: "POST_ROSC",
          title: "رعاية ما بعد عودة الدوران التلقائي (Post-ROSC Care)",
          terminal: true,
          actionItems: [
            { id: "airway_rosc", label: "تأمين المجرى الهوائي والضبط الميكانيكي للتنفس", critical: true },
            { id: "o2_titration", label: "معايرة الأوكسجين: خفض FiO₂ لتحقيق SpO₂ بين 90-98% (تجنب فرط الأكسجة Hyperoxia وفق AHA 2025)", critical: true },
            { id: "bp_target", label: "ضبط الضغط: المحافظة على SBP ≥ 90 mmHg أو MAP ≥ 65 mmHg", critical: true },
            { id: "ecg_12lead", label: "إجراء تخطيط قلب 12-Lead ECG للتقييم القلبي المباشر", critical: true },
            { id: "ttm", label: "المحافظة المستمرة على إستراتيجية التحكم بالحرارة (Temperature Control / TTM 32-37.5°C) وتجنب الحمى وفق AHA 2025", critical: false }
          ],
          branches: []
        }
      },

      reversibleCauses: {
        hs: [
          { name: "Hypovolemia", label: "نقص حجم الدم", treatment: "إعطاء محاليل بلورية دافئة سريعة" },
          { name: "Hypoxia", label: "نقص الأكسجة", treatment: "تأمين المجرى الهوائي والتهوية بـ 100% O₂" },
          { name: "Hydrogen Ion (Acidosis)", label: "الحُماض", treatment: "تهوية جيدة؛ استخدام البيكربونات محصور بالحالات المحددة سريرياً فقط" },
          { name: "Hypo / Hyperkalemia", label: "اضطراب البوتاسيوم", treatment: "إعطاء كالسيوم في الفرط، أو بيكربونات/إنسولين" },
          { name: "Hypothermia", label: "انخفاض الحرارة", treatment: "التدفئة النشطة للدم والجسم" }
        ],
        ts: [
          { name: "Tension Pneumothorax", label: "استرواح الصدر التوتري", treatment: "تفريغ الصدر الفوري حسب البروتوكول المحلي (Immediate chest decompression according to local protocol)" },
          { name: "Tamponade (Cardiac)", label: "الاندحاس القلبي", treatment: "العلاج الجراحي/الداخل الإسعافي للاندحاس بحسب الإمكانية والسبب (Urgent treatment according to cause & local capability)" },
          { name: "Toxins", label: "التسمم الدوائي", treatment: "إعطاء المضادات المحددة (مثل Lipid Emulsion في LAST)" },
          { name: "Thrombosis (Pulmonary)", label: "الصمة الرئوية الخثرية", treatment: "إعطاء حليلات الخثرة (Thrombolytics)" },
          { name: "Thrombosis (Coronary)", label: "الجلطة القلبية الحادة", treatment: "التدخل الوعائي القسطاري العاجل (PCI)" }
        ]
      }
    },

    // -----------------------------------------------------------------------
    // B. MALIGNANT HYPERTHERMIA - MH (MHAUS / EMHG 2024)
    // -----------------------------------------------------------------------
    mh: {
      id: "mh",
      title: "بروتوكول الفرط الحراري الخبيث (Malignant Hyperthermia Crisis)",
      evidenceRef: "src_mhaus_2024",
      initialState: "RECOGNITION",
      states: {
        RECOGNITION: {
          id: "RECOGNITION",
          title: "التعرف المبكر على نوبة MH (Early Recognition)",
          terminal: false,
          actionItems: [
            { id: "recognize_etco2", label: "ملاحظة الارتفاع غير المبرر والمستمر في ETCO₂ وتسرع القلب والصلابة العضلية", critical: true }
          ],
          branches: [{ label: "بدء إجراءات الإنقاذ الفورية", targetState: "IMMEDIATE_ACTIONS" }]
        },

        IMMEDIATE_ACTIONS: {
          id: "IMMEDIATE_ACTIONS",
          title: "الخطوات الإسعافية الفورية (Immediate Actions)",
          terminal: false,
          actionItems: [
            { id: "stop_triggers", label: "إيقاف جميع الغازات الاستنشاقية والسكسينيل كولين فوراً (Stop Volatiles & Succinylcholine)", critical: true },
            { id: "call_mh_cart", label: "استدعاء المساعدة وإحضار عربة طوارئ MH وحقن الدانترولين", critical: true },
            { id: "hyperventilate", label: "التهوية بـ 100% O₂ بتدفق مرتفع (> 10 L/min) لغسل الغازات", critical: true },
            { id: "remove_vaporizers", label: "إزالة المباخر (Vaporizers) من الجهاز دون إضاعة الوقت بتغيير الدارة أو جهاز التخدير", critical: true },
            { id: "charcoal_filters", label: "تركيب فلاتر الفحم المنشط (Activated Charcoal Filters) على دارة التنفس إن توفرت", critical: false }
          ],
          branches: [{ label: "انتقل لحساب وإعطاء الدانترولين", targetState: "DANTROLENE_ADMINISTRATION" }]
        },

        DANTROLENE_ADMINISTRATION: {
          id: "DANTROLENE_ADMINISTRATION",
          title: "إعطاء عقار الدانترولين (Dantrolene Sodium)",
          terminal: false,
          drugRef: "dantrolene_mh",
          actionItems: [
            { id: "give_dantrolene_initial", label: "إعطاء الجرعة التأسيسية 2.5 mg/kg IV دفعاً سريعاً واختيار تركيب Dantrium أو Ryanodex", critical: true },
            { id: "repeat_dantrolene", label: "تكرار 2.5 mg/kg كل 3-5 دقائق حسب الاستجابة السريرية حتى تراجع الاعراض", critical: true }
          ],
          branches: [{ label: "انتقل للرعاية الداعمة والمتابعة", targetState: "SUPPORTIVE_CARE" }]
        },

        SUPPORTIVE_CARE: {
          id: "SUPPORTIVE_CARE",
          title: "الرعاية الداعمة وتدبير المضاعفات (Supportive Care)",
          terminal: true,
          actionItems: [
            { id: "cooling", label: "التبريد النشط: ابدأ التبريد إذا كانت الحرارة المركزية > 39.0°C (أو ترتفع بسرعة)، وأوقفه فور الوصول لـ < 38.0°C لمنع هبوط الحرارة الشديد", critical: true },
            { id: "hyperkalemia_tx", label: "علاج فرط البوتاسيوم: إعطاء بيكربونات/إنسولين وجلوكوز والكالسيوم حسب الاستطباب السريري", critical: true },
            { id: "arrhythmia_tx", label: "علاج اضطراب الإيقاع: تجنب سدادات قنوات الكالسيوم (CCBs) لمنع انخفاض الضغط القاتل وتوقف القلب", critical: true },
            { id: "monitoring", label: "المراقبة المستمرة: متابعة ETCO₂، غازات الدم، البوتاسيوم، الحرارة المركزية، ونتاج البول بهدف استرشادي 1-2 mL/kg/hr", critical: true },
            { id: "icu_transfer", label: "النقل للعناية المركزة: الاستمرار في المراقبة 24-48 ساعة لمتابعة احتمال الانتكاس المتأخر (Recrudescence)", critical: false }
          ],
          branches: []
        }
      }
    },

    // -----------------------------------------------------------------------
    // C. LOCAL ANESTHETIC SYSTEMIC TOXICITY - LAST (ASRA 2020)
    // -----------------------------------------------------------------------
    last: {
      id: "last",
      title: "بروتوكول سمية التخدير المناطقي (LAST Crisis & Lipid Rescue)",
      evidenceRef: "src_asra_2020",
      initialState: "RECOGNITION",
      states: {
        RECOGNITION: {
          id: "RECOGNITION",
          title: "التعرف على أعراض LAST (LAST Recognition)",
          terminal: false,
          actionItems: [
            { id: "recognize_cns_cv", label: "التعرف السريع على الأعراض العصبية (طنين، طعم معدني، اختلاج) والقلبية (تباطؤ، اضطراب إيقاع، هبوط ضغط)", critical: true }
          ],
          branches: [{ label: "بدء الإدارة الفورية الأولية", targetState: "IMMEDIATE_MANAGEMENT" }]
        },

        IMMEDIATE_MANAGEMENT: {
          id: "IMMEDIATE_MANAGEMENT",
          title: "الإدارة الفورية الأولية (Immediate Management)",
          terminal: false,
          actionItems: [
            { id: "stop_la", label: "إيقاف حقن المخدر الموضعي فوراً (Stop Local Anesthetic Injection)", critical: true },
            { id: "call_help_lipid", label: "استدعاء المساعدة وإحضار حزمة إنقاذ الدهون 20% Lipid Rescue Kit", critical: true },
            { id: "airway_o2", label: "تأمين المجرى الهوائي والتهوية بـ 100% O₂ لمنع الحُماض ونقص الأكسجة اللذين يفاقمان السمية", critical: true },
            { id: "seizure_control", label: "السيطرة على التشنجات: إعطاء البنزوديازيبينات (Benzodiazepines) كخيار مفضل. تجنب Propofol عند وجود عدم استقرار وعائي", critical: true }
          ],
          branches: [{ label: "انتقل لعلاج إنقاذ الدهون Lipid Emulsion", targetState: "LIPID_EMULSION_THERAPY" }]
        },

        LIPID_EMULSION_THERAPY: {
          id: "LIPID_EMULSION_THERAPY",
          title: "علاج إنقاذ الدهون 20% (20% Lipid Emulsion Rescue)",
          terminal: false,
          drugRef: "lipid_emulsion_20",
          actionItems: [
            { id: "give_lipid_bolus", label: "إعطاء دفعة أوليّة (Bolus 1.5 mL/kg IV) خلال دقيقة واحدة، ثم بدء التسريب (0.25 mL/kg/min)", critical: true },
            { id: "repeat_lipid_unstable", label: "عند استمرار عدم الاستقرار الوعائي: تكرار الدفعة وتضاعف سرعة التسريب إلى 0.5 mL/kg/min حتى الحد الأقصى 12 mL/kg", critical: true }
          ],
          branches: [{ label: "انتقل لتعليمات المراقبة والمتابعة", targetState: "POST_LAST_OBSERVATION" }]
        },

        POST_LAST_OBSERVATION: {
          id: "POST_LAST_OBSERVATION",
          title: "المراقبة والمتابعة المحددة حسب الحالة (ASRA Protocol)",
          terminal: true,
          actionItems: [
            { id: "obs_cns", label: "مراقبة مستمرة لأكثر من ساعتين (≥ 2 hours) للحالات المقتصرة على الأعراض العصبية", critical: true },
            { id: "obs_cv", label: "مراقبة مستمرة في العناية المركزة لـ 4 إلى 6 ساعات (4-6 hours) للأحداث القليلة الوعائية", critical: true },
            { id: "obs_arrest", label: "مراقبة طارئة مطولة مخصصة لكل حالة بعد توقف القلب وتثبيت الدوران", critical: true }
          ],
          branches: []
        }
      }
    },

    // -----------------------------------------------------------------------
    // D. PERIOPERATIVE ANAPHYLAXIS (RCUK 2021)
    // -----------------------------------------------------------------------
    anaphylaxis: {
      id: "anaphylaxis",
      title: "بروتوكول الصدمة التحسسية الحادة حول الجراحة (Perioperative Anaphylaxis)",
      evidenceRef: "src_rcuk_2021",
      initialState: "RECOGNITION",
      states: {
        RECOGNITION: {
          id: "RECOGNITION",
          title: "التعرف على أعراض التحسس الحاد تحت التخدير",
          terminal: false,
          actionItems: [
            { id: "recognize_anaphylaxis_signs", label: "ملاحظة الهبوط الحاد للضغط، التشنج القصبي، الوذمة الوعائية، أو الاحمرار الجلدي المفاجئ", critical: true }
          ],
          branches: [{ label: "بدء الإجارات الأساسية للإنقاذ", targetState: "IMMEDIATE_FIRST_LINE" }]
        },

        IMMEDIATE_FIRST_LINE: {
          id: "IMMEDIATE_FIRST_LINE",
          title: "علاج الخط الأول الحاسم للإنقاذ (First-Line Life Saving)",
          terminal: false,
          actionItems: [
            { id: "stop_trigger", label: "إيقاف المادة المشتبه بها فوراً (المرخيات العضلية، المضادات الحيوية، اللاتكس، بدائل البلازما)", critical: true },
            { id: "call_help", label: "استدعاء المساعدة فوراً وإيقاف التخدير الاستنشاقي إذا لزم الأمر", critical: true },
            { id: "o2_airway", label: "تأمين المجرى الهوائي والتهوية بـ 100% O₂", critical: true },
            { id: "epi_perioperative", label: "إعطاء الإبينفرين الوريدي المعاير (IV Titrated Adrenaline): 50 mcg IV للبالغين مع وجود دوران ووجود منفذ وريدي، وتكرارها كل 1-2 دقيقة", critical: true, drugRef: "epinephrine_anaphylaxis_iv" },
            { id: "fluid_resuscitation", label: "الإنعاش بالسوائل: إعطاء دفعة سريعة من البلورات (Crystalloid Bolus 500-1000 mL IV) وإعادة التقييم المباشر (قد تتطلب 3-5 L في الصدمة الشديدة)", critical: true }
          ],
          branches: [{ label: "انتقل للعلاجات الثانوية ومتابعة التريبتاز", targetState: "SECOND_LINE_AND_POST" }]
        },

        SECOND_LINE_AND_POST: {
          id: "SECOND_LINE_AND_POST",
          title: "العلاجات الثانوية ومتابعة التريبتاز (RCUK 2021)",
          terminal: true,
          actionItems: [
            { id: "tryptase_1", label: "أخذ العينة الأولى للتريبتاز المصلية (Acute Sample): فور إدارة الحادثة واستقرار المريض الأول", critical: true },
            { id: "tryptase_2", label: "أخذ العينة الثانية للتريبتاز المصلية (2nd Sample): بين 1 إلى 4 ساعات من بدء الأعراض", critical: true },
            { id: "tryptase_baseline", label: "أخذ عينة المستوى الأساسي (Baseline Sample): بعد 24 ساعة على الأقل", critical: false },
            { id: "allergy_referral", label: "توثيق الحادثة وتحويل المريض لعيادة أبحاث الحساسية وتحديد المحفز بدقة للتخدير المستقبلي", critical: true }
          ],
          branches: []
        }
      }
    },

    // -----------------------------------------------------------------------
    // E. UNANTICIPATED DIFFICULT AIRWAY (DAS 2025)
    // -----------------------------------------------------------------------
    airway: {
      id: "airway",
      title: "بروتوكول إدارة المجرى الهوائي الصعب غير المتوقع (DAS 2025)",
      evidenceRef: "src_das_2025",
      initialState: "PLAN_A",
      states: {
        PLAN_A: {
          id: "PLAN_A",
          title: "PLAN A: التنبيب الرغامي (Tracheal Intubation)",
          terminal: false,
          actionItems: [
            { id: "plan_a_first_pass", label: "تعظيم احتمال نجاح المحاولة الأولى (First-Pass Success) مع الاستفادة من Videolaryngoscopy وفق الخطة والمعدات والخبرة المتاحة", critical: true },
            { id: "plan_a_limit", label: "تقييد عدد محاولات التنبيب وتأمين الاستقرار المستمر للأكسجة", critical: true }
          ],
          branches: [
            { label: "نجاح التنبيب وتأكيد التهوية", targetState: "SUCCESS_CONFIRMED" },
            { label: "فشل التنبيب (Plan A Failed) -> انتقل لـ Plan B", targetState: "PLAN_B" }
          ]
        },

        PLAN_B: {
          id: "PLAN_B",
          title: "PLAN B: إدخال القناع الحنجري فوق المزمار (SGA Rescue)",
          terminal: false,
          actionItems: [
            { id: "plan_b_sga", label: "إدخال قناع حنجري من الجيل الثاني (2nd Gen SGA) كإنقاذ منهجي لتأمين التهوية والأكسجة", critical: true }
          ],
          branches: [
            { label: "نجاح التهوية عبر SGA", targetState: "SGA_SUCCESS" },
            { label: "فشل SGA (Plan B Failed) -> انتقل لـ Plan C", targetState: "PLAN_C" }
          ]
        },

        PLAN_C: {
          id: "PLAN_C",
          title: "PLAN C: التهوية بالقناع الوجهي الموحد (Final Face-Mask Rescue)",
          terminal: false,
          actionItems: [
            { id: "plan_c_mask", label: "استخدام تقنية الشخصين (Two-Person Mask) + OPA/NPA + التأكد من إعطاء شلل عضلي كامل (Full Neuromuscular Blockade)", critical: true }
          ],
          branches: [
            { label: "نجاح التهوية بالقناع", targetState: "FACEMASK_SUCCESS" },
            { label: "تعذر التهوية والأكسجة (CICO Event) -> انتقل فوراً لـ Plan D", targetState: "PLAN_D_EFONA" }
          ]
        },

        PLAN_D_EFONA: {
          id: "PLAN_D_EFONA",
          title: "PLAN D: الفتح الجراحي الطارئ للرقبة (eFONA)",
          terminal: true,
          isEmergencyCico: true,
          actionItems: [
            { id: "declare_cico", label: "1. إعلان حالة CICO بصوت عالٍ في غرفة العمليات وتنبيه الجميع", critical: true },
            { id: "efona_incision", label: "2. الشق الجراحي الطولي العمودي بالمنتصف (Standardised Vertical Midline Incision)", critical: true },
            { id: "efona_identify", label: "3. تحديد غشاء الغضروف الحلقي والدرقي (Cricothyroid Membrane)", critical: true },
            { id: "efona_bougie_tube", label: "4. الشق العرضي + إدخال الموجه (Bougie) ثم إدخال أنبوب رغامي Cuffed ETT قياس 6.0 mm", critical: true },
            { id: "efona_confirm", label: "5. تأكيد التهوية بـ Capnography وتأمين الأكسجة", critical: true }
          ],
          branches: []
        },

        SUCCESS_CONFIRMED: { id: "SUCCESS_CONFIRMED", title: "تم تأكيد المجرى الهوائي والتهوية بنجاح", terminal: true, actionItems: [], branches: [] },
        SGA_SUCCESS: { id: "SGA_SUCCESS", title: "تمت التهوية عبر القناع الحنجري بنجاح - تقييم خطة العملية", terminal: true, actionItems: [], branches: [] },
        FACEMASK_SUCCESS: { id: "FACEMASK_SUCCESS", title: "تمت التهوية بالقناع الوجهي بنجاح - التحضير للإفاقة وتأمين المريض", terminal: true, actionItems: [], branches: [] }
      }
    },

    // -----------------------------------------------------------------------
    // F. LARYNGOSPASM MANAGEMENT
    // -----------------------------------------------------------------------
    laryngospasm: {
      id: "laryngospasm",
      title: "بروتوكول تدبير تشنج الحنجرة (Laryngospasm Protocol)",
      evidenceRef: "src_das_2025",
      initialState: "ALGORITHM",
      states: {
        ALGORITHM: {
          id: "ALGORITHM",
          title: "خوارزمية التدخل السريع والتصعيد للتشنج الحنجري",
          terminal: true,
          actionItems: [
            { id: "remove_stimulus", label: "1. إزالة المحفز الجراحي أو الإفرازات من الحلق فوراً (Remove Stimulus / Suction Pharynx)", critical: true },
            { id: "jaw_thrust_larson", label: "2. فتح المجرى الهوائي وتطبيق مناورة لارسن (Jaw Thrust & Larson's Point Pressure)", critical: true },
            { id: "cpap_o2", label: "3. إعطاء 100% O₂ مع تطبيق ضغط إيجابي مستمر (CPAP 10-20 cmH₂O)", critical: true },
            { id: "deepen_anesthesia", label: "4. تعميق التخدير بالدواء المنوم الوريدي المعاير (Titrated IV Induction Agent / Propofol) حسب السياق والوزن", critical: false },
            { id: "succinylcholine_rescue", label: "5. عند استمرار التشنج ونقص الأكسجة: إعطاء Succinylcholine (1.0 mg/kg IV أو 4.0 mg/kg IM) + Atropine للأطفال", critical: true, drugRef: "succinylcholine_laryngospasm" }
          ],
          branches: []
        }
      }
    }
  }
};
