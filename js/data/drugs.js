/**
 * AnesthesiaX — Main Drugs Aggregator Dataset
 * File: js/data/drugs.js
 * 
 * Aggregates all clinical categories and maps them to the 6 OR phases.
 */

import { analgesiaData } from "./drugs/analgesiaData.js";
import { hypnosisData } from "./drugs/hypnosisData.js";
import { relaxationData } from "./drugs/relaxationData.js";
import { supportingDrugsData } from "./drugs/supportingDrugsData.js";
import { DOSE_UNITS } from "./common/doseUnits.js";

export { DOSE_UNITS };

// تجميع كافة الأدوية في مصفوفة موحدة
const allDrugs = [
  ...analgesiaData,
  ...hypnosisData,
  ...relaxationData,
  ...supportingDrugsData
];

export const drugsData = {
  // 1. المهدئات (Sedation)
  sedation: allDrugs.filter(d => 
    d.classification?.category?.toLowerCase().includes("sedat") ||
    d.classification?.subCategory?.toLowerCase().includes("sedat") ||
    d.id === "midazolam" || d.id === "dexmedetomidine" || d.id === "diazepam" || d.id === "lorazepam"
  ),

  // 2. المسكنات (Analgesia)
  analgesia: analgesiaData,

  // 3. المنومات والاستحثاث الوريدي (Hypnotics)
  hypnosis: hypnosisData.filter(d => 
    !d.macModel && d.id !== "midazolam" && d.id !== "dexmedetomidine" &&
    d.id !== "sevoflurane" && d.id !== "isoflurane" && d.id !== "desflurane"
  ),

  // 4. المرخيات العضلية (Muscle Relaxants)
  relaxation: relaxationData.filter(d => d.id !== "sugammadex" && d.id !== "neostigmine"),

  // 5. الغازات الاستنشاقية (Inhalation MAC)
  inhalation: allDrugs.filter(d => 
    Boolean(d.macModel) || 
    d.classification?.category?.toLowerCase().includes("inhalat") ||
    d.id === "sevoflurane" || d.id === "isoflurane" || d.id === "desflurane"
  ),

  // 6. العكس والطوارئ والضغط (Reversal, Emergency & Pressors)
  reversalAndEmergency: allDrugs.filter(d => 
    d.classification?.triadComponent === "supporting" ||
    d.id === "sugammadex" || d.id === "neostigmine" ||
    d.id === "atropine" || d.id === "ephedrine" ||
    d.id === "noradrenaline" || d.id === "adrenaline" || d.id === "intralipid"
  ),

  // التوافق مع الكود السابق
  supporting: supportingDrugsData,
  all: allDrugs
};

export default drugsData;
