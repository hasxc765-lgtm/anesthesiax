// 1. وظيفة التبديل الفوري للوضع المظلم وحفظه
if (typeof window !== 'undefined' && !window.toggleDarkMode) {
  window.toggleDarkMode = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    const icon = document.getElementById('darkIcon');
    if (icon) icon.textContent = isDark ? '☀️' : '🌙';
  };
}

// 2. رابط قاعدة بيانات Firebase الخاصة بمشروعك
const FIREBASE_DB_URL = "https://anesthesiax-15012-default-rtdb.asia-southeast1.firebasedatabase.app";

// 3. دالة جلب وزيادة عداد الزوار الحقيقي سحابياً ومباشراً
window.updateRealVisitors = async function() {
  const countElements = document.querySelectorAll('.live-visitor-count');
  
  const cached = localStorage.getItem('anesthesiax_real_visitors');
  if (cached) {
    countElements.forEach(el => el.textContent = cached);
  }

  try {
    const getRes = await fetch(`${FIREBASE_DB_URL}/visitors.json`);
    let currentCount = 0;
    if (getRes.ok) {
      const data = await getRes.json();
      currentCount = (typeof data === 'number' && !isNaN(data)) ? data : 0;
    }

    const newCount = currentCount + 1;
    await fetch(`${FIREBASE_DB_URL}/visitors.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCount)
    });

    const formatted = Number(newCount).toLocaleString('en-US');
    localStorage.setItem('anesthesiax_real_visitors', formatted);
    countElements.forEach(el => el.textContent = formatted);
  } catch (err) {
    // وضع الأوفلاين لصالات العمليات
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
  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  const initialVisitors = (typeof localStorage !== 'undefined' && localStorage.getItem('anesthesiax_real_visitors')) || '1';

  return `
    <header class="w-full max-w-full mx-auto flex justify-between items-center py-2 px-1 border-b border-slate-200 dark:border-slate-800 mb-3 transition-colors duration-200 select-none overflow-hidden" dir="rtl">
      
      <div class="flex items-center gap-1.5 shrink-0">
        ${!isDashboard ? `
          <button id="btnBackToDashboard" class="px-2 py-1 bg-blue-50 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-slate-700 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-bold transition flex items-center gap-1 border border-blue-200 dark:border-slate-700 active:scale-95 shrink-0">
            <span>➔</span> <span>الرئيسية</span>
          </button>
        ` : ''}
        <div class="shrink-0">
          <h1 class="text-base sm:text-lg font-bold text-blue-600 dark:text-indigo-400 flex items-center gap-0.5 leading-none">
            AnesthesiaX 💉
          </h1>
        </div>
      </div>

      <div class="flex items-center gap-1 shrink-0">
        
        <a 
          href="https://instagram.com/u8cb" 
          target="_blank" 
          rel="noopener noreferrer"
          class="flex items-center gap-1 text-[10px] bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 dark:from-purple-950/50 dark:via-pink-950/50 dark:to-amber-950/50 text-pink-700 dark:text-pink-300 font-bold px-1.5 py-1 rounded-lg border border-pink-200 dark:border-pink-800/50 hover:opacity-90 transition active:scale-95 shrink-0 shadow-sm"
          title="حساب المطور @u8cb"
        >
          <svg class="w-3.5 h-3.5 fill-current text-pink-600 dark:text-pink-400 shrink-0" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          <span class="font-sans">@u8cb</span>
        </a>

        <div class="flex items-center gap-0.5 text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold px-1.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm shrink-0" title="عدد الزيارات الحقيقية للمنصة">
          <span>👥</span>
          <span class="live-visitor-count font-mono">${initialVisitors}</span>
        </div>

        <button 
          id="btnToggleDarkMode" 
          type="button" 
          onclick="window.toggleDarkMode()"
          class="flex items-center justify-center text-xs bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-700 dark:text-amber-300 font-bold w-7 h-7 rounded-lg border border-amber-200 dark:border-amber-800/50 transition cursor-pointer active:scale-95 shadow-sm shrink-0"
          title="تبديل الوضع المظلم والمضيء"
        >
          <span id="darkIcon">${isDark ? '☀️' : '🌙'}</span>
        </button>
      </div>
    </header>
  `;
}
