/**
 * AnesthesiaX — Airway Calculator View Component
 * File: js/components/airwayView.js
 * 
 * Clean 0.5mm Increment Layout & Physiological Sanity Feedback
 */

import { store } from '../state/store.js';
import { calculateAirwayParams } from '../logic/airwayCalculator.js';

export function renderAirwayView() {
  const savedWeight = store.state?.patientWeight || '';
  const savedAge = store.state?.patientAge || '';
  const savedGender = store.state?.patientGender || 'male';

  const results = calculateAirwayParams(savedAge, savedWeight, savedGender);

  return `
    <div class="max-w-2xl mx-auto space-y-4 font-sans text-right" dir="rtl" id="airwayContainer">
      <!-- Section Header -->
      <div class="flex justify-between items-center bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-3.5 rounded-2xl shadow-sm">
        <div class="flex items-center gap-2">
          <span class="text-2xl">🫁</span>
          <div>
            <h2 class="font-bold text-sm">حاسبة المجرى الهوائي والأنابيب</h2>
            <p class="text-[10px] opacity-80" dir="ltr">ETT, LMA, Laryngoscope Blade, Guedel OPA</p>
          </div>
        </div>
        <button id="btnAirwayBackToDashboard" type="button" class="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-xl font-bold text-xs transition cursor-pointer">
          الرئيسية ↩
        </button>
      </div>

      <!-- Inputs Card -->
      <div class="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-3">
        <h3 class="font-bold text-xs text-slate-700">📋 بيانات المريض الأساسية:</h3>
        
        <div class="grid grid-cols-2 gap-2">
          <!-- Age Input -->
          <div>
            <label class="block text-[11px] font-semibold text-slate-600 mb-1">العمر (بالسنوات):</label>
            <input 
              type="number" 
              id="airwayAgeInput" 
              min="0"
              max="120"
              step="any"
              value="${savedAge}" 
              placeholder="مثال: 5 أو 30" 
              dir="ltr"
              class="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold text-center text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 font-mono"
            >
          </div>

          <!-- Weight Input -->
          <div>
            <label class="block text-[11px] font-semibold text-slate-600 mb-1">الوزن (kg):</label>
            <input 
              type="number" 
              id="airwayWeightInput" 
              min="0.5"
              max="300"
              step="any"
              value="${savedWeight}" 
              placeholder="مثال: 18 أو 70" 
              dir="ltr"
              class="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold text-center text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 font-mono"
            >
          </div>
        </div>

        <!-- Gender Selection -->
        <div>
          <label class="block text-[11px] font-semibold text-slate-600 mb-1">الجنس (للبالغين):</label>
          <div class="grid grid-cols-2 gap-2">
            <button 
              id="btnGenderMale" 
              type="button"
              class="py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${savedGender === 'male' ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}"
            >
              👨 ذكر (Male)
            </button>
            <button 
              id="btnGenderFemale" 
              type="button"
              class="py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${savedGender === 'female' ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}"
            >
              👩 أنثى (Female)
            </button>
          </div>
        </div>
      </div>

      <!-- Calculation Results -->
      <div id="airwayResultsContainer">
        ${renderAirwayResultsHTML(results)}
      </div>

      <!-- Clinical Airway Notes -->
      <div class="p-3.5 bg-slate-100 border border-slate-200 text-slate-700 text-[11px] rounded-2xl space-y-1.5 leading-relaxed">
        <p class="font-bold text-slate-900 flex items-center gap-1">
          <span>💡</span>
          <span>ملاحظات ومعايير الأمان السريري:</span>
        </p>
        <p>• معادلة الأنبوب بكَف (Cuffed): <span dir="ltr" class="font-mono font-bold text-blue-800">(Age / 4) + 3.5</span> (معادلة Khine بنظام تقريب 0.5 mm).</p>
        <p>• كمعيار أمان إلزامي، يتم تجهيز مقاس أساسي بجانب مقاس <span dir="ltr" class="font-mono font-bold text-blue-800">± 0.5 mm</span> (أصغر وأكبر).</p>
        <p>• في الأنابيب ذات الكَف للأطفال، يجب مراقبة ضغط الكَف وإبقائه أقل من <span dir="ltr" class="font-mono font-bold text-rose-800">&lt; 20 cmH2O</span> لمنع الأذية المخاطية.</p>
      </div>
    </div>
  `;
}

