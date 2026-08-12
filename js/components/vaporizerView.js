/**
 * Vaporizers & MAC UI Component
 *
 * AnesthesiaX — Phase 8.2.2 (Linguistic & Overdose Safety Patch)
 * File: js/components/vaporizerView.js
 */

import { volatileAgentsData } from "../data/volatileAgentsData.js";
import { VaporizerCalculator } from "../calculators/vaporizerCalculator.js";

// =========================================================================
// 1. MAIN HTML RENDERER
// =========================================================================

export function renderVaporizerView() {
  const agents = Object.values(volatileAgentsData.agents);

  return `
    <div
      class="space-y-5 max-w-2xl mx-auto font-sans dir-rtl text-right"
      id="vaporizerToolContainer"
    >

      <!-- HEADER -->
      <div
        class="p-4 bg-gradient-to-r from-blue-700 to-indigo-800
               text-white rounded-2xl shadow-sm
               flex justify-between items-center"
      >
        <div>
          <h2 class="font-bold text-base flex items-center gap-2">
            <span>💨</span>
            <span>حاسبة MAC والغازات الاستنشاقية</span>
          </h2>

          <p class="text-[11px] opacity-80 mt-0.5" dir="ltr">
            Vaporizers & Age-Adjusted MAC Calculator
          </p>
        </div>

        <button
          id="btnBackToDashboard"
          type="button"
          class="px-3 py-1.5 bg-white/20
                 hover:bg-white/30 text-white
                 rounded-xl font-bold text-xs transition cursor-pointer"
        >
          الرئيسية ↩
        </button>
      </div>


      <!-- INPUT CARD -->
      <div class="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">

        <!-- AGENT + AGE -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">

          <!-- AGENT -->
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">
              اختر الغاز الاستنشاقي
              <span dir="ltr" class="text-[10px] text-slate-400 font-normal">
                (Volatile Agent)
              </span>
            </label>

            <select
              id="vap-agent-select"
              class="w-full p-2.5 border border-slate-300 rounded-xl
                     bg-slate-50 font-bold text-slate-800 text-xs
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              ${agents
                .map(
                  (agent) => `
                    <option value="${agent.id}">
                      ${agent.name} — ${agent.arabicName}
                    </option>
                  `
                )
                .join("")}
            </select>
          </div>

          <!-- AGE -->
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">
              عمر المريض بالسنين
              <span dir="ltr" class="text-[10px] text-slate-400 font-normal">
                (Age in years)
              </span>
            </label>

            <input
              type="number"
              id="vap-age-input"
              value="40"
              min="0"
              max="120"
              step="0.01"
              inputmode="decimal"
              class="w-full p-2.5 border border-slate-300 rounded-xl
                     font-mono font-bold text-center text-slate-900 bg-white
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="مثال: 40"
            />
          </div>

        </div>

        <!-- MAC SECTION -->
        <div class="p-3 bg-blue-50/60 border border-blue-100 rounded-xl space-y-3">

          <h3 class="text-xs font-bold text-blue-900 flex items-center gap-1.5">
            <span>🫁</span>
            <span>قياس التركيز السنخي وحساب MAC</span>
            <span dir="ltr" class="text-[10px] text-blue-700 font-normal">
              (End-Tidal Concentration)
            </span>
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">

            <!-- END TIDAL -->
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">
                التركيز السنخي المقاس
                <span dir="ltr" class="font-mono text-blue-800">
                  End-Tidal (%)
                </span>
              </label>

              <input
                type="number"
                id="vap-endtidal-input"
                value="1.8"
                min="0"
                max="18"
                step="0.01"
                inputmode="decimal"
                dir="ltr"
                class="w-full p-2 border border-slate-300 rounded-lg font-mono
                       font-bold text-center text-blue-900 bg-white
                       focus:ring-2 focus:ring-blue-500"
                placeholder="1.8"
              />
            </div>

            <!-- N2O -->
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">
                تركيز أكسيد النيتروز
                <span dir="ltr" class="font-mono text-slate-600">
                  N₂O (%)
                </span>
              </label>

              <select
                id="vap-n2o-select"
                dir="ltr"
                class="w-full p-2 border border-slate-300 rounded-lg bg-white
                       font-bold text-slate-800 text-xs"
              >
                <option value="0">0% — بدون N₂O</option>
                <option value="30">30% N₂O</option>
                <option value="50">50% N₂O</option>
                <option value="60">60% N₂O</option>
                <option value="65">65% N₂O</option>
                <option value="70">70% N₂O — حد إدخال الأداة</option>
              </select>
            </div>

          </div>

          <!-- OPIOID -->
          <div class="flex items-center gap-2 pt-1 border-t border-blue-200/50">
            <input
              type="checkbox"
              id="vap-opioid-check"
              class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
            />

            <label
              for="vap-opioid-check"
              class="text-xs font-bold text-slate-700 cursor-pointer select-none"
            >
              تم إعطاء أفيونات أو أدوية مساعدة
              <span dir="ltr" class="text-[10px] text-slate-500 font-normal">
                (Opioids / Adjuncts)
              </span>
            </label>
          </div>

        </div>

        <!-- VAPORIZER SECTION -->
        <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">

          <h3 class="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <span>💧</span>
            <span>مؤشرات المبخر وحساب استهلاك السائل</span>
            <span dir="ltr" class="text-[10px] text-slate-500 font-normal">
              (Vaporizer & Gas Flow)
            </span>
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">

            <!-- FGF -->
            <div>
              <label class="block text-[10px] font-bold text-slate-600 mb-1">
                تدفق الغاز النقي
                <span dir="ltr" class="font-mono">FGF (L/min)</span>
              </label>

              <input
                type="number"
                id="vap-fgf-input"
                value="3.0"
                min="0.1"
                max="15"
                step="0.1"
                inputmode="decimal"
                dir="ltr"
                class="w-full p-2 border border-slate-300 rounded-lg font-mono
                       font-bold text-center text-slate-900 bg-white"
              />
            </div>

            <!-- DIAL -->
            <div>
              <label class="block text-[10px] font-bold text-slate-600 mb-1">
                تركيز المبخر
                <span dir="ltr" class="font-mono">Dial Setting (%)</span>
              </label>

              <input
                type="number"
                id="vap-dial-input"
                value="2.5"
                min="0"
                max="18"
                step="0.1"
                inputmode="decimal"
                dir="ltr"
                class="w-full p-2 border border-slate-300 rounded-lg font-mono
                       font-bold text-center text-slate-900 bg-white"
              />
            </div>

            <!-- DURATION -->
            <div>
              <label class="block text-[10px] font-bold text-slate-600 mb-1">
                مدة التخدير
                <span dir="ltr" class="font-mono">Duration (Hours)</span>
              </label>

              <input
                type="number"
                id="vap-duration-input"
                value="2.0"
                min="0.01"
                max="24"
                step="0.5"
                inputmode="decimal"
                dir="ltr"
                class="w-full p-2 border border-slate-300 rounded-lg font-mono
                       font-bold text-center text-slate-900 bg-white"
              />
            </div>

          </div>

        </div>

      </div>


      <!-- RESULTS -->
      <div id="vap-results-container"></div>


      <!-- DISCLAIMER -->
      <div class="p-3 bg-amber-50/80 border border-amber-200 rounded-2xl text-[11px] text-amber-900 leading-relaxed space-y-1">
        <div class="font-bold flex items-center gap-1 text-amber-950">
          <span>⚠️</span>
          <span>إخلاء مسؤولية سريري</span>
        </div>

        <p>${volatileAgentsData.meta.disclaimer}</p>
        <p>${volatileAgentsData.meta.clinicalUseNotice}</p>
      </div>

    </div>
  `;
}

