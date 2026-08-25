/**
 * AnesthesiaX — Drug Center & Clinical Dosing View Component
 * File: js/components/drugCenterView.js
 * 
 * High-Performance View Layer (6-Phase Clinical Chronological OR Layout)
 */

import { drugsData } from "../data/drugs.js";
import { calculateDose } from "../logic/doseCalculator.js";
import { DOSE_UNITS } from "../data/common/doseUnits.js";

// =============================================================================
// 1. MODULE LOCAL RUNTIME STATE
// =============================================================================

const state = {
  activeTriadFilter: "sedation", // البداية بالمهدئات كأول خطوة سريرية
  searchQuery: "",
  patientWeight: "",
  patientAge: "40",
  patientGender: "male",
  allergyReviewed: true,
  monitoringConfirmed: true,
  selectedContexts: {},
  selectedPresentations: {},
  openAccordions: {},
  renderedLimit: 12
};

// =============================================================================
// 2. HELPER BADGE STYLES & FORMATTERS
// =============================================================================

function getFlagBadgeStyle(flag) {
  switch (flag) {
    case "black_box_warning":
    case "mh_trigger":
    case "hyperkalemia_risk":
      return "bg-rose-100 text-rose-800 border-rose-300 font-bold";
    case "resp_depression":
    case "hypotension_risk":
    case "cardiotoxicity_high_risk":
    case "bradycardia_risk":
    case "chest_wall_rigidity_risk":
      return "bg-amber-100 text-amber-900 border-amber-300 font-bold";
    case "reversal_with_sugammadex":
    case "hofmann_elimination":
    case "hemodynamic_stability":
    case "bronchodilation":
    case "bronchodilator":
      return "bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold";
    default:
      return "bg-blue-100 text-blue-800 border-blue-200";
  }
}

function getFlagLabel(flag) {
  const normalized = String(flag).toLowerCase().replace(/[\s-]+/g, "_");
  const labels = {
    black_box_warning: "⚠️ Black Box Warning",
    mh_trigger: "🔥 محرض فرط الحرارة الخبيث (MH Trigger)",
    hyperkalemia_risk: "⚡ خطر فرط البوتاسيوم",
    resp_depression: "🫁 تثبيط تنفسي",
    hypotension_risk: "📉 خطر هبوط الضغط",
    bradycardia_risk: "❤️‍🩹 بطء قلب",
    chest_wall_rigidity_risk: "🛑 صلابة جدار الصدر",
    reversal_with_sugammadex: "🔄 يُعكس بالسوجاماديكس",
    hofmann_elimination: "🧬 استقلاب هوفمان (آمن كلوياً/كبداً)",
    hemodynamic_stability: "🛡️ ثبات قلبي وعائي",
    bronchodilation: "🫁 موسع للقصبات",
    bronchodilator: "🫁 موسع للقصبات",
    compound_a_risk: "⚠️ خطر تكوّن المركب A مع الجير الجاف",
    emergence_agitation: "⚡ هياج الإفاقة لدى الأطفال",
    cardiotoxicity_high_risk: "💔 سمية قلبية عالية",
    last_risk: "🧪 خطر سمية التخدير الموضعي (LAST)",
    pure_vasoconstrictor: "💉 قابض وعائي نقي",
    central_line_preferred: "🎯 يفضل خط وريدي مركزي",
    ponv_prophylaxis: "✨ وقاية من القيء",
    analgesics: "مسكن أفيوني",
    hypnotics: "منوم وريدي",
    sedatives: "مهدئ ومزيل قلق"
  };
  return labels[normalized] || flag;
}

// =============================================================================
// 3. MAIN RENDER FUNCTION (INSTANT SHELL MOUNT)
// =============================================================================

