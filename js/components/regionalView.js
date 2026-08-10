/**
 * Regional Anesthesia & LAST View Component (Phase 5)
 */

import { store } from '../state/store.js';
import { calculateRegionalParams, localAnestheticsDB } from '../calculators/regionalCalculator.js';

export function renderRegionalView() {
  const savedWeight = store.state.patientWeight || '';
  const drugKey = store.state.regionalDrug || 'bupivacaine';
  const withEpinephrine = store.state.regionalWithEpi || false;
  const selectedConc = store.state.regionalConc || 0;

  const currentDrugObj = localAnestheticsDB[drugKey] || localAnestheticsDB.bupivacaine;

  const results = calculateRegionalParams({
    weightKg: savedWeight,
    drugKey,
    withEpinephrine,
    concentrationMgMl: selectedConc || currentDrugObj.defaultConcentrationMgMl
  });

  return `
    <div class="max-w-2xl mx-auto space-y-4" dir="rtl">
      <!-- Section Header -->
      <div class="flex justify-between items-center bg-blue-600 text-white p-3.5 rounded-2xl shadow-sm">
        <div class="flex items-center gap-2">
          <span class="text-2xl">⚡</span>
          <div>
            <h2 class="font-bold text-sm">حاسبة التخدير المناطقي وسمية LAST</h2>
            <p class="text-[10px] opacity-80">الجرعات المرجعية القصوى للمخدرات الموضعية وبروتوكول Lipid 20%</p>
          </div>
        </div>
      </div>

      <!-- Section 1: Regional Anesthesia Inputs & Calculations -->
      <div class="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-3">
        <h3 class="font-bold text-xs text-slate-800 border-b border-slate-100 pb-1.5 flex items-center gap-1">
          <span>💉</span> <span>أولاً: حاسبة التخدير المناطقي (Regional Anesthesia)</span>
        </h3>

        <!-- Patient Weight Input -->
        <div>
          <label class="block text-[11px] font-semibold text-slate-600 mb-1">⚖️ وزن المريض (kg):</label>
          <input 
            type="number" 
            id="regionalWeightInput" 
            step="any"
            value="${savedWeight}" 
            placeholder="مثال: 70" 
            dir="ltr"
            class="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold text-center text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500"
          >
        </div>

        <!-- Local Anesthetic Selection -->
        <div>
          <label class="block text-[11px] font-semibold text-slate-600 mb-1">المخدر الموضعي (Local Anesthetic):</label>
          <select id="regionalDrugSelect" class="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 bg-slate-50 focus:bg-white focus:outline-none">
            ${Object.keys(localAnestheticsDB).map(key => {
              const d = localAnestheticsDB[key];
              return `<option value="${d.id}" ${d.id === drugKey ? 'selected' : ''}>${d.arabicName}</option>`;
            }).join('')}
          </select>
        </div>

        <!-- Additive (Epinephrine) Toggle -->
        <div>
          <label class="block text-[11px] font-semibold text-slate-600 mb-1">إضافة مادة قابضة (Epinephrine 1:200,000):</label>
          <div class="grid grid-cols-2 gap-2">
            <button 
              id="btnEpiFalse" 
              class="py-2 px-2 text-[11px] font-bold rounded-xl border transition ${!withEpinephrine ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-700 border-slate-200'}"
            >
              بدون إبينفرين (Plain)
            </button>
            <button 
              id="btnEpiTrue" 
              class="py-2 px-2 text-[11px] font-bold rounded-xl border transition ${withEpinephrine ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-700 border-slate-200'}"
            >
              مع إبينفرين (+ Epinephrine)
            </button>
          </div>
        </div>

        <!-- Concentration Selection -->
        <div>
          <label class="block text-[11px] font-semibold text-slate-600 mb-1">التركيز المتاح (Concentration):</label>
          <select id="regionalConcSelect" class="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 bg-slate-50 focus:bg-white focus:outline-none" dir="ltr">
            ${currentDrugObj.availableConcentrations.map(c => `
              <option value="${c.value}" ${c.value === (selectedConc || currentDrugObj.defaultConcentrationMgMl) ? 'selected' : ''}>${c.label}</option>
            `).join('')}
          </select>
        </div>
      </div>

      <!-- Regional Calculations Display -->
      <div id="regionalResultsContainer">
        ${renderRegionalResultsHTML(results)}
      </div>

      <!-- Section 2: LAST Emergency Calculator -->
      <div id="lastEmergencyContainer">
        ${renderLastEmergencyHTML(results)}
      </div>

      <!-- Clinical Safety Notice & Educational Disclaimer -->
      <div class="p-3.5 bg-amber-50 border-r-4 border-amber-500 text-amber-900 text-xs rounded-l-xl space-y-1.5">
        <div class="font-bold flex items-center gap-1 text-slate-900">
          <span>⚠️</span> <span>تنبيه سلامة سريري واستشاري (Clinical Safety Notice):</span>
        </div>
        <p class="opacity-90 leading-relaxed">
          جميع الجرعات الموضحة أعلاه هي <strong>جرعات مرجعية قصوى (Maximum Reference Doses)</strong> وليست "جرعات آمنة مطلقة". الجرعة الفعلية المحقونة تعتمد على مكان الحقن (Block Site)، والروائية الدموية للمنطقة، والتقنية المستعملة، وحالة الكبد والقلب للمريض.
        </p>
        <p class="opacity-90 leading-relaxed">
          في حالات طوارئ <strong>LAST</strong>، اتبع فوراً قائمة تدقيق <strong>ASRA LAST Checklist</strong> المعتمدة والبروتوكول المحلي للمستشفى. هذه الحاسبة أداة تعليمية واستشارية ولا تستبدل القرار السريري.
        </p>
      </div>
    </div>
  `;
}

