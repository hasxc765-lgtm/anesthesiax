/**
 * AnesthesiaX — Drug Center & Clinical Dosing View Component
 * File: js/components/drugCenterView.js
 * 
 * High-Performance Bilingual View Layer (6-Phase Clinical Chronological OR Layout)
 */

import { drugsData } from "../data/drugs.js";
import { calculateDose } from "../logic/doseCalculator.js";
import { DOSE_UNITS } from "../data/common/doseUnits.js";
import { i18n, t } from "../i18n/languageManager.js";

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
// 2. HELPER BADGE STYLES & FORMATTERS (BILINGUAL)
// =============================================================================

function getFlagBadgeStyle(flag) {
  switch (flag) {
    case "black_box_warning":
    case "mh_trigger":
    case "hyperkalemia_risk":
      return "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800 font-bold";
    case "resp_depression":
    case "hypotension_risk":
    case "cardiotoxicity_high_risk":
    case "bradycardia_risk":
    case "chest_wall_rigidity_risk":
      return "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800 font-bold";
    case "reversal_with_sugammadex":
    case "hofmann_elimination":
    case "hemodynamic_stability":
    case "bronchodilation":
    case "bronchodilator":
      return "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800 font-semibold";
    default:
      return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800";
  }
}

function getFlagLabel(flag) {
  const normalized = String(flag).toLowerCase().replace(/[\s-]+/g, "_");
  const isRtl = i18n.isRTL();

  const labels = {
    black_box_warning: isRtl ? "⚠️ Black Box Warning" : "⚠️ Black Box Warning",
    mh_trigger: isRtl ? "🔥 محرض فرط الحرارة الخبيث (MH Trigger)" : "🔥 Malignant Hyperthermia (MH) Trigger",
    hyperkalemia_risk: isRtl ? "⚡ خطر فرط البوتاسيوم" : "⚡ Hyperkalemia Risk",
    resp_depression: isRtl ? "🫁 تثبيط تنفسي" : "🫁 Respiratory Depression",
    hypotension_risk: isRtl ? "📉 خطر هبوط الضغط" : "📉 Hypotension Risk",
    bradycardia_risk: isRtl ? "❤️‍🩹 بطء قلب" : "❤️‍🩹 Bradycardia Risk",
    chest_wall_rigidity_risk: isRtl ? "🛑 صلابة جدار الصدر" : "🛑 Chest Wall Rigidity",
    reversal_with_sugammadex: isRtl ? "🔄 يُعكس بالسوجاماديكس" : "🔄 Reversible with Sugammadex",
    hofmann_elimination: isRtl ? "🧬 استقلاب هوفمان (آمن كلوياً/كبداً)" : "🧬 Hofmann Elimination (Organ-Independent)",
    hemodynamic_stability: isRtl ? "🛡️ ثبات قلبي وعائي" : "🛡️ Hemodynamic Stability",
    bronchodilation: isRtl ? "🫁 موسع للقصبات" : "🫁 Bronchodilator",
    bronchodilator: isRtl ? "🫁 موسع للقصبات" : "🫁 Bronchodilator",
    compound_a_risk: isRtl ? "⚠️ خطر تكوّن المركب A مع الجير الجاف" : "⚠️ Compound A Risk with Dry Absorbent",
    emergence_agitation: isRtl ? "⚡ هياج الإفاقة لدى الأطفال" : "⚡ Pediatric Emergence Agitation",
    cardiotoxicity_high_risk: isRtl ? "💔 سمية قلبية عالية" : "💔 High Cardiotoxicity Risk",
    last_risk: isRtl ? "🧪 خطر سمية التخدير الموضعي (LAST)" : "🧪 LAST Risk (Local Anesthetic Toxicity)",
    pure_vasoconstrictor: isRtl ? "💉 قابض وعائي نقي" : "💉 Pure Vasoconstrictor",
    central_line_preferred: isRtl ? "🎯 يفضل خط وريدي مركزي" : "🎯 Central Line Preferred",
    ponv_prophylaxis: isRtl ? "✨ وقاية من القيء" : "✨ PONV Prophylaxis",
    analgesics: isRtl ? "مسكن أفيوني" : "Opioid Analgesic",
    hypnotics: isRtl ? "منوم وريدي" : "IV Hypnotic",
    sedatives: isRtl ? "مهدئ ومزيل قلق" : "Sedative / Anxiolytic"
  };
  return labels[normalized] || flag;
}

