/**
 * Emergency & Resuscitation Protocols Unified UI Component
 *
 * AnesthesiaX — Phase 10.0 (Clinical Reference v10.0.0)
 * File: js/components/emergencyView.js
 *
 * Architecture:
 * ES Module View Layer.
 * Interactive Crisis Cognitive Aid with Live Weight-based Calculators,
 * State Machine Flow, Interactive Action Checkboxes, and Targeted DOM Updates.
 *
 * Consumes:
 * - ../data/emergencyData.js
 * - ../calculators/emergencyCalculator.js
 */

import { emergencyData } from "../data/emergencyData.js";
import { EmergencyCalculator } from "../calculators/emergencyCalculator.js";

// =============================================================================
// 1. MODULE LOCAL RUNTIME STATE
// =============================================================================

const state = {
  activeProtocolId: "acls", // "acls" | "mh" | "last" | "anaphylaxis" | "airway" | "laryngospasm"
  protocolCurrentStates: {
    acls: "RHYTHM_CHECK",
    mh: "RECOGNITION",
    last: "RECOGNITION",
    anaphylaxis: "RECOGNITION",
    airway: "PLAN_A",
    laryngospasm: "ALGORITHM"
  },

  // Inputs for Weight-based Calculations
  patientWeightKg: "70",
  dantroleneFormulation: "dantrium", // "dantrium" | "ryanodex"
  anaphylaxisHasIv: true,

  // Runtime Interactive Action Checkboxes
  checkedActions: {} // e.g. { "stop_triggers": true }
};

// =============================================================================
// 2. MAIN RENDER FUNCTION
// =============================================================================

export function renderEmergencyView() {
  const protocol = emergencyData.protocols[state.activeProtocolId];
  if (!protocol) return `<div class="p-4 text-rose-600 font-bold text-xs">⚠️ بروتوكول غير معروف</div>`;

  const currentStateId = state.protocolCurrentStates[state.activeProtocolId] || protocol.initialState;
  const currentStateObj = protocol.states[currentStateId] || {};

  return `
    <div class="space-y-4 max-w-3xl mx-auto font-sans dir-rtl text-right" id="emergencyContainer">

      <!-- CRISIS HEADER -->
      <div class="p-4 bg-gradient-to-r from-rose-900 via-red-800 to-indigo-950 text-white rounded-2xl shadow-md flex justify-between items-center">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xl animate-pulse">🚨</span>
            <h2 class="font-bold text-base">بروتوكولات الطوارئ والإنعاش السريري</h2>
          </div>
          <p class="text-[11px] opacity-80 mt-0.5" dir="ltr">Emergency Protocols & Crisis Cognitive Aids (Phase 10.0)</p>
        </div>
        <div class="flex gap-2">
          <button id="btnResetProtocol" type="button" class="px-2.5 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1">
            <span>🔄</span>
            <span>إعادة ضبط</span>
          </button>
          <button id="btnBackToDashboard" type="button" class="px-2.5 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-xl font-bold text-xs transition cursor-pointer">
            الرئيسية ↩
          </button>
        </div>
      </div>

      <!-- PROTOCOL SELECTOR TABS -->
      <div class="flex border border-slate-200 bg-white rounded-xl p-1 shadow-sm text-xs font-bold overflow-x-auto gap-1">
        ${renderProtocolTabBtn("acls", "1. الإنعاش (ACLS) 🫀")}
        ${renderProtocolTabBtn("mh", "2. فرط الحرارة (MH) 🧬")}
        ${renderProtocolTabBtn("last", "3. سمية التخدير (LAST) ⚡")}
        ${renderProtocolTabBtn("anaphylaxis", "4. الصدمة التحسسية 💉")}
        ${renderProtocolTabBtn("airway", "5. المجرى الهوائي (DAS) 🫁")}
        ${renderProtocolTabBtn("laryngospasm", "6. تشنج الحنجرة 🛑")}
      </div>

      <!-- ACTIVE PROTOCOL CONTAINER -->
      <div class="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
        
        <!-- PROTOCOL TITLE & GUIDELINE BADGE -->
        <div class="flex flex-wrap justify-between items-center border-b border-slate-100 pb-3 gap-2">
          <div>
            <h3 class="font-bold text-sm text-slate-900">${protocol.title}</h3>
            <span class="text-[10px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 font-mono inline-block mt-1" dir="ltr">
              Evidence: ${protocol.guideline || 'Official Guideline'}
            </span>
          </div>

          <!-- COMMON WEIGHT CALCULATOR BAR (For protocols needing dose) -->
          ${['mh', 'last', 'anaphylaxis', 'laryngospasm'].includes(state.activeProtocolId) ? renderWeightInputBar() : ''}
        </div>

        <!-- STATE MACHINE STEP / PHASE CARD -->
        <div class="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <div class="flex justify-between items-center border-b border-slate-200 pb-2">
            <span class="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full ${currentStateObj.terminal ? 'bg-emerald-500' : 'bg-rose-500 animate-ping'}"></span>
              <span>المرحلة الحالية: ${currentStateObj.title || currentStateId}</span>
            </span>
            ${currentStateObj.isShockable !== undefined ? `
              <span class="px-2 py-0.5 text-[10px] font-bold rounded border font-mono ${currentStateObj.isShockable ? 'bg-rose-100 text-rose-800 border-rose-300' : 'bg-slate-200 text-slate-800 border-slate-300'}">
                ${currentStateObj.isShockable ? '⚡ SHOCKABLE RHYTHM' : 'NON-SHOCKABLE'}
              </span>
            ` : ''}
          </div>

          <!-- LIVE DOSE CALCULATOR CARD INSERTION -->
          <div id="liveDoseResultContainer">
            ${renderProtocolDoseCardHTML()}
          </div>

          <!-- ACTION CHECKBOXES / GUIDANCE ITEMS -->
          ${renderActionItemsHTML(currentStateObj)}

          <!-- BRANCH TRANSITION BUTTONS -->
          ${renderStateBranchesHTML(currentStateObj)}

        </div>

        <!-- REVERSIBLE CAUSES / EXTRA GUIDANCE PANEL IF ACLS -->
        ${state.activeProtocolId === 'acls' ? renderAclsReversibleCausesHTML(protocol) : ''}

      </div>

      <!-- CLINICAL DISCLAIMER -->
      <div class="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-[11px] text-amber-900 leading-relaxed">
        <strong class="font-bold block mb-0.5">⚠️ تنبيه سريري وتوجيهي للأزمات:</strong>
        ${emergencyData.meta.disclaimer}
      </div>

    </div>
  `;
}

