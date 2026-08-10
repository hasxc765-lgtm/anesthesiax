/**
 * Main Application Entry Point (js/app.js)
 * Safe & Dynamic Integration
 */

import { store } from './state/store.js';
import { renderNavigation } from './components/navigation.js';
import { renderAirwayView } from './components/airwayView.js';
import { renderFluidView } from './components/fluidView.js';
import { renderRegionalView } from './components/regionalView.js';
import { renderInfusionView } from './components/infusionView.js';

// استيراد آمن للشاشات التي قد تختلف أسماؤها بداخل مجلد components
let renderDoseView = () => `<div class="p-4 text-center text-slate-600 font-bold">📊 لوحة التحكم (Dose Dashboard)</div>`;
let renderDrugCenterView = () => `<div class="p-4 text-center text-slate-600 font-bold">💊 مركز الأدوية (Drug Center)</div>`;

try {
  const doseMod = await import('./components/doseView.js').catch(() => null);
  if (doseMod && doseMod.renderDoseView) renderDoseView = doseMod.renderDoseView;
} catch (e) {}

try {
  const drugMod = await import('./components/drugCenterView.js').catch(() => null);
  if (drugMod && drugMod.renderDrugCenterView) renderDrugCenterView = drugMod.renderDrugCenterView;
} catch (e) {}

function renderApp() {
  const appContainer = document.getElementById('app');
  if (!appContainer) return;

  const currentView = store?.state?.currentView || 'infusion';

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
      viewHTML = renderInfusionView();
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
      if (route && store?.state?.currentView !== route) {
        if (typeof store.setState === 'function') {
          store.setState({ currentView: route });
        } else if (store.state) {
          store.state.currentView = route;
          renderApp();
        }
      }
    });
  });
}

if (store && typeof store.subscribe === 'function') {
  store.subscribe(renderApp);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  renderApp();
}
