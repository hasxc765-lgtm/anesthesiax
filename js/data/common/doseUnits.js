/**
 * AnesthesiaX — Central Dose Units Enum
 * File: js/data/common/doseUnits.js
 *
 * Single Source of Truth for all dose and concentration units across AnesthesiaX.
 * Prevents unit mismatch and string literal bugs in calculator engines.
 */

export const DOSE_UNITS = Object.freeze({
  // Bolus & Fixed Units
  MG_PER_KG: "mg/kg",
  MCG_PER_KG: "mcg/kg",
  MG_FIXED: "mg",
  MCG_FIXED: "mcg",
  
  // Infusion Rate Units
  MCG_PER_KG_MIN: "mcg/kg/min",
  MCG_PER_KG_HOUR: "mcg/kg/hour",
  MG_PER_KG_HOUR: "mg/kg/hour",
  MCG_PER_MIN: "mcg/min",
  MG_PER_HOUR: "mg/hour",

  // Volatiles & Concentrations
  PERCENT_END_TIDAL: "%_end_tidal",
  PERCENT_MAC: "%_mac",
  PERCENT_LIQUID: "percent_liquid",
  MG_PER_ML: "mg/mL",
  MCG_PER_ML: "mcg/mL"
});
