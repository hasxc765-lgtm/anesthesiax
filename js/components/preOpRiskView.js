/**
 * Preoperative Risk Assessment UI Component
 *
 * AnesthesiaX — Phase 8.3
 * File: js/components/preOpRiskView.js
 *
 * Architecture:
 * ES Module View Layer.
 * Handles UI rendering, user input collection, tab switching, and live DOM updates.
 * Strictly decoupled from raw data and calculation logic.
 *
 * Consumes:
 * - ../data/preOpRiskData.js
 * - ../calculators/preOpRiskCalculator.js
 */

import { preOpRiskData } from "../data/preOpRiskData.js";
import { PreOpRiskCalculator } from "../calculators/preOpRiskCalculator.js";

// =============================================================================
// 1. MODULE LOCAL STATE
// =============================================================================

const state = {
  activeTab: "asa", // "asa" | "rcri" | "ariscat" | "summary"

  // ASA State
  asaClass: "asa1",
  emergencyProcedure: false,

  // RCRI State
  highRiskSurgery: false,
  ischemicHeartDisease: false,
  congestiveHeartFailure: false,
  cerebrovascularDisease: false,
  insulinDiabetes: false,
  renallyImpaired: false,
  creatinineMgDl: "",

  // ARISCAT State
  ageYears: 45,
  spo2Percent: 98,
  respiratoryInfection: false,
  hemoglobinGdl: 13.5,
  incisionType: "peripheral",
  surgeryDurationHours: 1.5
};

// =============================================================================
// 2. HELPER BADGE COLOR GENERATOR (UI ONLY)
// =============================================================================

function getBadgeStyle(riskTier) {
  switch (riskTier) {
    case "High Risk":
    case "مرتفع الخطورة (High Risk)":
      return "bg-rose-100 text-rose-800 border-rose-300";
    case "Moderate Risk":
    case "Intermediate Risk":
    case "متوسط الخطورة (Intermediate Risk)":
      return "bg-amber-100 text-amber-800 border-amber-300";
    case "Low Risk":
    case "منخفض الخطورة (Low Risk)":
    default:
      return "bg-emerald-100 text-emerald-800 border-emerald-300";
  }
}

function getAssessment() {
  return PreOpRiskCalculator.processFullAssessment({
    asaClass: state.asaClass,
    emergencyProcedure: state.emergencyProcedure,
    highRiskSurgery: state.highRiskSurgery,
    ischemicHeartDisease: state.ischemicHeartDisease,
    congestiveHeartFailure: state.congestiveHeartFailure,
    cerebrovascularDisease: state.cerebrovascularDisease,
    insulinDiabetes: state.insulinDiabetes,
    renallyImpaired: state.renallyImpaired,
    creatinineMgDl: state.creatinineMgDl,
    ageYears: state.ageYears,
    spo2Percent: state.spo2Percent,
    respiratoryInfection: state.respiratoryInfection,
    hemoglobinGdl: state.hemoglobinGdl,
    incisionType: state.incisionType,
    surgeryDurationHours: state.surgeryDurationHours
  });
}

// =============================================================================
// 3. MAIN RENDER FUNCTION
// =============================================================================

