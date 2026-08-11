/**
 * Pediatric Dashboard UI Component
 * AnesthesiaX — Phase 7.5 (Fully Audited & Isolated)
 * Version: 7.5-dashboard-strict-v3
 * 
 * Dependencies:
 * - ../data/pedsData.js
 * - ../calculators/pedsCalculator.js
 */

import { pedsData } from "../data/pedsData.js";
import { PedsCalculator } from "../calculators/pedsCalculator.js";

export class PedsDashboard {
  constructor(containerId) {
    this.container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    this.state = {
      weightKg: 10,
      ageYears: 1,
      selectedDrugId: "epinephrine",
      selectedIndicationId: "cardiac_arrest",
      selectedConcentrationMgPerMl: null
    };
  }

  init() {
    if (!this.container) return;
    this.renderSkeleton();
    this.attachEventListeners();
    this.updateCalculations();
  }

  renderSkeleton() {
    const emergencyDrugsList = (pedsData && Array.isArray(pedsData.emergencyDrugs)) ? pedsData.emergencyDrugs : [];

    this.container.innerHTML = `
      <div class="peds-dashboard space-y-6 text-gray-800 dir-rtl text-right max-w-2xl mx-auto">
        <!-- GLOBAL INPUT PATIENT PANEL -->
        <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 shadow-sm">
          <h2 class="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
            👶 بيانات المريض الأطفال (Pediatric Patient Parameters)
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold mb-1">الوزن (Weight in kg):</label>
              <input type="number" id="peds-weight-input" step="0.1" min="0.3" max="150" value="${this.state.weightKg}" 
                class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white font-bold text-blue-900" placeholder="أدخل الوزن بالكجم" />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-1">العمر بالسنين (Age in years):</label>
              <input type="number" id="peds-age-input" step="0.1" min="0" max="18" value="${this.state.ageYears}" 
                class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white font-bold text-blue-900" placeholder="أدخل العمر بالسنوات" />
            </div>
          </div>
        </div>

        <!-- GRID OF MAIN CLINICAL CARDS -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <!-- CARD 1: AIRWAY & ETT -->
          <div class="bg-white border rounded-xl p-4 shadow-sm flex flex-col justify-between">
            <div>
              <h3 class="text-md font-bold text-gray-900 border-b pb-2 mb-3 flex items-center gap-2">
                🫁 مجرى الهواء والتنبيب (ETT & Airway)
              </h3>
              <div id="peds-airway-results"></div>
            </div>
          </div>

          <!-- CARD 2: EMERGENCY DRUGS -->
          <div class="bg-white border rounded-xl p-4 shadow-sm flex flex-col justify-between lg:col-span-2">
            <div>
              <h3 class="text-md font-bold text-gray-900 border-b pb-2 mb-3 flex items-center gap-2">
                🚨 أدوية الطوارئ والتخدير (Emergency Drugs Engine)
              </h3>
              <div class="space-y-4 text-sm mb-4">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label class="block text-xs font-bold mb-1">اختر الدواء (Select Drug):</label>
                    <select id="peds-drug-select" class="w-full p-2 border rounded bg-white">
                      ${emergencyDrugsList.map(d => `
                        <option value="${d.id}" ${d.id === this.state.selectedDrugId ? 'selected' : ''}>${d.name} (${d.arabicName})</option>
                      `).join('')}
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs font-bold mb-1">الاستطباب (Indication):</label>
                    <select id="peds-indication-select" class="w-full p-2 border rounded bg-white"></select>
                  </div>
                  <div>
                    <label class="block text-xs font-bold mb-1">التركيز المتاح (Concentration):</label>
                    <select id="peds-concentration-select" dir="ltr" class="w-full p-2 border rounded bg-white text-left"></select>
                  </div>
                </div>
              </div>
              <div id="peds-drug-results"></div>
            </div>
          </div>

        </div>

        <!-- CARD 3: MAINTENANCE FLUIDS -->
        <div class="bg-white border rounded-xl p-4 shadow-sm">
          <h3 class="text-md font-bold text-gray-900 border-b pb-2 mb-3 flex items-center gap-2">
            💧 سوائل الصيانة الساعية (Maintenance IV Fluids - 4-2-1 Rule)
          </h3>
          <div id="peds-fluids-results"></div>
        </div>
      </div>
    `;

    this.updateDynamicSelectors();
  }

