import type { PropertyType } from '$lib/data/types';

/**
 * Motor de estimación de valor (demo). Calcula un rango a partir de un €/m²
 * base por ciudad, ajustado por tipo, estado y extras. Cifras coherentes con
 * los datos ficticios de mercado; no es una tasación real.
 */

export type Condition = 'nuevo' | 'bueno' | 'reformar';

export interface ValuationInput {
	type: PropertyType;
	city: string;
	area: number; // m²
	condition: Condition;
	terrace: boolean;
	parking: boolean;
	pool: boolean;
}

export interface ValuationResult {
	min: number;
	max: number;
	mid: number;
	pricePerM2: number;
}

// €/m² de referencia por ciudad.
const BASE_PER_M2: Record<string, number> = {
	Madrid: 4200,
	Barcelona: 4000,
	Valencia: 2400,
	Málaga: 2800,
	Bruselas: 3500,
	Amberes: 3000,
	Gante: 2900,
	Brujas: 3100
};
const DEFAULT_PER_M2 = 2600;

const TYPE_MULT: Record<PropertyType, number> = {
	piso: 1,
	atico: 1.15,
	casa: 1.1,
	chalet: 1.2,
	duplex: 1.05,
	estudio: 0.95
};

const CONDITION_MULT: Record<Condition, number> = {
	nuevo: 1.1,
	bueno: 1,
	reformar: 0.82
};

/** Redondea a los 1.000 € más cercanos. */
const roundK = (n: number): number => Math.round(n / 1000) * 1000;

export function estimateValue(input: ValuationInput): ValuationResult {
	const base = BASE_PER_M2[input.city] ?? DEFAULT_PER_M2;
	const extras = 1 + (input.terrace ? 0.03 : 0) + (input.parking ? 0.05 : 0) + (input.pool ? 0.08 : 0);
	const pricePerM2 = base * TYPE_MULT[input.type] * CONDITION_MULT[input.condition] * extras;
	const mid = roundK(pricePerM2 * Math.max(input.area, 1));

	return {
		mid,
		min: roundK(mid * 0.93),
		max: roundK(mid * 1.07),
		pricePerM2: Math.round(pricePerM2)
	};
}

/** Ciudades disponibles en el widget, con su país. */
export const CITIES: { name: string; country: 'ES' | 'BE' }[] = [
	{ name: 'Madrid', country: 'ES' },
	{ name: 'Barcelona', country: 'ES' },
	{ name: 'Valencia', country: 'ES' },
	{ name: 'Málaga', country: 'ES' },
	{ name: 'Bruselas', country: 'BE' },
	{ name: 'Amberes', country: 'BE' },
	{ name: 'Gante', country: 'BE' },
	{ name: 'Brujas', country: 'BE' }
];