export function renderPreOpRiskView() {
  const assessment = getAssessment();

  return `
    <div class="space-y-4 max-w-2xl mx-auto font-sans dir-rtl text-right" id="preOpRiskContainer">

      <!-- HEADER -->
      <div class="p-4 bg-gradient-to-r from-slate-800 to-indigo-900 text-white rounded-2xl shadow-sm flex justify-between items-center">
        <div>
          <h2 class="font-bold text-base flex items-center gap-2">
            <span>📋</span>
            <span>تقييم المخاطر قبل العملية</span>
          </h2>
          <p class="text-[11px] opacity-80 mt-0.5" dir="ltr">Preoperative Risk Assessment (ASA | RCRI | ARISCAT)</p>
        </div>
        <button id="btnBackToDashboard" type="button" class="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-xl font-bold text-xs transition cursor-pointer">
          الرئيسية ↩
        </button>
      </div>

      <!-- TABS NAVIGATION -->
      <div class="flex border border-slate-200 bg-white rounded-xl p-1 shadow-sm text-xs font-bold overflow-x-auto">
        <button data-tab="asa" class="tab-btn flex-1 py-2 px-1 text-center rounded-lg transition cursor-pointer ${state.activeTab === 'asa' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-100'}">
          1. تصنيف ASA
        </button>
        <button data-tab="rcri" class="tab-btn flex-1 py-2 px-1 text-center rounded-lg transition cursor-pointer ${state.activeTab === 'rcri' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-100'}">
          2. القلب RCRI
        </button>
        <button data-tab="ariscat" class="tab-btn flex-1 py-2 px-1 text-center rounded-lg transition cursor-pointer ${state.activeTab === 'ariscat' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-100'}">
          3. الرئة ARISCAT
        </button>
        <button data-tab="summary" class="tab-btn flex-1 py-2 px-1 text-center rounded-lg transition cursor-pointer ${state.activeTab === 'summary' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 hover:bg-slate-100'}">
          4. التقرير 📊
        </button>
      </div>

      <!-- TAB CONTENT PANELS -->
      <div class="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
        ${state.activeTab === 'asa' ? renderAsaTab(assessment) : ''}
        ${state.activeTab === 'rcri' ? renderRcriTab(assessment) : ''}
        ${state.activeTab === 'ariscat' ? renderAriscatTab(assessment) : ''}
        ${state.activeTab === 'summary' ? renderSummaryTab(assessment) : ''}
      </div>

      <!-- CLINICAL DISCLAIMER -->
      <div class="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-[11px] text-amber-900 leading-relaxed">
        <strong class="font-bold block mb-0.5">⚠️ تنبيه سريري وتوجيهي:</strong>
        ${preOpRiskData.meta.disclaimer}
      </div>

    </div>
  `;
}

// =============================================================================
// 4. TAB PANELS BUILDERS
// =============================================================================

function renderAsaTab(assessment) {
  const asaData = preOpRiskData.asa;

  return `
    <div class="space-y-3">
      <div class="flex justify-between items-center border-b border-slate-100 pb-2">
        <h3 class="text-xs font-bold text-slate-800">${asaData.title}:</h3>
        <label class="flex items-center gap-1.5 cursor-pointer bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 text-amber-900">
          <input type="checkbox" id="emergency-check" ${state.emergencyProcedure ? 'checked' : ''} class="w-4 h-4 text-amber-600 rounded">
          <span class="text-xs font-bold">${asaData.emergencyModifier.label} <span dir="ltr">(+E)</span></span>
        </label>
      </div>

      <div class="grid grid-cols-1 gap-2.5">
        ${asaData.categories.map(cat => `
          <label class="p-3 border rounded-xl cursor-pointer transition flex items-start gap-3 ${state.asaClass === cat.id ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/20' : 'border-slate-200 hover:bg-slate-50'}">
            <input type="radio" name="asa-radio" value="${cat.id}" ${state.asaClass === cat.id ? 'checked' : ''} class="mt-1 text-blue-600">
            <div>
              <div class="flex items-center gap-2">
                <span class="font-mono font-bold text-xs bg-slate-800 text-white px-2 py-0.5 rounded">${cat.code}</span>
                <strong class="text-xs text-slate-900">${cat.title}</strong>
              </div>
              <p class="text-[11px] text-slate-600 mt-1">${cat.desc}</p>
              <p class="text-[10px] text-slate-400 mt-0.5"><strong>أمثلة:</strong> ${cat.example}</p>
            </div>
          </label>
        `).join('')}
      </div>
    </div>
  `;
}

