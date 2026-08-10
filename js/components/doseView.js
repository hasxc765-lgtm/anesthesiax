/**
 * Dose Dashboard View Component (js/components/doseView.js)
 */

import { store } from '../state/store.js';

export function renderDoseView() {
  return `
    <div class="max-w-2xl mx-auto space-y-4" dir="rtl">
      <!-- Welcome Header -->
      <div class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-2xl shadow-sm text-center">
        <h2 class="font-bold text-base mb-1">👋 مرحباً بك في AnesthesiaX</h2>
        <p class="text-xs opacity-90">المنصة السريرية الشاملة لأدوات وحاسبات التخدير المتخصصة.</p>
      </div>

      <!-- Clinical Notice -->
      <div class="p-3 bg-amber-50 border-r-4 border-amber-500 text-amber-900 text-xs rounded-l-xl">
        <span class="font-bold">⚠️ تنبيه سلامة سريري (CLINICAL NOTICE):</span>
        <p class="opacity-90 mt-0.5">جميع الحاسبات مرجع استشاري وتعليمي. يجب دائماً التأكد من تركيز الأمبول والبروتوكول المحلي قبل الإعطاء.</p>
      </div>

      <!-- Tools Grid -->
      <div class="space-y-3">
        
        <!-- 1. Drug Center -->
        <div data-route="drugs" class="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-blue-400 cursor-pointer transition-all flex justify-between items-center">
          <div class="space-y-1">
            <span class="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-lg font-bold">جاهز للاستخدام</span>
            <h3 class="font-bold text-sm text-slate-800">مركز الأدوية والسرنجات</h3>
            <p class="text-xs text-slate-500">حاسبة جرعات وأحجام أدوية التخدير</p>
          </div>
          <span class="text-3xl">💊</span>
        </div>

        <!-- 2. Airway -->
        <div data-route="airway" class="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-blue-400 cursor-pointer transition-all flex justify-between items-center">
          <div class="space-y-1">
            <span class="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-lg font-bold">جاهز للاستخدام</span>
            <h3 class="font-bold text-sm text-slate-800">المجرى الهوائي والأناديب</h3>
            <p class="text-xs text-slate-500">قياسات ETT, LMA, Blade, OPA</p>
          </div>
          <span class="text-3xl">🫁</span>
        </div>

        <!-- 3. Fluids -->
        <div data-route="fluid" class="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-blue-400 cursor-pointer transition-all flex justify-between items-center">
          <div class="space-y-1">
            <span class="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-lg font-bold">جاهز للاستخدام</span>
            <h3 class="font-bold text-sm text-slate-800">السوائل والنزف المسموح</h3>
            <p class="text-xs text-slate-500">حاسبة 4-2-1 والصيام و ABL</p>
          </div>
          <span class="text-3xl">💧</span>
        </div>

        <!-- 4. Regional -->
        <div data-route="regional" class="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-blue-400 cursor-pointer transition-all flex justify-between items-center">
          <div class="space-y-1">
            <span class="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-lg font-bold">جاهز للاستخدام</span>
            <h3 class="font-bold text-sm text-slate-800">التخدير المناطقي و LAST</h3>
            <p class="text-xs text-slate-500">الحد الأقصى للسمية والإنقاذ بـ Lipid</p>
          </div>
          <span class="text-3xl">⚡</span>
        </div>

        <!-- 5. Continuous Infusion (ACTIVE NOW) -->
        <div data-route="infusion" class="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-blue-400 cursor-pointer transition-all flex justify-between items-center">
          <div class="space-y-1">
            <span class="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-lg font-bold">جاهز للاستخدام</span>
            <h3 class="font-bold text-sm text-slate-800">مضخات التنقيط المستمر</h3>
            <p class="text-xs text-slate-500">حساب معدلات mcg/kg/min و mg/hr ومضخات العناية</p>
          </div>
          <span class="text-3xl">💉</span>
        </div>

        <!-- Future Modules -->
        <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl opacity-60 flex justify-between items-center">
          <div class="space-y-1">
            <span class="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-lg font-bold">قريباً</span>
            <h3 class="font-bold text-sm text-slate-700">تخدير الأطفال الشامل</h3>
            <p class="text-xs text-slate-400">حاسبة جرعات وأنابيب الأطفال</p>
          </div>
          <span class="text-3xl">👶</span>
        </div>

      </div>
    </div>
  `;
}
