/**
 * Caprini Venous Thromboembolism (VTE) Risk Assessment Data
 *
 * AnesthesiaX — Phase 8.4
 * File: js/data/capriniData.js
 *
 * Primary Reference:
 * Caprini JA. Risk assessment of venous thromboembolism. Dis Mon. 2005;51(2-3):70-78.
 * Caprini JA. Thromb Haemost. 2006;96(2):123-140.
 *
 * Validation Cohort Reference:
 * Bahl V, et al. Ann Surg. 2010;251(2):344-350.
 *
 * Single Source of Truth for Caprini RAM (Pure Data ES Module).
 */

export const capriniData = {
  meta: {
    version: "1.2.0-clinical-audited",
    title: "مقياس كابريني لتقييم خطر التجلط الوريدي (Caprini VTE Risk Score)",
    reference: "Caprini JA (2005 RAM) & Bahl V et al. (2010 Validation Cohort)",
    disclaimer: "مقياس كابريني هو أداة استرشادية لتقييم خطورة التجلط الوريدي فقط، ولا يمثل أمراً علاجياً بالوقاية الدوائية. يتطلب اتخاذ قرار الوقاية (الدوائية أو الميكانيكية) تقييماً سريرياً شاملاً لموازنة خطر التجلط مقابل خطر النزيف، نوع الجراحة، وظيفة الكلى، وجود قسطرة التخدير النصفي (Neuraxial Anesthesia/Catheter)، والبروتوكول المحلي للمؤسسة.",
    cohortNotice: "نسب التجلط الوريدي (VTE Rates) المذكورة هي تقديرات إحصائية خاصة بمرضى الجراحة العامة والجراحة الوعائية غير الخاضعين للوقاية الدوائية وفق دراسة Bahl et al. (2010)، ولا تُعد معدل خطر مطلقاً وثابتاً لكل نوع جراحي أو مريض."
  },

  categories: [
    {
      points: 1,
      title: "عوامل خطورة (1 نقطة لكل عنصر):",
      items: [
        { id: "age_41_60", label: "العمر بين 41 و 60 سنة" },
        { id: "minor_surgery", label: "جراحة صغرى مخطط لها (Minor Surgery < 45 min)" },
        { id: "bmi_over_25", label: "مؤشر كتلة الجسم > 25 kg/m² (BMI > 25)" },
        { id: "swollen_legs", label: "تورم ملحوظ في الساقين حالياً (Swollen Legs)" },
        { id: "varicose_veins", label: "دوالي الساقين (Varicose Veins)" },
        { id: "pregnancy_postpartum", label: "حمل أو نفاس حالي (خلال الشهر الماضي)" },
        { id: "oral_contraceptives", label: "استخدام موانع الحمل الهرمونية أو العلاج الهرموني البديل" },
        { id: "unexplained_stillbirth", label: "تاريخ إجهاض تلقائي مجهول السبب (3 حالات أو أكثر) أو ولادة جنين ميت" },
        { id: "sepsis_recent", label: "إصابة بكتيرية حادة أو إنتان (خلال الشهر الماضي)" },
        { id: "serious_lung_disease", label: "مرض رئوي شديد، بما في ذلك داء الانسداد الرئوي المزمن (COPD)" },
        { id: "medical_patient_bedrest", label: "مريض باطني حالي يخضع للراحة بالفراش" }
      ]
    },
    {
      points: 2,
      title: "عوامل خطورة (2 نقطة لكل عنصر):",
      items: [
        { id: "age_61_74", label: "العمر بين 61 و 74 سنة" },
        { id: "arthroscopic_surgery", label: "جراحة بالمنظار المفصلي (Arthroscopic Surgery)" },
        { id: "major_open_surgery", label: "جراحة مفتوحة كبيرة (> 45 دقيقة)" },
        { id: "laparoscopic_surgery", label: "جراحة بالمنظار البطني (> 45 دقيقة)" },
        { id: "malignancy", label: "مرض سرطاني خبيث (حالي أو معالج خلال سنة)" },
        { id: "bedridden_72h", label: "ملازمة الفراش لأكثر من 72 ساعة" },
        { id: "immobilizing_cast", label: "تثبيت الطرف بجبيرة أو جبس (خلال الشهر الماضي)" },
        { id: "central_venous_access", label: "وجود قسطرة وريدية مركزية (Central Venous Access)" }
      ]
    },
    {
      points: 3,
      title: "عوامل خطورة (3 نقاط لكل عنصر):",
      items: [
        { id: "age_over_75", label: "العمر 75 سنة أو أكثر" },
        { id: "history_vte", label: "تاريخ شخصي سابق للتجلط الوريدي (DVT/PE)" },
        { id: "family_history_vte", label: "تاريخ عائلي مؤكد للتجلط الوريدي" },
        { id: "thrombophilia_known", label: "وجود اضطراب فرط الخثورية الوراثي أو المكتسب (مثل Factor V Leiden أو Prothrombin 20210A)" },
        { id: "lupus_anticoagulant", label: "وجود متلازمة مضاد تخثر اللوبوس (Lupus Anticoagulant) أو الأجسام المضادة للكارديوليبين" }
      ]
    },
    {
      points: 5,
      title: "عوامل خطورة شديدة (5 نقاط لكل عنصر):",
      items: [
        { id: "elective_major_arthroplasty", label: "استبدال مفصل الورك أو الركبة المبرمج (Major Lower Extremity Arthroplasty)" },
        { id: "hip_pelvis_leg_fracture", label: "كسر في الورك أو الحوض أو الساق (خلال الشهر الماضي)" },
        { id: "stroke_recent", label: "سكتة دماغية حادة (خلال الشهر الماضي)" },
        { id: "multiple_trauma", label: "إصابات متعددة حادة (Multiple Trauma < 1 month)" },
        { id: "spinal_cord_injury", label: "إصابة حادة في النخاع الشوكي تسبب الشلل (Acute Spinal Cord Injury < 1 month)" }
      ]
    }
  ],

  riskTiers: [
    {
      id: "very_low",
      scoreMin: 0,
      scoreMax: 0,
      tierLabel: "منخفض جداً (Very Low Risk)",
      vteRatePercent: "< 0.5% (تقديري)",
      recommendation: "فئة خطورة استرشادية: تشجيع الحركة المبكرة النشطة (Early Ambulation). القرار النهائي يعتمد على التقييم السريري وبروتوكول المؤسسة."
    },
    {
      id: "low",
      scoreMin: 1,
      scoreMax: 2,
      tierLabel: "منخفض (Low Risk)",
      vteRatePercent: "~1.5% (دراسة Bahl 2010)",
      recommendation: "فئة خطورة استرشادية: يُنظر في وسائل الوقاية الميكانيكية (مثل IPC أو GCS) مع الحركة المبكرة، ما لم يوجد مانع استخدام."
    },
    {
      id: "moderate",
      scoreMin: 3,
      scoreMax: 4,
      tierLabel: "متوسط (Moderate Risk)",
      vteRatePercent: "~3.0% (دراسة Bahl 2010)",
      recommendation: "فئة خطورة استرشادية: يُدرس استخدام الوقاية الدوائية أو الميكانيكية بعد تقييم دقيق لخطر النزيف والجراحة والتخدير النصفي."
    },
    {
      id: "high",
      scoreMin: 5,
      scoreMax: 99,
      tierLabel: "مرتفع / مرتفع جداً (High / Highest Risk)",
      vteRatePercent: "6.0% - 12.0%+ (تقديرات الدراسات المرجعية)",
      recommendation: "فئة خطورة استرشادية: يُدرس خيار التنسيق بين الوقاية الدوائية والميكانيكية شريطة عدم وجود خطر نزيف مرتفع أو موانع استخدام طبية."
    }
  ]
};
