/**
 * Pediatric Calculation & Safety Engine
 * AnesthesiaX — Phase 7.5 (Audited & Patched)
 * Version: 7.5-engine-strict-v3
 * 
 * Dependencies:
 * - ../data/pedsData.js
 */

import { pedsData } from "../data/pedsData.js";

export class PedsCalculator {

  // =========================================================================
  // 1. STRICT INPUT VALIDATION & CLINICAL PLAUSIBILITY ENGINE
  // =========================================================================
  static validateInputs(weightKg, ageYears, ageDays = null) {
    const alerts = [];
    const errors = [];

    const weight = parseFloat(weightKg);
    let age = parseFloat(ageYears);

    if (ageDays !== null && !isNaN(parseFloat(ageDays))) {
      const days = parseFloat(ageDays);
      if (days >= 0) {
        age = days / 365.25;
      }
    }

    if (isNaN(weight) || weight <= 0) {
      errors.push(pedsData.plausibilityConstraints.messages.invalidWeight);
    }

    if (isNaN(age) || age < 0) {
      errors.push(pedsData.plausibilityConstraints.messages.invalidAge);
    }

    if (weight > pedsData.plausibilityConstraints.highWeightThresholdKg) {
      alerts.push(pedsData.plausibilityConstraints.messages.highWeightWarning);
    }

    if (age > pedsData.plausibilityConstraints.maxPediatricAgeYears) {
      alerts.push(pedsData.plausibilityConstraints.messages.overAgeWarning);
    }

    if (age < (28 / 365.25)) {
      alerts.push(pedsData.plausibilityConstraints.messages.neonatalWarning);
    }

    // 🛡️ فحص التناسق السريري بين الوزن والعمر (Weight-for-Age Plausibility Check)
    // منع أخطاء الإدخال المطبعية (Typo) مثل إدخال 50 كجم لطفل بعمر سنتين
    if (!isNaN(weight) && !isNaN(age) && age > 0 && age <= 12) {
      const maxPlausibleWeight = (age * 4) + 20; // حد مرن مرتفع للمدى العادي
      if (weight > maxPlausibleWeight) {
        alerts.push(
          `🚨 تحذير أمان سريري حاد: الوزن المدخل (${weight} كجم) مرتفع وغير متناسب مع عمر الطفل (${age} سنة). يرجى التأكد من عدم وجود خطأ إملائي (Typo).`
        );
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      alerts,
      weight,
      age
    };
  }

  // =========================================================================
  // 2. ETT & AIRWAY ENGINE
  // =========================================================================
  static calculateAirway(weightKg, ageYears) {
    const validation = this.validateInputs(weightKg, ageYears);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    const { weight, age } = validation;
    const warnings = [...validation.alerts];

    if (age < pedsData.airwayRules.childFormulas.minAgeYearsInclusive) {
      const match = pedsData.airwayRules.neonatalInfantRanges.find(range => {
        const minOk = weight >= range.minWeightKgInclusive;
        const maxOk = range.maxWeightKgExclusive !== undefined
          ? weight < range.maxWeightKgExclusive
          : weight <= range.maxWeightKgInclusive;
        return minOk && maxOk;
      });

      const activeRange = match || pedsData.airwayRules.neonatalInfantRanges[pedsData.airwayRules.neonatalInfantRanges.length - 1];

      return {
        success: true,
        method: match ? "weight_based_lookup" : "weight_based_fallback",
        isNeonatalInfant: true,
        uncuffedSizeMm: activeRange.uncuffedSizeMm,
        cuffedSizeMm: activeRange.cuffedSizeMm,
        estimatedOralDepthCm: activeRange.estimatedOralDepthCm,
        oralDepthRangeCm: `${activeRange.oralDepthRangeMinCm}–${activeRange.oralDepthRangeMaxCm}`,
        estimatedNasalDepthCm: activeRange.estimatedNasalDepthCm,
        nasalDepthRangeCm: `${activeRange.nasalDepthRangeMinCm}–${activeRange.nasalDepthRangeMaxCm}`,
        blade: activeRange.blade,
        backupSizesMm: {
          smaller: activeRange.uncuffedSizeMm - 0.5,
          larger: activeRange.uncuffedSizeMm + 0.5
        },
        warnings: [...warnings, pedsData.airwayRules.clinicalWarnings.depthWarning]
      };
    }

    const uncuffed = (age / 4) + 4;
    const cuffed = (age / 4) + 3.5;
    const oralDepth = (age / 2) + 12;
    const nasalDepth = (age / 2) + 15;

    let blade = "Macintosh 2";
    if (age < 2) blade = "Miller 1 / Mac 1";
    else if (age >= 2 && age <= 6) blade = "Macintosh 2";
    else if (age > 6 && age <= 12) blade = "Macintosh 3";
    else blade = "Macintosh 3 / 4";

    return {
      success: true,
      method: "age_based_formula",
      isNeonatalInfant: false,
      uncuffedSizeMm: parseFloat(uncuffed.toFixed(1)),
      cuffedSizeMm: parseFloat(cuffed.toFixed(1)),
      estimatedOralDepthCm: parseFloat(oralDepth.toFixed(1)),
      estimatedNasalDepthCm: parseFloat(nasalDepth.toFixed(1)),
      blade,
      backupSizesMm: {
        smallerCuffed: parseFloat((cuffed - 0.5).toFixed(1)),
        largerCuffed: parseFloat((cuffed + 0.5).toFixed(1)),
        smallerUncuffed: parseFloat((uncuffed - 0.5).toFixed(1)),
        largerUncuffed: parseFloat((uncuffed + 0.5).toFixed(1))
      },
      warnings: [
        ...warnings,
        pedsData.airwayRules.clinicalWarnings.sizeWarning,
        pedsData.airwayRules.clinicalWarnings.depthWarning,
        pedsData.airwayRules.clinicalWarnings.cuffPressureWarning
      ]
    };
  }

  // =========================================================================
  // 3. EMERGENCY DRUG CALCULATION ENGINE
  // =========================================================================
  static calculateDrugDose(drugId, indicationId, weightKg, ageYears, selectedMgPerMl = null) {
    const validation = this.validateInputs(weightKg, ageYears);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    const { weight, age } = validation;
    const drug = pedsData.emergencyDrugs.find(d => d.id === drugId);
    if (!drug) {
      return { success: false, errors: [`Drug with ID "${drugId}" not found.`] };
    }

    const indication = drug.indications.find(i => i.id === indicationId);
    if (!indication) {
      return { success: false, errors: [`Indication with ID "${indicationId}" not found for ${drug.name}.`] };
    }

    const safetyAlerts = [...validation.alerts];
    if (drug.isHighAlert) {
      safetyAlerts.push(`HIGH ALERT MEDICATION: Verify concentration and dose independently for ${drug.name}.`);
    }
    if (indication.warnings && indication.warnings.length > 0) {
      safetyAlerts.push(...indication.warnings);
    }

    // Concentration Resolution
    let concentrationMgPerMl = selectedMgPerMl;
    if (!concentrationMgPerMl) {
      if (indication.concentration && indication.concentration.mgPerMl) {
        concentrationMgPerMl = indication.concentration.mgPerMl;
      } else if (indication.concentrationOptions && indication.concentrationOptions.length > 0) {
        concentrationMgPerMl = indication.concentrationOptions[0].mgPerMl;
      }
    }

    let rawDose = 0;
    let minDose = null;
    let maxDose = null;
    let defaultDose = null;
    let unit = indication.doseUnit;

    if (indication.doseType === "fixed_mg_kg") {
      rawDose = weight * indication.doseValue;
    } else if (indication.doseType === "range_mg_kg") {
      minDose = weight * indication.doseMin;
      maxDose = weight * indication.doseMax;
      defaultDose = weight * indication.defaultDoseValue;
      rawDose = defaultDose;
    } else if (indication.doseType === "fixed_ml_kg") {
      rawDose = weight * indication.doseValue;
    } else if (indication.doseType === "range_ml_kg") {
      minDose = weight * indication.doseMin;
      maxDose = weight * indication.doseMax;
      defaultDose = weight * indication.defaultDoseValue;
      rawDose = defaultDose;
    } else if (indication.doseType === "fixed_meq_kg") {
      rawDose = weight * indication.doseValue;
    } else if (indication.doseType === "range_meq_kg") {
      minDose = weight * indication.doseMin;
      maxDose = weight * indication.doseMax;
      defaultDose = weight * indication.defaultDoseValue;
      rawDose = defaultDose;
    } else if (indication.doseType === "range_mcg_kg") {
      minDose = weight * indication.doseMin;
      maxDose = weight * indication.doseMax;
      defaultDose = weight * indication.defaultDoseValue;
      rawDose = defaultDose;
      unit = "mcg";
    }

    // Comprehensive Maximum Limit Detection across all keys
    let maxLimit = indication.maxSingleDoseMg || 
                   indication.maxInitialDoseMg || 
                   indication.maxSingleDoseMcg || 
                   indication.maxSingleDoseMeq || 
                   indication.maxSingleVolumeMl || 
                   indication.maxSingleDoseSaltMg || null;

    if (indication.maxSingleDoseRules && indication.maxSingleDoseRules.length > 0) {
      const activeRule = indication.maxSingleDoseRules.find(rule => {
        if (rule.maxAgeYearsInclusive !== undefined && age <= rule.maxAgeYearsInclusive) return true;
        if (rule.minAgeYearsExclusive !== undefined && age > rule.minAgeYearsExclusive) return true;
        return false;
      });
      if (activeRule) {
        maxLimit = activeRule.maxDoseMg;
      }
    }

    let appliedDose = rawDose;
    let isCapped = false;
    let isMinEnforced = false;

    if (indication.minSingleDoseMg && appliedDose < indication.minSingleDoseMg) {
      appliedDose = indication.minSingleDoseMg;
      isMinEnforced = true;
      safetyAlerts.push(`Minimum single dose enforced (${indication.minSingleDoseMg} mg) to prevent paradoxical effects.`);
    }

    if (maxLimit !== null && appliedDose > maxLimit) {
      appliedDose = maxLimit;
      isCapped = true;
      safetyAlerts.push(`Calculated dose (${rawDose.toFixed(2)} ${unit}) exceeds maximum recommended limit (${maxLimit} ${unit}). Applied dose capped at ${maxLimit} ${unit}.`);
    } else if (maxLimit === null) {
      safetyAlerts.push("No configured maximum single dose limit — Clinical review required.");
    }

    let calculatedVolumeMl = null;
    if (indication.doseType.includes("ml_kg")) {
      calculatedVolumeMl = appliedDose;
    } else if (unit === "mcg" && concentrationMgPerMl) {
      calculatedVolumeMl = (appliedDose / 1000) / concentrationMgPerMl;
    } else if (concentrationMgPerMl && concentrationMgPerMl > 0) {
      calculatedVolumeMl = appliedDose / concentrationMgPerMl;
    }

    let elementalCalciumInfo = null;
    if (indication.concentration && indication.concentration.elementalCaMgPerMl) {
      const elementalCaMgPerMl = indication.concentration.elementalCaMgPerMl;
      const saltMgPerMl = indication.concentration.saltMgPerMl;
      const elementalCaDeliveredMg = calculatedVolumeMl ? calculatedVolumeMl * elementalCaMgPerMl : 0;
      elementalCalciumInfo = {
        saltSubstance: indication.concentration.substanceName || drug.name,
        saltMgPerMl,
        elementalCaMgPerMl,
        deliveredElementalCaMg: parseFloat(elementalCaDeliveredMg.toFixed(2))
      };
    }

    return {
      success: true,
      drugName: drug.name,
      arabicName: drug.arabicName,
      indicationTitle: indication.title,
      route: indication.route,
      context: indication.context,
      rawCalculatedDose: parseFloat(rawDose.toFixed(3)),
      appliedDose: parseFloat(appliedDose.toFixed(3)),
      doseUnit: unit,
      minDose: minDose ? parseFloat(minDose.toFixed(3)) : null,
      maxDose: maxDose ? parseFloat(maxDose.toFixed(3)) : null,
      maxConfiguredLimit: maxLimit,
      isCapped,
      isMinEnforced,
      requiresReview: indication.requiresClinicalReview || isCapped,
      concentrationMgPerMl,
      calculatedVolumeMl: calculatedVolumeMl ? parseFloat(calculatedVolumeMl.toFixed(2)) : null,
      elementalCalciumInfo,
      safetyAlerts
    };
  }

  // =========================================================================
  // 4. MAINTENANCE FLUID ENGINE
  // =========================================================================
  static calculateMaintenanceFluids(weightKg, ageDays = 30) {
    const validation = this.validateInputs(weightKg, null, ageDays);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    const { weight } = validation;
    const warnings = [...validation.alerts];

    if (ageDays < pedsData.maintenanceFluidRules.scope.minAgeDays) {
      warnings.push("Patient is under 28 days old. Neonatal maintenance fluid protocols (NICU) apply.");
    }

    let hourlyRateMlHr = 0;
    if (weight <= 10) {
      hourlyRateMlHr = weight * 4;
    } else if (weight <= 20) {
      hourlyRateMlHr = 40 + ((weight - 10) * 2);
    } else {
      hourlyRateMlHr = 60 + ((weight - 20) * 1);
    }

    const dailyVolumeMl24h = hourlyRateMlHr * 24;

    return {
      success: true,
      hourlyRateMlHr: parseFloat(hourlyRateMlHr.toFixed(1)),
      dailyVolumeMl24h: parseFloat(dailyVolumeMl24h.toFixed(1)),
      method: pedsData.maintenanceFluidRules.ruleName,
      guidanceTitle: pedsData.maintenanceFluidRules.compositionGuidance.title,
      guidanceRecommendation: pedsData.maintenanceFluidRules.compositionGuidance.recommendation,
      guidanceDisclaimer: pedsData.maintenanceFluidRules.compositionGuidance.disclaimer,
      warnings
    };
  }
  }
