/**
 * Main Application Entry Point (App.js)
 * Phase 6 Integration - Instant Execution Fix
 */

import { store } from './js/state/store.js';
import { renderNavigation } from './js/components/navigation.js';
import { renderDoseView } from './js/components/doseView.js';
import { renderDrugCenterView } from './js/components/drugCenterView.js';
import { renderAirwayView } from './js/components/airwayView.js';
import { renderFluidView } from './js/components/fluidView.js';
import { renderRegionalView } from './js/components/regionalView.js';
import { renderInfusionView } from './js/components/infusionView.js';

function renderApp() {
  const appContainer = document.getElementById('app');
  if (!appContainer) return;

  const currentView = store.state.currentView || 'dose';

  let viewHTML = '';
  switch (currentView) {
    case 'dose':
      viewHTML = renderDoseView();
      break;
    case 'drugs':
      viewHTML = renderDrugCenterView();
      break;
    case 'airway':
      viewHTML = renderAirwayView();
      break;
    case 'fluid':
      viewHTML = renderFluidView();
      break;
    case 'regional':
      viewHTML = renderRegionalView();
      break;
    case 'infusion':
      viewHTML = renderInfusionView();
      break;
    default:
      viewHTML = renderDoseView();
  }

  appContainer.innerHTML = `
    ${renderNavigation()}
    <main class="p-3 sm:p-4 pb-20">
      ${viewHTML}
    </main>
  `;

  attachNavigationEvents();
}

function attachNavigationEvents() {
  const navButtons = document.querySelectorAll('nav button[data-route]');
  navButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const route = e.currentTarget.getAttribute('data-route');
      if (route && store.state.currentView !== route) {
        store.setState({ currentView: route });
      }
    });
  });
}

// Subscribe to store changes to re-render
store.subscribe(renderApp);

// التشغيل الفوري المباشر لتفادي إفلات حدث DOMContentLoaded في ES Modules
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  renderApp();
}
