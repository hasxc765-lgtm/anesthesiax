/**
 * Pediatric Clinical Reference Data & Safety Limits
 * AnesthesiaX — Phase 7.1
 * Version: 7.1-final-audited
 *
 * Standards & Primary References:
 * - AHA/AAP Pediatric Advanced Life Support (PALS 2025/2026)
 * - AAP Clinical Practice Guideline: Maintenance IV Fluids in Children
 * - Pediatric Anesthesia & Emergency Medicine Reference Standards
 */

export const pedsData = {
  // =========================================================================
  // 1. METADATA & SCOPE
  // =========================================================================
  meta: {
    version: "7.1-final-audited",
    resuscitationGuideline: "AHA/AAP PALS 2025/2026",

    patientScope: {
      supportedPopulations: [
        "premature",
        "neonate",
        "infant",
        "child",
        "adolescent"
      ],

      pediatricAgeRangeYears: {
        minInclusive: 0,
        maxInclusive: 18
      },

      neonatalDisclaimer:
        "For delivery-room and immediate newborn resuscitation (<24 hours), use Neonatal Resuscitation Program (NRP) protocols rather than this pediatric reference alone."
    },

    safetyPolicy: {
      highAlertDrugVerificationRequired: true,
      concentrationVerificationRequired: true,
      independentDoseCheckRecommended: true,

      defaultClinicalWarning:
        "Calculated dose is a reference estimate and must be verified against the patient's indication, age, weight, concentration, organ function, and local clinical protocol before administration."
    }
  },

  // =========================================================================
  // 2. AIRWAY / ETT RULES
  // =========================================================================
  airwayRules: {
    neonatalInfantRanges: [
      {
        minWeightKgInclusive: 0.0,
        maxWeightKgExclusive: 1.0,
        uncuffedSizeMm: 2.5,
        cuffedSizeMm: null,
        estimatedOralDepthCm: 6.5,
        oralDepthRangeMinCm: 6.0,
        oralDepthRangeMaxCm: 7.0,
        estimatedNasalDepthCm: 8.0,
        nasalDepthRangeMinCm: 7.5,
        nasalDepthRangeMaxCm: 8.5,
        blade: "Miller 00 / 0"
      },
      {
        minWeightKgInclusive: 1.0,
        maxWeightKgExclusive: 2.0,
        uncuffedSizeMm: 3.0,
        cuffedSizeMm: 2.5,
        estimatedOralDepthCm: 7.5,
        oralDepthRangeMinCm: 7.0,
        oralDepthRangeMaxCm: 8.0,
        estimatedNasalDepthCm: 9.0,
        nasalDepthRangeMinCm: 8.5,
        nasalDepthRangeMaxCm: 9.5,
        blade: "Miller 0"
      },
      {
        minWeightKgInclusive: 2.0,
        maxWeightKgExclusive: 3.5,
        uncuffedSizeMm: 3.5,
        cuffedSizeMm: 3.0,
        estimatedOralDepthCm: 8.5,
        oralDepthRangeMinCm: 8.0,
        oralDepthRangeMaxCm: 9.0,
        estimatedNasalDepthCm: 10.0,
        nasalDepthRangeMinCm: 9.5,
        nasalDepthRangeMaxCm: 10.5,
        blade: "Miller 1"
      },
      {
        minWeightKgInclusive: 3.5,
        maxWeightKgInclusive: 15.0, // Expanded to avoid gap with age-based formula
        uncuffedSizeMm: 3.5,
        cuffedSizeMm: 3.0,
        estimatedOralDepthCm: 9.5,
        oralDepthRangeMinCm: 9.0,
        oralDepthRangeMaxCm: 10.5,
        estimatedNasalDepthCm: 11.2,
        nasalDepthRangeMinCm: 10.5,
        nasalDepthRangeMaxCm: 12.0,
        blade: "Miller 1"
      }
    ],

    childFormulas: {
      minAgeYearsInclusive: 1.0,
      uncuffedFormula: "(Age / 4) + 4",
      cuffedFormula: "(Age / 4) + 3.5",
      oralDepthFormula: "(Age / 2) + 12",
      nasalDepthFormula: "(Age / 2) + 15",
      backupSizes: {
        smallerMm: -0.5,
        largerMm: 0.5
      }
    },

    clinicalWarnings: {
      sizeWarning:
        "ETT size formulas are estimates only. Prepare one size smaller and one size larger.",
      depthWarning:
        "ETT depth is an initial estimate. Confirm placement using continuous waveform capnography and bilateral breath sounds assessment.",
      cuffPressureWarning:
        "For cuffed ETTs, monitor cuff pressure and maintain < 20 cmH2O.",
      neonatalWarning:
        "Neonatal airway management requires gestational-age and clinical-context-specific assessment."
    }
  },

  // =========================================================================
  // 3. EMERGENCY DRUGS (17 INDICATION-SPECIFIC SCHEMAS)
  // =========================================================================
  emergencyDrugs: [
    // -----------------------------------------------------------------------
    // 1. EPINEPHRINE
    // -----------------------------------------------------------------------
    {
      id: "epinephrine",
      name: "Epinephrine (Adrenaline)",
      arabicName: "إبينفرين / أدرينالين",
      category: "Resuscitation / Vasopressor",
      isHighAlert: true,

      indications: [
        {
          id: "cardiac_arrest",
          title: "توقف القلب — Cardiac Arrest",
          context: "cardiac_arrest",
          route: "IV / IO",
          doseType: "fixed_mg_kg",
          doseValue: 0.01,
          doseUnit: "mg/kg",
          concentration: {
            label: "0.1 mg/mL (1:10,000)",
            mgPerMl: 0.1,
            ratioLabel: "1:10,000"
          },
          maxSingleDoseMg: 1.0,
          repeatIntervalMinutes: { min: 3, max: 5 },
          warnings: [
            "Use the 0.1 mg/mL concentration for IV/IO cardiac-arrest dosing.",
            "Do not confuse 0.1 mg/mL with 1 mg/mL."
          ],
          requiresClinicalReview: true,
          reference: {
            organization: "AHA/AAP",
            guideline: "Pediatric Advanced Life Support",
            section: "Pediatric Cardiac Arrest"
          }
        },
        {
          id: "anaphylaxis",
          title: "التأق — Anaphylaxis",
          context: "anaphylaxis",
          route: "IM — Anterolateral Thigh",
          doseType: "fixed_mg_kg",
          doseValue: 0.01,
          doseUnit: "mg/kg",
          concentration: {
            label: "1 mg/mL (1:1,000)",
            mgPerMl: 1.0,
            ratioLabel: "1:1,000"
          },
          maxSingleDoseRules: [
            { maxAgeYearsInclusive: 12.0, maxDoseMg: 0.3 },
            { minAgeYearsExclusive: 12.0, maxDoseMg: 0.5 }
          ],
          repeatIntervalMinutes: { min: 5, max: 15 },
          warnings: [
            "IM epinephrine is first-line treatment for anaphylaxis.",
            "Do not administer 1 mg/mL epinephrine as an IV push for routine anaphylaxis treatment."
          ],
          requiresClinicalReview: true,
          reference: {
            organization: "AAAAI / PALS",
            guideline: "Anaphylaxis Practice Parameter",
            section: "Epinephrine Treatment"
          }
        },
        {
          id: "croup",
          title: "الخناق — Croup",
          context: "airway_edema",
          route: "Nebulized",
          doseType: "fixed_ml_kg",
          doseValue: 0.5,
          doseUnit: "mL/kg",
          concentration: {
            label: "Epinephrine 1 mg/mL (1:1,000)",
            mgPerMl: 1.0,
            ratioLabel: "1:1,000"
          },
          maxSingleVolumeMl: 5.0,
          warnings: [
            "Observe for recurrence of airway obstruction after treatment.",
            "Monitor cardiovascular status in severe cases."
          ],
          requiresClinicalReview: true,
          reference: {
            organization: "AAP",
            guideline: "Croup Management",
            section: "Nebulized Epinephrine"
          }
        }
      ]
    },

    // -----------------------------------------------------------------------
    // 2. ATROPINE
    // -----------------------------------------------------------------------
    {
      id: "atropine",
      name: "Atropine Sulfate",
      arabicName: "أتروبين",
      category: "Anticholinergic",
      isHighAlert: true,

      indications: [
        {
          id: "bradycardia",
          title: "بطء القلب العرضي — Symptomatic Bradycardia",
          context: "bradycardia",
          route: "IV / IO",
          doseType: "fixed_mg_kg",
          doseValue: 0.02,
          doseUnit: "mg/kg",
          concentrationOptions: [
            { label: "0.1 mg/mL", mgPerMl: 0.1 },
            { label: "0.5 mg/mL", mgPerMl: 0.5 }
          ],
          minSingleDoseMg: 0.1,
          maxSingleDoseRules: [
            { maxAgeYearsInclusive: 12.0, maxDoseMg: 0.5 },
            { minAgeYearsExclusive: 12.0, maxDoseMg: 1.0 }
          ],
          repeatCount: 1,
          warnings: [
            "Minimum dose of 0.1 mg enforced in bradycardia to prevent paradoxical worsening.",
            "Do not allow concentration-selection errors."
          ],
          requiresClinicalReview: true,
          reference: {
            organization: "AHA/AAP",
            guideline: "Pediatric Advanced Life Support",
            section: "Pediatric Bradycardia"
          }
        },
        {
          id: "pre_intubation",
          title: "التحضير للتنبيب — Pre-intubation Anticholinergic Use",
          context: "premedication",
          route: "IV",
          doseType: "fixed_mg_kg",
          doseValue: 0.02,
          doseUnit: "mg/kg",
          concentrationOptions: [
            { label: "0.1 mg/mL", mgPerMl: 0.1 },
            { label: "0.5 mg/mL", mgPerMl: 0.5 }
          ],
          minSingleDoseMg: null,
          maxSingleDoseRules: [
            { maxAgeYearsInclusive: 12.0, maxDoseMg: 0.5 },
            { minAgeYearsExclusive: 12.0, maxDoseMg: 1.0 }
          ],
          warnings: [
            "Routine atropine premedication for pediatric intubation should follow local airway protocol.",
            "Do not automatically apply the bradycardia minimum dose to this indication."
          ],
          requiresClinicalReview: true,
          reference: {
            organization: "Pediatric Airway Practice",
            guideline: "Institutional Pediatric Airway Protocol",
            section: "Premedication"
          }
        }
      ]
    },

    // -----------------------------------------------------------------------
    // 3. AMIODARONE
    // -----------------------------------------------------------------------
    {
      id: "amiodarone",
      name: "Amiodarone",
      arabicName: "أميودارون",
      category: "Antiarrhythmic",
      isHighAlert: true,

      indications: [
        {
          id: "refractory_vf_vt",
          title: "VF / Pulseless VT مقاوم للصدمات",
          context: "cardiac_arrest",
          route: "IV / IO",
          doseType: "fixed_mg_kg",
          doseValue: 5.0,
          doseUnit: "mg/kg",
          concentration: { label: "50 mg/mL", mgPerMl: 50.0 },
          maxInitialDoseMg: 300.0,
          repeatDoseValue: 5.0,
          repeatDoseUnit: "mg/kg",
          maxRepeatDoseMg: 150.0,
          warnings: [
            "Used for shock-refractory VF/pulseless VT according to pediatric resuscitation algorithms.",
            "Administration speed differs between cardiac arrest and non-arrest infusion."
          ],
          requiresClinicalReview: true,
          reference: {
            organization: "AHA/AAP",
            guideline: "Pediatric Advanced Life Support",
            section: "Shock-Refractory VF/pVT"
          }
        }
      ]
    },

    // -----------------------------------------------------------------------
    // 4. ADENOSINE
    // -----------------------------------------------------------------------
    {
      id: "adenosine",
      name: "Adenosine",
      arabicName: "أدينوسين",
      category: "Antiarrhythmic",
      isHighAlert: true,

      indications: [
        {
          id: "svt_first_dose",
          title: "SVT — الجرعة الأولى",
          context: "arrhythmia",
          sequenceStage: 1,
          route: "Rapid IV / IO Push",
          doseType: "fixed_mg_kg",
          doseValue: 0.1,
          doseUnit: "mg/kg",
          concentration: { label: "3 mg/mL", mgPerMl: 3.0 },
          maxSingleDoseMg: 6.0,
          warnings: [
            "Administer as a rapid push followed immediately by a saline flush.",
            "Use the IV/IO access closest to the patient when possible."
          ],
          requiresClinicalReview: true,
          reference: {
            organization: "AHA/AAP",
            guideline: "Pediatric Advanced Life Support",
            section: "Pediatric Tachycardia / SVT"
          }
        },
        {
          id: "svt_second_dose",
          title: "SVT — الجرعة الثانية",
          context: "arrhythmia",
          sequenceStage: 2,
          route: "Rapid IV / IO Push",
          doseType: "fixed_mg_kg",
          doseValue: 0.2,
          doseUnit: "mg/kg",
          concentration: { label: "3 mg/mL", mgPerMl: 3.0 },
          maxSingleDoseMg: 12.0,
          warnings: [
            "Second dose is used when clinically indicated after failure of the initial dose.",
            "Confirm rhythm and clinical indication before escalation."
          ],
          requiresClinicalReview: true,
          reference: {
            organization: "AHA/AAP",
            guideline: "Pediatric Advanced Life Support",
            section: "Pediatric Tachycardia / SVT"
          }
        }
      ]
    },

    // -----------------------------------------------------------------------
    // 5. CALCIUM CHLORIDE
    // -----------------------------------------------------------------------
    {
      id: "calcium_chloride",
      name: "Calcium Chloride 10%",
      arabicName: "كلوريد الكالسيوم 10%",
      category: "Electrolyte / Membrane Stabilizer",
      isHighAlert: true,

      indications: [
        {
          id: "hyperkalemia",
          title: "فرط البوتاسيوم — Hyperkalemia",
          context: "electrolyte_emergency",
          route: "IV — Central preferred",
          doseType: "fixed_mg_kg",
          doseValue: 20.0,
          doseUnit: "mg/kg salt",
          concentration: {
            label: "10% Calcium Chloride",
            saltMgPerMl: 100.0,
            elementalCaMgPerMl: 27.2
          },
          requiresReview: true,
          requiresClinicalReview: true,
          warnings: [
            "Not for routine pediatric cardiac arrest.",
            "Peripheral extravasation can cause severe tissue injury.",
            "Continuous ECG monitoring is required."
          ],
          reference: {
            organization: "AHA/AAP",
            guideline: "Pediatric Advanced Life Support",
            section: "Special Circumstances / Electrolyte Emergencies"
          }
        },
        {
          id: "hypocalcemia",
          title: "نقص الكالسيوم العرضي — Symptomatic Hypocalcemia",
          context: "electrolyte_emergency",
          route: "IV",
          doseType: "fixed_mg_kg",
          doseValue: 20.0,
          doseUnit: "mg/kg salt",
          concentration: {
            label: "10% Calcium Chloride",
            saltMgPerMl: 100.0,
            elementalCaMgPerMl: 27.2
          },
          requiresReview: true,
          requiresClinicalReview: true,
          warnings: [
            "Use only when clinically indicated.",
            "Dose should be interpreted according to elemental calcium content and institutional protocol."
          ],
          reference: {
            organization: "Pediatric Emergency / Critical Care",
            guideline: "Electrolyte Emergency Management",
            section: "Hypocalcemia"
          }
        }
      ]
    },

    // -----------------------------------------------------------------------
    // 6. CALCIUM GLUCONATE
    // -----------------------------------------------------------------------
    {
      id: "calcium_gluconate",
      name: "Calcium Gluconate 10%",
      arabicName: "غلوكونات الكالسيوم 10%",
      category: "Electrolyte / Membrane Stabilizer",
      isHighAlert: true,

      indications: [
        {
          id: "hyperkalemia",
          title: "فرط البوتاسيوم — Hyperkalemia",
          context: "electrolyte_emergency",
          route: "IV",
          doseType: "range_mg_kg",
          doseMin: 60.0,
          doseMax: 100.0,
          defaultDoseValue: 60.0,
          doseUnit: "mg/kg salt",
          concentration: {
            label: "10% Calcium Gluconate",
            saltMgPerMl: 100.0,
            elementalCaMgPerMl: 9.3
          },
          requiresReview: true,
          requiresClinicalReview: true,
          warnings: [
            "Used for membrane stabilization in selected electrolyte emergencies.",
            "Not routine therapy for pediatric cardiac arrest."
          ],
          reference: {
            organization: "AHA/AAP",
            guideline: "Pediatric Advanced Life Support",
            section: "Special Circumstances / Electrolyte Emergencies"
          }
        },
        {
          id: "symptomatic_hypocalcemia",
          title: "نقص الكالسيوم العرضي — Symptomatic Hypocalcemia",
          context: "electrolyte_emergency",
          route: "IV",
          doseType: "range_mg_kg",
          doseMin: 60.0,
          doseMax: 100.0,
          defaultDoseValue: 60.0,
          doseUnit: "mg/kg salt",
          concentration: {
            label: "10% Calcium Gluconate",
            saltMgPerMl: 100.0,
            elementalCaMgPerMl: 9.3
          },
          requiresReview: true,
          requiresClinicalReview: true,
          warnings: [
            "Monitor ECG and calcium status.",
            "Dose should be individualized according to the clinical situation."
          ],
          reference: {
            organization: "Pediatric Emergency / Critical Care",
            guideline: "Electrolyte Emergency Management",
            section: "Hypocalcemia"
          }
        }
      ]
    },

    // -----------------------------------------------------------------------
    // 7. SODIUM BICARBONATE
    // -----------------------------------------------------------------------
    {
      id: "sodium_bicarbonate",
      name: "Sodium Bicarbonate 8.4%",
      arabicName: "بيكربونات الصوديوم 8.4%",
      category: "Buffer / Electrolyte",
      isHighAlert: true,

      indications: [
        {
          id: "tca_overdose",
          title: "تسمم TCA / Sodium-Channel Blocker",
          context: "toxicology",
          route: "IV",
          doseType: "range_meq_kg",
          doseMin: 1.0,
          doseMax: 2.0,
          defaultDoseValue: 1.0,
          doseUnit: "mEq/kg",
          titrationTarget:
            "Narrowing of QRS and appropriate arterial pH according to toxicology protocol.",
          concentration: { label: "8.4% Solution", mEqPerMl: 1.0 },
          maxSingleDoseMeq: 50.0,
          requiresClinicalReview: true,
          warnings: [
            "Do not administer routinely during pediatric cardiac arrest.",
            "Use for selected toxicologic indications such as sodium-channel blocker toxicity.",
            "Monitor sodium, potassium, pH and ECG."
          ],
          reference: {
            organization: "AHA/AAP / Medical Toxicology",
            guideline: "Pediatric Toxicological Emergency Management",
            section: "Sodium-Channel Blocker Toxicity"
          }
        },
        {
          id: "severe_hyperkalemia_selected",
          title: "فرط بوتاسيوم مختار — Selected Hyperkalemia",
          context: "hyperkalemia",
          route: "IV",
          doseType: "fixed_meq_kg",
          doseValue: 1.0,
          doseUnit: "mEq/kg",
          concentration: { label: "8.4% Solution", mEqPerMl: 1.0 },
          maxSingleDoseMeq: 50.0,
          requiresReview: true,
          requiresClinicalReview: true,
          warnings: [
            "Bicarbonate is not a universal first-line treatment for hyperkalemia.",
            "Treat the underlying emergency and follow local hyperkalemia protocol.",
            "Do not use as routine cardiac-arrest therapy."
          ],
          reference: {
            organization: "Pediatric Emergency / Critical Care",
            guideline: "Hyperkalemia Management",
            section: "Adjunctive Therapy"
          }
        },
        {
          id: "severe_metabolic_acidosis",
          title: "الحماض الاستقلابي الشديد — Documented Severe Acidosis",
          context: "acidosis",
          route: "IV Slow Infusion",
          doseType: "fixed_meq_kg",
          doseValue: 1.0,
          doseUnit: "mEq/kg",
          concentration: { label: "8.4% Solution", mEqPerMl: 1.0 },
          maxSingleDoseMeq: 50.0,
          requiresReview: true,
          requiresClinicalReview: true,
          warnings: [
            "Special Neonatal Caution: Dilute 1:1 with sterile water prior to administration in neonates/infants to reduce osmolarity.",
            "Ensure adequate ventilation to clear produced CO2."
          ],
          reference: {
            organization: "AHA/AAP / PALS",
            guideline: "Pediatric Critical Care",
            section: "Acid-Base Disturbances"
          }
        }
      ]
    },

    // -----------------------------------------------------------------------
    // 8. ROCURONIUM
    // -----------------------------------------------------------------------
    {
      id: "rocuronium",
      name: "Rocuronium Bromide",
      arabicName: "روكورونيوم",
      category: "Neuromuscular Blocker",
      isHighAlert: true,

      indications: [
        {
          id: "intubation",
          title: "التنبيب الرغامي — Intubation",
          context: "airway_management",
          route: "IV",
          doseType: "fixed_mg_kg",
          doseValue: 0.6,
          doseUnit: "mg/kg",
          concentration: { label: "10 mg/mL", mgPerMl: 10.0 },
          maxSingleDoseMg: 100.0,
          warnings: [
            "Paralysis requires immediate ability to provide effective ventilation and airway rescue.",
            "Neuromuscular blockade does not provide analgesia or hypnosis."
          ],
          requiresClinicalReview: true,
          reference: {
            organization: "Pediatric Anesthesia",
            guideline: "Pediatric Airway / Neuromuscular Blockade",
            section: "Intubation"
          }
        },
        {
          id: "rsi",
          title: "RSI — Rapid Sequence Intubation",
          context: "airway_management",
          route: "IV",
          doseType: "fixed_mg_kg",
          doseValue: 1.2,
          doseUnit: "mg/kg",
          concentration: { label: "10 mg/mL", mgPerMl: 10.0 },
          maxSingleDoseMg: 100.0,
          warnings: [
            "High-dose rocuronium provides prolonged neuromuscular blockade.",
            "Ensure adequate sedation/induction and airway rescue capability."
          ],
          requiresClinicalReview: true,
          reference: {
            organization: "Pediatric Anesthesia",
            guideline: "Rapid Sequence Intubation",
            section: "Neuromuscular Blockade"
          }
        }
      ]
    },

    // -----------------------------------------------------------------------
    // 9. SUCCINYLCHOLINE
    // -----------------------------------------------------------------------
    {
      id: "succinylcholine",
      name: "Succinylcholine",
      arabicName: "سكسينيل كولين",
      category: "Depolarizing Neuromuscular Blocker",
      isHighAlert: true,

      indications: [
        {
          id: "intubation_iv",
          title: "التنبيب الوريدي — IV Intubation",
          context: "airway_management",
          route: "IV",
          doseType: "range_mg_kg",
          doseMin: 1.5,
          doseMax: 2.0,
          defaultDoseValue: 2.0,
          doseUnit: "mg/kg",
          concentrationOptions: [
            { label: "20 mg/mL", mgPerMl: 20.0 },
            { label: "50 mg/mL", mgPerMl: 50.0 }
          ],
          maxSingleDoseMg: 150.0,
          warnings: [
            "Risk of hyperkalemia and malignant hyperthermia.",
            "Contraindicated in selected neuromuscular disorders, burns, and other high-risk conditions.",
            "Requires immediate airway and ventilation capability."
          ],
          requiresClinicalReview: true,
          reference: {
            organization: "Pediatric Anesthesia",
            guideline: "Neuromuscular Blockade",
            section: "Succinylcholine"
          }
        },
        {
          id: "laryngospasm_im",
          title: "التشنج الحنجري الشديد — Severe Laryngospasm",
          context: "airway_emergency",
          route: "IM",
          doseType: "range_mg_kg",
          doseMin: 3.0,
          doseMax: 4.0,
          defaultDoseValue: 4.0,
          doseUnit: "mg/kg",
          concentration: { label: "50 mg/mL", mgPerMl: 50.0 },
          maxSingleDoseMg: 150.0,
          warnings: [
            "Emergency rescue dose when IV access is unavailable.",
            "Assess for hyperkalemia and other contraindications."
          ],
          requiresClinicalReview: true,
          reference: {
            organization: "Pediatric Anesthesia",
            guideline: "Management of Severe Laryngospasm",
            section: "Neuromuscular Blockade"
          }
        }
      ]
    },

    // -----------------------------------------------------------------------
    // 10. EPHEDRINE
    // -----------------------------------------------------------------------
    {
      id: "ephedrine",
      name: "Ephedrine Sulfate",
      arabicName: "إيفيدرين",
      category: "Vasopressor / Sympathomimetic",
      isHighAlert: true,

      indications: [
        {
          id: "anesthesia_hypotension",
          title: "انخفاض الضغط المرتبط بالتخدير",
          context: "hemodynamic_support",
          route: "IV",
          doseType: "range_mg_kg",
          doseMin: 0.1,
          doseMax: 0.2,
          defaultDoseValue: 0.1,
          doseUnit: "mg/kg",
          concentrationOptions: [
            { label: "5 mg/mL — Diluted", mgPerMl: 5.0 },
            { label: "30 mg/mL — Stock", mgPerMl: 30.0 }
          ],
          maxSingleDoseMg: 10.0,
          warnings: [
            "Stock concentration must not be administered without appropriate dilution according to local protocol.",
            "Monitor blood pressure and heart rate."
          ],
          requiresClinicalReview: true,
          reference: {
            organization: "Pediatric Anesthesia",
            guideline: "Perioperative Hemodynamic Management",
            section: "Vasopressors"
          }
        }
      ]
    },

    // -----------------------------------------------------------------------
    // 11. PHENYLEPHRINE
    // -----------------------------------------------------------------------
    {
      id: "phenylephrine",
      name: "Phenylephrine",
      arabicName: "فينيل إيفرين",
      category: "Vasopressor",
      isHighAlert: true,

      indications: [
        {
          id: "anesthesia_hypotension",
          title: "انخفاض الضغط أثناء التخدير",
          context: "hemodynamic_support",
          route: "IV Direct Push",
          doseType: "range_mcg_kg",
          doseMin: 5.0, // Corrected from 0.5 to standard 5.0 mcg/kg
          doseMax: 10.0, // Corrected from 2.0 to standard 10.0 mcg/kg
          defaultDoseValue: 5.0,
          doseUnit: "mcg/kg",
          concentration: {
            label: "100 mcg/mL — Diluted",
            mcgPerMl: 100.0,
            mgPerMl: 0.1
          },
          maxSingleDoseMcg: 500.0,
          warnings: [
            "Pure alpha-1 agonist; may cause reflex bradycardia.",
            "Use a verified diluted concentration (100 mcg/mL).",
            "Dose must be titrated to hemodynamic response."
          ],
          requiresClinicalReview: true,
          reference: {
            organization: "Pediatric Anesthesia",
            guideline: "Perioperative Hemodynamic Management",
            section: "Phenylephrine"
          }
        }
      ]
    },

    // -----------------------------------------------------------------------
    // 12. MAGNESIUM SULFATE
    // -----------------------------------------------------------------------
    {
      id: "magnesium_sulfate",
      name: "Magnesium Sulfate",
      arabicName: "كبريتات المغنيسيوم",
      category: "Electrolyte / Antiarrhythmic / Bronchodilator",
      isHighAlert: true,

      indications: [
        {
          id: "torsades",
          title: "Torsades de Pointes",
          context: "arrhythmia",
          route: "IV / IO",
          doseType: "range_mg_kg",
          doseMin: 25.0,
          doseMax: 50.0,
          defaultDoseValue: 25.0,
          doseUnit: "mg/kg",
          concentration: { label: "50% Solution", mgPerMl: 500.0 },
          maxSingleDoseMg: 2000.0,
          warnings: [
            "Administer according to rhythm/emergency protocol.",
            "Rapid administration may cause severe hypotension."
          ],
          requiresClinicalReview: true,
          reference: {
            organization: "AHA/AAP",
            guideline: "Pediatric Advanced Life Support",
            section: "Torsades de Pointes"
          }
        },
        {
          id: "severe_asthma",
          title: "الربو الحاد الشديد — Severe Asthma",
          context: "respiratory_emergency",
          route: "IV Infusion",
          doseType: "range_mg_kg",
          doseMin: 25.0,
          doseMax: 75.0,
          defaultDoseValue: 50.0,
          doseUnit: "mg/kg",
          concentration: { label: "50% Solution", mgPerMl: 500.0 },
          maxSingleDoseMg: 2000.0,
          warnings: [
            "Use as adjunctive therapy in severe/refractory asthma according to local pediatric protocol.",
            "Monitor blood pressure and respiratory status."
          ],
          requiresClinicalReview: true,
          reference: {
            organization: "Pediatric Emergency / Critical Care",
            guideline: "Severe Asthma Management",
            section: "Intravenous Magnesium"
          }
        }
      ]
    },

    // -----------------------------------------------------------------------
    // 13. DEXTROSE 10%
    // -----------------------------------------------------------------------
    {
      id: "dextrose_10",
      name: "Dextrose 10% (D10W)",
      arabicName: "ديكستروز 10%",
      category: "Glucose / Metabolic Emergency",
      isHighAlert: false,

      indications: [
        {
          id: "hypoglycemia",
          title: "نقص سكر الدم الحاد — Acute Hypoglycemia",
          context: "metabolic_emergency",
          route: "IV",
          doseType: "range_ml_kg",
          doseMin: 2.0, // Corrected to standard PALS 2.0 mL/kg
          doseMax: 4.0, // Corrected to standard PALS 4.0 mL/kg
          defaultDoseValue: 2.0, // Provides 0.2 g/kg dextrose
          doseUnit: "mL/kg D10W",
          concentration: { label: "D10W", mgPerMl: 100.0 },
          maxSingleVolumeMl: 250.0,
          warnings: [
            "2 mL/kg of D10W provides 0.2 g/kg of dextrose.",
            "Recheck blood glucose 10–15 minutes after treatment.",
            "Avoid routine use of hypertonic dextrose (D25W/D50W) in infants and small children."
          ],
          requiresClinicalReview: true,
          reference: {
            organization: "AHA/AAP",
            guideline: "Pediatric Advanced Life Support",
            section: "Hypoglycemia"
          }
        }
      ]
    },

    // -----------------------------------------------------------------------
    // 14. NALOXONE
    // -----------------------------------------------------------------------
    {
      id: "naloxone",
      name: "Naloxone Hydrochloride",
      arabicName: "نالوكسون",
      category: "Opioid Reversal Agent",
      isHighAlert: true,

      indications: [
        {
          id: "opioid_reversal",
          title: "عكس تثبيط الجهاز التنفسي بسبب الأفيونات",
          context: "toxicology",
          route: "IV / IO / IM",
          doseType: "range_mg_kg",
          doseMin: 0.01,
          doseMax: 0.1,
          defaultDoseValue: 0.01,
          doseUnit: "mg/kg",
          concentrationOptions: [{ label: "0.4 mg/mL", mgPerMl: 0.4 }],
          maxSingleDoseMg: 2.0,
          warnings: [
            "Titrate to adequate ventilation rather than automatically reversing all opioid effects.",
            "Repeated dosing or infusion may be required because opioid duration can exceed naloxone duration.",
            "Monitor for recurrent respiratory depression."
          ],
          requiresClinicalReview: true,
          reference: {
            organization: "Pediatric Emergency / Toxicology",
            guideline: "Opioid Toxicity Management",
            section: "Naloxone"
          }
        }
      ]
    },

    // -----------------------------------------------------------------------
    // 15. FLUMAZENIL
    // -----------------------------------------------------------------------
    {
      id: "flumazenil",
      name: "Flumazenil",
      arabicName: "فلومازينيل",
      category: "Benzodiazepine Reversal Agent",
      isHighAlert: true,

      indications: [
        {
          id: "benzodiazepine_reversal",
          title: "عكس تأثير البنزوديازيبين",
          context: "reversal",
          route: "IV",
          doseType: "fixed_mg_kg",
          doseValue: 0.01,
          doseUnit: "mg/kg",
          concentration: { label: "0.1 mg/mL", mgPerMl: 0.1 },
          maxSingleDoseMg: 0.2,
          repeatIntervalMinutes: 1,
          maxCumulativeDoseMg: 1.0,
          warnings: [
            "Avoid in patients with significant seizure risk.",
            "Avoid in chronic benzodiazepine dependence because withdrawal and seizures may occur.",
            "Avoid when benzodiazepine overdose is mixed with pro-convulsant agents."
          ],
          requiresClinicalReview: true,
          reference: {
            organization: "Pediatric Sedation / Toxicology",
            guideline: "Benzodiazepine Reversal",
            section: "Flumazenil"
          }
        }
      ]
    },

    // -----------------------------------------------------------------------
    // 16. MIDAZOLAM
    // -----------------------------------------------------------------------
    {
      id: "midazolam",
      name: "Midazolam",
      arabicName: "ميدازولام",
      category: "Sedative / Anticonvulsant",
      isHighAlert: true,

      indications: [
        {
          id: "procedural_sedation",
          title: "التهدئة الإجرائية",
          context: "sedation",
          route: "IV",
          doseType: "range_mg_kg",
          doseMin: 0.05,
          doseMax: 0.1,
          defaultDoseValue: 0.05,
          doseUnit: "mg/kg",
          concentrationOptions: [
            { label: "1 mg/mL", mgPerMl: 1.0 },
            { label: "5 mg/mL", mgPerMl: 5.0 }
          ],
          maxSingleDoseMg: 5.0,
          warnings: [
            "Respiratory depression risk increases with opioids and other sedatives.",
            "Continuous respiratory and oxygenation monitoring is required."
          ],
          requiresClinicalReview: true,
          reference: {
            organization: "AAP",
            guideline: "Pediatric Procedural Sedation",
            section: "Benzodiazepines"
          }
        },
        {
          id: "status_epilepticus",
          title: "النوبات الحادة / Status Epilepticus",
          context: "neurological_emergency",
          route: "IV / IO / IM",
          doseType: "fixed_mg_kg",
          doseValue: 0.1,
          doseUnit: "mg/kg",
          concentrationOptions: [
            { label: "1 mg/mL", mgPerMl: 1.0 },
            { label: "5 mg/mL", mgPerMl: 5.0 }
          ],
          maxSingleDoseMg: 10.0,
          warnings: [
            "Monitor ventilation and airway closely.",
            "Follow the institution's status epilepticus pathway."
          ],
          requiresClinicalReview: true,
          reference: {
            organization: "Pediatric Emergency / Critical Care",
            guideline: "Status Epilepticus Management",
            section: "Benzodiazepine Therapy"
          }
        }
      ]
    },

    // -----------------------------------------------------------------------
    // 17. FENTANYL
    // -----------------------------------------------------------------------
    {
      id: "fentanyl",
      name: "Fentanyl Citrate",
      arabicName: "فنتانيل",
      category: "Opioid Analgesic",
      isHighAlert: true,

      indications: [
        {
          id: "analgesia",
          title: "تسكين الألم / Analgesia",
          context: "analgesia",
          route: "IV Slow Push",
          doseType: "range_mcg_kg",
          doseMin: 0.5,
          doseMax: 2.0,
          defaultDoseValue: 1.0,
          doseUnit: "mcg/kg",
          concentration: {
            label: "50 mcg/mL",
            mcgPerMl: 50.0,
            mgPerMl: 0.05
          },
          maxSingleDoseMcg: 100.0,
          warnings: [
            "Administer slowly and monitor ventilation.",
            "Rapid administration can contribute to chest wall rigidity.",
            "Dose must be individualized according to age, opioid exposure and clinical context."
          ],
          requiresClinicalReview: true,
          reference: {
            organization: "AAP / Pediatric Anesthesia",
            guideline: "Pediatric Opioid Analgesia",
            section: "Fentanyl"
          }
        }
      ]
    }
  ],

  // =========================================================================
  // 4. MAINTENANCE FLUIDS
  // =========================================================================
  maintenanceFluidRules: {
    ruleName: "Holliday-Segar Maintenance Rate",
    calculationTargets: ["hourlyRateMlHr", "dailyVolumeMl24h"],

    tiers: [
      {
        minKgInclusive: 0.0,
        maxKgInclusive: 10.0,
        ratePerKg: 4.0
      },
      {
        minKgExclusive: 10.0,
        maxKgInclusive: 20.0,
        ratePerKg: 2.0
      },
      {
        minKgExclusive: 20.0,
        maxKgExclusive: Infinity,
        ratePerKg: 1.0
      }
    ],

    scope: {
      minAgeDays: 28,
      maxAgeYears: 18.0,
      calculationAvailable: true,
      requiresClinicalReview: true,

      exclusions: [
        "neonate_under_28_days",
        "NICU_patients",
        "neurosurgical_disorders",
        "cardiac_disease",
        "hepatic_disease",
        "cancer",
        "renal_dysfunction",
        "diabetes_insipidus",
        "severe_burns",
        "voluminous_watery_diarrhea"
      ]
    },

    compositionGuidance: {
      title: "AAP Maintenance IV Fluid Composition",
      recommendation:
        "For children 28 days to 18 years who require maintenance IV fluids in the guideline's applicable acute-care populations, use isotonic maintenance fluids with appropriate potassium chloride and dextrose when clinically appropriate.",

      disclaimer:
        "The Holliday-Segar calculation estimates maintenance volume only. It does not determine fluid composition, resuscitation volume, replacement of ongoing losses, or individualized fluid restriction.",

      reference: {
        organization: "American Academy of Pediatrics",
        guideline:
          "Clinical Practice Guideline: Maintenance Intravenous Fluids in Children",
        section: "Key Action Statement 1A"
      }
    }
  },

  // =========================================================================
  // 5. PLAUSIBILITY & SAFETY CONSTRAINTS
  // =========================================================================
  plausibilityConstraints: {
    minWeightKg: 0.3,
    highWeightThresholdKg: 100.0,
    maxPediatricAgeYears: 18.0,

    messages: {
      invalidWeight: "Weight must be greater than 0 kg.",
      invalidAge: "Age must be greater than or equal to 0.",
      highWeightWarning:
        "Patient weight >100 kg. Verify whether actual, ideal, adjusted, or another dosing weight is appropriate for the selected medication.",
      overAgeWarning: "Patient age exceeds the pediatric reference scope.",
      neonatalWarning:
        "Neonatal patients require age-, gestational-age-, and indication-specific verification.",
      concentrationWarning:
        "Verify the actual drug concentration on the vial/syringe before administration.",
      clinicalReviewWarning:
        "This calculation requires clinical verification before administration."
    }
  },

  // =========================================================================
  // 6. ENGINE SAFETY CONTRACT
  // =========================================================================
  engineSafety: {
    rejectInvalidWeight: true,
    rejectNegativeAge: true,
    requireConcentrationForDoseToVolume: true,
    requireIndicationSelection: true,
    requireClinicalReviewForHighAlert: true,
    preventAutomaticAveragingOfRanges: true,
    preventNullMaximumFromBeingTreatedAsZero: true,
    preventUnknownDoseUnit: true,
    preventUnknownConcentration: true,
    showWarningsBeforeAdministration: true,
    requireIndependentVerification: true
  }
};
