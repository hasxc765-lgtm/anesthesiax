/**
 * Continuous Infusion UI View Component (Phase 6.4 - Fully Audited)
 * Dynamic Range Formatting, Interactive Overdose Alerts & Strict Input Validation
 */

import { infusionDrugsData } from '../data/infusionDrugs.js';
import { calculateInfusionRate, convertDoseRange, SUPPORTED_DOSE_UNITS } from '../calculators/infusionCalculator.js';
import { store } from '../state/store.js';

export function renderInfusionView() {
  setTimeout(attachInfusionViewListeners, 0);

  const defaultWeight = store?.state?.patientWeight || 70;
  const defaultDrug = infusionDrugsData[0];
  const defaultIndication = defaultDrug.indications[0];
  const defaultConcObj = defaultDrug.standardConcentrations[0];

  const initialRange = convertDoseRange(
    defaultIndication.doseMin,
    defaultIndication.doseMax,
    defaultIndication.doseUnitKey,
    defaultIndication.doseUnitKey,
    defaultWeight
  );

  const initialResults = calculateInfusionRate({
    drugId: defaultDrug.id,
    indicationId: defaultIndication.id,
    patientWeight: defaultWeight,
    doseValue: defaultIndication.doseMin,
    doseUnitKey: defaultIndication.doseUnitKey,
    concentrationValue: defaultConcObj.value,
    concentrationUnitKey: defaultConcObj.unitKey
  });

  return `
    <div id="infusionViewWrapper" class="max-w-2xl mx-auto space-y-4" dir="rtl">
      <!-- Section Header -->
      <div class="flex justify-between items-center bg-blue-600 text-white p-3.5 rounded-2xl shadow-sm">
        <div class="flex items-center gap-2">
          <span class="text-2xl">💉</span>
          <div>
            <h2 class="font-bold text-sm">حاسبة مضخات التنقيط المستمر (Continuous Infusion)</h2>
            <p class="text-[10px] opacity-80">معدلات الضخ بالمضخة (mL/hr) والتنبيهات السريرية التفاعلية</p>
          </div>
        </div>
      </div>

      <!-- Inputs Card -->
      <div class="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-3">
        <!-- Drug Selection -->
        <div>
          <label class="block text-[11px] font-semibold text-slate-700 mb-1">
            💊 اختر الدواء (Drug Selection):
          </label>
          <select id="infusionDrugSelect" class="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500">
            ${infusionDrugsData.map(drug => `
              <option value="${drug.id}" ${drug.id === defaultDrug.id ? 'selected' : ''}>
                ${drug.arabicName} (${drug.name}) - ${drug.category}
              </option>
            `).join('')}
          </select>
        </div>

        <!-- High Alert Warning Banner -->
        <div id="highAlertBanner" class="${defaultDrug.isHighAlert ? 'block' : 'hidden'} p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-[11px] font-bold flex items-center gap-1.5">
          <span class="text-base">🚨</span>
          <span>دواء عالي الخطورة (HIGH-ALERT MEDICATION) - يتطلب تدقيقاً واستلاماً مزدوجاً مستقلاً (Double-Check).</span>
        </div>

        <!-- Indication Selection -->
        <div>
          <label class="block text-[11px] font-semibold text-slate-700 mb-1">
            🎯 الاستطباب السريري (Indication / Protocol):
          </label>
          <select id="infusionIndicationSelect" class="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500">
            ${defaultDrug.indications.map(ind => `
              <option value="${ind.id}" ${ind.id === defaultIndication.id ? 'selected' : ''}>
                ${ind.title}
              </option>
            `).join('')}
          </select>
          <div id="indicationNotesBox" class="mt-1.5 p-2 bg-blue-50/60 border border-blue-100 rounded-xl text-[10px] text-blue-900">
            📌 <span class="font-bold">ملاحظات الاستطباب:</span> <span id="indicationNotesText">${defaultIndication.notes}</span>
          </div>
        </div>

        <!-- Inputs Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <!-- Weight Input -->
          <div id="weightContainer" class="${SUPPORTED_DOSE_UNITS[defaultIndication.doseUnitKey]?.requiresWeight ? 'block' : 'hidden'}">
            <label class="block text-[11px] font-semibold text-slate-700 mb-1">
              ⚖️ وزن المريض (kg):
            </label>
            <input 
              type="number" 
              id="infusionWeightInput" 
              min="1"
              max="300"
              step="any"
              value="${defaultWeight}" 
              placeholder="مثال: 70" 
              dir="ltr"
              class="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold text-center text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500"
            >
          </div>

          <!-- Dose Unit Selection -->
          <div>
            <label class="block text-[11px] font-semibold text-slate-700 mb-1">
              📏 وحدة الجرعة (Dose Unit):
            </label>
            <select id="infusionDoseUnitSelect" class="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500" dir="ltr">
              ${defaultDrug.supportedDoseUnitKeys.map(uKey => `
                <option value="${uKey}" ${uKey === defaultIndication.doseUnitKey ? 'selected' : ''}>
                  ${SUPPORTED_DOSE_UNITS[uKey]?.label || uKey}
                </option>
              `).join('')}
            </select>
          </div>

          <!-- Dose Value Input -->
          <div>
            <label class="block text-[11px] font-semibold text-slate-700 mb-1">
              💊 الجرعة المطلوبة (Dose Value):
            </label>
            <input 
              type="number" 
              id="infusionDoseInput" 
              step="any"
              min="0.0001"
              value="${defaultIndication.doseMin}" 
              placeholder="الجرعة" 
              dir="ltr"
              class="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold text-center text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500"
            >
            <div id="doseRangeText" class="text-[10px] text-blue-700 font-bold mt-1 font-mono text-center" dir="ltr">
              Range: ${initialRange.min} - ${initialRange.max} ${SUPPORTED_DOSE_UNITS[defaultIndication.doseUnitKey]?.label}
            </div>
          </div>

          <!-- Concentration Selection -->
          <div>
            <label class="block text-[11px] font-semibold text-slate-700 mb-1">
              🧪 تركيز السرنجة (Syringe Concentration):
            </label>
            <select id="infusionConcSelect" class="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500">
              ${defaultDrug.standardConcentrations.map((conc, idx) => `
                <option value="${idx}" ${idx === 0 ? 'selected' : ''}>
                  ${conc.label}
                </option>
              `).join('')}
            </select>
          </div>
        </div>
      </div>

      <!-- Results Display Container -->
      <div id="infusionResultsContainer">
        ${renderInfusionResultsHTML(initialResults)}
      </div>

      <!-- Clinical Safety Notes & Reference Card -->
      <div class="p-3.5 bg-amber-50 border-r-4 border-amber-500 text-amber-900 text-xs rounded-l-xl space-y-1.5">
        <div class="font-bold flex items-center gap-1 text-slate-900">
          <span>⚠️</span> 
          <span>تنبيه سلامة سريري ومصدر الجرعات:</span>
        </div>
        <p id="clinicalSafetyNotesText" class="opacity-90 leading-relaxed">
          ${defaultDrug.clinicalSafetyNotes}
        </p>
        <div class="pt-1 text-[10px] text-amber-800 border-t border-amber-200/60 font-semibold">
          📚 المصدر المرجعي: <span id="referenceText">${defaultDrug.reference}</span>
        </div>
      </div>
    </div>
  `;
}

