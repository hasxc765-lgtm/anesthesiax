export function renderNavigation(currentView) {
  const isDashboard = currentView === 'dashboard';
  let pageTitle = 'لوحة التحكم';

  if (currentView === 'drugCenter') pageTitle = 'مركز الأدوية';
  if (currentView === 'airway') pageTitle = 'المجرى الهوائي';

  return `
    <header class="max-w-2xl mx-auto flex justify-between items-center py-3 border-b border-slate-200 mb-4" dir="rtl">
      <div class="flex items-center gap-2">
        ${!isDashboard ? `
          <button id="btnBackToDashboard" class="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition flex items-center gap-1 border border-blue-200">
            <span>➔</span> <span>الرئيسية</span>
          </button>
        ` : ''}
        <div>
          <h1 class="text-xl font-bold text-blue-600 flex items-center gap-1">
            AnesthesiaX 💉
          </h1>
          <p class="text-[10px] text-slate-500">Professional Anesthesia Toolkit</p>
        </div>
      </div>
      <span class="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-1 rounded-lg border border-blue-200">
        ${pageTitle}
      </span>
    </header>
  `;
}