export function renderDrugCenterView() {
  return `
    <div class="space-y-4 max-w-3xl mx-auto font-sans dir-rtl text-right" id="drugCenterContainer">

      <!-- HEADER -->
      <div class="p-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl shadow-md flex justify-between items-center">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-2xl">💊</span>
            <h2 class="font-bold text-base">مركز أدوية التخدير وحاسبة السرنجات</h2>
          </div>
          <p class="text-[11px] opacity-80 mt-0.5" dir="ltr">Clinical Anesthesia & Emergency Drug Decision Support</p>
        </div>
        <button id="btnBackToDashboard" type="button" class="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-xl font-bold text-xs transition cursor-pointer">
          الرئيسية ↩
        </button>
      </div>

      <!-- PATIENT CONTEXT & PARAMETERS BAR -->
      <div class="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-3">
        <div class="flex justify-between items-center border-b border-slate-100 pb-2">
          <strong class="text-slate-800 text-xs flex items-center gap-1.5">
            <span>⚖️</span>
            <span>بيانات المريض لحساب الجرعات والحجم التلقائي:</span>
          </strong>
          <span class="text-[10px] text-slate-400 font-mono">Live CDS Engine</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <div>
            <label class="block font-bold text-slate-700 mb-1">الوزن الفعلي <bdi dir="ltr">(kg)</bdi>:</label>
            <div class="flex gap-1">
              <input type="number" id="dcPatientWeight" min="1" max="300" step="0.5" placeholder="مثال: 70" value="${state.patientWeight}" class="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-bold font-mono text-center text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none">
              <button id="btnClearWeight" type="button" class="px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-[10px] font-bold">مسح</button>
            </div>
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">العمر <bdi dir="ltr">(Years)</bdi>:</label>
            <input type="number" id="dcPatientAge" min="0" max="120" placeholder="مثال: 40" value="${state.patientAge}" class="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-bold font-mono text-center text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none">
          </div>

          <div class="flex flex-col justify-end space-y-1.5 pt-1">
            <label class="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-700 font-semibold">
              <input type="checkbox" id="dcAllergyCheck" ${state.allergyReviewed ? 'checked' : ''} class="rounded text-blue-600">
              <span>السجل التحسسي مراجع</span>
            </label>
            <label class="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-700 font-semibold">
              <input type="checkbox" id="dcMonitoringCheck" ${state.monitoringConfirmed ? 'checked' : ''} class="rounded text-blue-600">
              <span>أجهزة المراقبة جاهزة</span>
            </label>
          </div>
        </div>
      </div>

      <!-- SEARCH & CATEGORY TABS (الترتيب الزمني المعتمد لـ 6 تبويبات) -->
      <div class="space-y-2">
        <div class="relative">
          <input type="text" id="dcSearchInput" value="${state.searchQuery}" placeholder="🔍 ابحث عن دواء (Midazolam, Propofol, Fentanyl, Rocuronium, Sevoflurane, Ephedrine)..." class="w-full p-3 bg-white border-2 border-blue-500/80 rounded-2xl text-xs font-bold shadow-sm focus:outline-none text-slate-900">
          ${state.searchQuery ? `
            <button id="btnClearSearch" type="button" class="absolute left-3 top-3 text-slate-400 hover:text-slate-600 font-bold text-xs">✕</button>
          ` : ''}
        </div>

        <div class="flex gap-1.5 overflow-x-auto pb-1 text-xs font-bold" id="triadFiltersContainer">
          
          <!-- 1. المهدئات -->
          <button data-triad="sedation" class="triad-tab-btn px-3 py-2 rounded-xl border transition whitespace-nowrap cursor-pointer ${state.activeTriadFilter === 'sedation' ? 'bg-sky-700 text-white border-sky-700 shadow-sm' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'}">
            😌 1. المهدئات (Sedation)
          </button>

          <!-- 2. المسكنات -->
          <button data-triad="analgesia" class="triad-tab-btn px-3 py-2 rounded-xl border transition whitespace-nowrap cursor-pointer ${state.activeTriadFilter === 'analgesia' ? 'bg-rose-700 text-white border-rose-700 shadow-sm' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'}">
            💉 2. المسكنات (Analgesia)
          </button>

          <!-- 3. المنومات والاستحثاث -->
          <button data-triad="hypnosis" class="triad-tab-btn px-3 py-2 rounded-xl border transition whitespace-nowrap cursor-pointer ${state.activeTriadFilter === 'hypnosis' ? 'bg-indigo-700 text-white border-indigo-700 shadow-sm' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'}">
            💤 3. المنومات (Hypnotics)
          </button>

          <!-- 4. المرخيات العضلية -->
          <button data-triad="muscle_relaxation" class="triad-tab-btn px-3 py-2 rounded-xl border transition whitespace-nowrap cursor-pointer ${state.activeTriadFilter === 'muscle_relaxation' ? 'bg-amber-700 text-white border-amber-700 shadow-sm' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'}">
            ⚡ 4. المرخيات العضلية (Muscle Relaxants)
          </button>

          <!-- 5. الغازات الاستنشاقية -->
          <button data-triad="inhalation" class="triad-tab-btn px-3 py-2 rounded-xl border transition whitespace-nowrap cursor-pointer ${state.activeTriadFilter === 'inhalation' ? 'bg-purple-700 text-white border-purple-700 shadow-sm' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'}">
            💨 5. الغازات الاستنشاقية (Inhalation MAC)
          </button>

          <!-- 6. العكس والطوارئ والضغط -->
          <button data-triad="reversal_emergency" class="triad-tab-btn px-3 py-2 rounded-xl border transition whitespace-nowrap cursor-pointer ${state.activeTriadFilter === 'reversal_emergency' ? 'bg-teal-700 text-white border-teal-700 shadow-sm' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'}">
            🛡️ 6. العكس والطوارئ والضغط (Reversal, Emergency & Pressors)
          </button>

        </div>
      </div>

      <!-- DRUG CARDS LIST CONTAINER -->
      <div id="drugCardsListContainer" class="space-y-3">
        <div class="p-8 text-center text-slate-400 text-xs">جاري تجهيز الأدوية بسرعة...</div>
      </div>

      <!-- FOOTER DISCLAIMER -->
      <div class="p-3 bg-slate-100 border border-slate-200 rounded-2xl text-[11px] text-slate-600 leading-relaxed text-center">
        <strong>⚠️ تنبيه سريري وقانوني:</strong> جميع الجرعات والأحجام المحسوبة هي لأغراض الاسترشاد الأكاديمي والتدريبي؛ يجب دائماً مطابقة تركيز الأمبولة الفعلي وحالة المريض السريرية قبل الحقن.
      </div>

    </div>
  `;
}

