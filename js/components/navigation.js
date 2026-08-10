/**
 * Navigation Component (Phase 6 Integration)
 * شريط الملاحة الرئيسي للمنصة
 */

import { store } from '../state/store.js';

export function renderNavigation() {
  const currentView = store.state.currentView || 'dose';

  const navItems = [
    { id: 'dose', label: 'لوحة التحكم', icon: '📊' },
    { id: 'drugs', label: 'مركز الأدوية', icon: '💊' },
    { id: 'airway', label: 'المجرى الهوائي', icon: '🫁' },
    { id: 'fluid', label: 'السوائل والنزف', icon: '💧' },
    { id: 'regional', label: 'التخدير المناطقي', icon: '⚡' },
    { id: 'infusion', label: 'مضخات التنقيط', icon: '💉' }
  ];

  return `
    <nav class="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm" dir="rtl">
      <div class="max-w-2xl mx-auto px-2">
        <div class="flex justify-between items-center h-14 overflow-x-auto no-scrollbar gap-1 py-1">
          ${navItems.map(item => {
            const isActive = currentView === item.id;
            return `
              <button 
                data-route="${item.id}"
                class="flex flex-col items-center justify-center min-w-[62px] px-1.5 py-1 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-blue-600 text-white font-bold shadow-sm scale-[1.02]' 
                    : 'text-slate-600 hover:bg-slate-100 font-medium'
                }"
              >
                <span class="text-base leading-none mb-0.5">${item.icon}</span>
                <span class="text-[10px] whitespace-nowrap leading-tight">${item.label}</span>
              </button>
            `;
          }).join('')}
        </div>
      </div>
    </nav>
  `;
}
