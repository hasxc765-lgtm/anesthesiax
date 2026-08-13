/**
 * Arterial Blood Gas (ABG) & Electrolytes Unified UI Component
 *
 * AnesthesiaX — Phase 9.0 (Audited Edition)
 * File: js/components/abgView.js
 *
 * Architecture:
 * ES Module View Layer with Targeted Live DOM Updates, Unit Switcher, RTL BDI Wrappers, and ICU Note Generator.
 *
 * Consumes:
 * - ../data/abgData.js
 * - ../calculators/abgCalculator.js
 */

import { abgData } from "../data/abgData.js";
import { AbgCalculator } from "../calculators/abgCalculator.js";

// =============================================================================
// 1. MODULE LOCAL STATE
// =============================================================================

const state = {
  activeTab: "abg", // "abg" | "electrolytes" | "summary"

  // ABG Inputs
  ph: "7.25",
  paco2: "28",
  hco3: "12",
  pao2: "85",
  fio2: "40",
  respiratoryTimeline: "acute", // "acute" | "chronic"

  // Electrolyte Inputs
  na: "138",
  k: "4.2",
  cl: "100",
  albumin: "3.2",
  glucose: "180",
  glucoseUnit: "mg/dL", // "mg/dL" | "mmol/L"
  calcium: "8.2",

  // Patient Demographics
  age: "45",
  weight: "70",
  gender: "male" // "male" | "female"
};

// =============================================================================
// 2. HELPER BADGE STYLE GENERATOR
// =============================================================================

function getBadgeStyle(label) {
  if (!label) return "bg-slate-100 text-slate-800 border-slate-300";
  const str = String(label).toLowerCase();

  if (str.includes("severe") || str.includes("acidemia") || str.includes("alkalemia") || str.includes("hagma") || str.includes("mixed") || str.includes("🚨")) {
    return "bg-rose-100 text-rose-800 border-rose-300";
  }
  if (str.includes("moderate") || str.includes("mild") || str.includes("suggests") || str.includes("compensated") || str.includes("⚠️")) {
    return "bg-amber-100 text-amber-800 border-amber-300";
  }
  return "bg-emerald-100 text-emerald-800 border-emerald-300";
}

function getCalculationResult() {
  return AbgCalculator.calculate({
    ph: state.ph,
    paco2: state.paco2,
    hco3: state.hco3,
    pao2: state.pao2,
    fio2: state.fio2,
    respiratoryTimeline: state.respiratoryTimeline,
    na: state.na,
    k: state.k,
    cl: state.cl,
    albumin: state.albumin,
    glucose: state.glucose,
    glucoseUnit: state.glucoseUnit,
    calcium: state.calcium,
    age: state.age,
    weight: state.weight,
    gender: state.gender
  });
}

// =============================================================================
// 3. MAIN RENDER FUNCTION
// =============================================================================

