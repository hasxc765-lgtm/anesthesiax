// 1. وظيفة التبديل الفوري للوضع المظلم وحفظه
if (typeof window !== 'undefined' && !window.toggleDarkMode) {
  window.toggleDarkMode = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    const icon = document.getElementById('darkIcon');
    const text = document.getElementById('darkText');
    if (icon) icon.textContent = isDark ? '☀️' : '🌙';
    if (text) text.textContent = isDark ? 'الوضع المضيء' : 'الوضع المظلم';
  };
}

// 2. دالة جلب وتحديث عدد الزوار الحقيقي تلقائياً وآمناً بدون أخطاء أوفلاين
async function updateVisitorCount() {
  try {
    // إظهار آخر رقم مسجل في ذاكرة الجهاز فوراً لتجنب الانتظار
    const cachedCount = localStorage.getItem('anesthesiax_visits');
    const countEl = document.getElementById('visitorCount');
    if (cachedCount && countEl) {
      countEl.textContent = cachedCount;
    }

    // إرسال نبضة سريعة لزيادة وجلب الرقم العالمي الحقيقي
    const response = await fetch('https://api.counterapi.dev/v1/anesthesiax-app-live/visits/up');
    if (!response.ok) return;
    const data = await response.json();
    
    if (data && typeof data.count === 'number') {
      const formatted = Number(data.count).toLocaleString('en-US');
      if (countEl) countEl.textContent = formatted;
      localStorage.setItem('anesthesiax_visits', formatted);
    }
  } catch (e) {
    // في حال انقطاع الإنترنت أو العمل في صالة العمليات: يتم التجاهل بهدوء تام
  }
}

// تشغيل جلب العداد تلقائياً عند فتح التطبيق
if (typeof window !== 'undefined' && !window._axCounterStarted) {
  window._axCounterStarted = true;
  setTimeout(updateVisitorCount, 400);
}

export function renderNavigation(currentView) {
  const isDashboard = currentView === 'dashboard';
  let pageTitle = 'لوحة التحكم';

  if (currentView === 'drugCenter') pageTitle = 'مركز الأدوية';
  if (currentView === 'airway') pageTitle = 'المجرى الهوائي';
  if (currentView === 'fluidAbl') pageTitle = 'السوائل والنزف المسموح';
  if (currentView === 'regionalLast') pageTitle = 'التخدير المناطقي و LAST';
  if (currentView === 'infusionTci') pageTitle = 'مضخات التنقيط';
  if (currentView === 'pediatric') pageTitle = 'تخدير الأطفال';
  if (currentView === 'vaporizers') pageTitle = 'تركيز الغازات';
  if (currentView === 'preOpRisk') pageTitle = 'تقييم المخاطر';
  if (currentView === 'abgElectrolytes') pageTitle = 'غازات الدم والأملاح';
  if (currentView === 'emergencyProtocols') pageTitle = 'بروتوكولات الطوارئ';
  if (currentView === 'drugInteractions') pageTitle = 'التداخلات الدوائية';

  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  const initialVisitors = (typeof localStorage !== 'undefined' && localStorage.getItem('anesthesiax_visits')) || '...';

  return `
    <header class="max-w-2xl mx-auto flex justify-between items-center py-3 border-b border-slate-200 dark:border-slate-800 mb-4 transition-colors duration-200" dir="rtl">
      <div class="flex items-center gap-2">
        ${!isDashboard ? `
          <button id="btnBackToDashboard" class="px-2.5 py-1.5 bg-blue-50 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-slate-700 text-blue-700 dark:text-blue-300 rounded-xl text-xs font-bold transition flex items-center gap-1 border border-blue-200 dark:border-slate-700 active:scale-95">
            <span>➔</span> <span>الرئيسية</span>
          </button>
        ` : ''}
        <div>
          <h1 class="text-xl font-bold text-blue-600 dark:text-indigo-400 flex items-center gap-1">
            AnesthesiaX 💉
          </h1>
          <p class="text-[9px] text-slate-500 dark:text-slate-400">Professional Anesthesia Toolkit</p>
        </div>
      </div>

      <div class="flex items-center gap-1.5 sm:gap-2">
        
        <div class="flex items-center gap-1 text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm" title="إجمالي الزيارات الحقيقية للمنصة">
          <span>👥</span>
          <span id="visitorCount" class="font-mono">${initialVisitors}</span>
        </div>

        <button 
          id="btnToggleDarkMode" 
          type="button" 
          onclick="window.toggleDarkMode()"
          class="flex items-center gap-1 text-[10px] sm:text-[11px] bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-700 dark:text-amber-300 font-bold px-2 sm:px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-800/50 transition cursor-pointer active:scale-95 shadow-sm"
        >
          <span id="darkIcon">${isDark ? '☀️' : '🌙'}</span>
          <span id="darkText">${isDark ? 'المضيء' : 'المظلم'}</span>
        </button>

        <span class="text-[10px] bg-blue-100 dark:bg-indigo-950 text-blue-800 dark:text-indigo-300 font-bold px-2 py-1 rounded-lg border border-blue-200 dark:border-indigo-800">
          ${pageTitle}
        </span>
      </div>
    </header>
  `;
}
