/**
 * Caprini VTE Score Calculator Engine
 *
 * AnesthesiaX — Phase 8.4
 * File: js/calculators/capriniCalculator.js
 *
 * Pure Logic Module.
 * Strictly decoupled from DOM, UI, window, and State.
 * Consumes capriniData.js and returns a safe, validated assessment.
 */

import { capriniData } from "../data/capriniData.js";

export class CapriniCalculator {
  /**
   * List of age factor IDs in order of priority/points (highest first)
   */
  static AGE_FACTOR_IDS = ["age_over_75", "age_61_74", "age_41_60"];

  /**
   * Calculates total Caprini score based on selected factor IDs
   * @param {Array<string>} selectedFactorIds - List of checked item IDs
   * @returns {Object} Standardized result object
   */
  static calculate(selectedFactorIds = []) {
    try {
      // 1. Input Validation: Ensure input is an array
      if (!Array.isArray(selectedFactorIds)) {
        selectedFactorIds = [];
      }

      // 2. Prevent Duplicate Factor IDs using Set
      const uniqueIds = Array.from(new Set(selectedFactorIds));

      // 3. Map all valid factor IDs from capriniData
      const validFactorsMap = new Map();
      capriniData.categories.forEach(category => {
        category.items.forEach(item => {
          validFactorsMap.set(item.id, {
            id: item.id,
            label: item.label,
            points: category.points
          });
        });
      });

      // 4. Filter out unknown or non-existent IDs
      let sanitizedIds = uniqueIds.filter(id => validFactorsMap.has(id));

      // 5. Handle Mutually Exclusive Age Categories (Keep highest points if multiple passed)
      const presentAgeIds = this.AGE_FACTOR_IDS.filter(ageId => sanitizedIds.includes(ageId));

      if (presentAgeIds.length > 1) {
        const highestPriorityAgeId = presentAgeIds[0];
        sanitizedIds = sanitizedIds.filter(id => !this.AGE_FACTOR_IDS.includes(id));
        sanitizedIds.push(highestPriorityAgeId);
      }

      // 6. Compute total score and build matched factors list
      let totalScore = 0;
      const matchedFactors = [];

      sanitizedIds.forEach(id => {
        const factorInfo = validFactorsMap.get(id);
        if (factorInfo) {
          totalScore += factorInfo.points;
          matchedFactors.push({
            id: factorInfo.id,
            label: factorInfo.label,
            points: factorInfo.points
          });
        }
      });

      // 7. Determine Risk Tier
      const tier = capriniData.riskTiers.find(
        t => totalScore >= t.scoreMin && totalScore <= t.scoreMax
      ) || capriniData.riskTiers[capriniData.riskTiers.length - 1];

      return {
        success: true,
        score: totalScore,
        tierLabel: tier.tierLabel,
        vteRatePercent: tier.vteRatePercent,
        recommendation: tier.recommendation,
        matchedFactors: matchedFactors
      };
    } catch (error) {
      // Safe fallback object to prevent application crashes
      return {
        success: false,
        score: 0,
        tierLabel: "خطأ في التقييم",
        vteRatePercent: "0%",
        recommendation: "حدث خطأ غير متوقع أثناء حساب نتائج كابريني. يرجى مراجعة المدخلات.",
        matchedFactors: [],
        error: error?.message || "Unknown error"
      };
    }
  }
}