export function renderAbgView() {
  const result = getCalculationResult();

  return `
    <div class="space-y-4 max-w-3xl mx-auto font-sans dir-rtl text-right" id="abgContainer">

      <!-- HEADER -->
      <div class="p-4 bg-gradient-to-r from-teal-800 to-indigo-900 text-white rounded-2xl shadow-sm flex justify-between items-center">
        <div>
          <h2 class="font-bold text-base flex items-center gap-2">
            <span>🧪</span>
            <span>مركز تحليل غازات الدم والأملاح</span>
          </h2>
          <p class="text-[11px] opacity-80 mt-0.5" dir="ltr">ABG & Electrolytes Clinical Center (Phase 9.0)</p>
        </div>
        <button id="btnBackToDashboard" type="button" class="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-xl font-bold text-xs transition cursor-pointer">
          الرئيسية ↩
        </button>
      </div>

      <!-- PRIMARY TABS -->
      <div class="flex border border-slate-200 bg-white rounded-xl p-1 shadow-sm text-xs font-bold overflow-x-auto gap-1">
        <button data-tab="abg" class="tab-btn flex-1 min-w-[120px] py-2 px-1 text-center rounded-lg transition cursor-pointer ${state.activeTab === 'abg' ? 'bg-teal-700 text-white shadow' : 'text-slate-600 hover:bg-slate-100'}">
          <span>غازات الدم الشرياني</span>
        </button>
        <button data-tab="electrolytes" class="tab-btn flex-1 min-w-[130px] py-2 px-1 text-center rounded-lg transition cursor-pointer ${state.activeTab === 'electrolytes' ? 'bg-teal-700 text-white shadow' : 'text-slate-600 hover:bg-slate-100'}">
          <span>الأملاح والتصحيح الشاردي ⚡</span>
        </button>
        <button data-tab="summary" class="tab-btn flex-1 min-w-[120px] py-2 px-1 text-center rounded-lg transition cursor-pointer ${state.activeTab === 'summary' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 hover:bg-slate-100'}">
          <span>التقرير والملخص السريري 📊</span>
        </button>
      </div>

      <!-- VALIDATION ALERT CONTAINER -->
      <div id="validationAlertContainer">
        ${result.validationError ? `
          <div class="p-3 bg-rose-50 border border-rose-300 text-rose-800 rounded-xl text-xs font-bold">
            ⚠️ تنبيه صحة البيانات: ${result.validationError}
          </div>
        ` : ''}
      </div>

      <!-- TAB CONTENT PANELS -->
      <div class="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
        ${state.activeTab === 'abg' ? renderAbgPanel(result) : ''}
        ${state.activeTab === 'electrolytes' ? renderElectrolytesPanel(result) : ''}
        ${state.activeTab === 'summary' ? renderSummaryPanel(result) : ''}
      </div>

      <!-- CLINICAL DISCLAIMER -->
      <div class="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-[11px] text-amber-900 leading-relaxed">
        <strong class="font-bold block mb-0.5">⚠️ تنبيه سريري وتوجيهي:</strong>
        ${abgData.meta.disclaimer}
      </div>

    </div>
  `;
}

// =============================================================================
// 4. TAB PANELS & CARDS BUILDERS
// =============================================================================

function renderAbgPanel(result) {
  return `
    <div class="space-y-5">
      <!-- INPUTS GRID -->
      <div>
        <div class="flex justify-between items-center border-b border-slate-100 pb-2 mb-3">
          <h3 class="text-xs font-bold text-slate-800">
            مدخلات عينة غازات الدم الشرياني:
          </h3>
          
          <!-- ACCUTE VS CHRONIC TOGGLE -->
          <div class="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[10px] font-bold">
            <button id="btnTimelineAcute" type="button" class="px-2 py-0.5 rounded transition ${state.respiratoryTimeline === 'acute' ? 'bg-teal-700 text-white shadow' : 'text-slate-600 hover:bg-slate-200'}">
              حاد (Acute)
            </button>
            <button id="btnTimelineChronic" type="button" class="px-2 py-0.5 rounded transition ${state.respiratoryTimeline === 'chronic' ? 'bg-teal-700 text-white shadow' : 'text-slate-600 hover:bg-slate-200'}">
              مزمن (Chronic)
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label class="block font-bold text-slate-700 mb-1">الرقم الهيدروجيني <bdi dir="ltr" class="font-mono">(pH)</bdi>:</label>
            <input type="number" id="abg-ph" step="0.01" min="6.5" max="7.8" placeholder="مثال: 7.25" value="${state.ph}" class="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 font-bold font-mono text-xs">
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">ضغط <bdi dir="ltr" class="font-mono">PaCO₂ (mmHg)</bdi>:</label>
            <input type="number" id="abg-paco2" step="1" min="10" max="150" placeholder="مثال: 28" value="${state.paco2}" class="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 font-bold font-mono text-xs">
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">البيكربونات <bdi dir="ltr" class="font-mono">HCO₃⁻ (mEq/L)</bdi>:</label>
            <input type="number" id="abg-hco3" step="1" min="2" max="60" placeholder="مثال: 12" value="${state.hco3}" class="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 font-bold font-mono text-xs">
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">ضغط الأكسجين <bdi dir="ltr" class="font-mono">PaO₂ (mmHg)</bdi>:</label>
            <input type="number" id="abg-pao2" step="1" min="20" max="600" placeholder="مثال: 85" value="${state.pao2}" class="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 font-bold font-mono text-xs">
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">نسبة الأكسجين المضمونة <bdi dir="ltr" class="font-mono">FiO₂ (%)</bdi>:</label>
            <input type="number" id="abg-fio2" step="1" min="21" max="100" placeholder="مثال: 40" value="${state.fio2}" class="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 font-bold font-mono text-xs">
          </div>
        </div>
      </div>

      <!-- ACID-BASE RESULT CONTAINER -->
      <div id="acidBaseResultCard">${renderAcidBaseCardHTML(result)}</div>

      <!-- OXYGENATION RESULT CONTAINER -->
      <div id="oxygenationResultCard">${renderOxygenationCardHTML(result)}</div>
    </div>
  `;
}

