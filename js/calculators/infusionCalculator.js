/**
 * Continuous Infusion Calculator Engine Core (Phase 6.1 - Refactored)
 * Clinical References: FDA Infusion Pump Safety / ASA Guidelines / ISMP High-Alert Standards
 */

// قائمة الوحدات المسموحة للجرعات
export const SUPPORTED_DOSE_UNITS = [
  { id: 'mcg_kg_min', label: 'mcg/kg/min', requiresWeight: true, timeFactor: 60, baseUnit: 'mcg' },
  { id: 'mcg_kg_hr', label: 'mcg/kg/hr', requiresWeight: true, timeFactor: 1, baseUnit: 'mcg' },
  { id: 'mg_kg_hr', label: 'mg/kg/hr', requiresWeight: true, timeFactor: 1, baseUnit: 'mg' },
  { id: 'mcg_hr', label: 'mcg/hr', requiresWeight: false, timeFactor: 1, baseUnit: 'mcg' },
  { id: 'mg_hr', label: 'mg/hr', requiresWeight: false, timeFactor: 1, baseUnit: 'mg' },
  { id: 'units_hr', label: 'units/hr', requiresWeight: false, timeFactor: 1, baseUnit: 'units' },
  { id: 'units_min', label: 'units/min', requiresWeight: false, timeFactor: 60, baseUnit: 'units' },
  { id: 'units_kg_hr', label: 'units/kg/hr', requiresWeight: true, timeFactor: 1, baseUnit: 'units' }
];

// قائمة الوحدات المسموحة لكميات الدواء في السرنجة
export const SUPPORTED_AMOUNT_UNITS = [
  { id: 'mg', label: 'mg' },
  { id: 'mcg', label: 'mcg' },
  { id: 'units', label: 'units' }
];

// قائمة الوحدات المسموحة لتركيز السرنجة
export const SUPPORTED_CONCENTRATION_UNITS = [
  { id: 'mg/mL', label: 'mg/mL', baseUnit: 'mg' },
  { id: 'mcg/mL', label: 'mcg/mL', baseUnit: 'mcg' },
  { id: 'units/mL', label: 'units/mL', baseUnit: 'units' }
];

/**
 * 1. حساب التركيز النهائي للسرنجة (Syringe / Dilution Setup)
 */
export function calculateSyringeConcentration({ drugAmount, amountUnitKey = 'mg', finalVolumeMl }) {
  const amount = parseFloat(drugAmount);
  const volume = parseFloat(finalVolumeMl);

  const amountUnitObj = SUPPORTED_AMOUNT_UNITS.find(u => u.id === amountUnitKey);
  if (!amountUnitObj) {
    return {
      isValid: false,
      error: "وحدة كمية الدواء المحددة غير مدعومة."
    };
  }

  if (isNaN(amount) || amount <= 0 || !Number.isFinite(amount)) {
    return {
      isValid: false,
      error: "يرجى إدخال كمية دواء صحيحة أكبر من الصفر."
    };
  }

  if (isNaN(volume) || volume <= 0 || !Number.isFinite(volume)) {
    return {
      isValid: false,
      error: "يرجى إدخال حجم سرنجة نهائي صحيح أكبر من الصفر."
    };
  }

  const concentration = amount / volume;

  if (!Number.isFinite(concentration) || concentration <= 0) {
    return {
      isValid: false,
      error: "خطأ في حساب التركيز النهائي للسرنجة."
    };
  }

  const generatedConcUnit = `${amountUnitObj.id}/mL`;

  return {
    isValid: true,
    drugAmount: amount,
    amountUnit: amountUnitObj.id,
    finalVolumeMl: volume,
    concentrationValue: concentration,
    concentrationUnit: generatedConcUnit
  };
}

/**
 * 2. حساب معدل الضخ بالمضخة (Dose -> Pump Rate mL/hr)
 */