  updateDynamicSelectors() {
    const indicationSelect = document.getElementById("peds-indication-select");
    const concentrationSelect = document.getElementById("peds-concentration-select");
    if (!indicationSelect || !concentrationSelect || !pedsData || !Array.isArray(pedsData.emergencyDrugs)) return;

    const currentDrug = pedsData.emergencyDrugs.find(d => d.id === this.state.selectedDrugId);
    if (!currentDrug) return;

    const indExists = currentDrug.indications.some(i => i.id === this.state.selectedIndicationId);
    if (!indExists && currentDrug.indications.length > 0) {
      this.state.selectedIndicationId = currentDrug.indications[0].id;
    }

    indicationSelect.innerHTML = currentDrug.indications.map(i => `
      <option value="${i.id}" ${i.id === this.state.selectedIndicationId ? 'selected' : ''}>${i.title}</option>
    `).join('');

    const currentIndication = currentDrug.indications.find(i => i.id === this.state.selectedIndicationId);
    let optionsHtml = '';

    if (currentIndication) {
      if (currentIndication.concentrationOptions && currentIndication.concentrationOptions.length > 0) {
        const concExists = currentIndication.concentrationOptions.some(c => c.mgPerMl === this.state.selectedConcentrationMgPerMl);
        if (!concExists) {
          this.state.selectedConcentrationMgPerMl = currentIndication.concentrationOptions[0].mgPerMl;
        }

        optionsHtml = currentIndication.concentrationOptions.map(c => `
          <option value="${c.mgPerMl}" ${c.mgPerMl === this.state.selectedConcentrationMgPerMl ? 'selected' : ''}>${c.label}</option>
        `).join('');
      } else if (currentIndication.concentration) {
        const c = currentIndication.concentration;
        const concVal = c.mgPerMl || c.saltMgPerMl;
        optionsHtml = `<option value="${concVal}">${c.label}</option>`;
        this.state.selectedConcentrationMgPerMl = concVal;
      } else {
        optionsHtml = `<option value="">تركيز قياسي</option>`;
        this.state.selectedConcentrationMgPerMl = null;
      }
    }

    concentrationSelect.innerHTML = optionsHtml;
  }

  updateCalculations() {
    const airwayContainer = document.getElementById("peds-airway-results");
    const drugContainer = document.getElementById("peds-drug-results");
    const fluidsContainer = document.getElementById("peds-fluids-results");

    if (typeof PedsCalculator === 'undefined') return;

    const airway = PedsCalculator.calculateAirway ? PedsCalculator.calculateAirway(this.state.weightKg, this.state.ageYears) : { success: false, errors: ['الدالة غير متوفرة'] };
    const drug = PedsCalculator.calculateDrugDose ? PedsCalculator.calculateDrugDose(
      this.state.selectedDrugId,
      this.state.selectedIndicationId,
      this.state.weightKg,
      this.state.ageYears,
      this.state.selectedConcentrationMgPerMl
    ) : { success: false, errors: ['الدالة غير متوفرة'] };
    const fluids = PedsCalculator.calculateMaintenanceFluids ? PedsCalculator.calculateMaintenanceFluids(this.state.weightKg, this.state.ageYears * 365.25) : { success: false, errors: ['الدالة غير متوفرة'] };

    if (airwayContainer) airwayContainer.innerHTML = this.renderAirwayContent(airway);
    if (drugContainer) drugContainer.innerHTML = this.renderDrugContent(drug);
    if (fluidsContainer) fluidsContainer.innerHTML = this.renderFluidContent(fluids);
  }