function renderAcidBaseCardHTML(result) {
  const ab = result.acidBase || {};

  return `
    <div class="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
      <div class="flex justify-between items-center border-b border-slate-200 pb-2">
        <strong class="text-slate-800">تشخيص النمط الحمضي-القاعدي الأولي:</strong>
        <span class="px-2 py-0.5 text-xs font-bold rounded border font-mono ${getBadgeStyle(ab.primaryDisorder)}" dir="ltr">
          ${ab.primaryDisorder || "غير محدد"}
        </span>
      </div>

      <p class="text-slate-600 leading-relaxed text-[11px]">
        <strong>تقييم الاستجابة التعويضية:</strong> ${ab.compensationStatus || "—"}
      </p>

      ${ab.wintersFormula ? `
        <div class="p-2 bg-indigo-50/70 border border-indigo-200 rounded-lg text-[11px] text-indigo-950 font-mono" dir="ltr">
          <strong>Winter's Formula PaCO₂ Target:</strong> ${ab.wintersFormula.min} - ${ab.wintersFormula.max} mmHg
        </div>
      ` : ''}
    </div>
  `;
}

function renderOxygenationCardHTML(result) {
  const ox = result.oxygenation || {};

  return `
    <div class="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
      <div class="flex justify-between items-center border-b border-slate-200 pb-2">
        <strong class="text-slate-800">تقييم الأكسجة ونسبة P/F Ratio:</strong>
        ${ox.calculated ? `
          <span class="px-2 py-0.5 text-xs font-bold rounded border font-mono ${getBadgeStyle(ox.severityLabel)}" dir="ltr">
            P/F: ${ox.pfRatio} (FiO₂: ${ox.fio2Percent}%)
          </span>
        ` : `<span class="text-slate-400 font-mono text-[11px]">${ox.message}</span>`}
      </div>

      ${ox.calculated ? `
        <p class="text-slate-700 font-bold text-[11px]">${ox.severityLabel}</p>
        <p class="text-amber-900 bg-amber-50 p-2 rounded-lg border border-amber-200 text-[10px] leading-relaxed">
          ${ox.clinicalNotice}
        </p>
      ` : ''}
    </div>
  `;
}

