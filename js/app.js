import { drugsData } from './data/drugs.js';
import { calculateDose } from './calculators/doseCalculator.js';

let currentCategory = 'All';
let customConcentrations = {};

function init() {
  const weightInput = document.getElementById('patientWeight');
  const searchInput = document.getElementById('searchInput');

  if (weightInput) weightInput.addEventListener('input', render);
  if (searchInput) searchInput.addEventListener('input', render);

  window.setCategory = (cat) => {
    currentCategory = cat;
    document.querySelectorAll('.cat-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.cat === cat);
    });
    render();
  };

  window.clearWeight = () => {
    if (weightInput) weightInput.value = '';
    render();
  };

  window.handleConcChange = (drugId, value) => {
    const customDiv = document.getElementById(`custom-conc-${drugId}`);
    if (value === 'custom') {
      if (customDiv) customDiv.classList.remove('hidden');
    } else {
      if (customDiv) customDiv.classList.add('hidden');
      delete customConcentrations[drugId];
      render();
    }
  };

  window.handleCustomConcInput = (drugId, val) => {
    const num = parseFloat(val);
    if (num && num > 0) {
      customConcentrations[drugId] = num;
    } else {
      delete customConcentrations[drugId];
    }
    render();
  };

  window.toggleAccordion = (id) => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('hidden');
  };

  render();
}

