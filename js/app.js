/**
 * AnesthesiaX — Main Application Router & Entry Point
 * File: app.js
 *
 * Architecture:
 * Main Application Orchestrator.
 * Connects state management (store), top navigation, and view components.
 * Fully integrated with the Drug Center Triad Architecture & CDSS.
 */

import { drugsData } from './data/drugsData.js';
import { renderDrugCenterView, initDrugCenterEvents } from './components/drugCenterView.js';
import { store } from './state/store.js';
import { renderNavigation } from './components/navigation.js';
import { renderAirwayView, renderAirwayResultsHTML } from './components/airwayView.js';
import { calculateAirwayParams } from './calculators/airwayCalculator.js';
import { renderFluidView, renderFluidResultsHTML } from './components/fluidView.js';
import { calculateFluidParams } from './calculators/fluidCalculator.js';
import { renderRegionalView, renderRegionalResultsHTML, renderLastEmergencyHTML } from './components/regionalView.js';
import { calculateRegionalParams, localAnestheticsDB } from './calculators/regionalCalculator.js';
import { renderInfusionView } from './components/infusionView.js';
import { renderVaporizerView, initVaporizerEvents } from './components/vaporizerView.js';
import { renderPreOpRiskView, initPreOpRiskEvents } from './components/preOpRiskView.js';
import { renderAbgView, initAbgEvents } from './components/abgView.js';
import { renderEmergencyView, initEmergencyEvents } from './components/emergencyView.js';
import { renderDrugInteractionsView, initDrugInteractionsEvents } from './components/drugInteractionsView.js';

// =========================================================
// INITIALIZATION & GLOBAL HANDLERS
// =========================================================

function init() {
  window.navigateTo = (viewName) => {
    if (store && typeof store.setView === 'function') {
      store.setView(viewName);
    } else if (store && store.state) {
      store.state.currentView = viewName;
    }
    render();
  };

  window.toggleAccordion = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.classList.toggle('hidden');
    }
  };

  render();
}

// =========================================================
// MAIN ROUTER & RENDER
// =========================================================

function render() {
  const navContainer = document.getElementById('app-nav');
  const contentContainer = document.getElementById('app-content');

  const currentView = (store && store.state && store.state.currentView) ? store.state.currentView : 'dashboard';

  if (navContainer && typeof renderNavigation === 'function') {
    try {
      navContainer.innerHTML = renderNavigation(currentView);
      const backBtn = document.getElementById('btnBackToDashboard');
      if (backBtn) {
        backBtn.addEventListener('click', () => window.navigateTo('dashboard'));
      }
    } catch (e) {
      console.error('Error rendering navigation:', e);
    }
  }

  if (!contentContainer) return;

  try {
    if (currentView === 'drugCenter') {
      renderDrugCenterLayout(contentContainer);
    } else if (currentView === 'airway') {
      renderAirwayLayout(contentContainer);
    } else if (currentView === 'fluidAbl') {
      renderFluidLayout(contentContainer);
    } else if (currentView === 'regionalLast') {
      renderRegionalLayout(contentContainer);
    } else if (currentView === 'infusionTci') {
      renderInfusionLayout(contentContainer);
    } else if (currentView === 'pediatric') {
      renderPediatricLayout(contentContainer);
    } else if (currentView === 'vaporizers') {
      renderVaporizerLayout(contentContainer);
    } else if (currentView === 'preOpRisk') {
      renderPreOpRiskLayout(contentContainer);
    } else if (currentView === 'abgElectrolytes') {
      renderAbgLayout(contentContainer);
    } else if (currentView === 'emergencyProtocols') {
      renderEmergencyLayout(contentContainer);
    } else if (currentView === 'drugInteractions') {
      renderDrugInteractionsLayout(contentContainer);
    } else {
      renderDashboardView(contentContainer);
    }
  } catch (error) {
    console.error('Render view error:', error);
    renderDashboardView(contentContainer);
  }
}

// =========================================================
// DASHBOARD VIEW
// =========================================================

