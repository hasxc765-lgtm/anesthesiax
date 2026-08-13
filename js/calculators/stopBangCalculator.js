/**
 * STOP-BANG Questionnaire Calculator Engine
 *
 * AnesthesiaX — Phase 8.4
 * File: js/calculators/stopBangCalculator.js
 *
 * Pure Logic Module.
 * Strictly decoupled from DOM, UI, window, and State.
 * Consumes stopBangData.js and returns a safe, validated assessment.
 */

import { stopBangData } from "../data/stopBangData.js";

export class StopBangCalculator {
  /**
   * Calculates total STOP-BANG score and risk tier based on checked item IDs
   * @param {Array<string>} selectedItemIds - List of checked item IDs
   * @returns {Object} Standardized result object
   */
  static calculate(selectedItemIds = []) {
    try {
      // 1. Input Validation: Ensure input is an array
      if (!Array.isArray(selectedItemIds)) {
        selectedItemIds = [];
      }

      // 2. Prevent Duplicate Factor IDs using Set
      const uniqueIds = Array.from(new Set(selectedItemIds));

      // 3. Map valid item IDs from stopBangData & verify key uniqueness in source data
      const validItemsMap = new Map();
      stopBangData.items.forEach(item => {
        if (!validItemsMap.has(item.id)) {
          validItemsMap.set(item.id, item);
        }
      });

      // 4. Filter out unknown or non-existent IDs
      const sanitizedIds = uniqueIds.filter(id => validItemsMap.has(id));

      // 5. Calculate Score and Categorize Items
      let totalScore = 0;
      let stopScore = 0;
      const matchedItems = [];

      sanitizedIds.forEach(id => {
        const itemInfo = validItemsMap.get(id);
        if (itemInfo) {
          totalScore += 1;
          if (itemInfo.category === "STOP") {
            stopScore += 1;
          }
          matchedItems.push({
            id: itemInfo.id,
            label: itemInfo.label,
            category: itemInfo.category
          });
        }
      });

      // 6. Standard Primary Risk Stratification (Standard 0-2, 3-4, 5-8)
      let tier;
      if (totalScore >= 5) {
        tier = stopBangData.riskTiers.find(t => t.id === "high");
      } else if (totalScore >= 3) {
        tier = stopBangData.riskTiers.find(t => t.id === "intermediate");
      } else {
        tier = stopBangData.riskTiers.find(t => t.id === "low");
      }

      if (!tier) {
        tier = stopBangData.riskTiers[0];
      }

      // 7. Separate Refined High-Risk Phenotype Flag (Chung et al. 2012 Refinement)
      // Note: This flag is kept as auxiliary metadata only and does NOT override standard tierLabel.
      const isHighRiskRefinedCombo =
        stopScore >= 2 &&
        (sanitizedIds.includes("male_gender") ||
         sanitizedIds.includes("bmi_over_35") ||
         sanitizedIds.includes("neck_over_40cm"));

      return {
        success: true,
        score: totalScore,
        stopScore: stopScore,
        isHighRiskRefinedCombo: isHighRiskRefinedCombo,
        tierLabel: tier.tierLabel,
        recommendation: tier.recommendation,
        matchedItems: matchedItems
      };
    } catch (error) {
      // Safe fallback object to prevent application crashes
      return {
        success: false,
        score: 0,
        stopScore: 0,
        isHighRiskRefinedCombo: false,
        tierLabel: "خطأ في التقييم",
        recommendation: "حدث خطأ غير متوقع أثناء حساب نتائج STOP-BANG. يرجى مراجعة المدخلات.",
        matchedItems: [],
        error: error?.message || "Unknown error"
      };
    }
  }
}
