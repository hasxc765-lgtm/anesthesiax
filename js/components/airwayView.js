/**
 * واجهة حاسبة المجرى الهوائي والأنابيب (Airway Calculator View Component)
 * تم التحديث: إصلاح معالجة الوحدات الأبجدية وتنسيق النصوص البرمجية
 */

import { store } from '../state/store.js';
import { calculateAirwayParams } from '../calculators/airwayCalculator.js';

export function renderAirwayView() {
  const savedWeight = store.state.patientWeight || '';
  const savedAge = store.state.patientAge || '';
  const savedGender = store.state.patientGender || 'male';

  const results = calculateAirwayParams(savedAge, savedWeight, savedGender);

  return `
    <div class="max-w-2xl mx-auto space-y-4" dir="rtl">
      <!-- Section Header -->
      <div class="flex justify-between items-center bg-blue-600 text-white p-3.5 rounded-2xl shadow-sm">
        <div class="flex items-center gap-2">
          <span class="text-2xl">🫁</span>
          <div>
            <h2 class="font-bold text-sm">حاسبة المجرى الهوائي والأنابيب</h2>
            <p class="text-[10px] opacity-80">قياسات ETT, LMA, Laryngoscope Blade, OPA</p>
          </div>
        </div>
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
              step="any"
              value="${savedAge}" 
              placeholder="مثال: 5 أو 30" 
              dir="ltr"
              class="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold text-center text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500"
            >
          </div>

          <!-- Weight Input -->
          <div>
            <label class="block text-[11px] font-semibold text-slate-600 mb-1">الوزن (kg):</label>
            <input 
              type="number" 
              id="airwayWeightInput" 
              step="any"
              value="${savedWeight}" 
              placeholder="مثال: 18 أو 70" 
              dir="ltr"
              class="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold text-center text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500"
            >
          </div>
        </div>

        <!-- Gender Selection -->
        <div>
          <label class="block text-[11px] font-semibold text-slate-600 mb-1">الجنس (للبالغين):</label>
          <div class="grid grid-cols-2 gap-2">
            <button 
              id="btnGenderMale" 
              class="py-2 text-xs font-bold rounded-xl border transition ${savedGender === 'male' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-700 border-slate-200'}"
            >
              👨 ذكر (Male)
            </button>
            <button 
              id="btnGenderFemale" 
              class="py-2 text-xs font-bold rounded-xl border transition ${savedGender === 'female' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-700 border-slate-200'}"
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

      <!-- Clinical Airway Notes (Clean HTML Formatting) -->
      <div class="p-3 bg-slate-100 border border-slate-200 text-slate-700 text-[11px] rounded-xl space-y-1.5">
        <p class="font-bold text-slate-900">💡 ملاحظات سريرية هامة:</p>
        <p>• معادلة الأنبوب بكَف (Cuffed): <span dir="ltr" class="font-mono font-bold text-blue-800">(Age / 4) + 3.5</span> (معادلة Khine المعتمدة).</p>
        <p>• يجب دائماً تجهيز أنبوب بمقاس <span dir="ltr" class="font-mono font-bold text-blue-800">0.5 mm</span> أصغر وأكبر بجانب المقاس المحسوب.</p>
        <p>• حجم الهواء للـ LMA هو الحد الأقصى المسموح؛ يُنفخ الكَف حتى إحكام الإغلاق بأقل كمية هواء.</p>
      </div>
    </div>
  `;
}