function renderElectrolytesPanel(result) {
  return `
    <div class="space-y-5">
      <!-- INPUTS GRID -->
      <div>
        <div class="flex justify-between items-center border-b border-slate-100 pb-2 mb-3">
          <h3 class="text-xs font-bold text-slate-800">
            مدخلات الكيمياء والأملاح:
          </h3>

          <!-- GLUCOSE UNIT SWITCHER -->
          <div class="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[10px] font-bold">
            <span class="text-slate-500 px-1">وحدة السكر:</span>
            <button id="btnGlucoseMgDl" type="button" class="px-2 py-0.5 rounded transition ${state.glucoseUnit === 'mg/dL' ? 'bg-teal-700 text-white shadow' : 'text-slate-600 hover:bg-slate-200'}">
              mg/dL
            </button>
            <button id="btnGlucoseMmol" type="button" class="px-2 py-0.5 rounded transition ${state.glucoseUnit === 'mmol/L' ? 'bg-teal-700 text-white shadow' : 'text-slate-600 hover:bg-slate-200'}">
              mmol/L
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label class="block font-bold text-slate-700 mb-1">الصوديوم <bdi dir="ltr" class="font-mono">Na⁺ (mEq/L)</bdi>:</label>
            <input type="number" id="elyte-na" step="1" placeholder="مثال: 138" value="${state.na}" class="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 font-bold font-mono text-xs">
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">الكلوريد <bdi dir="ltr" class="font-mono">Cl⁻ (mEq/L)</bdi>:</label>
            <input type="number" id="elyte-cl" step="1" placeholder="مثال: 100" value="${state.cl}" class="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 font-bold font-mono text-xs">
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">البوتاسيوم <bdi dir="ltr" class="font-mono">K⁺ (mEq/L)</bdi>:</label>
            <input type="number" id="elyte-k" step="0.1" placeholder="مثال: 4.2" value="${state.k}" class="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 font-bold font-mono text-xs">
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">الألبومين <bdi dir="ltr" class="font-mono">Albumin (g/dL)</bdi>:</label>
            <input type="number" id="elyte-albumin" step="0.1" placeholder="مثال: 3.2 (افتراضي 4.0)" value="${state.albumin}" class="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 font-bold font-mono text-xs">
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">السكر في الدم <bdi dir="ltr" class="font-mono">Glucose (${state.glucoseUnit})</bdi>:</label>
            <input type="number" id="elyte-glucose" step="0.1" placeholder="مثال: ${state.glucoseUnit === 'mg/dL' ? '180' : '10'}" value="${state.glucose}" class="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 font-bold font-mono text-xs">
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">الكالسيوم الكلي <bdi dir="ltr" class="font-mono">Calcium (mg/dL)</bdi>:</label>
            <input type="number" id="elyte-calcium" step="0.1" placeholder="مثال: 8.2" value="${state.calcium}" class="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 font-bold font-mono text-xs">
          </div>
        </div>
      </div>

      <!-- DEMOGRAPHICS FOR FREE WATER DEFICIT -->
      <div class="p-3 bg-slate-100/70 rounded-xl border border-slate-200 text-xs space-y-2">
        <strong class="text-slate-800 block text-[11px]">بيانات المريض لحساب عجز الماء الحر (Free Water Deficit):</strong>
        <div class="grid grid-cols-3 gap-2">
          <div>
            <label class="block text-[10px] text-slate-600 mb-0.5">العمر (سنوات):</label>
            <input type="number" id="patient-age" value="${state.age}" class="w-full p-1.5 border rounded bg-white font-mono text-xs">
          </div>

          <div>
            <label class="block text-[10px] text-slate-600 mb-0.5">الوزن (kg):</label>
            <input type="number" id="patient-weight" value="${state.weight}" class="w-full p-1.5 border rounded bg-white font-mono text-xs">
          </div>

          <div>
            <label class="block text-[10px] text-slate-600 mb-0.5">الجنس:</label>
            <select id="patient-gender" class="w-full p-1.5 border rounded bg-white text-xs font-bold">
              <option value="male" ${state.gender === 'male' ? 'selected' : ''}>ذكر</option>
              <option value="female" ${state.gender === 'female' ? 'selected' : ''}>أنثى</option>
            </select>
          </div>
        </div>
      </div>

      <!-- ANION GAP RESULT CONTAINER -->
      <div id="anionGapResultCard">${renderAnionGapCardHTML(result)}</div>

      <!-- SODIUM & CALCIUM CORRECTIONS CONTAINER -->
      <div id="sodiumCalciumResultCard">${renderSodiumCalciumCardHTML(result)}</div>
    </div>
  `;
}

function renderAnionGapCardHTML(result) {
  const ag = result.anionGap || {};

  return `
    <div class="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
      <div class="flex justify-between items-center border-b border-slate-200 pb-2">
        <strong class="text-slate-800">الفجوة الشاردية (Anion Gap) ونسبة الدلتا:</strong>
        ${ag.calculated ? `
          <span class="px-2 py-0.5 text-xs font-bold rounded border font-mono ${getBadgeStyle(ag.isHagma ? 'HAGMA' : 'Normal')}" dir="ltr">
            AG: ${ag.effectiveAG} mEq/L ${ag.isAlbuminCorrected ? '(Albumin-Corrected)' : ''}
          </span>
        ` : `<span class="text-slate-400 font-mono text-[11px]">${ag.message}</span>`}
      </div>

      ${ag.calculated ? `
        <p class="text-slate-600 text-[11px]">
          <strong>الفجوة القياسية:</strong> <bdi dir="ltr" class="font-mono">${ag.standardAG} mEq/L</bdi>
          ${ag.isAlbuminCorrected ? ` | <strong>الفجوة المعدلة للألبومين:</strong> <bdi dir="ltr" class="font-mono">${ag.correctedAG} mEq/L</bdi>` : ''}
        </p>

        ${ag.deltaRatio ? `
          <div class="p-2 bg-indigo-50 border border-indigo-200 rounded-lg text-[11px] text-indigo-900 space-y-1">
            <p><strong>Delta Ratio:</strong> <bdi dir="ltr" class="font-mono font-bold">${ag.deltaRatio.ratio}</bdi> (ΔAG: ${ag.deltaRatio.deltaAG} / ΔHCO₃⁻: ${ag.deltaRatio.deltaHCO3})</p>
            <p class="text-[10px]">${ag.deltaRatio.interpretation}</p>
          </div>
        ` : ''}
      ` : ''}
    </div>
  `;
}

