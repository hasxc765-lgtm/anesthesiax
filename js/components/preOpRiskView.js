/**
 * Preoperative Risk Assessment Unified UI Component
 *
 * AnesthesiaX — Phase 8.5
 * File: js/components/preOpRiskView.js
 *
 * Architecture:
 * ES Module View Layer.
 * Handles UI rendering, user input collection, hierarchical tab switching,
 * and live DOM updates across all 7 integrated assessment tools.
 *
 * Consumes:
 * - ../data/preOpRiskData.js
 * - ../data/capriniData.js
 * - ../data/stopBangData.js
 * - ../data/dasiData.js
 * - ../data/frailtyData.js
 * - ../calculators/preOpRiskCalculator.js
 * - ../calculators/capriniCalculator.js
 * - ../calculators/stopBangCalculator.js
 * - ../calculators/dasiCalculator.js
 * - ../calculators/frailtyCalculator.js
 */

import { preOpRiskData } from "../data/preOpRiskData.js";
import { capriniData } from "../data/capriniData.js";
import { stopBangData } from "../data/stopBangData.js";
import { dasiData } from "../data/dasiData.js";
import { frailtyData } from "../data/frailtyData.js";

import { PreOpRiskCalculator } from "../calculators/preOpRiskCalculator.js";
import { CapriniCalculator } from "../calculators/capriniCalculator.js";
import { StopBangCalculator } from "../calculators/stopBangCalculator.js";
import { DasiCalculator } from "../calculators/dasiCalculator.js";
import { FrailtyCalculator } from "../calculators/frailtyCalculator.js";

// =============================================================================
// 1. MALLAMPATI LOCAL REFERENCE
// =============================================================================

const mallampatiOptions = [
  { id: "class1", code: "Class I", label: "الحنك الصلب، الحنك المرن، اللهاة، واللوزتين قابلة للرؤية بوضوح (سلس)" },
  { id: "class2", code: "Class II", label: "الحنك الصلب، الحنك المرن، وقسم من اللهاة قابلة للرؤية" },
  { id: "class3", code: "Class III", label: "الحنك الصلب والحنك المرن وقاعدة اللهاة فقط قابلة للرؤية (مجرى صعب)" },
  { id: "class4", code: "Class IV", label: "الحنك الصلب فقط قابل للرؤية - رؤية الرغامي منعدمة (مجرى شديد الصعوبة)" }
];

// =============================================================================
// 2. MODULE LOCAL STATE
// =============================================================================

const state = {
  activeTab: "asa", // "asa" | "cardiac" | "respiratory" | "other_risks" | "summary"

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

  // DASI State
  selectedDasiItems: [],

  // ARISCAT State
  ageYears: 45,
  spo2Percent: 98,
  respiratoryInfection: false,
  hemoglobinGdl: 13.5,
  incisionType: "peripheral",
  surgeryDurationHours: 1.5,

  // STOP-BANG State
  selectedStopBangItems: [],

  // Mallampati Screening
  mallampatiClass: "class1",

  // Caprini VTE State
  selectedCapriniFactors: [],

  // Frailty mFI-5 State
  selectedFrailtyItems: []
};

// =============================================================================
// 3. HELPER BADGE STYLE GENERATOR
// =============================================================================

function getBadgeStyle(label) {
  if (!label) return "bg-slate-100 text-slate-800 border-slate-300";
  const str = String(label).toLowerCase();

  if (str.includes("high") || str.includes("مرتفع") || str.includes("شديدة") || str.includes("class iv")) {
    return "bg-rose-100 text-rose-800 border-rose-300";
  }
  if (str.includes("moderate") || str.includes("intermediate") || str.includes("متوسط") || str.includes("class iii")) {
    return "bg-amber-100 text-amber-800 border-amber-300";
  }
  return "bg-emerald-100 text-emerald-800 border-emerald-300";
}

