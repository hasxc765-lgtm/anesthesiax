/**
 * Continuous Infusion Calculator Engine Core (Phase 6.3)
 * Data-Driven & Independent Calculation Engine
 * 
 * References:
 * - FDA Infusion Pump Safety Guidelines
 * - ISMP High-Alert Medication Standards
 */

import { infusionDrugsData } from '../data/infusionDrugs.js';

// قائمة جميع الوحدات المسموحة للجرعات
export const SUPPORTED_DOSE_UNITS = {
  'mcg_kg_min': { label: 'mcg/kg/min', requiresWeight: true, timeFactor: 60, baseUnit: 'mcg' },
  'mcg_kg_hr':  { label: 'mcg/kg/hr',  requiresWeight: true, timeFactor: 1,  baseUnit: 'mcg' },
  'mg_kg_hr':   { label: 'mg/kg/hr',   requiresWeight: true, timeFactor: 1,  baseUnit: 'mg' },
  'mcg_hr':     { label: 'mcg/hr',     requiresWeight: false, timeFactor: 1, baseUnit: 'mcg' },
  'mg_hr':      { label: 'mg/hr',      requiresWeight: false, timeFactor: 1, baseUnit: 'mg' },
  'units_hr':   { label: 'units/hr',   requiresWeight: false, timeFactor: 1, baseUnit: 'units' },
  'units_min':  { label: 'units/min',  requiresWeight: false, timeFactor: 60, baseUnit: 'units' },
  'units_kg_hr':{ label: 'units/kg/hr',requiresWeight: true, timeFactor: 1,  baseUnit: 'units' }
};

// قائمة التراكيز المسموحة
export const SUPPORTED_CONCENTRATION_UNITS = {
  'mg/mL':    { label: 'mg/mL',    baseUnit: 'mg' },
  'mcg/mL':   { label: 'mcg/mL',   baseUnit: 'mcg' },
  'units/mL': { label: 'units/mL', baseUnit: 'units' }
};

/**
 * دالة حساب معدل الضخ الأساسية (Data-Driven Infusion Rate Calculation)
 */
export function calculateInfusionRate({
  drugId = null,
  patientWeight = null,
  doseValue = null,
  doseUnitKey = 'mcg_kg_min',
  concentrationValue = null,
  concentrationUnitKey = 'mcg/mL'
}) {
  // 1. الاستعلام الديناميكي والتحقق الصارم من وجود الدواء عند تمرير drugId
  let drugObj = null;
  let isHighAlert = false;

  if (drugId) {
    drugObj = infusionDrugsData.find(d => d.id === drugId);
    if (!drugObj) {
      return {
        isValid: false,
        error: "الدواء المحدد غير موجود في قاعدة البيانات."
      };
    }
    isHighAlert = Boolean(drugObj.isHighAlert);
  }

  // 2. التحقق من وجود وإتاحة الوحدات المدخلة
  const doseUnitObj = SUPPORTED_DOSE_UNITS[doseUnitKey];
  if (!doseUnitObj) {
    return {
      isValid: false,
      error: "وحدة جرعة التسريب المحددة غير مدعومة."
    };
  }

  const concUnitObj = SUPPORTED_CONCENTRATION_UNITS[concentrationUnitKey];
  if (!concUnitObj) {
    return {
      isValid: false,
      error: "وحدة تركيز السرنجة المحددة غير مدعومة."
    };
  }

  // التحقق من أن الدواء المختار يدعم هذه الوحدة بداخل قاعدة البيانات
  if (drugObj && Array.isArray(drugObj.supportedDoseUnitKeys)) {
    if (!drugObj.supportedDoseUnitKeys.includes(doseUnitKey)) {
      return {
        isValid: false,
        error: `وحدة الجرعة (${doseUnitObj.label}) غير مدعومة لهذا الدواء.`
      };
    }
  }

  // 3. التحقق الصارم من توافق فئات الوحدات (Strict Unit Compatibility)
  const doseBase = doseUnitObj.baseUnit; // 'mcg' | 'mg' | 'units'
  const concBase = concUnitObj.baseUnit; // 'mcg' | 'mg' | 'units'

  if (doseBase === 'units' && concBase !== 'units') {
    return {
      isValid: false,
      error: "وحدات غير متوافقة: الجرعة بالوحدات (units) تتطلب تركيزاً بـ (units/mL)."
    };
  }

  if (doseBase !== 'units' && concBase === 'units') {
    return {
      isValid: false,
      error: "وحدات غير متوافقة: لا يمكن حساب جرعة بكتلة (mg/mcg) مع تركيز بالوحدات (units/mL)."
    };
  }

  // 4. التحقق الرقمي والرياضي من القيم المدخلة
  const weight = parseFloat(patientWeight);
  const dose = parseFloat(doseValue);
  const conc = parseFloat(concentrationValue);

  if (doseUnitObj.requiresWeight) {
    if (isNaN(weight) || weight <= 0 || weight > 300 || !Number.isFinite(weight)) {
      return {
        isValid: false,
        error: "الجرعة المحددة تتطلب إدخال وزن صحيح للمريض (بالكجم)."
      };
    }
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

  // 5. حساب الجرعة الساعية الإجمالية (Total Hourly Dose)
  let totalHourlyDose = dose * doseUnitObj.timeFactor;
  if (doseUnitObj.requiresWeight) {
    totalHourlyDose *= weight;
  }

  // 6. توحيد التراكيز حسابياً بين (mcg) و (mg)
  let effectiveConcInDoseBase = conc;
  if (doseBase === 'mcg' && concBase === 'mg') {
    effectiveConcInDoseBase = conc * 1000; // 1 mg/mL = 1000 mcg/mL
  } else if (doseBase === 'mg' && concBase === 'mcg') {
    effectiveConcInDoseBase = conc / 1000; // 1 mcg/mL = 0.001 mg/mL
  }

  if (isNaN(effectiveConcInDoseBase) || !Number.isFinite(effectiveConcInDoseBase) || effectiveConcInDoseBase <= 0) {
    return {
      isValid: false,
      error: "خطأ في تحويل تركيز السرنجة إلى الوحدة الداخلية."
    };
  }

  // 7. حساب معدل الضخ بالساعة (mL/hr)
  const pumpRateMlHr = totalHourlyDose / effectiveConcInDoseBase;

  if (isNaN(pumpRateMlHr) || !Number.isFinite(pumpRateMlHr) || pumpRateMlHr <= 0) {
    return {
      isValid: false,
      error: "خطأ في النتيجة الحسابية. يرجى مراجعة المدخلات."
    };
  }

  return {
    isValid: true,
    drugId: drugObj ? drugObj.id : null,
    drugName: drugObj ? drugObj.name : null,
    patientWeight: doseUnitObj.requiresWeight ? weight : null,
    doseValue: dose,
    doseUnitKey,
    doseUnitLabel: doseUnitObj.label,
    totalHourlyDose,
    totalHourlyDoseUnit: `${doseBase}/hr`,
    concentrationValue: conc,
    concentrationUnitKey,
    concentrationUnitLabel: concUnitObj.label,
    effectiveConcInDoseBase,
    pumpRateMlHr,
    isHighAlert
  };
}
