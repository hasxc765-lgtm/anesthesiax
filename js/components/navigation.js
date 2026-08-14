// 1. وظيفة التبديل الفوري للوضع المظلم وحفظه
if (typeof window !== 'undefined' && !window.toggleDarkMode) {
  window.toggleDarkMode = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    const icon = document.getElementById('darkIcon');
    const text = document.getElementById('darkText');
    if (icon) icon.textContent = isDark ? '☀️' : '🌙';
    if (text) text.textContent = isDark ? 'المضيء' : 'المظلم';
  };
}

// 2. رابط قاعدة بيانات Firebase الخاصة بمشروعك
const FIREBASE_DB_URL = "https://anesthesiax-15012-default-rtdb.asia-southeast1.firebasedatabase.app";

// 3. دالة جلب وزيادة عداد الزوار الحقيقي سحابياً ومباشراً
window.updateRealVisitors = async function() {
  const countElements = document.querySelectorAll('.live-visitor-count');
  
  // عرض آخر رقم مسجل في ذاكرة الجهاز فوراً
  const cached = localStorage.getItem('anesthesiax_real_visitors');
  if (cached) {
    countElements.forEach(el => el.textContent = cached);
  }

  try {
    // جلب الرقم الحالي من السيرفر
    const getRes = await fetch(`${FIREBASE_DB_URL}/visitors.json`);
    let currentCount = 0;
    if (getRes.ok) {
      const data = await getRes.json();
      currentCount = (typeof data === 'number' && !isNaN(data)) ? data : 0;
    }

    // زيادة العداد العالمي +1 وإرساله للقاعدة السحابية
    const newCount = currentCount + 1;
    await fetch(`${FIREBASE_DB_URL}/visitors.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCount)
    });

    // تحديث الشاشة وتخزين الرقم الحقيقي في ذاكرة الهاتف
    const formatted = Number(newCount).toLocaleString('en-US');
    localStorage.setItem('anesthesiax_real_visitors', formatted);
    countElements.forEach(el => el.textContent = formatted);
  } catch (err) {
    // في حال العمل أوفلاين في صالة العمليات: يتم الحفاظ على العمل بدون أي أخطاء
  }
};

// تسجيل الزيارة فور تحميل الصفحة
if (typeof window !== 'undefined' && !window._axVisitorRecorded) {
  window._axVisitorRecorded = true;
  setTimeout(() => {
    if (window.updateRealVisitors) window.updateRealVisitors();
  }, 300);
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
  const initialVisitors = (typeof localStorage !== 'undefined' && localStorage.getItem('anesthesiax_real_visitors')) || '1';

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
        
        <a 
          href="https://instagram.com/u8cb" 
          target="_blank" 
          rel="noopener noreferrer"
          class="flex items-center gap-1 text-[10px] sm:text-[11px] bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 dark:from-purple-950/40 dark:via-pink-950/40 dark:to-amber-950/40 text-pink-700 dark:text-pink-300 font-bold px-2 py-1 rounded-lg border border-pink-200 dark:border-pink-800/50 hover:opacity-90 transition active:scale-95 shadow-sm"
          title="تواصل مع المطور على إنستغرام @u8cb"
        >
          <span>📸</span>
          <span class="font-sans">@u8cb</span>
        </a>

        <div class="flex items-center gap-1 text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm" title="عدد الزيارات الحقيقية للمنصة">
          <span>👥</span>
          <span class="live-visitor-count font-mono">${initialVisitors}</span>
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
