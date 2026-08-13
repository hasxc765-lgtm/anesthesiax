/**
 * Perioperative Chronic Medications & Drug Interactions Unified UI Component
 *
 * AnesthesiaX — Phase 11.0 (Clinical View v11.0.0 - Production Audited)
 * File: js/components/drugInteractionsView.js
 *
 * Architecture:
 * ES Module View Layer.
 * Perioperative Decision Engine UI with Multi-Drug Selection, Patient Context Bar,
 * Targeted DOM Updates (No Scroll Jump), and Empty State Placeholders.
 *
 * Consumes:
 * - ../data/drugInteractionsData.js
 * - ../calculators/drugInteractionsCalculator.js
 */

import { drugInteractionsData } from "../data/drugInteractionsData.js";
import { DrugInteractionsCalculator } from "../calculators/drugInteractionsCalculator.js";

// =============================================================================
// 1. MODULE LOCAL RUNTIME STATE
// =============================================================================

const state = {
  searchQuery: "",
  selectedClassId: "ALL", // "ALL" or medication class ID
  selectedMedicationIds: [], // Empty state by default for clinical realism
  activeTabMedId: null,

  // Patient Context Factors
  surgeryUrgency: "elective", // "elective" | "emergency"
  plannedNeuraxialBlock: false,
  egfrValue: "",

  // Intraoperative Agents Selected for Interaction Checking
  selectedIntraopAgents: ["ephedrine", "pethidine"],

  // GLP-1 Specific Risk Inputs
  glp1HasGiSymptoms: false,
  glp1IsDoseEscalation: false,
  glp1HasGastroparesis: false
};

// =============================================================================
// 2. HELPER BADGE STYLES
// =============================================================================

function getDecisionBadgeStyle(decision) {
  switch (decision) {
    case "CONTINUE":
      return "bg-emerald-100 text-emerald-800 border-emerald-300";
    case "HOLD":
      return "bg-amber-100 text-amber-900 border-amber-300";
    case "INDIVIDUALIZE":
      return "bg-blue-100 text-blue-900 border-blue-300";
    case "SPECIALIST_REVIEW":
      return "bg-rose-100 text-rose-900 border-rose-300";
    case "EMERGENCY_EXCEPTION":
      return "bg-purple-100 text-purple-900 border-purple-300";
    default:
      return "bg-slate-100 text-slate-800 border-slate-300";
  }
}

function getSeverityBadgeStyle(severity) {
  switch (severity) {
    case "CRITICAL":
      return "bg-rose-700 text-white font-bold";
    case "HIGH":
      return "bg-rose-100 text-rose-900 border-rose-300 font-bold";
    case "MODERATE":
    case "MODERATE_TO_HIGH":
      return "bg-amber-100 text-amber-900 border-amber-300";
    default:
      return "bg-blue-100 text-blue-900 border-blue-300";
  }
}

// =============================================================================
// 3. MAIN RENDER FUNCTION
// =============================================================================

export function renderDrugInteractionsView() {
  return `
    <div class="space-y-4 max-w-3xl mx-auto font-sans dir-rtl text-right" id="drugInteractionsContainer">

      <div class="p-4 bg-gradient-to-r from-teal-900 via-indigo-900 to-slate-900 text-white rounded-2xl shadow-md flex justify-between items-center">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xl">📚</span>
            <h2 class="font-bold text-base">إدارة الأدوية المزمنة والتداخلات حول الجراحة</h2>
          </div>
          <p class="text-[11px] opacity-80 mt-0.5" dir="ltr">Perioperative Medication Reconciliation & Decision Engine (Phase 11.0)</p>
        </div>
        <button id="btnBackToDashboard" type="button" class="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-xl font-bold text-xs transition cursor-pointer">
          الرئيسية ↩
        </button>
      </div>

      ${renderPatientContextBarHTML()}

      ${renderSearchAndFilterSectionHTML()}

      <div class="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
        ${renderSelectedMedsBarHTML()}
        <div id="medicationEvaluationDetailContainer">
          ${renderActiveMedicationDetailHTML()}
        </div>
      </div>

      <div class="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
        <h3 class="font-bold text-xs text-slate-800 border-b border-slate-100 pb-2">
          ⚡ فحص التداخلات مع أدوية غرفة العمليات (Intraoperative Drug Interactions):
        </h3>
        ${renderIntraopAgentSelectorHTML()}
        <div id="interactionAlertsContainer">
          ${renderInteractionAlertsHTML()}
        </div>
      </div>

      <div class="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-[11px] text-amber-900 leading-relaxed">
        <strong class="font-bold block mb-0.5">⚠️ تنبيه واستثناء سريري:</strong>
        ${drugInteractionsData.meta.disclaimer}
      </div>

    </div>
  `;
}

