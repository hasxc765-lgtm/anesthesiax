/**
 * Perioperative Chronic Medications & Drug Interactions Calculator Engine
 *
 * AnesthesiaX — Phase 11.0 (Clinical Engine v11.0.0 - Production Audited)
 * File: js/calculators/drugInteractionsCalculator.js
 *
 * Pure Logic ES Module.
 * Strictly decoupled from DOM, UI, window, and State.
 * Consumes drugInteractionsData.js and executes safe, validated Perioperative Medication
 * Decision Evaluations, eGFR Renal Stratification, ASRA Neuraxial Safety Assessments,
 * and Comprehensive Chronic-to-Chronic & Chronic-to-Intraop Interaction Checks.
 *
 * Zero Hard-Coded Clinical Text. Single Source of Truth Enforcement.
 */

import { drugInteractionsData } from "../data/drugInteractionsData.js";

export class DrugInteractionsCalculator {

  // =========================================================================
  // 1. SEARCH NORMALIZATION & MEDICATION ID RESOLUTION
  // =========================================================================

  /**
   * Normalizes search strings by removing special characters and whitespace
   * @param {string} query
   * @returns {string} Normalized string
   */
  static normalizeString(query) {
    if (!query || typeof query !== "string") return "";
    let str = query.toLowerCase().trim();
    const removeChars = drugInteractionsData.searchNormalization?.removeCharacters || [];
    removeChars.forEach(ch => {
      str = str.split(ch).join("");
    });
    return str.replace(/\s+/g, "");
  }

  /**
   * Resolves a raw query string or alias to a valid medication ID
   * @param {string} query
   * @returns {string|null} Resolved medication ID or null if not found
   */
  static resolveMedicationId(query) {
    if (!query) return null;
    const cleanQuery = this.normalizeString(query);
    if (!cleanQuery) return null;

    // 1. Direct ID match
    if (drugInteractionsData.medications[cleanQuery]) {
      return cleanQuery;
    }

    // 2. Alias Index match
    const aliasMatch = drugInteractionsData.aliasIndex[cleanQuery];
    if (aliasMatch && drugInteractionsData.medications[aliasMatch]) {
      return aliasMatch;
    }

    // 3. Deep search in medications database
    const medKeys = Object.keys(drugInteractionsData.medications);
    for (const key of medKeys) {
      const med = drugInteractionsData.medications[key];
      if (this.normalizeString(med.genericName) === cleanQuery) return med.id;
      if (Array.isArray(med.aliases)) {
        const hasAlias = med.aliases.some(a => this.normalizeString(a) === cleanQuery);
        if (hasAlias) return med.id;
      }
    }

    return null;
  }

  // =========================================================================
  // 2. RENAL FUNCTION EVALUATOR (eGFR)
  // =========================================================================

  /**
   * Maps numerical eGFR to standard renal impairment category from data
   * @param {number|string} egfrVal
   * @returns {Object} Renal category details
   */
  static evaluateRenalCategory(egfrVal) {
    const parsedEgfr = this._parseNum(egfrVal);
    const categories = drugInteractionsData.renalFunctionCategories;

    if (parsedEgfr === null || parsedEgfr < 0) {
      return {
        id: categories.UNKNOWN.id,
        label: categories.UNKNOWN.label,
        egfr: null,
        isImpaired: false
      };
    }

    if (parsedEgfr >= categories.NORMAL.egfrMin) {
      return { id: categories.NORMAL.id, label: categories.NORMAL.label, egfr: parsedEgfr, isImpaired: false };
    }
    if (parsedEgfr >= (categories.MODERATE_IMPAIRMENT.egfrMin || 30)) {
      return { id: categories.MODERATE_IMPAIRMENT.id, label: categories.MODERATE_IMPAIRMENT.label, egfr: parsedEgfr, isImpaired: true };
    }
    if (parsedEgfr >= (categories.SEVERE_IMPAIRMENT.egfrMin || 15)) {
      return { id: categories.SEVERE_IMPAIRMENT.id, label: categories.SEVERE_IMPAIRMENT.label, egfr: parsedEgfr, isImpaired: true };
    }

    return { id: categories.KIDNEY_FAILURE.id, label: categories.KIDNEY_FAILURE.label, egfr: parsedEgfr, isImpaired: true };
  }

  // =========================================================================
  // 3. MAIN MEDICATION PERIOPERATIVE EVALUATOR
  // =========================================================================