function renderSodiumCalciumCardHTML(result) {
  const naResult = result.sodium || {};
  const caResult = result.calcium || {};
  const kAlert = result.potassiumAlert;

  return `
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
      <!-- SODIUM CORRECTION -->
      <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
        <strong class="text-slate-800 block border-b border-slate-200 pb-1">تصحيح الصوديوم في فرط السكر:</strong>
        ${naResult.katzCorrectedNa !== null ? `
          <p class="text-[11px] text-slate-700"><strong>Katz Formula (1.6):</strong> <bdi dir="ltr" class="font-mono font-bold">${naResult.katzCorrectedNa} mEq/L</bdi></p>
          <p class="text-[11px] text-slate-700"><strong>Hillier Formula (2.4):</strong> <bdi dir="ltr" class="font-mono font-bold">${naResult.hillierCorrectedNa} mEq/L</bdi></p>
        ` : `<p class="text-slate-500 text-[10px]">لا توجد حاجة لتصحيح الصوديوم (السكر ≤ 100 mg/dL).</p>`}

        ${naResult.freeWaterDeficitLiters !== null ? `
          <div class="mt-2 pt-2 border-t border-slate-200 text-[11px] text-amber-950 font-bold">
            عجز الماء الحر التقديري: <bdi dir="ltr" class="font-mono">${naResult.freeWaterDeficitLiters} Liters</bdi>
            <p class="font-normal text-[10px] text-amber-900 mt-0.5">${naResult.rateNotice}</p>
          </div>
        ` : ''}
      </div>

      <!-- CALCIUM CORRECTION & POTASSIUM ALERT -->
      <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
        <div>
          <strong class="text-slate-800 block border-b border-slate-200 pb-1 mb-1">تصحيح الكالسيوم الكلي (Payne):</strong>
          ${caResult.calculated ? `
            <p class="text-[11px] text-slate-700">
              <strong>الكالسيوم المعدل بالألبومين:</strong> <bdi dir="ltr" class="font-mono font-bold">${caResult.correctedCalcium} mg/dL</bdi>
            </p>
            <p class="text-[10px] text-slate-500 mt-0.5">${caResult.hypoNotice}</p>
          ` : `<p class="text-slate-400 text-[10px]">${caResult.message}</p>`}
        </div>

        ${kAlert ? `
          <div class="p-2 border rounded-lg text-[10px] font-bold leading-relaxed ${getBadgeStyle(kAlert.alertText)}">
            ${kAlert.alertText}
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

function renderSummaryPanel(result) {
  return `
    <div class="space-y-4">
      <div class="flex justify-between items-center border-b border-slate-100 pb-2">
        <h3 class="text-xs font-bold text-slate-800">
          التقرير السريري المدمج لغازات الدم والأملاح:
        </h3>
        <div class="flex gap-2">
          <button id="btnCopyIcuNote" type="button" class="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer">
            <span>📋</span>
            <span>نسخ تقرير العناية</span>
          </button>
          <button id="btnPrintReport" type="button" class="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer">
            <span>🖨️</span>
            <span>طباعة PDF</span>
          </button>
        </div>
      </div>

      <div id="summaryResultsCard">${renderSummaryCardHTML(result)}</div>
    </div>
  `;
}

function renderSummaryCardHTML(result) {
  if (!result || !result.success) {
    return `
      <div class="p-4 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-xs">
        <strong>⚠️ خطأ في التقييم:</strong> تعذر حساب نتائج تحليل غازات الدم والأملاح. يرجى مراجعة المدخلات.
      </div>
    `;
  }

  const ab = result.acidBase || {};
  const ag = result.anionGap || {};
  const ox = result.oxygenation || {};
  const naResult = result.sodium || {};
  const caResult = result.calcium || {};
  const kAlert = result.potassiumAlert;

  return `
    <div class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
        <!-- ACID BASE CARD -->
        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
          <span class="text-[10px] text-slate-500 block">الاضطراب الحمضي-القاعدي الأولي:</span>
          <strong class="font-mono text-slate-900 text-xs block" dir="ltr">${ab.primaryDisorder || "—"}</strong>
          <p class="text-[10px] text-slate-600 mt-1">${ab.compensationStatus || "—"}</p>
        </div>

        <!-- ANION GAP CARD -->
        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
          <span class="text-[10px] text-slate-500 block">الفجوة الشاردية (Anion Gap):</span>
          <strong class="font-mono text-slate-900 text-xs block" dir="ltr">
            AG: ${ag.effectiveAG || "—"} mEq/L ${ag.isAlbuminCorrected ? '(Corrected)' : ''}
          </strong>
          ${ag.deltaRatio ? `<p class="text-[10px] text-indigo-900 font-bold mt-1">Delta Ratio: ${ag.deltaRatio.ratio}</p>` : ''}
        </div>

        <!-- OXYGENATION CARD -->
        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
          <span class="text-[10px] text-slate-500 block">تقييم الأكسجة (P/F Ratio):</span>
          <strong class="font-mono text-slate-900 text-xs block" dir="ltr">
            ${ox.calculated ? `P/F: ${ox.pfRatio} (FiO₂: ${ox.fio2Percent}%)` : 'غير محسوب'}
          </strong>
          <p class="text-[10px] text-slate-600 mt-1">${ox.severityLabel || "—"}</p>
        </div>

        <!-- ELECTROLYTES SUMMARY -->
        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
          <span class="text-[10px] text-slate-500 block">تصحيحات الأملاح:</span>
          <p class="text-[11px] text-slate-800">
            <strong>الصوديوم المعدل (Katz):</strong> <bdi dir="ltr" class="font-mono">${naResult.katzCorrectedNa || naResult.measuredNa || '—'} mEq/L</bdi>
          </p>
          <p class="text-[11px] text-slate-800">
            <strong>الكالسيوم المعدل:</strong> <bdi dir="ltr" class="font-mono">${caResult.correctedCalcium || '—'} mg/dL</bdi>
          </p>
        </div>
      </div>

      <!-- ICU FORMATTED TEXT PREVIEW -->
      <div class="p-3 bg-slate-800 text-slate-100 rounded-xl text-[10px] font-mono space-y-1" dir="ltr">
        <strong class="text-teal-400 block font-sans">Preview for ICU Progress Note:</strong>
        <pre class="whitespace-pre-wrap leading-relaxed">${result.icuNote}</pre>
      </div>

      ${kAlert ? `
        <div class="p-3 border rounded-xl text-xs font-bold leading-relaxed ${getBadgeStyle(kAlert.alertText)}">
          ${kAlert.alertText}
        </div>
      ` : ''}
    </div>
  `;
}

// =========================================================
// 5. TARGETED LIVE DOM UPDATES & EVENT BINDINGS
// =========================================================

export function initAbgEvents() {
  const container = document.getElementById("abgContainer");
  if (!container) return;

  // Back Button
  const btnBack = document.getElementById("btnBackToDashboard");
  if (btnBack) {
    btnBack.addEventListener("click", () => {
      if (typeof window.navigateTo === "function") window.navigateTo("dashboard");
    });
  }

  // Print Handler
  const btnPrint = document.getElementById("btnPrintReport");
  if (btnPrint) {
    btnPrint.addEventListener("click", () => {
      window.print();
    });
  }

  // Copy ICU Progress Note Handler
  const btnCopy = document.getElementById("btnCopyIcuNote");
  if (btnCopy) {
    btnCopy.addEventListener("click", () => {
      const result = getCalculationResult();
      if (result.icuNote && navigator.clipboard) {
        navigator.clipboard.writeText(result.icuNote).then(() => {
          btnCopy.innerHTML = "<span>✅</span> <span>تم النسخ!</span>";
          setTimeout(() => {
            btnCopy.innerHTML = "<span>📋</span> <span>نسخ تقرير العناية</span>";
          }, 2000);
        });
      }
    });
  }

  // Acute vs Chronic Timeline Buttons
  const btnAcute = document.getElementById("btnTimelineAcute");
  const btnChronic = document.getElementById("btnTimelineChronic");
  if (btnAcute && btnChronic) {
    btnAcute.addEventListener("click", () => {
      state.respiratoryTimeline = "acute";
      reRenderFull();
    });
    btnChronic.addEventListener("click", () => {
      state.respiratoryTimeline = "chronic";
      reRenderFull();
    });
  }

  // Glucose Unit Switcher Buttons
  const btnMgDl = document.getElementById("btnGlucoseMgDl");
  const btnMmol = document.getElementById("btnGlucoseMmol");
  if (btnMgDl && btnMmol) {
    btnMgDl.addEventListener("click", () => {
      if (state.glucoseUnit !== "mg/dL") {
        state.glucoseUnit = "mg/dL";
        reRenderFull();
      }
    });
    btnMmol.addEventListener("click", () => {
      if (state.glucoseUnit !== "mmol/L") {
        state.glucoseUnit = "mmol/L";
        reRenderFull();
      }
    });
  }

  // Tabs Switching
  container.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      state.activeTab = e.currentTarget.getAttribute("data-tab");
      reRenderFull();
    });
  });

  // ABG Live Input Listeners (Targeted Updates)
  bindInput("abg-ph", "ph");
  bindInput("abg-paco2", "paco2");
  bindInput("abg-hco3", "hco3");
  bindInput("abg-pao2", "pao2");
  bindInput("abg-fio2", "fio2");

  // Electrolytes Live Input Listeners (Targeted Updates)
  bindInput("elyte-na", "na");
  bindInput("elyte-cl", "cl");
  bindInput("elyte-k", "k");
  bindInput("elyte-albumin", "albumin");
  bindInput("elyte-glucose", "glucose");
  bindInput("elyte-calcium", "calcium");

  // Demographics Input Listeners (Targeted Updates)
  bindInput("patient-age", "age");
  bindInput("patient-weight", "weight");

  const genderSelect = document.getElementById("patient-gender");
  if (genderSelect) {
    genderSelect.addEventListener("change", (e) => {
      state.gender = e.target.value;
      updateResultsDOM();
    });
  }
}