// =============================================================================
// 4. PATIENT CONTEXT BAR BUILDER
// =============================================================================

function renderPatientContextBarHTML() {
  return `
    <div class="p-3 bg-slate-100/80 border border-slate-200 rounded-2xl text-xs space-y-2">
      <strong class="text-slate-800 block text-[11px] font-bold">📋 سياق وسيرة المريض الجراحية (Patient Context Factors):</strong>
      
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div>
          <label class="block text-[10px] text-slate-600 mb-1">نوع الجراحة:</label>
          <div class="flex bg-white p-0.5 rounded-lg border border-slate-300 text-[11px] font-bold">
            <button id="btnUrgencyElective" type="button" class="flex-1 py-1 rounded transition ${state.surgeryUrgency === 'elective' ? 'bg-indigo-700 text-white' : 'text-slate-700 hover:bg-slate-100'}">
              انتخابية (Elective)
            </button>
            <button id="btnUrgencyEmergency" type="button" class="flex-1 py-1 rounded transition ${state.surgeryUrgency === 'emergency' ? 'bg-purple-700 text-white' : 'text-slate-700 hover:bg-slate-100'}">
              إسعافية (Emergency)
            </button>
          </div>
        </div>

        <div>
          <label class="block text-[10px] text-slate-600 mb-1">التخطيط لتخدير نصفي (Neuraxial):</label>
          <label class="flex items-center gap-2 p-1.5 bg-white border border-slate-300 rounded-lg cursor-pointer h-[29px]">
            <input type="checkbox" id="neuraxialCheck" ${state.plannedNeuraxialBlock ? 'checked' : ''} class="rounded text-indigo-600 focus:ring-indigo-500">
            <span class="font-bold text-[11px] text-slate-800">Spinal / Epidural / Deep Block</span>
          </label>
        </div>

        <div>
          <label class="block text-[10px] text-slate-600 mb-1">وظيفة الكلى <bdi dir="ltr" class="font-mono">(eGFR mL/min/1.73m²)</bdi>:</label>
          <input type="number" id="egfrInput" min="5" max="150" placeholder="مثال: 45 (اختياري)" value="${state.egfrValue}" class="w-full p-1 border border-slate-300 rounded bg-white text-center font-mono font-bold text-xs">
        </div>
      </div>
    </div>
  `;
}

// =============================================================================
// 5. SEARCH & FILTER BUILDERS
// =============================================================================

function renderSearchAndFilterSectionHTML() {
  const classes = drugInteractionsData.medicationClasses;

  return `
    <div class="space-y-2">
      <div class="relative">
        <input 
          type="text" 
          id="medSearchInput" 
          value="${state.searchQuery}"
          placeholder="🔍 ابحث عن دواء مزمن (Ozempic, Jardiance, Eliquis, Plavix, Metformin)..." 
          class="w-full p-2.5 bg-white border-2 border-indigo-500 rounded-xl text-xs font-bold shadow-sm focus:outline-none text-slate-900"
        >
        ${state.searchQuery ? `
          <button id="btnClearMedSearch" type="button" class="absolute left-3 top-2.5 text-slate-400 hover:text-slate-600 font-bold text-xs">✕</button>
        ` : ''}
      </div>

      <div class="flex gap-1 overflow-x-auto pb-1 text-[11px] font-bold" id="classFiltersContainer">
        <button data-class="ALL" class="class-filter-btn px-2.5 py-1 rounded-lg border transition whitespace-nowrap cursor-pointer ${state.selectedClassId === 'ALL' ? 'bg-indigo-700 text-white border-indigo-700' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'}">
          جميع الفئات
        </button>
        ${Object.keys(classes).map(cKey => `
          <button data-class="${classes[cKey].id}" class="class-filter-btn px-2.5 py-1 rounded-lg border transition whitespace-nowrap cursor-pointer ${state.selectedClassId === classes[cKey].id ? 'bg-indigo-700 text-white border-indigo-700' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'}">
            ${classes[cKey].title}
          </button>
        `).join('')}
      </div>

      <div id="searchResultsDropdown">
        ${renderSearchResultsDropdownHTML()}
      </div>
    </div>
  `;
}