export function renderInfusionResultsHTML(results) {
  if (!results || !results.isValid) {
    return `
      <div class="p-4 bg-rose-50 border border-rose-300 text-rose-900 text-xs font-bold rounded-2xl text-center space-y-1">
        <div>⚠️ خطأ في المدخلات:</div>
        <div class="text-[11px] font-semibold">${results?.error || 'يرجى التأكد من إدخال جميع البيانات بشكل صحيح.'}</div>
      </div>
    `;
  }

  return `
    <div class="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-3">
      <!-- Interactive Red Overdose Banner -->
      ${results.isOverdose ? `
        <div class="p-3 bg-rose-100 border-2 border-rose-500 text-rose-900 text-xs font-bold rounded-xl space-y-1 animate-pulse">
          <div class="flex items-center gap-1 text-sm text-rose-800">
            <span>⛔</span> <span>تنبيه سلامة حرج (OVERDOSE WARNING)</span>
          </div>
          <p class="text-[11px] font-semibold leading-relaxed">${results.overdoseMessage}</p>
        </div>
      ` : ''}

      <div class="flex justify-between items-center border-b border-slate-100 pb-2">
        <h4 class="font-bold text-xs text-blue-600 flex items-center gap-1">
          <span>⚙️</span>
          <span>معدل ضخ المضخة المحسوب (Pump Infusion Rate):</span>
        </h4>
        ${results.isHighAlert ? `
          <span class="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded-lg border border-rose-200 font-bold">
            HIGH-ALERT
          </span>
        ` : ''}
      </div>

      <!-- Prominent Pump Rate Result -->
      <div class="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-center space-y-1">
        <div class="text-[11px] font-bold text-blue-900">معدل الضخ المطلوب ضبطه على المضخة:</div>
        <div dir="ltr" class="text-3xl font-black font-mono ${results.isOverdose ? 'text-rose-600' : 'text-blue-700'} tracking-tight">
          ${results.pumpRateMlHr.toFixed(2)} <span class="text-lg font-bold">mL/hr</span>
        </div>
      </div>

      <!-- Detail Metrics Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
        <div class="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl">
          <span class="text-slate-600 font-medium">الجرعة الساعية الكلية:</span>
          <strong dir="ltr" class="font-mono text-slate-900" style="unicode-bidi: isolate;">
            ${results.totalHourlyDose < 1 ? results.totalHourlyDose.toFixed(3) : results.totalHourlyDose.toFixed(2)} ${results.totalHourlyDoseUnit}
          </strong>
        </div>

        <div class="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl">
          <span class="text-slate-600 font-medium">التركيز الفعلي المعتمد:</span>
          <strong dir="ltr" class="font-mono text-slate-900" style="unicode-bidi: isolate;">
            ${results.effectiveConcInDoseBase} ${results.totalHourlyDoseUnit.split('/')[0]}/mL
          </strong>
        </div>

        <div class="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl">
          <span class="text-slate-600 font-medium">الجرعة المدخلة:</span>
          <strong dir="ltr" class="font-mono text-slate-900" style="unicode-bidi: isolate;">
            ${results.doseValue} ${results.doseUnitLabel}
          </strong>
        </div>

        ${results.patientWeight ? `
          <div class="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl">
            <span class="text-slate-600 font-medium">وزن المريض المعتمد:</span>
            <strong dir="ltr" class="font-mono text-slate-900" style="unicode-bidi: isolate;">
              ${results.patientWeight} kg
            </strong>
          </div>
        ` : `
          <div class="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl text-slate-400">
            <span class="font-medium">نوع الجرعة:</span>
            <strong class="font-mono text-slate-500">معدل ثابت (Fixed Rate)</strong>
          </div>
        `}
      </div>
    </div>
  `;
}

