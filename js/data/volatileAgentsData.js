/**
 * Volatile Anesthetics Reference Data & Clinical Standards
 *
 * AnesthesiaX — Phase 8.2
 * File: js/data/volatileAgentsData.js
 *
 * Architecture:
 * Pure Data ES Module.
 *
 * IMPORTANT:
 * - No calculation functions.
 * - No DOM/UI logic.
 * - No patient-specific prescribing logic.
 * - Clinical reference dataset only.
 */

export const volatileAgentsData = {
  // =========================================================================
  // 1. METADATA
  // =========================================================================

  meta: {
    version: "8.2.0-data-master",
    moduleName: "volatileAgentsData",

    description:
      "Clinical reference data for volatile anesthetics, MAC values, pediatric references, age-adjustment metadata, vaporizer consumption estimation, and safety constraints.",

    lastAudited: "2026-08",

    supportedAgents: [
      "sevoflurane",
      "isoflurane",
      "desflurane"
    ],

    disclaimer:
      "MAC is a population-derived pharmacodynamic measure. It is not a patient-specific anesthetic dose, guaranteed anesthetic-depth target, or substitute for clinical monitoring.",

    clinicalUseNotice:
      "All calculated values are estimates. Verify agent concentration, vaporizer settings, measured end-tidal concentration, oxygen concentration, patient age, physiologic status, equipment performance, and institutional protocols before clinical use."
  },

  // =========================================================================
  // 2. MAC SEMANTICS
  // =========================================================================

  semantics: {
    definition:
      "Minimum Alveolar Concentration (MAC) is the alveolar concentration of a volatile anesthetic at one atmosphere that prevents gross purposeful movement in 50% of subjects exposed to a standardized surgical stimulus.",

    interpretation:
      "MAC is population-derived and varies with age, temperature, physiologic state, concurrent medications, and other clinical factors.",

    macFractionDefinition:
      "MAC fraction = measured end-tidal anesthetic concentration divided by the applicable MAC reference concentration.",

    isNot: [
      "A patient-specific dosing prescription",
      "A guaranteed measure of anesthetic depth",
      "A mandatory concentration target",
      "A substitute for clinical monitoring",
      "A substitute for end-tidal anesthetic monitoring",
      "A substitute for institutional protocols"
    ],

    additiveMacNotice:
      "MAC fractions of inhaled anesthetic agents may be considered additive for population-level estimation. This does not guarantee an individual patient's anesthetic depth."
  },

  // =========================================================================
  // 3. AGE ADJUSTMENT MODEL
  // =========================================================================

  ageAdjustmentModel: {
    name: "Nickalls & Mapleson Age-Adjustment Model",

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
      "The adult age-adjustment model must not be automatically extrapolated into unsupported pediatric age ranges. When a validated pediatric reference exists, that reference takes priority.",

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
    name: "Dion Volatile Agent Consumption Approximation",

    formula:
      "Liquid consumption (mL/hr) = FGF (L/min) × dial concentration (%) × molecular weight × 60 / (2412 × liquid density)",

    inputFlowUnit: "L/min",

    concentrationUnit: "vol%",

    outputUnit: "mL/hr",

    conversionConstant: 2412,

    factorType: "Dion_equation_derived",

    notes:
      "This estimates delivered vaporizer output converted to liquid volume. It does not estimate patient uptake, circuit losses, leaks, or actual vaporizer bottle weight change.",

    clinicalInterpretation:
      "Consumption is an estimate based on fresh gas flow and vaporizer dial concentration. Actual consumption can differ because of equipment characteristics, temperature, leaks, rebreathing, and other operating conditions.",

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
      "Low-flow anesthesia generally refers to fresh gas flow below approximately 1 L/min, although terminology varies by source and anesthesia system.",

    safetyRequirements: [
      "Continuous inspired oxygen monitoring",
      "Continuous end-tidal CO2 monitoring",
      "Continuous end-tidal volatile-agent monitoring",
      "Effective CO2 absorbent",
      "Appropriate anesthesia machine leak performance",
      "Reliable vaporizer performance",
      "Appropriate patient monitoring"
    ],

    disclaimer:
      "Low-flow anesthesia requires an anesthesia workstation and breathing system capable of safe low-flow operation and appropriate monitoring."
  },

  // =========================================================================
  // 6. NITROUS OXIDE
  // =========================================================================

  nitrousOxide: {
    supported: true,

    id: "nitrous_oxide",

    name: "Nitrous Oxide (N₂O)",

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
        "N₂O percentage alone does not establish actual FiO₂ when other gases or volatile agents are present."
    },

    disclaimer:
      "The N₂O MAC reference is population-derived. Actual oxygen concentration must be monitored clinically. A simple N₂O ceiling must not be interpreted as proof of adequate FiO₂.",

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
      "Opioids and other anesthetic adjuncts may reduce volatile anesthetic requirements. The magnitude varies with drug, dose, timing, patient factors, and surgical stimulation. No fixed numerical reduction is applied."
  },

  // =========================================================================
  // 8. GLOBAL CONSTRAINTS
  // =========================================================================

  constraints: {
    ageYears: {
      minInclusive: 0,
      maxInclusive: 120,
      reason:
        "Input sanity boundary only. It is not the validated range of every MAC model."
    },

    fgfLmin: {
      minInclusive: 0.1,
      maxInclusive: 15.0,
      reason:
        "Input plausibility boundary for fresh gas flow."
    },

    dialPercent: {
      minInclusive: 0,
      maxInclusive: 18,
      reason:
        "Global sanity boundary. Agent-specific vaporizer limits are enforced separately."
    },

    endTidalPercent: {
      minInclusive: 0,
      maxInclusive: 18,
      reason:
        "Global sanity boundary. Agent-specific limits should also be considered."
    },

    n2oPercent: {
      minInclusive: 0,
      maxInclusive: 70,
      reason:
        "Simplified upper boundary for this educational calculator. Actual FiO2 must be monitored clinically."
    },

    durationHours: {
      minInclusive: 0.01,
      maxInclusive: 24,
      reason:
        "Practical calculator input boundary."
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
          "mL liquid / (L gas × vol%) per hour",

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
            label: "Term neonates: 0 to <1 month",

            minAgeYearsInclusive: 0,

            maxAgeYearsExclusive: 1 / 12,

            mac: 3.3,

            unit: "vol%",

            medium: "oxygen",

            requiresClinicalReview: true,

            note:
              "Applies to full-term neonates. MAC in premature infants has not been determined.",

            reference: {
              organization: "FDA / DailyMed",
              publication: "Sevoflurane Prescribing Information",
              section:
                "MAC Values for Adults and Pediatric Patients According to Age"
            }
          },

          {
            label: "Infants: 1 to <6 months",

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
            label: "Infants/young children: 6 months to <3 years",

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
            label: "Children: 3 to 12 years",

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
        "Sevoflurane is relatively nonpungent and is commonly used for inhalational induction and maintenance.",

      warnings: [
        "Avoid strongly desiccated CO₂ absorbents.",
        "Pediatric patients may have emergence agitation/delirium.",
        "MAC is a population-derived measure and is not an individual anesthetic-depth target."
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
          "mL liquid / (L gas × vol%) per hour",

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
            label: "Neonates: 0 to <1 month",

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
            label: "Infants: 1 to <6 months",

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
            label: "Infants: 6 to <12 months",

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
            label: "Children: 1 to <3 years",

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
            label: "Children: 3 to <5 years",

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
        "Isoflurane is relatively pungent and is generally less suitable for inhalational mask induction than sevoflurane.",

      warnings: [
        "Airway irritation may occur during inhalational induction.",
        "Isoflurane causes dose-dependent vasodilation and may reduce arterial blood pressure.",
        "MAC is not an individual anesthetic-depth target."
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
          "mL liquid / (L gas × vol%) per hour",

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
          "This dataset does not provide a general pediatric MAC table for desflurane. The adult model is not automatically applied below 5 years."
      },

      clinicalNotes:
        "Desflurane has very low blood-gas solubility and permits rapid changes in anesthetic concentration. It requires a dedicated vaporizer.",

      warnings: [
        "Not recommended for routine inhalational mask induction in pediatric patients because of airway irritation/reactivity.",
        "Rapid increases in inspired concentration may produce sympathetic stimulation.",
        "Do not automatically extrapolate the adult model below 5 years.",
        "Use only a vaporizer designed for desflurane."
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
          "A validated pediatric MAC reference exists for the selected agent and patient age.",

        action:
          "Use the pediatric reference and do not simultaneously use the adult model."
      },

      {
        id: "adult_model",

        condition:
          "No pediatric reference applies and age is within the supported adult model range.",

        action:
          "Use the Nickalls & Mapleson age-adjustment model."
      },

      {
        id: "outside_model_range",

        condition:
          "Age is outside the supported adult model range.",

        action:
          "Do not silently extrapolate. Return requiresClinicalReview."
      },

      {
        id: "desflurane_pediatric",

        condition:
          "Desflurane selected and patient age is below 5 years.",

        action:
          "Do not calculate MAC using the adult model."
      },

      {
        id: "mac_input",

        condition:
          "Calculating volatile anesthetic MAC fraction.",

        action:
          "Use measured end-tidal concentration rather than vaporizer dial setting."
      },

      {
        id: "consumption_input",

        condition:
          "Calculating liquid anesthetic consumption.",

        action:
          "Use FGF and vaporizer dial concentration with the Dion-derived agent-specific factor."
      }
    ]
  }
};