function render() {
  const container = document.getElementById('drugsContainer');
  const weightVal = parseFloat(document.getElementById('patientWeight')?.value) || 0;
  const searchVal = (document.getElementById('searchInput')?.value || '').toLowerCase();

  if (!container) return;

  const filtered = drugsData.filter(drug => {
    const matchesCat = currentCategory === 'All' || drug.category === currentCategory;
    const matchesSearch = drug.name.toLowerCase().includes(searchVal) || 
                          drug.arabicName.includes(searchVal) ||
                          drug.searchKeywords.some(k => k.toLowerCase().includes(searchVal));
    return matchesCat && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div class="text-center py-8 text-slate-400">لا توجد أدوية مطابقة للبحث</div>`;
    return;
  }

  container.innerHTML = filtered.map(drug => renderDrugCard(drug, weightVal)).join('');
}

function renderDrugCard(drug, weight) {
  const primaryInd = drug.indications[0];
  const concConfig = drug.concentrationConfig;
  
  const selectEl = document.getElementById(`conc-select-${drug.id}`);
  const selectedConcVal = selectEl ? selectEl.value : 'default';

  let currentConc = concConfig.availableConcentrations.find(c => c.isDefault)?.value || 10;
  if (selectedConcVal === 'custom' && customConcentrations[drug.id]) {
    currentConc = customConcentrations[drug.id];
  } else if (selectedConcVal !== 'default' && selectedConcVal !== 'custom') {
    currentConc = parseFloat(selectedConcVal) || currentConc;
  }

  let calcResultHTML = '';
  if (weight > 0) {
    const res = calculateDose(weight, primaryInd, currentConc, concConfig.defaultUnit);
    if (res.isValid) {
      calcResultHTML = `
        <div class="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1 text-xs">
          <div class="font-bold text-blue-900 flex justify-between">
            <span>🎯 الجرعة المحسوبة (${weight} kg):</span>
            <span>${res.doseMin} - ${res.doseMax} ${res.doseUnit}</span>
          </div>
          <div class="font-bold text-emerald-700 flex justify-between border-t border-blue-200/60 pt-1">
            <span>💉 حجم السرنجة المطلوب:</span>
            <span>${res.volMin} - ${res.volMax} mL</span>
          </div>
          ${res.isCapped ? `<div class="text-[10px] text-amber-700 font-semibold mt-1">⚠️ تم تطبيق الحد الأقصى للجرعة (${res.maxDoseLimit} ${res.doseUnit})</div>` : ''}
        </div>
      `;
    } else {
      calcResultHTML = `<div class="mt-2 text-xs text-rose-600 font-semibold">${res.error}</div>`;
    }
  }

  const isHighAlert = drug.safetyProfile.isHighAlert;
  const alertBadge = isHighAlert 
    ? `<span class="px-2 py-0.5 text-[10px] font-bold bg-rose-100 text-rose-800 rounded-md border border-rose-300">⚠️ HIGH ALERT</span>`
    : '';

  return `
    <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
      <div class="flex justify-between items-start">
        <div>
          <div class="flex items-center gap-2">
            <h3 class="font-bold text-lg text-blue-600">${drug.name}</h3>
            ${alertBadge}
          </div>
          <p class="text-xs text-slate-500">${drug.arabicName} • <span class="font-semibold text-blue-800">${drug.category}</span></p>
        </div>
      </div>

      <div class="p-2.5 bg-slate-50 rounded-xl space-y-2 text-xs">
        <div class="flex justify-between items-center">
          <span class="font-bold text-slate-700">تركيز الأمبول:</span>
          <select id="conc-select-${drug.id}" onchange="handleConcChange('${drug.id}', this.value)" class="p-1 bg-white border border-slate-300 rounded-lg text-xs">
            ${concConfig.availableConcentrations.map(c => `<option value="${c.value}">${c.label}</option>`).join('')}
            ${concConfig.customAllowed ? `<option value="custom">تعديل يدوي (Custom)</option>` : ''}
          </select>
        </div>
        <div id="custom-conc-${drug.id}" class="hidden flex items-center gap-2 pt-1">
          <label class="text-[11px] text-slate-600">أدخل التركيز (${concConfig.defaultUnit}):</label>
          <input type="number" oninput="handleCustomConcInput('${drug.id}', this.value)" placeholder="مثال: 5" class="w-24 p-1 border border-blue-400 rounded-md text-xs">
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
        <div><span class="text-slate-500">الجرعة القياسية:</span> <strong>${primaryInd.doseConfig.doseMin} - ${primaryInd.doseConfig.doseMax} ${primaryInd.doseConfig.unitLabel}</strong></div>
        <div><span class="text-slate-500">طريق الإعطاء:</span> <strong>${primaryInd.route}</strong></div>
        <div><span class="text-slate-500">بدء الفاعلية:</span> <strong>${drug.pharmacokinetics.onset}</strong></div>
        <div><span class="text-slate-500">المدة:</span> <strong>${drug.pharmacokinetics.duration}</strong></div>
      </div>

      ${calcResultHTML}

      ${drug.safetyProfile.safetyNotes ? `
        <div class="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px]">
          <strong>⚠️ تنبيه السلامة:</strong> ${drug.safetyProfile.safetyNotes}
        </div>
      ` : ''}

      <div class="border-t border-slate-100 pt-2 space-y-1 text-xs">
        <button onclick="toggleAccordion('acc-admin-${drug.id}')" class="w-full text-right font-bold text-blue-600 py-1 hover:underline">💉 الاستعمال والتخفيف ▼</button>
        <div id="acc-admin-${drug.id}" class="hidden p-2 bg-slate-50 rounded-lg text-[11px] text-slate-700 space-y-1">
          <p><strong>طريقة الإعطاء:</strong> ${drug.clinicalDetails.administration}</p>
          ${drug.dilutions.length ? `<p><strong>التخفيف:</strong> ${drug.dilutions[0].instructions}</p>` : ''}
        </div>

        <button onclick="toggleAccordion('acc-warn-${drug.id}')" class="w-full text-right font-bold text-blue-600 py-1 hover:underline">⚠️ التحذيرات وموانع الاستعمال ▼</button>
        <div id="acc-warn-${drug.id}" class="hidden p-2 bg-slate-50 rounded-lg text-[11px] text-slate-700 space-y-1">
          <p><strong>التحذيرات:</strong> ${drug.clinicalDetails.warnings.join(' • ')}</p>
          <p><strong>موانع الاستعمال:</strong> ${drug.clinicalDetails.contraindications.join(' • ')}</p>
        </div>

        <button onclick="toggleAccordion('acc-rev-${drug.id}')" class="w-full text-right font-bold text-blue-600 py-1 hover:underline">🔄 العكس والمراجع ▼</button>
        <div id="acc-rev-${drug.id}" class="hidden p-2 bg-slate-50 rounded-lg text-[11px] text-slate-700 space-y-1">
          <p><strong>المضاد (Reversal):</strong> ${drug.clinicalDetails.reversal}</p>
          <p><strong>المرجع:</strong> ${drug.references.map(r => `${r.source} (${r.topic})`).join(' • ')}</p>
        </div>
      </div>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', init);