export function calculateInfusionRate({
  patientWeight,
  doseValue,
  doseUnitKey = 'mcg_kg_min',
  concentrationValue,
  concentrationUnitKey = 'mg/mL',
  isHighAlertDrug = false
}) {
  const weight = parseFloat(patientWeight);
  const dose = parseFloat(doseValue);
  const conc = parseFloat(concentrationValue);

  // Modification 1: Remove fallback and return explicit error for unknown dose unit
  const doseUnitObj = SUPPORTED_DOSE_UNITS.find(u => u.id === doseUnitKey);
  if (!doseUnitObj) {
    return {
      isValid: false,
      error: "وحدة جرعة التسريب المحددة غير مدعومة."
    };
  }

  const concUnitObj = SUPPORTED_CONCENTRATION_UNITS.find(u => u.id === concentrationUnitKey);
  if (!concUnitObj) {
    return {
      isValid: false,
      error: "وحدة تركيز السرنجة المحددة غير مدعومة."
    };
  }

  // Strict Unit Compatibility Verification
  const doseBase = doseUnitObj.baseUnit; // 'mcg' | 'mg' | 'units'
  const concBase = concUnitObj.baseUnit; // 'mcg' | 'mg' | 'units'

  if (doseBase === 'units' && concBase !== 'units') {
    return {
      isValid: false,
      error: "وحدات غير متوافقة: الجرعة المحددة بالوحدات (units) تتطلب تركيزاً بـ (units/mL)."
    };
  }

  if (doseBase !== 'units' && concBase === 'units') {
    return {
      isValid: false,
      error: "وحدات غير متوافقة: لا يمكن حساب جرعة بالكتلة (mg/mcg) مع تركيز بالوحدات (units/mL)."
    };
  }

  // Input Numeric Validations
  if (doseUnitObj.requiresWeight && (isNaN(weight) || weight <= 0 || weight > 300 || !Number.isFinite(weight))) {
    return {
      isValid: false,
      error: "الجرعة المحددة تتطلب إدخال وزن صحيح للمريض (بالكجم)."
    };
  }

  if (isNaN(dose) || dose <= 0 || !Number.isFinite(dose)) {
    return {
      isValid: false,
      error: "يرجى إدخال قيمة جرعة تسريب صحيحة وأكبر من الصفر."
    };
  }

  if (isNaN(conc) || conc <= 0 || !Number.isFinite(conc)) {
    return {
      isValid: false,
      error: "يرجى إدخال قيمة تركيز سرنجة صحيحة وأكبر من الصفر."
    };
  }

  // Calculation of Total Hourly Dose
  let totalHourlyDose = dose * doseUnitObj.timeFactor;
  if (doseUnitObj.requiresWeight) {
    totalHourlyDose *= weight;
  }

  // Conversion Factor to Align Units Internal Conversion
  let effectiveConc = conc;

  if (doseBase === 'mcg' && concBase === 'mg') {
    // 1 mg/mL = 1000 mcg/mL
    effectiveConc = conc * 1000;
  } else if (doseBase === 'mg' && concBase === 'mcg') {
    // 1 mcg/mL = 0.001 mg/mL
    effectiveConc = conc / 1000;
  }

  // Modification 2: Validation check via Number.isFinite() after internal unit conversion
  if (isNaN(effectiveConc) || !Number.isFinite(effectiveConc) || effectiveConc <= 0) {
    return {
      isValid: false,
      error: "خطأ في تحويل تركيز السرنجة إلى الوحدة الداخلية."
    };
  }

  const pumpRateMlHr = totalHourlyDose / effectiveConc;

  // Final Safety Check on Calculation Result
  if (isNaN(pumpRateMlHr) || !Number.isFinite(pumpRateMlHr) || pumpRateMlHr <= 0) {
    return {
      isValid: false,
      error: "خطأ في النتيجة الحسابية. يرجى المراجعة والتحقق من القوانين والمدخلات."
    };
  }

  // Modification 3: Renamed to Unusually High Pump Rate & clarified non-universal nature
  const isUnusuallyHighRate = pumpRateMlHr > 200;

  return {
    isValid: true,
    patientWeight: doseUnitObj.requiresWeight ? weight : null,
    doseValue: dose,
    doseUnitLabel: doseUnitObj.label,
    totalHourlyDose,
    totalHourlyDoseUnit: `${doseBase}/hr`,
    concentrationValue: conc,
    concentrationUnitLabel: concUnitObj.label,
    effectiveConcInDoseBase: effectiveConc,
    pumpRateMlHr,
    isHighAlert: Boolean(isHighAlertDrug),
    isUnusuallyHighRate,
    unusuallyHighRateMessage: isUnusuallyHighRate ? "⚠️ تنبيه فحص (Unusually High Pump Rate): معدل الضخ أعلى من 200 mL/hr. يُرجى مراجعة الجرعة والتركيز (ملاحظة: هذا تنبيه تدقيق وليس حداً سريرياً قاطعاً)." : null
  };
}