export function renderRegionalResultsHTML(results) {
  if (!results.isValid) {
    return `
      <div class="p-4 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold rounded-2xl text-center">
        ⚠️ ${results.error}
      </div>
    `;
  }

  return `
    <div class="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-2.5">
      <div class="flex justify-between items-center border-b border-slate-100 pb-2">
        <h4 class="font-bold text-xs text-blue-600">نتائج الجرعة المرجعية القصوى (${results.arabicName}):</h4>
        <span class="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-lg border border-blue-100 font-bold">
          ${results.withEpinephrine ? 'مع إبينفرين' : 'بدون إبينفرين'}
        </span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        <div class="flex justify-between items-center bg-slate-50 p-2 rounded-xl">
          <span class="text-slate-600 font-medium">الجرعة المرجعية لكل كجم:</span>
          <strong dir="ltr" class="font-mono text-slate-900" style="unicode-bidi: isolate;">
            ${results.maxMgKg} mg/kg
          </strong>
        </div>

        <div class="flex justify-between items-center bg-slate-50 p-2 rounded-xl">
          <span class="text-slate-600 font-medium">الحد المطلق المرجعي:</span>
          <strong dir="ltr" class="font-mono text-slate-900" style="unicode-bidi: isolate;">
            ${results.maxAbsoluteMg} mg
          </strong>
        </div>

        <div class="flex justify-between items-center bg-blue-50 p-2 rounded-xl border border-blue-100">
          <span class="text-blue-900 font-bold">الجرعة القصوى المحسوبة:</span>
          <strong dir="ltr" class="font-mono text-blue-800 text-sm" style="unicode-bidi: isolate;">
            ${results.calculatedMaxDoseMg.toFixed(1)} mg
          </strong>
        </div>

        <div class="flex justify-between items-center bg-emerald-50 p-2 rounded-xl border border-emerald-100">
          <span class="text-emerald-900 font-bold">الحجم المرجعي الأقصى (Volume):</span>
          <strong dir="ltr" class="font-mono text-emerald-800 text-sm" style="unicode-bidi: isolate;">
            ${results.maxReferenceVolumeMl.toFixed(1)} mL
          </strong>
        </div>
      </div>

      ${results.isAbsoluteCapApplied ? `
        <div class="p-2 bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-semibold rounded-xl">
          ⚠️ تنبيه: تم تطبيق الحد الأقصى المطلق المرجعي (${results.maxAbsoluteMg} mg) لأن الجرعة المحسوبة بناءً على الوزن تجاوزت هذا الحد.
        </div>
      ` : ''}
    </div>
  `;
}

export function renderLastEmergencyHTML(results) {
  if (!results.isValid) return '';

  return `
    <div class="p-4 bg-white border border-rose-200 rounded-2xl shadow-sm space-y-3">
      <div class="flex items-center justify-between border-b border-rose-100 pb-2">
        <div class="flex items-center gap-2">
          <span class="text-lg">🚨</span>
          <h4 class="font-bold text-xs text-rose-700">ثانياً: حاسبة طوارئ إنقاذ سمية المخدر الموضعي (LAST Emergency Calculator)</h4>
        </div>
        <span class="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-md border border-rose-200">Lipid Emulsion 20%</span>
      </div>

      <div class="space-y-2 text-xs">
        <!-- Initial Bolus -->
        <div class="p-2.5 bg-rose-50 border border-rose-100 rounded-xl flex justify-between items-center">
          <div>
            <div class="font-bold text-rose-900">1. الجرعة الأولى المباشرة (Initial IV Bolus):</div>
            <div class="text-[10px] text-rose-700">تُعطى وريدياً خلال دقيقة واحدة (1.5 mL/kg)</div>
          </div>
          <strong dir="ltr" class="font-mono text-rose-800 text-base font-bold" style="unicode-bidi: isolate;">
            ${results.lipidBolusMl.toFixed(1)} mL
          </strong>
        </div>

        <!-- Continuous Infusion -->
        <div class="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
          <div class="font-bold text-slate-800">2. التسريب المستمر (Continuous Infusion):</div>
          <div class="flex justify-between items-center text-[11px] pt-1 border-t border-slate-200">
            <span class="text-slate-600">المعدل بالدقيقة (0.25 mL/kg/min):</span>
            <strong dir="ltr" class="font-mono text-slate-900" style="unicode-bidi: isolate;">
              ${results.lipidInfusionMlMin.toFixed(1)} mL/min
            </strong>
          </div>
          <div class="flex justify-between items-center text-[11px]">
            <span class="text-slate-600">المعدل بالساعة (mL/hr):</span>
            <strong dir="ltr" class="font-mono text-blue-800 font-bold" style="unicode-bidi: isolate;">
              ${results.lipidInfusionMlHr.toFixed(1)} mL/hr
            </strong>
          </div>
        </div>

        <!-- Maximum Cumulative Reference Ceiling -->
        <div class="p-2.5 bg-slate-100 border border-slate-200 rounded-xl flex justify-between items-center">
          <div>
            <div class="font-bold text-slate-800">3. الحد التراكمي الأقصى المرجعي (Ceiling Limit):</div>
            <div class="text-[10px] text-slate-500">حد أقصى مسموح به خلال 30 دقيقة (12 mL/kg) - ليس هدفاً</div>
          </div>
          <strong dir="ltr" class="font-mono text-slate-800 text-sm font-bold" style="unicode-bidi: isolate;">
            ${results.lipidMaxCumulativeMl.toFixed(1)} mL
          </strong>
        </div>
      </div>
    </div>
  `;
}