function renderRcriTab(assessment) {
  const rcriData = preOpRiskData.rcri;
  const cardio = assessment.success ? assessment.cardiovascular : null;

  return `
    <div class="space-y-3">
      <div class="flex justify-between items-center border-b border-slate-100 pb-2">
        <div>
          <h3 class="text-xs font-bold text-slate-800">${rcriData.title}</h3>
          <p class="text-[10px] text-slate-500">اختر العوامل المتوفرة لدى المريض (كل عامل = 1 نقطة)</p>
        </div>
        <div id="rcri-badge-container">
          ${renderRcriBadge(cardio)}
        </div>
      </div>

      <div class="space-y-2">
        ${rcriData.factors.map(factor => {
          const isChecked = state[factor.id] || false;
          return `
            <label class="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3 cursor-pointer hover:bg-slate-100 transition">
              <input type="checkbox" data-rcri-id="${factor.id}" ${isChecked ? 'checked' : ''} class="rcri-check mt-0.5 w-4 h-4 text-blue-600 rounded">
              <div>
                <strong class="text-xs text-slate-800 block">${factor.label}</strong>
                <span class="text-[11px] text-slate-500">${factor.desc}</span>
              </div>
            </label>
          `;
        }).join('')}
      </div>

      <div class="p-3 bg-slate-100/80 rounded-xl border border-slate-200 text-xs space-y-1.5">
        <label class="block font-bold text-slate-700">مستوى الكرياتينين المصلي <span dir="ltr">(mg/dL)</span> - اختياري:</label>
        <input type="number" id="creatinine-input" step="0.1" min="0" placeholder="مثال: 2.2" value="${state.creatinineMgDl}" class="w-full p-2 border border-slate-300 rounded-lg bg-white font-mono text-xs">
        <p class="text-[10px] text-slate-500">عند إدخال قيمة أكبر من 2.0 mg/dL سيتم تفعيل عامل الكرياتينين تلقائياً.</p>
      </div>
    </div>
  `;
}

function renderRcriBadge(cardio) {
  if (!cardio) return '';
  const badgeStyle = getBadgeStyle(cardio.riskTier);
  return `
    <span class="px-2 py-0.5 text-xs font-bold rounded border font-mono ${badgeStyle}" dir="ltr">
      ${cardio.classLabel} (${cardio.score} Pts) — MACE: ${cardio.maceRatePercent}%
    </span>
  `;
}

function renderAriscatTab(assessment) {
  const ariscatData = preOpRiskData.ariscat;
  const factors = ariscatData.factors;
  const pulmonary = assessment.success ? assessment.pulmonary : null;

  return `
    <div class="space-y-3">
      <div class="flex justify-between items-center border-b border-slate-100 pb-2">
        <div>
          <h3 class="text-xs font-bold text-slate-800">${ariscatData.title}</h3>
          <p class="text-[10px] text-slate-500">المتغيرات الـ 7 لتقييم مضاعفات الرئة بعد العملية</p>
        </div>
        <div id="ariscat-badge-container">
          ${renderAriscatBadge(pulmonary)}
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <label class="block font-bold text-slate-700 mb-1">1. عمر المريض (بالسنوات):</label>
          <input type="number" id="ariscat-age" min="0" max="120" value="${state.ageYears}" class="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 font-bold font-mono text-xs">
        </div>

        <div>
          <label class="block font-bold text-slate-700 mb-1">2. تشبع أكسجين الدم <span dir="ltr">(SpO₂ % Room Air)</span>:</label>
          <input type="number" id="ariscat-spo2" min="50" max="100" value="${state.spo2Percent}" class="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 font-bold font-mono text-xs">
        </div>

        <div>
          <label class="block font-bold text-slate-700 mb-1">3. تركيز الهيموغلوبين في الدم <span dir="ltr">(Hb g/dL)</span>:</label>
          <input type="number" id="ariscat-hb" step="0.1" min="1" max="25" value="${state.hemoglobinGdl}" class="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 font-bold font-mono text-xs">
        </div>

        <div>
          <label class="block font-bold text-slate-700 mb-1">4. مدة الجراحة التقديرية (بالساعات):</label>
          <input type="number" id="ariscat-duration" step="0.5" min="0.1" max="24" value="${state.surgeryDurationHours}" class="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 font-bold font-mono text-xs">
        </div>

        <div class="sm:col-span-2">
          <label class="block font-bold text-slate-700 mb-1">5. موضع الشق الجراحي:</label>
          <select id="ariscat-incision" class="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 font-bold text-xs">
            ${factors.incisionOptions.map(opt => `
              <option value="${opt.value}" ${state.incisionType === opt.value ? 'selected' : ''}>${opt.label} (${opt.points} Pts)</option>
            `).join('')}
          </select>
        </div>
      </div>

      <div class="space-y-2 pt-2 border-t border-slate-100 text-xs">
        <label class="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition">
          <input type="checkbox" id="ariscat-resp-inf" ${state.respiratoryInfection ? 'checked' : ''} class="w-4 h-4 text-blue-600 rounded">
          <div>
            <strong class="text-slate-800 block">6. ${factors.respiratoryInfection.label} (+${factors.respiratoryInfection.points} Pts)</strong>
            <span class="text-[11px] text-slate-500">${factors.respiratoryInfection.desc}</span>
          </div>
        </label>

        <!-- FACTOR 7: EXPLICIT EMERGENCY SURGERY SYNC -->
        <label class="flex items-center gap-2 p-2.5 bg-amber-50/80 border border-amber-200 rounded-xl cursor-pointer hover:bg-amber-100/80 transition">
          <input type="checkbox" id="ariscat-emergency-sync" ${state.emergencyProcedure ? 'checked' : ''} class="w-4 h-4 text-amber-600 rounded">
          <div>
            <strong class="text-amber-950 block">7. جراحة طارئة (Emergency Procedure) (+${factors.emergencyProcedure.points} Pts)</strong>
            <span class="text-[11px] text-amber-800">تُفرَض عند إجراء الجراحة بشكل طارئ وغير مبرمج (متزامنة مع خيار ASA +E).</span>
          </div>
        </label>
      </div>
    </div>
  `;
}

