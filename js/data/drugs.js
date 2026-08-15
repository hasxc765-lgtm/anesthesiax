/**
 * AnesthesiaX — Main Drugs Aggregator Dataset
 * File: js/data/drugs.js
 */

import { analgesiaData } from "./drugs/analgesiaData.js";
import { hypnosisData } from "./drugs/hypnosisData.js";
import { relaxationData } from "./drugs/relaxationData.js";
import { supportingDrugsData } from "./drugs/supportingDrugsData.js";
import { DOSE_UNITS } from "./common/doseUnits.js";

export { DOSE_UNITS };

export const drugsData = {
  analgesia: analgesiaData,
  hypnosis: hypnosisData,
  relaxation: relaxationData,
  supporting: supportingDrugsData,
  all: [
    ...analgesiaData,
    ...hypnosisData,
    ...relaxationData,
    ...supportingDrugsData
  ]
};

export default drugsData;
