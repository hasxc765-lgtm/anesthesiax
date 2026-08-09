/**
 * واجهة حاسبة السوائل والنزف المسموح به (Fluid & ABL View Component)
 */

import { store } from '../state/store.js';
import { calculateFluidParams } from '../calculators/fluidCalculator.js';

export function renderFluidView() {
  const savedWeight = store.state.patientWeight || '';
  const fastingHours = store.state.fastingHours !== undefined ? store.state.fastingHours : 6;
  const strategy = store.state.fluidStrategy || 'eras';
  const surgicalTrauma = store.state.surgicalTrauma || 'moderate';
  const ageGroup = store.state.ebvAgeGroup || 'adult_male';
  const hbInitial = store.state.hbInitial || '';
  const hbTarget = store.state.hbTarget || '';
  const currentBloodLoss = store.state.currentBloodLoss || '';

  const results = calculateFluidParams({
    weightKg: savedWeight,
    fastingHours,
    strategy,
    surgicalTrauma,
    ageGroup,
    hbInitial,
    hbTarget,
    currentBloodLoss
  });

  return `
    <div class="max-w-2xl mx-auto space-y-4" dir="rtl">
      <!-- Section Header -->
      <div class="flex justify-between items-center bg-blue-600 text-white p-3.5 rounded-2xl shadow-sm">
        <div class="flex items-center gap-2">
          <span class="text-2xl">💧</span>
          <div>
            <h2 class="font-bold text-sm">حاسبة السوائل والنزف المسموح (Fluid & ABL)</h2>
            <p class="text-[10px] opacity-80">صيانة 4-2-1، تعويض الصيام، EBV، و ABL</p>
          </div>
        </div>
      </div>

      <!-- Inputs Card -->
      <div class="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-3">
        <h3 class="font-bold text-xs text-slate-700">📋 البيانات والخيارات السريرية:</h3>

        <div class="grid grid-cols-2 gap-2">
          <!-- Weight Input -->
          <div>
            <label class="block text-[11px] font-semibold text-slate-600 mb-1">الوزن (kg):</label>
            <input 
              type="number" 
              id="fluidWeightInput" 
              step="any"
              value="${savedWeight}" 
              placeholder="مثال: 70" 
              dir="ltr"
              class="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold text-center text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500"
            >
          </div>

          <!-- Fasting Hours -->
          <div>
            <label class="block text-[11px] font-semibold text-slate-600 mb-1">ساعات الصيام (NPO):</label>
            <input 
              type="number" 
              id="fluidFastingInput" 
              step="any"
              value="${fastingHours}" 
              placeholder="6" 
              dir="ltr"
              class="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold text-center text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500"
            >
          </div>
        </div>

        <!-- Strategy Selection -->
        <div>
          <label class="block text-[11px] font-semibold text-slate-600 mb-1">إستراتيجية السوائل (Fluid Strategy):</label>
          <div class="grid grid-cols-2 gap-2">
            <button 
              id="btnStrategyEras" 
              class="py-2 px-2 text-[11px] font-bold rounded-xl border transition ${strategy === 'eras' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-700 border-slate-200'}"
            >
              🌱 مقيّدة حديثة (ERAS)
            </button>
            <button 
              id="btnStrategyTrad" 
              class="py-2 px-2 text-[11px] font-bold rounded-xl border transition ${strategy === 'traditional' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-700 border-slate-200'}"
            >
              📜 تقليدية أكاديمية (Traditional)
            </button>
          </div>
        </div>

        <!-- Surgical Trauma -->
        <div>
          <label class="block text-[11px] font-semibold text-slate-600 mb-1">حجم الجراحة التقديري (Surgical Trauma):</label>
          <select id="fluidTraumaSelect" class="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 bg-slate-50 focus:bg-white focus:outline-none">
            <option value="none" ${surgicalTrauma === 'none' ? 'selected' : ''}>بدون فقدان جراحي ملموس (0 mL/kg/hr)</option>
            <option value="minimal" ${surgicalTrauma === 'minimal' ? 'selected' : ''}>بسيطة - Minimal (1 - 2 mL/kg/hr)</option>
            <option value="moderate" ${surgicalTrauma === 'moderate' ? 'selected' : ''}>متوسطة - Moderate (3 - 4 mL/kg/hr)</option>
            <option value="severe" ${surgicalTrauma === 'severe' ? 'selected' : ''}>شديدة / بطن مفتوح - Severe (5 - 8 mL/kg/hr)</option>
          </select>
        </div>

        <!-- EBV Age Group -->
        <div>
          <label class="block text-[11px] font-semibold text-slate-600 mb-1">فئة المريض لحجم الدم (EBV Factor):</label>
          <select id="fluidEbvGroupSelect" class="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 bg-slate-50 focus:bg-white focus:outline-none">
            <option value="premature" ${ageGroup === 'premature' ? 'selected' : ''}>الخدج (95 mL/kg)</option>
            <option value="neonate" ${ageGroup === 'neonate' ? 'selected' : ''}>حديثو الولادة مكتملو النمو (85 mL/kg)</option>
            <option value="infant_child" ${ageGroup === 'infant_child' ? 'selected' : ''}>الرضع والأطفال (75 mL/kg)</option>
            <option value="adult_male" ${ageGroup === 'adult_male' ? 'selected' : ''}>البالغون الذكور (75 mL/kg)</option>
            <option value="adult_female" ${ageGroup === 'adult_female' ? 'selected' : ''}>البالغات الإناث (65 mL/kg)</option>
            <option value="elderly_obese" ${ageGroup === 'elderly_obese' ? 'selected' : ''}>كبار السن / السمنة المفرطة (60 mL/kg)</option>
          </select>
        </div>

        <!-- ABL Parameters -->
        <div class="border-t border-slate-100 pt-3 space-y-2">
          <h4 class="font-bold text-xs text-blue-600">🩸 معاملات حساب النزف المسموح (ABL):</h4>
          <div class="grid grid-cols-3 gap-2">
            <div>
              <label class="block text-[10px] font-semibold text-slate-600 mb-1">Hb الابتدائي (g/dL):</label>
              <input 
                type="number" 
                id="fluidHbInitInput" 
                step="0.1"
                value="${hbInitial}" 
                placeholder="14" 
                dir="ltr"
                class="w-full p-2 border border-slate-300 rounded-xl text-xs font-bold text-center text-slate-900 bg-slate-50 focus:bg-white focus:outline-none"
              >
            </div>
            <div>
              <label class="block text-[10px] font-semibold text-slate-600 mb-1">Hb المستهدف (g/dL):</label>
              <input 
                type="number" 
                id="fluidHbTargInput" 
                step="0.1"
                value="${hbTarget}" 
                placeholder="10" 
                dir="ltr"
                class="w-full p-2 border border-slate-300 rounded-xl text-xs font-bold text-center text-slate-900 bg-slate-50 focus:bg-white focus:outline-none"
              >
            </div>
            <div>
              <label class="block text-[10px] font-semibold text-slate-600 mb-1">النزف الحالي (mL):</label>
              <input 
                type="number" 
                id="fluidLossInput" 
                step="any"
                value="${currentBloodLoss}" 
                placeholder="0" 
                dir="ltr"
                class="w-full p-2 border border-slate-300 rounded-xl text-xs font-bold text-center text-slate-900 bg-slate-50 focus:bg-white focus:outline-none"
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Results Display Container -->
      <div id="fluidResultsContainer">
        ${renderFluidResultsHTML(results)}
      </div>

      <!-- Clinical Safety Notice -->
      <div class="p-3 bg-amber-50 border-r-4 border-amber-500 text-amber-900 text-xs rounded-l-xl space-y-1">
        <div class="font-bold flex items-center gap-1">
          <span>⚠️</span> <span>تنبيه سريري وتوجيه تعليمي:</span>
        </div>
        <p class="opacity-90">أرقام ABL والسوائل الاسترشادية لا تشكل أمراً تلقائياً لنقل الدم أو ضخ السوائل. قرار نقل الدم يعتمد على العلامات الحيوية، وتروية الأنسجة، والنزف المستمر.</p>
      </div>
    </div>
  `;
}

