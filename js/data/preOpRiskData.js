/**
 * Preoperative Risk Assessment Reference Data
 *
 * AnesthesiaX — Phase 8.3
 * File: js/data/preOpRiskData.js
 *
 * Single Source of Truth (Pure Data ES Module)
 * Strictly decoupled from UI, logic, and rendering.
 */

export const preOpRiskData = {
  meta: {
    version: "8.3.0-data-final-validated",
    moduleName: "preOpRiskData",
    disclaimer: "مؤشرات تقييم المخاطر قبل العملية هي أدوات استرشادية مشتقة من دراسات إحصائية للمجموعات، ولا تغني عن التقييم السريري المباشر والتقييم الفردي لكل حالة.",
    clinicalNotice: "جميع النتائج تُعرض كـ 'تنبيهات استرشادية' (Clinical Considerations) لرفع الوعي بالعوامل المرتفعة الخطورة ولا تصدر أوامر سريرية ملزمة."
  },

  // =========================================================================
  // 1. ASA PHYSICAL STATUS CLASSIFICATION (ASA 2020 Update)
  // =========================================================================

  asa: {
    title: "تصنيف الجمعية الأمريكية لأطباء التخدير للحالة الجسدية (ASA Physical Status)",
    emergencyModifier: {
      code: "E",
      label: "جراحة طارئة (Emergency)",
      description: "تُضاف السابقة 'E' عند إجراء الجراحة كحالة طارئة دون تغيير فئة ASA الأساسية للمريض."
    },
    categories: [
      {
        id: "asa1",
        code: "ASA I",
        title: "مريض سليم صحياً (Normal Healthy Patient)",
        desc: "سليم، غير تدخيني، لا يعاني من أمراض مزمنة.",
        example: "بالغ أو طفل سليم تماماً."
      },
      {
        id: "asa2",
        code: "ASA II",
        title: "مرض جهازي خفيف (Mild Systemic Disease)",
        desc: "مرض جهازي خفيف بدون قيود وظيفية على الحياة اليومية.",
        example: "تدخين التبغ، ضغط دم مضبوط، سكري مضبوط، سمنة خفيفة (30 ≤ BMI < 40)، أو حمل طبيعي."
      },
      {
        id: "asa3",
        code: "ASA III",
        title: "مرض جهازي شديد (Severe Systemic Disease)",
        desc: "مرض جهازي شديد يسبب قيوداً وظيفية واضحة في الحياة اليومية (غير عاجزة بالكامل).",
        example: "سكري أو ضغط دم غير مضبوط، COPD شديد، سمنة مفرطة (BMI ≥ 40)، غسيل كلى منتظم، أو MI قديم (> 3 أشهر)."
      },
      {
        id: "asa4",
        code: "ASA IV",
        title: "مرض جهازي شديد يهدد الحياة (Constant Threat to Life)",
        desc: "مرض جهازي شديد يمثل تهديداً مستمراً لحياة المريض.",
        example: "احتشاء حديث بعضلة القلب (< 3 أشهر)، ذبحة غير مستقرة، فشل كلوي حاد، أو صدمة جراثيمية."
      },
      {
        id: "asa5",
        code: "ASA V",
        title: "مريض مشرف على الموت (Moribund Patient)",
        desc: "لا يُتوقع بقاؤه حياً لمدة 24 ساعة بدون إجراء الجراحة.",
        example: "تمزق أم الدم الأبهرية البطنية أو الصدرية، أو نزيف دماغي حاد مع انزياح الخط المتوسط."
      },
      {
        id: "asa6",
        code: "ASA VI",
        title: "مريض ميت دماغياً (Declared Brain-Dead)",
        desc: "مريض أُعلن موته دماغياً رسمياً وتقتصر إدارة التخدير على الحفاظ على حيوية الأعضاء المخصصة للتبرع.",
        example: "حالة موت دماغي مؤكدة لاستئصال الأعضاء للتبرع."
      }
    ]
  },

  // =========================================================================
  // 2. REVISED CARDIAC RISK INDEX (RCRI - Lee et al. 1999)
  // =========================================================================

  rcri: {
    title: "مؤشر 'لي' المعدل للمخاطر القلبية (Revised Cardiac Risk Index - RCRI)",
    reference: "Lee TH, Marcantonio ER, Mangione CM, et al. Circulation. 1999;100(10):1043-1049.",
    note: "المعدلات المئوية المذكورة تُمثل نسب حدوث المضاعفات المسجلة في مجتمع الدراسة المرجعية الأصلية (Lee 1999 Original Validation Cohort Rate) وليست خطراً مطلقاً.",
    factors: [
      {
        id: "highRiskSurgery",
        label: "جراحة عالية الخطورة (High-Risk Surgery)",
        points: 1,
        desc: "جراحات الأوعية الدموية فوق الرباط الإربي (Suprainguinal Vascular)، الجراحات داخل الصدر (Intrathoracic)، وجراحات داخل الصفاق (Intraperitoneal)."
      },
      {
        id: "ischemicHeartDisease",
        label: "تاريخ مرض قلبي إقفاري (Ischemic Heart Disease)",
        points: 1,
        desc: "تاريخ احتشاء عضلة القلب، فحص جهد إيجابي، وجود آلام ذبحة صدرية، أو استخدام النيترات."
      },
      {
        id: "congestiveHeartFailure",
        label: "تاريخ قصور قلب احتقاني (Congestive Heart Failure)",
        points: 1,
        desc: "تاريخ قصور القلب الاحتقاني، وذمة الرئة الحادة، ضيق النفس الليلي الانتيابي (Paroxysmal Nocturnal Dyspnea)، أو انخفاض كفاءة القذف القلبية."
      },
      {
        id: "cerebrovascularDisease",
        label: "تاريخ مرض وعائي دماغي (Cerebrovascular Disease)",
        points: 1,
        desc: "تاريخ سكتة دماغية (Stroke) أو نوبة نقص تروية عابرة (TIA)."
      },
      {
        id: "insulinDiabetes",
        label: "العلاج بالإنسولين لمرضى السكري (Insulin Therapy)",
        points: 1,
        desc: "الاعتماد على حقن الإنسولين للسيطرة على داء السكري قبل العملية."
      },
      {
        id: "renallyImpaired",
        label: "ارتفاع كراتينين الدم المصلي (Creatinine > 2.0 mg/dL)",
        points: 1,
        desc: "تركيز الكراتينين المصلي أكبر من 2.0 mg/dL (177 µmol/L) قبل العملية."
      }
    ],
    classes: [
      {
        score: 0,
        classLabel: "Class I",
        riskTier: "Low Risk",
        maceRatePercent: 0.4
      },
      {
        score: 1,
        classLabel: "Class II",
        riskTier: "Low Risk",
        maceRatePercent: 0.9
      },
      {
        score: 2,
        classLabel: "Class III",
        riskTier: "Moderate Risk",
        maceRatePercent: 7.0
      },
      {
        scoreMin: 3,
        classLabel: "Class IV",
        riskTier: "High Risk",
        maceRatePercent: 11.0
      }
    ]
  },

  // =========================================================================
  // 3. ARISCAT SCORE FOR PULMONARY RISK (Canet et al. 2010)
  // =========================================================================

  ariscat: {
    title: "مؤشر ARISCAT للمخاطر الرئوية بعد العملية (Postoperative Pulmonary Complications)",
    reference: "Canet J, Gallart L, Gomar C, et al. Anesthesiology. 2010;113(6):1338-1350.",
    factors: {
      ageOptions: [
        { value: 0, points: 0, label: "≤ 50 سنة" },
        { value: 1, points: 3, label: "51 إلى 80 سنة" },
        { value: 2, points: 16, label: "> 80 سنة" }
      ],
      spo2Options: [
        { value: 0, points: 0, label: "≥ 96% (على هواء الغرفة - Room Air)" },
        { value: 1, points: 8, label: "91% إلى 95% (على هواء الغرفة - Room Air)" },
        { value: 2, points: 24, label: "≤ 90% (على هواء الغرفة - Room Air)" }
      ],
      respiratoryInfection: {
        id: "respiratoryInfection",
        label: "عدوى تنفسية خلال الشهر الماضي (Respiratory Infection in Last Month)",
        points: 17,
        desc: "إصابة بعدوى في الجهاز التنفسي العلوي أو السفلي خلال الـ 30 يوماً الماضية."
      },
      preopAnemia: {
        id: "preopAnemia",
        label: "فقر الدم قبل العملية (Preoperative Anemia: Hb ≤ 10 g/dL)",
        points: 11,
        desc: "تركيز الهيموجلوبين المصلي قبل العملية 10 g/dL أو أقل."
      },
      incisionOptions: [
        { value: "peripheral", points: 0, label: "جراحة طرفية (Peripheral)" },
        { value: "upper_abdominal", points: 15, label: "أعلى البطن (Upper Abdominal)" },
        { value: "intrathoracic", points: 24, label: "داخل الصدر (Intrathoracic)" }
      ],
      durationOptions: [
        { value: "lte_2h", points: 0, label: "ساعتان أو أقل (≤ 2 hours)" },
        { value: "gt_2_3h", points: 16, label: "أكثر من 2 إلى 3 ساعات (> 2 - 3 hours)" },
        { value: "gt_3h", points: 23, label: "أكثر من 3 ساعات (> 3 hours)" }
      ],
      emergencyProcedure: {
        id: "emergencyProcedure",
        label: "جراحة طارئة (Emergency Procedure)",
        points: 8,
        desc: "إجراء الجراحة كحالة طارئة غير مبرمجة."
      }
    },
    tiers: [
      {
        id: "low",
        tierLabel: "منخفض الخطورة (Low Risk)",
        minPoints: 0,
        maxPoints: 25,
        ppcRatePercent: 1.6
      },
      {
        id: "intermediate",
        tierLabel: "متوسط الخطورة (Intermediate Risk)",
        minPoints: 26,
        maxPoints: 44,
        ppcRatePercent: 13.3
      },
      {
        id: "high",
        tierLabel: "مرتفع الخطورة (High Risk)",
        minPoints: 45,
        maxPoints: 123,
        ppcRatePercent: 42.1
      }
    ]
  },

  // =========================================================================
  // 4. QUALITATIVE ADVISORY CLINICAL CONSIDERATIONS
  // =========================================================================

  clinicalConsiderations: {
    cardiovascular: {
      low: "خطر قلبي منخفض بناءً على المعايير المحددة. يُكتفى بالمراقبة المعيارية لمخطط القلب وضغط الدم.",
      moderate: "خطر قلبي متوسط (RCRI Class III). قد يُدرس تقييم وظيفي قلبي إضافي وتخطيط قلب حديث بناءً على الأعراض السريرية، السعة الوظيفية (METs)، وخطورة الجراحة المحددة.",
      high: "خطر قلبي مرتفع (RCRI Class IV ≥ 3 نقاط). قد يُدرس طلب استشارة قلبية تخصصية ومراقبة قلبية متقدمة أثناء وما بعد العملية بناءً على الحالة السريرية العامة والسعة الوظيفية للمريض."
    },
    pulmonary: {
      low: "خطر تنفسي منخفض. تُطبق خطة الرعاية التنفسية المعيارية.",
      intermediate: "خطر تنفسي متوسط (ARISCAT 26-44). قد يُنظر في تمارين التنفس العميق قبل وبعد العملية، والتسكين الفعال للألم لمنع انخماص الرئة.",
      high: "خطر تنفسي مرتفع (ARISCAT ≥ 45). معدل المضاعفات الرئوية التقديري في مجتمع الدراسة المرجعية يبلغ 42.1%. قد يُدرس تطبيق استراتيجيات تحسين التهوية، التسكين الفعال لمنع الانخماص، والمراقبة التنفسية عن قرب."
    },
    emergencyNotice: "الجراحة الطارئة ترتبط بزيادة مستقلة في المخاطر القلبية والتنفسية ومضاعفات الشفط الرئوي (Pulmonary Aspiration). قد يُدرس تقييم جاهزية السوائل وتأمين المجرى الهوائي عن كثب."
  }
};