function renderAriscatBadge(pulmonary) {
  if (!pulmonary) return '';
  const badgeStyle = getBadgeStyle(pulmonary.tierLabel);
  return `
    <span class="px-2 py-0.5 text-xs font-bold rounded border font-mono ${badgeStyle}" dir="ltr">
      Score: ${pulmonary.score} Pts — PPCs: ${pulmonary.ppcRatePercent}%
    </span>
  `;
}

function renderSummaryTab(assessment) {
  if (!assessment || !assessment.success) {
    return `
      <div class="p-4 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-xs">
        <strong>⚠️ خطأ في التقييم:</strong> تعذر احتساب التقرير السريري المدمج. يرجى مراجعة المدخلات.
      </div>
    `;
  }

  const asa = assessment.asa;
  const cardio = assessment.cardiovascular;
  const pulmonary = assessment.pulmonary;

  const cardioStyle = getBadgeStyle(cardio.riskTier);
  const pulmonaryStyle = getBadgeStyle(pulmonary.tierLabel);

  return `
    <div class="space-y-4">
      <h3 class="text-xs font-bold text-slate-800 border-b border-slate-100 pb-2 flex justify-between items-center">
        <span>📊 ملخص تقييم المخاطر المدمج <span dir="ltr">(Integrated Risk Summary)</span></span>
        <span class="text-[10px] text-slate-400 font-mono">AnesthesiaX Report</span>
      </h3>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-center text-xs">
        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
          <div>
            <span class="text-[10px] text-slate-500 block mb-1">الحالة الجسدية العامة</span>
            <strong class="font-mono text-slate-900 text-sm block" dir="ltr">${asa.displayCode}</strong>
          </div>
          <span class="text-[10px] text-slate-600 mt-1 block">${asa.asa.title}</span>
        </div>

        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
          <div>
            <span class="text-[10px] text-slate-500 block mb-1">الخطر القلبي (RCRI)</span>
            <strong class="font-mono text-slate-900 text-sm block" dir="ltr">${cardio.classLabel} (${cardio.score} Pts)</strong>
          </div>
          <span class="text-[10px] font-bold mt-1 inline-block px-2 py-0.5 rounded border ${cardioStyle}" dir="ltr">
            MACE Rate: ${cardio.maceRatePercent}%
          </span>
        </div>

        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
          <div>
            <span class="text-[10px] text-slate-500 block mb-1">الخطر الرئوي (ARISCAT)</span>
            <strong class="font-mono text-slate-900 text-sm block" dir="ltr">${pulmonary.score} Points</strong>
          </div>
          <span class="text-[10px] font-bold mt-1 inline-block px-2 py-0.5 rounded border ${pulmonaryStyle}" dir="ltr">
            PPC Rate: ${pulmonary.ppcRatePercent}%
          </span>
        </div>
      </div>

      <div class="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs space-y-2 leading-relaxed">
        <h4 class="font-bold text-blue-950 flex items-center gap-1">
          <span>💡</span>
          <span>تنبيهات استرشادية قبل العملية <span dir="ltr">(Clinical Considerations)</span>:</span>
        </h4>

        <ul class="list-disc list-inside space-y-2 text-blue-900 text-[11px]">
          <li><strong>الجانب القلبي:</strong> ${cardio.clinicalConsideration}</li>
          <li><strong>الجانب التنفسي:</strong> ${pulmonary.clinicalConsideration}</li>

          ${assessment.warnings && assessment.warnings.length > 0 ? `
            ${assessment.warnings.map(warn => `
              <li class="text-amber-900 font-bold">
                ⚠️ <strong>تنبيه الجراحة الطارئة:</strong> ${warn}
              </li>
            `).join('')}
          ` : ''}
        </ul>
      </div>
    </div>
  `;
}

