/**
 * AnesthesiaX — Airway & Endotracheal Calculator Engine
 * File: js/calculators/airwayCalculator.js
 * 
 * Clinical Evidence & Guidelines:
 * - Miller's Anesthesia 9th Ed (Airway Management & LMA Sizing)
 * - PALS / AHA Pediatric Advanced Life Support Guidelines
 * - Khine & Motoyama Cuffed ETT Formulas (0.5 mm Step Standardization)
 * - ASA Difficult Airway & Monitoring Standards
 */

// دالة مساعدة لتقريب مقاسات التيوبات لأقرب مضاعف 0.5 mm
function roundToHalf(value) {
  return (Math.round(value * 2) / 2).toFixed(1);
}

// دالة فحص التوافق الفيزيولوجي بين العمر والوزن لمنع الأخطاء الإملائية والمدخلات غير المنطقية
function validatePhysiologicalSanity(age, weight) {
  if (isNaN(age) || isNaN(weight)) return { valid: true };

  // 1. الرضع (أقل من سنة)
  if (age < 1) {
    if (weight < 1.0) return { valid: false, message: `الوزن المدخل (${weight} kg) منخفض جداً ويخص الخدج الشديدين.` };
    if (weight > 14.0) return { valid: false, message: `الوزن المدخل (${weight} kg) غير منطقي لرضيع بعمر أقل من سنة (الحد الأقصى 14 kg).` };
  }
  // 2. الأطفال من 1 إلى 2 سنة
  else if (age <= 2) {
    if (weight < 5.0) return { valid: false, message: `الوزن المدخل (${weight} kg) منخفض جداً لعمر (${age} سنة).` };
    if (weight > 18.0) return { valid: false, message: `الوزن المدخل (${weight} kg) مرتفع جداً وغير متوافق مع عمر (${age} سنة - الحد الأقصى 18 kg).` };
  }
  // 3. الأطفال من 3 إلى 5 سنوات
  else if (age <= 5) {
    if (weight < 8.0) return { valid: false, message: `الوزن المدخل (${weight} kg) منخفض جداً لعمر (${age} سنوات).` };
    if (weight > 30.0) return { valid: false, message: `الوزن المدخل (${weight} kg) غير معقول لعمر (${age} سنوات - الحد الأقصى 30 kg).` };
  }
  // 4. الأطفال من 6 إلى 10 سنوات
  else if (age <= 10) {
    if (weight < 12.0) return { valid: false, message: `الوزن المدخل (${weight} kg) منخفض جداً لعمر (${age} سنوات).` };
    if (weight > 55.0) return { valid: false, message: `الوزن المدخل (${weight} kg) غير متوافق مع عمر (${age} سنوات - الحد الأقصى 55 kg).` };
  }
  // 5. اليافعون من 11 إلى 15 سنة
  else if (age <= 15) {
    if (weight < 18.0) return { valid: false, message: `الوزن المدخل (${weight} kg) منخفض جداً لهذه الفئة العمرية.` };
    if (weight > 95.0) return { valid: false, message: `الوزن المدخل (${weight} kg) يتجاوز الحد السريري المعقول لعمر (${age} سنة).` };
  }
  // 6. البالغون (16 سنة فما فوق)
  else if (age >= 16) {
    if (weight < 28.0) return { valid: false, message: `الوزن المدخل (${weight} kg) غير منطقي لشخص بالغ (الحد الأدنى 28 kg).` };
  }

  return { valid: true };
}

