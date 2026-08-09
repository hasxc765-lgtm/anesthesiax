export function renderDashboard(onSelectTool) {
  const tools = [
    {
      id: 'drugCenter',
      title: 'مركز الأدوية والسرنجات',
      subtitle: 'حاسبة جرعات أحجام أدوية التخدير',
      icon: '💊',
      status: 'active',
      badge: 'جاهز للاستخدام',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    },
    {
      id: 'airway',
      title: 'المجرى الهوائي والأنابيب',
      subtitle: 'قياسات ETT, LMA, Blade, OPA',
      icon: '🫁',
      status: 'coming_soon',
      badge: 'المرحلة القادمة',
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-300'
    },
    {
      id: 'fluidAbl',
      title: 'السوائل والنزف المسموح',
      subtitle: 'حاسبة 4-2-1 والصيام و ABL',
      icon: '💧',
      status: 'coming_soon',
      badge: 'قريباً',
      badgeClass: 'bg-slate-100 text-slate-600 border-slate-200'
    },
    {
      id: 'regionalLast',
      title: 'التخدير المناطقي و LAST',
      subtitle: 'الحد الأقصى للسمية والإنقاذ بـ Lipid',
      icon: '⚡',
      status: 'coming_soon',
      badge: 'قريباً',
      badgeClass: 'bg-slate-100 text-slate-600 border-slate-200'
    },
    {
      id: 'infusionTci',
      title: 'مضخات التنقيط المستمر',
      subtitle: 'حساب معدلات mcg/kg/min و mg/hr',
      icon: '🔂',
      status: 'coming_soon',
      badge: 'قريباً',
      badgeClass: 'bg-slate-100 text-slate-600 border-slate-200'
    },
    {
      id: 'pediatric',
      title: 'تخدير الأطفال الشامل',
      subtitle: 'حاسبة جرعات وأنابيب الأطفال',
      icon: '👶',
      status: 'coming_soon',
      badge: 'قريباً',
      badgeClass: 'bg-slate-100 text-slate-600 border-slate-200'
    },
    {
      id: 'vaporizers',
      title: 'تركيز الغازات الـ MAC',
      subtitle: 'حاسبة النسبة المئوية واستهلاك الغاز',
      icon: '💨',
      status: 'coming_soon',
      badge: 'قريباً',
      badgeClass: 'bg-slate-100 text-slate-600 border-slate-200'
    },
    {
      id: 'preOpRisk',
      title: 'تقييم المخاطر قبل العملية',
      subtitle: 'تصنيف ASA وتقييم القلب والتنفس',
      icon: '📋',
      status: 'coming_soon',
      badge: 'قريباً',
      badgeClass: 'bg-slate-100 text-slate-600 border-slate-200'
    },
    {
      id: 'abgElectrolytes',
      title: 'غازات الدم والأملاح',
      subtitle: 'تفسير ABG وتصحيح الصوديوم والبوتاسيوم',
      icon: '🧪',
      status: 'coming_soon',
      badge: 'قريباً',
      badgeClass: 'bg-slate-100 text-slate-600 border-slate-200'
    },
    {
      id: 'emergencyProtocols',
      title: 'بروتوكولات الطوارئ',
      subtitle: 'خوارزميات ACLS والحساسية والملايجنانت',
      icon: '🚨',
      status: 'coming_soon',
      badge: 'قريباً',
      badgeClass: 'bg-slate-100 text-slate-600 border-slate-200'
    },
    {
      id: 'drugInteractions',
      title: 'التداخلات الدوائية',
      subtitle: 'دليل الأدوية المزمنة والتفاعلات',
      icon: '📚',
      status: 'coming_soon',
      badge: 'قريباً',
      badgeClass: 'bg-slate-100 text-slate-600 border-slate-200'
    }
  ];

  return `
    <div class="space-y-4 max-w-2xl mx-auto">
      <!-- Welcome Banner -->
      <div class="p-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl shadow-md">
        <h2 class="text-lg font-bold">مرحباً بك في AnesthesiaX 👋</h2>
        <p class="text-xs opacity-90 mt-1">المنصة السريرية الشاملة لأدوات وحاسبات التخدير المتخصصة.</p>
      </div>

      <!-- Clinical Disclaimer Notice -->
      <div class="p-3 bg-amber-50 border-r-4 border-amber-500 text-amber-900 text-xs rounded-l-xl">
        <div class="font-bold flex items-center gap-1 mb-0.5">
          <span>⚠️</span> <span>تنبيه سلامة سريري (CLINICAL NOTICE)</span>
        </div>
        <p class="opacity-90">جميع الحاسبات مرجع استشاري وتعليمي. يجب دائماً التأكد من تركيز الأمبول والبروتوكول المحلي قبل الإعطاء.</p>
      </div>

      <!-- Tools Grid -->
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
}
