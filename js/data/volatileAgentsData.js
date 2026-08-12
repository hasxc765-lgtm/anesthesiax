/**
 * Volatile Anesthetics Reference Data & Clinical Standards
 * AnesthesiaX — Phase 8.1.1
 * File: data/volatileAgentsData.js
 *
 * Architecture:
 * Pure Data ES Module.
 *
 * Contains:
 * - Volatile anesthetic reference data
 * - MAC reference values
 * - Pediatric MAC reference ranges
 * - Adult age-adjustment model metadata
 * - Vaporizer / liquid-consumption factors
 * - N2O interaction metadata
 * - Safety constraints
 *
 * Does NOT contain:
 * - Calculation functions
 * - UI logic
 * - DOM manipulation
 * - Patient-specific prescribing logic
 *
 * IMPORTANT:
 * This module is a clinical reference dataset for an educational
 * anesthesia calculator. It must not replace institutional protocols,
 * drug labeling, monitoring, or specialist clinical judgment.
 */

export const volatileAgentsData = {
  // =========================================================================
  // 1. METADATA & SCOPE
  // =========================================================================

  meta: {
    version: "8.1.1-data-master",
    moduleName: "volatileAgentsData",

    description:
      "Clinical reference data, physical properties, MAC reference values, vaporizer consumption factors, age-model metadata, and safety constraints for volatile anesthetic calculations.",

    lastAudited: "2026-08",

    supportedAgents: [
      "sevoflurane",
      "isoflurane",
      "desflurane"
    ],

    disclaimer:
      "MAC is a population-derived pharmacodynamic measure and is not a patient-specific anesthetic dose, guaranteed depth-of-anesthesia target, or substitute for clinical monitoring.",

    clinicalUseNotice:
      "All calculated values are estimates intended for educational and clinical-reference purposes. Always verify agent concentration, vaporizer settings, end-tidal concentration, patient age, physiologic status, and institutional protocols before clinical use."
  },

  // =========================================================================
  // 2. MAC SEMANTICS & CLINICAL DEFINITIONS
  // =========================================================================

  semantics: {
    definition:
      "Minimum Alveolar Concentration (MAC) is the alveolar concentration of a volatile anesthetic at 1 atmosphere that prevents gross purposeful movement in 50% of subjects exposed to a standardized surgical stimulus.",

    interpretation:
      "MAC is a population-derived measure of anesthetic potency. Individual anesthetic requirements vary with age, temperature, physiologic state, surgical stimulation, concurrent medications, and other clinical factors.",

    isNot: [
      "A patient-specific dosing prescription",
      "A compulsory anesthetic concentration target",
      "A guaranteed measure of anesthetic depth",
      "A substitute for clinical monitoring",
      "A substitute for end-tidal anesthetic monitoring",
      "A substitute for institutional anesthesia protocols"
    ],

    macFractionDefinition:
      "MAC fraction represents the measured end-tidal volatile anesthetic concentration divided by the age-appropriate MAC reference value.",

    additiveMacNotice:
      "When multiple anesthetic gases are used, MAC fractions may be considered additively for population-level estimation. This does not guarantee an individual patient's anesthetic depth."
  },

  // =========================================================================
  // 3. AGE-ADJUSTMENT MODEL
  // =========================================================================

  ageAdjustmentModel: {
    name: "Nickalls & Mapleson Age-Adjustment Model",

    type: "logarithmic_age_adjustment",

    formula:
      "MAC(age) = MAC40 × 10^(-0.00269 × (age - 40))",

    coefficient: -0.00269,

    referenceAgeYears: 40,

    /*
     * Important distinction:
     *
     * The mathematical relationship and the clinical iso-MAC charts
     * are not the same thing.
     *
     * Nickalls & Mapleson 2003 produced age-related iso-MAC charts
     * principally for clinical use across approximately 5–95 years.
     *
     * The calculator MUST NOT blindly extrapolate the adult model
     * into infants/neonates.
     */

    formulaEvidenceAgeRange: {
      minAgeYearsExclusive: 1,
      maxAgeYearsInclusive: 100,
      note:
        "The underlying age relationship includes human data above approximately 1 year, but this does not authorize unrestricted clinical extrapolation into infants."
    },

    clinicalChartAgeRange: {
      minAgeYearsInclusive: 5,
      maxAgeYearsInclusive: 95,
      note:
        "Nickalls & Mapleson 2003 age-related iso-MAC charts were designed principally for clinical use across approximately 5–95 years."
    },

    calculatorPolicy: {
      pediatricDataPriority: true,

      adultModelMinimumAgeYears: 5,

      adultModelMaximumAgeYears: 95,

      usePediatricReferenceWhenAvailable: true,

      doNotBlindlyExtrapolateToInfants: true,

      outsideSupportedRangeAction:
        "requiresClinicalReview"
    },

    limitations:
      "The adult age-adjustment model must not be used as an automatic substitute for validated pediatric MAC data. When a validated pediatric reference is available for the selected agent and age, the pediatric reference takes priority.",

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
    name: "Approximate Volatile Liquid Consumption Model",

    formula:
      "Liquid consumption (mL/hr) ≈ FGF (L/min) × dial concentration (%) × agent-specific consumption factor",

    inputFlowUnit: "L/min",

    concentrationUnit: "vol%",

    outputUnit: "mL/hr",

    /*
     * These are practical approximate factors used for estimating
     * liquid volatile-agent consumption.
     *
     * They are NOT universal physical constants and should not be
     * described as exact measurements of vaporizer consumption.
     */

    factorType: "agent_specific_approximation",

    factors: {
      sevoflurane: 3.3,
      isoflurane: 3.0,
      desflurane: 2.85
    },

    notes:
      "Actual liquid consumption varies with fresh gas flow, vaporizer performance, temperature, breathing system design, rebreathing, and other operating conditions. The factors are intended for estimation rather than direct measurement.",

    clinicalInterpretation:
      "The consumption calculation estimates liquid anesthetic usage from fresh gas flow and vaporizer dial concentration. It does not estimate patient uptake.",

    reference: {
      author: "Dion P",
      title: "Estimating volatile agent liquid consumption",
      journal: "Canadian Journal of Anaesthesia",
      year: 1992,
      volume: "39",
      issue: "7",
      pages: "756",
      doi: "10.1007/BF03008285"
    }
  },

  // =========================================================================
  // 5. LOW-FLOW ANESTHESIA
  // =========================================================================

  lowFlow: {
    enabled: true,

    thresholdLMin: 1.0,

    conventionalFlowThresholdLMin: 2.0,

    highFlowThresholdLMin: 4.0,

    calculationType:
      "theoretical_consumption_comparison",

    definition:
      "Low-flow anesthesia is commonly considered anesthesia using fresh gas flow below approximately 1 L/min, although terminology varies by source and anesthesia system.",

    disclaimer:
      "Low-flow anesthesia requires an anesthesia workstation and breathing system capable of safe low-flow operation, reliable oxygen concentration monitoring, effective CO2 absorbent, accurate vaporizer performance, continuous end-tidal agent monitoring, and appropriate clinical supervision.",

    safetyRequirements: [
      "Continuous inspired oxygen monitoring",
      "Continuous end-tidal CO2 monitoring",
      "Continuous end-tidal volatile-agent monitoring",
      "Effective CO2 absorbent",
      "Appropriate anesthesia machine leak performance",
      "Clinically appropriate fresh gas flow",
      "Appropriate patient monitoring"
    ],

    reference: {
      organization:
        "American Society of Anesthesiologists",
      publication:
        "Practice guidance and anesthesia workstation standards",
      requiresSourceVerification: true
    }
  },

  // =========================================================================
  // 6. NITROUS OXIDE (N2O)
  // =========================================================================

  nitrousOxide: {
    supported: true,

    id: "nitrous_oxide",

    name: "Nitrous Oxide (N₂O)",

    macAt40: 104.0,

    unit: "vol%",

    /*
     * If minimum FiO2 is constrained to 30%, N2O should not be allowed
     * above 70% in a simple O2/N2O mixture.
     *
     * The calculator should preferably validate actual FiO2 rather than
     * relying solely on N2O percentage.
     */

    maxInputPercent: 70.0,

    minimumFiO2Required: 0.30,

    interactionModel: "additive_mac_fraction",

    fixedReductionFactor: null,

    requiresClinicalReview: true,

    calculatorPolicy: {
      validateMinimumFiO2: true,

      doNotAssumeFiO2FromN2OAlone: true,

      additiveMacFraction:
        "N2O contribution may be estimated as measured N2O concentration divided by the single fixed N2O MAC reference value (104%). No age-adjusted or age-specific N2O MAC table exists in this dataset."
    },

    disclaimer:
      "N₂O may contribute additively to the overall MAC fraction. The calculated combined MAC fraction is a population-level estimate and does not guarantee an individual patient's anesthetic depth. The 104% reference value is a single fixed constant, not an age-adjusted value.",

    reference: {
      authors: "Hornbein TF, Eger EI 2nd, Winter PM, Smith G, Wetstone D, Smith KH",
      title: "The minimum alveolar concentration of nitrous oxide in man",
      journal: "Anesthesia & Analgesia",
      year: 1982,
      volume: "61",
      pages: "553-556",
      pmid: "7201254",
      note:
        "This reference applies specifically to the nitrous oxide MAC value (104%). It is unrelated to the Nickalls & Mapleson isoflurane/sevoflurane/desflurane age-adjustment model referenced elsewhere in this file."
    }
  },

  // =========================================================================
  // 7. OPIOIDS & ADJUNCTS
  // =========================================================================

  opioidInteraction: {
    supported: true,

    fixedReductionPercent: null,

    model: "qualitative_only",

    requiresClinicalReview: true,

    clinicalNotice:
      "Opioids and other anesthetic adjuncts can reduce volatile anesthetic requirements. The magnitude of MAC reduction varies with drug, dose, concentration, timing, patient age, physiologic state, and surgical stimulation.",

    calculatorPolicy: {
      doNotApplyFixedPercentageReduction: true,

      displayQualitativeWarning: true,

      recommendedMessage:
        "Concurrent opioids or sedative adjuncts may reduce volatile anesthetic requirements. No fixed numerical reduction is applied."
    }
  },

  // =========================================================================
  // 8. GLOBAL INPUT SAFETY CONSTRAINTS
  // =========================================================================

  constraints: {
    ageYears: {
      minInclusive: 0,
      maxInclusive: 120,
      reason:
        "Input sanity boundary only; this is not the validated age range of every MAC model."
    },

    fgfLmin: {
      minInclusive: 0.1,
      maxInclusive: 15.0,
      reason:
        "Plausibility limits for fresh gas flow input."
    },

    dialPercent: {
      minInclusive: 0.0,
      maxInclusive: 18.0,
      reason:
        "Global sanity boundary. Agent-specific maximum dial settings must also be enforced."
    },

    endTidalPercent: {
      minInclusive: 0.0,
      maxInclusive: 18.0,
      reason:
        "Global sanity boundary. Agent-specific plausible concentration ranges should also be considered."
    },

    n2oPercent: {
      minInclusive: 0.0,
      maxInclusive: 70.0,
      reason:
        "Keeps a simple O2/N2O mixture at or above approximately 30% oxygen. Actual FiO2 should be validated whenever possible."
    }
  },

  // =========================================================================
  // 9. SUPPORTED VOLATILE AGENTS
  // =========================================================================

  agents: {

    // =======================================================================
    // SEVOFLURANE
    // =======================================================================

    sevoflurane: {
      id: "sevoflurane",

      name: "Sevoflurane",

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
        approximateLiquidConsumptionFactor: 3.3,

        factorUnit:
          "mL liquid / (L gas × vol% concentration) normalized to hourly consumption formula",

        formula:
          "mL/hr ≈ FGF (L/min) × dial (%) × 3.3",

        isApproximate: true
      },

      concentrations: {
        maxVaporizerDialPercent: 8.0,

        typicalEndTidalRangePercent: {
          min: 1.0,
          max: 3.0
        }
      },

      pediatricMac: {
        available: true,

        priorityOverAdultModel: true,

        requiresClinicalReview: true,

        notes:
          "Pediatric MAC varies substantially with age. Pediatric reference values should take priority over the adult age-adjustment model whenever a validated age band is available. Values below are the concentrations in oxygen reported in the FDA/DailyMed Sevoflurane Prescribing Information age table.",

        ageGroups: [
          {
            label: "Term neonates / newborns: 0 to <1 month",

            minAgeYearsInclusive: 0,

            maxAgeYearsExclusive: 0.0833,

            mac: 3.3,

            unit: "vol%",

            medium: "oxygen",

            requiresClinicalReview: true,

            reference: {
              organization: "FDA / DailyMed",
              publication: "Sevoflurane Prescribing Information",
              section: "MAC Values for Adults and Pediatric Patients According to Age",
              note: "MAC in premature infants has not been determined."
            }
          },

          {
            label: "Infants: 1 to <6 months",

            minAgeYearsInclusive: 0.0833,

            maxAgeYearsExclusive: 0.5,

            mac: 3.0,

            unit: "vol%",

            medium: "oxygen",

            requiresClinicalReview: true,

            reference: {
              organization: "FDA / DailyMed",
              publication: "Sevoflurane Prescribing Information",
              section: "MAC Values for Adults and Pediatric Patients According to Age"
            }
          },

          {
            label: "Infants and young children: 6 months to <3 years",

            minAgeYearsInclusive: 0.5,

            maxAgeYearsExclusive: 3.0,

            mac: 2.8,

            unit: "vol%",

            medium: "oxygen",

            requiresClinicalReview: true,

            reference: {
              organization: "FDA / DailyMed",
              publication: "Sevoflurane Prescribing Information",
              section: "MAC Values for Adults and Pediatric Patients According to Age"
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
              section: "MAC Values for Adults and Pediatric Patients According to Age"
            }
          }
        ]
      },

      clinicalNotes:
        "Sevoflurane has low airway pungency and is commonly used for inhalational induction and maintenance of general anesthesia.",

      warnings: [
        "Avoid use with strongly desiccated CO2 absorbents because of the risk of degradation products and excessive absorbent temperature.",
        "Monitor for emergence agitation/delirium, particularly in pediatric patients.",
        "MAC values are population-derived and should not be interpreted as an individual anesthetic target."
      ],

      references: {
        macSource: {
          organization: "Nickalls & Mapleson",
          publication:
            "Age-related iso-MAC charts for isoflurane, sevoflurane and desflurane",
          journal: "British Journal of Anaesthesia",
          year: 2003,
          macAt40: 1.80
        },

        pediatricMac: {
          organization: "FDA / DailyMed",
          publication: "Sevoflurane Prescribing Information",
          section: "MAC Values for Adults and Pediatric Patients According to Age"
        }
      }
    },

    // =======================================================================
    // ISOFLURANE
    // =======================================================================

    isoflurane: {
      id: "isoflurane",

      name: "Isoflurane",

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
        approximateLiquidConsumptionFactor: 3.0,

        factorUnit:
          "mL liquid / (L gas × vol% concentration) normalized to hourly consumption formula",

        formula:
          "mL/hr ≈ FGF (L/min) × dial (%) × 3.0",

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

        notes:
          "Isoflurane MAC in infants and young children was determined by Cameron, Robinson & Gregory (1984) across five pediatric age bands. MAC was lowest in neonates, peaked in the 1–6 month range, and settled at 1.6% from 1 year through 5 years — still higher than the adult MAC40 reference of 1.17%. Pediatric reference values take priority over adult-model calculations across this entire range.",

        ageGroups: [
          {
            label: "Neonates: 0 to <1 month",

            minAgeYearsInclusive: 0,

            maxAgeYearsExclusive: 0.0833,

            mac: 1.6,

            unit: "vol%",

            requiresClinicalReview: true,

            reference: {
              authors: "Cameron CB, Robinson S, Gregory GA",
              publication: "The minimum anesthetic concentration of isoflurane in children",
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

            minAgeYearsInclusive: 0.0833,

            maxAgeYearsExclusive: 0.5,

            mac: 1.87,

            unit: "vol%",

            requiresClinicalReview: true,

            reference: {
              authors: "Cameron CB, Robinson S, Gregory GA",
              publication: "The minimum anesthetic concentration of isoflurane in children",
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

            mac: 1.8,

            unit: "vol%",

            requiresClinicalReview: true,

            reference: {
              authors: "Cameron CB, Robinson S, Gregory GA",
              publication: "The minimum anesthetic concentration of isoflurane in children",
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

            mac: 1.6,

            unit: "vol%",

            requiresClinicalReview: true,

            reference: {
              authors: "Cameron CB, Robinson S, Gregory GA",
              publication: "The minimum anesthetic concentration of isoflurane in children",
              journal: "Anesthesia & Analgesia",
              year: 1984,
              volume: "63",
              issue: "4",
              pages: "418-420",
              pmid: "6703367"
            }
          },

          {
            label: "Children: 3 to 5 years",

            minAgeYearsInclusive: 3.0,

            maxAgeYearsExclusive: 5.0,

            mac: 1.6,

            unit: "vol%",

            requiresClinicalReview: true,

            reference: {
              authors: "Cameron CB, Robinson S, Gregory GA",
              publication: "The minimum anesthetic concentration of isoflurane in children",
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
        "Produces dose-dependent systemic vasodilation and reduction in arterial blood pressure.",
        "MAC values should not be interpreted as individual anesthetic depth targets."
      ],

      references: {
        macSource: {
          organization: "Nickalls & Mapleson",
          publication:
            "Age-related iso-MAC charts for isoflurane, sevoflurane and desflurane",
          journal: "British Journal of Anaesthesia",
          year: 2003,
          macAt40: 1.17
        },

        pediatricMac: {
          authors: "Cameron CB, Robinson S, Gregory GA",
          publication: "The minimum anesthetic concentration of isoflurane in children",
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
        approximateLiquidConsumptionFactor: 2.85,

        factorUnit:
          "mL liquid / (L gas × vol% concentration) normalized to hourly consumption formula",

        formula:
          "mL/hr ≈ FGF (L/min) × dial (%) × 2.85",

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
        /*
         * Deliberately not used as a general pediatric calculator table.
         *
         * Desflurane is not appropriate for routine inhalational induction
         * in pediatric patients because of airway irritation/reactivity.
         *
         * If a future validated pediatric maintenance dataset is added,
         * it should be independently sourced and explicitly age-bounded.
         */

        available: false,

        priorityOverAdultModel: false,

        requiresClinicalReview: true,

        notes:
          "No general pediatric MAC table is enabled in this dataset. The calculator must not use the adult age-adjustment model below 5 years.",

        ageGroups: []
      },

      clinicalNotes:
        "Desflurane has very low blood-gas solubility and therefore allows rapid changes in anesthetic concentration. It requires a dedicated heated vaporizer because of its low boiling point.",

      warnings: [
        "Not recommended for routine inhalational mask induction in pediatric patients because of airway irritation and increased risk of coughing, breath-holding, laryngospasm, and secretions.",
        "Rapid increases in inspired concentration may produce sympathetic stimulation including tachycardia and hypertension.",
        "Adult age-adjustment model must not be automatically extrapolated to children younger than 5 years.",
        "Requires a vaporizer specifically designed for desflurane."
      ],

      references: {
        macSource: {
          organization: "Nickalls & Mapleson",
          publication:
            "Age-related iso-MAC charts for isoflurane, sevoflurane and desflurane",
          journal: "British Journal of Anaesthesia",
          year: 2003,
          macAt40: 6.60
        },

        productSource: {
          organization: "FDA / DailyMed",
          publication:
            "Desflurane prescribing information"
        }
      }
    }
  },

  // =========================================================================
  // 10. CALCULATOR DECISION POLICY
  // =========================================================================

  calculatorPolicy: {
    /*
     * This section intentionally contains policy metadata only.
     * Actual implementation belongs in vaporizerCalculator.js.
     */

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
          "Use pediatric MAC reference and do not simultaneously use the adult age-adjustment model."
      },

      {
        id: "adult_model",

        condition:
          "No pediatric reference is available AND patient age is within the agent's validated adult-model range.",

        action:
          "Use the Nickalls & Mapleson age-adjustment model."
      },

      {
        id: "outside_model_range",

        condition:
          "Patient age is outside the validated model range.",

        action:
          "Do not silently extrapolate. Return requiresClinicalReview."
      },

      {
        id: "desflurane_pediatric",

        condition:
          "Desflurane selected and patient age is below 5 years.",

        action:
          "Do not calculate MAC using the adult model. Return requiresClinicalReview."
      },

      {
        id: "mac_input",

        condition:
          "Calculating MAC fraction.",

        action:
          "Use measured end-tidal volatile concentration rather than vaporizer dial concentration."
      },

      {
        id: "consumption_input",

        condition:
          "Calculating liquid volatile-agent consumption.",

        action:
          "Use FGF and vaporizer dial concentration with the selected agent's approximate consumption factor."
      }
    ]
  }
};