function attachInfusionViewListeners() {
  const wrapper = document.getElementById('infusionViewWrapper');
  if (!wrapper) return;

  wrapper.addEventListener('change', handleInfusionViewEvent);
  wrapper.addEventListener('input', handleInfusionViewEvent);
}

function handleInfusionViewEvent(e) {
  const targetId = e.target.id;
  if (!targetId) return;

  const drugSelect = document.getElementById('infusionDrugSelect');
  if (!drugSelect) return;

  const drugId = drugSelect.value;
  const drug = infusionDrugsData.find(d => d.id === drugId);
  if (!drug) return;

  const indicationSelect = document.getElementById('infusionIndicationSelect');
  const doseUnitSelect = document.getElementById('infusionDoseUnitSelect');
  const weightInput = document.getElementById('infusionWeightInput');
  const doseInput = document.getElementById('infusionDoseInput');
  const concSelect = document.getElementById('infusionConcSelect');

  const highAlertBanner = document.getElementById('highAlertBanner');
  const indicationNotesText = document.getElementById('indicationNotesText');
  const doseRangeText = document.getElementById('doseRangeText');
  const weightContainer = document.getElementById('weightContainer');
  const safetyNotesText = document.getElementById('clinicalSafetyNotesText');
  const referenceText = document.getElementById('referenceText');

  if (targetId === 'infusionDrugSelect') {
    if (highAlertBanner) {
      highAlertBanner.className = drug.isHighAlert
        ? 'p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-[11px] font-bold flex items-center gap-1.5 block'
        : 'hidden';
    }

    if (indicationSelect) {
      indicationSelect.innerHTML = drug.indications.map(ind => `
        <option value="${ind.id}">${ind.title}</option>
      `).join('');
    }

    const selectedInd = drug.indications[0];
    if (indicationNotesText) indicationNotesText.textContent = selectedInd.notes;

    if (doseUnitSelect) {
      doseUnitSelect.innerHTML = drug.supportedDoseUnitKeys.map(uKey => `
        <option value="${uKey}" ${uKey === selectedInd.doseUnitKey ? 'selected' : ''}>
          ${SUPPORTED_DOSE_UNITS[uKey]?.label || uKey}
        </option>
      `).join('');
    }

    if (doseInput) doseInput.value = selectedInd.doseMin;

    if (concSelect) {
      concSelect.innerHTML = drug.standardConcentrations.map((conc, idx) => `
        <option value="${idx}" ${idx === 0 ? 'selected' : ''}>${conc.label}</option>
      `).join('');
    }

    if (safetyNotesText) safetyNotesText.textContent = drug.clinicalSafetyNotes;
    if (referenceText) referenceText.textContent = drug.reference;
  }

  const currentIndId = indicationSelect ? indicationSelect.value : drug.indications[0].id;
  const selectedInd = drug.indications.find(i => i.id === currentIndId) || drug.indications[0];
  const selectedUnitKey = doseUnitSelect ? doseUnitSelect.value : selectedInd.doseUnitKey;

  const requiresWeight = SUPPORTED_DOSE_UNITS[selectedUnitKey]?.requiresWeight;
  if (weightContainer) {
    weightContainer.className = requiresWeight ? 'block' : 'hidden';
  }

  // تحديث ديناميكي لعنوان النطاق المسموح بناءً على الوحدة والوزن المختارين
  if (doseRangeText) {
    const currentWeight = weightInput ? parseFloat(weightInput.value) : 70;
    const dynamicRange = convertDoseRange(
      selectedInd.doseMin,
      selectedInd.doseMax,
      selectedInd.doseUnitKey,
      selectedUnitKey,
      currentWeight
    );
    const unitLabel = SUPPORTED_DOSE_UNITS[selectedUnitKey]?.label || selectedUnitKey;
    doseRangeText.textContent = `Range: ${dynamicRange.min} - ${dynamicRange.max} ${unitLabel}`;
  }

  calculateAndUpdateUI();
}

