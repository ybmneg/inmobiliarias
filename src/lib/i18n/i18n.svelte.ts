import { browser } from '$app/environment';
import { messages, locales, type Locale } from './messages';

const STORAGE_KEY = 'nexus-locale';

// Idioma activo (runes). Leerlo dentro de t()/getLocale desde un componente
// crea la dependencia reactiva: al cambiar, la UI se re-renderiza.
let current = $state<Locale>('es');

/** Inicializa desde localStorage (llamar una vez en cliente). */
export function initLocale(): void {
	if (!browser) return;
	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored && locales.includes(stored as Locale)) current = stored as Locale;
}

export function getLocale(): Locale {
	return current;
}

export function setLocale(l: Locale): void {
	current = l;
	if (browser) localStorage.setItem(STORAGE_KEY, l);
}

/** Traduce una clave al idioma activo (con fallback a ES y a la propia clave). */
export function t(key: string): string {
	return messages[current][key] ?? messages.es[key] ?? key;
}
