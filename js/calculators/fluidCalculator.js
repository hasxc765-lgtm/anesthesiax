/**
 * حاسبة السوائل والنزف المسموح به (Fluid & ABL Calculator Engine)
 * المراجع: Miller's Anesthesia / ASA & ESAIC Guidelines / ERAS Protocols
 */

export function calculateFluidParams({
  weightKg,
  fastingHours = 6,
  strategy = 'eras', // 'eras' | 'traditional'
  surgicalTrauma = 'moderate', // 'minimal' | 'moderate' | 'severe' | 'none'
  ageGroup = 'adult_male', // 'premature' | 'neonate' | 'infant_child' | 'adult_male' | 'adult_female' | 'elderly_obese'
  hbInitial = 0,
  hbTarget = 0,
  currentBloodLoss = 0
}) {
  const weight = parseFloat(weightKg);

  if (isNaN(weight) || weight <= 0 || weight > 300) {
    return {
      isValid: false,
      error: "يرجى إدخال وزن المريض لحساب معدلات السوائل وحجم الدم المسموح."
    };
  }

  // =========================================================
  // 1. صيانة السوائل الأساسية (Maintenance Fluid - 4-2-1 Rule)
  // =========================================================
  let hourlyMaintenance = 0;
  if (weight <= 10) {
    hourlyMaintenance = weight * 4;
  } else if (weight <= 20) {
    hourlyMaintenance = 40 + (weight - 10) * 2;
  } else {
    hourlyMaintenance = 60 + (weight - 20) * 1;
  }

  // =========================================================
  // 2. حساب نقص السوائل بساعات الصيام (NPO Deficit)
  // =========================================================
  const hoursFasted = Math.max(0, parseFloat(fastingHours) || 0);
  const theoreticalNpoDeficit = hourlyMaintenance * hoursFasted;

  let npoNote = "";
  let npoReplacementSchedule = null;

  if (strategy === 'traditional') {
    const hr1 = (theoreticalNpoDeficit * 0.5) + hourlyMaintenance;
    const hr2 = (theoreticalNpoDeficit * 0.25) + hourlyMaintenance;
    const hr3 = (theoreticalNpoDeficit * 0.25) + hourlyMaintenance;

    npoReplacementSchedule = {
      hour1: Math.round(hr1),
      hour2: Math.round(hr2),
      hour3: Math.round(hr3)
    };
    npoNote = "الحساب التقليدي يعوض 50% من النقص النظري في الساعة الأولى و25% في الساعة الثانية والثالثة.";
  } else {
    npoNote = "توجيهات ERAS الحديثة: إذا سمح للمريض بشرب السوائل الصافية حتى ساعتين قبل العملية، يكون العجز الفعلي بسيطاً ولا يُوصى بنفخ السوائل تلقائياً لتجنب Fluid Overload.";
  }

  // =========================================================
  // 3. الفقدان الجراحي التقديري (Estimated Surgical Fluid Loss)
  // =========================================================
  let surgicalLossRateRange = "";
  let surgicalLossMlHr = "";

  switch (surgicalTrauma) {
    case 'minimal':
      surgicalLossRateRange = "1 - 2 mL/kg/hr";
      surgicalLossMlHr = `${Math.round(weight * 1)} - ${Math.round(weight * 2)} mL/hr`;
      break;
    case 'moderate':
      surgicalLossRateRange = "3 - 4 mL/kg/hr";
      surgicalLossMlHr = `${Math.round(weight * 3)} - ${Math.round(weight * 4)} mL/hr`;
      break;
    case 'severe':
      surgicalLossRateRange = "5 - 8 mL/kg/hr";
      surgicalLossMlHr = `${Math.round(weight * 5)} - ${Math.round(weight * 8)} mL/hr`;
      break;
    default:
      surgicalLossRateRange = "0 mL/kg/hr";
      surgicalLossMlHr = "0 mL/hr";
  }

  // =========================================================
  // 4. حجم الدم الكلي التقديري (Estimated Blood Volume - EBV)
  // =========================================================
  let ebvFactor = 75;
  let ebvLabel = "البالغون الذكور (75 mL/kg)";

  switch (ageGroup) {
    case 'premature':
      ebvFactor = 95;
      ebvLabel = "الخدج (95 mL/kg)";
      break;
    case 'neonate':
      ebvFactor = 85;
      ebvLabel = "حديثو الولادة (85 mL/kg)";
      break;
    case 'infant_child':
      ebvFactor = 75;
      ebvLabel = "الرضع والأطفال (75 mL/kg)";
      break;
    case 'adult_male':
      ebvFactor = 75;
      ebvLabel = "البالغون الذكور (75 mL/kg)";
      break;
    case 'adult_female':
      ebvFactor = 65;
      ebvLabel = "البالغات الإناث (65 mL/kg)";
      break;
    case 'elderly_obese':
      ebvFactor = 60;
      ebvLabel = "كبار السن / السمنة (60 mL/kg)";
      break;
  }

  const ebv = Math.round(weight * ebvFactor);

  // =========================================================
  // 5. النزف المسموح به (Allowable Blood Loss - ABL)
  // =========================================================
  const hbInit = parseFloat(hbInitial) || 0;
  const hbTarg = parseFloat(hbTarget) || 0;
  const currentLoss = Math.max(0, parseFloat(currentBloodLoss) || 0);

  let abl = 0;
  let remainingAbl = 0;
  let isAblValid = false;
  let ablError = "";

  if (hbInit > 0 && hbTarg > 0) {
    if (hbTarg >= hbInit) {
      ablError = "الهيموجلوبين المستهدف يجب أن يكون أقل من الهيموجلوبين الابتدائي.";
    } else {
      abl = Math.round((ebv * (hbInit - hbTarg)) / hbInit);
      remainingAbl = abl - currentLoss;
      isAblValid = true;
    }
  } else {
    ablError = "أدخل قيم الهيموجلوبين لحساب النزف المسموح به (ABL).";
  }

  return {
    isValid: true,
    hourlyMaintenance: Math.round(hourlyMaintenance),
    hoursFasted,
    theoreticalNpoDeficit: Math.round(theoreticalNpoDeficit),
    strategy,
    npoNote,
    npoReplacementSchedule,
    surgicalTrauma,
    surgicalLossRateRange,
    surgicalLossMlHr,
    ageGroup,
    ebvFactor,
    ebvLabel,
    ebv,
    hbInit,
    hbTarg,
    isAblValid,
    ablError,
    abl,
    currentLoss,
    remainingAbl
  };
}
