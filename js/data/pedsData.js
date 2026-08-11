/**
 * Pediatric Clinical Reference Data & Safety Limits
 * AnesthesiaX — Phase 7.6 (Fully Audited & Clinical Master)
 * Version: 7.6-final-master
 *
 * Standards & Primary References:
 * - AHA/AAP Pediatric Advanced Life Support (PALS 2025/2026)
 * - AAP Clinical Practice Guideline: Maintenance IV Fluids in Children
 * - ASA / Pediatric Anesthesia & Emergency Medicine Reference Standards
 */

export const pedsData = {
  // =========================================================================
  // 1. METADATA & SCOPE
  // =========================================================================
  meta: {
    version: "7.6-final-master",
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
        maxWeightKgInclusive: 15.0,
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
  // 3. EMERGENCY DRUGS (COMPLETE CLINICAL SCHEMAS)
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
          concentrationOptions: [
            { label: "0.1 mg/mL (1:10,000)", mgPerMl: 0.1 }
          ],
          maxSingleDoseMg: 1.0,
          repeatIntervalMinutes: { min: 3, max: 5 },
          warnings: [
            "Use the 0.1 mg/mL concentration for IV/IO cardiac-arrest dosing.",
            "Do not confuse 0.1 mg/mL with 1 mg/mL."
          ],
          requiresClinicalReview: true,
          reference: { organization: "AHA/AAP", guideline: "PALS 2025/2026", section: "Cardiac Arrest" }
        },
        {
          id: "anaphylaxis",
          title: "التأق — Anaphylaxis",
          context: "anaphylaxis",
          route: "IM — Anterolateral Thigh",
          doseType: "fixed_mg_kg",
          doseValue: 0.01,
          doseUnit: "mg/kg",
          concentrationOptions: [
            { label: "1 mg/mL (1:1,000)", mgPerMl: 1.0 }
          ],
          maxSingleDoseRules: [
            { maxAgeYearsInclusive: 12.0, maxDoseMg: 0.3 },
            { minAgeYearsExclusive: 12.0, maxDoseMg: 0.5 }
          ],
          repeatIntervalMinutes: { min: 5, max: 15 },
          warnings: [
            "IM epinephrine is first-line treatment for anaphylaxis.",
            "Do not administer 1 mg/mL epinephrine as an IV push."
          ],
          requiresClinicalReview: true,
          reference: { organization: "AAAAI / PALS", guideline: "Anaphylaxis Parameter", section: "Treatment" }
        },
        {
          id: "croup",
          title: "الخناق — Croup",
          context: "airway_edema",
          route: "Nebulized",
          doseType: "fixed_ml_kg",
          doseValue: 0.5,
          doseUnit: "mL/kg",
          concentrationOptions: [
            { label: "Epinephrine 1 mg/mL (1:1,000)", mgPerMl: 1.0 }
          ],
          maxSingleVolumeMl: 5.0,
          warnings: ["Observe for recurrence of airway obstruction after treatment."],
          requiresClinicalReview: true,
          reference: { organization: "AAP", guideline: "Croup Management", section: "Nebulized Epinephrine" }
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
            { label: "0.1 mg/mL (مخفف طوارئ)", mgPerMl: 0.1 },
            { label: "0.5 mg/mL (أمبولة 1mg/2mL)", mgPerMl: 0.5 },
            { label: "0.6 mg/mL (أمبولة 0.6mg/1mL)", mgPerMl: 0.6 }
          ],
          minSingleDoseMg: 0.1,
          maxSingleDoseRules: [
            { maxAgeYearsInclusive: 12.0, maxDoseMg: 0.5 },
            { minAgeYearsExclusive: 12.0, maxDoseMg: 1.0 }
          ],
          warnings: ["Minimum dose of 0.1 mg enforced in bradycardia to prevent paradoxical worsening."],
          requiresClinicalReview: true,
          reference: { organization: "AHA/AAP", guideline: "PALS 2025/2026", section: "Bradycardia" }
        },
        {
          id: "pre_intubation",
          title: "التحضير للتنبيب — Pre-intubation Anticholinergic",
          context: "premedication",
          route: "IV / IM",
          doseType: "fixed_mg_kg",
          doseValue: 0.02,
          doseUnit: "mg/kg",
          concentrationOptions: [
            { label: "0.1 mg/mL", mgPerMl: 0.1 },
            { label: "0.5 mg/mL", mgPerMl: 0.5 },
            { label: "0.6 mg/mL", mgPerMl: 0.6 }
          ],
          minSingleDoseMg: null,
          maxSingleDoseRules: [
            { maxAgeYearsInclusive: 12.0, maxDoseMg: 0.5 },
            { minAgeYearsExclusive: 12.0, maxDoseMg: 1.0 }
          ],
          warnings: ["Do not automatically apply the bradycardia minimum dose to pre-intubation premedication."],
          requiresClinicalReview: true,
          reference: { organization: "Pediatric Anesthesia", guideline: "Airway Protocol", section: "Premedication" }
        },
        {
          id: "reversal",
          title: "عكس الخدر العضلي — Reversal with Neostigmine",
          context: "reversal",
          route: "IV (مع النيوستغمين)",
          doseType: "fixed_mg_kg",
          doseValue: 0.02,
          doseUnit: "mg/kg",
          concentrationOptions: [
            { label: "0.5 mg/mL", mgPerMl: 0.5 },
            { label: "0.6 mg/mL", mgPerMl: 0.6 }
          ],
          minSingleDoseMg: 0.1,
          maxSingleDoseRules: [
            { maxAgeYearsInclusive: 12.0, maxDoseMg: 0.6 },
            { minAgeYearsExclusive: 12.0, maxDoseMg: 1.2 }
          ],
          warnings: ["Administered concurrently with Neostigmine to prevent muscarinic side effects."],
          requiresClinicalReview: true,
          reference: { organization: "Pediatric Anesthesia", guideline: "Reversal Protocol", section: "Anticholinergics" }
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
          title: "VF / Pulseless VT (توقف القلب)",
          context: "cardiac_arrest",
          route: "IV / IO Bolus",
          doseType: "fixed_mg_kg",
          doseValue: 5.0,
          doseUnit: "mg/kg",
          concentrationOptions: [
            { label: "50 mg/mL", mgPerMl: 50.0 }
          ],
          maxInitialDoseMg: 300.0,
          warnings: ["Rapid IV bolus is indicated ONLY in cardiac arrest (pulseless VT/VF)."],
          requiresClinicalReview: true,
          reference: { organization: "AHA/AAP", guideline: "PALS 2025/2026", section: "Cardiac Arrest" }
        },
        {
          id: "perfusing_vt_svt",
          title: "تسارع القلب مع وجود نبض — VT / SVT with Pulse",
          context: "arrhythmia",
          route: "IV / IO Infusion (20–60 min)",
          doseType: "fixed_mg_kg",
          doseValue: 5.0,
          doseUnit: "mg/kg",
          concentrationOptions: [
            { label: "50 mg/mL (To be diluted)", mgPerMl: 50.0 }
          ],
          maxInitialDoseMg: 300.0,
          warnings: ["Administer slowly over 20–60 minutes to prevent severe hypotension and cardiovascular collapse."],
          requiresClinicalReview: true,
          reference: { organization: "AHA/AAP", guideline: "PALS 2025/2026", section: "Tachycardia with Pulse" }
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
          route: "Rapid IV / IO Push",
          doseType: "fixed_mg_kg",
          doseValue: 0.1,
          doseUnit: "mg/kg",
          concentrationOptions: [
            { label: "3 mg/mL", mgPerMl: 3.0 }
          ],
          maxSingleDoseMg: 6.0,
          warnings: ["Administer as a rapid push followed immediately by a saline flush."],
          requiresClinicalReview: true,
          reference: { organization: "AHA/AAP", guideline: "PALS 2025/2026", section: "SVT" }
        },
        {
          id: "svt_second_dose",
          title: "SVT — الجرعة الثانية",
          context: "arrhythmia",
          route: "Rapid IV / IO Push",
          doseType: "fixed_mg_kg",
          doseValue: 0.2,
          doseUnit: "mg/kg",
          concentrationOptions: [
            { label: "3 mg/mL", mgPerMl: 3.0 }
          ],
          maxSingleDoseMg: 12.0,
          warnings: ["Second dose used if initial dose fails to terminate SVT."],
          requiresClinicalReview: true,
          reference: { organization: "AHA/AAP", guideline: "PALS 2025/2026", section: "SVT" }
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
          concentrationOptions: [
            { label: "10% Calcium Chloride (100 mg/mL salt)", mgPerMl: 100.0 }
          ],
          warnings: ["Peripheral extravasation can cause severe tissue necrosis. Central line preferred."],
          requiresClinicalReview: true,
          reference: { organization: "AHA/AAP", guideline: "PALS 2025/2026", section: "Electrolyte Emergencies" }
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
          concentrationOptions: [
            { label: "10% Calcium Gluconate (100 mg/mL salt)", mgPerMl: 100.0 }
          ],
          warnings: ["Safer for peripheral administration than Calcium Chloride."],
          requiresClinicalReview: true,
          reference: { organization: "AHA/AAP", guideline: "PALS 2025/2026", section: "Electrolyte Emergencies" }
        }
      ]
    },

    // -----------------------------------------------------------------------
    // 7. SODIUM BICARBONATE
    // -----------------------------------------------------------------------
    {
      id: "sodium_bicarbonate",
      name: "Sodium Bicarbonate",
      arabicName: "بيكربونات الصوديوم",
      category: "Buffer / Electrolyte",
      isHighAlert: true,

      indications: [
        {
          id: "severe_metabolic_acidosis",
          title: "الحماض الاستقلابي الشديد / تسمم TCA",
          context: "acidosis",
          route: "IV Slow Infusion",
          doseType: "fixed_meq_kg",
          doseValue: 1.0,
          doseUnit: "mEq/kg",
          concentrationOptions: [
            { label: "8.4% Solution (1.0 mEq/mL — Children > 1 year)", mgPerMl: 1.0 },
            { label: "4.2% Solution (0.5 mEq/mL — Neonates / Infants)", mgPerMl: 0.5 }
          ],
          maxSingleDoseMeq: 50.0,
          warnings: ["In neonates/infants, ALWAYS use 4.2% solution (or dilute 8.4% 1:1) to prevent intracranial hemorrhage."],
          requiresClinicalReview: true,
          reference: { organization: "AHA/AAP / PALS", guideline: "Acid-Base Disturbances", section: "Sodium Bicarbonate" }
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
          title: "التنبيب الرغامي القياسي",
          context: "airway_management",
          route: "IV",
          doseType: "fixed_mg_kg",
          doseValue: 0.6,
          doseUnit: "mg/kg",
          concentrationOptions: [
            { label: "10 mg/mL", mgPerMl: 10.0 }
          ],
          maxSingleDoseMg: 100.0,
          warnings: ["Neuromuscular blockade does not provide sedation or analgesia."],
          requiresClinicalReview: true,
          reference: { organization: "Pediatric Anesthesia", guideline: "Airway Management", section: "Intubation" }
        },
        {
          id: "rsi",
          title: "RSI — التنبيب السريع",
          context: "airway_management",
          route: "IV",
          doseType: "fixed_mg_kg",
          doseValue: 1.2,
          doseUnit: "mg/kg",
          concentrationOptions: [
            { label: "10 mg/mL", mgPerMl: 10.0 }
          ],
          maxSingleDoseMg: 100.0,
          warnings: ["High-dose rocuronium provides prolonged paralysis (up to 60-90 minutes)."],
          requiresClinicalReview: true,
          reference: { organization: "Pediatric Anesthesia", guideline: "RSI Protocol", section: "Rocuronium" }
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
          warnings: ["Risk of hyperkalemic cardiac arrest in undiagnosed muscular dystrophies."],
          requiresClinicalReview: true,
          reference: { organization: "Pediatric Anesthesia", guideline: "Neuromuscular Blockade", section: "Succinylcholine" }
        },
        {
          id: "laryngospasm_iv",
          title: "علاج التشنج الحنجري الوريدي — IV Laryngospasm Rescue",
          context: "airway_emergency",
          route: "IV Direct Push",
          doseType: "range_mg_kg",
          doseMin: 0.5,
          doseMax: 1.0,
          defaultDoseValue: 0.5,
          doseUnit: "mg/kg",
          concentrationOptions: [
            { label: "20 mg/mL", mgPerMl: 20.0 }
          ],
          maxSingleDoseMg: 50.0,
          warnings: ["Small IV dose to break severe laryngospasm without prolonged paralysis."],
          requiresClinicalReview: true,
          reference: { organization: "Pediatric Anesthesia", guideline: "Laryngospasm Protocol", section: "IV Rescue" }
        },
        {
          id: "laryngospasm_im",
          title: "التشنج الحنجري العضلي — IM Laryngospasm Rescue",
          context: "airway_emergency",
          route: "IM",
          doseType: "range_mg_kg",
          doseMin: 3.0,
          doseMax: 4.0,
          defaultDoseValue: 4.0,
          doseUnit: "mg/kg",
          concentrationOptions: [
            { label: "50 mg/mL", mgPerMl: 50.0 }
          ],
          maxSingleDoseMg: 150.0,
          warnings: ["Emergency rescue dose when IV access is lost."],
          requiresClinicalReview: true,
          reference: { organization: "Pediatric Anesthesia", guideline: "Laryngospasm Protocol", section: "IM Rescue" }
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
          warnings: ["Stock concentration (30 mg/mL) must be diluted before administration."],
          requiresClinicalReview: true,
          reference: { organization: "Pediatric Anesthesia", guideline: "Hemodynamic Management", section: "Vasopressors" }
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
          doseMin: 5.0,
          doseMax: 10.0,
          defaultDoseValue: 5.0,
          doseUnit: "mcg/kg",
          concentrationOptions: [
            { label: "100 mcg/mL (0.1 mg/mL)", mgPerMl: 0.1 }
          ],
          maxSingleDoseMcg: 500.0,
          warnings: ["Pure alpha-1 agonist; may cause reflex bradycardia."],
          requiresClinicalReview: true,
          reference: { organization: "Pediatric Anesthesia", guideline: "Hemodynamic Management", section: "Phenylephrine" }
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
      category: "Electrolyte / Bronchodilator",
      isHighAlert: true,

      indications: [
        {
          id: "torsades",
          title: "Torsades de Pointes / Severe Asthma",
          context: "arrhythmia",
          route: "IV / IO Infusion",
          doseType: "range_mg_kg",
          doseMin: 25.0,
          doseMax: 50.0,
          defaultDoseValue: 25.0,
          doseUnit: "mg/kg",
          concentrationOptions: [
            { label: "10% Solution (100 mg/mL — Diluted)", mgPerMl: 100.0 },
            { label: "50% Solution (500 mg/mL — Stock)", mgPerMl: 500.0 }
          ],
          maxSingleDoseMg: 2000.0,
          warnings: ["Dilute 50% stock solution to 10-20% before IV infusion to prevent phlebitis and hypotension."],
          requiresClinicalReview: true,
          reference: { organization: "AHA/AAP", guideline: "PALS 2025/2026", section: "Magnesium Sulfate" }
        }
      ]
    },

    // -----------------------------------------------------------------------
    // 13. DEXTROSE
    // -----------------------------------------------------------------------
    {
      id: "dextrose_10",
      name: "Dextrose Solutions",
      arabicName: "محلول السكر (ديكستروز)",
      category: "Glucose / Metabolic Emergency",
      isHighAlert: false,

      indications: [
        {
          id: "hypoglycemia_d10",
          title: "نقص سكر الدم (D10W — للرضع والأطفال)",
          context: "metabolic_emergency",
          route: "IV",
          doseType: "range_ml_kg",
          doseMin: 2.0,
          doseMax: 4.0,
          defaultDoseValue: 2.0,
          doseUnit: "mL/kg D10W",
          concentrationOptions: [
            { label: "D10W (100 mg/mL)", mgPerMl: 100.0 }
          ],
          maxSingleVolumeMl: 250.0,
          warnings: ["2 mL/kg of D10W provides 0.2 g/kg dextrose."],
          requiresClinicalReview: true,
          reference: { organization: "AHA/AAP", guideline: "PALS 2025/2026", section: "Hypoglycemia" }
        },
        {
          id: "hypoglycemia_d25",
          title: "نقص سكر الدم (D25W — للأطفال الكبار > 2 سنة)",
          context: "metabolic_emergency",
          route: "IV",
          doseType: "range_ml_kg",
          doseMin: 1.0,
          doseMax: 2.0,
          defaultDoseValue: 1.0,
          doseUnit: "mL/kg D25W",
          concentrationOptions: [
            { label: "D25W (250 mg/mL)", mgPerMl: 250.0 }
          ],
          maxSingleVolumeMl: 100.0,
          warnings: ["Do not use D25W in neonates or small infants."],
          requiresClinicalReview: true,
          reference: { organization: "AHA/AAP", guideline: "PALS 2025/2026", section: "Hypoglycemia" }
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
          route: "IV / IO / IM / IN",
          doseType: "range_mg_kg",
          doseMin: 0.01,
          doseMax: 0.1,
          defaultDoseValue: 0.01,
          doseUnit: "mg/kg",
          concentrationOptions: [
            { label: "0.4 mg/mL", mgPerMl: 0.4 }
          ],
          maxSingleDoseMg: 2.0,
          warnings: ["Titrate to adequate spontaneous respiration."],
          requiresClinicalReview: true,
          reference: { organization: "Pediatric Emergency", guideline: "Opioid Toxicity", section: "Naloxone" }
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
          concentrationOptions: [
            { label: "0.1 mg/mL", mgPerMl: 0.1 }
          ],
          maxSingleDoseMg: 0.2,
          maxCumulativeDoseMg: 1.0,
          warnings: ["Avoid in patients with chronic benzodiazepine dependence or seizure history."],
          requiresClinicalReview: true,
          reference: { organization: "Pediatric Sedation", guideline: "Reversal Agents", section: "Flumazenil" }
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
          id: "procedural_sedation_iv",
          title: "التهدئة الإجرائية الوريدية — IV Sedation",
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
          warnings: ["Continuous SpO2 and airway monitoring required."],
          requiresClinicalReview: true,
          reference: { organization: "AAP", guideline: "Procedural Sedation", section: "Midazolam" }
        },
        {
          id: "sedation_in",
          title: "التهدئة عبر الأنف — Intranasal (IN) Sedation",
          context: "sedation",
          route: "IN (Intranasal via MAD)",
          doseType: "range_mg_kg",
          doseMin: 0.2,
          doseMax: 0.3,
          defaultDoseValue: 0.2,
          doseUnit: "mg/kg",
          concentrationOptions: [
            { label: "5 mg/mL (High Concentration)", mgPerMl: 5.0 }
          ],
          maxSingleDoseMg: 10.0,
          warnings: ["ALWAYS use the 5 mg/mL concentration for intranasal administration to minimize volume."],
          requiresClinicalReview: true,
          reference: { organization: "Pediatric Anesthesia", guideline: "Premedication", section: "Intranasal Midazolam" }
        },
        {
          id: "status_epilepticus",
          title: "النوبات الحادة / Status Epilepticus",
          context: "neurological_emergency",
          route: "IV / IO / IM / IN",
          doseType: "fixed_mg_kg",
          doseValue: 0.1,
          doseUnit: "mg/kg",
          concentrationOptions: [
            { label: "1 mg/mL", mgPerMl: 1.0 },
            { label: "5 mg/mL", mgPerMl: 5.0 }
          ],
          maxSingleDoseMg: 10.0,
          warnings: ["Monitor airway and respiration."],
          requiresClinicalReview: true,
          reference: { organization: "Pediatric Emergency", guideline: "Status Epilepticus", section: "Benzodiazepines" }
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
          id: "analgesia_iv",
          title: "تسكين الألم الوريدي — IV Analgesia",
          context: "analgesia",
          route: "IV Slow Push",
          doseType: "range_mcg_kg",
          doseMin: 0.5,
          doseMax: 2.0,
          defaultDoseValue: 1.0,
          doseUnit: "mcg/kg",
          concentrationOptions: [
            { label: "50 mcg/mL (0.05 mg/mL)", mgPerMl: 0.05 }
          ],
          maxSingleDoseMcg: 100.0,
          warnings: ["Rapid administration can cause chest wall rigidity."],
          requiresClinicalReview: true,
          reference: { organization: "AAP / Pediatric Anesthesia", guideline: "Opioid Analgesia", section: "Fentanyl" }
        },
        {
          id: "analgesia_in",
          title: "تسكين الألم عبر الأنف — Intranasal (IN) Analgesia",
          context: "analgesia",
          route: "IN (Intranasal via MAD)",
          doseType: "range_mcg_kg",
          doseMin: 1.5,
          doseMax: 2.0,
          defaultDoseValue: 1.5,
          doseUnit: "mcg/kg",
          concentrationOptions: [
            { label: "50 mcg/mL (0.05 mg/mL)", mgPerMl: 0.05 }
          ],
          maxSingleDoseMcg: 100.0,
          warnings: ["Effective non-invasive analgesia for acute pediatric pain."],
          requiresClinicalReview: true,
          reference: { organization: "Pediatric Emergency", guideline: "Acute Pain Management", section: "IN Fentanyl" }
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
      { minKgInclusive: 0.0, maxKgInclusive: 10.0, ratePerKg: 4.0 },
      { minKgExclusive: 10.0, maxKgInclusive: 20.0, ratePerKg: 2.0 },
      { minKgExclusive: 20.0, maxKgExclusive: Infinity, ratePerKg: 1.0 }
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
        "For children 28 days to 18 years who require maintenance IV fluids in acute-care populations, use isotonic maintenance fluids with appropriate potassium chloride and dextrose when clinically appropriate.",

      disclaimer:
        "The Holliday-Segar calculation estimates maintenance volume only. It does not determine fluid composition or replacement of ongoing losses.",

      reference: {
        organization: "American Academy of Pediatrics",
        guideline: "Maintenance Intravenous Fluids in Children",
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
        "Patient weight >100 kg. Verify whether actual, ideal, or dosing weight is appropriate.",
      overAgeWarning: "Patient age exceeds the pediatric reference scope.",
      neonatalWarning:
        "Neonatal patients require age- and indication-specific verification.",
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