export function calculateAirwayParams(ageYears, weightKg, gender = 'male') {
  const age = parseFloat(ageYears);
  const weight = parseFloat(weightKg);

  const hasWeight = !isNaN(weight) && weight > 0;
  const hasAge = !isNaN(age) && age >= 0;

  // 1. التحقق من الحدود العامة (General Bounds)
  if (!hasWeight && !hasAge) {
    return {
      isValid: false,
      error: "يرجى إدخال وزن المريض أو عمره على الأقل لحساب قياسات المجرى الهوائي."
    };
  }

  if (hasAge && (age < 0 || age > 120)) {
    return {
      isValid: false,
      error: "يرجى إدخال عمر صحيح بين 0 و 120 سنة."
    };
  }

  if (hasWeight && (weight <= 0.4 || weight > 300)) {
    return {
      isValid: false,
      error: "يرجى إدخال وزن واقعي بين 0.5 kg و 300 kg."
    };
  }

  // 2. التحقق من التوافق الفيزيولوجي (Sanity Check)
  if (hasAge && hasWeight) {
    const sanityCheck = validatePhysiologicalSanity(age, weight);
    if (!sanityCheck.valid) {
      return {
        isValid: false,
        error: `⚠️ تنبيه أمان: ${sanityCheck.message}`
      };
    }
  }

  const isAdult = (hasAge && age >= 16) || (!hasAge && hasWeight && weight >= 50);

  // =========================================================
  // 3. حسابات الأنبوب الرغامي (ETT Size & Depth)
  // =========================================================
  let ettCuffed = "N/A";
  let ettUncuffed = "N/A";
  let ettDepth = "N/A";

  // أ) البالغون
  if (isAdult) {
    if (gender === 'female') {
      ettCuffed = "7.0 mm (احتياطي: 6.5 / 7.5)";
      ettUncuffed = "غير مستخدم للبالغين";
      ettDepth = "20.0 – 21.0 cm";
    } else {
      ettCuffed = "7.5 – 8.0 mm (احتياطي: 7.0 / 8.5)";
      ettUncuffed = "غير مستخدم للبالغين";
      ettDepth = "22.0 – 23.0 cm";
    }
  } 
  // ب) الأطفال من عمر سنة وحتى 15 سنة (معادلات Khine & Motoyama بنظام 0.5 mm)
  else if (hasAge && age >= 1) {
    const rawCuffed = (age / 4) + 3.5;
    const primaryCuffed = parseFloat(roundToHalf(rawCuffed));
    const backupDownCuffed = (primaryCuffed - 0.5).toFixed(1);
    const backupUpCuffed = (primaryCuffed + 0.5).toFixed(1);
    ettCuffed = `${primaryCuffed.toFixed(1)} mm (احتياطي: ${backupDownCuffed} / ${backupUpCuffed})`;

    const rawUncuffed = (age / 4) + 4.0;
    const primaryUncuffed = parseFloat(roundToHalf(rawUncuffed));
    const backupDownUncuffed = (primaryUncuffed - 0.5).toFixed(1);
    const backupUpUncuffed = (primaryUncuffed + 0.5).toFixed(1);
    ettUncuffed = `${primaryUncuffed.toFixed(1)} mm (احتياطي: ${backupDownUncuffed} / ${backupUpUncuffed})`;

    const depthVal = (age / 2) + 12;
    ettDepth = `${depthVal.toFixed(1)} cm`;
  } 
  // ج) الرضع وحديثو الولادة (أقل من سنة - الاعتماد على الوزن)
  else if (hasWeight) {
    if (weight < 1.0) {
      ettUncuffed = "2.5 mm (احتياطي: 2.0 / 3.0)";
      ettCuffed = "غير مخصص لهذا الوزن";
      ettDepth = `${(weight + 6).toFixed(1)} cm`;
    } else if (weight < 2.5) {
      ettUncuffed = "3.0 mm (احتياطي: 2.5 / 3.5)";
      ettCuffed = "3.0 mm Microcuffed";
      ettDepth = `${(weight + 6).toFixed(1)} cm`;
    } else if (weight < 3.5) {
      ettUncuffed = "3.0 – 3.5 mm";
      ettCuffed = "3.0 mm Microcuffed";
      ettDepth = "9.0 – 9.5 cm";
    } else {
      ettUncuffed = "3.5 – 4.0 mm";
      ettCuffed = "3.0 – 3.5 mm Microcuffed";
      ettDepth = "10.0 – 10.5 cm";
    }
  } else {
    ettCuffed = "يتطلب إدخال الوزن للرضع";
    ettUncuffed = "يتطلب إدخال الوزن للرضع";
    ettDepth = "N/A";
  }

  // =========================================================
  // 4. القناع الحنجري (LMA Size & Max Cuff Air)
  // =========================================================
  let lmaSize = "N/A";
  let lmaCuffAir = "N/A";

  if (isAdult) {
    if (hasWeight && weight < 50) {
      lmaSize = "Size 3 (بالغ نحيل / صغير)";
      lmaCuffAir = "Up to 20 mL";
    } else if (gender === 'female') {
      lmaSize = (hasWeight && weight > 70) ? "Size 4 – 5" : "Size 4";
      lmaCuffAir = "Up to 30 mL";
    } else {
      lmaSize = (hasWeight && weight <= 70) ? "Size 4" : "Size 5";
      lmaCuffAir = (hasWeight && weight <= 70) ? "Up to 30 mL" : "Up to 40 mL";
    }
  } else if (hasWeight) {
    if (weight < 5) { lmaSize = "Size 1"; lmaCuffAir = "Up to 4 mL"; }
    else if (weight < 10) { lmaSize = "Size 1.5"; lmaCuffAir = "Up to 7 mL"; }
    else if (weight < 20) { lmaSize = "Size 2"; lmaCuffAir = "Up to 10 mL"; }
    else if (weight < 30) { lmaSize = "Size 2.5"; lmaCuffAir = "Up to 14 mL"; }
    else if (weight < 50) { lmaSize = "Size 3"; lmaCuffAir = "Up to 20 mL"; }
    else { lmaSize = "Size 4"; lmaCuffAir = "Up to 30 mL"; }
  } else if (hasAge) {
    if (age < 1) { lmaSize = "Size 1 – 1.5"; lmaCuffAir = "4 – 7 mL"; }
    else if (age <= 2) { lmaSize = "Size 1.5 – 2"; lmaCuffAir = "7 – 10 mL"; }
    else if (age <= 5) { lmaSize = "Size 2 – 2.5"; lmaCuffAir = "10 – 14 mL"; }
    else if (age <= 10) { lmaSize = "Size 2.5 – 3"; lmaCuffAir = "14 – 20 mL"; }
    else { lmaSize = "Size 3 – 4"; lmaCuffAir = "20 – 30 mL"; }
  }

  // =========================================================
  // 5. شفرة منظار الحنجرة (Laryngoscope Blade)
  // =========================================================
  let bladeSize = "N/A";

  if (isAdult) {
    bladeSize = gender === 'female' ? "Macintosh 3" : "Macintosh 3 – 4";
  } else if (hasAge) {
    if (age === 0 && hasWeight && weight < 2.5) {
      bladeSize = "Miller 00 / Miller 0 (مستقيمة)";
    } else if (age < 1) {
      bladeSize = "Miller 1 (مستقيمة)";
    } else if (age <= 2) {
      bladeSize = "Macintosh 1 / Miller 1.5";
    } else if (age <= 5) {
      bladeSize = "Macintosh 2 / Miller 2";
    } else if (age <= 12) {
      bladeSize = "Macintosh 2 – 3";
    } else {
      bladeSize = "Macintosh 3";
    }
  } else if (hasWeight) {
    if (weight < 2.5) bladeSize = "Miller 00 / Miller 0";
    else if (weight < 10) bladeSize = "Miller 1";
    else if (weight < 20) bladeSize = "Macintosh 1 / Mac 2";
    else if (weight < 40) bladeSize = "Macintosh 2";
    else bladeSize = "Macintosh 3";
  }

  // =========================================================
  // 6. المجرى الهوائي الفموي (Guedel / OPA)
  // =========================================================
  let opaSize = "N/A";

  if (isAdult) {
    opaSize = gender === 'female' ? "Guedel 3 (90 mm - أصفر)" : "Guedel 4 (100 mm - أحمر)";
  } else if (hasWeight) {
    if (weight < 3) opaSize = "Guedel 000 (40 mm - وردي/شفاف)";
    else if (weight < 6) opaSize = "Guedel 00 (50 mm - أزرق)";
    else if (weight < 10) opaSize = "Guedel 0 (60 mm - أسود)";
    else if (weight < 20) opaSize = "Guedel 1 (70 mm - أبيض)";
    else if (weight < 40) opaSize = "Guedel 2 (80 mm - أخضر)";
    else if (weight < 70) opaSize = "Guedel 3 (90 mm - أصفر)";
    else opaSize = "Guedel 4 (100 mm - أحمر)";
  } else if (hasAge) {
    if (age < 0.2) opaSize = "Guedel 00 (50 mm - أزرق)";
    else if (age < 1) opaSize = "Guedel 0 (60 mm - أسود)";
    else if (age <= 3) opaSize = "Guedel 1 (70 mm - أبيض)";
    else if (age <= 8) opaSize = "Guedel 2 (80 mm - أخضر)";
    else opaSize = "Guedel 3 / 4 (90 – 100 mm)";
  }

  return {
    isValid: true,
    ettCuffed,
    ettUncuffed,
    ettDepth,
    lmaSize,
    lmaCuffAir,
    bladeSize,
    opaSize
  };
}

export default calculateAirwayParams;