export function renderAirwayResultsHTML(results) {
  if (!results.isValid) {
    return `
      <div class="p-4 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold rounded-2xl text-center">
        ⚠️ ${results.error}
      </div>
    `;
  }

  // دالة ذكية لإضافة الوحدة فقط إذا كانت النتيجة رقماً أو نطاقاً أرقام
  const formatValue = (val, unit) => {
    if (!val || val === 'N/A') return 'N/A';
    // إذا كانت النتيجة تحتوي على نص عربي مثل "غير مستخدم" لا نضيف الوحدة
    const hasArabic = /[\u0600-\u06FF]/.test(val);
    if (hasArabic) return val;
    return `${val} ${unit}`;
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
          <h4 class="font-bold text-xs text-blue-600">الأنبوب الرغامي (ETT)</h4>
        </div>

        <div class="space-y-1.5 text-xs">
          <div class="flex justify-between items-center bg-slate-50 p-2 rounded-xl">
            <span class="text-slate-600 font-medium">أنبوب مع كَف (Cuffed ID):</span>
            <strong dir="ltr" class="font-mono text-blue-800 text-sm" style="unicode-bidi: isolate;">
              ${ettCuffedText}
            </strong>
          </div>

          <div class="flex justify-between items-center bg-slate-50 p-2 rounded-xl">
            <span class="text-slate-600 font-medium">أنبوب بدون كَف (Uncuffed ID):</span>
            <strong dir="ltr" class="font-mono text-slate-800 text-sm" style="unicode-bidi: isolate;">
              ${ettUncuffedText}
            </strong>
          </div>

          <div class="flex justify-between items-center bg-emerald-50 p-2 rounded-xl border border-emerald-100">
            <span class="text-emerald-900 font-bold">عمق الإدخال عند الشفة:</span>
            <strong dir="ltr" class="font-mono text-emerald-800 text-sm" style="unicode-bidi: isolate;">
              ${ettDepthText}
            </strong>
          </div>
        </div>
      </div>

      <!-- 2. Laryngeal Mask Airway (LMA) Card -->
      <div class="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-2">
        <div class="flex items-center gap-2 border-b border-slate-100 pb-2">
          <span class="text-lg">🎭</span>
          <h4 class="font-bold text-xs text-blue-600">القناع الحنجري (LMA)</h4>
        </div>

        <div class="space-y-1.5 text-xs">
          <div class="flex justify-between items-center bg-slate-50 p-2 rounded-xl">
            <span class="text-slate-600 font-medium">مقاس LMA المناسب:</span>
            <strong dir="ltr" class="font-mono text-blue-800 text-sm" style="unicode-bidi: isolate;">
              ${results.lmaSize}
            </strong>
          </div>

          <div class="flex justify-between items-center bg-slate-50 p-2 rounded-xl">
            <span class="text-slate-600 font-medium">أقصى حجم نفخ للكَف:</span>
            <strong dir="ltr" class="font-mono text-slate-800 text-sm" style="unicode-bidi: isolate;">
              ${results.lmaCuffAir}
            </strong>
          </div>
        </div>
      </div>

      <!-- 3. Laryngoscope Blade Card -->
      <div class="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-2">
        <div class="flex items-center gap-2 border-b border-slate-100 pb-2">
          <span class="text-lg">🔦</span>
          <h4 class="font-bold text-xs text-blue-600">شفرة منظار الحنجرة (Blade)</h4>
        </div>

        <div class="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl text-xs">
          <span class="text-slate-600 font-medium">الشفرة الموصى بها:</span>
          <strong dir="ltr" class="font-mono text-blue-800 text-sm" style="unicode-bidi: isolate;">
            ${results.bladeSize}
          </strong>
        </div>
      </div>

      <!-- 4. Oropharyngeal Airway (OPA) Card -->
      <div class="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-2">
        <div class="flex items-center gap-2 border-b border-slate-100 pb-2">
          <span class="text-lg">👄</span>
          <h4 class="font-bold text-xs text-blue-600">الأنبوب الفموي (Guedel OPA)</h4>
        </div>

        <div class="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl text-xs">
          <span class="text-slate-600 font-medium">مقاس Guedel المناسب:</span>
          <strong dir="ltr" class="font-mono text-blue-800 text-sm" style="unicode-bidi: isolate;">
            ${results.opaSize}
          </strong>
        </div>
      </div>
    </div>
  `;
}
