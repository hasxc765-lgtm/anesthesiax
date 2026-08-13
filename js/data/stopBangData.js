/**
 * STOP-BANG Questionnaire Reference Data
 *
 * AnesthesiaX — Phase 8.4
 * File: js/data/stopBangData.js
 *
 * Primary References:
 * 1. Chung F, Yegneswaran B, Liao P, et al. STOP-Bang Questionnaire: A Practical Tool to Screen Patients for Obstructive Sleep Apnea. Anesthesiology. 2008;108(5):812-821.
 * 2. Chung F, Subramanyam R, Liao P, et al. High STOP-Bang score indicates a high probability of obstructive sleep apnea. Chest. 2012;141(2):438-445.
 *
 * Single Source of Truth for STOP-BANG OSA Screening (Pure Data ES Module).
 */

export const stopBangData = {
  meta: {
    version: "1.1.0-audited",
    title: "استبيان STOP-BANG لمسح خطر انقطاع النفس النومي (STOP-BANG OSA Screening)",
    reference: "Chung F et al. (Anesthesiology 2008 & Chest 2012;141(2):438-445)",
    disclaimer: "استبيان STOP-BANG هو أداة مسحية (Screening Tool) لتقييم احتمالية الخطر فقط، ولا يمثل تشخيصاً قطعياً لانسداد مجرى الهواء النومي (Obstructive Sleep Apnea - OSA) ولا يغني عن تخطيط النوم (Polysomnography).",
    clinicalNotice: "المرضى المعرضون لخطر مرتفع لـ OSA يتطلبون حذراً سريرياً خاصاً: تقليل التسكين الأفيوني غير الضروري، المراقبة التنفسية عند الإفاقة، وإدارة مجرى الهواء بحذر وفق الحالة السريرية."
  },

  items: [
    {
      id: "snoring",
      category: "STOP",
      letter: "S",
      label: "الشخير (Snoring)",
      question: "هل تشخر بصوت عالٍ (يُسمع عبر الأبواب المغلقة أو يزعج من ينام معك)؟"
    },
    {
      id: "tiredness",
      category: "STOP",
      letter: "T",
      label: "الإرهاق/النعاس (Tiredness)",
      question: "هل تشعر غالباً بالتعب أو الإرهاق أو النعاس أثناء النهار؟"
    },
    {
      id: "observed_apnea",
      category: "STOP",
      letter: "O",
      label: "توثيق انقطاع النفس (Observed Apnea)",
      question: "هل لاحظ أحد أنك تتوقف عن التنفس أو تختنق/تختنق جزئياً أثناء نومك؟"
    },
    {
      id: "high_bp",
      category: "STOP",
      letter: "P",
      label: "ارتفاع ضغط الدم (Pressure)",
      question: "هل تعاني من ارتفاع ضغط الدم أو تتناول أدوية لمعالجته؟"
    },
    {
      id: "bmi_over_35",
      category: "BANG",
      letter: "B",
      label: "مؤشر كتلة الجسم (BMI)",
      question: "هل مؤشر كتلة الجسم أكبر من 35 kg/m²؟"
    },
    {
      id: "age_over_50",
      category: "BANG",
      letter: "A",
      label: "العمر (Age)",
      question: "هل العمر أكبر من 50 سنة؟"
    },
    {
      id: "neck_over_40cm",
      category: "BANG",
      letter: "N",
      label: "محيط الرقبة (Neck Circumference)",
      question: "هل محيط الرقبة أكبر من 40 سم (16 بوصة)؟"
    },
    {
      id: "male_gender",
      category: "BANG",
      letter: "G",
      label: "الجنس (Gender)",
      question: "هل المريض ذكر؟"
    }
  ],

  riskTiers: [
    {
      id: "low",
      scoreMin: 0,
      scoreMax: 2,
      tierLabel: "منخفض الخطورة لـ OSA (Low Risk for OSA)",
      recommendation: "توجيه استرشادي: احتمال منخفض للإصابة بانسداد مجرى الهواء النومي. تُطبق خطة الرعاية والتسكين المعيارية مع المراقبة المعتادة."
    },
    {
      id: "intermediate",
      scoreMin: 3,
      scoreMax: 4,
      tierLabel: "متوسط الخطورة لـ OSA (Intermediate Risk for OSA)",
      recommendation: "توجيه استرشادي: احتمال متوسط للإصابة بـ OSA. يُنصح بتوخي الحذر عند إعطاء المسكنات الأفيونية والمراخيات الباسطة للعضلات ومراقبة الإفاقة."
    },
    {
      id: "high",
      scoreMin: 5,
      scoreMax: 8,
      tierLabel: "مرتفع الخطورة لـ OSA (High Risk for Moderate/Severe OSA)",
      recommendation: "توجيه استرشادي: احتمال مرتفع للإصابة بـ OSA متوسط إلى شديد. يتطلب المريض اهتماماً أكبر بإدارة مجرى الهواء، تقليل التعرض غير الضروري للأفيونات، ومراقبة تنفسية مناسبة بعد العملية وفق التقييم السريري."
    }
  ]
};
