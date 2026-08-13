/**
 * Modified Frailty Index 5-Item (mFI-5) Reference Data
 *
 * AnesthesiaX — Phase 8.5
 * File: js/data/frailtyData.js
 *
 * Primary References:
 * 1. Subramaniam S, et al. New 5-Factor Modified Frailty Index Predicts Morbidity and Mortality in Vascular Surgery. J Vasc Surg. 2018;68(5):1568-1574.
 * 2. Traven SA, et al. New 5-Factor Modified Frailty Index Predicts Morbidity and Mortality After Total Hip and Knee Arthroplasty. J Arthroplasty. 2019;34(1):18-23.
 * 3. American College of Surgeons National Surgical Quality Improvement Program (ACS-NSQIP) Variable Definitions.
 *
 * Single Source of Truth for mFI-5 Assessment (Pure Data ES Module).
 */

export const frailtyData = {
  meta: {
    version: "1.1.0-clinical-audited",
    title: "مقياس الهشاشة المعدل الخماسي (mFI-5 Frailty Index)",
    reference: "ACS-NSQIP 5-Factor Modified Frailty Index (Subramaniam et al. 2018)",
    disclaimer: "مقياس mFI-5 هو أداة حسابية مسحية (0 إلى 5 نقاط / نسبة من 0.0 إلى 1.0) مستمدة من متغيرات NSQIP المعتمدة لتقدير عبء الهشاشة والحالة الفسيولوجية لدى المرضى الجراحيين. النتيجة هي مؤشر استرشادي ولا تُشكل حكماً تشخيصياً مطلقاً أو سبباً منفرداً لتغيير الخطة الجراحية.",
    clinicalNotice: "ترتبط زيادة عدد عوامل mFI-5 بارتفاع احتمالية المضاعفات العامة بعد العملية وفترة الإقامة بالمستشفى. يُستفاد من النتيجة في التخطيط المبكر للإفاقة، تقليل عوامل خطر الهذيان، وتحسين الجاهزية الجراحية."
  },

  items: [
    {
      id: "functional_dependency",
      points: 1,
      label: "اعتمادية الحالة الوظيفية (Partially / Totally Dependent Status)",
      question: "هل يعتمد المريض جزئياً أو كلياً على الآخرين في أداء أنشطة الحياة اليومية (مثل الاستحمام، الارتداء، التنقل) خلال الـ 30 يوماً قبل الجراحة؟"
    },
    {
      id: "diabetes_mellitus",
      points: 1,
      label: "داء السكري الخاضع للعلاج (Diabetes Mellitus Requiring Treatment)",
      question: "هل يعاني المريض من داء السكري الخاضع للعلاج بالخافضات الفموية أو الإنسولين؟"
    },
    {
      id: "chronic_lung_disease",
      points: 1,
      label: "مرض رئوي مزمن شديد أو التهاب رئوي (COPD or Pneumonia)",
      question: "هل لدى المريض تاريخ لمرض انسدادي رئوي مزمن شديد (COPD) أو أصيب بالتهاب الرئة؟"
    },
    {
      id: "congestive_heart_failure",
      points: 1,
      label: "قصور القلب الاحتقاني (Congestive Heart Failure)",
      question: "هل لدى المريض تاريخ مرضي لقصور القلب الاحتقاني (CHF) خلال الـ 30 يوماً قبل الجراحة؟"
    },
    {
      id: "hypertension_meds",
      points: 1,
      label: "ارتفاع ضغط الدم المعالج (Hypertension Requiring Medication)",
      question: "هل يعاني المريض من ارتفاع ضغط الدم الخاضع للعلاج الدوائي؟"
    }
  ],

  tiers: [
    {
      id: "tier_0",
      scoreMin: 0,
      scoreMax: 0,
      ratioLabel: "0.0 (0/5)",
      tierLabel: "mFI-5: 0.0 (لا توجد عوامل ممررة)",
      recommendation: "توجيه استرشادي: عدم وجود عوامل ضمن هذا المقياس الخماسي. يُكتفى بالرعاية والتخدير المعياري وفق التقييم العام."
    },
    {
      id: "tier_1",
      scoreMin: 1,
      scoreMax: 1,
      ratioLabel: "0.2 (1/5)",
      tierLabel: "mFI-5: 0.2 (عامل واحد)",
      recommendation: "توجيه استرشادي: وجود عامل واحد من عوامل الهشاشة الخمسة. يُنصح بالتقييم السريري الاعتيادي ومتابعة التعافي الوظيفي."
    },
    {
      id: "tier_2",
      scoreMin: 2,
      scoreMax: 2,
      ratioLabel: "0.4 (2/5)",
      tierLabel: "mFI-5: 0.4 (عاملان)",
      recommendation: "توجيه استرشادي: وجود عاملين من عوامل الهشاشة. يُنصح بمراعاة التخطيط المبكر للإفاقة والرعاية الاحترازية بعد العملية."
    },
    {
      id: "tier_3_plus",
      scoreMin: 3,
      scoreMax: 5,
      ratioLabel: "0.6 - 1.0 (3/5 - 5/5)",
      tierLabel: "mFI-5: ≥ 0.6 (3 عوامل أو أكثر)",
      recommendation: "توجيه استرشادي: مظهر هشاشة مرتفع (3 إلى 5 عوامل). يُوصى بالتحضير الشامل قبل العملية، تقليل مخاطر الهذيان حول الجراحة، وإشراك التخصصات المعنية في مرحلة التعافي."
    }
  ]
};