// =============================================================================
// 3. MAIN RENDER FUNCTION (INSTANT SHELL MOUNT)
// =============================================================================

export function renderDrugCenterView() {
  const isRtl = i18n.isRTL();

  return `
    <div class="space-y-4 max-w-3xl mx-auto font-sans ${isRtl ? 'dir-rtl text-right' : 'dir-ltr text-left'}" id="drugCenterContainer" dir="${isRtl ? 'rtl' : 'ltr'}">

      <!-- HEADER -->
      <div class="p-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl shadow-md flex justify-between items-center">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-2xl">💊</span>
            <h2 class="font-bold text-base">${isRtl ? 'مركز أدوية التخدير وحاسبة السرنجات' : 'Anesthetic Drug Center & Syringe Calculator'}</h2>
          </div>
          <p class="text-[11px] opacity-80 mt-0.5" dir="ltr">Clinical Anesthesia & Emergency Drug Decision Support</p>
        </div>
        <button id="btnBackToDashboard" type="button" class="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-xl font-bold text-xs transition cursor-pointer">
          ${isRtl ? 'الرئيسية ↩' : 'Dashboard ↩'}
        </button>
      </div>

      <!-- PATIENT CONTEXT & PARAMETERS BAR -->
      <div class="p-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm space-y-3">
        <div class="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-2">
          <strong class="text-slate-800 dark:text-slate-100 text-xs flex items-center gap-1.5">
            <span>⚖️</span>
            <span>${isRtl ? 'بيانات المريض لحساب الجرعات والحجم التلقائي:' : 'Patient parameters for dynamic dose & volume calculation:'}</span>
          </strong>
          <span class="text-[10px] text-slate-400 font-mono">Live CDS Engine</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <div>
            <label class="block font-bold text-slate-700 dark:text-slate-200 mb-1">${isRtl ? 'الوزن الفعلي' : 'Actual Weight'} <bdi dir="ltr">(kg)</bdi>:</label>
            <div class="flex gap-1">
              <input type="number" id="dcPatientWeight" min="1" max="300" step="0.5" placeholder="${isRtl ? 'مثال: 70' : 'e.g. 70'}" value="${state.patientWeight}" class="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl font-bold font-mono text-center text-slate-900 dark:text-white focus:bg-white focus:border-blue-500 focus:outline-none">
              <button id="btnClearWeight" type="button" class="px-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-200 rounded-xl text-[10px] font-bold cursor-pointer">${isRtl ? 'مسح' : 'Clear'}</button>
            </div>
          </div>

          <div>
            <label class="block font-bold text-slate-700 dark:text-slate-200 mb-1">${isRtl ? 'العمر' : 'Age'} <bdi dir="ltr">(Years)</bdi>:</label>
            <input type="number" id="dcPatientAge" min="0" max="120" placeholder="${isRtl ? 'مثال: 40' : 'e.g. 40'}" value="${state.patientAge}" class="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl font-bold font-mono text-center text-slate-900 dark:text-white focus:bg-white focus:border-blue-500 focus:outline-none">
          </div>

          <div class="flex flex-col justify-end space-y-1.5 pt-1">
            <label class="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-700 dark:text-slate-300 font-semibold">
              <input type="checkbox" id="dcAllergyCheck" ${state.allergyReviewed ? 'checked' : ''} class="rounded text-blue-600">
              <span>${isRtl ? 'السجل التحسسي مراجع' : 'Allergy status reviewed'}</span>
            </label>
            <label class="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-700 dark:text-slate-300 font-semibold">
              <input type="checkbox" id="dcMonitoringCheck" ${state.monitoringConfirmed ? 'checked' : ''} class="rounded text-blue-600">
              <span>${isRtl ? 'أجهزة المراقبة جاهزة' : 'Monitoring equipment ready'}</span>
            </label>
          </div>
        </div>
      </div>

      <!-- SEARCH & CATEGORY TABS (الترتيب الزمني المعتمد لـ 6 تبويبات) -->
      <div class="space-y-2">
        <div class="relative">
          <input type="text" id="dcSearchInput" value="${state.searchQuery}" placeholder="${isRtl ? '🔍 ابحث عن دواء (Midazolam, Propofol, Fentanyl, Rocuronium, Sevoflurane, Ephedrine)...' : '🔍 Search drug (Midazolam, Propofol, Fentanyl, Rocuronium, Sevoflurane, Ephedrine)...'}" class="w-full p-3 bg-white dark:bg-slate-900 border-2 border-blue-500/80 rounded-2xl text-xs font-bold shadow-sm focus:outline-none text-slate-900 dark:text-white">
          ${state.searchQuery ? `
            <button id="btnClearSearch" type="button" class="absolute ${isRtl ? 'left-3' : 'right-3'} top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold text-xs cursor-pointer">✕</button>
          ` : ''}
        </div>

        <div class="flex gap-1.5 overflow-x-auto pb-1 text-xs font-bold" id="triadFiltersContainer">
          
          <!-- 1. المهدئات -->
          <button data-triad="sedation" class="triad-tab-btn px-3 py-2 rounded-xl border transition whitespace-nowrap cursor-pointer ${state.activeTriadFilter === 'sedation' ? 'bg-sky-700 text-white border-sky-700 shadow-sm' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'}">
            ${isRtl ? '😌 1. المهدئات (Sedation)' : '😌 1. Sedation & Anxiolysis'}
          </button>

          <!-- 2. المسكنات -->
          <button data-triad="analgesia" class="triad-tab-btn px-3 py-2 rounded-xl border transition whitespace-nowrap cursor-pointer ${state.activeTriadFilter === 'analgesia' ? 'bg-rose-700 text-white border-rose-700 shadow-sm' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'}">
            ${isRtl ? '💉 2. المسكنات (Analgesia)' : '💉 2. Analgesia & Opioids'}
          </button>

          <!-- 3. المنومات والاستحثاث -->
          <button data-triad="hypnosis" class="triad-tab-btn px-3 py-2 rounded-xl border transition whitespace-nowrap cursor-pointer ${state.activeTriadFilter === 'hypnosis' ? 'bg-indigo-700 text-white border-indigo-700 shadow-sm' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'}">
            ${isRtl ? '💤 3. المنومات (Hypnotics)' : '💤 3. Hypnotics & Induction'}
          </button>

          <!-- 4. المرخيات العضلية -->
          <button data-triad="muscle_relaxation" class="triad-tab-btn px-3 py-2 rounded-xl border transition whitespace-nowrap cursor-pointer ${state.activeTriadFilter === 'muscle_relaxation' ? 'bg-amber-700 text-white border-amber-700 shadow-sm' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'}">
            ${isRtl ? '⚡ 4. المرخيات العضلية (Muscle Relaxants)' : '⚡ 4. Muscle Relaxants'}
          </button>

          <!-- 5. الغازات الاستنشاقية -->
          <button data-triad="inhalation" class="triad-tab-btn px-3 py-2 rounded-xl border transition whitespace-nowrap cursor-pointer ${state.activeTriadFilter === 'inhalation' ? 'bg-purple-700 text-white border-purple-700 shadow-sm' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'}">
            ${isRtl ? '💨 5. الغازات الاستنشاقية (Inhalation MAC)' : '💨 5. Volatiles & Inhalation (MAC)'}
          </button>

          <!-- 6. العكس والطوارئ والضغط -->
          <button data-triad="reversal_emergency" class="triad-tab-btn px-3 py-2 rounded-xl border transition whitespace-nowrap cursor-pointer ${state.activeTriadFilter === 'reversal_emergency' ? 'bg-teal-700 text-white border-teal-700 shadow-sm' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'}">
            ${isRtl ? '🛡️ 6. العكس والطوارئ والضغط (Reversal, Emergency & Pressors)' : '🛡️ 6. Reversal, Emergency & Pressors'}
          </button>

        </div>
      </div>

      <!-- DRUG CARDS LIST CONTAINER -->
      <div id="drugCardsListContainer" class="space-y-3">
        <div class="p-8 text-center text-slate-400 text-xs">${isRtl ? 'جاري تجهيز الأدوية بسرعة...' : 'Loading clinical drug cards...'}</div>
      </div>

      <!-- FOOTER DISCLAIMER -->
      <div class="p-3 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed text-center">
        <strong>⚠️ ${isRtl ? 'تنبيه سريري وقانوني:' : 'Clinical & Legal Notice:'}</strong> ${isRtl ? 'جميع الجرعات والأحجام المحسوبة هي لأغراض الاسترشاد الأكاديمي والتدريبي؛ يجب دائماً مطابقة تركيز الأمبولة الفعلي وحالة المريض السريرية قبل الحقن.' : 'All calculated doses and volumes are for academic guidance and reference; always verify ampoule concentration and clinical patient state prior to administration.'}
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
  const isRtl = i18n.isRTL();
  const filtered = getFilteredDrugs();

  if (filtered.length === 0) {
    return `
      <div class="p-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-center text-slate-400 text-xs space-y-2">
        <span class="text-3xl block">🔍</span>
        <strong class="text-slate-600 dark:text-slate-300 block">${isRtl ? 'لا توجد أدوية مطابقة في هذا التبويب.' : 'No matching medications found in this category.'}</strong>
        <p class="text-[11px]">${isRtl ? 'يمكنك البحث باسم الدواء العلمي أو التجاري أعلاه.' : 'You can search by generic or trade name above.'}</p>
      </div>
    `;
  }

  return filtered.map(drug => renderSingleDrugCardHTML(drug)).join("");
}

function renderSingleDrugCardHTML(drug) {
  if (!drug) return "";

  const isRtl = i18n.isRTL();

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

  const onset = drug.pharmacodynamics?.onset || drug.onset || (drug.macModel ? (isRtl ? "سريع (استنشاقي)" : "Rapid (Inhalational)") : (isRtl ? "سريع" : "Rapid"));
  const duration = drug.pharmacodynamics?.clinicalDuration || drug.pharmacodynamics?.duration || drug.duration || (drug.macModel ? (isRtl ? "حسب الإيقاف" : "Upon Discontinuation") : "N/A");

  return `
    <article class="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm space-y-3 transition hover:border-slate-300 dark:hover:border-slate-600" id="card-${drug.id}">
      
      <!-- DRUG CARD HEADER -->
      <div class="flex justify-between items-start gap-2 border-b border-slate-100 dark:border-slate-700 pb-2.5">
        <div>
          <div class="flex items-center gap-2 flex-wrap">
            <h3 class="font-bold text-base text-slate-900 dark:text-slate-100">${genericName}</h3>
            ${drug.safety?.highRiskMedication ? `
              <span class="px-2 py-0.5 bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 rounded border border-rose-300 dark:border-rose-800 text-[10px] font-bold font-mono">⚠️ HIGH ALERT</span>
            ` : ''}
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            ${arabicName ? `<strong class="text-blue-900 dark:text-indigo-300">${arabicName}</strong>` : ''}
            ${brandNames.length ? ` • <bdi dir="ltr" class="font-mono text-slate-400">(${brandNames.join(', ')})</bdi>` : ''}
          </p>
        </div>

        <span class="text-[10px] px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg border dark:border-slate-600 font-mono">
          ${drug.classification?.category || drug.classification?.triadComponent || (isRtl ? "تخدير" : "Anesthesia")}
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
            <label class="block font-bold text-slate-700 dark:text-slate-200 mb-1">${isRtl ? 'السياق السريري والاستطباب:' : 'Clinical Context & Indication:'}</label>
            <select data-drug-id="${drug.id}" class="context-select w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl font-bold text-xs text-slate-900 dark:text-white focus:bg-white focus:outline-none">
              ${contexts.map(c => {
                const labelText = (typeof c.label === 'object') ? (c.label[i18n.getCurrentLanguage()] || c.label.en || c.label.ar) : c.label;
                return `<option value="${c.id}" ${c.id === selectedContextId ? 'selected' : ''}>${labelText}</option>`;
              }).join('')}
            </select>
          </div>
        ` : `
          <div>
            <label class="block font-bold text-slate-700 dark:text-slate-200 mb-1">${isRtl ? 'النموذج السريري:' : 'Clinical Delivery Mode:'}</label>
            <div class="p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-800 dark:text-slate-200 text-xs">
              ${drug.macModel ? (isRtl ? '💨 استنشاق عبر المبخرة (Age-Adjusted MAC)' : '💨 Vaporizer Inhalation (Age-Adjusted MAC)') : (isRtl ? 'استخدام سريري مرجعي' : 'Standard Clinical Protocol')}
            </div>
          </div>
        `}

        ${presentations.length > 0 ? `
          <div>
            <label class="block font-bold text-slate-700 dark:text-slate-200 mb-1">${isRtl ? 'تركيز الأمبولة / المحلول المتاح:' : 'Available Ampoule / Solution Concentration:'}</label>
            <select data-drug-id="${drug.id}" class="presentation-select w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl font-bold text-xs text-slate-900 dark:text-white focus:bg-white focus:outline-none font-mono" dir="ltr">
              ${presentations.map((p, idx) => `
                <option value="${idx}" ${idx === selectedPresIndex ? 'selected' : ''}>${p.label || `${p.concentration || p.value} ${p.unit || ''}`}</option>
              `).join('')}
            </select>
          </div>
        ` : `
          <div>
            <label class="block font-bold text-slate-700 dark:text-slate-200 mb-1">${isRtl ? 'العبوة:' : 'Packaging:'}</label>
            <div class="p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-700 dark:text-slate-300 text-xs" dir="ltr">
              100% Volatile Liquid
            </div>
          </div>
        `}

      </div>

      <!-- LIVE CALCULATION RESULT BOX (ACTION BOXES) -->
      ${renderCalculationResultBoxHTML(calcResult, patient)}

      <!-- COLLAPSIBLE ACCORDIONS (نظام الأزرار المنسدلة النظيف) -->
      <div class="border-t border-slate-100 dark:border-slate-700 pt-2 space-y-1.5 text-xs">
        
        <!-- 1. زر زمن بدء المفعول ومدة التأثير -->
        <button type="button" data-acc-id="acc-pdk-${drug.id}" class="acc-toggle-btn w-full font-bold text-blue-700 dark:text-indigo-400 py-1 hover:underline flex justify-between items-center text-right cursor-pointer">
          <span>${isRtl ? '⏱️ زمن بدء المفعول ومدة التأثير (Onset & Duration)' : '⏱️ Onset of Action & Clinical Duration'}</span>
          <span class="text-slate-400 text-[10px]">${isAccPdkOpen ? '▲' : '▼'}</span>
        </button>
        <div id="acc-pdk-${drug.id}" class="${isAccPdkOpen ? '' : 'hidden'} p-2.5 bg-blue-50/50 dark:bg-slate-900/60 rounded-xl border border-blue-200 dark:border-slate-700 space-y-1.5 text-[11px] text-blue-950 dark:text-blue-200">
          <div class="grid grid-cols-2 gap-2 font-mono text-xs">
            <div class="bg-white dark:bg-slate-800 p-2 rounded-lg border border-blue-100 dark:border-slate-700">
              <span class="text-slate-500 dark:text-slate-400 font-sans font-bold block text-[10px]">${isRtl ? 'بدء المفعول (Onset):' : 'Onset of Action:'}</span>
              <strong class="text-slate-900 dark:text-white" dir="ltr">${onset}</strong>
            </div>
            <div class="bg-white dark:bg-slate-800 p-2 rounded-lg border border-blue-100 dark:border-slate-700">
              <span class="text-slate-500 dark:text-slate-400 font-sans font-bold block text-[10px]">${isRtl ? 'مدة التأثير (Duration):' : 'Clinical Duration:'}</span>
              <strong class="text-slate-900 dark:text-white" dir="ltr">${duration}</strong>
            </div>
          </div>
        </div>

        <!-- 2. زر التحذيرات وموانع الاستعمال -->
        <button type="button" data-acc-id="acc-warn-${drug.id}" class="acc-toggle-btn w-full font-bold text-rose-700 dark:text-rose-400 py-1 hover:underline flex justify-between items-center text-right cursor-pointer">
          <span>${isRtl ? '⚠️ التحذيرات وموانع الاستعمال (Contraindications)' : '⚠️ Clinical Warnings & Contraindications'}</span>
          <span class="text-slate-400 text-[10px]">${isAccWarnOpen ? '▲' : '▼'}</span>
        </button>
        <div id="acc-warn-${drug.id}" class="${isAccWarnOpen ? '' : 'hidden'} p-3 bg-rose-50/60 dark:bg-rose-950/40 rounded-xl space-y-2 border border-rose-200 dark:border-rose-900/60 text-[11px] text-rose-950 dark:text-rose-200 leading-relaxed">
          ${(Array.isArray(drug.warnings) && drug.warnings.length > 0) ? `
            <div>
              <strong class="text-rose-900 dark:text-rose-300 block mb-1">${isRtl ? 'التحذيرات السريرية:' : 'Clinical Warnings:'}</strong>
              <ul class="list-disc list-inside space-y-1 text-slate-800 dark:text-slate-200">
                ${drug.warnings.map(w => `<li>${typeof w === 'object' ? (w[i18n.getCurrentLanguage()] || w.en || w.ar) : w}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
          ${(Array.isArray(drug.contraindications) && drug.contraindications.length > 0) ? `
            <div class="pt-1 border-t border-rose-200/80 dark:border-rose-900/60">
              <strong class="text-rose-950 dark:text-rose-300 block mb-1">${isRtl ? 'موانع الاستعمال (Contraindications):' : 'Contraindications:'}</strong>
              <ul class="list-disc list-inside space-y-1 text-rose-900 dark:text-rose-300 font-bold">
                ${drug.contraindications.map(c => `<li>${typeof c === 'object' ? (c[i18n.getCurrentLanguage()] || c.en || c.ar) : c}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
        </div>

        <!-- 3. زر المراقبة العضلية NMT للمرخيات -->
        ${drug.neuromuscularMonitoring || drug.classification?.triadComponent === "muscle_relaxation" ? `
          <button type="button" data-acc-id="acc-nmt-${drug.id}" class="acc-toggle-btn w-full font-bold text-amber-800 dark:text-amber-400 py-1 hover:underline flex justify-between items-center text-right cursor-pointer">
            <span>${isRtl ? '⚡ المراقبة العضلية وتوصيات الإفاقة (NMT Monitoring)' : '⚡ Neuromuscular Monitoring (NMT) & Recovery'}</span>
            <span class="text-slate-400 text-[10px]">${isAccNmtOpen ? '▲' : '▼'}</span>
          </button>
          <div id="acc-nmt-${drug.id}" class="${isAccNmtOpen ? '' : 'hidden'} p-3 bg-amber-50/60 dark:bg-amber-950/40 rounded-xl space-y-1.5 border border-amber-200 dark:border-amber-900/60 text-[11px] text-amber-950 dark:text-amber-200 leading-relaxed">
            <p><strong>${isRtl ? 'نمط المراقبة الموصى به:' : 'Recommended Modality:'}</strong> <bdi dir="ltr" class="font-mono font-bold">${drug.neuromuscularMonitoring?.modality || 'Quantitative NMT'}</bdi></p>
            <p><strong>${isRtl ? 'معيار نزع الأنبوب الآمن (Extubation Target):' : 'Safe Extubation Criteria:'}</strong> <bdi dir="ltr" class="font-mono font-bold text-emerald-800 dark:text-emerald-400">TOF Ratio ≥ 0.9</bdi></p>
          </div>
        ` : ''}

      </div>

    </article>
  `;
}

function renderCalculationResultBoxHTML(calcResult, patient) {
  if (!calcResult) return '';
  const isRtl = i18n.isRTL();

  if (calcResult.status === "BLOCKED") {
    const errorText = (calcResult.blockingErrors && calcResult.blockingErrors.length) 
      ? calcResult.blockingErrors.join(" • ") 
      : (calcResult.error || (isRtl ? "يرجى استكمال وزن أو عمر المريض" : "Please enter patient weight or age"));
    return `
      <div class="p-3 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-900 dark:text-amber-200 text-xs space-y-1">
        <div class="font-bold flex items-center gap-1">
          <span>🛑</span>
          <span>${isRtl ? 'الحساب معلق:' : 'Calculation Suspended:'}</span>
        </div>
        <p class="text-[11px] text-amber-800 dark:text-amber-300">${errorText}</p>
      </div>
    `;
  }

  if (calcResult.macResults && calcResult.macResults.adjusted1Mac) {
    const mac = calcResult.macResults;
    return `
      <div class="p-3 bg-indigo-50/80 dark:bg-indigo-950/50 border-2 border-indigo-400/80 dark:border-indigo-800 rounded-xl space-y-2 text-xs">
        <div class="flex justify-between items-center border-b border-indigo-200 dark:border-indigo-800 pb-1.5 font-bold text-indigo-950 dark:text-indigo-200">
          <span>💨 ${isRtl ? `تركيز الـ MAC المصحح لعمر (${mac.patientAge} سنة):` : `Age-Adjusted MAC (${mac.patientAge} yrs):`}</span>
          <span class="font-mono text-indigo-900 dark:text-indigo-300 text-base font-extrabold" dir="ltr">1.0 MAC = ${mac.adjusted1Mac}%</span>
        </div>
        ${mac.guidanceRange ? `
          <div class="flex justify-between items-center text-[11px] text-indigo-900 dark:text-indigo-300 font-semibold">
            <span>${isRtl ? 'النطاق الجراحي الاسترشادي (0.5 – 1.3 MAC):' : 'Surgical Anesthesia Range (0.5 – 1.3 MAC):'}</span>
            <span class="font-mono font-bold text-indigo-950 dark:text-indigo-200" dir="ltr">${mac.guidanceRange.min05Mac}% – ${mac.guidanceRange.max13Mac}%</span>
          </div>
        ` : ''}
        <p class="text-[10px] text-indigo-700 dark:text-indigo-400 italic">${mac.clinicalModifiersNote || ''}</p>
      </div>
    `;
  }

  if (calcResult.pairingResult) {
    const pair = calcResult.pairingResult;
    return `
      <div class="p-3 bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 rounded-xl space-y-2 text-xs">
        <div class="grid grid-cols-2 gap-2 text-center">
          <div class="bg-white dark:bg-slate-800 p-2 rounded-lg border border-teal-200 dark:border-teal-700">
            <span class="block text-[10px] text-teal-800 dark:text-teal-300 font-bold">${isRtl ? 'جرعة الغليكوبيرولات المقترنة:' : 'Paired Glycopyrrolate Dose:'}</span>
            <strong class="font-mono text-base text-teal-950 dark:text-teal-100 block mt-0.5" dir="ltr">${calcResult.calculatedDose?.min || ''} mg</strong>
          </div>
          <div class="bg-emerald-50 dark:bg-emerald-950/50 p-2 rounded-lg border border-emerald-300 dark:border-emerald-700 shadow-2xs">
            <span class="block text-[10px] text-emerald-900 dark:text-emerald-300 font-bold">${isRtl ? 'حجم السرنجة المطلوب:' : 'Required Syringe Volume:'}</span>
            <strong class="font-mono text-base text-emerald-950 dark:text-emerald-100 block mt-0.5" dir="ltr">${calcResult.calculatedVolume?.display || ''}</strong>
          </div>
        </div>
        <p class="text-[10px] text-teal-700 dark:text-teal-400 font-mono text-center">${pair.pairingRatio || ''}</p>
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
          <div class="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 p-2.5 rounded-xl text-center">
            <span class="block text-[10px] font-bold text-blue-900 dark:text-blue-300">${isRtl ? '🎯 الجرعة الصافية' : '🎯 Net Dose'}</span>
            <strong class="font-mono text-base text-blue-950 dark:text-blue-100 font-extrabold block mt-0.5" dir="ltr"><bdi>${doseDisplay}</bdi></strong>
            <span class="block text-[9px] text-blue-700 dark:text-blue-400 font-medium mt-0.5">${patient.weight > 0 && calcResult.weightResolution ? `(${calcResult.weightResolution.selectedWeight} kg ${calcResult.weightResolution.actualTypeUsed})` : (isRtl ? 'جرعة مرجعية' : 'Reference Dose')}</span>
          </div>
        ` : ''}

        ${vol ? `
          <div class="bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500 dark:border-emerald-600 p-2.5 rounded-xl text-center shadow-2xs">
            <span class="block text-[10px] font-extrabold text-emerald-900 dark:text-emerald-300">${isRtl ? '💉 حجم السحب بالسرنجة' : '💉 Draw Volume in Syringe'}</span>
            <strong class="font-mono text-lg text-emerald-950 dark:text-emerald-100 font-black block mt-0.5" dir="ltr"><bdi>${vol.display || `${vol.min} mL`}</bdi></strong>
            <span class="block text-[9px] text-emerald-700 dark:text-emerald-400 font-bold mt-0.5">${isRtl ? 'اسحب بالسرنجة مباشرة' : 'Draw directly into syringe'}</span>
          </div>
        ` : ''}

      </div>

      ${pump ? `
        <div class="p-2 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-xl flex justify-between items-center text-xs">
          <span class="font-bold text-purple-950 dark:text-purple-300">${isRtl ? '⚡ سرعة مضخة المحاقن (Pump Rate):' : '⚡ Syringe Pump Rate:'}</span>
          <span class="font-mono font-bold text-purple-900 dark:text-purple-200 text-sm" dir="ltr"><bdi>${pump.display || `${pump.minMlPerHour} mL/hr`}</bdi></span>
        </div>
      ` : ''}

      ${ceiling ? `
        <div class="p-2 bg-amber-100/80 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 rounded-xl text-[11px] text-amber-950 dark:text-amber-200 font-semibold flex justify-between items-center">
          <span>${isRtl ? '🛑 السقف الحجمي الآمن للرشح:' : '🛑 Maximum Safe Infiltration Ceiling:'}</span>
          <span class="font-mono font-bold" dir="ltr"><bdi>${ceiling.maxSafeDoseMg} mg (${ceiling.maxSafeVolumeMl} mL max)</bdi></span>
        </div>
      ` : ''}

      ${calcResult.safetyLimits?.clamped ? `
        <div class="p-1.5 bg-rose-100 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 rounded-lg border border-rose-300 dark:border-rose-800 text-[10px] font-bold">
          ⚠️ ${isRtl ? 'تم تقييد الجرعة القصوى بالسقف الأماني المعتمد للنيوستيغمين (5.0 mg).' : 'Maximum dose clamped to safety ceiling for Neostigmine (5.0 mg).'}
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
        b.className = "triad-tab-btn px-3 py-2 rounded-xl border transition whitespace-nowrap cursor-pointer bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700";
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
