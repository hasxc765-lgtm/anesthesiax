import { drugsData } from './data/drugs.js';
import { calculateDose } from './calculators/doseCalculator.js';

// =========================================================
// GLOBAL STATE
// =========================================================

const state = {
  currentCategory: 'All',
  selectedConcentrations: {},
  customConcentrations: {},
  selectedIndications: {}
};

// =========================================================
// INITIALIZATION
// =========================================================

function init() {
  const weightInput = document.getElementById('patientWeight');
  const searchInput = document.getElementById('searchInput');

  // Weight input
  if (weightInput) {
    weightInput.addEventListener('input', render);
  }

  // Search input
  if (searchInput) {
    searchInput.addEventListener('input', render);
  }

  // =======================================================
  // Category
  // =======================================================

  window.setCategory = (category) => {
    state.currentCategory = category;

    document.querySelectorAll('.cat-btn').forEach((button) => {
      button.classList.toggle(
        'active',
        button.dataset.cat === category
      );
    });

    render();
  };

  // =======================================================
  // Clear Weight
  // =======================================================

  window.clearWeight = () => {
    if (weightInput) {
      weightInput.value = '';
      weightInput.focus();
    }

    render();
  };

  // =======================================================
  // Indication Change
  // =======================================================

  window.handleIndicationChange = (drugId, indicationId) => {
    state.selectedIndications[drugId] = indicationId;
    render();
  };

  // =======================================================
  // Concentration Change
  // =======================================================

  window.handleConcChange = (drugId, value) => {
    state.selectedConcentrations[drugId] = value;

    // إذا رجع المستخدم إلى تركيز جاهز
    // نحذف التركيز المخصص القديم
    if (value !== 'custom') {
      delete state.customConcentrations[drugId];
    }

    render();
  };

  // =======================================================
  // Custom Concentration
  // =======================================================

  window.handleCustomConcInput = (drugId, value) => {
    const numericValue = parseFloat(value);

    if (
      Number.isFinite(numericValue) &&
      numericValue > 0
    ) {
      state.customConcentrations[drugId] = numericValue;
    } else {
      delete state.customConcentrations[drugId];
    }

    render();
  };

  // =======================================================
  // Accordion
  // =======================================================

  window.toggleAccordion = (id) => {
    const element = document.getElementById(id);

    if (!element) return;

    element.classList.toggle('hidden');
  };

  // First render
  render();
}

// =========================================================
// MAIN RENDER
// =========================================================

function render() {
  const container = document.getElementById('drugsContainer');

  if (!container) return;

  const weightInput =
    document.getElementById('patientWeight');

  const searchInput =
    document.getElementById('searchInput');

  const weight =
    parseFloat(weightInput?.value) || 0;

  const searchValue =
    (searchInput?.value || '')
      .toLowerCase()
      .trim();

  // =======================================================
  // FILTER DRUGS
  // =======================================================

  const filteredDrugs = drugsData.filter((drug) => {

    const categoryMatch =
      state.currentCategory === 'All' ||
      drug.category === state.currentCategory;

    if (!categoryMatch) {
      return false;
    }

    if (!searchValue) {
      return true;
    }

    const nameMatch =
      drug.name
        ?.toLowerCase()
        .includes(searchValue);

    const arabicNameMatch =
      drug.arabicName
        ?.toLowerCase()
        .includes(searchValue);

    const keywordMatch =
      Array.isArray(drug.searchKeywords) &&
      drug.searchKeywords.some((keyword) =>
        String(keyword)
          .toLowerCase()
          .includes(searchValue)
      );

    return (
      nameMatch ||
      arabicNameMatch ||
      keywordMatch
    );
  });

  // =======================================================
  // EMPTY SEARCH RESULT
  // =======================================================

  if (filteredDrugs.length === 0) {
    container.innerHTML = `
      <div
        class="text-center py-8 px-4 text-slate-400
               font-semibold bg-white rounded-2xl
               border border-slate-200"
      >
        🔍 لا توجد أدوية مطابقة للبحث
      </div>
    `;

    return;
  }

  // =======================================================
  // RENDER CARDS
  // =======================================================

  container.innerHTML = filteredDrugs
    .map((drug) => renderDrugCard(drug, weight))
    .join('');
}

// =========================================================
// DRUG CARD
// =========================================================

