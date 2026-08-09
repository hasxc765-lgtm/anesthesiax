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
      drug.arabicName.includes(searchVal) ||
      drug.searchKeywords.some(keyword =>
        keyword.toLowerCase().includes(searchVal)
      );

    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="text-center py-8 text-slate-400">
        لا توجد أدوية مطابقة للبحث
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
  // 3. حساب الجرعة والحجم
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
          ? `${result.doseMin} ${result.doseUnit}`
          : `${result.doseMin} - ${result.doseMax} ${result.doseUnit}`;

      const volumeRangeText =
        result.volMin === result.volMax
          ? `${result.volMin} mL`
          : `${result.volMin} - ${result.volMax} mL`;

      calcResultHTML = `
        <div class="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1 text-xs">

          <div class="font-bold text-blue-900 flex justify-between gap-2">
            <span>🎯 الجرعة المحسوبة (${weight} kg):</span>
            <span class="text-left" dir="ltr">
              ${doseRangeText}
            </span>
          </div>

          <div class="font-bold text-emerald-700 flex justify-between gap-2 border-t border-blue-200/60 pt-1">
            <span>💉 حجم السرنجة المطلوب:</span>
            <span class="text-left" dir="ltr">
              ${volumeRangeText}
            </span>
          </div>

          ${
            result.isCapped
              ? `
                <div class="text-[10px] text-amber-700 font-semibold mt-1">
                  ⚠️ تم تطبيق الحد الأقصى للجرعة
                  (${result.maxDoseLimit} ${result.doseUnit})
                </div>
              `
              : ''
          }

        </div>
      `;

    } else {

      calcResultHTML = `
        <div class="mt-2 text-xs text-rose-600 font-semibold p-2 bg-rose-50 border border-rose-200 rounded-lg">
          ⚠️ ${result.error}
        </div>
      `;
    }
  }

  // =========================================================
  // 4. HIGH ALERT
  // =========================================================

  const isHighAlert =
    drug.safetyProfile?.isHighAlert;

  const alertBadge = isHighAlert
    ? `
      <span class="px-2 py-0.5 text-[10px] font-bold bg-rose-100 text-rose-800 rounded-md border border-rose-300">
        ⚠️ HIGH ALERT
      </span>
    `
    : '';

  // =========================================================
  // 5. قائمة الاستطبابات
  // =========================================================

  let indicationsHTML = '';

  if (drug.indications.length > 1) {

    indicationsHTML = `
      <div class="flex justify-between items-center bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs my-2 gap-2">

        <span class="font-bold text-slate-700">
          الاستطباب (Indication):
        </span>

        <select
          onchange="handleIndicationChange('${drug.id}', this.value)"
          class="p-1 bg-white border border-slate-300 rounded-lg text-xs font-semibold max-w-[60%]"
        >
          ${drug.indications.map(indication => `
            <option
              value="${indication.id}"
              ${
                indication.id === activeIndId
                  ? 'selected'
                  : ''
              }
            >
              ${indication.title}
            </option>
          `).join('')}
        </select>

      </div>
    `;

  } else {

    indicationsHTML = `
      <div class="text-xs text-slate-600 font-semibold mb-1">
        الاستطباب:
        ${activeIndication.title}
      </div>
    `;
  }

  // =========================================================
  // 6. قيمة Custom Concentration
  // =========================================================

  const customConcVal =
    state.customConcentrations[drug.id] !== undefined
      ? state.customConcentrations[drug.id]
      : '';

  // =========================================================
  // 7. بطاقة الدواء
  // =========================================================

  return `
    <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">

      <!-- Drug Header -->
      <div class="flex justify-between items-start">

        <div>

          <div class="flex items-center gap-2 flex-wrap">

            <h3 class="font-bold text-lg text-blue-600">
              ${drug.name}
            </h3>

            ${alertBadge}

          </div>

          <p class="text-xs text-slate-500">
            ${drug.arabicName}
            •
            <span class="font-semibold text-blue-800">
              ${drug.category}
            </span>
          </p>

        </div>

      </div>

      <!-- Indication -->
      ${indicationsHTML}

      <!-- Concentration -->
      <div class="p-2.5 bg-slate-50 rounded-xl space-y-2 text-xs">

        <div class="flex justify-between items-center gap-2">

          <span class="font-bold text-slate-700">
            تركيز الأمبول:
          </span>

          <select
            id="conc-select-${drug.id}"
            onchange="handleConcChange('${drug.id}', this.value)"
            class="p-1 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
          >

            ${concConfig.availableConcentrations.map(concentration => `
              <option
                value="${concentration.value}"
                ${
                  selectedConcValStr ===
                  concentration.value.toString()
                    ? 'selected'
                    : ''
                }
              >
                ${concentration.label}
              </option>
            `).join('')}

            ${
              concConfig.customAllowed
                ? `
                  <option
                    value="custom"
                    ${
                      selectedConcValStr === 'custom'
                        ? 'selected'
                        : ''
                    }
                  >
                    تعديل يدوي (Custom)
                  </option>
                `
                : ''
            }

          </select>

        </div>

        <!-- Custom Concentration -->
        <div
          id="custom-conc-${drug.id}"
          class="${
            selectedConcValStr === 'custom'
              ? ''
              : 'hidden'
          } pt-1"
        >

          <div class="flex items-center gap-2">

            <label class="text-[11px] text-slate-600">
              أدخل التركيز (${concConfig.defaultUnit}):
            </label>

            <input
              type="number"
              step="any"
              min="0"
              value="${customConcVal}"
              oninput="handleCustomConcInput('${drug.id}', this.value)"
              placeholder="مثال: 5"
              class="w-24 p-1 border border-blue-400 rounded-md text-xs font-bold"
            />

          </div>

          ${
            concConfig.minCustomConcentration !== null ||
            concConfig.maxCustomConcentration !== null
              ? `
                <div class="text-[10px] text-slate-400 mt-1">
                  النطاق المسموح:
                  ${concConfig.minCustomConcentration ?? 0}
                  -
                  ${concConfig.maxCustomConcentration ?? '∞'}
                  ${concConfig.defaultUnit}
                </div>
              `
              : ''
          }

        </div>

      </div>

      <!-- Basic Information -->
      <div class="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">

        <div>
          <span class="text-slate-500">
            الجرعة القياسية:
          </span>

          <strong>
            ${activeIndication.doseConfig.doseMin}
            ${
              activeIndication.doseConfig.doseMax !==
              activeIndication.doseConfig.doseMin
                ? ` - ${activeIndication.doseConfig.doseMax}`
                : ''
            }
            ${activeIndication.doseConfig.unitLabel}
          </strong>
        </div>

        <div>
          <span class="text-slate-500">
            طريق الإعطاء:
          </span>

          <strong>
            ${activeIndication.route}
          </strong>
        </div>

        <div>
          <span class="text-slate-500">
            بدء الفاعلية:
          </span>

          <strong>
            ${drug.pharmacokinetics.onset}
          </strong>
        </div>

        <div>
          <span class="text-slate-500">
            المدة:
          </span>

          <strong>
            ${drug.pharmacokinetics.duration}
          </strong>
        </div>

      </div>

      <!-- Calculation Result -->
      ${calcResultHTML}

      <!-- Safety -->
      ${
        drug.safetyProfile?.safetyNotes
          ? `
            <div class="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px]">

              <strong>
                ⚠️ تنبيه السلامة:
              </strong>

              ${drug.safetyProfile.safetyNotes}

            </div>
          `
          : ''
      }

      <!-- Accordions -->
      <div class="border-t border-slate-100 pt-2 space-y-1 text-xs">

        <!-- Administration -->
        <button
          onclick="toggleAccordion('acc-admin-${drug.id}')"
          class="w-full text-right font-bold text-blue-600 py-1 hover:underline"
        >
          💉 الاستعمال والتخفيف ▼
        </button>

        <div
          id="acc-admin-${drug.id}"
          class="hidden p-2 bg-slate-50 rounded-lg text-[11px] text-slate-700 space-y-1"
        >

          <p>
            <strong>
              طريقة الإعطاء:
            </strong>

            ${drug.clinicalDetails.administration}
          </p>

          ${
            drug.dilutions &&
            drug.dilutions.length
              ? `
                <p>
                  <strong>
                    التخفيف:
                  </strong>

                  ${drug.dilutions[0].instructions}
                </p>
              `
              : ''
          }

        </div>

        <!-- Warnings -->
        <button
          onclick="toggleAccordion('acc-warn-${drug.id}')"
          class="w-full text-right font-bold text-blue-600 py-1 hover:underline"
        >
          ⚠️ التحذيرات وموانع الاستعمال ▼
        </button>

        <div
          id="acc-warn-${drug.id}"
          class="hidden p-2 bg-slate-50 rounded-lg text-[11px] text-slate-700 space-y-1"
        >

          <p>
            <strong>
              التحذيرات:
            </strong>

            ${drug.clinicalDetails.warnings.join(' • ')}
          </p>

          <p>
            <strong>
              موانع الاستعمال:
            </strong>

            ${drug.clinicalDetails.contraindications.join(' • ')}
          </p>

        </div>

        <!-- Reversal & References -->
        <button
          onclick="toggleAccordion('acc-rev-${drug.id}')"
          class="w-full text-right font-bold text-blue-600 py-1 hover:underline"
        >
          🔄 العكس والمراجع ▼
        </button>

        <div
          id="acc-rev-${drug.id}"
          class="hidden p-2 bg-slate-50 rounded-lg text-[11px] text-slate-700 space-y-1"
        >

          <p>
            <strong>
              المضاد (Reversal):
            </strong>

            ${drug.clinicalDetails.reversal}
          </p>

          <p>
            <strong>
              المرجع:
            </strong>

            ${drug.references
              .map(
                reference =>
                  `${reference.source} (${reference.topic})`
              )
              .join(' • ')
            }
          </p>

        </div>

      </div>

    </div>
  `;
}

document.addEventListener(
  'DOMContentLoaded',
  init
);
