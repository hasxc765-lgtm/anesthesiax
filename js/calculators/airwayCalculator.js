/**
 * حاسبة المجرى الهوائي والأنابيب (Airway Calculator Engine)
 * المراجع: Miller's Anesthesia / PALS Guidelines / NRP Protocol
 */

export function calculateAirwayParams(ageYears, weightKg, gender = 'male') {
  const age = parseFloat(ageYears);
  const weight = parseFloat(weightKg);

  const isValidWeight = !isNaN(weight) && weight > 0 && weight <= 300;
  const isValidAge = !isNaN(age) && age >= 0 && age <= 120;

  if (!isValidWeight && !isValidAge) {
    return {
      isValid: false,
      error: "يرجى إدخال وزن المريض أو عمره على الأقل لحساب قياسات المجرى الهوائي."
    };
  }

  // =========================================================
  // 1. حسابات الأنبوب الرغامي (ETT Size & Depth)
  // =========================================================
  let ettCuffed = null;
  let ettUncuffed = null;
  let ettDepth = null;

  // البالغون (العمر 16 سنة فما فوق)
  if (isValidAge && age >= 16) {
    if (gender === 'female') {
      ettCuffed = "7.0 - 7.5";
      ettUncuffed = "غير مستخدم للبالغين";
      ettDepth = "20.0 - 22.0";
    } else {
      ettCuffed = "7.5 - 8.0";
      ettUncuffed = "غير مستخدم للبالغين";
      ettDepth = "22.0 - 24.0";
    }
  } 
  // الأطفال من عمر سنة وحتى 15 سنة (معادلات Khine & Motoyama)
  else if (isValidAge && age >= 1) {
    const cuffedVal = (age / 4) + 3.5;
    const uncuffedVal = (age / 4) + 4.0;
    const depthVal = (age / 2) + 12;

    ettCuffed = cuffedVal.toFixed(1);
    ettUncuffed = uncuffedVal.toFixed(1);
    ettDepth = depthVal.toFixed(1);
  } 
  // الرضع وحديثو الولادة (أقل من سنة - الاعتماد على الوزن)
  else if (isValidWeight) {
    if (weight < 1.0) {
      ettUncuffed = "2.5";
      ettCuffed = "غير مخصص للوزن";
      ettDepth = (weight + 6).toFixed(1);
    } else if (weight < 2.0) {
      ettUncuffed = "3.0";
      ettCuffed = "3.0 (Microcuffed)";
      ettDepth = (weight + 6).toFixed(1);
    } else if (weight < 3.5) {
      ettUncuffed = "3.0 - 3.5";
      ettCuffed = "3.0 (Microcuffed)";
      ettDepth = (weight + 6).toFixed(1);
    } else {
      ettUncuffed = "3.5 - 4.0";
      ettCuffed = "3.5";
      ettDepth = "10.0 - 11.0";
    }
  } else {
    ettCuffed = "يتطلب إدخال الوزن للرضع";
    ettUncuffed = "يتطلب إدخال الوزن للرضع";
    ettDepth = "N/A";
  }

  // =========================================================
  // 2. حسابات القناع الحنجري (LMA Size & Max Cuff Volume)
  // =========================================================
  let lmaSize = "N/A";
  let lmaCuffAir = "N/A";

  if (isValidWeight) {
    if (weight < 5) { lmaSize = "Size 1"; lmaCuffAir = "Up to 4 mL"; }
    else if (weight < 10) { lmaSize = "Size 1.5"; lmaCuffAir = "Up to 7 mL"; }
    else if (weight < 20) { lmaSize = "Size 2"; lmaCuffAir = "Up to 10 mL"; }
    else if (weight < 30) { lmaSize = "Size 2.5"; lmaCuffAir = "Up to 14 mL"; }
    else if (weight < 50) { lmaSize = "Size 3"; lmaCuffAir = "Up to 20 mL"; }
    else if (weight <= 70) { lmaSize = "Size 4"; lmaCuffAir = "Up to 30 mL"; }
    else { lmaSize = "Size 5"; lmaCuffAir = "Up to 40 mL"; }
  } else if (isValidAge) {
    if (age < 1) { lmaSize = "Size 1 - 1.5"; lmaCuffAir = "4 - 7 mL"; }
    else if (age <= 2) { lmaSize = "Size 1.5 - 2"; lmaCuffAir = "7 - 10 mL"; }
    else if (age <= 5) { lmaSize = "Size 2 - 2.5"; lmaCuffAir = "10 - 14 mL"; }
    else if (age <= 10) { lmaSize = "Size 2.5 - 3"; lmaCuffAir = "14 - 20 mL"; }
    else { lmaSize = "Size 4 - 5"; lmaCuffAir = "30 - 40 mL"; }
  }

  // =========================================================
  // 3. شفرة منظار الحنجرة (Laryngoscope Blade)
  // =========================================================
  let bladeSize = "N/A";

  if (isValidAge) {
    if (age === 0 && isValidWeight && weight < 2.5) {
      bladeSize = "Miller 00 / Miller 0";
    } else if (age < 1) {
      bladeSize = "Miller 1";
    } else if (age <= 2) {
      bladeSize = "Mac 1 / Miller 1.5";
    } else if (age <= 8) {
      bladeSize = "Mac 2 / Miller 2";
    } else if (age <= 12) {
      bladeSize = "Mac 3 / Miller 2";
    } else {
      bladeSize = gender === 'female' ? "Macintosh 3" : "Macintosh 3 / Macintosh 4";
    }
  } else if (isValidWeight) {
    if (weight < 2.5) bladeSize = "Miller 00 / Miller 0";
    else if (weight < 10) bladeSize = "Miller 1";
    else if (weight < 20) bladeSize = "Mac 1 / Mac 2";
    else if (weight < 40) bladeSize = "Mac 2";
    else bladeSize = "Macintosh 3 / Macintosh 4";
  }

  // =========================================================
  // 4. الأنبوب الفموي (Oropharyngeal Airway - OPA / Guedel)
  // =========================================================
  let opaSize = "N/A";

  if (isValidWeight) {
    if (weight < 3) opaSize = "Guedel Size 000 (40 mm)";
    else if (weight < 6) opaSize = "Guedel Size 00 (50 mm)";
    else if (weight < 10) opaSize = "Guedel Size 0 (60 mm)";
    else if (weight < 20) opaSize = "Guedel Size 1 (70 mm)";
    else if (weight < 40) opaSize = "Guedel Size 2 (80 mm)";
    else if (weight < 70) opaSize = "Guedel Size 3 (90 mm)";
    else opaSize = "Guedel Size 4 (100 mm)";
  } else if (isValidAge) {
    if (age < 0.2) opaSize = "Guedel Size 00 (50 mm)";
    else if (age < 1) opaSize = "Guedel Size 0 (60 mm)";
    else if (age <= 3) opaSize = "Guedel Size 1 (70 mm)";
    else if (age <= 8) opaSize = "Guedel Size 2 (80 mm)";
    else opaSize = "Guedel Size 3 / 4 (90 - 100 mm)";
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
