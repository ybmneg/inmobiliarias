import type { OperationType } from '$lib/data/types';

/**
 * Formateadores centralizados (locale es-ES por defecto). En E3 (i18n) se
 * podrá parametrizar el locale; de momento toda la app formatea desde aquí.
 */
const LOCALE = 'es-ES';

const eurFmt = new Intl.NumberFormat(LOCALE, {
	style: 'currency',
	currency: 'EUR',
	maximumFractionDigits: 0
});
const numFmt = new Intl.NumberFormat(LOCALE);

/** 685000 → "685.000 €" */
export function formatEUR(value: number): string {
	return eurFmt.format(value);
}

/** Precio contextual: venta "685.000 €" · alquiler "1.150 €/mes". */
export function formatPrice(price: number, operation: OperationType): string {
	return operation === 'alquiler' ? `${formatEUR(price)}/mes` : formatEUR(price);
}

/** 128 → "128 m²" */
export function formatArea(m2: number): string {
	return `${numFmt.format(m2)} m²`;
}

/** Separador de miles: 1250000 → "1.250.000" */
export function formatNumber(value: number): string {
	return numFmt.format(value);
}

/** ISO → "14 may 2026" */
export function formatDate(iso: string): string {
	return new Date(iso).toLocaleDateString(LOCALE, {
		day: 'numeric',
		month: 'short',
		year: 'numeric'
	});
}

/** ISO → "14 may 2026, 17:30" */
export function formatDateTime(iso: string): string {
	return new Date(iso).toLocaleString(LOCALE, {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});
}

/** Días completos transcurridos desde `iso` (para leads fríos / actividad). */
export function daysSince(iso: string, reference: Date = new Date()): number {
	const diff = reference.getTime() - new Date(iso).getTime();
	return Math.max(0, Math.floor(diff / 86_400_000));
}

/** "hoy" · "ayer" · "hace 3 días" */
export function relativeDays(iso: string, reference: Date = new Date()): string {
	const d = daysSince(iso, reference);
	if (d === 0) return 'hoy';
	if (d === 1) return 'ayer';
	return `hace ${d} días`;
}

/** Iniciales para avatares de respaldo: "Elena Márquez" → "EM" */
export function initials(name: string): string {
	return name
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((w) => w[0]?.toUpperCase() ?? '')
		.join('');
}