// =============================================================================
// 4. DRUG CARDS BUILDER
// =============================================================================

function getFilteredDrugs() {
  const allDrugs = (drugsData && Array.isArray(drugsData.all)) ? drugsData.all : [];
  const cleanQuery = (state.searchQuery || "").toLowerCase().trim();

  return allDrugs.filter(drug => {
    if (!drug) return false;
    
    const filter = state.activeTriadFilter;
    const triad = drug.classification?.triadComponent || "";
    const cat = (drug.classification?.category || "").toLowerCase();
    const subCat = (drug.classification?.subCategory || "").toLowerCase();
    const id = (drug.id || "").toLowerCase();

    let matchesCategory = false;

    // 1. المهدئات ومزيلات القلق
    if (filter === "sedation") {
      matchesCategory = cat.includes("sedat") || subCat.includes("sedat") || cat.includes("anxiolytic") 
        || id === "midazolam" || id === "dexmedetomidine" || id === "diazepam" || id === "lorazepam";
    }
    // 2. المسكنات
    else if (filter === "analgesia") {
      matchesCategory = triad === "analgesia" || cat.includes("analgesic") || cat.includes("opioid");
    }
    // 3. المنومات والاستحثاث الوريدي
    else if (filter === "hypnosis") {
      matchesCategory = (triad === "hypnosis" || cat.includes("hypnotic") || cat.includes("induction")) 
        && id !== "midazolam" && id !== "dexmedetomidine" && !drug.macModel && id !== "sevoflurane" && id !== "isoflurane" && id !== "desflurane";
    }
    // 4. المرخيات العضلية (الشلل العضلي فقط)
    else if (filter === "muscle_relaxation") {
      matchesCategory = (triad === "muscle_relaxation" || cat.includes("relaxant") || cat.includes("neuromuscular"))
        && id !== "sugammadex" && id !== "neostigmine";
    }
    // 5. الغازات الاستنشاقية ومبخرات الـ MAC
    else if (filter === "inhalation") {
      matchesCategory = Boolean(drug.macModel) || cat.includes("inhalat") || cat.includes("volatile")
        || id === "sevoflurane" || id === "isoflurane" || id === "desflurane" || id === "halothane";
    }
    // 6. العكس والطوارئ والضغط
    else if (filter === "reversal_emergency") {
      matchesCategory = triad === "supporting" || cat.includes("emergency") || cat.includes("vasopressor") 
        || cat.includes("reversal") || id === "sugammadex" || id === "neostigmine" || id === "atropine" || id === "ephedrine"
        || id === "noradrenaline" || id === "adrenaline" || id === "phenylephrine" || id === "intralipid";
    }
    else {
      matchesCategory = triad === filter;
    }

    if (!matchesCategory) return false;
    if (!cleanQuery) return true;

    const genericName = typeof drug.name === "object" ? (drug.name.generic || "") : (drug.name || "");
    const arabicName = typeof drug.name === "object" ? (drug.name.arabic || "") : "";
    const brandNames = (drug.name && Array.isArray(drug.name.brandNames)) ? drug.name.brandNames : [];

    const genericMatch = genericName.toLowerCase().includes(cleanQuery);
    const arabicMatch = arabicName.toLowerCase().includes(cleanQuery);
    const brandMatch = brandNames.some(b => String(b).toLowerCase().includes(cleanQuery));
    const indicationMatch = Array.isArray(drug.indications) && drug.indications.some(ind => {
      const text = typeof ind === "string" ? ind : (ind.label?.en + " " + ind.label?.ar);
      return text?.toLowerCase().includes(cleanQuery);
    });

    return genericMatch || arabicMatch || brandMatch || indicationMatch;
  });
}