function renderDrugCard(drug, weight) {

  // =======================================================
  // SAFETY CHECKS
  // =======================================================

  if (!drug || !drug.id) {
    return '';
  }

  const indications =
    Array.isArray(drug.indications)
      ? drug.indications
      : [];

  const concConfig =
    drug.concentrationConfig || {
      defaultUnit: 'mg/mL',
      customAllowed: false,
      availableConcentrations: []
    };

  const availableConcentrations =
    Array.isArray(
      concConfig.availableConcentrations
    )
      ? concConfig.availableConcentrations
      : [];

  // =======================================================
  // ACTIVE INDICATION
  // =======================================================

  if (
    !state.selectedIndications[drug.id] &&
    indications.length > 0
  ) {
    state.selectedIndications[drug.id] =
      indications[0].id;
  }

  const activeIndicationId =
    state.selectedIndications[drug.id];

  const activeIndication =
    indications.find(
      (indication) =>
        indication.id === activeIndicationId
    ) ||
    indications[0];

  if (!activeIndication) {
    return '';
  }

  // =======================================================
  // DEFAULT CONCENTRATION
  // =======================================================

  const defaultConcentration =
    availableConcentrations.find(
      (concentration) =>
        concentration.isDefault
    ) ||
    availableConcentrations[0];

  if (
    state.selectedConcentrations[drug.id] ===
    undefined
  ) {
    state.selectedConcentrations[drug.id] =
      defaultConcentration
        ? String(defaultConcentration.value)
        : '';
  }

  const selectedConcentration =
    state.selectedConcentrations[drug.id];

  // =======================================================
  // CURRENT CONCENTRATION
  // =======================================================

  let currentConcentration = 0;
  let isCustom = false;

  if (
    selectedConcentration === 'custom'
  ) {
    isCustom = true;

    currentConcentration =
      state.customConcentrations[drug.id] || 0;

  } else {

    const parsed =
      parseFloat(selectedConcentration);

    if (Number.isFinite(parsed)) {
      currentConcentration = parsed;
    }
  }

  // =======================================================
  // CALCULATION
  // =======================================================

  let calculationHTML = '';

  if (weight > 0) {

    const result = calculateDose(
      weight,
      activeIndication,
      currentConcentration,
      concConfig.defaultUnit,
      concConfig,
      isCustom
    );

    if (result.isValid) {

      const doseRange =
        result.isFixed &&
        result.doseMin === result.doseMax
          ? `${result.doseMin} ${result.doseUnit}`
          : `${result.doseMin} - ${result.doseMax} ${result.doseUnit}`;

      const volumeRange =
        result.volMin === result.volMax
          ? `${result.volMin} mL`
          : `${result.volMin} - ${result.volMax} mL`;

      calculationHTML = `
        <div
          class="mt-3 p-3 bg-blue-50
                 border border-blue-200 rounded-xl
                 space-y-1.5 text-xs"
        >

          <div
            class="font-bold text-blue-900
                   flex justify-between
                   items-center gap-2"
          >

            <span>
              🎯 الجرعة المحسوبة (${weight} kg):
            </span>

            <span
              dir="ltr"
              class="text-left font-mono
                     font-bold text-blue-800"
              style="unicode-bidi: isolate;"
            >
              ${doseRange}
            </span>

          </div>

          <div
            class="font-bold text-emerald-700
                   flex justify-between
                   items-center gap-2
                   border-t border-blue-200/60
                   pt-1.5"
          >

            <span>
              💉 حجم السرنجة المطلوب:
            </span>

            <span
              dir="ltr"
              class="text-left font-mono
                     font-bold text-emerald-700"
              style="unicode-bidi: isolate;"
            >
              ${volumeRange}
            </span>

          </div>

          ${
            result.isCapped
              ? `
                <div
                  class="text-[10px]
                         text-amber-700
                         font-semibold
                         mt-1"
                >
                  ⚠️ تم تطبيق الحد الأقصى للجرعة
                  <span
                    dir="ltr"
                    class="font-mono"
                  >
                    (${result.maxDoseLimit}
                    ${result.doseUnit})
                  </span>
                </div>
              `
              : ''
          }

        </div>
      `;

    } else {

      calculationHTML = `
        <div
          class="mt-2 text-xs
                 text-rose-600 font-semibold
                 p-2.5 bg-rose-50
                 border border-rose-200
                 rounded-lg"
        >
          ⚠️ ${result.error}
        </div>
      `;
    }
  }

  // =======================================================
  // HIGH ALERT
  // =======================================================

  const isHighAlert =
    drug.safetyProfile?.isHighAlert === true;

  const alertBadge =
    isHighAlert
      ? `
        <span
          dir="ltr"
          class="px-2 py-0.5
                 text-[10px] font-bold
                 bg-rose-100 text-rose-800
                 rounded-md
                 border border-rose-300
                 inline-flex items-center gap-1"
        >
          ⚠️ HIGH ALERT
        </span>
      `
      : '';

  // =======================================================
  // INDICATION SELECTOR
  // =======================================================

  let indicationsHTML = '';

  if (indications.length > 1) {

    indicationsHTML = `
      <div
        class="flex justify-between
               items-center
               bg-slate-50 p-2.5
               rounded-xl
               border border-slate-200
               text-xs my-2 gap-2"
      >

        <span class="font-bold text-slate-700">
          الاستطباب (Indication):
        </span>

        <select
          onchange="
            handleIndicationChange(
              '${drug.id}',
              this.value
            )
          "
          class="p-1.5 bg-white
                 border border-slate-300
                 rounded-lg text-xs
                 font-semibold
                 max-w-[60%]
                 text-slate-900
                 focus:outline-none"
        >

          ${indications
            .map(
              (indication) => `
                <option
                  value="${indication.id}"
                  ${
                    indication.id ===
                    activeIndication.id
                      ? 'selected'
                      : ''
                  }
                >
                  ${indication.title}
                </option>
              `
            )
            .join('')}

        </select>

      </div>
    `;

  } else {

    indicationsHTML = `
      <div
        class="text-xs
               text-slate-600
               font-semibold mb-1"
      >
        الاستطباب:
        <span class="text-slate-900">
          ${activeIndication.title}
        </span>
      </div>
    `;
  }

  // =======================================================
  // CUSTOM CONCENTRATION
  // =======================================================

  const customValue =
    state.customConcentrations[drug.id] ??
    '';

  const customVisible =
    selectedConcentration === 'custom';

  // =======================================================
  // DILUTION INFORMATION
  // =======================================================

  const dilutionHTML =
    Array.isArray(drug.dilutions) &&
    drug.dilutions.length > 0
      ? `
        <p>

          <strong class="text-slate-900">
            التخفيف:
          </strong>

          <span
            class="inline-block"
            dir="ltr"
            style="unicode-bidi: isolate;"
          >
            ${drug.dilutions[0].instructions}
          </span>

        </p>
      `
      : '';

  // =======================================================
  // WARNINGS
  // =======================================================

  const warnings =
    Array.isArray(
      drug.clinicalDetails?.warnings
    )
      ? drug.clinicalDetails.warnings
      : [];

  const contraindications =
    Array.isArray(
      drug.clinicalDetails?.contraindications
    )
      ? drug.clinicalDetails.contraindications
      : [];

  // =======================================================
  // REFERENCES
  // =======================================================

  const references =
    Array.isArray(drug.references)
      ? drug.references
      : [];

  const referencesHTML =
    references.length > 0
      ? references
          .map(
            (reference) =>
              `${reference.source} (${reference.topic})`
          )
          .join(' • ')
      : 'لا توجد مراجع مسجلة';

  // =======================================================
  // DRUG CARD
  // =======================================================

  return `
    <article
      class="bg-white p-4 rounded-2xl
             border border-slate-200
             shadow-sm space-y-3"
    >

      <!-- ============================================= -->
      <!-- HEADER -->
      <!-- ============================================= -->

      <div
        class="flex justify-between
               items-start gap-2"
      >

        <div>

          <div
            class="flex items-center
                   gap-2 flex-wrap"
          >

            <h3
              class="font-bold text-lg
                     text-blue-600"
            >
              ${drug.name}
            </h3>

            ${alertBadge}

          </div>

          <p
            class="text-xs
                   text-slate-500
                   mt-0.5"
          >
            ${drug.arabicName}
            •
            <span
              class="font-semibold
                     text-blue-800"
            >
              ${drug.category}
            </span>
          </p>

        </div>

      </div>

      <!-- ============================================= -->
      <!-- INDICATION -->
      <!-- ============================================= -->

      ${indicationsHTML}

      <!-- ============================================= -->
      <!-- CONCENTRATION -->
      <!-- ============================================= -->

      <div
        class="p-2.5 bg-slate-50
               rounded-xl space-y-2
               text-xs"
      >

        <div
          class="flex justify-between
                 items-center gap-2"
        >

          <span
            class="font-bold
                   text-slate-700"
          >
            تركيز الأمبول:
          </span>

          <select
            id="conc-select-${drug.id}"
            onchange="
              handleConcChange(
                '${drug.id}',
                this.value
              )
            "
            class="p-1.5 bg-white
                   border border-slate-300
                   rounded-lg text-xs
                   font-semibold
                   text-slate-900
                   focus:outline-none"
            dir="ltr"
          >

            ${availableConcentrations
              .map(
                (concentration) => `
                  <option
                    value="${concentration.value}"
                    ${
                      selectedConcentration ===
                      String(concentration.value)
                        ? 'selected'
                        : ''
                    }
                  >
                    ${concentration.label}
                  </option>
                `
              )
              .join('')}

            ${
              concConfig.customAllowed
                ? `
                  <option
                    value="custom"
                    ${
                      selectedConcentration ===
                      'custom'
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
          class="
            ${customVisible ? '' : 'hidden'}
            pt-1
          "
        >

          <div
            class="flex items-center
                   gap-2 justify-between"
          >

            <label
              class="text-[11px]
                     text-slate-600"
            >
              أدخل التركيز
              (${concConfig.defaultUnit}):
            </label>

            <input
              type="number"
              step="any"
              min="0"
              dir="ltr"
              value="${customValue}"
              oninput="
                handleCustomConcInput(
                  '${drug.id}',
                  this.value
                )
              "
              placeholder="مثال: 5"
              class="w-24 p-1.5
                     border border-blue-400
                     rounded-md
                     text-xs font-bold
                     text-center
                     text-slate-900
                     bg-white"
            />

          </div>

          ${
            concConfig.minCustomConcentration !==
              null ||
            concConfig.maxCustomConcentration !==
              null
              ? `
                <div
                  class="text-[10px]
                         text-slate-400
                         mt-1"
                  dir="ltr"
                >
                  Allowed Range:
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

      <!-- ============================================= -->
      <!-- BASIC INFORMATION -->
      <!-- ============================================= -->

      <div
        class="grid grid-cols-2
               gap-2 text-xs
               bg-slate-50
               p-2.5 rounded-xl
               border border-slate-100"
      >

        <div>

          <span
            class="text-slate-500
                   block mb-0.5"
          >
            الجرعة القياسية:
          </span>

          <strong
            class="font-mono
                   text-slate-900"
            dir="ltr"
            style="unicode-bidi: isolate;"
          >
            ${activeIndication.doseConfig.doseMin}${
              activeIndication.doseConfig.doseMax !==
              activeIndication.doseConfig.doseMin
                ? ` - ${activeIndication.doseConfig.doseMax}`
                : ''
            }
            ${activeIndication.doseConfig.unitLabel}
          </strong>

        </div>

        <div>

          <span
            class="text-slate-500
                   block mb-0.5"
          >
            طريق الإعطاء:
          </span>

          <strong
            class="text-slate-900"
            dir="ltr"
            style="unicode-bidi: isolate;"
          >
            ${activeIndication.route}
          </strong>

        </div>

        <div>

          <span
            class="text-slate-500
                   block mb-0.5"
          >
            بدء الفاعلية:
          </span>

          <strong
            class="font-mono
                   text-slate-900"
            dir="ltr"
            style="unicode-bidi: isolate;"
          >
            ${drug.pharmacokinetics?.onset || 'N/A'}
          </strong>

        </div>

        <div>

          <span
            class="text-slate-500
                   block mb-0.5"
          >
            المدة:
          </span>

          <strong
            class="font-mono
                   text-slate-900"
            dir="ltr"
            style="unicode-bidi: isolate;"
          >
            ${drug.pharmacokinetics?.duration || 'N/A'}
          </strong>

        </div>

      </div>

      <!-- ============================================= -->
      <!-- CALCULATION -->
      <!-- ============================================= -->

      ${calculationHTML}

      <!-- ============================================= -->
      <!-- SAFETY -->
      <!-- ============================================= -->

      ${
        drug.safetyProfile?.safetyNotes
          ? `
            <div
              class="p-2.5
                     rounded-lg
                     bg-amber-50
                     border border-amber-200
                     text-amber-900
                     text-[11px]
                     leading-relaxed"
            >

              <strong
                class="font-bold"
              >
                ⚠️ تنبيه السلامة:
              </strong>

              <span>
                ${drug.safetyProfile.safetyNotes}
              </span>

            </div>
          `
          : ''
      }

      <!-- ============================================= -->
      <!-- ACCORDIONS -->
      <!-- ============================================= -->

      <div
        class="border-t
               border-slate-100
               pt-2 space-y-1
               text-xs"
      >

        <!-- Administration -->

        <button
          type="button"
          onclick="
            toggleAccordion(
              'acc-admin-${drug.id}'
            )
          "
          class="w-full
                 font-bold
                 text-blue-600
                 py-1.5
                 hover:underline
                 flex
                 justify-between
                 items-center
                 text-right"
        >

          <span>
            💉 الاستعمال والتخفيف
          </span>

          <span
            class="text-slate-400
                   text-[10px]"
          >
            ▼
          </span>

        </button>

        <div
          id="acc-admin-${drug.id}"
          class="hidden
                 p-2.5
                 bg-slate-50
                 rounded-xl
                 text-[11px]
                 text-slate-700
                 space-y-1.5
                 border border-slate-100"
        >

          <p>

            <strong
              class="text-slate-900"
            >
              طريقة الإعطاء:
            </strong>

            <span
              dir="ltr"
              class="inline-block"
              style="unicode-bidi: isolate;"
            >
              ${drug.clinicalDetails?.administration || 'غير متوفر'}
            </span>

          </p>

          ${dilutionHTML}

        </div>

        <!-- Warnings -->

        <button
          type="button"
          onclick="
            toggleAccordion(
              'acc-warn-${drug.id}'
            )
          "
          class="w-full
                 font-bold
                 text-blue-600
                 py-1.5
                 hover:underline
                 flex
                 justify-between
                 items-center
                 text-right"
        >

          <span>
            ⚠️ التحذيرات وموانع الاستعمال
          </span>

          <span
            class="text-slate-400
                   text-[10px]"
          >
            ▼
          </span>

        </button>

        <div
          id="acc-warn-${drug.id}"
          class="hidden
                 p-2.5
                 bg-slate-50
                 rounded-xl
                 text-[11px]
                 text-slate-700
                 space-y-1.5
                 border border-slate-100"
        >

          <p>

            <strong
              class="text-slate-900"
            >
              التحذيرات:
            </strong>

            <span>
              ${
                warnings.length
                  ? warnings.join(' • ')
                  : 'لا توجد بيانات'
              }
            </span>

          </p>

          <p>

            <strong
              class="text-slate-900"
            >
              موانع الاستعمال:
            </strong>

            <span>
              ${
                contraindications.length
                  ? contraindications.join(' • ')
                  : 'لا توجد بيانات'
              }
            </span>

          </p>

          ${
            drug.safetyProfile?.blackBoxWarning
              ? `
                <div
                  class="mt-2
                         p-2
                         bg-rose-50
                         border border-rose-200
                         rounded-lg
                         text-rose-800"
                >

                  <strong>
                    ⚠️ Black Box Warning:
                  </strong>

                  <span
                    dir="ltr"
                    class="inline-block"
                    style="unicode-bidi: isolate;"
                  >
                    ${drug.safetyProfile.blackBoxWarning}
                  </span>

                </div>
              `
              : ''
          }

        </div>

        <!-- Reversal & References -->

        <button
          type="button"
          onclick="
            toggleAccordion(
              'acc-rev-${drug.id}'
            )
          "
          class="w-full
                 font-bold
                 text-blue-600
                 py-1.5
                 hover:underline
                 flex
                 justify-between
                 items-center
                 text-right"
        >

          <span>
            🔄 العكس والمراجع
          </span>

          <span
            class="text-slate-400
                   text-[10px]"
          >
            ▼
          </span>

        </button>

        <div
          id="acc-rev-${drug.id}"
          class="hidden
                 p-2.5
                 bg-slate-50
                 rounded-xl
                 text-[11px]
                 text-slate-700
                 space-y-1.5
                 border border-slate-100"
        >

          <p>

            <strong
              class="text-slate-900"
            >
              المضاد (Reversal):
            </strong>

            <span>
              ${
                drug.clinicalDetails?.reversal ||
                'لا يوجد'
              }
            </span>

          </p>

          <p>

            <strong
              class="text-slate-900"
            >
              المرجع:
            </strong>

            <span>
              ${referencesHTML}
            </span>

          </p>

        </div>

      </div>

    </article>
  `;
}

// =========================================================
// START APPLICATION
// =========================================================

document.addEventListener(
  'DOMContentLoaded',
  init
);
