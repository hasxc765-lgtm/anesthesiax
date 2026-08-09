export function calculateDose(
  weight,
  indication,
  concentrationValue,
  concentrationUnit,
  concConfig = null,
  isCustom = false
) {
  // ==========================================
  // 1. Basic Input Validation
  // ==========================================
  if (!Number.isFinite(weight) || weight < 0.5 || weight > 300) {
    return {
      isValid: false,
      error: "يرجى إدخال وزن صحيح بين 0.5 kg و 300 kg"
    };
  }

  if (
    !Number.isFinite(concentrationValue) ||
    concentrationValue <= 0
  ) {
    return {
      isValid: false,
      error: "يرجى إدخال تركيز صحيح للأمبول"
    };
  }

  if (!indication || !indication.doseConfig) {
    return {
      isValid: false,
      error: "بيانات الجرعة غير متوفرة لهذا الاستطباب"
    };
  }

  const doseConfig = indication.doseConfig;

  // ==========================================
  // 2. Custom Concentration Validation
  // ==========================================
  if (isCustom && concConfig) {
    const minAllowed = concConfig.minCustomConcentration;
    const maxAllowed = concConfig.maxCustomConcentration;

    if (
      minAllowed !== null &&
      minAllowed !== undefined &&
      concentrationValue < minAllowed
    ) {
      return {
        isValid: false,
        error: `التركيز المخصص أقل من الحد الأدنى المسموح (${minAllowed} ${concentrationUnit})`
      };
    }

    if (
      maxAllowed !== null &&
      maxAllowed !== undefined &&
      concentrationValue > maxAllowed
    ) {
      return {
        isValid: false,
        error: `التركيز المخصص أعلى من الحد الأقصى المسموح (${maxAllowed} ${concentrationUnit})`
      };
    }
  }

  // ==========================================
  // 3. Calculate Total Dose
  // ==========================================
  let doseMin;
  let doseMax;

  const isFixed =
    doseConfig.doseType === "fixed_mg" ||
    doseConfig.doseType === "fixed_mcg";

  if (isFixed) {
    if (
      doseConfig.fixedDoseValue !== null &&
      doseConfig.fixedDoseValue !== undefined
    ) {
      doseMin = doseConfig.fixedDoseValue;
      doseMax = doseConfig.fixedDoseValue;
    } else {
      doseMin = Number(doseConfig.doseMin) || 0;
      doseMax =
        doseConfig.doseMax !== null &&
        doseConfig.doseMax !== undefined
          ? Number(doseConfig.doseMax)
          : doseMin;
    }
  } else {
    if (
      !Number.isFinite(doseConfig.doseMin) ||
      !Number.isFinite(doseConfig.doseMax)
    ) {
      return {
        isValid: false,
        error: "نطاق الجرعة غير صالح"
      };
    }

    doseMin = weight * doseConfig.doseMin;
    doseMax = weight * doseConfig.doseMax;
  }

  // ==========================================
  // 4. Maximum Dose Limit
  // ==========================================
  let isCapped = false;

  if (
    doseConfig.maxDoseLimit !== null &&
    doseConfig.maxDoseLimit !== undefined &&
    doseConfig.maxDoseLimit > 0
  ) {
    if (doseMax > doseConfig.maxDoseLimit) {
      doseMax = doseConfig.maxDoseLimit;
      isCapped = true;
    }

    if (doseMin > doseConfig.maxDoseLimit) {
      doseMin = doseConfig.maxDoseLimit;
    }
  }

  // ==========================================
  // 5. Determine Dose Unit
  // ==========================================
  const doseMassUnit =
    doseConfig.doseType === "mcg/kg" ||
    doseConfig.doseType === "mcg/kg/min" ||
    doseConfig.doseType === "fixed_mcg"
      ? "mcg"
      : "mg";

  // ==========================================
  // 6. Validate Concentration Unit
  // ==========================================
  let concentrationMassUnit = null;

  if (concentrationUnit === "mg/mL") {
    concentrationMassUnit = "mg";
  } else if (concentrationUnit === "mcg/mL") {
    concentrationMassUnit = "mcg";
  } else {
    return {
      isValid: false,
      error: `وحدة التركيز غير مدعومة: ${concentrationUnit}`
    };
  }

  // ==========================================
  // 7. Unit Conversion
  // ==========================================
  let doseMinForVolume = doseMin;
  let doseMaxForVolume = doseMax;

  if (
    doseMassUnit === "mcg" &&
    concentrationMassUnit === "mg"
  ) {
    doseMinForVolume = doseMin / 1000;
    doseMaxForVolume = doseMax / 1000;
  } else if (
    doseMassUnit === "mg" &&
    concentrationMassUnit === "mcg"
  ) {
    doseMinForVolume = doseMin * 1000;
    doseMaxForVolume = doseMax * 1000;
  } else if (
    doseMassUnit !== concentrationMassUnit
  ) {
    return {
      isValid: false,
      error: "تركيبة وحدات الجرعة والتركيز غير مدعومة"
    };
  }

  // ==========================================
  // 8. Calculate Syringe Volume
  // ==========================================
  const volumeMin =
    doseMinForVolume / concentrationValue;

  const volumeMax =
    doseMaxForVolume / concentrationValue;

  if (
    !Number.isFinite(volumeMin) ||
    !Number.isFinite(volumeMax)
  ) {
    return {
      isValid: false,
      error: "تعذر حساب حجم السرنجة"
    };
  }

  // ==========================================
  // 9. Return Result
  // ==========================================
  return {
    isValid: true,

    doseMin: doseMin.toFixed(1),
    doseMax: doseMax.toFixed(1),
    doseUnit: doseMassUnit,

    volMin: volumeMin.toFixed(2),
    volMax: volumeMax.toFixed(2),

    isCapped,
    maxDoseLimit: doseConfig.maxDoseLimit,

    isFixed
  };
        }
