/**
 * Duke Activity Status Index (DASI) Calculator Engine
 *
 * AnesthesiaX — Phase 8.5
 * File: js/calculators/dasiCalculator.js
 *
 * Pure Logic Module.
 * Strictly decoupled from DOM, UI, window, and State.
 * Consumes dasiData.js and calculates DASI Score, Estimated Peak VO2, and Estimated METs.
 */

import { dasiData } from "../data/dasiData.js";

export class DasiCalculator {
  /**
   * Calculates DASI Score, Estimated Peak VO2, and Estimated METs
   *
   * Equations (Hlatky et al. 1989):
   * - Estimated Peak VO2 (mL/kg/min) = (0.43 × DASI Score) + 9.6
   * - Estimated METs = Estimated Peak VO2 / 3.5
   *
   * @param {Array<string>} selectedItemIds - List of checked item IDs
   * @returns {Object} Standardized result object
   */
  static calculate(selectedItemIds = []) {
    try {
      // 1. Input Validation: Ensure input is an array
      if (!Array.isArray(selectedItemIds)) {
        selectedItemIds = [];
      }

      // 2. Prevent Duplicate Item IDs using Set
      const uniqueIds = Array.from(new Set(selectedItemIds));

      // 3. Map valid item IDs from dasiData & verify key uniqueness
      const validItemsMap = new Map();
      dasiData.items.forEach(item => {
        if (!validItemsMap.has(item.id)) {
          validItemsMap.set(item.id, item);
        }
      });

      // 4. Filter out unknown or non-existent IDs
      const sanitizedIds = uniqueIds.filter(id => validItemsMap.has(id));

      // 5. Calculate Total DASI Score
      let dasiScore = 0;
      const matchedItems = [];

      sanitizedIds.forEach(id => {
        const itemInfo = validItemsMap.get(id);
        if (itemInfo) {
          dasiScore += itemInfo.points;
          matchedItems.push({
            id: itemInfo.id,
            label: itemInfo.label,
            points: itemInfo.points
          });
        }
      });

      // 6. Compute Estimated Peak VO2 and Estimated METs
      // Peak VO2 = (0.43 * DASI) + 9.6
      const estimatedPeakVo2 = parseFloat(((0.43 * dasiScore) + 9.6).toFixed(2));
      
      // 1 MET = 3.5 mL O2/kg/min
      const estimatedMets = parseFloat((estimatedPeakVo2 / 3.5).toFixed(1));

      // 7. Determine Functional Tier
      let tier = dasiData.tiers.find(t => {
        if (t.metMin !== undefined && t.metMax !== undefined) {
          return estimatedMets >= t.metMin && estimatedMets <= t.metMax;
        } else if (t.metMax !== undefined) {
          return estimatedMets <= t.metMax;
        } else if (t.metMin !== undefined) {
          return estimatedMets >= t.metMin;
        }
        return false;
      });

      if (!tier) {
        tier = dasiData.tiers[0];
      }

      return {
        success: true,
        dasiScore: parseFloat(dasiScore.toFixed(2)),
        estimatedPeakVo2: estimatedPeakVo2,
        estimatedMets: estimatedMets,
        tierLabel: tier.tierLabel,
        recommendation: tier.recommendation,
        matchedItems: matchedItems
      };
    } catch (error) {
      // Safe fallback object to prevent application crashes
      return {
        success: false,
        dasiScore: 0,
        estimatedPeakVo2: 9.6,
        estimatedMets: 2.7,
        tierLabel: "خطأ في التقييم",
        recommendation: "حدث خطأ غير متوقع أثناء حساب نتائج السعة الوظيفية. يرجى مراجعة المدخلات.",
        matchedItems: [],
        error: error?.message || "Unknown error"
      };
    }
  }
}