function renderSearchResultsDropdownHTML() {
  const cleanQuery = DrugInteractionsCalculator.normalizeString(state.searchQuery);
  const allMeds = drugInteractionsData.medications;
  const matched = [];

  Object.keys(allMeds).forEach(mId => {
    const med = allMeds[mId];
    
    // Filter by Search Query
    const nameMatch = cleanQuery ? DrugInteractionsCalculator.normalizeString(med.genericName).includes(cleanQuery) : true;
    const aliasMatch = cleanQuery && Array.isArray(med.aliases) ? med.aliases.some(a => DrugInteractionsCalculator.normalizeString(a).includes(cleanQuery)) : false;

    // Filter by Class
    const classMatch = state.selectedClassId === "ALL" || med.classId === state.selectedClassId;

    if ((cleanQuery ? (nameMatch || aliasMatch) : (state.selectedClassId !== "ALL")) && classMatch) {
      matched.push(med);
    }
  });

  if (!cleanQuery && state.selectedClassId === "ALL") {
    return ''; // Hide dropdown if no search query and no specific class selected
  }

  if (matched.length === 0) {
    return `
      <div class="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 text-xs text-center shadow-sm">
        لا توجد أدوية مطابقة للبحث أو الفئة المختارة.
      </div>
    `;
  }

  return `
    <div class="p-2 bg-white border border-indigo-200 rounded-xl text-xs space-y-1 shadow-md max-h-48 overflow-y-auto">
      <span class="text-[10px] text-slate-400 font-bold block px-1">انقر لإضافة الدواء إلى ملف المريض للتقييم:</span>
      ${matched.map(m => `
        <button data-add-med-id="${m.id}" type="button" class="add-med-btn w-full text-right p-1.5 hover:bg-indigo-50 rounded flex justify-between items-center transition cursor-pointer">
          <span class="font-bold text-indigo-900">${m.genericName} <bdi dir="ltr" class="text-slate-500 font-normal">(${m.aliases.join(', ')})</bdi></span>
          <span class="text-[10px] px-1.5 py-0.5 bg-indigo-100 text-indigo-800 rounded font-mono">${m.category}</span>
        </button>
      `).join('')}
    </div>
  `;
}

// =============================================================================
// 6. SELECTED MEDICATIONS & DETAIL CARD BUILDERS
// =============================================================================

