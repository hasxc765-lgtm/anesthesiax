/**
 * Regional Anesthesia & LAST Emergency Calculator Engine (Phase 5)
 * Clinical References: ASRA Practice Advisory / NYSORA / Miller's Anesthesia
 */

export const localAnestheticsDB = {
  bupivacaine: {
    id: 'bupivacaine',
    name: 'Bupivacaine',
    arabicName: 'بوفيفاكايين (Marcaine)',
    plainMaxMgKg: 2.0,
    epiMaxMgKg: 3.0,
    plainMaxAbsoluteMg: 175,
    epiMaxAbsoluteMg: 225,
    defaultConcentrationMgMl: 5.0, // 0.5% = 5 mg/mL
    availableConcentrations: [
      { label: '0.125% (1.25 mg/mL)', value: 1.25 },
      { label: '0.25% (2.5 mg/mL)', value: 2.5 },
      { label: '0.5% (5.0 mg/mL)', value: 5.0 },
      { label: '0.75% (7.5 mg/mL)', value: 7.5 }
    ]
  },
  ropivacaine: {
    id: 'ropivacaine',
    name: 'Ropivacaine',
    arabicName: 'روبيفاكايين (Naropin)',
    plainMaxMgKg: 3.0,
    epiMaxMgKg: 3.5,
    plainMaxAbsoluteMg: 225,
    epiMaxAbsoluteMg: 300,
    defaultConcentrationMgMl: 5.0, // 0.5% = 5 mg/mL
    availableConcentrations: [
      { label: '0.2% (2.0 mg/mL)', value: 2.0 },
      { label: '0.5% (5.0 mg/mL)', value: 5.0 },
      { label: '0.75% (7.5 mg/mL)', value: 7.5 },
      { label: '1.0% (10.0 mg/mL)', value: 10.0 }
    ]
  },
  lidocaine: {
    id: 'lidocaine',
    name: 'Lidocaine',
    arabicName: 'ليدوكايين (Xylocaine)',
    plainMaxMgKg: 5.0,
    epiMaxMgKg: 7.0,
    plainMaxAbsoluteMg: 300,
    epiMaxAbsoluteMg: 500,
    defaultConcentrationMgMl: 10.0, // 1% = 10 mg/mL
    availableConcentrations: [
      { label: '0.5% (5.0 mg/mL)', value: 5.0 },
      { label: '1.0% (10.0 mg/mL)', value: 10.0 },
      { label: '2.0% (20.0 mg/mL)', value: 20.0 }
    ]
  },
  mepivacaine: {
    id: 'mepivacaine',
    name: 'Mepivacaine',
    arabicName: 'ميبيفاكايين (Carbocaine)',
    plainMaxMgKg: 5.0,
    epiMaxMgKg: 7.0,
    plainMaxAbsoluteMg: 400,
    epiMaxAbsoluteMg: 500,
    defaultConcentrationMgMl: 10.0, // 1% = 10 mg/mL
    availableConcentrations: [
      { label: '1.0% (10.0 mg/mL)', value: 10.0 },
      { label: '1.5% (15.0 mg/mL)', value: 15.0 },
      { label: '2.0% (20.0 mg/mL)', value: 20.0 }
    ]
  },
  prilocaine: {
    id: 'prilocaine',
    name: 'Prilocaine',
    arabicName: 'بريلوكايين (Citanest)',
    plainMaxMgKg: 6.0,
    epiMaxMgKg: 8.0,
    plainMaxAbsoluteMg: 400,
    epiMaxAbsoluteMg: 600,
    defaultConcentrationMgMl: 10.0, // 1% = 10 mg/mL
    availableConcentrations: [
      { label: '1.0% (10.0 mg/mL)', value: 10.0 },
      { label: '2.0% (20.0 mg/mL)', value: 20.0 },
      { label: '3.0% (30.0 mg/mL)', value: 30.0 }
    ]
  }
};

export function calculateRegionalParams({
  weightKg,
  drugKey = 'bupivacaine',
  withEpinephrine = false,
  concentrationMgMl = 0
}) {
  const weight = parseFloat(weightKg);

  // Input Validation
  if (isNaN(weight) || weight <= 0 || weight > 300) {
    return {
      isValid: false,
      error: "يرجى إدخال وزن صحيح للمريض لحساب الجرعة المرجعية القصوى وبروتوكول إنقاذ LAST."
    };
  }

  const drug = localAnestheticsDB[drugKey] || localAnestheticsDB.bupivacaine;
  const maxMgKg = withEpinephrine ? drug.epiMaxMgKg : drug.plainMaxMgKg;
  const maxAbsoluteMg = withEpinephrine ? drug.epiMaxAbsoluteMg : drug.plainMaxAbsoluteMg;

  // Unrounded precise weight-based calculation
  const weightBasedDoseMg = weight * maxMgKg;
  const isAbsoluteCapApplied = weightBasedDoseMg > maxAbsoluteMg;
  const calculatedMaxDoseMg = Math.min(weightBasedDoseMg, maxAbsoluteMg);

  // Concentration validation & resolution
  const conc = parseFloat(concentrationMgMl) > 0 
    ? parseFloat(concentrationMgMl) 
    : drug.defaultConcentrationMgMl;

  // Volume calculation with float precision
  const maxReferenceVolumeMl = conc > 0 ? (calculatedMaxDoseMg / conc) : 0;

  // =========================================================
  // LAST Emergency Rescue Protocol (Lipid Emulsion 20%)
  // =========================================================
  // Initial Bolus: 1.5 mL/kg IV over 1 min
  const lipidBolusMl = weight * 1.5;
  
  // Continuous Infusion: 0.25 mL/kg/min => mL/hr = weight * 0.25 * 60
  const lipidInfusionMlMin = weight * 0.25;
  const lipidInfusionMlHr = weight * 0.25 * 60;

  // Maximum Cumulative Reference Ceiling Limit: 12 mL/kg (Not a target)
  const lipidMaxCumulativeMl = weight * 12;

  return {
    isValid: true,
    weight,
    drugKey: drug.id,
    drugName: drug.name,
    arabicName: drug.arabicName,
    withEpinephrine,
    maxMgKg,
    maxAbsoluteMg,
    weightBasedDoseMg,
    calculatedMaxDoseMg,
    isAbsoluteCapApplied,
    concentrationMgMl: conc,
    maxReferenceVolumeMl,
    // LAST Rescue Protocol Raw Values (No early rounding)
    lipidBolusMl,
    lipidInfusionMlMin,
    lipidInfusionMlHr,
    lipidMaxCumulativeMl
  };
}
