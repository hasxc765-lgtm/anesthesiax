/**
 * Modified Frailty Index 5-Item (mFI-5) Calculator Engine
 *
 * AnesthesiaX — Phase 8.5
 * File: js/calculators/frailtyCalculator.js
 *
 * Pure Logic Module.
 * Strictly decoupled from DOM, UI, window, and State.
 * Consumes frailtyData.js and calculates mFI-5 Score & Frailty Ratio.
 */

import { frailtyData } from "../data/frailtyData.js";

export class FrailtyCalculator {
  /**
   * Calculates mFI-5 Score (0 to 5) and Frailty Index Ratio (0.0 to 1.0)
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

      // 3. Map valid item IDs from frailtyData & verify key uniqueness and valid numeric points
      const validItemsMap = new Map();
      frailtyData.items.forEach(item => {
        if (!validItemsMap.has(item.id)) {
          const numericPoints = typeof item.points === "number" && !isNaN(item.points) ? item.points : 1;
          validItemsMap.set(item.id, {
            ...item,
            points: numericPoints
          });
        }
      });

      // 4. Filter out unknown or non-existent IDs
      const sanitizedIds = uniqueIds.filter(id => validItemsMap.has(id));

      // 5. Calculate Total mFI-5 Score with safe numerical check
      let totalScore = 0;
      const matchedItems = [];

      sanitizedIds.forEach(id => {
        const itemInfo = validItemsMap.get(id);
        if (itemInfo && typeof itemInfo.points === "number" && !isNaN(itemInfo.points)) {
          totalScore += itemInfo.points;
          matchedItems.push({
            id: itemInfo.id,
            label: itemInfo.label,
            points: itemInfo.points
          });
        }
      });

      // 6. Calculate Frailty Ratio (Score / 5)
      const frailtyIndexRatio = parseFloat((totalScore / 5).toFixed(2));

      // 7. Determine Frailty Tier Context
      let tier = frailtyData.tiers.find(
        t => totalScore >= t.scoreMin && totalScore <= t.scoreMax
      );

      if (!tier) {
        tier = frailtyData.tiers[0];
      }

      return {
        success: true,
        score: totalScore,
        frailtyIndexRatio: frailtyIndexRatio,
        tierLabel: tier.tierLabel,
        ratioLabel: tier.ratioLabel,
        recommendation: tier.recommendation,
        matchedItems: matchedItems
      };
    } catch (error) {
      // Safe fallback object to prevent application crashes
      return {
        success: false,
        score: 0,
        frailtyIndexRatio: 0.0,
        tierLabel: "خطأ في التقييم",
        ratioLabel: "0.0",
        recommendation: "حدث خطأ غير متوقع أثناء حساب نتائج mFI-5. يرجى مراجعة المدخلات.",
        matchedItems: [],
        error: error?.message || "Unknown error"
      };
    }
  }
}