// =============================================================================
// 3. TAB & CARD COMPONENT BUILDERS
// =============================================================================

function renderProtocolTabBtn(id, label) {
  const isActive = state.activeProtocolId === id;
  return `
    <button data-protocol="${id}" class="protocol-tab-btn flex-1 min-w-[110px] py-2 px-1 text-center rounded-lg transition cursor-pointer whitespace-nowrap ${isActive ? 'bg-rose-700 text-white shadow' : 'text-slate-700 hover:bg-slate-100'}">
      <span>${label}</span>
    </button>
  `;
}

function renderWeightInputBar() {
  return `
    <div class="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs">
      <label class="font-bold text-slate-700 whitespace-nowrap">وزن المريض <bdi dir="ltr" class="font-mono">(kg)</bdi>:</label>
      <input type="number" id="emergencyWeightInput" min="1" max="300" step="1" value="${state.patientWeightKg}" placeholder="70" class="w-16 p-1 border border-slate-300 rounded bg-white text-center font-bold font-mono text-xs">
      
      ${state.activeProtocolId === 'mh' ? `
        <select id="mhFormulationSelect" class="p-1 border border-slate-300 rounded bg-white text-[11px] font-bold">
          <option value="dantrium" ${state.dantroleneFormulation === 'dantrium' ? 'selected' : ''}>Dantrium (20mg/60mL)</option>
          <option value="ryanodex" ${state.dantroleneFormulation === 'ryanodex' ? 'selected' : ''}>Ryanodex (250mg/5mL)</option>
        </select>
      ` : ''}

      ${state.activeProtocolId === 'anaphylaxis' ? `
        <label class="flex items-center gap-1 text-[11px] font-bold text-slate-700 cursor-pointer">
          <input type="checkbox" id="anaphylaxisIvCheck" ${state.anaphylaxisHasIv ? 'checked' : ''} class="rounded">
          <span>منفذ وريدي IV</span>
        </label>
      ` : ''}
    </div>
  `;
}

