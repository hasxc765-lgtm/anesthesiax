/**
 * Continuous Infusion Drugs Database
 * Phase 6.2 — Fully Audited with mcg/min & Extended Unit Support
 * 
 * Clinical References & Guidelines:
 * - US FDA Official Prescribing Information & Drug Labeling
 * - ISMP (Institute for Safe Medication Practices) High-Alert Standards
 * - Surviving Sepsis Campaign International Guidelines
 * - AHA/ACLS Advanced Cardiovascular Life Support Standards
 * - ADA Standards of Medical Care in Diabetes
 * - Morgan & Mikhail's Clinical Anesthesiology
 * - Miller's Anesthesia
 */

export const infusionDrugsData = [
  {
    id: 'noradrenaline',
    name: 'Noradrenaline (Norepinephrine)',
    arabicName: 'نورأدرينالين (نورإبينفرين)',
    category: 'Vasopressor',
    isHighAlert: true,
    defaultDoseUnitKey: 'mcg_kg_min',
    supportedDoseUnitKeys: ['mcg_kg_min', 'mcg_min', 'mcg_kg_hr', 'mcg_hr'],
    defaultConcentrationUnitKey: 'mcg/mL',
    standardConcentrations: [
      { label: '4 mg / 50 mL (80 mcg/mL)', value: 80, unitKey: 'mcg/mL' },
      { label: '8 mg / 50 mL (160 mcg/mL)', value: 160, unitKey: 'mcg/mL' },
      { label: '16 mg / 50 mL (320 mcg/mL)', value: 320, unitKey: 'mcg/mL' }
    ],
    indications: [
      {
        id: 'septic_vasodilatory_shock',
        title: 'الصدمة الإنتانية والوعائية (Septic / Vasodilatory Shock)',
        doseMin: 0.01,
        doseMax: 0.5,
        doseUnitKey: 'mcg_kg_min',
        unitLabel: 'mcg/kg/min',
        notes: 'الخط الأول الموصى به لرفع ضغط الدم الشرياني الوسطي (MAP ≥ 65 mmHg). قد تقتضي الحالات الشديدة جرعات أعلى من 0.5 mcg/kg/min تحت المراقبة الشريانية المباشرة.'
      },
      {
        id: 'fixed_rate_titration',
        title: 'الضبط بجرعة زمنية بدون وزن (Fixed Minute Rate)',
        doseMin: 1,
        doseMax: 20,
        doseUnitKey: 'mcg_min',
        unitLabel: 'mcg/min',
        notes: 'تُعادل (1 - 20 mcg/min). تُستخدم في بروتوكولات العناية المركزة والتخدير التي تعتمد الضبط المباشر بالدقيقة بدون وزن.'
      }
    ],
    clinicalSafetyNotes: 'دواء عالي الخطورة (HIGH-ALERT). يُوصى بالإعطاء عبر قسطرة وريدية مركزية (Central Line). وفقاً لتوصيات Surviving Sepsis Campaign الحديثة، يُسمح بالبدء المؤقت عبر خط وريدي محيطي (Peripheral Line) في أوردة كبيرة فوق المرفق لفترة قصيرة حتى الحصول على خط مركزي، لتجنب تأخير رفع ضغط الدم.',
    reference: 'US FDA Labeling: Levophed (Norepinephrine Bitartrate) Injection & Surviving Sepsis Campaign Guidelines'
  },
  {
    id: 'propofol',
    name: 'Propofol (Diprivan)',
    arabicName: 'بروبوفول',
    category: 'Sedative / Anesthetic',
    isHighAlert: true,
    defaultDoseUnitKey: 'mg_kg_hr',
    supportedDoseUnitKeys: ['mg_kg_hr', 'mcg_kg_min'],
    defaultConcentrationUnitKey: 'mg/mL',
    standardConcentrations: [
      { label: '1% (10 mg/mL - Standard)', value: 10, unitKey: 'mg/mL' },
      { label: '2% (20 mg/mL - High Concentration)', value: 20, unitKey: 'mg/mL' }
    ],
    indications: [
      {
        id: 'icu_sedation',
        title: 'التهدئة في العناية المركزة للمرضى على التنفس الاصطناعي (ICU Sedation)',
        doseMin: 0.3,
        doseMax: 3.0,
        doseUnitKey: 'mg_kg_hr',
        unitLabel: 'mg/kg/hr',
        notes: 'تُعادل (5 - 50 mcg/kg/min). تُبدأ الجرعة بـ 0.3 mg/kg/hr وتُدرج كل 5-10 دقائق. الحد الأقصى المعتمد بالنشرة الرسمية لتهدئة العناية هو 3.0 mg/kg/hr (أي 50 mcg/kg/min).'
      },
      {
        id: 'tiva_maintenance',
        title: 'المحافظة على التخدير العام الكلي (TIVA Maintenance)',
        doseMin: 4.0,
        doseMax: 12.0,
        doseUnitKey: 'mg_kg_hr',
        unitLabel: 'mg/kg/hr',
        notes: 'تُعادل (67 - 200 mcg/kg/min). تُخفض الجرعة في كبار السن وفي حالات هبوط القلب أو الصدمة الوعائية.'
      },
      {
        id: 'mac_sedation',
        title: 'التهدئة الإجرائية للعمليات الصغرى (MAC / Procedural Sedation)',
        doseMin: 1.5,
        doseMax: 4.5,
        doseUnitKey: 'mg_kg_hr',
        unitLabel: 'mg/kg/hr',
        notes: 'تُعادل (25 - 75 mcg/kg/min) للوصول إلى التهدئة المتوسطة مع الحفاظ على التنفس التلقائي والاستجابة الكلامية.'
      }
    ],
    clinicalSafetyNotes: 'دواء عالي الخطورة. يسبب انخفاضاً حاداً بضغط الدم وتثبيطاً تنفسياً. تجنب التسريب المستمر بجرعات تتجاوز 50 mcg/kg/min (أي 3.0 mg/kg/hr) لأكثر من 48 ساعة لتفادي متلازمة تسريب البروبوفول المميتة (PRIS).',
    reference: 'US FDA Labeling: Diprivan (Propofol) Injectable Emulsion'
  },
  {
    id: 'remifentanil',
    name: 'Remifentanil (Ultiva)',
    arabicName: 'ريميفنتانيل',
    category: 'Opioid Analgesic',
    isHighAlert: true,
    defaultDoseUnitKey: 'mcg_kg_min',
    supportedDoseUnitKeys: ['mcg_kg_min', 'mcg_min', 'mcg_kg_hr'],
    defaultConcentrationUnitKey: 'mcg/mL',
    standardConcentrations: [
      { label: '1 mg / 50 mL (20 mcg/mL)', value: 20, unitKey: 'mcg/mL' },
      { label: '2.5 mg / 50 mL (50 mcg/mL)', value: 50, unitKey: 'mcg/mL' },
      { label: '5 mg / 50 mL (100 mcg/mL)', value: 100, unitKey: 'mcg/mL' }
    ],
    indications: [
      {
        id: 'general_anesthesia_maintenance',
        title: 'تسكين التخدير العام (General Anesthesia Maintenance)',
        doseMin: 0.05,
        doseMax: 0.5,
        doseUnitKey: 'mcg_kg_min',
        unitLabel: 'mcg/kg/min',
        notes: 'يُعطى بالتزامن مع المحفزات الاستنشاقية أو البروبوفول. قد ترتفع الجرعة إلى 1.0 mcg/kg/min أثناء الاستجابة الشديدة للتحفيز الجراحي.'
      },
      {
        id: 'mac_spontaneous_breathing',
        title: 'التهدئة والتسكين مع التنفس التلقائي (MAC / Monitored Care)',
        doseMin: 0.025,
        doseMax: 0.1,
        doseUnitKey: 'mcg_kg_min',
        unitLabel: 'mcg/kg/min',
        notes: 'تتطلب مراقبة دقيقة لمعدل التنفس ونسبة أكسجين الدم لتفادي التوقف التنفسي المفاجئ.'
      }
    ],
    clinicalSafetyNotes: 'دواء عالي الخطورة. مسكن أفيوني فائق السرعة وينتهي تأثيره خلال دقائق من توقف التسريب. يسبب تباطؤ القلب (Bradycardia)، وتثبيطاً تنفسياً شديداً، وجساءة القفص الصدري (Chest Wall Rigidity) عند الإعطاء السريع.',
    reference: 'US FDA Labeling: Ultiva (Remifentanil Hydrochloride) for Injection'
  },
  {
    id: 'adrenaline',
    name: 'Adrenaline (Epinephrine)',
    arabicName: 'أدرينالين (إبينفرين)',
    category: 'Inotrope / Vasopressor',
    isHighAlert: true,
    defaultDoseUnitKey: 'mcg_kg_min',
    supportedDoseUnitKeys: ['mcg_kg_min', 'mcg_min', 'mcg_hr'],
    defaultConcentrationUnitKey: 'mcg/mL',
    standardConcentrations: [
      { label: '1 mg / 50 mL (20 mcg/mL)', value: 20, unitKey: 'mcg/mL' },
      { label: '4 mg / 50 mL (80 mcg/mL)', value: 80, unitKey: 'mcg/mL' }
    ],
    indications: [
      {
        id: 'inotropic_support',
        title: 'تحفيز قلوصية القلب وزيادة نتاج الضربات (Inotropic Support)',
        doseMin: 0.01,
        doseMax: 0.05,
        doseUnitKey: 'mcg_kg_min',
        unitLabel: 'mcg/kg/min',
        notes: 'تغلب التأثيرات المحفزة لمستقبلات Beta-1 القلوية بجرعات منخفضة لزيادة معدل ونتاج القلب.'
      },
      {
        id: 'vasopressor_refractory_shock',
        title: 'دعم المقاومة الوعائية وصدمة الحساسية (Vasopressor / Anaphylactic Shock)',
        doseMin: 0.05,
        doseMax: 0.5,
        doseUnitKey: 'mcg_kg_min',
        unitLabel: 'mcg/kg/min',
        notes: 'تُستخدم الجرعات المرتفعة للتسريب المستمر في الصدمة الوعائية الشديدة وصدمة الحساسية. تنبيه: هذه الجرعات خاصة بالتسريب المستمر ولا تتداخل مع جرعات الدفعات الإنعاشية (ACLS Boluses: 1 mg IV).'
      }
    ],
    clinicalSafetyNotes: 'دواء عالي الخطورة. يتسبب في تسارع القلب (Tachycardia)، واضطرابات النبض البطينية، وزيادة استهلاك الأكسجين القلبي، وارتفاع سكر الدم وزيادة اللاكتات بالدم.',
    reference: 'US FDA Labeling: Epinephrine Injection & AHA ACLS Guidelines'
  },
  {
    id: 'dopamine',
    name: 'Dopamine',
    arabicName: 'دوبامين',
    category: 'Inotrope / Vasopressor',
    isHighAlert: true,
    defaultDoseUnitKey: 'mcg_kg_min',
    supportedDoseUnitKeys: ['mcg_kg_min', 'mcg_min'],
    defaultConcentrationUnitKey: 'mg/mL',
    standardConcentrations: [
      { label: '200 mg / 50 mL (4.0 mg/mL)', value: 4.0, unitKey: 'mg/mL' },
      { label: '400 mg / 50 mL (8.0 mg/mL)', value: 8.0, unitKey: 'mg/mL' }
    ],
    indications: [
      {
        id: 'inotropic_range',
        title: 'دعم قلوصية عضلة القلب (Inotropic Range)',
        doseMin: 2.0,
        doseMax: 10.0,
        doseUnitKey: 'mcg_kg_min',
        unitLabel: 'mcg/kg/min',
        notes: 'يحفز القلوصية القلبية عبر مستقبلات Beta-1. تنبيه: تم نفي المفهوم القديم لمسمى (Renal Dose Dopamine) ولا يُعتمد كعلاج لحماية الكلى.'
      },
      {
        id: 'vasopressor_range',
        title: 'دعم المقاومة الوعائية والضغط (Vasopressor Range)',
        doseMin: 10.0,
        doseMax: 20.0,
        doseUnitKey: 'mcg_kg_min',
        unitLabel: 'mcg/kg/min',
        notes: 'يتغلب التأثير القابض للأوعية الدموية عبر مستقبلات Alpha-1 عند رفع الجرعة فوق 10 mcg/kg/min.'
      }
    ],
    clinicalSafetyNotes: 'دواء عالي الخطورة. يرفع خطر حدوث اضطرابات النبض الأذينية والبطينية بشكل ملحوظ. لم يعد يُوصى باستخدامه كخيار أول في الصدمة الإنتانية وفق توصيات Surviving Sepsis Campaign الدولية.',
    reference: 'US FDA Labeling: Dopamine Hydrochloride Injection & Surviving Sepsis Campaign'
  },
  {
    id: 'dobutamine',
    name: 'Dobutamine',
    arabicName: 'دوبيوتامين',
    category: 'Inotrope / Vasodilator',
    isHighAlert: true,
    defaultDoseUnitKey: 'mcg_kg_min',
    supportedDoseUnitKeys: ['mcg_kg_min', 'mcg_min'],
    defaultConcentrationUnitKey: 'mg/mL',
    standardConcentrations: [
      { label: '250 mg / 50 mL (5.0 mg/mL)', value: 5.0, unitKey: 'mg/mL' },
      { label: '500 mg / 50 mL (10.0 mg/mL)', value: 10.0, unitKey: 'mg/mL' }
    ],
    indications: [
      {
        id: 'cardiogenic_shock_low_co',
        title: 'الصدمة القلبية وهبوط نتاج القلب (Cardiogenic Shock / Low CO)',
        doseMin: 2.5,
        doseMax: 20.0,
        doseUnitKey: 'mcg_kg_min',
        unitLabel: 'mcg/kg/min',
        notes: 'الجرعة النموذجية المعتمدة لزيادة نتاج القلوصية القلبية. قد ترتفع في حالات الاستجابة المحدودة حتى 40 mcg/kg/min تحت المراقبة الدقيقة.'
      }
    ],
    clinicalSafetyNotes: 'دواء عالي الخطورة. يحفز مستقبلات Beta-1 القلوية مع توسع وعائي محيطي موازٍ ناتج عن تحفيز Beta-2، مما يتسبب في هبوط حاد بضغط الدم في المرضى الذين يعانون من نقص حجم الدم (Hypovolemia).',
    reference: 'US FDA Labeling: Dobutamine Injection'
  },
  {
    id: 'dexmedetomidine',
    name: 'Dexmedetomidine (Precedex)',
    arabicName: 'ديكسميديتوميدين (بريسيديكس)',
    category: 'Sedative / Alpha-2 Agonist',
    isHighAlert: true,
    defaultDoseUnitKey: 'mcg_kg_hr',
    supportedDoseUnitKeys: ['mcg_kg_hr', 'mcg_kg_min'],
    defaultConcentrationUnitKey: 'mcg/mL',
    standardConcentrations: [
      { label: '200 mcg / 50 mL (4 mcg/mL)', value: 4, unitKey: 'mcg/mL' },
      { label: '400 mcg / 50 mL (8 mcg/mL)', value: 8, unitKey: 'mcg/mL' }
    ],
    indications: [
      {
        id: 'icu_sedation_maintenance',
        title: 'التهدئة في العناية المركزة (ICU Sedation Maintenance)',
        doseMin: 0.2,
        doseMax: 0.7,
        doseUnitKey: 'mcg_kg_hr',
        unitLabel: 'mcg/kg/hr',
        notes: 'نطاق الجرعة المعتمد رسمياً في نشرة FDA لتهدئة العناية هو (0.2 - 0.7 mcg/kg/hr). الجرعات التي تصل إلى 1.4 mcg/kg/hr تُعد استخداماً خارج النشرة الرسمية (Off-label).'
      },
      {
        id: 'procedural_sedation_maintenance',
        title: 'التهدئة الإجرائية للعمليات (Procedural Sedation Maintenance)',
        doseMin: 0.2,
        doseMax: 1.0,
        doseUnitKey: 'mcg_kg_hr',
        unitLabel: 'mcg/kg/hr',
        notes: 'تُعدل الجرعة للوصول إلى مستوى التهدئة المطلوبة مع سهولة إيقاظ المريض.'
      }
    ],
    clinicalSafetyNotes: 'دواء عالي الخطورة. مهدئ مميز لا يسبب تثبيطاً تنفسياً ملموساً. إذا استُخدمت جرعة التحميل (Loading Dose: 0.5 - 1.0 mcg/kg over 10 min)، فقد تسبب هبوطاً حاداً بضغط الدم وتباطؤاً شديداً بالنبض (Bradycardia).',
    reference: 'US FDA Labeling: Precedex (Dexmedetomidine Hydrochloride) Injection'
  },
  {
    id: 'vasopressin',
    name: 'Vasopressin (Pitressin / Vasostrict)',
    arabicName: 'فازوبريسين',
    category: 'Vasopressor / Antidiuretic',
    isHighAlert: true,
    defaultDoseUnitKey: 'units_hr',
    supportedDoseUnitKeys: ['units_hr', 'units_min'],
    defaultConcentrationUnitKey: 'units/mL',
    standardConcentrations: [
      { label: '20 units / 50 mL (0.4 units/mL)', value: 0.4, unitKey: 'units/mL' },
      { label: '40 units / 50 mL (0.8 units/mL)', value: 0.8, unitKey: 'units/mL' }
    ],
    indications: [
      {
        id: 'septic_shock_fixed_infusion',
        title: 'الصدمة الإنتانية العصية (Refractory Septic Shock)',
        doseMin: 0.6,
        doseMax: 2.4,
        doseUnitKey: 'units_hr',
        unitLabel: 'units/hr',
        notes: 'تُعطى كجرعة تسريب ثابتة غير قابلة للتدريج المفتوح (Fixed Non-titrated Infusion) بمعدل 0.03 units/min (أي 1.8 units/hr) كدواء مكمل للنورأدرينالين. زيادة الجرعة إلى 0.04 units/min يُحظر إلا في حالات عدم الاستجابة الشديدة بسبب خطر الإفقار المعوي والتاجي.'
      },
      {
        id: 'post_cardiotomy_shock',
        title: 'الصدمة الوعائية بعد جراحة القلب (Post-Cardiotomy Vasodilatory Shock)',
        doseMin: 0.6,
        doseMax: 6.0,
        doseUnitKey: 'units_hr',
        unitLabel: 'units/hr',
        notes: 'تُعادل (0.01 - 0.1 units/min) وتُدرج حسب استجابة ضغط الدم الشرياني.'
      }
    ],
    clinicalSafetyNotes: 'دواء عالي الخطورة. ينبه مستقبلات V1 المباشرة بشكل مستقل عن المستقبلات الأدرينالجية. يُستخدم عادة كعقار مكمل لتقليل جرعات النورأدرينالين. قد يسبب انقباضاً شديداً للأوعية التاجية والمعوية عند الجرعات العالية.',
    reference: 'US FDA Labeling: Vasostrict (Vasopressin Injection) & Surviving Sepsis Campaign Guidelines'
  },
  {
    id: 'insulin',
    name: 'Regular Insulin (Actrapid / Humulin R)',
    arabicName: 'إنسولين منتظم (أكتريبيد)',
    category: 'Hormone / Glycemic Control',
    isHighAlert: true,
    defaultDoseUnitKey: 'units_hr',
    supportedDoseUnitKeys: ['units_hr', 'units_kg_hr'],
    defaultConcentrationUnitKey: 'units/mL',
    standardConcentrations: [
      { label: '50 units / 50 mL (1.0 unit/mL)', value: 1.0, unitKey: 'units/mL' },
      { label: '100 units / 100 mL (1.0 unit/mL)', value: 1.0, unitKey: 'units/mL' }
    ],
    indications: [
      {
        id: 'glycemic_control_icu',
        title: 'ضبط السكر في العناية والعمليات (Glycemic Control Protocol)',
        doseMin: 0.5,
        doseMax: 10.0,
        doseUnitKey: 'units_hr',
        unitLabel: 'units/hr',
        notes: 'تعتمد الجرعة بشكل مطلق على البروتوكول المحلي للمستشفى والمتابعة الساعية لقراءات سكر الدم الشرياني/الوريدي.'
      },
      {
        id: 'dka_protocol',
        title: 'بروتوكول الحماض الكيتوني السكري (DKA Protocol)',
        doseMin: 0.05,
        doseMax: 0.1,
        doseUnitKey: 'units_kg_hr',
        unitLabel: 'units/kg/hr',
        notes: 'تُعطى عادة بجرعة 0.1 units/kg/hr (أو 0.05 units/kg/hr إذا سُبقت بجرعة تحميل). تحذير: هذه الحاسبة لا تستبدل بروتوكول متابعة الجلوكوز والبوتاسيوم المعتمد رسمياً في المنشأة.'
      }
    ],
    clinicalSafetyNotes: 'دواء عالي الخطورة جداً (TOP HIGH-ALERT). يتطلب تدقيقاً واستلاماً مزدوجاً مستقلاً (Independent Double-Check). يرفع خطر هبوط السكر الحاد المميت (Severe Hypoglycemia) وهبوط البوتاسيوم بالدم (Hypokalemia).',
    reference: 'US FDA Labeling: Humulin R / Actrapid, ISMP Guidelines & ADA Standards of Care'
  },
  {
    id: 'nitroglycerin',
    name: 'Nitroglycerin (NTG / Glyceryl Trinitrate)',
    arabicName: 'نيتروجليسرين',
    category: 'Vasodilating Agent',
    isHighAlert: true,
    defaultDoseUnitKey: 'mcg_hr',
    supportedDoseUnitKeys: ['mcg_hr', 'mcg_min', 'mcg_kg_min', 'mg_hr'],
    defaultConcentrationUnitKey: 'mg/mL',
    standardConcentrations: [
      { label: '25 mg / 50 mL (0.5 mg/mL)', value: 0.5, unitKey: 'mg/mL' },
      { label: '50 mg / 50 mL (1.0 mg/mL)', value: 1.0, unitKey: 'mg/mL' }
    ],
    indications: [
      {
        id: 'perioperative_hypertension_ischemia',
        title: 'ارتفاع الضغط ونقص التروية القلبية (Perioperative Hypertension / Ischemia)',
        doseMin: 300,
        doseMax: 12000,
        doseUnitKey: 'mcg_hr',
        unitLabel: 'mcg/hr',
        notes: 'تُعطى بجرعة زمنية ثابتة تُعادل (5 - 200 mcg/min). الضبط يعتمد على معدل `mcg/hr` المباشر (300 - 12,000 mcg/hr)؛ حيث إن الجرعات القائمة على الوزن غير معيارية في البالغين.'
      }
    ],
    clinicalSafetyNotes: 'دواء عالي الخطورة. يتطلب أنابيب وسرنجات تسريب خاصة غير ممتصة للمادة (Non-PVC Tubing). يوسع الأوردة بجرعات منخفضة والشرايين بجرعات عالية. يسبب صداعاً وهبوطاً بالضغط وممنوع تماماً مع أدوية PDE-5 (مثل Sildenafil).',
    reference: 'US FDA Labeling: Nitroglycerin Injection'
  }
];