// =============================================================================
// 5. TARGETED LIVE DOM UPDATES & EVENT BINDINGS
// =============================================================================

function updateLiveBadges() {
  const assessment = getAssessment();

  const rcriContainer = document.getElementById("rcri-badge-container");
  if (rcriContainer && assessment.success) {
    rcriContainer.innerHTML = renderRcriBadge(assessment.cardiovascular);
  }

  const ariscatContainer = document.getElementById("ariscat-badge-container");
  if (ariscatContainer && assessment.success) {
    ariscatContainer.innerHTML = renderAriscatBadge(assessment.pulmonary);
  }
}

export function initPreOpRiskEvents() {
  const container = document.getElementById("preOpRiskContainer");
  if (!container) return;

  // Back Button
  const btnBack = document.getElementById("btnBackToDashboard");
  if (btnBack) {
    btnBack.addEventListener("click", () => {
      if (typeof window.navigateTo === "function") window.navigateTo("dashboard");
    });
  }

  // Tabs Switching
  container.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      state.activeTab = e.currentTarget.getAttribute("data-tab");
      reRenderFull();
    });
  });

  // ASA Radio Selection
  container.querySelectorAll('input[name="asa-radio"]').forEach(radio => {
    radio.addEventListener("change", (e) => {
      state.asaClass = e.target.value;
      reRenderFull();
    });
  });

  // Emergency Checkbox (ASA Tab)
  const emergCheck = document.getElementById("emergency-check");
  if (emergCheck) {
    emergCheck.addEventListener("change", (e) => {
      state.emergencyProcedure = e.target.checked;
      reRenderFull();
    });
  }

  // Emergency Checkbox Sync (ARISCAT Tab)
  const ariscatEmergSync = document.getElementById("ariscat-emergency-sync");
  if (ariscatEmergSync) {
    ariscatEmergSync.addEventListener("change", (e) => {
      state.emergencyProcedure = e.target.checked;
      reRenderFull();
    });
  }

  // RCRI Checkboxes
  container.querySelectorAll(".rcri-check").forEach(chk => {
    chk.addEventListener("change", (e) => {
      const factorId = e.target.getAttribute("data-rcri-id");
      if (factorId) {
        state[factorId] = e.target.checked;
        updateLiveBadges();
      }
    });
  });

  // Creatinine Input (Input event without DOM destroy)
  const creatInput = document.getElementById("creatinine-input");
  if (creatInput) {
    creatInput.addEventListener("input", (e) => {
      state.creatinineMgDl = e.target.value;
      updateLiveBadges();
    });
  }

  // ARISCAT Inputs (Input events update state and badges live without focus loss)
  const ageInput = document.getElementById("ariscat-age");
  if (ageInput) ageInput.addEventListener("input", e => { state.ageYears = e.target.value; updateLiveBadges(); });

  const spo2Input = document.getElementById("ariscat-spo2");
  if (spo2Input) spo2Input.addEventListener("input", e => { state.spo2Percent = e.target.value; updateLiveBadges(); });

  const hbInput = document.getElementById("ariscat-hb");
  if (hbInput) hbInput.addEventListener("input", e => { state.hemoglobinGdl = e.target.value; updateLiveBadges(); });

  const durationInput = document.getElementById("ariscat-duration");
  if (durationInput) durationInput.addEventListener("input", e => { state.surgeryDurationHours = e.target.value; updateLiveBadges(); });

  const incisionSelect = document.getElementById("ariscat-incision");
  if (incisionSelect) incisionSelect.addEventListener("change", e => { state.incisionType = e.target.value; updateLiveBadges(); });

  const respInfCheck = document.getElementById("ariscat-resp-inf");
  if (respInfCheck) respInfCheck.addEventListener("change", e => { state.respiratoryInfection = e.target.checked; updateLiveBadges(); });
}

function reRenderFull() {
  const appContent = document.getElementById("app-content");
  if (appContent) {
    appContent.innerHTML = renderPreOpRiskView();
    initPreOpRiskEvents();
  }
}