  renderAirwayContent(airway) {
    if (!airway.success) {
      return `<div class="p-3 bg-red-50 text-red-700 rounded-lg text-sm">${airway.errors.join("<br>")}</div>`;
    }

    return `
      <div class="space-y-3 text-sm">
        <div class="p-2 bg-gray-50 rounded border flex justify-between items-center">
          <span class="font-bold text-gray-700">الأنبوب بدون كاف (Uncuffed):</span>
          <span class="text-blue-700 font-extrabold text-base" dir="ltr">${airway.uncuffedSizeMm} mm</span>
        </div>
        <div class="p-2 bg-gray-50 rounded border flex justify-between items-center">
          <span class="font-bold text-gray-700">الأنبوب مع كاف (Cuffed):</span>
          <span class="text-blue-700 font-extrabold text-base" dir="ltr">${airway.cuffedSizeMm ? airway.cuffedSizeMm + " mm" : "غير موصى به"}</span>
        </div>
        <div class="p-2 bg-gray-50 rounded border flex justify-between items-center">
          <span class="font-bold text-gray-700">عمق الفم التقديري (Oral Depth):</span>
          <span class="text-gray-900 font-bold" dir="ltr">${airway.estimatedOralDepthCm} cm</span>
        </div>
        <div class="p-2 bg-gray-50 rounded border flex justify-between items-center">
          <span class="font-bold text-gray-700">شفرة المنظار (Blade Size):</span>
          <span class="text-gray-900 font-bold">${airway.blade}</span>
        </div>
        ${airway.warnings && airway.warnings.length > 0 ? `
          <div class="p-2 bg-yellow-50 border-r-4 border-yellow-400 text-yellow-800 text-xs rounded space-y-1">
            ${airway.warnings.map(w => `<p>• ${w}</p>`).join("")}
          </div>
        ` : ''}
      </div>
    `;
  }