function renderDrugCardsListHTML() {
  const filtered = getFilteredDrugs();

  if (filtered.length === 0) {
    return `
      <div class="p-8 bg-white border border-slate-200 rounded-2xl text-center text-slate-400 text-xs space-y-2">
        <span class="text-3xl block">🔍</span>
        <strong class="text-slate-600 block">لا توجد أدوية مطابقة في هذا التبويب.</strong>
        <p class="text-[11px]">يمكنك البحث باسم الدواء العلمي أو التجاري أعلاه.</p>
      </div>
    `;
  }

  return filtered.map(drug => renderSingleDrugCardHTML(drug)).join("");
}

function renderSingleDrugCardHTML(drug) {
  if (!drug) return "";

  const patient = {
    weight: parseFloat(state.patientWeight) || 0,
    age: parseFloat(state.patientAge) || 40,
    gender: state.patientGender,
    allergyReviewed: state.allergyReviewed,
    monitoringConfirmed: state.monitoringConfirmed
  };

  const genericName = typeof drug.name === "object" ? (drug.name.generic || drug.id) : (drug.name || drug.id);
  const arabicName = typeof drug.name === "object" ? (drug.name.arabic || "") : "";
  const brandNames = (drug.name && Array.isArray(drug.name.brandNames)) ? drug.name.brandNames : [];

  const contexts = Array.isArray(drug.clinicalContexts) ? drug.clinicalContexts : [];
  
  let defaultContextId = (contexts.find(c => c.isDefault)?.id) || contexts[0]?.id;
  if (drug.id === "propofol" && patient.age) {
    if (patient.age < 16) {
      defaultContextId = contexts.find(c => c.id === "pediatric_induction")?.id || defaultContextId;
    } else if (patient.age >= 65) {
      defaultContextId = contexts.find(c => c.id === "elderly_debilitated_induction")?.id || defaultContextId;
    } else {
      defaultContextId = contexts.find(c => c.id === "healthy_adult_induction")?.id || defaultContextId;
    }
  }

  const selectedContextId = state.selectedContexts[drug.id] || defaultContextId;
  const activeContext = contexts.find(c => c.id === selectedContextId) || contexts[0] || null;

  const presentations = Array.isArray(drug.presentations) ? drug.presentations : (Array.isArray(drug.concentrations) ? drug.concentrations : []);
  const selectedPresIndex = state.selectedPresentations[drug.id] !== undefined ? state.selectedPresentations[drug.id] : 0;
  const activePresentation = presentations[selectedPresIndex] || presentations[0] || null;

  let calcResult = null;
  try {
    if (typeof calculateDose === "function") {
      calcResult = calculateDose(drug, selectedContextId, patient, activePresentation);
    }
  } catch (e) {
    console.error(`Calculation error for drug [${drug.id}]:`, e);
  }

  const isAccPdkOpen = state.openAccordions[`acc-pdk-${drug.id}`];
  const isAccWarnOpen = state.openAccordions[`acc-warn-${drug.id}`];
  const isAccNmtOpen = state.openAccordions[`acc-nmt-${drug.id}`];

  const onset = drug.pharmacodynamics?.onset || drug.onset || (drug.macModel ? "سريع (استنشاقي)" : "سريع");
  const duration = drug.pharmacodynamics?.clinicalDuration || drug.pharmacodynamics?.duration || drug.duration || (drug.macModel ? "حسب الإيقاف" : "N/A");

  return `
    <article class="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-3 transition hover:border-slate-300" id="card-${drug.id}">
      
      <!-- DRUG CARD HEADER -->
      <div class="flex justify-between items-start gap-2 border-b border-slate-100 pb-2.5">
        <div>
          <div class="flex items-center gap-2 flex-wrap">
            <h3 class="font-bold text-base text-slate-900">${genericName}</h3>
            ${drug.safety?.highRiskMedication ? `
              <span class="px-2 py-0.5 bg-rose-100 text-rose-800 rounded border border-rose-300 text-[10px] font-bold font-mono">⚠️ HIGH ALERT</span>
            ` : ''}
          </div>
          <p class="text-xs text-slate-500 mt-0.5">
            <strong class="text-blue-900">${arabicName}</strong>
            ${brandNames.length ? ` • <bdi dir="ltr" class="font-mono text-slate-400">(${brandNames.join(', ')})</bdi>` : ''}
          </p>
        </div>

        <span class="text-[10px] px-2 py-1 bg-slate-100 text-slate-700 rounded-lg border font-mono">
          ${drug.classification?.category || drug.classification?.triadComponent || "تخدير"}
        </span>
      </div>

      <!-- CLINICAL FLAGS BADGES -->
      ${(Array.isArray(drug.clinicalFlags) && drug.clinicalFlags.length > 0) ? `
        <div class="flex flex-wrap gap-1">
          ${drug.clinicalFlags.map(flag => `
            <span class="px-2 py-0.5 rounded text-[10px] border ${getFlagBadgeStyle(flag)}">
              ${getFlagLabel(flag)}
            </span>
          `).join('')}
        </div>
      ` : ''}

      <!-- CONTROLS: CONTEXT & PRESENTATION SELECTORS -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
        
        ${contexts.length > 0 ? `
          <div>
            <label class="block font-bold text-slate-700 mb-1">السياق السريري والاستطباب:</label>
            <select data-drug-id="${drug.id}" class="context-select w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-xs text-slate-900 focus:bg-white focus:outline-none">
              ${contexts.map(c => `
                <option value="${c.id}" ${c.id === selectedContextId ? 'selected' : ''}>${c.label}</option>
              `).join('')}
            </select>
          </div>
        ` : `
          <div>
            <label class="block font-bold text-slate-700 mb-1">النموذج السريري:</label>
            <div class="p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 text-xs">
              ${drug.macModel ? '💨 استنشاق عبر المبخرة (Age-Adjusted MAC)' : 'استخدام سريري مرجعي'}
            </div>
          </div>
        `}

        ${presentations.length > 0 ? `
          <div>
            <label class="block font-bold text-slate-700 mb-1">تركيز الأمبولة / المحلول المتاح:</label>
            <select data-drug-id="${drug.id}" class="presentation-select w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-xs text-slate-900 focus:bg-white focus:outline-none font-mono" dir="ltr">
              ${presentations.map((p, idx) => `
                <option value="${idx}" ${idx === selectedPresIndex ? 'selected' : ''}>${p.label || `${p.concentration || p.value} ${p.unit || ''}`}</option>
              `).join('')}
            </select>
          </div>
        ` : `
          <div>
            <label class="block font-bold text-slate-700 mb-1">العبوة:</label>
            <div class="p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-700 text-xs" dir="ltr">
              100% Volatile Liquid
            </div>
          </div>
        `}

      </div>

      <!-- LIVE CALCULATION RESULT BOX (ACTION BOXES) -->
      ${renderCalculationResultBoxHTML(calcResult, patient)}

      <!-- COLLAPSIBLE ACCORDIONS (نظام الأزرار المنسدلة النظيف) -->
      <div class="border-t border-slate-100 pt-2 space-y-1.5 text-xs">
        
        <!-- 1. زر زمن بدء المفعول ومدة التأثير -->
        <button type="button" data-acc-id="acc-pdk-${drug.id}" class="acc-toggle-btn w-full font-bold text-blue-700 py-1 hover:underline flex justify-between items-center text-right cursor-pointer">
          <span>⏱️ زمن بدء المفعول ومدة التأثير (Onset & Duration)</span>
          <span class="text-slate-400 text-[10px]">${isAccPdkOpen ? '▲' : '▼'}</span>
        </button>
        <div id="acc-pdk-${drug.id}" class="${isAccPdkOpen ? '' : 'hidden'} p-2.5 bg-blue-50/50 rounded-xl border border-blue-200 space-y-1.5 text-[11px] text-blue-950">
          <div class="grid grid-cols-2 gap-2 font-mono text-xs">
            <div class="bg-white p-2 rounded-lg border border-blue-100">
              <span class="text-slate-500 font-sans font-bold block text-[10px]">بدء المفعول (Onset):</span>
              <strong class="text-slate-900" dir="ltr">${onset}</strong>
            </div>
            <div class="bg-white p-2 rounded-lg border border-blue-100">
              <span class="text-slate-500 font-sans font-bold block text-[10px]">مدة التأثير (Duration):</span>
              <strong class="text-slate-900" dir="ltr">${duration}</strong>
            </div>
          </div>
        </div>

        <!-- 2. زر التحذيرات وموانع الاستعمال -->
        <button type="button" data-acc-id="acc-warn-${drug.id}" class="acc-toggle-btn w-full font-bold text-rose-700 py-1 hover:underline flex justify-between items-center text-right cursor-pointer">
          <span>⚠️ التحذيرات وموانع الاستعمال (Contraindications)</span>
          <span class="text-slate-400 text-[10px]">${isAccWarnOpen ? '▲' : '▼'}</span>
        </button>
        <div id="acc-warn-${drug.id}" class="${isAccWarnOpen ? '' : 'hidden'} p-3 bg-rose-50/60 rounded-xl space-y-2 border border-rose-200 text-[11px] text-rose-950 leading-relaxed">
          ${(Array.isArray(drug.warnings) && drug.warnings.length > 0) ? `
            <div>
              <strong class="text-rose-900 block mb-1">التحذيرات السريرية:</strong>
              <ul class="list-disc list-inside space-y-1 text-slate-800">
                ${drug.warnings.map(w => `<li>${w}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
          ${(Array.isArray(drug.contraindications) && drug.contraindications.length > 0) ? `
            <div class="pt-1 border-t border-rose-200/80">
              <strong class="text-rose-950 block mb-1">موانع الاستعمال (Contraindications):</strong>
              <ul class="list-disc list-inside space-y-1 text-rose-900 font-bold">
                ${drug.contraindications.map(c => `<li>${c}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
        </div>

        <!-- 3. زر المراقبة العضلية NMT للمرخيات -->
        ${drug.neuromuscularMonitoring || drug.classification?.triadComponent === "muscle_relaxation" ? `
          <button type="button" data-acc-id="acc-nmt-${drug.id}" class="acc-toggle-btn w-full font-bold text-amber-800 py-1 hover:underline flex justify-between items-center text-right cursor-pointer">
            <span>⚡ المراقبة العضلية وتوصيات الإفاقة (NMT Monitoring)</span>
            <span class="text-slate-400 text-[10px]">${isAccNmtOpen ? '▲' : '▼'}</span>
          </button>
          <div id="acc-nmt-${drug.id}" class="${isAccNmtOpen ? '' : 'hidden'} p-3 bg-amber-50/60 rounded-xl space-y-1.5 border border-amber-200 text-[11px] text-amber-950 leading-relaxed">
            <p><strong>نمط المراقبة الموصى به:</strong> <bdi dir="ltr" class="font-mono font-bold">${drug.neuromuscularMonitoring?.modality || 'Quantitative NMT'}</bdi></p>
            <p><strong>معيار نزع الأنبوب الآمن (Extubation Target):</strong> <bdi dir="ltr" class="font-mono font-bold text-emerald-800">TOF Ratio ≥ 0.9</bdi></p>
          </div>
        ` : ''}

      </div>

    </article>
  `;
}

function renderCalculationResultBoxHTML(calcResult, patient) {
  if (!calcResult) return '';

  if (calcResult.status === "BLOCKED") {
    const errorText = (calcResult.blockingErrors && calcResult.blockingErrors.length) 
      ? calcResult.blockingErrors.join(" • ") 
      : (calcResult.error || "يرجى استكمال وزن أو عمر المريض");
    return `
      <div class="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs space-y-1">
        <div class="font-bold flex items-center gap-1">
          <span>🛑</span>
          <span>الحساب معلق:</span>
        </div>
        <p class="text-[11px] text-amber-800">${errorText}</p>
      </div>
    `;
  }

  if (calcResult.macResults && calcResult.macResults.adjusted1Mac) {
    const mac = calcResult.macResults;
    return `
      <div class="p-3 bg-indigo-50/80 border-2 border-indigo-400/80 rounded-xl space-y-2 text-xs">
        <div class="flex justify-between items-center border-b border-indigo-200 pb-1.5 font-bold text-indigo-950">
          <span>💨 تركيز الـ MAC المصحح لعمر (${mac.patientAge} سنة):</span>
          <span class="font-mono text-indigo-900 text-base font-extrabold" dir="ltr">1.0 MAC = ${mac.adjusted1Mac}%</span>
        </div>
        ${mac.guidanceRange ? `
          <div class="flex justify-between items-center text-[11px] text-indigo-900 font-semibold">
            <span>النطاق الجراحي الاسترشادي (0.5 – 1.3 MAC):</span>
            <span class="font-mono font-bold text-indigo-950" dir="ltr">${mac.guidanceRange.min05Mac}% – ${mac.guidanceRange.max13Mac}%</span>
          </div>
        ` : ''}
        <p class="text-[10px] text-indigo-700 italic">${mac.clinicalModifiersNote || ''}</p>
      </div>
    `;
  }

  if (calcResult.pairingResult) {
    const pair = calcResult.pairingResult;
    return `
      <div class="p-3 bg-teal-50 border border-teal-200 rounded-xl space-y-2 text-xs">
        <div class="grid grid-cols-2 gap-2 text-center">
          <div class="bg-white p-2 rounded-lg border border-teal-200">
            <span class="block text-[10px] text-teal-800 font-bold">جرعة الغليكوبيرولات المقترنة:</span>
            <strong class="font-mono text-base text-teal-950 block mt-0.5" dir="ltr">${calcResult.calculatedDose?.min || ''} mg</strong>
          </div>
          <div class="bg-emerald-50 p-2 rounded-lg border border-emerald-300 shadow-2xs">
            <span class="block text-[10px] text-emerald-900 font-bold">حجم السرنجة المطلوب:</span>
            <strong class="font-mono text-base text-emerald-950 block mt-0.5" dir="ltr">${calcResult.calculatedVolume?.display || ''}</strong>
          </div>
        </div>
        <p class="text-[10px] text-teal-700 font-mono text-center">${pair.pairingRatio || ''}</p>
      </div>
    `;
  }

  const dose = calcResult.calculatedDose;
  const vol = calcResult.calculatedVolume;
  const pump = calcResult.infusionPumpRate;
  const ceiling = calcResult.safetyLimits?.localAnestheticCeiling;

  if (!dose && !vol && !pump && !ceiling) return '';

  let doseDisplay = '';
  if (dose) {
    doseDisplay = (dose.min === dose.max) ? `${dose.min} ${dose.unit || ''}` : `${dose.min} – ${dose.max} ${dose.unit || ''}`;
  }

  return `
    <div class="space-y-2">
      
      <div class="grid grid-cols-2 gap-2">
        
        ${dose ? `
          <div class="bg-blue-50 border border-blue-200 p-2.5 rounded-xl text-center">
            <span class="block text-[10px] font-bold text-blue-900">🎯 الجرعة الصافية</span>
            <strong class="font-mono text-base text-blue-950 font-extrabold block mt-0.5" dir="ltr"><bdi>${doseDisplay}</bdi></strong>
            <span class="block text-[9px] text-blue-700 font-medium mt-0.5">${patient.weight > 0 && calcResult.weightResolution ? `(${calcResult.weightResolution.selectedWeight} kg ${calcResult.weightResolution.actualTypeUsed})` : 'جرعة مرجعية'}</span>
          </div>
        ` : ''}

        ${vol ? `
          <div class="bg-emerald-50 border-2 border-emerald-500 p-2.5 rounded-xl text-center shadow-2xs">
            <span class="block text-[10px] font-extrabold text-emerald-900">💉 حجم السحب بالسرنجة</span>
            <strong class="font-mono text-lg text-emerald-950 font-black block mt-0.5" dir="ltr"><bdi>${vol.display || `${vol.min} mL`}</bdi></strong>
            <span class="block text-[9px] text-emerald-700 font-bold mt-0.5">اسحب بالسرنجة مباشرة</span>
          </div>
        ` : ''}

      </div>

      ${pump ? `
        <div class="p-2 bg-purple-50 border border-purple-200 rounded-xl flex justify-between items-center text-xs">
          <span class="font-bold text-purple-950">⚡ سرعة مضخة المحاقن (Pump Rate):</span>
          <span class="font-mono font-bold text-purple-900 text-sm" dir="ltr"><bdi>${pump.display || `${pump.minMlPerHour} mL/hr`}</bdi></span>
        </div>
      ` : ''}

      ${ceiling ? `
        <div class="p-2 bg-amber-100/80 border border-amber-300 rounded-xl text-[11px] text-amber-950 font-semibold flex justify-between items-center">
          <span>🛑 السقف الحجمي الآمن للرشح:</span>
          <span class="font-mono font-bold" dir="ltr"><bdi>${ceiling.maxSafeDoseMg} mg (${ceiling.maxSafeVolumeMl} mL max)</bdi></span>
        </div>
      ` : ''}

      ${calcResult.safetyLimits?.clamped ? `
        <div class="p-1.5 bg-rose-100 text-rose-900 rounded-lg border border-rose-300 text-[10px] font-bold">
          ⚠️ تم تقييد الجرعة القصوى بالسقف الأماني المعتمد للنيوستيغمين (5.0 mg).
        </div>
      ` : ''}

    </div>
  `;
}

// =============================================================================
// 5. TARGETED LIVE DOM UPDATES & EVENT BINDINGS
// =============================================================================

function updateLiveDrugCards() {
  const container = document.getElementById("drugCardsListContainer");
  if (container) {
    container.innerHTML = renderDrugCardsListHTML();
    bindDrugCardInternalEvents();
  }
}

function bindDrugCardInternalEvents() {
  const container = document.getElementById("drugCenterContainer");
  if (!container) return;

  container.querySelectorAll(".context-select").forEach(sel => {
    sel.addEventListener("change", e => {
      const drugId = e.target.getAttribute("data-drug-id");
      state.selectedContexts[drugId] = e.target.value;
      updateLiveDrugCards();
    });
  });

  container.querySelectorAll(".presentation-select").forEach(sel => {
    sel.addEventListener("change", e => {
      const drugId = e.target.getAttribute("data-drug-id");
      state.selectedPresentations[drugId] = parseInt(e.target.value, 10);
      updateLiveDrugCards();
    });
  });

  container.querySelectorAll(".acc-toggle-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      const accId = e.currentTarget.getAttribute("data-acc-id");
      state.openAccordions[accId] = !state.openAccordions[accId];
      
      const targetDiv = document.getElementById(accId);
      if (targetDiv) {
        targetDiv.classList.toggle("hidden");
        const arrow = e.currentTarget.querySelector("span:last-child");
        if (arrow) arrow.textContent = state.openAccordions[accId] ? "▲" : "▼";
      }
    });
  });
}

export function initDrugCenterEvents() {
  const container = document.getElementById("drugCenterContainer");
  if (!container) return;

  requestAnimationFrame(() => {
    updateLiveDrugCards();
  });

  const btnBack = document.getElementById("btnBackToDashboard");
  if (btnBack) {
    btnBack.addEventListener("click", () => {
      if (typeof window.navigateTo === "function") window.navigateTo("dashboard");
    });
  }

  const weightInput = document.getElementById("dcPatientWeight");
  if (weightInput) {
    weightInput.addEventListener("input", e => {
      state.patientWeight = e.target.value;
      updateLiveDrugCards();
    });
  }

  const btnClearWeight = document.getElementById("btnClearWeight");
  if (btnClearWeight && weightInput) {
    btnClearWeight.addEventListener("click", () => {
      state.patientWeight = "";
      weightInput.value = "";
      updateLiveDrugCards();
    });
  }

  const ageInput = document.getElementById("dcPatientAge");
  if (ageInput) {
    ageInput.addEventListener("input", e => {
      state.patientAge = e.target.value;
      delete state.selectedContexts["propofol"];
      updateLiveDrugCards();
    });
  }

  const allergyCheck = document.getElementById("dcAllergyCheck");
  if (allergyCheck) {
    allergyCheck.addEventListener("change", e => {
      state.allergyReviewed = e.target.checked;
      updateLiveDrugCards();
    });
  }

  const monitoringCheck = document.getElementById("dcMonitoringCheck");
  if (monitoringCheck) {
    monitoringCheck.addEventListener("change", e => {
      state.monitoringConfirmed = e.target.checked;
      updateLiveDrugCards();
    });
  }

  const searchInput = document.getElementById("dcSearchInput");
  if (searchInput) {
    searchInput.addEventListener("input", e => {
      state.searchQuery = e.target.value;
      updateLiveDrugCards();
    });
  }

  const btnClearSearch = document.getElementById("btnClearSearch");
  if (btnClearSearch && searchInput) {
    btnClearSearch.addEventListener("click", () => {
      state.searchQuery = "";
      searchInput.value = "";
      updateLiveDrugCards();
    });
  }

  container.querySelectorAll(".triad-tab-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      state.activeTriadFilter = e.currentTarget.getAttribute("data-triad");
      
      container.querySelectorAll(".triad-tab-btn").forEach(b => {
        b.className = "triad-tab-btn px-3 py-2 rounded-xl border transition whitespace-nowrap cursor-pointer bg-white text-slate-700 border-slate-200 hover:bg-slate-100";
      });

      const activeColors = {
        sedation: "bg-sky-700 text-white border-sky-700 shadow-sm",
        analgesia: "bg-rose-700 text-white border-rose-700 shadow-sm",
        hypnosis: "bg-indigo-700 text-white border-indigo-700 shadow-sm",
        muscle_relaxation: "bg-amber-700 text-white border-amber-700 shadow-sm",
        inhalation: "bg-purple-700 text-white border-purple-700 shadow-sm",
        reversal_emergency: "bg-teal-700 text-white border-teal-700 shadow-sm"
      };

      e.currentTarget.className = `triad-tab-btn px-3 py-2 rounded-xl border transition whitespace-nowrap cursor-pointer ${activeColors[state.activeTriadFilter] || 'bg-slate-900 text-white'}`;

      updateLiveDrugCards();
    });
  });
}

export default {
  renderDrugCenterView,
  initDrugCenterEvents
};
