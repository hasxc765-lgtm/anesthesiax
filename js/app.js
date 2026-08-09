import { drugsData } from './data/drugs.js';
import { calculateDose } from './calculators/doseCalculator.js';

// حفظ حالة الواجهة لمنع فقدان اختيارات المستخدم عند إعادة الرسم
const state = {
  currentCategory: 'All',
  selectedConcentrations: {},
  customConcentrations: {},
  selectedIndications: {}
};

function init() {
  const weightInput = document.getElementById('patientWeight');
  const searchInput = document.getElementById('searchInput');

  if (weightInput) {
    weightInput.addEventListener('input', render);
  }

  if (searchInput) {
    searchInput.addEventListener('input', render);
  }

  window.setCategory = (cat) => {
    state.currentCategory = cat;

    document.querySelectorAll('.cat-btn').forEach(btn => {
      btn.classList.toggle(
        'active',
        btn.dataset.cat === cat
      );
    });

    render();
  };

  window.clearWeight = () => {
    if (weightInput) {
      weightInput.value = '';
    }

    render();
  };

  window.handleIndicationChange = (drugId, indId) => {
    state.selectedIndications[drugId] = indId;
    render();
  };

  window.handleConcChange = (drugId, value) => {
    state.selectedConcentrations[drugId] = value;

    if (value !== 'custom') {
      delete state.customConcentrations[drugId];
    }

    render();
  };

  window.handleCustomConcInput = (drugId, value) => {
    const num = parseFloat(value);

    if (Number.isFinite(num) && num > 0) {
      state.customConcentrations[drugId] = num;
    } else {
      delete state.customConcentrations[drugId];
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

function render() {
  const container = document.getElementById('drugsContainer');

  const weightVal =
    parseFloat(
      document.getElementById('patientWeight')?.value
    ) || 0;

  const searchVal =
    (
      document.getElementById('searchInput')?.value || ''
    ).toLowerCase().trim();

  if (!container) return;

  const filtered = drugsData.filter(drug => {
    const matchesCategory =
      state.currentCategory === 'All' ||
      drug.category === state.currentCategory;

    const matchesSearch =
      drug.name.toLowerCase().includes(searchVal) ||
      (drug.arabicName && drug.arabicName.includes(searchVal)) ||
      (drug.searchKeywords && drug.searchKeywords.some(keyword =>
        keyword.toLowerCase().includes(searchVal)
      ));

    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="text-center py-8 text-slate-400 font-semibold bg-white rounded-2xl border border-slate-200">
        🔍 لا توجد أدوية مطابقة للبحث
      </div>
    `;
    return;
  }

  container.innerHTML = filtered
    .map(drug => renderDrugCard(drug, weightVal))
    .join('');
}

function renderDrugCard(drug, weight) {

  // =========================================================
  // 1. تحديد الاستطباب الحالي
  // =========================================================

  if (!state.selectedIndications[drug.id]) {
    state.selectedIndications[drug.id] =
      drug.indications[0]?.id || '';
  }

  const activeIndId =
    state.selectedIndications[drug.id];

  const activeIndication =
    drug.indications.find(
      indication => indication.id === activeIndId
    ) || drug.indications[0];

  if (!activeIndication) {
    return '';
  }

  // =========================================================
  // 2. إعداد التركيز وحفظ اختيار المستخدم
  // =========================================================

  const concConfig = drug.concentrationConfig;

  const defaultConcObj =
    concConfig.availableConcentrations.find(
      concentration => concentration.isDefault
    ) ||
    concConfig.availableConcentrations[0];

  if (!state.selectedConcentrations[drug.id]) {
    state.selectedConcentrations[drug.id] =
      defaultConcObj
        ? defaultConcObj.value.toString()
        : '10';
  }

  const selectedConcValStr =
    state.selectedConcentrations[drug.id];

  let currentConcNum =
    defaultConcObj
      ? defaultConcObj.value
      : 10;

  let isCustom = false;

  if (selectedConcValStr === 'custom') {

    isCustom = true;

    currentConcNum =
      state.customConcentrations[drug.id] || 0;

  } else {

    const parsedConc =
      parseFloat(selectedConcValStr);

    if (Number.isFinite(parsedConc)) {
      currentConcNum = parsedConc;
    }
  }

  // =========================================================
  // 3. حساب الجرعة والحجم مع الحماية من الانعكاس (LTR Fix)
  // =========================================================

  let calcResultHTML = '';

  if (weight > 0) {

    const result = calculateDose(
      weight,
      activeIndication,
      currentConcNum,
      concConfig.defaultUnit,
      concConfig,
      isCustom
    );

    if (result.isValid) {

      const doseRangeText =
        result.isFixed &&
        result.doseMin === result.doseMax
          ? `${result.doseMin}${result.doseUnit}`
          : `${result.doseMin} - ${result.doseMax}${result.doseUnit}`;

      const volumeRangeText =
        result.volMin === result.volMax
          ? `${result.volMin} mL`
          : `${result.volMin} -${result.volMax} mL`;

      calcResultHTML = `
        <div class="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1 text-xs">

          <div class="font-bold text-blue-900 flex justify-between items-center gap-2">
            <span>🎯 الجرعة المحسوبة (${weight} kg):</span>
            <span class="text-left font-mono font-bold text-blue-800" dir="ltr" style="unicode-bidi: isolate;">
              ${doseRangeText}
            </span>
          </div>

          <div class="font-bold text-emerald-700 flex justify-between items-center gap-2 border-t border-blue-200/60 pt-1.5">
            <span>💉 حجم السرنجة المطلوب:</span>
            <span class="text-left font-mono font-bold text-emerald-700" dir="ltr" style="unicode-bidi: isolate;">
              ${volumeRangeText}
            </span>
          </div>

          ${
            result.isCapped
              ? `
                <div class="text-[10px] text-amber-700 font-semibold mt-1 flex items-center gap-1">
                  <span>⚠️ تم تطبيق الحد الأقصى للجرعة</span>
                  <span dir="ltr" class="font-mono">(${result.maxDoseLimit} ${result.doseUnit})</span>
                </div>
              `
              : ''
          }

        </div>
      `;

    } else {

      calcResultHTML = `
        <div class="mt-2 text-xs text-rose-600 font-semibold p-2