  renderDrugContent(drug) {
    if (!drug.success) {
      return `<div class="p-3 bg-red-50 text-red-700 rounded-lg text-sm">${drug.errors.join("<br>")}</div>`;
    }

    return `
      <div class="space-y-3">
        <div class="p-3 bg-blue-50/60 border border-blue-100 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
          <div class="bg-white p-2 rounded border">
            <div class="text-xs text-gray-500">الجرعة المحسوبة (Applied Dose)</div>
            <div class="text-lg font-black text-blue-900" dir="ltr">${drug.appliedDose} ${drug.doseUnit}</div>
            ${drug.minDose && drug.maxDose ? `<div class="text-[11px] text-gray-600 mt-1" dir="ltr">النطاق الموصى به: ${drug.minDose}–${drug.maxDose} ${drug.doseUnit}</div>` : ''}
            ${drug.isCapped ? `<span class="text-[10px] bg-red-100 text-red-700 px-1 rounded block mt-1 font-bold">تم تطبيق السقف الأقصى</span>` : ''}
            ${drug.isMinEnforced ? `<span class="text-[10px] bg-amber-100 text-amber-800 px-1 rounded block mt-1 font-bold">تم تطبيق الحد الأدنى</span>` : ''}
          </div>
          <div class="bg-white p-2 rounded border">
            <div class="text-xs text-gray-500">الحجم المطلوب (Volume mL)</div>
            <div class="text-lg font-black text-green-700" dir="ltr">${drug.calculatedVolumeMl !== null ? drug.calculatedVolumeMl + ' mL' : 'غير متوفر'}</div>
          </div>
          <div class="bg-white p-2 rounded border">
            <div class="text-xs text-gray-500">طريق الإعطاء (Route)</div>
            <div class="text-sm font-bold text-gray-800 mt-1">${drug.route}</div>
          </div>
        </div>

        ${drug.elementalCalciumInfo ? `
          <div class="p-2 bg-indigo-50 border border-indigo-200 rounded text-xs text-indigo-900">
            <strong>تفاصيل الكالسيوم الفعال (Elemental Ca):</strong> يعطي المريض <span dir="ltr">${drug.elementalCalciumInfo.deliveredElementalCaMg} mg</span> من الكالسيوم الصافي (<span dir="ltr">${drug.elementalCalciumInfo.elementalCaMgPerMl} mg/mL</span> elemental Ca).
          </div>
        ` : ''}

        ${drug.safetyAlerts && drug.safetyAlerts.length > 0 ? `
          <div class="p-3 bg-red-50 border-r-4 border-red-500 text-red-900 text-xs rounded space-y-1 font-semibold">
            ${drug.safetyAlerts.map(a => `<p>• ${a}</p>`).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }

  renderFluidContent(fluids) {
    if (!fluids.success) {
      return `<div class="p-3 bg-red-50 text-red-700 rounded-lg text-sm">${fluids.errors.join("<br>")}</div>`;
    }

    return `
      <div class="space-y-3 text-sm">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-3 bg-gray-50 rounded border text-center">
            <span class="text-xs text-gray-500 block">معدل التسريب الساعي (Hourly Rate)</span>
            <span class="text-xl font-black text-blue-800" dir="ltr">${fluids.hourlyRateMlHr} mL/hr</span>
          </div>
          <div class="p-3 bg-gray-50 rounded border text-center">
            <span class="text-xs text-gray-500 block">المجموع اليومي المقدر (24h Total)</span>
            <span class="text-xl font-black text-blue-800" dir="ltr">${fluids.dailyVolumeMl24h} mL/24h</span>
          </div>
        </div>

        <div class="p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-950 space-y-1">
          <p class="font-bold">${fluids.guidanceTitle}</p>
          <p>${fluids.guidanceRecommendation}</p>
          <p class="text-[11px] text-gray-600 mt-1">${fluids.guidanceDisclaimer}</p>
        </div>

        ${fluids.warnings && fluids.warnings.length > 0 ? `
          <div class="p-2 bg-yellow-50 border-r-4 border-yellow-400 text-yellow-800 text-xs rounded space-y-1">
            ${fluids.warnings.map(w => `<p>• ${w}</p>`).join("")}
          </div>
        ` : ''}
      </div>
    `;
  }

  attachEventListeners() {
    const weightInput = document.getElementById("peds-weight-input");
    const ageInput = document.getElementById("peds-age-input");
    const drugSelect = document.getElementById("peds-drug-select");
    const indicationSelect = document.getElementById("peds-indication-select");
    const concentrationSelect = document.getElementById("peds-concentration-select");

    if (weightInput) {
      weightInput.addEventListener("input", (e) => {
        const val = parseFloat(e.target.value);
        this.state.weightKg = !isNaN(val) && val >= 0 ? val : 0;
        this.updateCalculations();
      });
    }

    if (ageInput) {
      ageInput.addEventListener("input", (e) => {
        const val = parseFloat(e.target.value);
        this.state.ageYears = !isNaN(val) && val >= 0 ? val : 0;
        this.updateCalculations();
      });
    }

    if (drugSelect) {
      drugSelect.addEventListener("change", (e) => {
        this.state.selectedDrugId = e.target.value;
        if (pedsData && Array.isArray(pedsData.emergencyDrugs)) {
          const currentDrug = pedsData.emergencyDrugs.find(d => d.id === this.state.selectedDrugId);
          if (currentDrug && currentDrug.indications.length > 0) {
            this.state.selectedIndicationId = currentDrug.indications[0].id;
          }
        }
        this.updateDynamicSelectors();
        this.updateCalculations();
      });
    }

    if (indicationSelect) {
      indicationSelect.addEventListener("change", (e) => {
        this.state.selectedIndicationId = e.target.value;
        this.updateDynamicSelectors();
        this.updateCalculations();
      });
    }

    if (concentrationSelect) {
      concentrationSelect.addEventListener("change", (e) => {
        const val = parseFloat(e.target.value);
        this.state.selectedConcentrationMgPerMl = !isNaN(val) ? val : null;
        this.updateCalculations();
      });
    }
  }
}