export function renderFluidResultsHTML(results) {
  if (!results.isValid) {
    return `
      <div class="p-4 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold rounded-2xl text-center">
        ⚠️ ${results.error}
      </div>
    `;
  }

  let ablSectionHTML = '';
  if (results.isAblValid) {
    const isAblExceeded = results.remainingAbl < 0;
    ablSectionHTML = `
      <div class="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-2">
        <div class="flex items-center gap-2 border-b border-slate-100 pb-2">
          <span class="text-lg">🩸</span>
          <h4 class="font-bold text-xs text-blue-600">النزف المسموح به (Allowable Blood Loss - ABL)</h4>
        </div>

        <div class="space-y-1.5 text-xs">
          <div class="flex justify-between items-center bg-slate-50 p-2 rounded-xl">
            <span class="text-slate-600 font-medium">الحد الأقصى للنزف المسموح (ABL):</span>
            <strong dir="ltr" class="font-mono text-blue-800 text-sm" style="unicode-bidi: isolate;">
              ${results.abl} mL
            </strong>
          </div>

          <div class="flex justify-between items-center bg-slate-50 p-2 rounded-xl">
            <span class="text-slate-600 font-medium">النزف المسجل حتى الآن:</span>
            <strong dir="ltr" class="font-mono text-slate-800 text-sm" style="unicode-bidi: isolate;">
              ${results.currentLoss} mL
            </strong>
          </div>

          <div class="flex justify-between items-center ${isAblExceeded ? 'bg-rose-50 border border-rose-200' : 'bg-emerald-50 border border-emerald-100'} p-2 rounded-xl">
            <span class="${isAblExceeded ? 'text-rose-900' : 'text-emerald-900'} font-bold">المتبقي من ABL قبل نقل الدم:</span>
            <strong dir="ltr" class="font-mono ${isAblExceeded ? 'text-rose-700' : 'text-emerald-800'} text-sm" style="unicode-bidi: isolate;">
              ${results.remainingAbl} mL
            </strong>
          </div>

          ${isAblExceeded ? `
            <div class="text-[10px] text-rose-700 font-semibold mt-1">
              ⚠️ تم تجاوز حد النزف المسموح به. يجب تقييم حاجة المريض لنقل الدم بناءً على المؤشرات السريرية.
            </div>
          ` : ''}
        </div>
      </div>
    `;
  } else {
    ablSectionHTML = `
      <div class="p-3 bg-slate-50 border border-slate-200 text-slate-600 text-xs font-medium rounded-2xl text-center">
        💡 ${results.ablError}
      </div>
    `;
  }

  let npoDetailsHTML = '';
  if (results.strategy === 'traditional' && results.npoReplacementSchedule) {
    npoDetailsHTML = `
      <div class="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-xl space-y-1 text-xs">
        <div class="font-bold text-blue-900">🗓️ خطة تعويض الصيام التقليدية (المجموع: <span dir="ltr" class="font-mono">${results.theoreticalNpoDeficit} mL</span>):</div>
        <div class="grid grid-cols-3 gap-1 text-[11px] text-center">
          <div class="bg-white p-1 rounded-lg border border-blue-100">س1: <strong dir="ltr" class="font-mono text-blue-700">${results.npoReplacementSchedule.hour1} mL/hr</strong></div>
          <div class="bg-white p-1 rounded-lg border border-blue-100">س2: <strong dir="ltr" class="font-mono text-blue-700">${results.npoReplacementSchedule.hour2} mL/hr</strong></div>
          <div class="bg-white p-1 rounded-lg border border-blue-100">س3: <strong dir="ltr" class="font-mono text-blue-700">${results.npoReplacementSchedule.hour3} mL/hr</strong></div>
        </div>
      </div>
    `;
  }

  return `
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <!-- 1. Maintenance Fluid Card -->
      <div class="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-2">
        <div class="flex items-center gap-2 border-b border-slate-100 pb-2">
          <span class="text-lg">⚙️</span>
          <h4 class="font-bold text-xs text-blue-600">صيانة السوائل الأساسية (4-2-1 Rule)</h4>
        </div>

        <div class="space-y-1.5 text-xs">
          <div class="flex justify-between items-center bg-slate-50 p-2 rounded-xl">
            <span class="text-slate-600 font-medium">معدل الصيانة للساعة:</span>
            <strong dir="ltr" class="font-mono text-blue-800 text-sm" style="unicode-bidi: isolate;">
              ${results.hourlyMaintenance} mL/hr
            </strong>
          </div>

          <div class="text-[11px] text-slate-500 pt-1">
            📌 <span class="font-semibold text-slate-700">ملاحظة الصيام (NPO):</span> ${results.npoNote}
          </div>

          ${npoDetailsHTML}
        </div>
      </div>

      <!-- 2. Surgical Loss & EBV Card -->
      <div class="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-2">
        <div class="flex items-center gap-2 border-b border-slate-100 pb-2">
          <span class="text-lg">🔪</span>
          <h4 class="font-bold text-xs text-blue-600">الفقدان الجراحي وحجم الدم (EBV)</h4>
        </div>

        <div class="space-y-1.5 text-xs">
          <div class="flex justify-between items-center bg-slate-50 p-2 rounded-xl">
            <span class="text-slate-600 font-medium">الفقدان الجراحي التقديري:</span>
            <strong dir="ltr" class="font-mono text-slate-800 text-sm" style="unicode-bidi: isolate;">
              ${results.surgicalLossMlHr}
            </strong>
          </div>

          <div class="flex justify-between items-center bg-slate-50 p-2 rounded-xl">
            <span class="text-slate-600 font-medium">حجم الدم الكلي (EBV):</span>
            <strong dir="ltr" class="font-mono text-blue-800 text-sm" style="unicode-bidi: isolate;">
              ${results.ebv} mL
            </strong>
          </div>

          <div class="text-[10px] text-slate-400">
            الفئة المحددة: ${results.ebvLabel}
          </div>
        </div>
      </div>

      <!-- 3. ABL Card (Full Width) -->
      <div class="sm:col-span-2">
        ${ablSectionHTML}
      </div>
    </div>
  `;
}
