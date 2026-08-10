/**
 * Continuous Infusion Drugs Database
 * Phase 6.2 — Fully Audited with mcg/min Support
 * 
 * Clinical References & Guidelines:
 * - US FDA Official Prescribing Information & Drug Labeling
 * - ISMP High-Alert Standards
 * - Surviving Sepsis Campaign International Guidelines
 * - AHA/ACLS Standards
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
        notes: 'الخط الأول الموصى به لرفع ضغط الدم الشرياني الوسطي (MAP ≥ 65 mmHg). الجرعات فوق 0.5 mcg/kg/min تتطلب مراقبة شريانية مباشرة.'
      },
      {
        id: 'fixed_rate_titration',
        title: 'الضبط بجرعة الدقيقة بدون وزن (Fixed Minute Rate)',
        doseMin: 1,
        doseMax: 20,
        doseUnitKey: 'mcg_min',
        unitLabel: 'mcg/min',
        notes: 'تُستخدم في بروتوكولات الضبط السريع المباشر (1 - 20 mcg/min) دون الاعتماد على وزن المريض.'
      }
    ],
    clinicalSafetyNotes: 'دواء عالي الخطورة (HIGH-ALERT). يُوصى بالإعطاء عبر قسطرة وريدية مركزية (Central Line). يُسمح بالبدء المؤقت عبر خط وريدي محيطي كبير لتفادي تأخير العلاج.',
    reference: 'US FDA Labeling & Surviving Sepsis Campaign Guidelines'
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
        title: 'التهدئة في العناية المركزة (ICU Sedation)',
        doseMin: 0.3,
        doseMax: 3.0,
        doseUnitKey: 'mg_kg_hr',
        unitLabel: 'mg/kg/hr',
        notes: 'تُعادل (5 - 50 mcg/kg/min). الحد الأقصى المعتمد لتهدئة العناية هو 3.0 mg/kg/hr لتفادي متلازمة PRIS.'
      },
      {
        id: 'tiva_maintenance',
        title: 'المحافظة على التخدير العام الكلي (TIVA Maintenance)',
        doseMin: 4.0,
        doseMax: 12.0,
        doseUnitKey: 'mg_kg_hr',
        unitLabel: 'mg/kg/hr',
        notes: 'تُعادل (67 - 200 mcg/kg/min). تُخفض الجرعة في كبار السن وحالات هبوط القلب.'
      }
    ],
    clinicalSafetyNotes: 'دواء عالي الخطورة. ترفع الجرعات فوق 3.0 mg/kg/hr لأكثر من 48 ساعة خطر متلازمة تسريب البروبوفول المميتة (PRIS).',
    reference: 'US FDA Labeling: Diprivan Injectable Emulsion'
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
        notes: 'يُعطى بالتزامن مع المحفزات الاستنشاقية أو البروبوفول.'
      }
    ],
    clinicalSafetyNotes: 'دواء عالي الخطورة. مسكن أفيوني فائق السرعة وينتهي تأثيره خلال دقائق من توقف التسريب.',
    reference: 'US FDA Labeling: Ultiva'
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
        title: 'تحفيز قلوصية القلب (Inotropic Support)',
        doseMin: 0.01,
        doseMax: 0.05,
        doseUnitKey: 'mcg_kg_min',
        unitLabel: 'mcg/kg/min',
        notes: 'تغلب التأثيرات المحفزة لمستقبلات Beta-1 بجرعات منخفضة لزيادة نتاج القلب.'
      },
      {
        id: 'vasopressor_refractory_shock',
        title: 'دعم المقاومة الوعائية والصدمة (Vasopressor Range)',
        doseMin: 0.05,
        doseMax: 0.5,
        doseUnitKey: 'mcg_kg_min',
        unitLabel: 'mcg/kg/min',
        notes: 'تُستخدم الجرعات المرتفعة للتسريب المستمر في الصدمة الوعائية وصدمة الحساسية.'
      }
    ],
    clinicalSafetyNotes: 'دواء عالي الخطورة. يتسبب في تسارع القلب واضطرابات النبض البطينية وارتفاع اللاكتات بالدم.',
    reference: 'US FDA Labeling & AHA ACLS Guidelines'
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
        notes: 'يحفز القلوصية القلبية عبر مستقبلات Beta-1.'
      }
    ],
    clinicalSafetyNotes: 'دواء عالي الخطورة. يرفع خطر حدوث اضطرابات النبض الأذينية والبطينية.',
    reference: 'US FDA Labeling: Dopamine Injection'
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
        notes: 'الجرعة النموذجية المعتمدة لزيادة نتاج القلوصية القلبية.'
      }
    ],
    clinicalSafetyNotes: 'دواء عالي الخطورة. يحفز مستقبلات Beta-1 القلوية مع توسع وعائي محيطي موازٍ.',
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
        notes: 'نطاق الجرعة المعتمد رسمياً لتهدئة العناية (0.2 - 0.7 mcg/kg/hr).'
      }
    ],
    clinicalSafetyNotes: 'دواء عالي الخطورة. مهدئ لا يسبب تثبيطاً تنفسياً ملموساً.',
    reference: 'US FDA Labeling: Precedex Injection'
  },
  {
    id: 'vasopressin',
    name: 'Vasopressin (Vasostrict)',
    arabicName: 'فازوبريسين',
    category: 'Vasopressor',
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
        notes: 'تُعادل (0.01 - 0.04 units/min). الجرعة المعتادة للجرعة المكملة هي 0.03 units/min (1.8 units/hr).'
      }
    ],
    clinicalSafetyNotes: 'دواء عالي الخطورة. يُستخدم كعقار مكمل لتقليل جرعات النورأدرينالين.',
    reference: 'US FDA Labeling & Surviving Sepsis Campaign'
  },
  {
    id: 'insulin',
    name: 'Regular Insulin (Actrapid)',
    arabicName: 'إنسولين منتظم (أكتريبيد)',
    category: 'Hormone',
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
        title: 'ضبط السكر في العناية والعمليات (Glycemic Control)',
        doseMin: 0.5,
        doseMax: 10.0,
        doseUnitKey: 'units_hr',
        unitLabel: 'units/hr',
        notes: 'تعتمد الجرعة بشكل مطلق على البروتوكول المحلي للمستشفى وقراءات سكر الدم.'
      }
    ],
    clinicalSafetyNotes: 'دواء عالي الخطورة جداً. يرفع خطر هبوط السكر الحاد المميت وهبوط البوتاسيوم بالدم.',
    reference: 'ISMP Guidelines & ADA Standards of Care'
  },
  {
    id: 'nitroglycerin',
    name: 'Nitroglycerin (NTG)',
    arabicName: 'نيتروجليسرين',
    category: 'Vasodilator',
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
        title: 'ارتفاع الضغط ونقص التروية القلبية (Hypertension / Ischemia)',
        doseMin: 300,
        doseMax: 12000,
        doseUnitKey: 'mcg_hr',
        unitLabel: 'mcg/hr',
        notes: 'تُعادل (5 - 200 mcg/min).'
      }
    ],
    clinicalSafetyNotes: 'دواء عالي الخطورة. يتطلب أنابيب وسرنجات تسريب خاصة غير ممتصة للمادة (Non-PVC Tubing).',
    reference: 'US FDA Labeling: Nitroglycerin Injection'
  }
];
