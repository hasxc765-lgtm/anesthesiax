/**
 * AnesthesiaX — Main Drugs Aggregator Dataset
 * File: js/data/drugsData.js
 *
 * Single Source of Truth for Drug Center
 * Re-exports all validated triad and supporting data modules with 100% backward compatibility.
 */

import { analgesiaData } from "./drugs/analgesiaData.js";
import { hypnosisData } from "./drugs/hypnosisData.js";
import { relaxationData } from "./drugs/relaxationData.js";
import { supportingDrugsData } from "./drugs/supportingDrugsData.js";
import { DOSE_UNITS } from "./common/doseUnits.js";

export { DOSE_UNITS };

export const drugsData = {
  // 🔺 ANESTHESIA TRIAD
  analgesia: analgesiaData,
  hypnosis: hypnosisData,
  relaxation: relaxationData,

  // 🏥 SUPPORTING & EMERGENCY
  supporting: supportingDrugsData,

  // 🌐 مصفوفة جامعة وشاملة لكافة الأدوية للتوافق مع أي حاسبة أو أداة في التطبيق
  all: [
    ...analgesiaData,
    ...hypnosisData,
    ...relaxationData,
    ...supportingDrugsData
  ]
};

export default drugsData;