function getAllAssessments() {
  const core = PreOpRiskCalculator.processFullAssessment({
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

  const caprini = CapriniCalculator.calculate(state.selectedCapriniFactors);
  const stopBang = StopBangCalculator.calculate(state.selectedStopBangItems);
  const dasi = DasiCalculator.calculate(state.selectedDasiItems);
  const frailty = FrailtyCalculator.calculate(state.selectedFrailtyItems);
  const mallampati = mallampatiOptions.find(m => m.id === state.mallampatiClass) || mallampatiOptions[0];

  return { core, caprini, stopBang, dasi, frailty, mallampati };
}

// =============================================================================
// 4. MAIN RENDER FUNCTION
// =============================================================================

export function renderPreOpRiskView() {
  const { core, caprini, stopBang, dasi, frailty, mallampati } = getAllAssessments();

  return `
    <div class="space-y-4 max-w-3xl mx-auto font-sans dir-rtl text-right" id="preOpRiskContainer">

      <!-- HEADER -->
      <div class="p-4 bg-gradient-to-r from-slate-800 to-indigo-900 text-white rounded-2xl shadow-sm flex justify-between items-center">
        <div>
          <h2 class="font-bold text-base flex items-center gap-2">
            <span>📋</span>
            <span>تقييم المخاطر الشامل قبل العملية</span>
          </h2>
          <p class="text-[11px] opacity-80 mt-0.5" dir="ltr">Preoperative Integrated Risk Center (Phase 8.5)</p>
        </div>
        <button id="btnBackToDashboard" type="button" class="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-xl font-bold text-xs transition cursor-pointer">
          الرئيسية ↩
        </button>
      </div>

      <!-- HIERARCHICAL PRIMARY TABS (MOBILE FRIENDLY) -->
      <div class="flex border border-slate-200 bg-white rounded-xl p-1 shadow-sm text-xs font-bold overflow-x-auto gap-1">
        <button data-tab="asa" class="tab-btn flex-1 min-w-[70px] py-2 px-1 text-center rounded-lg transition cursor-pointer ${state.activeTab === 'asa' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-100'}">
          <span>1. ASA</span>
        </button>
        <button data-tab="cardiac" class="tab-btn flex-1 min-w-[85px] py-2 px-1 text-center rounded-lg transition cursor-pointer ${state.activeTab === 'cardiac' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-100'}">
          <span>2. القلب ❤️</span>
        </button>
        <button data-tab="respiratory" class="tab-btn flex-1 min-w-[100px] py-2 px-1 text-center rounded-lg transition cursor-pointer ${state.activeTab === 'respiratory' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-100'}">
          <span>3. الرئة والمجرى 🫁</span>
        </button>
        <button data-tab="other_risks" class="tab-btn flex-1 min-w-[95px] py-2 px-1 text-center rounded-lg transition cursor-pointer ${state.activeTab === 'other_risks' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-100'}">
          <span>4. مخاطر أخرى 🛡️</span>
        </button>
        <button data-tab="summary" class="tab-btn flex-1 min-w-[90px] py-2 px-1 text-center rounded-lg transition cursor-pointer ${state.activeTab === 'summary' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 hover:bg-slate-100'}">
          <span>5. التقرير 📊</span>
        </button>
      </div>

      <!-- TAB CONTENT PANELS -->
      <div class="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
        ${state.activeTab === 'asa' ? renderAsaPanel(core) : ''}
        ${state.activeTab === 'cardiac' ? renderCardiacPanel(core, dasi) : ''}
        ${state.activeTab === 'respiratory' ? renderRespiratoryPanel(core, stopBang, mallampati) : ''}
        ${state.activeTab === 'other_risks' ? renderOtherRisksPanel(caprini, frailty) : ''}
        ${state.activeTab === 'summary' ? renderSummaryPanel(core, caprini, stopBang, dasi, frailty, mallampati) : ''}
      </div>

      <!-- CLINICAL DISCLAIMER -->
      <div class="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-[11px] text-amber-900 leading-relaxed">
        <strong class="font-bold block mb-0.5">⚠️ تنبيه سريري وتوجيهي:</strong>
        جميع المؤشرات المعروضة هي أدوات مسحية واسترشادية للارتقاء بسلامة المريض ولا تُشكل حكماً تشخيصياً أولياً أو أمراً علاجياً إلزامياً.
      </div>

    </div>
  `;
}

// =============================================================================
// 5. TAB PANELS BUILDERS
// =============================================================================

function renderAsaPanel(core) {
  const asaData = preOpRiskData.asa;

  return `
    <div class="space-y-3">
      <div class="flex justify-between items-center border-b border-slate-100 pb-2">
        <h3 class="text-xs font-bold text-slate-800">${asaData.title}:</h3>
        <label class="flex items-center gap-1.5 cursor-pointer bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 text-amber-900">
          <input type="checkbox" id="emergency-check" ${state.emergencyProcedure ? 'checked' : ''} class="w-4 h-4 text-amber-600 rounded">
          <span class="text-xs font-bold">${asaData.emergencyModifier.label} <bdi dir="ltr" class="font-mono">(+E)</bdi></span>
        </label>
      </div>

      <div class="grid grid-cols-1 gap-2.5">
        ${asaData.categories.map(cat => `
          <label class="p-3 border rounded-xl cursor-pointer transition flex items-start gap-3 ${state.asaClass === cat.id ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/20' : 'border-slate-200 hover:bg-slate-50'}">
            <input type="radio" name="asa-radio" value="${cat.id}" ${state.asaClass === cat.id ? 'checked' : ''} class="mt-1 text-blue-600">
            <div>
              <div class="flex items-center gap-2">
                <span class="font-mono font-bold text-xs bg-slate-800 text-white px-2 py-0.5 rounded" dir="ltr">${cat.code}</span>
                <strong class="text-xs text-slate-900">${cat.title}</strong>
              </div>
              <p class="text-[11px] text-slate-600 mt-1">${cat.desc}</p>
              <p class="text-[10px] text-slate-500 mt-0.5"><strong>أمثلة:</strong> ${cat.example}</p>
            </div>
          </label>
        `).join('')}
      </div>
    </div>
  `;
}

function renderCardiacPanel(core, dasi) {
  const rcriData = preOpRiskData.rcri;
  const cardio = core.success ? core.cardiovascular : null;

  return `
    <div class="space-y-5">
      <!-- SUB-SECTION 1: RCRI -->
      <div class="space-y-3">
        <div class="flex justify-between items-center border-b border-slate-100 pb-2">
          <div>
            <h3 class="text-xs font-bold text-slate-800">${rcriData.title}</h3>
            <p class="text-[10px] text-slate-500">اختر العوامل المتوفرة لتقييم الخطر القلبي (كل عامل = 1 نقطة)</p>
          </div>
          ${cardio ? `
            <span class="px-2 py-0.5 text-xs font-bold rounded border font-mono ${getBadgeStyle(cardio.riskTier)}" dir="ltr">
              ${cardio.classLabel} (${cardio.score} Pts) — MACE: ${cardio.maceRatePercent}%
            </span>
          ` : ''}
        </div>

        <div class="space-y-2">
          ${rcriData.factors.map(factor => `
            <label class="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3 cursor-pointer hover:bg-slate-100 transition">
              <input type="checkbox" data-rcri-id="${factor.id}" ${state[factor.id] ? 'checked' : ''} class="rcri-check mt-0.5 w-4 h-4 text-blue-600 rounded">
              <div>
                <strong class="text-xs text-slate-800 block">${factor.label}</strong>
                <span class="text-[11px] text-slate-500">${factor.desc}</span>
              </div>
            </label>
          `).join('')}
        </div>

        <div class="p-3 bg-slate-100/80 rounded-xl border border-slate-200 text-xs space-y-1.5">
          <label class="block font-bold text-slate-700">
            مستوى الكرياتينين المصلي <bdi dir="ltr" class="font-mono">(Serum Creatinine - mg/dL)</bdi>:
          </label>
          <input type="number" id="creatinine-input" step="0.1" min="0" placeholder="مثال: 2.2" value="${state.creatinineMgDl}" class="w-full p-2 border border-slate-300 rounded-lg bg-white font-mono text-xs">
        </div>
      </div>

      <!-- SUB-SECTION 2: DASI & METS -->
      <div class="pt-3 border-t border-slate-200 space-y-3">
        <div class="flex justify-between items-center border-b border-slate-100 pb-2">
          <div>
            <h3 class="text-xs font-bold text-slate-800">${dasiData.meta.title}</h3>
            <p class="text-[10px] text-slate-500">حدد الأنشطة التي يستطيع المريض أداءها لتخمين METs و Peak VO₂</p>
          </div>
          <span class="px-2 py-0.5 text-xs font-bold rounded border font-mono ${getBadgeStyle(dasi.tierLabel)}" dir="ltr">
            DASI: ${dasi.dasiScore} | ${dasi.estimatedMets} METs
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          ${dasiData.items.map(item => `
            <label class="p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2 cursor-pointer hover:bg-slate-100 transition">
              <input type="checkbox" data-dasi-id="${item.id}" ${state.selectedDasiItems.includes(item.id) ? 'checked' : ''} class="dasi-check mt-0.5 w-4 h-4 text-blue-600 rounded">
              <div>
                <strong class="text-slate-800 block text-[11px]">${item.label} <bdi dir="ltr" class="font-mono text-slate-500">(+${item.points})</bdi></strong>
                <span class="text-[10px] text-slate-500 leading-tight block">${item.question}</span>
              </div>
            </label>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderRespiratoryPanel(core, stopBang, mallampati) {
  const ariscatData = preOpRiskData.ariscat;
  const factors = ariscatData.factors;
  const pulmonary = core.success ? core.pulmonary : null;

  return `
    <div class="space-y-5">
      <!-- SUB-SECTION 1: ARISCAT -->
      <div class="space-y-3">
        <div class="flex justify-between items-center border-b border-slate-100 pb-2">
          <div>
            <h3 class="text-xs font-bold text-slate-800">${ariscatData.title}</h3>
            <p class="text-[10px] text-slate-500">متغيرات تقييم مضاعفات الرئة بعد العملية (SpO₂ على هواء الغرفة - Room Air)</p>
          </div>
          ${pulmonary ? `
            <span class="px-2 py-0.5 text-xs font-bold rounded border font-mono ${getBadgeStyle(pulmonary.tierLabel)}" dir="ltr">
              ARISCAT: ${pulmonary.score} Pts — PPCs: ${pulmonary.ppcRatePercent}%
            </span>
          ` : ''}
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label class="block font-bold text-slate-700 mb-1">1. عمر المريض (بالسنوات):</label>
            <input type="number" id="ariscat-age" min="0" max="120" value="${state.ageYears}" class="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 font-bold font-mono text-xs">
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">2. تشبع الأكسجين <bdi dir="ltr" class="font-mono">(SpO₂ % Room Air)</bdi>:</label>
            <input type="number" id="ariscat-spo2" min="50" max="100" value="${state.spo2Percent}" class="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 font-bold font-mono text-xs">
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">3. الهيموغلوبين <bdi dir="ltr" class="font-mono">(Hb g/dL)</bdi>:</label>
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

        <div class="space-y-2 text-xs">
          <label class="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition">
            <input type="checkbox" id="ariscat-resp-inf" ${state.respiratoryInfection ? 'checked' : ''} class="w-4 h-4 text-blue-600 rounded">
            <span class="text-slate-800 font-bold">6. ${factors.respiratoryInfection.label} (+${factors.respiratoryInfection.points} Pts)</span>
          </label>
        </div>
      </div>

      <!-- SUB-SECTION 2: STOP-BANG -->
      <div class="pt-3 border-t border-slate-200 space-y-3">
        <div class="flex justify-between items-center border-b border-slate-100 pb-2">
          <div>
            <h3 class="text-xs font-bold text-slate-800">${stopBangData.meta.title}</h3>
            <p class="text-[10px] text-slate-500">مسح خطر انقطاع النفس النومي (Obstructive Sleep Apnea - OSA)</p>
          </div>
          <span class="px-2 py-0.5 text-xs font-bold rounded border font-mono ${getBadgeStyle(stopBang.tierLabel)}" dir="ltr">
            STOP-BANG: ${stopBang.score}/8 Pts
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          ${stopBangData.items.map(item => `
            <label class="p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2 cursor-pointer hover:bg-slate-100 transition">
              <input type="checkbox" data-stopbang-id="${item.id}" ${state.selectedStopBangItems.includes(item.id) ? 'checked' : ''} class="stopbang-check mt-0.5 w-4 h-4 text-blue-600 rounded">
              <div>
                <strong class="text-slate-800 block text-[11px]">[${item.letter}] ${item.label}</strong>
                <span class="text-[10px] text-slate-500 leading-tight block">${item.question}</span>
              </div>
            </label>
          `).join('')}
        </div>
      </div>

      <!-- SUB-SECTION 3: MALLAMPATI SCREENING -->
      <div class="pt-3 border-t border-slate-200 space-y-3">
        <div class="flex justify-between items-center border-b border-slate-100 pb-2">
          <div>
            <h3 class="text-xs font-bold text-slate-800">فحص مالامباتي المبدئي للمجرى الهوائي (Mallampati Screening)</h3>
            <p class="text-[10px] text-slate-500">معاينة الحلق واللهاة لتوقع درجة صعوبة التنبيب</p>
          </div>
          <button id="btnGoToAirwayTool" type="button" class="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer">
            <span>🚀</span>
            <span>حاسبة الأنابيب الشاملة</span>
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          ${mallampatiOptions.map(m => `
            <label class="p-2.5 border rounded-xl cursor-pointer transition flex items-start gap-2 ${state.mallampatiClass === m.id ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/20' : 'border-slate-200 hover:bg-slate-50'}">
              <input type="radio" name="mallampati-radio" value="${m.id}" ${state.mallampatiClass === m.id ? 'checked' : ''} class="mt-0.5 text-blue-600">
              <div>
                <span class="font-mono font-bold text-xs bg-slate-800 text-white px-2 py-0.5 rounded" dir="ltr">${m.code}</span>
                <p class="text-[11px] text-slate-700 mt-1">${m.label}</p>
              </div>
            </label>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderOtherRisksPanel(caprini, frailty) {
  return `
    <div class="space-y-5">
      <!-- SUB-SECTION 1: CAPRINI VTE -->
      <div class="space-y-3">
        <div class="flex justify-between items-center border-b border-slate-100 pb-2">
          <div>
            <h3 class="text-xs font-bold text-slate-800">${capriniData.meta.title}</h3>
            <p class="text-[10px] text-slate-500">تقييم خطورة التجلط الوريدي العميق والصمة الرئوية (DVT / PE)</p>
          </div>
          <span class="px-2 py-0.5 text-xs font-bold rounded border font-mono ${getBadgeStyle(caprini.tierLabel)}" dir="ltr">
            Caprini: ${caprini.score} Pts
          </span>
        </div>

        <div class="space-y-3">
          ${capriniData.categories.map(cat => `
            <div class="space-y-1.5">
              <h4 class="text-xs font-bold text-slate-700 bg-slate-100 p-1.5 rounded-lg">${cat.title}</h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                ${cat.items.map(item => `
                  <label class="p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2 cursor-pointer hover:bg-slate-100 transition">
                    <input type="checkbox" data-caprini-id="${item.id}" ${state.selectedCapriniFactors.includes(item.id) ? 'checked' : ''} class="caprini-check mt-0.5 w-4 h-4 text-blue-600 rounded">
                    <span class="text-[11px] text-slate-800 leading-tight">${item.label}</span>
                  </label>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- SUB-SECTION 2: MFI-5 FRAILTY -->
      <div class="pt-3 border-t border-slate-200 space-y-3">
        <div class="flex justify-between items-center border-b border-slate-100 pb-2">
          <div>
            <h3 class="text-xs font-bold text-slate-800">${frailtyData.meta.title}</h3>
            <p class="text-[10px] text-slate-500">تقييم الهشاشة الفسيولوجية الخماسي وفق معايير NSQIP الجراحية</p>
          </div>
          <span class="px-2 py-0.5 text-xs font-bold rounded border font-mono ${getBadgeStyle(frailty.tierLabel)}" dir="ltr">
            mFI-5: ${frailty.score}/5 (${frailty.frailtyIndexRatio})
          </span>
        </div>

        <div class="space-y-2 text-xs">
          ${frailtyData.items.map(item => `
            <label class="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3 cursor-pointer hover:bg-slate-100 transition">
              <input type="checkbox" data-frailty-id="${item.id}" ${state.selectedFrailtyItems.includes(item.id) ? 'checked' : ''} class="frailty-check mt-0.5 w-4 h-4 text-blue-600 rounded">
              <div>
                <strong class="text-xs text-slate-800 block">${item.label}</strong>
                <span class="text-[11px] text-slate-500">${item.question}</span>
              </div>
            </label>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderSummaryPanel(core, caprini, stopBang, dasi, frailty, mallampati) {
  if (!core || !core.success) {
    return `
      <div class="p-4 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-xs">
        <strong>⚠️ خطأ في التقييم:</strong> تعذر احتساب التقرير السريري المدمج. يرجى مراجعة المدخلات.
      </div>
    `;
  }

  const asa = core.asa;
  const cardio = core.cardiovascular;
  const pulmonary = core.pulmonary;

  return `
    <div class="space-y-4">
      <div class="flex justify-between items-center border-b border-slate-100 pb-2">
        <h3 class="text-xs font-bold text-slate-800">
          📊 التقرير المدمج لتقييم المخاطر <bdi dir="ltr" class="font-mono text-slate-400">(Integrated Clinical Summary)</bdi>
        </h3>
        <button id="btnPrintReport" type="button" class="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer">
          <span>🖨️</span>
          <span>طباعة / تصدير PDF</span>
        </button>
      </div>

      <!-- GRID OF ALL 7 TOOLS -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
        <!-- ASA -->
        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
          <div>
            <span class="text-[10px] text-slate-500 block mb-1">1. الحالة الجسدية (ASA)</span>
            <strong class="font-mono text-slate-900 text-sm block" dir="ltr">${asa.displayCode}</strong>
          </div>
          <span class="text-[10px] text-slate-600 mt-1 block">${asa.asa.title}</span>
        </div>

        <!-- RCRI -->
        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
          <div>
            <span class="text-[10px] text-slate-500 block mb-1">2. الخطر القلبي (RCRI)</span>
            <strong class="font-mono text-slate-900 text-sm block" dir="ltr">${cardio.classLabel} (${cardio.score} Pts)</strong>
          </div>
          <span class="text-[10px] font-bold mt-1 inline-block px-2 py-0.5 rounded border ${getBadgeStyle(cardio.riskTier)}" dir="ltr">
            MACE Rate: ${cardio.maceRatePercent}%
          </span>
        </div>

        <!-- DASI -->
        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
          <div>
            <span class="text-[10px] text-slate-500 block mb-1">3. السعة الوظيفية (DASI)</span>
            <strong class="font-mono text-slate-900 text-sm block" dir="ltr">${dasi.estimatedMets} METs</strong>
          </div>
          <span class="text-[10px] font-bold mt-1 inline-block px-2 py-0.5 rounded border ${getBadgeStyle(dasi.tierLabel)}">
            ${dasi.tierLabel}
          </span>
        </div>

        <!-- ARISCAT -->
        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
          <div>
            <span class="text-[10px] text-slate-500 block mb-1">4. الخطر الرئوي (ARISCAT)</span>
            <strong class="font-mono text-slate-900 text-sm block" dir="ltr">${pulmonary.score} Points</strong>
          </div>
          <span class="text-[10px] font-bold mt-1 inline-block px-2 py-0.5 rounded border ${getBadgeStyle(pulmonary.tierLabel)}" dir="ltr">
            PPC Rate: ${pulmonary.ppcRatePercent}%
          </span>
        </div>

        <!-- STOP-BANG -->
        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
          <div>
            <span class="text-[10px] text-slate-500 block mb-1">5. مسح النوم (STOP-BANG)</span>
            <strong class="font-mono text-slate-900 text-sm block" dir="ltr">${stopBang.score}/8 Points</strong>
          </div>
          <span class="text-[10px] font-bold mt-1 inline-block px-2 py-0.5 rounded border ${getBadgeStyle(stopBang.tierLabel)}">
            ${stopBang.tierLabel}
          </span>
        </div>

        <!-- CAPRINI -->
        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
          <div>
            <span class="text-[10px] text-slate-500 block mb-1">6. خطر التجلط (Caprini VTE)</span>
            <strong class="font-mono text-slate-900 text-sm block" dir="ltr">${caprini.score} Points</strong>
          </div>
          <span class="text-[10px] font-bold mt-1 inline-block px-2 py-0.5 rounded border ${getBadgeStyle(caprini.tierLabel)}">
            ${caprini.tierLabel}
          </span>
        </div>

        <!-- FRAILTY & MALLAMPATI -->
        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 sm:col-span-2 lg:col-span-3 flex justify-between items-center text-xs">
          <div>
            <span class="text-[10px] text-slate-500 block">7. الهشاشة الفسيولوجية (mFI-5):</span>
            <strong class="font-mono text-slate-900" dir="ltr">Score: ${frailty.score}/5 (${frailty.frailtyIndexRatio})</strong>
          </div>
          <div>
            <span class="text-[10px] text-slate-500 block">فحص المجرى الهوائي (Mallampati):</span>
            <strong class="font-mono text-slate-900 bg-slate-800 text-white px-2 py-0.5 rounded" dir="ltr">${mallampati.code}</strong>
          </div>
        </div>
      </div>

      <!-- COMBINED CLINICAL CONSIDERATIONS -->
      <div class="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs space-y-2 leading-relaxed">
        <h4 class="font-bold text-blue-950 flex items-center gap-1">
          <span>💡</span>
          <span>التوجيهات والاستشارات السريرية الشاملة <bdi dir="ltr" class="font-mono text-blue-800">(Integrated Clinical Guidance)</bdi>:</span>
        </h4>

        <ul class="list-disc list-inside space-y-1.5 text-blue-900 text-[11px]">
          <li><strong>الجانب القلبي:</strong> ${cardio.clinicalConsideration} (${dasi.recommendation})</li>
          <li><strong>الجانب التنفسي والنوم:</strong> ${pulmonary.clinicalConsideration} (${stopBang.recommendation})</li>
          <li><strong>خطر التجلط الوريدي:</strong> ${caprini.recommendation}</li>
          <li><strong>الهشاشة والتعافي:</strong> ${frailty.recommendation}</li>
        </ul>
      </div>
    </div>
  `;
}

// =============================================================================
// 6. TARGETED LIVE DOM UPDATES & EVENT BINDINGS
// =============================================================================

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

  // Go to Airway Calculator Button
  const btnAirway = document.getElementById("btnGoToAirwayTool");
  if (btnAirway) {
    btnAirway.addEventListener("click", () => {
      if (typeof window.navigateTo === "function") window.navigateTo("airway");
    });
  }

  // Print / Export PDF Handler
  const btnPrint = document.getElementById("btnPrintReport");
  if (btnPrint) {
    btnPrint.addEventListener("click", () => {
      window.print();
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

  // Emergency Checkbox
  const emergCheck = document.getElementById("emergency-check");
  if (emergCheck) {
    emergCheck.addEventListener("change", (e) => {
      state.emergencyProcedure = e.target.checked;
      reRenderFull();
    });
  }

  // RCRI Checkboxes
  container.querySelectorAll(".rcri-check").forEach(chk => {
    chk.addEventListener("change", (e) => {
      const factorId = e.target.getAttribute("data-rcri-id");
      if (factorId) state[factorId] = e.target.checked;
    });
  });

  // Creatinine Input
  const creatInput = document.getElementById("creatinine-input");
  if (creatInput) {
    creatInput.addEventListener("input", (e) => {
      const val = e.target.value.trim();
      state.creatinineMgDl = val;
      state.renallyImpaired = !(val === "" || parseFloat(val) <= 2.0);
    });
  }

  // DASI Checkboxes
  container.querySelectorAll(".dasi-check").forEach(chk => {
    chk.addEventListener("change", (e) => {
      const id = e.target.getAttribute("data-dasi-id");
      if (e.target.checked) {
        if (!state.selectedDasiItems.includes(id)) state.selectedDasiItems.push(id);
      } else {
        state.selectedDasiItems = state.selectedDasiItems.filter(i => i !== id);
      }
    });
  });

  // ARISCAT Inputs
  const ageInput = document.getElementById("ariscat-age");
  if (ageInput) ageInput.addEventListener("input", e => { state.ageYears = e.target.value; });

  const spo2Input = document.getElementById("ariscat-spo2");
  if (spo2Input) spo2Input.addEventListener("input", e => { state.spo2Percent = e.target.value; });

  const hbInput = document.getElementById("ariscat-hb");
  if (hbInput) hbInput.addEventListener("input", e => { state.hemoglobinGdl = e.target.value; });

  const durationInput = document.getElementById("ariscat-duration");
  if (durationInput) durationInput.addEventListener("input", e => { state.surgeryDurationHours = e.target.value; });

  const incisionSelect = document.getElementById("ariscat-incision");
  if (incisionSelect) incisionSelect.addEventListener("change", e => { state.incisionType = e.target.value; });

  const respInfCheck = document.getElementById("ariscat-resp-inf");
  if (respInfCheck) respInfCheck.addEventListener("change", e => { state.respiratoryInfection = e.target.checked; });

  // STOP-BANG Checkboxes
  container.querySelectorAll(".stopbang-check").forEach(chk => {
    chk.addEventListener("change", (e) => {
      const id = e.target.getAttribute("data-stopbang-id");
      if (e.target.checked) {
        if (!state.selectedStopBangItems.includes(id)) state.selectedStopBangItems.push(id);
      } else {
        state.selectedStopBangItems = state.selectedStopBangItems.filter(i => i !== id);
      }
    });
  });

  // Mallampati Radio Selection
  container.querySelectorAll('input[name="mallampati-radio"]').forEach(radio => {
    radio.addEventListener("change", (e) => {
      state.mallampatiClass = e.target.value;
    });
  });

  // Caprini Checkboxes
  container.querySelectorAll(".caprini-check").forEach(chk => {
    chk.addEventListener("change", (e) => {
      const id = e.target.getAttribute("data-caprini-id");
      if (e.target.checked) {
        if (!state.selectedCapriniFactors.includes(id)) state.selectedCapriniFactors.push(id);
      } else {
        state.selectedCapriniFactors = state.selectedCapriniFactors.filter(i => i !== id);
      }
    });
  });

  // Frailty Checkboxes
  container.querySelectorAll(".frailty-check").forEach(chk => {
    chk.addEventListener("change", (e) => {
      const id = e.target.getAttribute("data-frailty-id");
      if (e.target.checked) {
        if (!state.selectedFrailtyItems.includes(id)) state.selectedFrailtyItems.push(id);
      } else {
        state.selectedFrailtyItems = state.selectedFrailtyItems.filter(i => i !== id);
      }
    });
  });
}

function reRenderFull() {
  const appContent = document.getElementById("app-content");
  if (appContent) {
    appContent.innerHTML = renderPreOpRiskView();
    initPreOpRiskEvents();
  }
}
