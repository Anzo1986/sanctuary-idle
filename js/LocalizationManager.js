class LocalizationManager {
    constructor() {
        this.currentLang = localStorage.getItem('sanc_idle_lang') || 'en';
        this.translations = window.translations || {};

        // Expose helper globally
        window.t = this.translate.bind(this);
    }

    setLanguage(lang) {
        if (!this.translations[lang]) {
            console.error(`Language ${lang} not found.`);
            return;
        }
        this.currentLang = lang;
        localStorage.setItem('sanc_idle_lang', lang);

        this.updateUI();
        console.log(`Language switched to ${lang.toUpperCase()}`);
    }

    translate(key) {
        const langData = this.translations[this.currentLang];
        // Fallback to English if key missing in current lang
        const fallbackData = this.translations['en'];

        return (langData && langData[key]) || (fallbackData && fallbackData[key]) || key;
    }

    // Walks the DOM and updates any element with data-i18n attribute
    updateUI() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (key) {
                // Handle different element types if needed, usually textContent
                // Check if it has child nodes that are NOT text (e.g. spans for formatting)
                // For now, assume we replace the main text node or innerHTML if needed.
                // Safest to just set textContent for simple labels.

                // Special case for elements that might have dynamic values (spans inside)
                // If strict text replacement is needed, we Replace.

                // If the element has children, we might destroy them. 
                // Strategy: Only replace simple text. 
                // If the user needs formatting, we'll need placeholders.

                if (el.hasAttribute('data-i18n-html')) {
                    el.innerHTML = this.translate(key);
                } else {
                    el.textContent = this.translate(key);
                }
            }
        });


        // Also fire an event so other Managers can re-render if they have cached strings
        document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: this.currentLang } }));

        // Update Button State
        const btnEn = document.getElementById('lang-btn-en');
        const btnDe = document.getElementById('lang-btn-de');
        if (btnEn && btnDe) {
            if (this.currentLang === 'en') {
                btnEn.style.borderColor = '#00ffff';
                btnEn.style.color = '#00ffff';
                btnEn.style.background = 'rgba(0, 255, 255, 0.1)';
                btnDe.style.borderColor = '#444';
                btnDe.style.color = '#fff';
                btnDe.style.background = 'transparent';
            } else {
                btnDe.style.borderColor = '#00ffff';
                btnDe.style.color = '#00ffff';
                btnDe.style.background = 'rgba(0, 255, 255, 0.1)';
                btnEn.style.borderColor = '#444';
                btnEn.style.color = '#fff';
                btnEn.style.background = 'transparent';
            }
        }
    }
}

window.LocalizationManager = LocalizationManager;