function renderProtocolDoseCardHTML() {
  const weight = state.patientWeightKg;

  // 1. MALIGNANT HYPERTHERMIA
  if (state.activeProtocolId === 'mh') {
    const res = EmergencyCalculator.calculateDantrolene(weight, state.dantroleneFormulation);
    if (!res.isValid) return `<div class="text-rose-600 text-xs font-bold p-2 bg-rose-50 rounded border border-rose-200">${res.errorMessage || 'أدخل وزناً صالحاً لحساب الدانترولين'}</div>`;

    return `
      <div class="p-3 bg-red-50 border border-red-200 rounded-xl space-y-1.5 text-xs text-red-950 font-sans">
        <div class="flex justify-between items-center border-b border-red-200/70 pb-1">
          <strong class="text-red-900 font-bold">💉 جرعة الدانترولين التأسيسية (${res.weightKg} kg):</strong>
          <span class="px-2 py-0.5 bg-red-800 text-white rounded font-mono font-bold text-xs" dir="ltr">${res.calculatedDoseMg} mg IV</span>
        </div>

        <div class="grid grid-cols-2 gap-2 text-[11px]">
          <div><strong>عدد القوارير المطلوب:</strong> <bdi dir="ltr" class="font-mono font-bold text-red-900">${res.vialCount} Vials</bdi></div>
          <div><strong>حجم الماء المعقم للحل:</strong> <bdi dir="ltr" class="font-mono font-bold text-red-900">${res.diluentVolumeMl} mL</bdi></div>
        </div>

        <p class="text-[10px] text-red-800 mt-1">${res.instructions}</p>
        ${res.hasWarning ? `<p class="text-[10px] text-amber-800 font-bold bg-amber-100 p-1 rounded mt-1">${res.warningMessage}</p>` : ''}
      </div>
    `;
  }

  // 2. LAST LIPID RESCUE
  if (state.activeProtocolId === 'last') {
    const res = EmergencyCalculator.calculateLipidRescue(weight);
    if (!res.isValid) return `<div class="text-rose-600 text-xs font-bold p-2 bg-rose-50 rounded border border-rose-200">${res.errorMessage || 'أدخل وزناً صالحاً لحساب Lipid Rescue'}</div>`;

    return `
      <div class="p-3 bg-indigo-50 border border-indigo-200 rounded-xl space-y-2 text-xs text-indigo-950 font-sans">
        <strong class="text-indigo-900 font-bold block border-b border-indigo-200 pb-1">⚡ جرعات إنقاذ الدهون 20% Lipid Emulsion (${res.weightKg} kg):</strong>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
          <div class="p-2 bg-white rounded border border-indigo-100">
            <span class="text-slate-500 block">1. الجرعة الأولية (Bolus 1 min):</span>
            <strong class="font-mono text-indigo-900 text-xs" dir="ltr">${res.bolusVolumeMl} mL IV</strong>
          </div>

          <div class="p-2 bg-white rounded border border-indigo-100">
            <span class="text-slate-500 block">2. سرعة التسريب المستمر (Infusion):</span>
            <strong class="font-mono text-indigo-900 text-xs" dir="ltr">${res.initialInfusionRateMlMin} mL/min</strong>
          </div>

          <div class="p-2 bg-white rounded border border-indigo-100">
            <span class="text-slate-500 block">3. مضاعفة التسريب عند عدم الاستقرار:</span>
            <strong class="font-mono text-indigo-900 text-xs" dir="ltr">${res.doubleInfusionRateMlMin} mL/min</strong>
          </div>

          <div class="p-2 bg-white rounded border border-indigo-100">
            <span class="text-slate-500 block">4. الحد التراكمي الأقصى (Max Cumulative):</span>
            <strong class="font-mono text-rose-700 text-xs" dir="ltr">${res.maxCumulativeVolumeMl} mL</strong>
          </div>
        </div>
      </div>
    `;
  }

  // 3. PERIOPERATIVE ANAPHYLAXIS
  if (state.activeProtocolId === 'anaphylaxis') {
    const res = EmergencyCalculator.calculateAnaphylaxis({
      weightKg: weight,
      hasIvAccess: state.anaphylaxisHasIv
    });
    if (!res.isValid) return `<div class="text-rose-600 text-xs font-bold p-2 bg-rose-50 rounded border border-rose-200">${res.errorMessage || 'أدخل وزناً صالحاً'}</div>`;

    return `
      <div class="p-3 bg-red-50 border border-red-200 rounded-xl space-y-1.5 text-xs text-red-950 font-sans">
        <div class="flex justify-between items-center border-b border-red-200/70 pb-1">
          <strong class="text-red-900 font-bold">💉 جرعة الإبينفرين للتحسس الجراحي (${res.recommendedRoute}):</strong>
          <span class="px-2 py-0.5 bg-red-800 text-white rounded font-mono font-bold text-xs" dir="ltr">
            ${res.recommendedDoseMcg || res.calculatedDoseMcg} mcg
          </span>
        </div>

        <p class="text-[11px] text-red-900">
          <strong>الإنعاش بالسوائل البلورية:</strong> <span class="font-mono font-bold" dir="ltr">${res.crystalloidBolusMl || '500-1000 mL IV bolus'}</span>
        </p>
        <p class="text-[10px] text-red-800">${res.notes}</p>
      </div>
    `;
  }

  // 4. LARYNGOSPASM SUCCINYLCHOLINE
  if (state.activeProtocolId === 'laryngospasm') {
    const res = EmergencyCalculator.calculateLaryngospasm(weight);
    if (!res.isValid) return `<div class="text-rose-600 text-xs font-bold p-2 bg-rose-50 rounded border border-rose-200">${res.errorMessage || 'أدخل وزناً صالحاً'}</div>`;

    return `
      <div class="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1.5 text-xs text-amber-950 font-sans">
        <strong class="text-amber-900 font-bold block border-b border-amber-200 pb-1">🛑 جرعات السكسينيل كولين لفك التشنج الحنجري (${res.weightKg} kg):</strong>
        
        <div class="grid grid-cols-2 gap-2 text-[11px]">
          <div><strong>الجرعة الوريدية (IV 1.0 mg/kg):</strong> <bdi dir="ltr" class="font-mono font-bold text-amber-900">${res.ivSuccinylcholineDoseMg} mg</bdi></div>
          <div><strong>الجرعة العضلية (IM 4.0 mg/kg):</strong> <bdi dir="ltr" class="font-mono font-bold text-amber-900">${res.imSuccinylcholineDoseMg} mg</bdi></div>
        </div>

        ${res.pediatricAtropineNoteExpected ? `
          <p class="text-[10px] text-red-800 font-bold bg-red-100 p-1 rounded mt-1">⚠️ تنبيه أطفال: إعطاء Atropine (0.02 mg/kg) مع السكسينيل كولين لمنع تباطؤ القلب الشديد.</p>
        ` : ''}
      </div>
    `;
  }

  return '';
}

