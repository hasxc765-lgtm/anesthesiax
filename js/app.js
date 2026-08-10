/**
 * Main Application Entry Point (App.js)
 * Robust & Auto-Diagnosing Version
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

  try {
    const currentView = store?.state?.currentView || 'dose';

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
  } catch (err) {
    console.error('Render Error:', err);
    appContainer.innerHTML = `
      <div style="padding: 20px; color: #b91c1c; font-family: system-ui, sans-serif; text-align: center; dir: rtl;">
        <h3 style="font-weight: bold; font-size: 16px; margin-bottom: 8px;">⚠️ حدث خطأ في استدعاء إحدى الشاشات:</h3>
        <div dir="ltr" style="background: #fef2f2; border: 1px solid #fecaca; padding: 12px; border-radius: 12px; font-family: monospace; font-size: 12px; text-align: left; overflow-x: auto; white-space: pre-wrap;">
          ${err.stack || err.message || err}
        </div>
      </div>
    `;
  }
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

// Subscribe to store changes to re-render
if (store && typeof store.subscribe === 'function') {
  store.subscribe(renderApp);
}

// Immediate Execution
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  renderApp();
}