function calculateAndUpdateUI() {
  const drugSelect = document.getElementById('infusionDrugSelect');
  if (!drugSelect) return;

  const drugId = drugSelect.value;
  const drug = infusionDrugsData.find(d => d.id === drugId);
  if (!drug) return;

  const indicationSelect = document.getElementById('infusionIndicationSelect');
  const doseInput = document.getElementById('infusionDoseInput');
  const doseUnitSelect = document.getElementById('infusionDoseUnitSelect');
  const concSelect = document.getElementById('infusionConcSelect');
  const weightInput = document.getElementById('infusionWeightInput');
  const resultsContainer = document.getElementById('infusionResultsContainer');

  if (!doseInput || !doseUnitSelect || !concSelect || !resultsContainer) return;

  const doseVal = parseFloat(doseInput.value);
  const doseUnitKey = doseUnitSelect.value;
  const concIdx = parseInt(concSelect.value, 10) || 0;
  const concObj = drug.standardConcentrations[concIdx] || drug.standardConcentrations[0];
  const weightVal = weightInput ? parseFloat(weightInput.value) : null;
  const indId = indicationSelect ? indicationSelect.value : drug.indications[0].id;

  const results = calculateInfusionRate({
    drugId: drug.id,
    indicationId: indId,
    patientWeight: weightVal,
    doseValue: doseVal,
    doseUnitKey,
    concentrationValue: concObj.value,
    concentrationUnitKey: concObj.unitKey
  });

  resultsContainer.innerHTML = renderInfusionResultsHTML(results);
}