export function renderAirwayResultsHTML(results) {
  if (!results.isValid) {
    return `
      <div class="p-4 bg-rose-50 border border-rose-200 text-rose-900 text-xs font-bold rounded-2xl text-center space-y-1 shadow-sm">
        <span class="text-base block">⚠️</span>
        <p>${results.error}</p>
      </div>
    `;
  }

  // دالة ذكية لتهيئة النص ومنع تكرار الوحدات
  const formatValue = (val, unit) => {
    if (!val || val === 'N/A') return 'N/A';
    const str = String(val).trim();
    if (str.includes(unit) || /[\u0600-\u06FF]/.test(str)) return str;
    return `${str} ${unit}`;
  };

  const ettCuffedText = formatValue(results.ettCuffed, 'mm');
  const ettUncuffedText = formatValue(results.ettUncuffed, 'mm');
  const ettDepthText = formatValue(results.ettDepth, 'cm');

  return `
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      
      <!-- 1. Endotracheal Tube (ETT) Card -->
      <div class="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-2">
        <div class="flex items-center gap-2 border-b border-slate-100 pb-2">
          <span class="text-lg">🩺</span>
          <h4 class="font-bold text-xs text-blue-700">الأنبوب الرغامي (ETT)</h4>
        </div>

        <div class="space-y-2 text-xs">
          <div class="bg-blue-50/60 p-2.5 rounded-xl border border-blue-100">
            <span class="text-blue-900 font-bold block text-[11px] mb-0.5">أنبوب مع كَف (Cuffed ID):</span>
            <strong dir="ltr" class="font-mono text-blue-950 text-xs font-extrabold block text-left">
              ${ettCuffedText}
            </strong>
          </div>

          <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <span class="text-slate-700 font-semibold block text-[11px] mb-0.5">أنبوب بدون كَف (Uncuffed ID):</span>
            <strong dir="ltr" class="font-mono text-slate-800 text-xs font-bold block text-left">
              ${ettUncuffedText}
            </strong>
          </div>

          <div class="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
            <span class="text-emerald-950 font-bold block text-[11px] mb-0.5">عمق الإدخال عند القواطع / الشفة:</span>
            <strong dir="ltr" class="font-mono text-emerald-900 text-sm font-extrabold block text-left">
              ${ettDepthText}
            </strong>
          </div>
        </div>
      </div>

      <!-- 2. Laryngeal Mask Airway (LMA) Card -->
      <div class="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-2">
        <div class="flex items-center gap-2 border-b border-slate-100 pb-2">
          <span class="text-lg">🎭</span>
          <h4 class="font-bold text-xs text-blue-700">القناع الحنجري (LMA)</h4>
        </div>

        <div class="space-y-2 text-xs">
          <div class="bg-indigo-50/60 p-2.5 rounded-xl border border-indigo-100">
            <span class="text-indigo-900 font-bold block text-[11px] mb-0.5">مقاس LMA المناسب:</span>
            <strong dir="ltr" class="font-mono text-indigo-950 text-sm font-extrabold block text-left">
              ${results.lmaSize}
            </strong>
          </div>

          <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <span class="text-slate-700 font-semibold block text-[11px] mb-0.5">أقصى حجم نفخ للكَف:</span>
            <strong dir="ltr" class="font-mono text-slate-800 text-xs font-bold block text-left">
              ${results.lmaCuffAir}
            </strong>
          </div>
        </div>
      </div>

      <!-- 3. Laryngoscope Blade Card -->
      <div class="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-2">
        <div class="flex items-center gap-2 border-b border-slate-100 pb-2">
          <span class="text-lg">🔦</span>
          <h4 class="font-bold text-xs text-blue-700">شفرة منظار الحنجرة (Blade)</h4>
        </div>

        <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
          <span class="text-slate-700 font-semibold block text-[11px] mb-0.5">الشفرة الموصى بها:</span>
          <strong dir="ltr" class="font-mono text-slate-900 text-xs font-bold block text-left">
            ${results.bladeSize}
          </strong>
        </div>
      </div>

      <!-- 4. Oropharyngeal Airway (OPA) Card -->
      <div class="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-2">
        <div class="flex items-center gap-2 border-b border-slate-100 pb-2">
          <span class="text-lg">👄</span>
          <h4 class="font-bold text-xs text-blue-700">الأنبوب الفموي (Guedel OPA)</h4>
        </div>

        <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
          <span class="text-slate-700 font-semibold block text-[11px] mb-0.5">مقاس Guedel المناسب:</span>
          <strong dir="ltr" class="font-mono text-slate-900 text-xs font-bold block text-left">
            ${results.opaSize}
          </strong>
        </div>
      </div>

    </div>
  `;
}

export function initAirwayEvents() {
  const container = document.getElementById("airwayContainer");
  if (!container) return;

  const ageInput = document.getElementById("airwayAgeInput");
  const weightInput = document.getElementById("airwayWeightInput");
  const btnMale = document.getElementById("btnGenderMale");
  const btnFemale = document.getElementById("btnGenderFemale");
  const resultsContainer = document.getElementById("airwayResultsContainer");
  const btnBack = document.getElementById("btnAirwayBackToDashboard");

  if (btnBack) {
    btnBack.addEventListener("click", () => {
      if (typeof window.navigateTo === "function") window.navigateTo("dashboard");
    });
  }

  const updateResults = () => {
    const age = ageInput ? ageInput.value : '';
    const weight = weightInput ? weightInput.value : '';
    const gender = store.state?.patientGender || 'male';

    if (store.state) {
      store.state.patientAge = age;
      store.state.patientWeight = weight;
    }

    const newResults = calculateAirwayParams(age, weight, gender);
    if (resultsContainer) {
      resultsContainer.innerHTML = renderAirwayResultsHTML(newResults);
    }
  };

  if (ageInput) ageInput.addEventListener("input", updateResults);
  if (weightInput) weightInput.addEventListener("input", updateResults);

  if (btnMale && btnFemale) {
    btnMale.addEventListener("click", () => {
      if (store.state) store.state.patientGender = 'male';
      btnMale.className = "py-2 text-xs font-bold rounded-xl border transition cursor-pointer bg-blue-600 text-white border-blue-600 shadow-sm";
      btnFemale.className = "py-2 text-xs font-bold rounded-xl border transition cursor-pointer bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100";
      updateResults();
    });

    btnFemale.addEventListener("click", () => {
      if (store.state) store.state.patientGender = 'female';
      btnFemale.className = "py-2 text-xs font-bold rounded-xl border transition cursor-pointer bg-blue-600 text-white border-blue-600 shadow-sm";
      btnMale.className = "py-2 text-xs font-bold rounded-xl border transition cursor-pointer bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100";
      updateResults();
    });
  }
}

export default {
  renderAirwayView,
  renderAirwayResultsHTML,
  initAirwayEvents
};