function renderSelectedMedsBarHTML() {
  return `
    <div class="flex justify-between items-center border-b border-slate-100 pb-2">
      <strong class="text-xs font-bold text-slate-800">الأدوية المزمنة المحددة للمريض:</strong>
      <div class="flex gap-1 overflow-x-auto">
        ${state.selectedMedicationIds.length === 0 ? `
          <span class="text-[11px] text-slate-400">لم يتم إضافة أدوية بعد</span>
        ` : state.selectedMedicationIds.map(mId => {
          const med = drugInteractionsData.medications[mId];
          if (!med) return '';
          const isActive = state.activeTabMedId === mId;

          return `
            <div class="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition ${isActive ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'}">
              <button data-select-tab-med="${mId}" type="button" class="select-tab-med-btn cursor-pointer">
                ${med.genericName}
              </button>
              <button data-remove-med="${mId}" type="button" class="remove-med-btn text-[10px] opacity-70 hover:opacity-100 px-0.5 cursor-pointer">✕</button>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function renderActiveMedicationDetailHTML() {
  if (state.selectedMedicationIds.length === 0) {
    return `
      <div class="p-6 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center space-y-2">
        <span class="text-3xl block">📋</span>
        <strong class="text-xs font-bold text-slate-800 block">ملف أدوية المريض فارغ حالياً</strong>
        <p class="text-[11px] text-slate-500 max-w-md mx-auto">
          ابحث عن دواء مزمن في الأعلى (مثل: <bdi dir="ltr" class="font-bold text-indigo-700">Lisinopril, Plavix, Metformin</bdi>) أو اختر من الفئات لإضافته وتقييم تداخلاته حول الجراحة.
        </p>
      </div>
    `;
  }

  if (!state.activeTabMedId) {
    return `<div class="p-4 text-slate-400 text-xs text-center">اختر دواءً من الشريط أعلاه لعرض التفاصيل.</div>`;
  }

  const evalResult = DrugInteractionsCalculator.evaluateMedication({
    medicationId: state.activeTabMedId,
    surgeryUrgency: state.surgeryUrgency,
    plannedNeuraxialBlock: state.plannedNeuraxialBlock,
    egfr: state.egfrValue,
    hasNausea: state.glp1HasGiSymptoms,
    isDoseEscalationPhase: state.glp1IsDoseEscalation,
    hasKnownGastroparesis: state.glp1HasGastroparesis
  });

  if (!evalResult.success) {
    return `<div class="p-3 bg-rose-50 text-rose-800 text-xs font-bold rounded-xl border border-rose-200">${evalResult.errorMessage}</div>`;
  }

  const med = evalResult.medication;
  const decisionBadgeStyle = getDecisionBadgeStyle(evalResult.decision);

  return `
    <div class="space-y-3 text-xs">
      <div class="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
        <div class="flex justify-between items-center border-b border-slate-200 pb-2">
          <div>
            <h4 class="font-bold text-sm text-slate-900">${med.genericName}</h4>
            <span class="text-[10px] text-slate-500 font-mono" dir="ltr">${med.aliases.join(', ')}</span>
          </div>

          <span class="px-2.5 py-1 rounded-lg text-xs font-bold border font-mono ${decisionBadgeStyle}">
            ${evalResult.decisionLabel}
          </span>
        </div>

        <p class="text-slate-800 leading-relaxed font-bold text-[11px]">
          📌 التوصية السريرية: ${evalResult.recommendation}
        </p>

        ${evalResult.emergencyNotice ? `
          <div class="p-2 bg-purple-50 border border-purple-200 rounded-lg text-purple-900 text-[10px] leading-relaxed">
            <strong>⚠️ استثناء الجراحة الإسعافية:</strong> ${evalResult.emergencyNotice}
          </div>
        ` : ''}
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
        <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
          <strong class="text-slate-800 block border-b border-slate-200 pb-1">تعليمات ما قبل الجراحة (PreOp Hold):</strong>
          <p class="text-slate-700">${evalResult.preOpHold?.recommendation || evalResult.preOpHold?.standardDays ? `إيقاف ${evalResult.preOpHold.standardDays} أيام قبل العملية` : 'لا توجد تعليمات حجب ثابتة.'}</p>
        </div>

        <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
          <strong class="text-slate-800 block border-b border-slate-200 pb-1">تعليمات إعادة البدء (PostOp Restart):</strong>
          <p class="text-slate-700">${evalResult.postoperativeRestart?.recommendation || 'إعادة البدء حسب استقرار الحالة والتغذية.'}</p>
        </div>
      </div>

      ${evalResult.neuraxialSafety ? `
        <div class="p-3 bg-indigo-50 border border-indigo-200 rounded-xl space-y-1 text-[11px]">
          <strong class="text-indigo-950 block border-b border-indigo-200 pb-1">💉 سلامة التخدير النصفي (ASRA 5th Edition Neuraxial Safety):</strong>
          <p class="text-indigo-900 font-bold">${evalResult.neuraxialSafety.label || evalResult.neuraxialSafety.guidance}</p>
          ${evalResult.neuraxialSafety.renalImpairmentWarning ? `
            <p class="text-rose-800 bg-rose-50 p-1.5 rounded border border-rose-200 font-bold mt-1">⚠️ تنبيه كلوِي: ${evalResult.neuraxialSafety.renalImpairmentWarning}</p>
          ` : ''}
        </div>
      ` : ''}

      ${med.category.includes('GLP-1') ? renderGlp1ControlsHTML(evalResult) : ''}
      ${med.category.includes('SGLT2') ? renderSglt2ControlsHTML(evalResult) : ''}
    </div>
  `;
}

function renderGlp1ControlsHTML(evalResult) {
  const risk = evalResult.riskAssessment || {};

  return `
    <div class="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-2 text-[11px] text-blue-950">
      <strong class="text-blue-900 block border-b border-blue-200 pb-1 font-bold">🫁 تقييم خطر الشفط والتفريغ المعدي لـ GLP-1/GIP:</strong>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px]">
        <label class="flex items-center gap-1 cursor-pointer">
          <input type="checkbox" id="glp1GiCheck" ${state.glp1HasGiSymptoms ? 'checked' : ''} class="glp1-risk-check">
          <span>أعراض هضمية (غثيان/قيء)</span>
        </label>
        <label class="flex items-center gap-1 cursor-pointer">
          <input type="checkbox" id="glp1EscalationCheck" ${state.glp1IsDoseEscalation ? 'checked' : ''} class="glp1-risk-check">
          <span>تصعيد الجرعة (Escalation)</span>
        </label>
        <label class="flex items-center gap-1 cursor-pointer">
          <input type="checkbox" id="glp1ParesisCheck" ${state.glp1HasGastroparesis ? 'checked' : ''} class="glp1-risk-check">
          <span>شلل معدة معروف (Gastroparesis)</span>
        </label>
      </div>

      <div class="p-2 bg-white rounded border border-blue-200">
        <span class="font-bold text-blue-900 block">درجة الخطر: ${risk.riskLevel === 'HIGH' ? '🚨 مرتفع الاستنشاق (HIGH)' : '✅ اعتيادي (STANDARD)'}</span>
      </div>
    </div>
  `;
}

function renderSglt2ControlsHTML(evalResult) {
  const risk = evalResult.riskAssessment || {};

  return `
    <div class="p-3 bg-red-50 border border-red-200 rounded-xl space-y-1 text-[11px] text-red-950">
      <strong class="text-red-900 block border-b border-red-200 pb-1 font-bold">🧪 خطر الحُماض الكيتوني السكري الطبيعي (Euglycemic DKA):</strong>
      <p class="text-red-900">${risk.isEmergency ? 'جراحة إسعافية: افحص الكيتونات وفجوة الشوارد فوراً.' : `يتطلب إيقاف الدواء ${risk.holdDaysRequired || 3} أيام قبل الجراحة.`}</p>
    </div>
  `;
}

// =============================================================================
// 7. INTRAOP AGENT SELECTOR & INTERACTION ALERTS BUILDERS
// =============================================================================

function renderIntraopAgentSelectorHTML() {
  const agents = [
    { id: "ephedrine", name: "Ephedrine (إيفيدرين)" },
    { id: "pethidine", name: "Meperidine / Pethidine (بيثيدين)" },
    { id: "tramadol", name: "Tramadol (ترامادول)" },
    { id: "nsaids", name: "NSAIDs (مضادات الالتهاب)" },
    { id: "nmba", name: "Neuromuscular Blockers (مرخيات عضلية)" }
  ];

  return `
    <div class="space-y-1.5 text-xs">
      <span class="text-[10px] text-slate-500 font-bold block">حدد أدوية التخدير المزمع استخدامها في العملية:</span>
      <div class="flex flex-wrap gap-2 text-[11px]">
        ${agents.map(a => {
          const isChecked = state.selectedIntraopAgents.includes(a.id);
          return `
            <label class="flex items-center gap-1.5 p-1.5 rounded-lg border cursor-pointer transition ${isChecked ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'}">
              <input type="checkbox" data-intraop-agent="${a.id}" ${isChecked ? 'checked' : ''} class="intraop-agent-check rounded text-indigo-600">
              <span>${a.name}</span>
            </label>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function renderInteractionAlertsHTML() {
  if (state.selectedMedicationIds.length === 0) {
    return `
      <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 text-xs text-center">
        أضف أدوية مزمنة إلى ملف المريض أعلاه لفحص تداخلاتها الدوائية.
      </div>
    `;
  }

  const alerts = DrugInteractionsCalculator.checkInteractions(
    state.selectedMedicationIds,
    state.selectedIntraopAgents
  );

  if (alerts.length === 0) {
    return `
      <div class="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs font-bold text-center">
        ✅ لا توجد تداخلات دوائية حادة مسجلة بين الأدوية المزمنة والأدوية المحددة.
      </div>
    `;
  }

  return `
    <div class="space-y-2 text-xs">
      <strong class="text-rose-900 block text-[11px] font-bold">⚠️ التداخلات الدوائية المكتشفة (${alerts.length}):</strong>
      <div class="space-y-2">
        ${alerts.map(a => `
          <div class="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1">
            <div class="flex justify-between items-center border-b border-rose-200 pb-1">
              <strong class="text-rose-950 text-[11px]">${a.id}</strong>
              <span class="px-2 py-0.5 rounded text-[9px] font-mono ${getSeverityBadgeStyle(a.severity)}">
                ${a.severity}
              </span>
            </div>
            <p class="text-[11px] text-rose-900"><strong>الأثر السريري:</strong> ${a.effect}</p>
            <p class="text-[11px] text-rose-950 font-bold"><strong>التوصية:</strong> ${a.recommendation}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// =============================================================================
// 8. EVENT BINDINGS & TARGETED LIVE DOM UPDATES
// =============================================================================

export function initDrugInteractionsEvents() {
  const container = document.getElementById("drugInteractionsContainer");
  if (!container) return;

  // Back Button
  const btnBack = document.getElementById("btnBackToDashboard");
  if (btnBack) {
    btnBack.addEventListener("click", () => {
      if (typeof window.navigateTo === "function") window.navigateTo("dashboard");
    });
  }

  // Urgency Toggle
  const btnElective = document.getElementById("btnUrgencyElective");
  const btnEmergency = document.getElementById("btnUrgencyEmergency");
  if (btnElective && btnEmergency) {
    btnElective.addEventListener("click", () => {
      state.surgeryUrgency = "elective";
      updateDetailAndInteractionsDOM();
      btnElective.className = "flex-1 py-1 rounded transition bg-indigo-700 text-white font-bold";
      btnEmergency.className = "flex-1 py-1 rounded transition text-slate-700 hover:bg-slate-100 font-bold";
    });
    btnEmergency.addEventListener("click", () => {
      state.surgeryUrgency = "emergency";
      updateDetailAndInteractionsDOM();
      btnEmergency.className = "flex-1 py-1 rounded transition bg-purple-700 text-white font-bold";
      btnElective.className = "flex-1 py-1 rounded transition text-slate-700 hover:bg-slate-100 font-bold";
    });
  }

  // Neuraxial Checkbox
  const neuraxialCheck = document.getElementById("neuraxialCheck");
  if (neuraxialCheck) {
    neuraxialCheck.addEventListener("change", (e) => {
      state.plannedNeuraxialBlock = e.target.checked;
      updateDetailAndInteractionsDOM();
    });
  }

  // eGFR Input Listener (Targeted update)
  const egfrInput = document.getElementById("egfrInput");
  if (egfrInput) {
    egfrInput.addEventListener("input", (e) => {
      state.egfrValue = e.target.value;
      updateDetailAndInteractionsDOM();
    });
  }

  // Search Input Listener
  const medSearchInput = document.getElementById("medSearchInput");
  if (medSearchInput) {
    medSearchInput.addEventListener("input", (e) => {
      state.searchQuery = e.target.value;
      updateSearchResultsDOM();
    });
  }

  // Clear Search
  const btnClearSearch = document.getElementById("btnClearMedSearch");
  if (btnClearSearch) {
    btnClearSearch.addEventListener("click", () => {
      state.searchQuery = "";
      const searchInput = document.getElementById("medSearchInput");
      if (searchInput) searchInput.value = "";
      updateSearchResultsDOM();
    });
  }

  // Class Filter Buttons (Targeted update - No Page Jump)
  container.querySelectorAll(".class-filter-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      state.selectedClassId = e.currentTarget.getAttribute("data-class");
      
      // Update Button Styles
      container.querySelectorAll(".class-filter-btn").forEach(b => {
        b.className = "class-filter-btn px-2.5 py-1 rounded-lg border transition whitespace-nowrap cursor-pointer bg-white text-slate-700 border-slate-200 hover:bg-slate-100";
      });
      e.currentTarget.className = "class-filter-btn px-2.5 py-1 rounded-lg border transition whitespace-nowrap cursor-pointer bg-indigo-700 text-white border-indigo-700";

      updateSearchResultsDOM();
    });
  });

  bindDynamicAddButtons();

  // Select Tab Medication
  container.querySelectorAll(".select-tab-med-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      state.activeTabMedId = e.currentTarget.getAttribute("data-select-tab-med");
      reRenderFull();
    });
  });

  // Remove Medication
  container.querySelectorAll(".remove-med-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const medId = e.currentTarget.getAttribute("data-remove-med");
      state.selectedMedicationIds = state.selectedMedicationIds.filter(id => id !== medId);
      if (state.activeTabMedId === medId) {
        state.activeTabMedId = state.selectedMedicationIds[0] || null;
      }
      reRenderFull();
    });
  });

  // Intraop Agent Checkboxes
  container.querySelectorAll(".intraop-agent-check").forEach(cb => {
    cb.addEventListener("change", (e) => {
      const agentId = e.target.getAttribute("data-intraop-agent");
      if (e.target.checked) {
        if (!state.selectedIntraopAgents.includes(agentId)) state.selectedIntraopAgents.push(agentId);
      } else {
        state.selectedIntraopAgents = state.selectedIntraopAgents.filter(a => a !== agentId);
      }
      updateInteractionsDOM();
    });
  });

  // GLP-1 Risk Checkboxes
  bindGlp1Checkboxes();
}

