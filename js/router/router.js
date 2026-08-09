import { store } from '../state/store.js';
import { renderDashboard } from '../components/dashboardView.js';

export function renderCurrentView(renderDrugCenterFn) {
  const container = document.getElementById('app-content');
  const navContainer = document.getElementById('app-nav');
  const currentView = store.state.currentView;

  if (!container) return;

  if (currentView === 'dashboard') {
    container.innerHTML = renderDashboard();
    
    // ربط الضغط على بطاقة مركز الأدوية
    const drugCenterCard = container.querySelector('[data-tool-id="drugCenter"]');
    if (drugCenterCard) {
      drugCenterCard.addEventListener('click', () => {
        store.setView('drugCenter');
        renderCurrentView(renderDrugCenterFn);
      });
    }
  } else if (currentView === 'drugCenter') {
    container.innerHTML = renderDrugCenterFn();
  }
}
