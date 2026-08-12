/**
 * Volatile Anesthetics Reference Data & Clinical Standards
 *
 * AnesthesiaX — Phase 8.2 (Arabic Localization)
 * File: js/data/volatileAgentsData.js
 *
 * Architecture:
 * Pure Data ES Module.
 */

export const volatileAgentsData = {
  // =========================================================================
  // 1. METADATA
  // =========================================================================

  meta: {
    version: "8.2.1-data-ar",
    moduleName: "volatileAgentsData",

    description:
      "بيانات مرجعية سريرية للغازات الاستنشاقية، قيم MAC، مراجع الأطفال، تعديل العمر، تقدير استهلاك المبخرات، ومحددات الأمان.",

    lastAudited: "2026-08",

    supportedAgents: [
      "sevoflurane",
      "isoflurane",
      "desflurane"
    ],

    disclaimer:
      "MAC هو مقياس فارماكوديناميكي إحصائي مشتق من المجموعات. وهو ليس جرعة تخديرية مخصصة لمريض معين، ولا يضمن عمق تخدير محدد، ولا يغني عن المراقبة السريرية المستمرة.",

    clinicalUseNotice:
      "جميع القيم المحسوبة هي تقديرات استرشادية. يُرجى دائماً التحقق من تركيز الغاز، إعدادات المبخر، التركيز السنخي المقاس End-Tidal، تركيز الأكسجين، عمر المريض، وضعه الفسيولوجي، كفاءة الأجهزة، والبروتوكولات المحلية قبل الاستخدام السريري."
  },

  // =========================================================================
  // 2. MAC SEMANTICS
  // =========================================================================

  semantics: {
    definition:
      "التركيز السنخي الأدنى (MAC) هو التركيز السنخي للغاز الاستنشاقي عند ضغط 1 جو والذي يمنع الحركة الإرادية استجابة لمحفز جراحي موحد لدى 50% من المرضى.",

    interpretation:
      "الـ MAC قياس إحصائي للمجموعات ويختلف بحسب العمر، درجة الحرارة، الحالة الفسيولوجية، الأدوية المصاحبة، والعوامل السريرية الأخرى.",

    macFractionDefinition:
      "نسبة الـ MAC = التركيز السنخي المقاس End-Tidal مقسوماً على قيمة الـ MAC المرجعية المناسبة.",

    isNot: [
      "وصفة طبية لجرعة مريض محدد",
      "مقياساً مؤكداً بمفرده لعمق التخدير",
      "هدف إجباري لتركيز التخدير",
      "بديلاً عن المراقبة السريرية",
      "بديلاً عن مراقبة التركيز السنخي للغازات",
      "بديلاً عن البروتوكولات المؤسسية"
    ],

    additiveMacNotice:
      "يمكن جمع أجزاء الـ MAC للغازات الاستنشاقية كتقدير إحصائي تراكمي، ولا يضمن ذلك عمق التخدير الفردي للمريض."
  },

  // =========================================================================
  // 3. AGE ADJUSTMENT MODEL
  // =========================================================================

  ageAdjustmentModel: {
    name: "نموذج Nickalls & Mapleson للتعديل العمري",

    type: "logarithmic_age_adjustment",

    formula:
      "MAC(age) = MAC40 × 10^(-0.00269 × (age - 40))",

    coefficient: -0.00269,

    referenceAgeYears: 40,

    clinicalChartAgeRange: {
      minAgeYearsInclusive: 5,
      maxAgeYearsInclusive: 95
    },

    calculatorPolicy: {
      adultModelMinimumAgeYears: 5,
      adultModelMaximumAgeYears: 95,

      usePediatricReferenceWhenAvailable: true,

      doNotBlindlyExtrapolateToInfants: true,

      outsideSupportedRangeAction: "requiresClinicalReview"
    },

    limitations:
      "لا يجوز استخدام نموذج تعديل العمر للبالغين تلقائياً على الفئات العمرية للأطفال غير المدعومة. عند توفر مرجع أطفال معتمد، تكون له الأولوية.",

    reference: {
      authors: "Nickalls RWD, Mapleson WW",
      title:
        "Age-related iso-MAC charts for isoflurane, sevoflurane and desflurane",
      journal: "British Journal of Anaesthesia",
      year: 2003,
      volume: "91",
      issue: "2",
      pages: "170-174",
      doi: "10.1093/bja/aeg132"
    }
  },

  // =========================================================================
  // 4. LIQUID CONSUMPTION MODEL
  // =========================================================================

  consumptionModel: {
    name: "نموذج Dion لتقدير استهلاك سائل المبخر",

    formula:
      "استهلاك السائل (mL/hr) = FGF (L/min) × تركيز المبخر (%) × الوزن الجزئي × 60 / (2412 × الكثافة السائلة)",

    inputFlowUnit: "L/min",

    concentrationUnit: "vol%",

    outputUnit: "mL/hr",

    conversionConstant: 2412,

    factorType: "Dion_equation_derived",

    notes:
      "يقدر مخرجات المبخر المسلمة وتحويلها إلى حجم سائل. لا يقدر امتصاص المريض، ضياع الدائرة، التسريبات، أو التغير الفعلي في وزن زجاجة المبخر.",

    clinicalInterpretation:
      "الاستهلاك هو قيمة تقديرية تعتمد على تدفق الغاز النقي وتركيز المبخر. قد يختلف الاستهلاك الفعلي بسبب خصائص الأجهزة، درجة الحرارة، التسريب، وإعادة التنفس.",

    reference: {
      author: "Dion P",
      title: "The cost of anaesthetic vapours",
      journal: "Canadian Journal of Anaesthesia",
      year: 1992,
      volume: "39",
      issue: "6",
      pages: "633",
      doi: "10.1007/BF03008331"
    }
  },

  // =========================================================================
  // 5. LOW FLOW
  // =========================================================================

  lowFlow: {
    enabled: true,

    thresholdLMin: 1.0,

    conventionalFlowThresholdLMin: 2.0,

    highFlowThresholdLMin: 4.0,

    standardComparison: {
      baselineFgfLMin: 2.0,
      lowFlowFgfLMin: 0.5
    },

    definition:
      "يشير التخدير بالتدفق المنخفض عموماً إلى استخدام تدفق غاز نقي أقل من 1 L/min تقريباً.",

    safetyRequirements: [
      "مراقبة مستمرة للأكسجين المستنشق (FiO2)",
      "مراقبة مستمرة لثاني أكسيد الكربون (End-Tidal CO2)",
      "مراقبة مستمرة لتركيز الغاز التخديري المستنشق والسنخي",
      "صودا لايم فعالة لامتصاص CO2",
      "أداء خالي من التسريب لجهاز التخدير",
      "أداء دقيق للمبخر",
      "مراقبة سريرية مناسبة للمريض"
    ],

    disclaimer:
      "يتطلب التخدير بالتدفق المنخفض جهاز تخدير ودائرة تنفس قادرة على التشغيل الآمن بالتدفق المنخفض مع توفر المراقبة المناسبة."
  },

  // =========================================================================
  // 6. NITROUS OXIDE
  // =========================================================================

  nitrousOxide: {
    supported: true,

    id: "nitrous_oxide",

    name: "Nitrous Oxide (N₂O)",

    arabicName: "أكسيد النيتروز",

    macAt40: 104.0,

    unit: "vol%",

    interactionModel: "additive_mac_fraction",

    ageAdjustmentSupported: true,

    maxInputPercent: 70.0,

    minimumFiO2Assumption: 0.30,

    calculatorPolicy: {
      validateRange: true,

      doNotClaimThatN2OPercentAloneProvesFiO2:
        true,

      useAgeAdjustedReference:
        true,

      warning:
        "نسبة N₂O بمفردها لا تثبت تركيز الأكسجين المستنشق الفعلي FiO₂ عند وجود غازات أخرى."
    },

    disclaimer:
      "قيمة MAC المرجعية لـ N₂O مشتقة إحصائياً. يجب مراقبة تركيز الأكسجين الفعلي سريرياً. الحد الأقصى لـ N₂O لا يعتبر إثباتاً لـ FiO₂ كافٍ.",

    reference: {
      authors:
        "Hornbein TF, Eger EI 2nd, Winter PM, Smith G, Wetstone D, Smith KH",
      title: "The minimum alveolar concentration of nitrous oxide in man",
      journal: "Anesthesia & Analgesia",
      year: 1982,
      volume: "61",
      pages: "553-556",
      pmid: "7201254"
    }
  },

  // =========================================================================
  // 7. OPIOIDS / ADJUNCTS
  // =========================================================================

  opioidInteraction: {
    supported: true,

    model: "qualitative_only",

    fixedReductionPercent: null,

    calculatorPolicy: {
      doNotApplyFixedPercentageReduction: true,

      displayQualitativeWarning: true
    },

    clinicalNotice:
      "الأفيونات والأدوية المساعدة تقلل من احتياج الغازات الاستنشاقية. تختلف نسبة التخفيض بحسب الدواء، الجرعة، التوقيت، وعمر المريض. لا تطبق الحاسبة نسبة تخفيض رقمية ثابتة لمنع التضليل السريري."
  },

  // =========================================================================
  // 8. GLOBAL CONSTRAINTS
  // =========================================================================

  constraints: {
    ageYears: {
      minInclusive: 0,
      maxInclusive: 120,
      reason:
        "حدود منطقية لإدخال العمر."
    },

    fgfLmin: {
      minInclusive: 0.1,
      maxInclusive: 15.0,
      reason:
        "حدود إدخال تدفق الغاز النقي."
    },

    dialPercent: {
      minInclusive: 0,
      maxInclusive: 18,
      reason:
        "حدود إدخال المبخر العامة. يتم تطبيق حدود المبخر الخاصة بكل غاز بشكل مستقل."
    },

    endTidalPercent: {
      minInclusive: 0,
      maxInclusive: 18,
      reason:
        "حدود إدخال التركيز السنخي المقاس."
    },

    n2oPercent: {
      minInclusive: 0,
      maxInclusive: 70,
      reason:
        "حد أقصى مبسط لضمان حفظ نسبة أكسجين لا تقل عن 30% في الخليط الثنائي. يجب مراقبة FiO2 سريرياً."
    },

    durationHours: {
      minInclusive: 0.01,
      maxInclusive: 24,
      reason:
        "حدود إدخال مدة التخدير."
    }
  },

  // =========================================================================
  // 9. SUPPORTED AGENTS
  // =========================================================================

  agents: {
    // =======================================================================
    // SEVOFLURANE
    // =======================================================================

    sevoflurane: {
      id: "sevoflurane",

      name: "Sevoflurane",

      arabicName: "سيفوفلوران",

      genericName: "Sevoflurane",

      category: "Inhalational Volatile Anesthetic",

      macAt40: 1.80,

      macAt40Unit: "vol%",

      adultMacModel: {
        supported: true,
        minimumAgeYearsInclusive: 5,
        maximumAgeYearsInclusive: 95,
        requiresClinicalReviewOutsideRange: true
      },

      minimumAgeForAdultModel: 5,

      maximumAgeForAdultModel: 95,

      physicalProperties: {
        liquidDensityGperMl: 1.52,
        molecularWeightGperMol: 200.05,
        boilingPointCelsius: 58.6,
        vaporPressureAt20CmmHg: 157,
        bloodGasPartitionCoefficientApprox: 0.65
      },

      consumption: {
        molecularWeightGperMol: 200.05,
        liquidDensityGperMl: 1.52,

        approximateLiquidConsumptionFactor: 3.27,

        factorUnit:
          "mL سائل / (L غاز × vol%) لكل ساعة",

        formula:
          "mL/hr = FGF × dial% × MW × 60 / (2412 × density)",

        isApproximate: true
      },

      concentrations: {
        maxVaporizerDialPercent: 8.0,

        typicalEndTidalRangePercent: {
          min: 0.5,
          max: 3.0
        }
      },

      pediatricMac: {
        available: true,

        priorityOverAdultModel: true,

        requiresClinicalReview: true,

        ageGroups: [
          {
            label: "حديثو الولادة المكتملون: 0 إلى <1 شهر",

            minAgeYearsInclusive: 0,

            maxAgeYearsExclusive: 1 / 12,

            mac: 3.3,

            unit: "vol%",

            medium: "oxygen",

            requiresClinicalReview: true,

            note:
              "ينطبق على حديثي الولادة المكتملين. لم يتم تحديد الـ MAC للأطفال الخدج.",

            reference: {
              organization: "FDA / DailyMed",
              publication: "Sevoflurane Prescribing Information",
              section:
                "MAC Values for Adults and Pediatric Patients According to Age"
            }
          },

          {
            label: "الرضع: 1 إلى <6 أشهر",

            minAgeYearsInclusive: 1 / 12,

            maxAgeYearsExclusive: 0.5,

            mac: 3.0,

            unit: "vol%",

            medium: "oxygen",

            requiresClinicalReview: true,

            reference: {
              organization: "FDA / DailyMed",
              publication: "Sevoflurane Prescribing Information",
              section:
                "MAC Values for Adults and Pediatric Patients According to Age"
            }
          },

          {
            label: "الرضع والأطفال الصغار: 6 أشهر إلى <3 سنوات",

            minAgeYearsInclusive: 0.5,

            maxAgeYearsExclusive: 3.0,

            mac: 2.8,

            unit: "vol%",

            medium: "oxygen",

            requiresClinicalReview: true,

            reference: {
              organization: "FDA / DailyMed",
              publication: "Sevoflurane Prescribing Information",
              section:
                "MAC Values for Adults and Pediatric Patients According to Age"
            }
          },

          {
            label: "الأطفال: 3 إلى 12 سنة",

            minAgeYearsInclusive: 3.0,

            maxAgeYearsExclusive: 12.0,

            mac: 2.5,

            unit: "vol%",

            medium: "oxygen",

            requiresClinicalReview: true,

            reference: {
              organization: "FDA / DailyMed",
              publication: "Sevoflurane Prescribing Information",
              section:
                "MAC Values for Adults and Pediatric Patients According to Age"
            }
          }
        ]
      },

      clinicalNotes:
        "السيفوفلوران غير متهيج نسبياً للمجاري التنفسية ويستخدم شائعاً للتحريض الاستنشاقي وصيانة التخدير.",

      warnings: [
        "تجنب استخدام صودا لايم الجافة جداً لتقليل خطر التفاعلات أو ارتفاع الحرارة.",
        "قد يعاني الأطفال من ظاهرة هيجان أوذيان الإيقاظ (Emergence Agitation/Delirium).",
        "الـ MAC قياس إحصائي للمجموعات ولا يمثل هدفاً فردياً لعمق التخدير."
      ],

      references: {
        macSource: {
          authors: "Nickalls RWD, Mapleson WW",
          publication:
            "Age-related iso-MAC charts for isoflurane, sevoflurane and desflurane",
          journal: "British Journal of Anaesthesia",
          year: 2003,
          macAt40: 1.80
        },

        pediatricMac: {
          organization: "FDA / DailyMed",
          publication: "Sevoflurane Prescribing Information"
        }
      }
    },

    // =======================================================================
    // ISOFLURANE
    // =======================================================================

    isoflurane: {
      id: "isoflurane",

      name: "Isoflurane",

      arabicName: "إيزوفلوران",

      genericName: "Isoflurane",

      category: "Inhalational Volatile Anesthetic",

      macAt40: 1.17,

      macAt40Unit: "vol%",

      adultMacModel: {
        supported: true,
        minimumAgeYearsInclusive: 5,
        maximumAgeYearsInclusive: 95,
        requiresClinicalReviewOutsideRange: true
      },

      minimumAgeForAdultModel: 5,

      maximumAgeForAdultModel: 95,

      physicalProperties: {
        liquidDensityGperMl: 1.50,
        molecularWeightGperMol: 184.5,
        boilingPointCelsius: 48.5,
        vaporPressureAt20CmmHg: 238,
        bloodGasPartitionCoefficientApprox: 1.4
      },

      consumption: {
        molecularWeightGperMol: 184.5,
        liquidDensityGperMl: 1.50,

        approximateLiquidConsumptionFactor: 3.06,

        factorUnit:
          "mL سائل / (L غاز × vol%) لكل ساعة",

        formula:
          "mL/hr = FGF × dial% × MW × 60 / (2412 × density)",

        isApproximate: true
      },

      concentrations: {
        maxVaporizerDialPercent: 5.0,

        typicalEndTidalRangePercent: {
          min: 0.5,
          max: 2.0
        }
      },

      pediatricMac: {
        available: true,

        priorityOverAdultModel: true,

        requiresClinicalReview: true,

        ageGroups: [
          {
            label: "حديثو الولادة: 0 إلى <1 شهر",

            minAgeYearsInclusive: 0,

            maxAgeYearsExclusive: 1 / 12,

            mac: 1.60,

            unit: "vol%",

            requiresClinicalReview: true,

            reference: {
              authors: "Cameron CB, Robinson S, Gregory GA",
              publication:
                "The minimum anesthetic concentration of isoflurane in children",
              journal: "Anesthesia & Analgesia",
              year: 1984,
              volume: "63",
              issue: "4",
              pages: "418-420",
              pmid: "6703367"
            }
          },

          {
            label: "الرضع: 1 إلى <6 أشهر",

            minAgeYearsInclusive: 1 / 12,

            maxAgeYearsExclusive: 0.5,

            mac: 1.87,

            unit: "vol%",

            requiresClinicalReview: true,

            reference: {
              authors: "Cameron CB, Robinson S, Gregory GA",
              publication:
                "The minimum anesthetic concentration of isoflurane in children",
              journal: "Anesthesia & Analgesia",
              year: 1984,
              volume: "63",
              issue: "4",
              pages: "418-420",
              pmid: "6703367"
            }
          },

          {
            label: "الرضع: 6 إلى <12 شهر",

            minAgeYearsInclusive: 0.5,

            maxAgeYearsExclusive: 1.0,

            mac: 1.80,

            unit: "vol%",

            requiresClinicalReview: true,

            reference: {
              authors: "Cameron CB, Robinson S, Gregory GA",
              publication:
                "The minimum anesthetic concentration of isoflurane in children",
              journal: "Anesthesia & Analgesia",
              year: 1984,
              volume: "63",
              issue: "4",
              pages: "418-420",
              pmid: "6703367"
            }
          },

          {
            label: "الأطفال: 1 إلى <3 سنوات",

            minAgeYearsInclusive: 1.0,

            maxAgeYearsExclusive: 3.0,

            mac: 1.60,

            unit: "vol%",

            requiresClinicalReview: true,

            reference: {
              authors: "Cameron CB, Robinson S, Gregory GA",
              publication:
                "The minimum anesthetic concentration of isoflurane in children",
              journal: "Anesthesia & Analgesia",
              year: 1984,
              volume: "63",
              issue: "4",
              pages: "418-420",
              pmid: "6703367"
            }
          },

          {
            label: "الأطفال: 3 إلى <5 سنوات",

            minAgeYearsInclusive: 3.0,

            maxAgeYearsExclusive: 5.0,

            mac: 1.60,

            unit: "vol%",

            requiresClinicalReview: true,

            reference: {
              authors: "Cameron CB, Robinson S, Gregory GA",
              publication:
                "The minimum anesthetic concentration of isoflurane in children",
              journal: "Anesthesia & Analgesia",
              year: 1984,
              volume: "63",
              issue: "4",
              pages: "418-420",
              pmid: "6703367"
            }
          }
        ]
      },

      clinicalNotes:
        "الإيزوفلوران متهيج نسبياً للمجاري التنفسية وهو أقل ملاءمة للتحريض بالقناع الاستنشاقي مقارنة بالسيفوفلوران.",

      warnings: [
        "قد يحدث تهيج في المجرى الهوائي أثناء التحريض الاستنشاقي.",
        "يسبب الإيزوفلوران توسعاً وعائياً نظامياً اعتماداً على الجرعة وقد يخفض ضغط الدم الشرياني.",
        "الـ MAC ليس هدفاً فردياً لعمق التخدير."
      ],

      references: {
        macSource: {
          authors: "Nickalls RWD, Mapleson WW",
          publication:
            "Age-related iso-MAC charts for isoflurane, sevoflurane and desflurane",
          journal: "British Journal of Anaesthesia",
          year: 2003,
          macAt40: 1.17
        },

        pediatricMac: {
          authors: "Cameron CB, Robinson S, Gregory GA",
          publication:
            "The minimum anesthetic concentration of isoflurane in children",
          journal: "Anesthesia & Analgesia",
          year: 1984,
          volume: "63",
          issue: "4",
          pages: "418-420",
          pmid: "6703367"
        }
      }
    },

    // =======================================================================
    // DESFLURANE
    // =======================================================================

    desflurane: {
      id: "desflurane",

      name: "Desflurane",

      arabicName: "ديسفلوران",

      genericName: "Desflurane",

      category: "Inhalational Volatile Anesthetic",

      macAt40: 6.60,

      macAt40Unit: "vol%",

      adultMacModel: {
        supported: true,
        minimumAgeYearsInclusive: 5,
        maximumAgeYearsInclusive: 95,
        requiresClinicalReviewOutsideRange: true
      },

      minimumAgeForAdultModel: 5,

      maximumAgeForAdultModel: 95,

      physicalProperties: {
        liquidDensityGperMl: 1.46,
        molecularWeightGperMol: 168.04,
        boilingPointCelsius: 22.8,
        vaporPressureAt20CmmHg: 669,
        bloodGasPartitionCoefficientApprox: 0.42
      },

      consumption: {
        molecularWeightGperMol: 168.04,
        liquidDensityGperMl: 1.46,

        approximateLiquidConsumptionFactor: 2.86,

        factorUnit:
          "mL سائل / (L غاز × vol%) لكل ساعة",

        formula:
          "mL/hr = FGF × dial% × MW × 60 / (2412 × density)",

        isApproximate: true
      },

      concentrations: {
        maxVaporizerDialPercent: 18.0,

        typicalEndTidalRangePercent: {
          min: 3.0,
          max: 9.0
        }
      },

      pediatricMac: {
        available: false,

        priorityOverAdultModel: false,

        requiresClinicalReview: true,

        ageGroups: [],

        notes:
          "لا يوفر ملف البيانات جدول MAC للأطفال للديسفلوران. لا يتم تطبيق نموذج البالغين تلقائياً تحت سن 5 سنوات."
      },

      clinicalNotes:
        "يمتاز الديسفلوران بإنحلالية واطئة جداً في الدم ويسمح بتغيرات سريعة في تركيز التخدير. يتطلب مبخراً خاصاً مسخناً (Tec 6).",

      warnings: [
        "لا يُنصح به للتحريض بالقناع الاستنشاقي لدى الأطفال بسبب تهيج المجاري التنفسية والتشنج الحنجري.",
        "الزيادة السريعة في التركيز المستنشق قد تحفز الجهاز الودي (تسارع نبض وارتفاع ضغط الدم).",
        "لا تطبق نموذج البالغين تلقائياً للأطفال دون سن 5 سنوات.",
        "استخدم فقط المبخر المخصص للديسفلوران."
      ],

      references: {
        macSource: {
          authors: "Nickalls RWD, Mapleson WW",
          publication:
            "Age-related iso-MAC charts for isoflurane, sevoflurane and desflurane",
          journal: "British Journal of Anaesthesia",
          year: 2003,
          macAt40: 6.60
        }
      }
    }
  },

  // =========================================================================
  // 10. CALCULATOR POLICY
  // =========================================================================

  calculatorPolicy: {
    macSourcePriority: [
      "validated_pediatric_reference",
      "adult_age_adjusted_model",
      "requires_clinical_review"
    ],

    rules: [
      {
        id: "pediatric_priority",

        condition:
          "وجود مرجع MAC أطفال معتمد للغاز والعمر المحدد.",

        action:
          "استخدام مرجع الأطفال وعدم استخدام نموذج البالغين في الوقت نفسه."
      },

      {
        id: "adult_model",

        condition:
          "عدم وجود مرجع أطفال والعمر ضمن نطاق نموذج البالغين المدعوم.",

        action:
          "استخدام نموذج Nickalls & Mapleson للتعديل العمري."
      },

      {
        id: "outside_model_range",

        condition:
          "العمر خارج نطاق نموذج البالغين المدعوم.",

        action:
          "إرجاع طلب المراجعة السريرية (requiresClinicalReview)."
      },

      {
        id: "desflurane_pediatric",

        condition:
          "اختيار الديسفلوران وعمر المريض أقل من 5 سنوات.",

        action:
          "عدم حساب الـ MAC باستخدام نموذج البالغين."
      },

      {
        id: "mac_input",

        condition:
          "حساب نسبة الـ MAC للغاز الاستنشاقي.",

        action:
          "استخدام التركيز السنخي المقاس End-Tidal بدلاً من تركيز المبخر Dial."
      },

      {
        id: "consumption_input",

        condition:
          "حساب استهلاك السائل المتطاير.",

        action:
          "استخدام FGF وتركيز المبخر Dial مع معامل Dion الخاص بالغاز."
      }
    ]
  }
};