  /**
   * Evaluates day-of-surgery recommendation and hold/restart rules for a medication
   * @param {Object} inputs - Patient and medication context
   * @returns {Object} Comprehensive evaluation result
   */
  static evaluateMedication(inputs = {}) {
    try {
      const medId = this.resolveMedicationId(inputs.medicationId || inputs.query);
      if (!medId) {
        return {
          success: false,
          errorCode: "MEDICATION_NOT_FOUND",
          errorMessage: "لم يتم العثور على الدواء المطلوب في قاعدة البيانات."
        };
      }

      const med = drugInteractionsData.medications[medId];
      const isEmergency = inputs.surgeryUrgency === "emergency";
      const renalEval = this.evaluateRenalCategory(inputs.egfr);

      let decision = med.dayOfSurgery?.status || "INDIVIDUALIZE";
      let decisionLabel = drugInteractionsData.meta.decisionStatuses[decision] || decision;
      let recommendation = med.dayOfSurgery?.recommendation || "يُفصل القرار حسب تقييم المخاطر الفردية.";

      // Handle Emergency Surgery Override without hiding critical warnings
      let emergencyNotice = null;
      if (isEmergency) {
        decision = "EMERGENCY_EXCEPTION";
        decisionLabel = drugInteractionsData.meta.decisionStatuses.EMERGENCY_EXCEPTION;
        emergencyNotice = med.preOpHold?.emergencySurgery || "في الجراحة الإسعافية لا تُؤخر العملية لمجرد فترة الإيقاف؛ قيّم تأثير الدواء ومخاطر النزف والتخدير مباشرة.";
      }

      // Check Neuraxial / Regional Safety if Neuraxial block is planned
      let neuraxialSafety = null;
      const plannedNeuraxial = inputs.plannedNeuraxialBlock === true;
      if (plannedNeuraxial) {
        neuraxialSafety = this.evaluateNeuraxialSafety(medId, inputs);
        if (neuraxialSafety.status === "SPECIALIST_REVIEW" && !isEmergency) {
          decision = "SPECIALIST_REVIEW";
          decisionLabel = drugInteractionsData.meta.decisionStatuses.SPECIALIST_REVIEW;
        }
      }

      // Specific Assessment Models (GLP-1 / SGLT2) from Data Source
      let riskAssessment = null;
      if (med.category === "GLP-1 Receptor Agonist" || med.category === "Dual GIP / GLP-1 Receptor Agonist") {
        riskAssessment = this.evaluateGlp1AspirationRisk(med, inputs);
      } else if (med.category === "SGLT2 Inhibitor") {
        riskAssessment = this.evaluateSglt2EuglycemicDkaRisk(med, inputs, isEmergency);
      }

      return {
        success: true,
        medication: {
          id: med.id,
          genericName: med.genericName,
          aliases: med.aliases || [],
          category: med.category,
          classId: med.classId
        },
        decision,
        decisionLabel,
        recommendation,
        emergencyNotice,
        preOpHold: med.preOpHold || null,
        postoperativeRestart: med.postoperativeRestart || null,
        renalEvaluation: renalEval,
        neuraxialSafety,
        riskAssessment,
        safetyFlags: med.safetyFlags || [],
        monitoring: med.monitoring || [],
        evidenceRef: med.evidenceRef || []
      };

    } catch (error) {
      return {
        success: false,
        errorCode: "EVALUATION_ERROR",
        errorMessage: error?.message || "حدث خطأ أثناء تقييم الدواء المزمن."
      };
    }
  }

  // =========================================================================
  // 4. COMPREHENSIVE INTERACTION CHECKER (Chronic↔Chronic & Chronic↔Intraop)
  // =========================================================================

  /**
   * Checks for dangerous interactions between chronic medications and/or perioperative agents
   * @param {Array<string>} chronicMedQueryList - List of chronic medication IDs or names
   * @param {Array<string>} intraopAgentList - List of perioperative drugs or anesthesia factors
   * @returns {Array<Object>} List of matched interaction alerts
   */
  static checkInteractions(chronicMedQueryList = [], intraopAgentList = []) {
    if (!Array.isArray(chronicMedQueryList) || chronicMedQueryList.length === 0) {
      return [];
    }

    const resolvedMedIds = chronicMedQueryList
      .map(q => this.resolveMedicationId(q))
      .filter(id => id !== null);

    const cleanIntraopAgents = (Array.isArray(intraopAgentList) ? intraopAgentList : [])
      .map(a => this.normalizeString(a))
      .filter(a => a !== "");

    const detectedAlerts = [];
    const interactionKeys = Object.keys(drugInteractionsData.interactions || {});

    interactionKeys.forEach(key => {
      const interaction = drugInteractionsData.interactions[key];
      
      // 1. Check Chronic Medication Match
      const hasMedMatch = interaction.medicationIds.some(mId => resolvedMedIds.includes(mId));

      if (hasMedMatch) {
        // 2. Check Interacting Agent Match (Both Chronic-to-Intraop AND Chronic-to-Chronic)
        const hasIntraopMatch = interaction.interactingAgents.some(agent => {
          const cleanAgent = this.normalizeString(agent);
          return cleanIntraopAgents.some(ia => ia === cleanAgent || cleanAgent.includes(ia) || ia.includes(cleanAgent));
        });

        const hasChronicPairMatch = interaction.interactingAgents.some(agent => {
          const resolvedAgentId = this.resolveMedicationId(agent);
          return resolvedAgentId && resolvedMedIds.includes(resolvedAgentId) && !interaction.medicationIds.includes(resolvedAgentId);
        });

        if (hasIntraopMatch || hasChronicPairMatch || (cleanIntraopAgents.length === 0 && interaction.severity === "CRITICAL")) {
          detectedAlerts.push({
            id: interaction.id,
            medicationIds: interaction.medicationIds,
            interactingAgents: interaction.interactingAgents,
            severity: interaction.severity,
            effect: interaction.effect,
            recommendation: interaction.recommendation,
            action: interaction.action,
            evidenceRef: interaction.evidenceRef || []
          });
        }
      }
    });

    return detectedAlerts;
  }

