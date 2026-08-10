/**
 * Continuous Infusion Calculator Engine Core (Phase 6.3 - Fully Audited)
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
  'mcg_min':    { label: 'mcg/min',    requiresWeight: false, timeFactor: 60, baseUnit: 'mcg' },
  'mcg_hr':     { label: 'mcg/hr',     requiresWeight: false, timeFactor: 1,  baseUnit: 'mcg' },
  'mg_hr':      { label: 'mg/hr',      requiresWeight: false, timeFactor: 1,  baseUnit: 'mg' },
  'units_hr':   { label: 'units/hr',   requiresWeight: false, timeFactor: 1,  baseUnit: 'units' },
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
 * دالة تحويل النطاق السريري للوحدة المحددة من المستخدم
 */
export function convertDoseRange(doseMin, doseMax, sourceUnitKey, targetUnitKey, weightKg = 70) {
  const srcUnit = SUPPORTED_DOSE_UNITS[sourceUnitKey];
  const tgtUnit = SUPPORTED_DOSE_UNITS[targetUnitKey];

  if (!srcUnit || !tgtUnit) return { min: doseMin, max: doseMax };

  const validWeight = (weightKg && Number.isFinite(weightKg) && weightKg > 0) ? weightKg : 70;

  // 1. حساب المعدل الساعي الكلي للجرعة الأدنى والأعلى
  let hourlyMin = doseMin * srcUnit.timeFactor;
  let hourlyMax = doseMax * srcUnit.timeFactor;

  if (srcUnit.requiresWeight) {
    hourlyMin *= validWeight;
    hourlyMax *= validWeight;
  }

  // توحيد الوحدات الأساسية بين (mg) و (mcg)
  if (srcUnit.baseUnit === 'mg' && tgtUnit.baseUnit === 'mcg') {
    hourlyMin *= 1000;
    hourlyMax *= 1000;
  } else if (srcUnit.baseUnit === 'mcg' && tgtUnit.baseUnit === 'mg') {
    hourlyMin /= 1000;
    hourlyMax /= 1000;
  }

  // 2. التحويل من المعدل الساعي الكلي إلى الوحدة المستهدفة
  let convertedMin = hourlyMin / tgtUnit.timeFactor;
  let convertedMax = hourlyMax / tgtUnit.timeFactor;

  if (tgtUnit.requiresWeight) {
    convertedMin /= validWeight;
    convertedMax /= validWeight;
  }

  const formatNum = (val) => {
    if (val < 0.01) return Number(val.toFixed(4));
    if (val < 1) return Number(val.toFixed(3));
    if (val < 10) return Number(val.toFixed(2));
    return Number(val.toFixed(1));
  };

  return {
    min: formatNum(convertedMin),
    max: formatNum(convertedMax)
  };
}

/**
 * دالة حساب معدل الضخ الأساسية (Data-Driven Infusion Rate Calculation)
 */
export function calculateInfusionRate({
  drugId = null,
  indicationId = null,
  patientWeight = null,
  doseValue = null,
  doseUnitKey = 'mcg_kg_min',
  concentrationValue = null,
  concentrationUnitKey = 'mcg/mL'
}) {
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

  if (drugObj && Array.isArray(drugObj.supportedDoseUnitKeys)) {
    if (!drugObj.supportedDoseUnitKeys.includes(doseUnitKey)) {
      return {
        isValid: false,
        error: `وحدة الجرعة (${doseUnitObj.label}) غير مدعومة لهذا الدواء.`
      };
    }
  }

  const doseBase = doseUnitObj.baseUnit;
  const concBase = concUnitObj.baseUnit;

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

  const weight = parseFloat(patientWeight);
  const dose = parseFloat(doseValue);
  const conc = parseFloat(concentrationValue);

  if (doseUnitObj.requiresWeight) {
    if (isNaN(weight) || weight <= 0 || weight > 300 || !Number.isFinite(weight)) {
      return {
        isValid: false,
        error: "الجرعة المحددة تتطلب إدخال وزن صحيح للمريض أكبر من 0 كجم."
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

  // فحص الجرعة الزائدة وتحويل النطاق الآمن
  let isOverdose = false;
  let overdoseMessage = '';
  let convertedRange = null;

  if (drugObj && Array.isArray(drugObj.indications)) {
    const selectedIndication = drugObj.indications.find(i => i.id === indicationId) || drugObj.indications[0];
    if (selectedIndication) {
      convertedRange = convertDoseRange(
        selectedIndication.doseMin,
        selectedIndication.doseMax,
        selectedIndication.doseUnitKey,
        doseUnitKey,
        weight
      );

      if (dose > convertedRange.max) {
        isOverdose = true;
        overdoseMessage = `⚠️ تحذير جرعة زائدة: الجرعة المدخلة (${dose} ${doseUnitObj.label}) تتجاوز الحد الأقصى الموصى به (${convertedRange.max} ${doseUnitObj.label}).`;
      }
    }
  }

  let totalHourlyDose = dose * doseUnitObj.timeFactor;
  if (doseUnitObj.requiresWeight) {
    totalHourlyDose *= weight;
  }

  let effectiveConcInDoseBase = conc;
  if (doseBase === 'mcg' && concBase === 'mg') {
    effectiveConcInDoseBase = conc * 1000;
  } else if (doseBase === 'mg' && concBase === 'mcg') {
    effectiveConcInDoseBase = conc / 1000;
  }

  if (isNaN(effectiveConcInDoseBase) || !Number.isFinite(effectiveConcInDoseBase) || effectiveConcInDoseBase <= 0) {
    return {
      isValid: false,
      error: "خطأ في تحويل تركيز السرنجة إلى الوحدة الداخلية."
    };
  }

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
    isHighAlert,
    isOverdose,
    overdoseMessage,
    convertedRange
  };
}
