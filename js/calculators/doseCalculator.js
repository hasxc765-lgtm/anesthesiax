export function calculateDose(weight, indication, concentrationValue, concentrationUnit) {
  // 1. التحقق من صحة المدخلات
  if (!weight || weight < 0.5 || weight > 300) {
    return { isValid: false, error: "يرجى إدخال وزن صحيح بين 0.5 kg و 300 kg" };
  }
  if (!concentrationValue || concentrationValue <= 0) {
    return { isValid: false, error: "يرجى إدخال تركيز صحيح للأنبول" };
  }

  const { doseConfig } = indication;
  let doseMin = 0;
  let doseMax = 0;
  let isCapped = false;

  // 2. حساب الجرعة الإجمالية حسب نوع الجرعة
  if (doseConfig.doseType === "fixed_mg" || doseConfig.doseType === "fixed_mcg") {
    doseMin = doseConfig.doseMin;
    doseMax = doseConfig.doseMax;
  } else {
    doseMin = weight * doseConfig.doseMin;
    doseMax = weight * doseConfig.doseMax;
  }

  // 3. تطبيق سقف الجرعة القصوى إن وجد
  if (doseConfig.maxDoseLimit !== null && doseConfig.maxDoseLimit > 0) {
    if (doseMax > doseConfig.maxDoseLimit) {
      doseMax = doseConfig.maxDoseLimit;
      isCapped = true;
    }
    if (doseMin > doseConfig.maxDoseLimit) {
      doseMin = doseConfig.maxDoseLimit;
    }
  }

  // 4. توحيد الوحدات لحساب حجم السرنجة (mL)
  let doseMassUnit = doseConfig.doseType.includes("mcg") ? "mcg" : "mg";
  let doseMinInConcUnit = doseMin;
  let doseMaxInConcUnit = doseMax;

  // تحويل mcg إلى mg إذا كان التركيز بـ mg/mL
  if (doseMassUnit === "mcg" && concentrationUnit === "mg/mL") {
    doseMinInConcUnit = doseMin / 1000;
    doseMaxInConcUnit = doseMax / 1000;
  } 
  // تحويل mg إلى mcg إذا كان التركيز بـ mcg/mL
  else if (doseMassUnit === "mg" && concentrationUnit === "mcg/mL") {
    doseMinInConcUnit = doseMin * 1000;
    doseMaxInConcUnit = doseMax * 1000;
  }

  // 5. حساب الحجم المطلوب بالسرنجة
  const volMin = (doseMinInConcUnit / concentrationValue).toFixed(2);
  const volMax = (doseMaxInConcUnit / concentrationValue).toFixed(2);

  return {
    isValid: true,
    doseMin: doseMin.toFixed(1),
    doseMax: doseMax.toFixed(1),
    doseUnit: doseMassUnit,
    volMin,
    volMax,
    isCapped,
    maxDoseLimit: doseConfig.maxDoseLimit
  };
}