function renderDashboardView(container) {
  const tools = [
    { id: 'drugCenter', title: 'مركز الأدوية والسرنجات', subtitle: 'حاسبة جرعات وأحجام أدوية التخدير (مثلث التخدير)', icon: '💊', status: 'active', badge: 'جاهز للاستخدام', badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    { id: 'airway', title: 'المجرى الهوائي والأنابيب', subtitle: 'قياسات ETT, LMA, Blade, OPA', icon: '🫁', status: 'active', badge: 'جاهز للاستخدام', badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    { id: 'fluidAbl', title: 'السوائل والنزف المسموح', subtitle: 'حاسبة 4-2-1 والصيام و ABL', icon: '💧', status: 'active', badge: 'جاهز للاستخدام', badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    { id: 'regionalLast', title: 'التخدير المناطقي و LAST', subtitle: 'الحد الأقصى للسمية والإنقاذ بـ Lipid', icon: '⚡', status: 'active', badge: 'جاهز للاستخدام', badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    { id: 'infusionTci', title: 'مضخات التنقيط المستمر', subtitle: 'حساب معدلات mcg/kg/min و mg/hr', icon: '💉', status: 'active', badge: 'جاهز للاستخدام', badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    { id: 'pediatric', title: 'تخدير الأطفال الشامل', subtitle: 'حاسبة جرعات وأنابيب الأطفال', icon: '👶', status: 'active', badge: 'جاهز للاستخدام', badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    { id: 'vaporizers', title: 'تركيز الغازات الـ MAC', subtitle: 'حاسبة النسبة المئوية واستهلاك الغاز', icon: '💨', status: 'active', badge: 'جاهز للاستخدام', badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    { id: 'preOpRisk', title: 'تقييم المخاطر قبل العملية', subtitle: 'تصنيف ASA وتقييم القلب والتنفس', icon: '📋', status: 'active', badge: 'جاهز للاستخدام', badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    { id: 'abgElectrolytes', title: 'غازات الدم والأملاح', subtitle: 'تفسير ABG وتصحيح الصوديوم والبوتاسيوم', icon: '🧪', status: 'active', badge: 'جاهز للاستخدام', badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    { id: 'emergencyProtocols', title: 'بروتوكولات الطوارئ', subtitle: 'خوارزميات ACLS والحساسية والملايجنانت', icon: '🚨', status: 'active', badge: 'جاهز للاستخدام', badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    { id: 'drugInteractions', title: 'التداخلات الدوائية', subtitle: 'دليل الأدوية المزمنة والتفاعلات حول الجراحة', icon: '📚', status: 'active', badge: 'جاهز للاستخدام', badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300' }
  ];

  container.innerHTML = `
    <div class="space-y-4 max-w-2xl mx-auto" dir="rtl">
      <div class="p-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl shadow-md">
        <h2 class="text-lg font-bold">مرحباً بك في AnesthesiaX 👋</h2>
        <p class="text-xs opacity-90 mt-1">المنصة السريرية الشاملة لأدوات وحاسبات التخدير المتخصصة.</p>
      </div>

      <div class="p-3 bg-amber-50 border-r-4 border-amber-500 text-amber-900 text-xs rounded-l-xl">
        <div class="font-bold flex items-center gap-1 mb-0.5">
          <span>⚠️</span> <span>تنبيه سلامة سريري (CLINICAL NOTICE)</span>
        </div>
        <p class="opacity-90">جميع الحاسبات مرجع استشاري وتعليمي. يجب دائماً التأكد من تركيز الأمبول والبروتوكول المحلي قبل الإعطاء.</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        ${tools.map(tool => `
          <div 
            data-tool-id="${tool.id}"
            class="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm transition-all duration-200 ${tool.status === 'active' ? 'cursor-pointer hover:border-blue-500 hover:shadow-md ring-2 ring-blue-500/20' : 'opacity-75'}"
          >
            <div class="flex justify-between items-start mb-2">
              <span class="text-2xl">${tool.icon}</span>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-md border ${tool.badgeClass}">${tool.badge}</span>
            </div>
            <h3 class="font-bold text-sm text-slate-800">${tool.title}</h3>
            <p class="text-xs text-slate-500 mt-1">${tool.subtitle}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // Dynamic Routing Bindings
  const toolIds = ['drugCenter', 'airway', 'fluidAbl', 'regionalLast', 'infusionTci', 'pediatric', 'vaporizers', 'preOpRisk', 'abgElectrolytes', 'emergencyProtocols', 'drugInteractions'];
  toolIds.forEach(id => {
    const card = container.querySelector(`[data-tool-id="${id}"]`);
    if (card) {
      card.addEventListener('click', () => window.navigateTo(id));
    }
  });
}

// =========================================================
// DRUG CENTER LAYOUT (DELEGATED TO MODULAR COMPONENT)
// =========================================================

function renderDrugCenterLayout(container) {
  if (typeof renderDrugCenterView === 'function') {
    container.innerHTML = renderDrugCenterView();
    if (typeof initDrugCenterEvents === 'function') {
      initDrugCenterEvents();
    }
  }
}

// =========================================================
// DRUG INTERACTIONS CALCULATOR LAYOUT
// =========================================================

function renderDrugInteractionsLayout(container) {
  if (typeof renderDrugInteractionsView === 'function') {
    container.innerHTML = renderDrugInteractionsView();
    if (typeof initDrugInteractionsEvents === 'function') {
      initDrugInteractionsEvents();
    }
  }
}

// =========================================================
// EMERGENCY PROTOCOLS CALCULATOR LAYOUT
// =========================================================

function renderEmergencyLayout(container) {
  if (typeof renderEmergencyView === 'function') {
    container.innerHTML = renderEmergencyView();
    if (typeof initEmergencyEvents === 'function') {
      initEmergencyEvents();
    }
  }
}

// =========================================================
// ABG & ELECTROLYTES CALCULATOR LAYOUT
// =========================================================

function renderAbgLayout(container) {
  if (typeof renderAbgView === 'function') {
    container.innerHTML = renderAbgView();
    if (typeof initAbgEvents === 'function') {
      initAbgEvents();
    }
  }
}

// =========================================================
// PREOPERATIVE RISK CALCULATOR LAYOUT
// =========================================================

function renderPreOpRiskLayout(container) {
  if (typeof renderPreOpRiskView === 'function') {
    container.innerHTML = renderPreOpRiskView();
    if (typeof initPreOpRiskEvents === 'function') {
      initPreOpRiskEvents();
    }
  }
}

// =========================================================
// VAPORIZERS & MAC CALCULATOR LAYOUT
// =========================================================

function renderVaporizerLayout(container) {
  if (typeof renderVaporizerView === 'function') {
    container.innerHTML = renderVaporizerView();
    if (typeof initVaporizerEvents === 'function') {
      initVaporizerEvents();
    }
  }
}

// =========================================================
// PEDIATRIC CALCULATOR LAYOUT (Protected Dynamic Import)
// =========================================================

async function renderPediatricLayout(container) {
  container.innerHTML = `
    <div class="flex flex-col items-center justify-center py-12 text-slate-500 gap-3" dir="rtl">
      <div class="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p class="text-xs font-semibold">جاري تحميل حاسبة الأطفال...</p>
    </div>
  `;

  try {
    const module = await import('./components/pedsDashboard.js');
    const PedsDashboardClass = module.PedsDashboard || module.default;

    if (PedsDashboardClass) {
      const pedsApp = new PedsDashboardClass('app-content');
      pedsApp.init();
    } else {
      throw new Error('لم يتم العثور على كلاس PedsDashboard داخل الملف');
    }
  } catch (error) {
    console.error('Pediatric Module Load Error:', error);
    container.innerHTML = `
      <div class="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs space-y-2 dir-rtl text-right max-w-2xl mx-auto">
        <h3 class="font-bold text-sm text-rose-900">⚠️ تعذر تحميل أداة الأطفال</h3>
        <p class="text-slate-600">حدث خطأ أثناء تحميل الملفات الفرعية للأداة:</p>
        <code class="block p-2 bg-white rounded border border-rose-200 font-mono text-[11px] dir-ltr text-left">${error.message}</code>
        <button onclick="window.navigateTo('dashboard')" class="mt-2 px-3 py-1.5 bg-rose-600 text-white rounded-lg font-bold text-xs">العودة للوحة الرئيسية</button>
      </div>
    `;
  }
}

// =========================================================
// CONTINUOUS INFUSION CALCULATOR LAYOUT
// =========================================================

function renderInfusionLayout(container) {
  if (typeof renderInfusionView === 'function') {
    container.innerHTML = renderInfusionView();
  }
}

// =========================================================
// REGIONAL ANESTHESIA & LAST LAYOUT
// =========================================================

function renderRegionalLayout(container) {
  if (typeof renderRegionalView === 'function') {
    container.innerHTML = renderRegionalView();
  }

  const weightInput = document.getElementById('regionalWeightInput');
  const drugSelect = document.getElementById('regionalDrugSelect');
  const btnEpiFalse = document.getElementById('btnEpiFalse');
  const btnEpiTrue = document.getElementById('btnEpiTrue');
  const concSelect = document.getElementById('regionalConcSelect');

  const updateResults = () => {
    const regResultsContainer = document.getElementById('regionalResultsContainer');
    const lastContainer = document.getElementById('lastEmergencyContainer');

    const drugKey = (store && store.state && store.state.regionalDrug) || 'bupivacaine';
    const drugObj = (localAnestheticsDB && localAnestheticsDB[drugKey]) ? localAnestheticsDB[drugKey] : localAnestheticsDB?.bupivacaine;

    if (typeof calculateRegionalParams === 'function') {
      const res = calculateRegionalParams({
        weightKg: store.state.patientWeight || 0,
        drugKey: store.state.regionalDrug,
        withEpinephrine: store.state.regionalWithEpi,
        concentrationMgMl: store.state.regionalConc || (drugObj ? drugObj.defaultConcentrationMgMl : 0)
      });

      if (regResultsContainer && typeof renderRegionalResultsHTML === 'function') {
        regResultsContainer.innerHTML = renderRegionalResultsHTML(res);
      }
      if (lastContainer && typeof renderLastEmergencyHTML === 'function') {
        lastContainer.innerHTML = renderLastEmergencyHTML(res);
      }
    }
  };

  if (weightInput) {
    weightInput.addEventListener('input', (e) => {
      store.setWeight(parseFloat(e.target.value) || 0);
      updateResults();
    });
  }

  if (drugSelect) {
    drugSelect.addEventListener('change', (e) => {
      store.state.regionalDrug = e.target.value;
      const drugObj = localAnestheticsDB ? localAnestheticsDB[e.target.value] : null;
      store.state.regionalConc = drugObj ? drugObj.defaultConcentrationMgMl : 0;
      renderRegionalLayout(container);
    });
  }

  if (btnEpiFalse) {
    btnEpiFalse.addEventListener('click', () => {
      store.state.regionalWithEpi = false;
      renderRegionalLayout(container);
    });
  }

  if (btnEpiTrue) {
    btnEpiTrue.addEventListener('click', () => {
      store.state.regionalWithEpi = true;
      renderRegionalLayout(container);
    });
  }

  if (concSelect) {
    concSelect.addEventListener('change', (e) => {
      store.state.regionalConc = parseFloat(e.target.value) || 0;
      updateResults();
    });
  }
}

// =========================================================
// AIRWAY CALCULATOR LAYOUT
// =========================================================

function renderAirwayLayout(container) {
  if (typeof renderAirwayView === 'function') {
    container.innerHTML = renderAirwayView();
  }

  const ageInput = document.getElementById('airwayAgeInput');
  const weightInput = document.getElementById('airwayWeightInput');
  const btnMale = document.getElementById('btnGenderMale');
  const btnFemale = document.getElementById('btnGenderFemale');

  const updateResults = () => {
    const resultsContainer = document.getElementById('airwayResultsContainer');
    if (resultsContainer && typeof calculateAirwayParams === 'function' && typeof renderAirwayResultsHTML === 'function') {
      const res = calculateAirwayParams(store.state.patientAge, store.state.patientWeight, store.state.patientGender);
      resultsContainer.innerHTML = renderAirwayResultsHTML(res);
    }
  };

  if (ageInput) {
    ageInput.addEventListener('input', (e) => {
      store.setAge(e.target.value);
      updateResults();
    });
  }

  if (weightInput) {
    weightInput.addEventListener('input', (e) => {
      store.setWeight(parseFloat(e.target.value) || 0);
      updateResults();
    });
  }

  if (btnMale) {
    btnMale.addEventListener('click', () => {
      store.setGender('male');
      renderAirwayLayout(container);
    });
  }

  if (btnFemale) {
    btnFemale.addEventListener('click', () => {
      store.setGender('female');
      renderAirwayLayout(container);
    });
  }
}

// =========================================================
// FLUID & ABL CALCULATOR LAYOUT
// =========================================================

function renderFluidLayout(container) {
  if (typeof renderFluidView === 'function') {
    container.innerHTML = renderFluidView();
  }

  const weightInput = document.getElementById('fluidWeightInput');
  const fastingInput = document.getElementById('fluidFastingInput');
  const btnStrategyEras = document.getElementById('btnStrategyEras');
  const btnStrategyTrad = document.getElementById('btnStrategyTrad');
  const traumaSelect = document.getElementById('fluidTraumaSelect');
  const ebvGroupSelect = document.getElementById('fluidEbvGroupSelect');
  const hbInitInput = document.getElementById('fluidHbInitInput');
  const hbTargInput = document.getElementById('fluidHbTargInput');
  const lossInput = document.getElementById('fluidLossInput');

  const updateResults = () => {
    const resultsContainer = document.getElementById('fluidResultsContainer');
    if (resultsContainer && typeof calculateFluidParams === 'function' && typeof renderFluidResultsHTML === 'function') {
      const res = calculateFluidParams({
        weightKg: store.state.patientWeight,
        fastingHours: store.state.fastingHours,
        strategy: store.state.fluidStrategy,
        surgicalTrauma: store.state.surgicalTrauma,
        ageGroup: store.state.ebvAgeGroup,
        hbInitial: store.state.hbInitial,
        hbTarget: store.state.hbTarget,
        currentBloodLoss: store.state.currentBloodLoss
      });
      resultsContainer.innerHTML = renderFluidResultsHTML(res);
    }
  };

  if (weightInput) {
    weightInput.addEventListener('input', (e) => {
      store.setWeight(parseFloat(e.target.value) || 0);
      updateResults();
    });
  }

  if (fastingInput) {
    fastingInput.addEventListener('input', (e) => {
      store.state.fastingHours = parseFloat(e.target.value) || 0;
      updateResults();
    });
  }

  if (btnStrategyEras) {
    btnStrategyEras.addEventListener('click', () => {
      store.state.fluidStrategy = 'eras';
      renderFluidLayout(container);
    });
  }

  if (btnStrategyTrad) {
    btnStrategyTrad.addEventListener('click', () => {
      store.state.fluidStrategy = 'traditional';
      renderFluidLayout(container);
    });
  }

  if (traumaSelect) {
    traumaSelect.addEventListener('change', (e) => {
      store.state.surgicalTrauma = e.target.value;
      updateResults();
    });
  }

  if (ebvGroupSelect) {
    ebvGroupSelect.addEventListener('change', (e) => {
      store.state.ebvAgeGroup = e.target.value;
      updateResults();
    });
  }

  if (hbInitInput) {
    hbInitInput.addEventListener('input', (e) => {
      store.state.hbInitial = e.target.value;
      updateResults();
    });
  }

  if (hbTargInput) {
    hbTargInput.addEventListener('input', (e) => {
      store.state.hbTarget = e.target.value;
      updateResults();
    });
  }

  if (lossInput) {
    lossInput.addEventListener('input', (e) => {
      store.state.currentBloodLoss = e.target.value;
      updateResults();
    });
  }
}

// =========================================================
// APPLICATION BOOTSTRAP
// =========================================================

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
