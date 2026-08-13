/**
 * Arterial Blood Gas (ABG) & Electrolytes Reference Data
 *
 * AnesthesiaX — Phase 9.0 (Audited Edition)
 * File: js/data/abgData.js
 *
 * Primary References:
 * 1. Haber RJ. A practical approach to acid-base disorders. West J Med. 1991;155(2):146-151.
 * 2. Kraut JA, Madias NE. Serum anion gap: its uses and limitations in clinical medicine. Clin J Am Soc Nephrol. 2007;2(1):162-174.
 * 3. Katz MA. Hyperglycemia-induced hyponatremia--calculation of expected serum sodium depression. N Engl J Med. 1973;289(16):843-844.
 * 4. Hillier TA, et al. Hyponatremia: evaluating the correction factor for hyperglycemia. Am J Med. 1999;106(4):399-403.
 * 5. ARDS Definition Task Force. Acute respiratory distress syndrome: the Berlin Definition. JAMA. 2012;307(23):2526-2533.
 *
 * Single Source of Truth for ABG & Electrolytes Reference Parameters (Pure Data ES Module).
 */

export const abgData = {
  meta: {
    version: "2.0.0-audited",
    title: "تحليل غازات الدم الشرياني وتصحيح الأملاح (ABG & Electrolytes Center)",
    reference: "Haber RJ (1991), Kraut & Madias (2007), Katz MA (1973), Hillier et al. (1999), Berlin ARDS Definition (2012)",
    disclaimer: "هذه الأداة مخصصة للدعم الاسترشادي والتحليل السريري المساعد فقط. النتائج الحسابية لا تُعد أوامر علاجية مباشرة لتعويض الأملاح أو تعديل المعايير التهوية، وتتطلب دائماً التقييم السريري المباشر وقراءة تخطيط القلب (ECG) ووظائف الكلى."
  },

  clinicalConstants: {
    normalAnionGap: 12.0,
    normalHco3: 24.0,
    normalPaCO2: 40.0,
    normalAlbumin: 4.0,
    sodiumReference: 140.0,
    glucoseBaselineMgDl: 100.0,
    mmolToMgDlFactor: 18.0,
    calciumAlbuminCoefficient: 0.8,
    anionGapAlbuminCoefficient: 2.5,
    katzCoefficientPerHundred: 1.6,
    hillierCoefficientPerHundred: 2.4,
    fio2MinDecimal: 0.21,
    fio2MaxDecimal: 1.00,
    fio2MinPercent: 21.0,
    fio2MaxPercent: 100.0
  },

  smartDefaults: {
    albumin: 4.0,
    glucose: 100.0,
    glucoseUnit: "mg/dL",
    k: 4.0,
    na: 140.0,
    cl: 100.0,
    calcium: 9.0,
    age: 45,
    weight: 70,
    gender: "male",
    respiratoryTimeline: "acute" // "acute" | "chronic"
  },

  validRanges: {
    ph: { min: 6.50, max: 7.80, label: "الرقم الهيدروجيني (pH)" },
    paco2: { min: 10, max: 150, label: "ضغط ثاني أكسيد الكربون (PaCO₂)" },
    hco3: { min: 2, max: 60, label: "البيكربونات (HCO₃⁻)" },
    pao2: { min: 20, max: 600, label: "ضغط الأوكسجين (PaO₂)" },
    fio2Percent: { min: 21, max: 100, label: "نسبة الأوكسجين (FiO₂ %)" },
    glucoseMgDl: { min: 20, max: 1500, label: "جلوكوز الدم (mg/dL)" },
    glucoseMmol: { min: 1.1, max: 83.3, label: "جلوكوز الدم (mmol/L)" }
  },

  normalRanges: {
    ph: { min: 7.35, max: 7.45, unit: "", label: "الرقم الهيدروجيني (pH)" },
    paco2: { min: 35, max: 45, unit: "mmHg", label: "ضغط ثاني أكسيد الكربون (PaCO₂)" },
    pao2: { min: 80, max: 100, unit: "mmHg", label: "ضغط الأوكسجين الشرياني (PaO₂)" },
    hco3: { min: 22, max: 26, unit: "mEq/L", label: "البيكربونات (HCO₃⁻)" },
    be: { min: -2, max: 2, unit: "mEq/L", label: "الفائض القاعدي (Base Excess)" },
    na: { min: 135, max: 145, unit: "mEq/L", label: "الصوديوم (Na⁺)" },
    k: { min: 3.5, max: 5.0, unit: "mEq/L", label: "البوتاسيوم (K⁺)" },
    cl: { min: 98, max: 106, unit: "mEq/L", label: "الكلوريد (Cl⁻)" },
    albumin: { min: 3.5, max: 5.0, unit: "g/dL", label: "الألبومين (Albumin)" },
    glucose: { min: 70, max: 100, unit: "mg/dL", label: "السكر في الدم (Glucose)" },
    calcium: { min: 8.5, max: 10.5, unit: "mg/dL", label: "الكالسيوم الكلي (Total Ca)" }
  },

  tbwFactors: {
    maleYoung: 0.60,
    maleElderly: 0.50,
    femaleYoung: 0.50,
    femaleElderly: 0.45
  },

  clinicalAlerts: {
    potassium: {
      normal: "مستوى البوتاسيوم ضمن النطاق الطبيعي (3.5 - 5.0 mEq/L).",
      mildHypo: "تنبيه: انخفاض خفيف إلى متوسط في البوتاسيوم (2.5 - 3.4 mEq/L). يُوصى بالمتابعة وتحديد السبب وتجنب المحفزات المسببة لعدم انتظام ضربات القلب.",
      severeHypo: "⚠️ انخفاض حاد في البوتاسيوم (< 2.5 mEq/L): يهدد باعتلال إيقاع القلب (Arrhythmia) وضعف العضلات. يتطلب مراقبة مستمرة لـ ECG، فحص مستوى الماغنيسيوم، والتعويض الوريدي المحمي وفق التقييم السريري.",
      mildHyper: "تنبيه: ارتفاع خفيف إلى متوسط في البوتاسيوم (5.1 - 6.0 mEq/L). يُوصى بمراجعة وظائف الكلى والأدوية المسببة لاحتباس البوتاسيوم.",
      severeHyper: "🚨 فرط بوتاسيوم الدم الحاد (> 6.0 mEq/L): حالة طبية طارئة وإسعافية حرجة! يجب إجراء تخطيط القلب (ECG) فوراً لمعاينة موجات T الحادة أو اتساع QRS. يُدرس استخدام حماية الغشاء الخلوي (Calcium) ودفع الإنسولين/الجلوكوز والبيكربونات حسب الاستطباب السريري ووظائف الكلى."
    },
    calcium: {
      hypoNotice: "تنبيه سريري: تصحيح الكالسيوم الكلي بناءً على الألبومين (معادلة Payne) هو تقدير تقريبي. في الحالات الحرجة وغرف العمليات، يُوصى دائماً باعتتماد الكالسيوم المتأين المباشر (Ionized Ca²⁺)."
    },
    ards: {
      pfNotice: "تنبيه سريري: نسبة P/F Ratio تعكس درجة انخفاض الأكسجة الشريانية (Hypoxemic Severity) وليست تشخيصاً مطلقاً لـ ARDS بمفردها. يتطلب تشخيص ARDS المعتمد (Berlin Definition) وجود ارشاحات رئوية ثنائية في الأشعة، وضغط زفيري إيجابي PEEP/CPAP ≥ 5 cmH₂O، مع استبعاد الوذمة القبلية كمسبب رئيسي."
    },
    freeWater: {
      rateNotice: "تحذير سلامة: حجم عجز الماء الحر هو تقدير تقريبي للاسترشاد. يجب ألا يتجاوز معدل خفض الصوديوم في فرط صوديوم الدم المزمن 0.5 mEq/L في الساعة (أو 8-10 mEq/L خلال 24 ساعة) لتفادي حدوث الوذمة الدماغية (Cerebral Edema)."
    }
  }
};
