import { drugsData } from './data/drugs.js';
import { calculateDose } from './calculators/doseCalculator.js';
import { store } from './state/store.js';
import { renderNavigation } from './components/navigation.js';
import { renderAirwayView, renderAirwayResultsHTML } from './components/airwayView.js';
import { calculateAirwayParams } from './calculators/airwayCalculator.js';
import { renderFluidView, renderFluidResultsHTML } from './components/fluidView.js';
import { calculateFluidParams } from './calculators/fluidCalculator.js';
import { renderRegionalView, renderRegionalResultsHTML, renderLastEmergencyHTML } from './components/regionalView.js';
import { calculateRegionalParams, localAnestheticsDB } from './calculators/regionalCalculator.js';
import { renderInfusionView } from './components/infusionView.js';
import { PedsDashboard } from './components/pedsDashboard.js';

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

  window.setCategory = (category) => {
    if (store && typeof store.setCategory === 'function') {
      store.setCategory(category);
    } else if (store && store.state) {
      store.state.currentCategory = category;
    }
    renderCardsOnly();
  };

  window.clearWeight = () => {
    const weightInput = document.getElementById('patientWeight');
    if (weightInput) {
      weightInput.value = '';
    }
    if (store && typeof store.setWeight === 'function') {
      store.setWeight(0);
    } else if (store && store.state) {
      store.state.patientWeight = 0;
    }
    renderCardsOnly();
  };

  window.handleIndicationChange = (drugId, indicationId) => {
    if (store && typeof store.setSelectedIndication === 'function') {
      store.setSelectedIndication(drugId, indicationId);
    } else if (store && store.state) {
      store.state.selectedIndications[drugId] = indicationId;
    }
    renderCardsOnly();
  };

  window.handleConcChange = (drugId, value) => {
    if (store && typeof store.setSelectedConcentration === 'function') {
      store.setSelectedConcentration(drugId, value);
    } else if (store && store.state) {
      store.state.selectedConcentrations[drugId] = value;
    }
    if (value !== 'custom' && store && store.state && store.state.customConcentrations) {
      delete store.state.customConcentrations[drugId];
    }
    renderCardsOnly();
  };

  window.handleCustomConcInput = (drugId, value) => {
    const numericValue = parseFloat(value);
    if (Number.isFinite(numericValue) && numericValue > 0) {
      if (store && typeof store.setCustomConcentration === 'function') {
        store.setCustomConcentration(drugId, numericValue);
      } else if (store && store.state) {
        store.state.customConcentrations[drugId] = numericValue;
      }
    } else if (store && store.state && store.state.customConcentrations) {
      delete store.state.customConcentrations[drugId];
    }
    renderCardsOnly();
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
    { id: 'drugCenter', title: 'مركز الأدوية والسرنجات', subtitle: 'حاسبة جرعات وأحجام أدوية التخدير', icon: '💊', status: 'active', badge: 'جاهز للاستخدام', badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    { id: 'airway', title: 'المجرى الهوائي والأنابيب', subtitle: 'قياسات ETT, LMA, Blade, OPA', icon: '🫁', status: 'active', badge: 'جاهز للاستخدام', badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    { id: 'fluidAbl', title: 'السوائل والنزف المسموح', subtitle: 'حاسبة 4-2-1 والصيام و ABL', icon: '💧', status: 'active', badge: 'جاهز للاستخدام', badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    { id: 'regionalLast', title: 'التخدير المناطقي و LAST', subtitle: 'الحد الأقصى للسمية والإنقاذ بـ Lipid', icon: '⚡', status: 'active', badge: 'جاهز للاستخدام', badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    { id: 'infusionTci', title: 'مضخات التنقيط المستمر', subtitle: 'حساب معدلات mcg/kg/min و mg/hr', icon: '💉', status: 'active', badge: 'جاهز للاستخدام', badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    { id: 'pediatric', title: 'تخدير الأطفال الشامل', subtitle: 'حاسبة جرعات وأنابيب الأطفال', icon: '👶', status: 'active', badge: 'جاهز للاستخدام', badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    { id: 'vaporizers', title: 'تركيز الغازات الـ MAC', subtitle: 'حاسبة النسبة المئوية واستهلاك الغاز', icon: '💨', status: 'coming_soon', badge: 'قريباً', badgeClass: 'bg-slate-100 text-slate-600 border-slate-200' },
    { id: 'preOpRisk', title: 'تقييم المخاطر قبل العملية', subtitle: 'تصنيف ASA وتقييم القلب والتنفس', icon: '📋', status: 'coming_soon', badge: 'قريباً', badgeClass: 'bg-slate-100 text-slate-600 border-slate-200' },
    { id: 'abgElectrolytes', title: 'غازات الدم والأملاح', subtitle: 'تفسير ABG وتصحيح الصوديوم والبوتاسيوم', icon: '🧪', status: 'coming_soon', badge: 'قريباً', badgeClass: 'bg-slate-100 text-slate-600 border-slate-200' },
    { id: 'emergencyProtocols', title: 'بروتوكولات الطوارئ', subtitle: 'خوارزميات ACLS والحساسية والملايجنانت', icon: '🚨', status: 'coming_soon', badge: 'قريباً', badgeClass: 'bg-slate-100 text-slate-600 border-slate-200' },
    { id: 'drugInteractions', title: 'التداخلات الدوائية', subtitle: 'دليل الأدوية المزمنة والتفاعلات', icon: '📚', status: 'coming_soon', badge: 'قريباً', badgeClass: 'bg-slate-100 text-slate-600 border-slate-200' }
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
  const toolIds = ['drugCenter', 'airway', 'fluidAbl', 'regionalLast', 'infusionTci', 'pediatric'];
  toolIds.forEach(id => {
    const card = container.querySelector(`[data-tool-id="${id}"]`);
    if (card) {
      card.addEventListener('click', () => window.navigateTo(id));
    }
  });
}

// =========================================================
// PEDIATRIC CALCULATOR LAYOUT
// =========================================================

function renderPediatricLayout(container) {
  if (typeof PedsDashboard === 'function') {
    const pedsApp = new PedsDashboard('app-content');
    pedsApp.init();
  } else {
    container.innerHTML = `<div class="p-4 text-center text-rose-600 font-bold">⚠️ تعذر تحميل وحدة الأطفال</div>`;
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
// DRUG CENTER LAYOUT
// =========================================================

function renderDrugCenterLayout(container) {
  const savedWeight = (store && store.state && store.state.patientWeight) ? store.state.patientWeight : '';
  const savedSearch = (store && store.state && store.state.searchQuery) ? store.state.searchQuery : '';

  container.innerHTML = `
    <div class="max-w-2xl mx-auto space-y-3" dir="rtl">
      <div class="flex justify-between items-center bg-blue-600 text-white p-3 rounded-2xl shadow-sm">
        <div class="flex items-center gap-2">
          <span class="text-xl">💊</span>
          <div>
            <h2 class="font-bold text-sm">مركز الأدوية والسرنجات</h2>
            <p class="text-[10px] opacity-80">حساب الجرعات والأحجام والتركيزات</p>
          </div>
        </div>
      </div>

      <section class="p-4 bg-blue-600 text-white rounded-2xl shadow-md space-y-2">
        <label class="block text-xs font-semibold">⚖️ أدخل وزن المريض لحساب الجرعة والحجم تلقائياً:</label>
        <div class="flex gap-2">
          <input 
            type="number" 
            id="patientWeight" 
            value="${savedWeight}"
            placeholder="الوزن بـ (kg) مثل: 70" 
            dir="ltr"
            style="color: #000000 !important; background-color: #ffffff !important;"
            class="w-full p-3 rounded-xl text-black font-bold text-center text-base focus:outline-none"
          >
          <button onclick="clearWeight()" class="px-4 bg-blue-800 hover:bg-blue-900 text-xs rounded-xl font-bold transition">مسح</button>
        </div>
      </section>

      <section class="space-y-3">
        <input 
          type="text" 
          id="searchInput" 
          value="${savedSearch}"
          placeholder="🔍 ابحث عن دواء (Propofol, Ketamine, Ephedrine)..." 
          style="color: #000000 !important; background-color: #ffffff !important;"
          class="w-full p-3.5 rounded-xl border-2 border-blue-500 text-black shadow-sm focus:outline-none text-sm"
        >

        <div class="flex gap-2 overflow-x-auto pb-2 text-xs" id="categoryButtons">
          ${['All', 'Induction', 'Muscle Relaxant', 'Vasopressor', 'Opioid', 'Sedative', 'Anticholinergic', 'Reversal'].map(cat => `
            <button 
              onclick="setCategory('${cat}')" 
              data-cat="${cat}" 
              class="cat-btn px-3 py-1.5 rounded-lg border text-xs font-semibold whitespace-nowrap transition ${(store && store.state && store.state.currentCategory === cat) ? 'bg-blue-600 text-white border-blue-600 active' : 'bg-white text-slate-700 border-slate-200'}"
            >
              ${cat === 'All' ? 'الكل' : cat}
            </button>
          `).join('')}
        </div>
      </section>

      <main class="space-y-4" id="drugsCardsContainer"></main>
    </div>
  `;

  const weightInput = document.getElementById('patientWeight');
  const searchInput = document.getElementById('searchInput');

  if (weightInput) {
    weightInput.addEventListener('input', (e) => {
      store.setWeight(parseFloat(e.target.value) || 0);
      renderCardsOnly();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      store.setSearchQuery(e.target.value);
      renderCardsOnly();
    });
  }

  renderCardsOnly();
}

// =========================================================
// DRUG CARDS RENDER
// =========================================================

function renderCardsOnly() {
  const container = document.getElementById('drugsCardsContainer');
  if (!container) return;

  if (!Array.isArray(drugsData)) {
    container.innerHTML = `<div class="text-center py-8 text-rose-500 font-semibold">⚠️ بيانات الأدوية غير متوفرة</div>`;
    return;
  }

  const weight = store.state.patientWeight || 0;
  const searchValue = (store.state.searchQuery || '').toLowerCase().trim();

  const filteredDrugs = drugsData.filter((drug) => {
    const categoryMatch = store.state.currentCategory === 'All' || drug.category === store.state.currentCategory;
    if (!categoryMatch) return false;
    if (!searchValue) return true;

    const nameMatch = drug.name?.toLowerCase().includes(searchValue);
    const arabicNameMatch = drug.arabicName?.toLowerCase().includes(searchValue);
    const keywordMatch = Array.isArray(drug.searchKeywords) && drug.searchKeywords.some((keyword) => String(keyword).toLowerCase().includes(searchValue));

    return nameMatch || arabicNameMatch || keywordMatch;
  });

  if (filteredDrugs.length === 0) {
    container.innerHTML = `
      <div class="text-center py-8 px-4 text-slate-400 font-semibold bg-white rounded-2xl border border-slate-200">
        🔍 لا توجد أدوية مطابقة للبحث
      </div>
    `;
    return;
  }

  container.innerHTML = filteredDrugs.map((drug) => renderDrugCard(drug, weight)).join('');
}

function renderDrugCard(drug, weight) {
  if (!drug || !drug.id) return '';

  const indications = Array.isArray(drug.indications) ? drug.indications : [];
  const concConfig = drug.concentrationConfig || { defaultUnit: 'mg/mL', customAllowed: false, availableConcentrations: [] };
  const availableConcentrations = Array.isArray(concConfig.availableConcentrations) ? concConfig.availableConcentrations : [];

  if (!store.state.selectedIndications[drug.id] && indications.length > 0) {
    store.state.selectedIndications[drug.id] = indications[0].id;
  }

  const activeIndicationId = store.state.selectedIndications[drug.id];
  const activeIndication = indications.find((indication) => indication.id === activeIndicationId) || indications[0];

  if (!activeIndication) return '';

  const defaultConcentration = availableConcentrations.find((c) => c.isDefault) || availableConcentrations[0];

  if (store.state.selectedConcentrations[drug.id] === undefined) {
    store.state.selectedConcentrations[drug.id] = defaultConcentration ? String(defaultConcentration.value) : '';
  }

  const selectedConcentration = store.state.selectedConcentrations[drug.id];

  let currentConcentration = 0;
  let isCustom = false;

  if (selectedConcentration === 'custom') {
    isCustom = true;
    currentConcentration = store.state.customConcentrations[drug.id] || 0;
  } else {
    const parsed = parseFloat(selectedConcentration);
    if (Number.isFinite(parsed)) {
      currentConcentration = parsed;
    }
  }

  let calculationHTML = '';

  if (weight > 0 && typeof calculateDose === 'function') {
    const result = calculateDose(
      weight,
      activeIndication,
      currentConcentration,
      concConfig.defaultUnit,
      concConfig,
      isCustom
    );

    if (result && result.isValid) {
      const doseRange = result.isFixed && result.doseMin === result.doseMax
        ? `${result.doseMin} ${result.doseUnit}`
        : `${result.doseMin} - ${result.doseMax} ${result.doseUnit}`;

      const volumeRange = result.volMin === result.volMax
        ? `${result.volMin} mL`
        : `${result.volMin} - ${result.volMax} mL`;

      calculationHTML = `
        <div class="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1.5 text-xs">
          <div class="font-bold text-blue-900 flex justify-between items-center gap-2">
            <span>🎯 الجرعة المحسوبة (${weight} kg):</span>
            <span dir="ltr" class="text-left font-mono font-bold text-blue-800" style="unicode-bidi: isolate;">
              ${doseRange}
            </span>
          </div>

          <div class="font-bold text-emerald-700 flex justify-between items-center gap-2 border-t border-blue-200/60 pt-1.5">
            <span>💉 حجم السرنجة المطلوب:</span>
            <span dir="ltr" class="text-left font-mono font-bold text-emerald-700" style="unicode-bidi: isolate;">
              ${volumeRange}
            </span>
          </div>

          ${result.isCapped ? `
            <div class="text-[10px] text-amber-700 font-semibold mt-1">
              ⚠️ تم تطبيق الحد الأقصى للجرعة
              <span dir="ltr" class="font-mono">(${result.maxDoseLimit} ${result.doseUnit})</span>
            </div>
          ` : ''}
        </div>
      `;
    } else if (result && result.error) {
      calculationHTML = `
        <div class="mt-2 text-xs text-rose-600 font-semibold p-2.5 bg-rose-50 border border-rose-200 rounded-lg">
          ⚠️ ${result.error}
        </div>
      `;
    }
  }

  const isHighAlert = drug.safetyProfile?.isHighAlert === true;
  const alertBadge = isHighAlert ? `
    <span dir="ltr" class="px-2 py-0.5 text-[10px] font-bold bg-rose-100 text-rose-800 rounded-md border border-rose-300 inline-flex items-center gap-1">
      ⚠️ HIGH ALERT
    </span>
  ` : '';

  let indicationsHTML = '';

  if (indications.length > 1) {
    indicationsHTML = `
      <div class="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs my-2 gap-2">
        <span class="font-bold text-slate-700">الاستطباب (Indication):</span>
        <select onchange="handleIndicationChange('${drug.id}', this.value)" class="p-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold max-w-[60%] text-slate-900 focus:outline-none">
          ${indications.map((i) => `<option value="${i.id}" ${i.id === activeIndication.id ? 'selected' : ''}>${i.title}</option>`).join('')}
        </select>
      </div>
    `;
  } else {
    indicationsHTML = `
      <div class="text-xs text-slate-600 font-semibold mb-1">
        الاستطباب: <span class="text-slate-900">${activeIndication.title}</span>
      </div>
    `;
  }

  const customValue = store.state.customConcentrations[drug.id] ?? '';
  const customVisible = selectedConcentration === 'custom';

  const dilutionHTML = Array.isArray(drug.dilutions) && drug.dilutions.length > 0 ? `
    <p>
      <strong class="text-slate-900">التخفيف:</strong>
      <span class="inline-block" dir="ltr" style="unicode-bidi: isolate;">${drug.dilutions[0].instructions}</span>
    </p>
  ` : '';

  const warnings = Array.isArray(drug.clinicalDetails?.warnings) ? drug.clinicalDetails.warnings : [];
  const contraindications = Array.isArray(drug.clinicalDetails?.contraindications) ? drug.clinicalDetails.contraindications : [];
  const references = Array.isArray(drug.references) ? drug.references : [];

  const referencesHTML = references.length > 0
    ? references.map((r) => `${r.source} (${r.topic})`).join(' • ')
    : 'لا توجد مراجع مسجلة';

  return `
    <article class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
      <div class="flex justify-between items-start gap-2">
        <div>
          <div class="flex items-center gap-2 flex-wrap">
            <h3 class="font-bold text-lg text-blue-600">${drug.name}</h3>
            ${alertBadge}
          </div>
          <p class="text-xs text-slate-500 mt-0.5">
            ${drug.arabicName} • <span class="font-semibold text-blue-800">${drug.category}</span>
          </p>
        </div>
      </div>

      ${indicationsHTML}

      <div class="p-2.5 bg-slate-50 rounded-xl space-y-2 text-xs">
        <div class="flex justify-between items-center gap-2">
          <span class="font-bold text-slate-700">تركيز الأمبول:</span>
          <select id="conc-select-${drug.id}" onchange="handleConcChange('${drug.id}', this.value)" class="p-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none" dir="ltr">
            ${availableConcentrations.map((c) => `<option value="${c.value}" ${selectedConcentration === String(c.value) ? 'selected' : ''}>${c.label}</option>`).join('')}
            ${concConfig.customAllowed ? `<option value="custom" ${selectedConcentration === 'custom' ? 'selected' : ''}>تعديل يدوي (Custom)</option>` : ''}
          </select>
        </div>

        <div id="custom-conc-${drug.id}" class="${customVisible ? '' : 'hidden'} pt-1">
          <div class="flex items-center gap-2 justify-between">
            <label class="text-[11px] text-slate-600">أدخل التركيز (${concConfig.defaultUnit}):</label>
            <input type="number" step="any" min="0" dir="ltr" value="${customValue}" oninput="handleCustomConcInput('${drug.id}', this.value)" placeholder="مثال: 5" class="w-24 p-1.5 border border-blue-400 rounded-md text-xs font-bold text-center text-slate-900 bg-white" />
          </div>
          ${concConfig.minCustomConcentration !== null || concConfig.maxCustomConcentration !== null ? `
            <div class="text-[10px] text-slate-400 mt-1" dir="ltr">
              Allowed Range: ${concConfig.minCustomConcentration ?? 0} - ${concConfig.maxCustomConcentration ?? '∞'} ${concConfig.defaultUnit}
            </div>
          ` : ''}
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
        <div>
          <span class="text-slate-500 block mb-0.5">الجرعة القياسية:</span>
          <strong class="font-mono text-slate-900" dir="ltr" style="unicode-bidi: isolate;">
            ${activeIndication.doseConfig.doseMin}${activeIndication.doseConfig.doseMax !== activeIndication.doseConfig.doseMin ? ` - ${activeIndication.doseConfig.doseMax}` : ''} ${activeIndication.doseConfig.unitLabel}
          </strong>
        </div>

        <div>
          <span class="text-slate-500 block mb-0.5">طريق الإعطاء:</span>
          <strong class="text-slate-900" dir="ltr" style="unicode-bidi: isolate;">${activeIndication.route}</strong>
        </div>

        <div>
          <span class="text-slate-500 block mb-0.5">بدء الفاعلية:</span>
          <strong class="font-mono text-slate-900" dir="ltr" style="unicode-bidi: isolate;">${drug.pharmacokinetics?.onset || 'N/A'}</strong>
        </div>

        <div>
          <span class="text-slate-500 block mb-0.5">المدة:</span>
          <strong class="font-mono text-slate-900" dir="ltr" style="unicode-bidi: isolate;">${drug.pharmacokinetics?.duration || 'N/A'}</strong>
        </div>
      </div>

      ${calculationHTML}

      ${drug.safetyProfile?.safetyNotes ? `
        <div class="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
          <strong class="font-bold">⚠️ تنبيه السلامة:</strong>
          <span>${drug.safetyProfile.safetyNotes}</span>
        </div>
      ` : ''}

      <div class="border-t border-slate-100 pt-2 space-y-1 text-xs">
        <button type="button" onclick="toggleAccordion('acc-admin-${drug.id}')" class="w-full font-bold text-blue-600 py-1.5 hover:underline flex justify-between items-center text-right">
          <span>💉 الاستعمال والتخفيف</span>
          <span class="text-slate-400 text-[10px]">▼</span>
        </button>
        <div id="acc-admin-${drug.id}" class="hidden p-2.5 bg-slate-50 rounded-xl text-[11px] text-slate-700 space-y-1.5 border border-slate-100">
          <p>
            <strong class="text-slate-900">طريقة الإعطاء:</strong>
            <span dir="ltr" class="inline-block" style="unicode-bidi: isolate;">${drug.clinicalDetails?.administration || 'غير متوفر'}</span>
          </p>
          ${dilutionHTML}
        </div>

        <button type="button" onclick="toggleAccordion('acc-warn-${drug.id}')" class="w-full font-bold text-blue-600 py-1.5 hover:underline flex justify-between items-center text-right">
          <span>⚠️ التحذيرات وموانع الاستعمال</span>
          <span class="text-slate-400 text-[10px]">▼</span>
        </button>
        <div id="acc-warn-${drug.id}" class="hidden p-2.5 bg-slate-50 rounded-xl text-[11px] text-slate-700 space-y-1.5 border border-slate-100">
          <p><strong class="text-slate-900">التحذيرات:</strong> <span>${warnings.length ? warnings.join(' • ') : 'لا توجد بيانات'}</span></p>
          <p><strong class="text-slate-900">موانع الاستعمال:</strong> <span>${contraindications.length ? contraindications.join(' • ') : 'لا توجد بيانات'}</span></p>
          ${drug.safetyProfile?.blackBoxWarning ? `
            <div class="mt-2 p-2 bg-rose-50 border border-rose-200 rounded-lg text-rose-800">
              <strong>⚠️ Black Box Warning:</strong>
              <span dir="ltr" class="inline-block" style="unicode-bidi: isolate;">${drug.safetyProfile.blackBoxWarning}</span>
            </div>
          ` : ''}
        </div>

        <button type="button" onclick="toggleAccordion('acc-rev-${drug.id}')" class="w-full font-bold text-blue-600 py-1.5 hover:underline flex justify-between items-center text-right">
          <span>🔄 العكس والمراجع</span>
          <span class="text-slate-400 text-[10px]">▼</span>
        </button>
        <div id="acc-rev-${drug.id}" class="hidden p-2.5 bg-slate-50 rounded-xl text-[11px] text-slate-700 space-y-1.5 border border-slate-100">
          <p><strong class="text-slate-900">المضاد (Reversal):</strong> <span>${drug.clinicalDetails?.reversal || 'لا يوجد'}</span></p>
          <p><strong class="text-slate-900">المرجع:</strong> <span>${referencesHTML}</span></p>
        </div>
      </div>
    </article>
  `;
}

// 🛡️ تشغيل أمن يضمن عدم السقوط في سباق التحميل (DOMContentLoaded Race Condition)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
