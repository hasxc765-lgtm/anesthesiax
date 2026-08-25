// js/i18n/languageManager.js
import { translations } from './translations.js';

class LanguageManager {
  constructor() {
    this.currentLang = localStorage.getItem('anesthesiax_lang') || 'ar';
    this.initDirection();
  }

  // تهيئة اتجاه ولغة المستند عند الإقلاع
  initDirection() {
    this.applyDocumentSettings();
  }

  // دالة جلب النصوص حسب المسار الشجري
  t(path, fallback = '') {
    const keys = path.split('.');
    let result = translations[this.currentLang];

    for (const key of keys) {
      if (result && result[key] !== undefined) {
        result = result[key];
      } else {
        // البحث الاحتياطي في اللغة العربية في حال نقص مفتاح
        let fallbackResult = translations['ar'];
        for (const fKey of keys) {
          if (fallbackResult && fallbackResult[fKey] !== undefined) {
            fallbackResult = fallbackResult[fKey];
          } else {
            fallbackResult = null;
            break;
          }
        }
        return fallbackResult || fallback || path;
      }
    }
    return result;
  }

  // تبديل اللغة بين العربي والإنجليزي
  toggleLanguage() {
    this.currentLang = this.currentLang === 'ar' ? 'en' : 'ar';
    localStorage.setItem('anesthesiax_lang', this.currentLang);
    this.applyDocumentSettings();

    // إرسال حدث مخصص للمتصفح لإعادة رسم الواجهات فوراً دون تحديث الصفحة
    window.dispatchEvent(
      new CustomEvent('languageChanged', {
        detail: {
          lang: this.currentLang,
          isRTL: this.currentLang === 'ar',
          dir: this.currentLang === 'ar' ? 'rtl' : 'ltr'
        }
      })
    );
  }

  // تطبيق الاتجاه واللغة على وسم <html>
  applyDocumentSettings() {
    const html = document.documentElement;
    html.lang = this.currentLang;
    html.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
  }

  getCurrentLanguage() {
    return this.currentLang;
  }

  isRTL() {
    return this.currentLang === 'ar';
  }
}

export const i18n = new LanguageManager();
export const t = (path, fallback) => i18n.t(path, fallback);
