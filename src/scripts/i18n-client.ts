import { translations, type Lang } from '../i18n';

function detectBrowserLang(): Lang {
	const list = navigator.languages?.length ? navigator.languages : [navigator.language || 'en'];
	for (const locale of list) {
		const lower = String(locale).toLowerCase();
		if (lower.startsWith('ru')) return 'ru';
		if (lower.startsWith('en')) return 'en';
	}
	return 'en';
}

export function resolveLang(): Lang {
	const saved = localStorage.getItem('lang');
	if (saved === 'en' || saved === 'ru') return saved;
	return detectBrowserLang();
}

export function setLang(lang: Lang) {
	document.documentElement.lang = lang;
	localStorage.setItem('lang', lang);

	document.querySelectorAll('[data-i18n]').forEach((el) => {
		const key = el.getAttribute('data-i18n');
		if (!key || !(key in translations[lang])) return;

		const value = translations[lang][key as keyof typeof translations.ru];
		if (el instanceof HTMLMetaElement) {
			el.content = value;
		} else {
			el.textContent = value;
		}
	});

	document.querySelectorAll('[data-i18n-label]').forEach((el) => {
		const key = el.getAttribute('data-i18n-label');
		if (!key || !(key in translations[lang])) return;
		el.setAttribute(
			'aria-label',
			`${translations[lang][key as keyof typeof translations.ru]} — ${translations[lang]['link.external']}`,
		);
	});

	document.querySelectorAll('[data-i18n-aria-label]').forEach((el) => {
		const key = el.getAttribute('data-i18n-aria-label');
		if (!key || !(key in translations[lang])) return;
		el.setAttribute('aria-label', translations[lang][key as keyof typeof translations.ru]);
	});

	document.querySelectorAll('.lang-btn').forEach((btn) => {
		const isActive = btn.getAttribute('data-lang') === lang;
		btn.classList.toggle('is-active', isActive);
		btn.setAttribute('aria-pressed', String(isActive));
	});

	updatePanelToggleLabel();
}

function updatePanelToggleLabel() {
	const lang = document.documentElement.lang === 'en' ? 'en' : 'ru';
	const panel = document.getElementById('content-panel-body');
	const collapsed = panel?.classList.contains('is-collapsed');
	const panelLabel = document.getElementById('panel-toggle-label');
	const panelIcon = document.getElementById('panel-toggle-icon');
	if (!panelLabel) return;

	const key = collapsed ? 'panel.show' : 'panel.hide';
	panelLabel.setAttribute('data-i18n', key);
	panelLabel.textContent = translations[lang][key];
	if (panelIcon) panelIcon.textContent = collapsed ? '▸' : '▾';
}

export function initLangSwitch() {
	document.querySelectorAll('.lang-btn').forEach((btn) => {
		btn.addEventListener('click', () => {
			const lang = btn.getAttribute('data-lang');
			if (lang === 'en' || lang === 'ru') {
				setLang(lang);
			}
		});
	});

	setLang(resolveLang());
}

function applyPanelCollapsed(
	collapsed: boolean,
	panel: HTMLElement,
	body: HTMLElement,
	toggle: HTMLElement,
) {
	body.classList.toggle('is-collapsed', collapsed);
	panel.classList.toggle('is-collapsed', collapsed);
	body.setAttribute('aria-hidden', String(collapsed));
	toggle.setAttribute('aria-expanded', String(!collapsed));
	localStorage.setItem('panel-collapsed', String(collapsed));
	updatePanelToggleLabel();
}

export function initPanelToggle() {
	const panel = document.getElementById('content-panel');
	const body = document.getElementById('content-panel-body');
	const toggle = document.getElementById('panel-toggle');
	const label = document.getElementById('panel-toggle-label');

	if (!panel || !body || !toggle || !label) return;

	toggle.addEventListener('click', () => {
		applyPanelCollapsed(!body.classList.contains('is-collapsed'), panel, body, toggle);
	});

	if (localStorage.getItem('panel-collapsed') === 'true') {
		applyPanelCollapsed(true, panel, body, toggle);
	}
}

export function initSiteClient() {
	initLangSwitch();
	initPanelToggle();
}