// =========================================================
// 2. RESULT HTML HELPERS
// =========================================================

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderNumber(value, suffix = "") {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(Number(value))
  ) {
    return "N/A";
  }

  return `${escapeHtml(value)}${suffix}`;
}

// =========================================================
// 3. EVENT BINDING
// =========================================================

export function initVaporizerEvents() {
  const agentSelect = document.getElementById("vap-agent-select");
  const ageInput = document.getElementById("vap-age-input");
  const endTidalInput = document.getElementById("vap-endtidal-input");
  const n2oSelect = document.getElementById("vap-n2o-select");
  const opioidCheck = document.getElementById("vap-opioid-check");
  const fgfInput = document.getElementById("vap-fgf-input");
  const dialInput = document.getElementById("vap-dial-input");
  const durationInput = document.getElementById("vap-duration-input");
  const btnBack = document.getElementById("btnBackToDashboard");

  const resultsContainer = document.getElementById("vap-results-container");

  if (!resultsContainer) {
    return;
  }

  if (btnBack) {
    btnBack.addEventListener("click", () => {
      if (typeof window.navigateTo === "function") {
        window.navigateTo("dashboard");
      }
    });
  }

  // -----------------------------------------------------------------------
  // Update results
  // -----------------------------------------------------------------------

  const updateResults = () => {
    const params = {
      agentId: agentSelect?.value || "sevoflurane",
      ageYears: ageInput?.value ?? 40,
      endTidalPercent: endTidalInput?.value ?? 0,
      n2oPercent: n2oSelect?.value ?? 0,
      hasOpioid: opioidCheck?.checked ?? false,
      fgfLmin: fgfInput?.value ?? 3,
      dialPercent: dialInput?.value ?? 0,
      durationHours: durationInput?.value ?? 1,
      checkConsumption: true
    };

    const assessment = VaporizerCalculator.processFullAssessment(params);

    if (!assessment.success) {
      resultsContainer.innerHTML = `
        <div
          class="p-3.5 bg-rose-50 border border-rose-200 text-rose-800
                 rounded-2xl text-xs space-y-1.5 font-semibold"
        >
          <div class="font-bold text-rose-900">🚨 تنبيه أخطاء الإدخال:</div>
          ${assessment.errors
            .map((error) => `<p>• ${escapeHtml(error)}</p>`)
            .join("")}
        </div>
      `;

      return;
    }

    const {
      agentName,
      arabicName,
      inputs,
      macAssessment,
      consumptionAssessment,
      warnings
    } = assessment;

    const sourceLabel =
      macAssessment.macSourceLabel === "validated_pediatric_reference"
        ? "Pediatric Reference"
        : macAssessment.macSourceLabel === "adult_age_adjusted_model"
        ? "Age-Adjusted Adult Model"
        : macAssessment.macSourceLabel;

    const clinicalReview = macAssessment.requiresClinicalReview;

    // إضافة فحص الجرعة العالية تلقائياً (> 3.0 MAC)
    const isHighMacOverdose = macAssessment.estimatedCombinedMacFraction > 3.0;

    resultsContainer.innerHTML = `
      <div class="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">

        <!-- MAC HEADER -->
        <div>
          <h3
            class="text-xs font-bold text-slate-800 mb-2.5 border-b border-slate-100 pb-1.5
                   flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2"
          >
            <span>
              📊 تحليل MAC —
              ${escapeHtml(arabicName)} (${escapeHtml(agentName)})
            </span>

            <span
              class="text-[10px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5
                     rounded-full border border-blue-100 font-mono"
            >
              ${escapeHtml(sourceLabel)}
            </span>
          </h3>

          <!-- CLINICAL REVIEW ALERT -->
          ${
            clinicalReview
              ? `
                <div class="mb-3 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900">
                  ⚠️ هذه النتيجة تتطلب مراجعة سريرية ولا ينبغي اعتبارها هدفًا تخديريًا فرديًا.
                </div>
              `
              : ""
          }

          <!-- HIGH MAC OVERDOSE ALERT -->
          ${
            isHighMacOverdose
              ? `
                <div class="mb-3 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-[11px] text-rose-900 font-bold">
                  🚨 تنبيه سلامة: تركيز الـ Combined MAC مرتفع جداً (${renderNumber(macAssessment.estimatedCombinedMacFraction)} MAC). يرجى مراجعة عمق التخدير والضغط الشرياني للمريض.
                </div>
              `
              : ""
          }

          <!-- MAC GRID -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">

            <!-- MAC -->
            <div class="p-2 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-center">
              <span class="text-[10px] text-slate-500 block">MAC المرجعي</span>
              <strong class="font-mono text-slate-900 text-sm" dir="ltr">
                ${renderNumber(macAssessment.ageAdjustedMac, "%")}
              </strong>
            </div>

            <!-- VOLATILE -->
            <div class="p-2 bg-blue-50/70 rounded-xl border border-blue-100 flex flex-col justify-center">
              <span class="text-[10px] text-blue-700 font-bold block">Volatile MAC Fraction</span>
              <strong class="font-mono text-blue-950 font-bold text-base" dir="ltr">
                ${
                  macAssessment.ageAdjustedMac !== null
                    ? renderNumber(macAssessment.volatileMacFraction, " MAC")
                    : "N/A"
                }
              </strong>
            </div>

            <!-- N2O -->
            <div class="p-2 bg-indigo-50/70 rounded-xl border border-indigo-100 flex flex-col justify-center">
              <span class="text-[10px] text-indigo-800 font-bold block">N₂O MAC Fraction</span>
              <strong class="font-mono text-indigo-950 font-bold text-base" dir="ltr">
                ${renderNumber(macAssessment.n2oMacFraction, " MAC")}
              </strong>
            </div>

            <!-- COMBINED -->
            <div class="p-2 bg-emerald-50/70 rounded-xl border border-emerald-100 flex flex-col justify-center">
              <span class="text-[10px] text-emerald-800 font-bold block">Combined MAC Fraction</span>
              <strong class="font-mono text-emerald-950 font-bold text-base" dir="ltr">
                ${renderNumber(macAssessment.estimatedCombinedMacFraction, " MAC")}
              </strong>
            </div>

          </div>
        </div>

        <!-- CONSUMPTION -->
        <div class="border-t border-slate-100 pt-3">
          <h3 class="text-xs font-bold text-slate-800 mb-2.5 flex justify-between items-center">
            <span>💧 تقدير استهلاك السائل المتطاير</span>
            <span class="text-[10px] px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-bold border border-slate-200">
              ${escapeHtml(consumptionAssessment.fgfCategory)}
            </span>
          </h3>

          <div class="grid grid-cols-2 gap-2 text-center text-xs">

            <!-- RATE -->
            <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span class="text-[10px] text-slate-500 block mb-0.5">معدل الاستهلاك الساعي</span>
              <strong class="font-mono text-slate-900 text-sm" dir="ltr">
                ${renderNumber(consumptionAssessment.estimatedRateMlHr, " mL/hr")}
              </strong>
            </div>

            <!-- TOTAL -->
            <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span class="text-[10px] text-slate-500 block mb-0.5">
                المجموع الكلي التقديري (${escapeHtml(inputs.durationHours)} ساعة)
              </span>
              <strong class="font-mono text-emerald-700 text-sm" dir="ltr">
                ${renderNumber(consumptionAssessment.estimatedTotalMl, " mL")}
              </strong>
            </div>

          </div>
        </div>

        <!-- LOW FLOW -->
        <div class="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs space-y-1.5">
          <div class="font-bold text-emerald-950 flex justify-between items-center">
            <span>🌱 كفاءة التوفير بالتدفق المنخفض</span>
            <span class="font-mono text-emerald-800 font-bold text-sm" dir="ltr">
              ${renderNumber(consumptionAssessment.lowFlowSavings.estimatedSavingsPercent, "%")}
            </span>
          </div>

          <p class="text-[11px] text-emerald-900 leading-relaxed">
            مقارنة معيارية بين تدفق
            <span dir="ltr" class="font-mono font-bold">
              ${escapeHtml(consumptionAssessment.lowFlowSavings.baselineFgfLmin)} L/min
            </span>
            وتدفق
            <span dir="ltr" class="font-mono font-bold">
              ${escapeHtml(consumptionAssessment.lowFlowSavings.lowFgfLmin)} L/min
            </span>
            لمدة
            <span dir="ltr" class="font-mono font-bold">
              ${escapeHtml(inputs.durationHours)}
            </span>
            ساعة.
            يقدر النموذج توفير:
            <strong dir="ltr" class="font-mono text-emerald-950 font-extrabold">
              ${renderNumber(consumptionAssessment.lowFlowSavings.estimatedSavedMl, " mL")}
            </strong>
            من السائل مقارنة بالتدفق الأساسي.
          </p>
        </div>

        <!-- WARNINGS -->
        ${
          warnings.length > 0
            ? `
              <div class="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-950 space-y-1.5 leading-relaxed">
                <div class="font-bold flex items-center gap-1 text-amber-950">
                  <span>⚠️</span>
                  <span>تنبيهات وملاحظات سريرية:</span>
                </div>

                <ul class="list-disc list-inside space-y-1">
                  ${warnings
                    .map((warning) => `<li>${escapeHtml(warning)}</li>`)
                    .join("")}
                </ul>
              </div>
            `
            : ""
        }

      </div>
    `;
  };

  // =========================================================
  // 4. EVENT LISTENERS
  // =========================================================

  const inputs = [
    agentSelect,
    ageInput,
    endTidalInput,
    n2oSelect,
    opioidCheck,
    fgfInput,
    dialInput,
    durationInput
  ];

  inputs.forEach((input) => {
    if (!input) return;
    input.addEventListener("input", updateResults);
    input.addEventListener("change", updateResults);
  });

  // =========================================================
  // 5. INITIAL RENDER
  // =========================================================

  updateResults();
}