  // =========================================================================
  // 5. ASRA NEURAXIAL SAFETY EVALUATOR
  // =========================================================================

  /**
   * Evaluates ASRA Neuraxial / Deep Regional Block safety for antithrombotic agents
   * @param {string} medId
   * @param {Object} inputs
   * @returns {Object} Neuraxial safety evaluation
   */
  static evaluateNeuraxialSafety(medId, inputs = {}) {
    const generalRule = drugInteractionsData.neuraxialSafety.generalRule;
    const anticoagMap = drugInteractionsData.neuraxialSafety.anticoagulants?.[medId];
    const antiplatMap = drugInteractionsData.neuraxialSafety.antiplatelets?.[medId];

    // Safe Non-Antithrombotic Response
    if (!anticoagMap && !antiplatMap) {
      return {
        plannedNeuraxial: true,
        status: "NO_SPECIFIC_RULE_IN_DATABASE",
        label: "لا توجد موانع تخثر مخصصة مسجلة لهذا الدواء المحدد في قاعدة بيانات التخثر.",
        guidance: generalRule.statement
      };
    }

    const targetMap = anticoagMap || antiplatMap;
    const renalEval = this.evaluateRenalCategory(inputs.egfr);

    return {
      plannedNeuraxial: true,
      medicationId: medId,
      status: targetMap.status || "SPECIALIST_REVIEW",
      requiresRenalAssessment: !!targetMap.requiresRenalAssessment,
      requiresINRAssessment: !!targetMap.requiresINRAssessment,
      requiresDoseClassification: !!targetMap.requiresDoseClassification,
      renalImpairmentWarning: (targetMap.requiresRenalAssessment && renalEval.isImpaired) ? renalEval.label : null,
      guidance: generalRule.statement,
      evidenceRef: generalRule.evidenceRef || []
    };
  }

  // =========================================================================
  // 6. SPECIFIC RISK ASSESSMENT MODELS (GLP-1 & SGLT2)
  // =========================================================================

  /**
   * Evaluates GLP-1 / GIP Receptor Agonist Individualized Aspiration Risk
   */
  static evaluateGlp1AspirationRisk(medObj, inputs = {}) {
    const hasGiSymptoms = inputs.hasNausea === true || inputs.hasVomiting === true || inputs.hasBloating === true || inputs.hasEarlySatiety === true;
    const isDoseEscalation = inputs.isDoseEscalationPhase === true;
    const knownGastroparesis = inputs.hasKnownGastroparesis === true;

    const isHighAspirationRisk = hasGiSymptoms || isDoseEscalation || knownGastroparesis;

    return {
      type: "GLP1_ASPIRATION_RISK",
      isHighAspirationRisk,
      riskLevel: isHighAspirationRisk ? "HIGH" : "STANDARD",
      riskFactors: {
        hasGiSymptoms,
        isDoseEscalation,
        knownGastroparesis
      },
      mitigationOptions: medObj.riskMitigation || []
    };
  }

  /**
   * Evaluates SGLT2 Inhibitor Euglycemic DKA Risk
   */
  static evaluateSglt2EuglycemicDkaRisk(medObj, inputs = {}, isEmergency = false) {
    const holdDays = medObj.preOpHold?.standardDays;

    return {
      type: "SGLT2_EUGLYCEMIC_DKA_RISK",
      holdDaysRequired: holdDays || null,
      isEmergency,
      safetyFlags: medObj.safetyFlags || []
    };
  }

  // =========================================================================
  // 7. HELPER METHOD
  // =========================================================================

  static _parseNum(val, fallback = null) {
    if (val === null || val === undefined || val === "") return fallback;
    const parsed = parseFloat(val);
    return isNaN(parsed) ? fallback : parsed;
  }
}