function renderActionItemsHTML(stateObj) {
  const items = stateObj.actionItems || stateObj.steps || [];
  if (items.length === 0) return '';

  return `
    <div class="space-y-2 text-xs">
      <strong class="text-slate-800 block text-[11px]">توصيات وإجراءات الإنقاذ الفورية:</strong>
      <div class="space-y-1.5">
        ${items.map((item, idx) => {
          const itemId = item.id || `item_${idx}`;
          const isChecked = state.checkedActions[itemId] === true;
          
          return `
            <label class="flex items-start gap-2.5 p-2 rounded-lg border transition cursor-pointer ${isChecked ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-100/70'}">
              <input type="checkbox" data-action-id="${itemId}" ${isChecked ? 'checked' : ''} class="action-checkbox mt-0.5 rounded text-rose-600 focus:ring-rose-500">
              <div class="flex-1 leading-relaxed text-[11px]">
                ${item.critical ? `<span class="px-1.5 py-0.2 text-[9px] bg-rose-100 text-rose-800 font-bold rounded border border-rose-200 inline-block mb-0.5">حرج</span>` : ''}
                <span>${item.label || item.action || item.title || item}</span>
              </div>
            </label>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function renderStateBranchesHTML(stateObj) {
  const branches = stateObj.branches || [];
  if (branches.length === 0) {
    if (stateObj.terminal) {
      return `
        <div class="p-2.5 bg-emerald-100/80 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold text-center">
          ✅ تابعة ومناقشة التثبيت والاستقرار السريري (Stabilization Reached)
        </div>
      `;
    }
    return '';
  }

  return `
    <div class="pt-2 border-t border-slate-200 space-y-2">
      <strong class="text-slate-700 block text-[11px]">انتقال المرحلة ومسار الأزمة:</strong>
      <div class="flex flex-wrap gap-2">
        ${branches.map(b => `
          <button data-target-state="${b.targetState}" type="button" class="branch-btn flex-1 min-w-[140px] p-2 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-xl text-xs shadow-sm transition flex items-center justify-between cursor-pointer">
            <span>${b.label}</span>
            <span dir="ltr">➔</span>
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

function renderAclsReversibleCausesHTML(protocol) {
  const causes = protocol.reversibleCauses || {};
  const hs = causes.hs || [];
  const ts = causes.ts || [];

  return `
    <div class="p-3.5 bg-slate-100 rounded-2xl border border-slate-200 space-y-3 text-xs">
      <strong class="text-slate-900 font-bold block border-b border-slate-200 pb-1">
        🔍 الأسباب القابلة للعكس أثناء الإنعاش القلبي (Reversible Causes: 5 Hs & 5 Ts):
      </strong>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
        <!-- 5 Hs -->
        <div class="space-y-1 bg-white p-2.5 rounded-xl border border-slate-200">
          <strong class="text-rose-700 font-bold block border-b border-slate-100 pb-1">5 Hs (الأسباب الاستقلابية والدموية):</strong>
          ${hs.map(h => `
            <div class="border-b border-slate-50 pb-1">
              <span class="font-bold text-slate-800">${h.name} (${h.label}):</span>
              <p class="text-slate-600 text-[10px]">${h.treatment}</p>
            </div>
          `).join('')}
        </div>

        <!-- 5 Ts -->
        <div class="space-y-1 bg-white p-2.5 rounded-xl border border-slate-200">
          <strong class="text-indigo-700 font-bold block border-b border-slate-100 pb-1">5 Ts (الأسباب الانسدادية والسمية):</strong>
          ${ts.map(t => `
            <div class="border-b border-slate-50 pb-1">
              <span class="font-bold text-slate-800">${t.name} (${t.label}):</span>
              <p class="text-slate-600 text-[10px]">${t.treatment}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

// =============================================================================
// 4. EVENT BINDINGS & TARGETED LIVE DOM UPDATES
// =============================================================================

export function initEmergencyEvents() {
  const container = document.getElementById("emergencyContainer");
  if (!container) return;

  // Back Button
  const btnBack = document.getElementById("btnBackToDashboard");
  if (btnBack) {
    btnBack.addEventListener("click", () => {
      if (typeof window.navigateTo === "function") window.navigateTo("dashboard");
    });
  }

  // Reset Button
  const btnReset = document.getElementById("btnResetProtocol");
  if (btnReset) {
    btnReset.addEventListener("click", () => {
      const protocol = emergencyData.protocols[state.activeProtocolId];
      if (protocol) {
        state.protocolCurrentStates[state.activeProtocolId] = protocol.initialState;
        state.checkedActions = {};
        reRenderFull();
      }
    });
  }

  // Protocol Tabs Switching
  container.querySelectorAll(".protocol-tab-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      state.activeProtocolId = e.currentTarget.getAttribute("data-protocol");
      reRenderFull();
    });
  });

  // State Machine Branch Buttons
  container.querySelectorAll(".branch-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const targetState = e.currentTarget.getAttribute("data-target-state");
      const validation = EmergencyCalculator.validateStateTransition(
        state.activeProtocolId,
        state.protocolCurrentStates[state.activeProtocolId],
        targetState
      );

      if (validation.isValid) {
        state.protocolCurrentStates[state.activeProtocolId] = validation.nextState;
        reRenderFull();
      }
    });
  });

  // Interactive Action Checkboxes
  container.querySelectorAll(".action-checkbox").forEach(cb => {
    cb.addEventListener("change", (e) => {
      const actionId = e.target.getAttribute("data-action-id");
      state.checkedActions[actionId] = e.target.checked;
    });
  });

  // Weight Input Listener (Targeted Update to prevent soft keyboard drop)
  const weightInput = document.getElementById("emergencyWeightInput");
  if (weightInput) {
    weightInput.addEventListener("input", (e) => {
      state.patientWeightKg = e.target.value;
      updateDoseCardsDOM();
    });
  }

  // MH Formulation Select Listener
  const mhFormSelect = document.getElementById("mhFormulationSelect");
  if (mhFormSelect) {
    mhFormSelect.addEventListener("change", (e) => {
      state.dantroleneFormulation = e.target.value;
      updateDoseCardsDOM();
    });
  }

  // Anaphylaxis IV Checkbox Listener
  const anaphylaxisIvCheck = document.getElementById("anaphylaxisIvCheck");
  if (anaphylaxisIvCheck) {
    anaphylaxisIvCheck.addEventListener("change", (e) => {
      state.anaphylaxisHasIv = e.target.checked;
      updateDoseCardsDOM();
    });
  }
}

function updateDoseCardsDOM() {
  const container = document.getElementById("liveDoseResultContainer");
  if (container) {
    container.innerHTML = renderProtocolDoseCardHTML();
  }
}

function reRenderFull() {
  const appContent = document.getElementById("app-content");
  if (appContent) {
    appContent.innerHTML = renderEmergencyView();
    initEmergencyEvents();
  }
}