function bindInput(elementId, stateKey) {
  const el = document.getElementById(elementId);
  if (el) {
    el.addEventListener("input", (e) => {
      state[stateKey] = e.target.value;
      updateResultsDOM();
    });
  }
}

function updateResultsDOM() {
  const result = getCalculationResult();

  const alertContainer = document.getElementById("validationAlertContainer");
  if (alertContainer) {
    alertContainer.innerHTML = result.validationError ? `
      <div class="p-3 bg-rose-50 border border-rose-300 text-rose-800 rounded-xl text-xs font-bold">
        ⚠️ تنبيه صحة البيانات: ${result.validationError}
      </div>
    ` : '';
  }

  const acidBaseCard = document.getElementById("acidBaseResultCard");
  if (acidBaseCard) acidBaseCard.innerHTML = renderAcidBaseCardHTML(result);

  const oxygenationCard = document.getElementById("oxygenationResultCard");
  if (oxygenationCard) oxygenationCard.innerHTML = renderOxygenationCardHTML(result);

  const anionGapCard = document.getElementById("anionGapResultCard");
  if (anionGapCard) anionGapCard.innerHTML = renderAnionGapCardHTML(result);

  const sodiumCalciumCard = document.getElementById("sodiumCalciumResultCard");
  if (sodiumCalciumCard) sodiumCalciumCard.innerHTML = renderSodiumCalciumCardHTML(result);

  const summaryCard = document.getElementById("summaryResultsCard");
  if (summaryCard) summaryCard.innerHTML = renderSummaryCardHTML(result);
}

function reRenderFull() {
  const appContent = document.getElementById("app-content");
  if (appContent) {
    appContent.innerHTML = renderAbgView();
    initAbgEvents();
  }
}