function bindDynamicAddButtons() {
  const container = document.getElementById("drugInteractionsContainer");
  if (!container) return;

  container.querySelectorAll(".add-med-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const medId = e.currentTarget.getAttribute("data-add-med-id");
      if (medId && !state.selectedMedicationIds.includes(medId)) {
        state.selectedMedicationIds.push(medId);
        state.activeTabMedId = medId;
        state.searchQuery = "";
        const searchInput = document.getElementById("medSearchInput");
        if (searchInput) searchInput.value = "";
        reRenderFull();
      }
    });
  });
}

function bindGlp1Checkboxes() {
  const container = document.getElementById("drugInteractionsContainer");
  if (!container) return;

  container.querySelectorAll(".glp1-risk-check").forEach(cb => {
    cb.addEventListener("change", () => {
      const giCheck = document.getElementById("glp1GiCheck");
      const escCheck = document.getElementById("glp1EscalationCheck");
      const paresisCheck = document.getElementById("glp1ParesisCheck");

      state.glp1HasGiSymptoms = giCheck ? giCheck.checked : false;
      state.glp1IsDoseEscalation = escCheck ? escCheck.checked : false;
      state.glp1HasGastroparesis = paresisCheck ? paresisCheck.checked : false;

      updateDetailAndInteractionsDOM();
    });
  });
}

function updateSearchResultsDOM() {
  const container = document.getElementById("searchResultsDropdown");
  if (container) {
    container.innerHTML = renderSearchResultsDropdownHTML();
    bindDynamicAddButtons();
  }
}

function updateDetailAndInteractionsDOM() {
  const detailContainer = document.getElementById("medicationEvaluationDetailContainer");
  if (detailContainer) {
    detailContainer.innerHTML = renderActiveMedicationDetailHTML();
    bindGlp1Checkboxes();
  }
  updateInteractionsDOM();
}

function updateInteractionsDOM() {
  const alertsContainer = document.getElementById("interactionAlertsContainer");
  if (alertsContainer) {
    alertsContainer.innerHTML = renderInteractionAlertsHTML();
  }
}

function reRenderFull() {
  const appContent = document.getElementById("app-content");
  if (appContent) {
    appContent.innerHTML = renderDrugInteractionsView();
    initDrugInteractionsEvents();
  }
}
