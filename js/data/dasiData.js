/**
 * Duke Activity Status Index (DASI) & Functional Capacity Reference Data
 *
 * AnesthesiaX — Phase 8.5
 * File: js/data/dasiData.js
 *
 * Primary References:
 * 1. Hlatky MA, Boineau RE, Higginbotham MB, et al. A brief self-administered questionnaire to determine functional capacity (the Duke Activity Status Index). Am J Cardiol. 1989;64(10):651-654.
 * 2. Fleisher LA, Fleischmann KE, Auerbach AD, et al. 2014 ACC/AHA guideline on perioperative cardiovascular evaluation and management. Circulation. 2014;130(22):e278-e333.
 *
 * Single Source of Truth for Functional Capacity Assessment (Pure Data ES Module).
 */

export const dasiData = {
  meta: {
    version: "1.1.0-clinical-audited",
    title: "مؤشر 'دوق' للسعة الوظيفية وتخمين المجهود البدني (DASI & Estimated METs)",
    reference: "Hlatky MA et al. (Am J Cardiol 1989) & 2014 ACC/AHA Guidelines",
    disclaimer: "مؤشر DASI هو استبيان للتقييم الذاتي السريع للسعة الوظيفية والذروة التقديرية لاستهلاك الأوكسجين (Estimated Peak VO₂). تُعد النتائج أداة استرشادية لتقييم القدرة على تحمل الجهد البدني قبل العملية ولا تُغني عن التقييم السريري الشامل.",
    clinicalNotice: "تقييم السعة الوظيفية (< 4 METs أو ≥ 4 METs) يُمثل عنصراً استرشادياً ضمن التقييم القلبي حول الجراحة وفق توصيات ACC/AHA، ويُفسر دائماً بالتزامن مع خطورة الجراحة المحددة، الأعراض السريرية، وعوامل الخطورة العامة."
  },

  items: [
    {
      id: "self_care",
      points: 2.75,
      label: "العناية الذاتية الشاملة (Self-Care)",
      question: "هل تستطيع العناية بنفسك، مثل الأكل، الارتداء، الاستحمام، أو استخدام المرحاض؟"
    },
    {
      id: "walk_indoors",
      points: 1.75,
      label: "المشي داخل المنزل (Walk Indoors)",
      question: "هل تستطيع المشي داخل المنزل، مثل التنقل بين الغرف؟"
    },
    {
      id: "walk_1_2_blocks",
      points: 2.75,
      label: "المشي مسافة مجمع أو مجمعين (Walk 1-2 Blocks)",
      question: "هل تستطيع مشي مسافة مجمع أو مجمعين سكنيين (حوالي 100-200 متر) على أرض مستوية؟"
    },
    {
      id: "climb_stairs",
      points: 5.50,
      label: "صعود طابق درج أو تلة (Climb Stairs / Hill)",
      question: "هل تستطيع صعود طابق واحد من الدرج أو المشي صعوداً على تلة؟"
    },
    {
      id: "run_short_dist",
      points: 8.00,
      label: "الجري لمسافة قصيرة (Run a Short Distance)",
      question: "هل تستطيع الجري لمسافة قصيرة؟"
    },
    {
      id: "light_housework",
      points: 2.70,
      label: "أعمال منزلية خفيفة (Light Housework)",
      question: "هل تستطيع القيام بأعمال منزلية خفيفة مثل تنظيف الغبار أو غسل الأطباق؟"
    },
    {
      id: "moderate_housework",
      points: 3.50,
      label: "أعمال منزلية متوسطة (Moderate Housework)",
      question: "هل تستطيع القيام بأعمال منزلية متوسطة مثل التنظيف بالمكنسة الكهربائية، مسح الأرضيات، أو حمل المشتريات؟"
    },
    {
      id: "heavy_housework",
      points: 8.00,
      label: "أعمال منزلية ثقيلة (Heavy Housework)",
      question: "هل تستطيع القيام بأعمال منزلية ثقيلة مثل فرك الأرضيات أو تحريك الأثاث الثقيل؟"
    },
    {
      id: "yard_work",
      points: 4.50,
      label: "أعمال الحديقة (Yard Work)",
      question: "هل تستطيع القيام بأعمال الحديقة مثل جمع الأوراق بالمجرفة، إزالة الأعشاب، أو دفع جزازة العشب؟"
    },
    {
      id: "sexual_relations",
      points: 5.25,
      label: "المعاشرة الزوجية (Sexual Relations)",
      question: "هل تستطيع ممارسة العلاقة الزوجية؟"
    },
    {
      id: "moderate_recreation",
      points: 6.00,
      label: "أنشطة ترفيهية متوسطة (Moderate Recreation)",
      question: "هل تستطيع المشاركة في أنشطة ترفيهية متوسطة مثل البولينج، الرقص، التنس المزدوج، أو رمي الكرة؟"
    },
    {
      id: "strenuous_sports",
      points: 7.50,
      label: "رياضات مجهدة (Strenuous Sports)",
      question: "هل تستطيع المشاركة في رياضات مجهدة مثل السباحة، التنس الفردي، كرة القدم، أو كرة السلة؟"
    }
  ],

  // Perioperative MET risk categories for clinical interpretation context
  tiers: [
    {
      id: "poor",
      metMax: 3.99,
      tierLabel: "سعة وظيفية منخفضة (< 4 METs)",
      recommendation: "توجيه استرشادي: يُقدر الجهد البدني بأقل من 4 METs. تُعد السعة الوظيفية المنخفضة مؤشراً يستدعي تفسيره ضمن السياق السريري الشامل وخطر الجراحة المحددة، دون أن تعني وحدها وجوب إجراء فحوصات قلبية إضافية."
    },
    {
      id: "moderate",
      metMin: 4.0,
      metMax: 7.0,
      tierLabel: "سعة وظيفية متوسطة (4 - 7 METs)",
      recommendation: "توجيه استرشادي: يُقدر الجهد البدني بـ 4 إلى 7 METs. تعكس هذه النتيجة قدرة مقبولة على تحمل الأنشطة اليومية وتُفسر بالتزامن مع الحالة الصحية العامة للمريض."
    },
    {
      id: "good_excellent",
      metMin: 7.01,
      metMax: 99.0,
      tierLabel: "سعة وظيفية جيدة إلى ممتازة (> 7 METs)",
      recommendation: "توجيه استرشادي: يُقدر الجهد البدني بأكثر من 7 METs. تعكس النتيجة سعة وظيفية جيدة، ولا تستدعي القدرة الوظيفية وحدها عادة إجراء تقييم قلبي إضافي مخصص للجهد."
    }
  ]
};
