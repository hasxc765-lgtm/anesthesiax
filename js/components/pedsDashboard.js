/**
 * Pediatric Dashboard UI Component
 * AnesthesiaX — Formatted & Translated BiDi Version (Audited 0.5mm ETT Layout)
 * File: js/components/PedsDashboard.js
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
      <div class="peds-dashboard space-y-6 text-gray-800 dir-rtl text-right max-w-2xl mx-auto font-sans">
        
        <!-- GLOBAL INPUT PATIENT PANEL -->
        <div class="bg-blue-50 border border-blue-200 rounded-2xl p-4 shadow-sm">
          <h2 class="text-base font-bold text-blue-900 mb-3 flex items-center gap-2">
            <span>👶</span>
            <span>بيانات المريض الأطفال</span>
            <span dir="ltr" class="text-xs font-semibold text-blue-700 opacity-80">(Pediatric Parameters)</span>
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">
                الوزن بالكجم <span dir="ltr" class="text-[11px] font-normal text-slate-500">(Weight in kg)</span>:
              </label>
              <input type="number" id="peds-weight-input" step="0.1" min="0.3" max="150" value="${this.state.weightKg}" 
                class="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white font-bold text-blue-900 text-center text-base font-mono" placeholder="أدخل الوزن" />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">
                العمر بالسنين <span dir="ltr" class="text-[11px] font-normal text-slate-500">(Age in years)</span>:
              </label>
              <input type="number" id="peds-age-input" step="0.1" min="0" max="18" value="${this.state.ageYears}" 
                class="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white font-bold text-blue-900 text-center text-base font-mono" placeholder="أدخل العمر" />
            </div>
          </div>
        </div>

        <!-- MAIN CLINICAL CARDS -->
        <div class="space-y-4">
          
          <!-- CARD 1: AIRWAY & ETT -->
          <div class="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <h3 class="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-3 flex items-center gap-2">
              <span>🫁</span>
              <span>المجرى الهوائي والتنبيب</span>
              <span dir="ltr" class="text-xs font-semibold text-slate-400">(ETT & Airway)</span>
            </h3>
            <div id="peds-airway-results"></div>
          </div>

          <!-- CARD 2: EMERGENCY DRUGS -->
          <div class="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <h3 class="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-3 flex items-center gap-2">
              <span>🚨</span>
              <span>أدوية الطوارئ والتخدير</span>
              <span dir="ltr" class="text-xs font-semibold text-slate-400">(Emergency Drugs)</span>
            </h3>
            <div class="space-y-3 text-xs mb-4">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label class="block font-bold text-slate-700 mb-1">اختر الدواء:</label>
                  <select id="peds-drug-select" class="w-full p-2 border border-slate-300 rounded-xl bg-white font-semibold text-slate-800">
                    ${emergencyDrugsList.map(d => `
                      <option value="${d.id}" ${d.id === this.state.selectedDrugId ? 'selected' : ''}>${d.arabicName || d.name} (${d.name})</option>
                    `).join('')}
                  </select>
                </div>
                <div>
                  <label class="block font-bold text-slate-700 mb-1">الاستطباب:</label>
                  <select id="peds-indication-select" class="w-full p-2 border border-slate-300 rounded-xl bg-white font-semibold text-slate-800"></select>
                </div>
                <div>
                  <label class="block font-bold text-slate-700 mb-1">التركيز المتاح:</label>
                  <select id="peds-concentration-select" dir="ltr" class="w-full p-2 border border-slate-300 rounded-xl bg-white font-semibold text-slate-800 text-left font-mono"></select>
                </div>
              </div>
            </div>
            <div id="peds-drug-results"></div>
          </div>

          <!-- CARD 3: MAINTENANCE FLUIDS -->
          <div class="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <h3 class="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-3 flex items-center gap-2">
              <span>💧</span>
              <span>سوائل الصيانة الساعية</span>
              <span dir="ltr" class="text-xs font-semibold text-slate-400">(4-2-1 Rule)</span>
            </h3>
            <div id="peds-fluids-results"></div>
          </div>

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

    const airway = typeof PedsCalculator.calculateAirway === 'function' 
      ? PedsCalculator.calculateAirway(this.state.weightKg, this.state.ageYears) 
      : { success: false, errors: ['دالة حساب المجرى الهوائي غير متوفرة'] };

    const drug = typeof PedsCalculator.calculateDrugDose === 'function' 
      ? PedsCalculator.calculateDrugDose(
          this.state.selectedDrugId,
          this.state.selectedIndicationId,
          this.state.weightKg,
          this.state.ageYears,
          this.state.selectedConcentrationMgPerMl
        ) 
      : { success: false, errors: ['دالة حساب الجرعات غير متوفرة'] };

    const fluids = typeof PedsCalculator.calculateMaintenanceFluids === 'function' 
      ? PedsCalculator.calculateMaintenanceFluids(this.state.weightKg, this.state.ageYears * 365.25) 
      : { success: false, errors: ['دالة حساب السوائل غير متوفرة'] };

    if (airwayContainer) airwayContainer.innerHTML = this.renderAirwayContent(airway);
    if (drugContainer) drugContainer.innerHTML = this.renderDrugContent(drug);
    if (fluidsContainer) fluidsContainer.innerHTML = this.renderFluidContent(fluids);
  }

  renderAirwayContent(airway) {
    if (!airway || !airway.success) {
      const errMsgs = (airway && Array.isArray(airway.errors)) ? airway.errors.join("<br>• ") : "خطأ في حساب المجرى الهوائي";
      return `<div class="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-bold leading-relaxed">⚠️ ${errMsgs}</div>`;
    }

    const cuffedDisplay = airway.cuffedDisplay || (airway.cuffedSizeMm ? `${airway.cuffedSizeMm} mm` : "غير موصى به");
    const uncuffedDisplay = airway.uncuffedDisplay || (airway.uncuffedSizeMm ? `${airway.uncuffedSizeMm} mm` : "N/A");

    return `
      <div class="space-y-2.5 text-xs">
        <div class="p-2.5 bg-blue-50/70 rounded-xl border border-blue-100 flex justify-between items-center">
          <span class="font-bold text-blue-950">الأنبوب مع كاف <span dir="ltr" class="text-[10px] text-blue-700 font-normal">(Cuffed ID)</span>:</span>
          <span class="text-blue-900 font-mono font-extrabold text-xs" dir="ltr">${cuffedDisplay}</span>
        </div>

        <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
          <span class="font-bold text-slate-700">الأنبوب بدون كاف <span dir="ltr" class="text-[10px] text-slate-400 font-normal">(Uncuffed ID)</span>:</span>
          <span class="text-slate-900 font-mono font-bold text-xs" dir="ltr">${uncuffedDisplay}</span>
        </div>

        <div class="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100 flex justify-between items-center">
          <span class="font-bold text-emerald-950">عمق الإدخال عند القواطع / الشفة <span dir="ltr" class="text-[10px] text-emerald-700 font-normal">(Oral Depth)</span>:</span>
          <span class="text-emerald-900 font-mono font-extrabold text-sm" dir="ltr">${airway.estimatedOralDepthCm} cm</span>
        </div>

        <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
          <span class="font-bold text-slate-700">شفرة المنظار الموصى بها <span dir="ltr" class="text-[10px] text-slate-400 font-normal">(Blade Size)</span>:</span>
          <span class="text-slate-900 font-bold font-mono" dir="ltr">${airway.blade}</span>
        </div>

        <div class="p-3 bg-amber-50/80 border border-amber-200 text-amber-900 text-[11px] rounded-xl space-y-1.5 leading-relaxed mt-2">
          <p class="font-bold text-amber-950 flex items-center gap-1">
            <span>⚠️</span> <span>تنبيهات سريرية قياسية:</span>
          </p>
          <ul class="list-disc list-inside space-y-1 opacity-90">
            <li>مقاس الأنبوب الرغامي مقرب لأقرب 0.5 mm؛ يجب دائماً تجهيز مقاس أصغر ومقاس أكبر.</li>
            <li>عمق الأنبوب تقديري؛ أعد التأكد بسماع أصوات التنفس على الجانبين ومراقبة منحنى الـ Capnography.</li>
            <li>في الأنابيب ذات الكاف (Cuffed)، يجب مراقبة ضغط الكاف وإبقائه أقل من <span dir="ltr" class="font-mono font-bold text-rose-800">&lt; 20 cmH2O</span>.</li>
          </ul>
        </div>
      </div>
    `;
  }

  renderDrugContent(drug) {
    if (!drug || !drug.success) {
      const errMsgs = (drug && Array.isArray(drug.errors)) ? drug.errors.join("<br>• ") : "خطأ في حساب الجرعة";
      return `<div class="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-bold leading-relaxed">⚠️ ${errMsgs}</div>`;
    }

    return `
      <div class="space-y-3 text-xs">
        <div class="p-3 bg-blue-50/60 border border-blue-200 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-2.5 text-center">
          <div class="bg-white p-2.5 rounded-lg border border-blue-100">
            <div class="text-[11px] text-slate-500 font-medium">الجرعة المحسوبة (Dose)</div>
            <div class="text-base font-mono font-bold text-blue-900 mt-0.5" dir="ltr">${drug.appliedDose} ${drug.doseUnit}</div>
            ${drug.minDose && drug.maxDose ? `<div class="text-[10px] text-slate-500 mt-1" dir="ltr">النطاق: ${drug.minDose} - ${drug.maxDose} ${drug.doseUnit}</div>` : ''}
            ${drug.isCapped ? `<span class="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded font-bold block mt-1">تم تقييد الجرعة للحد الأقصى</span>` : ''}
            ${drug.isMinEnforced ? `<span class="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold block mt-1">تم تطبيق الحد الأدنى</span>` : ''}
          </div>

          <div class="bg-white p-2.5 rounded-lg border border-blue-100">
            <div class="text-[11px] text-slate-500 font-medium">حجم السرنجة (Volume)</div>
            <div class="text-base font-mono font-bold text-emerald-700 mt-0.5" dir="ltr">${drug.calculatedVolumeMl !== null ? drug.calculatedVolumeMl + ' mL' : 'غير متوفر'}</div>
          </div>

          <div class="bg-white p-2.5 rounded-lg border border-blue-100">
            <div class="text-[11px] text-slate-500 font-medium">طريق الإعطاء (Route)</div>
            <div class="text-xs font-bold text-slate-800 mt-1" dir="ltr">${drug.route}</div>
          </div>
        </div>

        ${drug.elementalCalciumInfo ? `
          <div class="p-2.5 bg-indigo-50 border border-indigo-200 rounded-xl text-[11px] text-indigo-900">
            <strong>تفاصيل الكالسيوم الفعال (Elemental Ca):</strong> يعطي المريض <span dir="ltr" class="font-mono font-bold">${drug.elementalCalciumInfo.deliveredElementalCaMg} mg</span> من الكالسيوم الصافي (<span dir="ltr" class="font-mono">${drug.elementalCalciumInfo.elementalCaMgPerMl} mg/mL</span> elemental Ca).
          </div>
        ` : ''}

        ${drug.safetyAlerts && drug.safetyAlerts.length > 0 ? `
          <div class="p-3 bg-rose-50 border-r-4 border-rose-500 text-rose-900 text-[11px] rounded-xl space-y-1 font-semibold leading-relaxed">
            ${drug.safetyAlerts.map(a => `<p>• ${a}</p>`).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }

  renderFluidContent(fluids) {
    if (!fluids || !fluids.success) {
      const errMsgs = (fluids && Array.isArray(fluids.errors)) ? fluids.errors.join("<br>• ") : "خطأ في حساب السوائل";
      return `<div class="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-bold leading-relaxed">⚠️ ${errMsgs}</div>`;
    }

    return `
      <div class="space-y-3 text-xs">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <span class="text-[11px] text-slate-500 block mb-0.5">معدل التسريب الساعي (Hourly Rate)</span>
            <span class="text-lg font-mono font-bold text-blue-800" dir="ltr">${fluids.hourlyRateMlHr} mL/hr</span>
          </div>
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <span class="text-[11px] text-slate-500 block mb-0.5">المجموع اليومي التقديري (24h Total)</span>
            <span class="text-lg font-mono font-bold text-blue-800" dir="ltr">${fluids.dailyVolumeMl24h} mL/24h</span>
          </div>
        </div>

        <div class="p-3 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-950 space-y-1 leading-relaxed">
          <p class="font-bold text-blue-900">${fluids.guidanceTitle || 'إرشاد السوائل القياسي:'}</p>
          <p>${fluids.guidanceRecommendation || 'تعتمد الحسابات على قاعدة 4-2-1 التقديرية للحفاظ على توازن السوائل.'}</p>
        </div>

        ${fluids.warnings && fluids.warnings.length > 0 ? `
          <div class="p-2.5 bg-amber-50 border-r-4 border-amber-400 text-amber-900 text-[11px] rounded-xl space-y-1">
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
