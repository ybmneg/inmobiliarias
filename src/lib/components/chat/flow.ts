/**
 * Definición del flujo de cualificación del chatbot (data-driven, i18n).
 * Las opciones y preguntas guardan CLAVES de traducción; el ChatWidget las
 * resuelve con t(). Las zonas son nombres propios (t() cae a la clave = ciudad).
 */

export type AnswerValue = string | number | boolean;

export interface QuickOption {
	labelKey: string;
	value: AnswerValue;
}

export interface FlowStep {
	id: 'budget' | 'zone' | 'needsMortgage' | 'urgency';
	botKey: string;
	options: QuickOption[];
}

/** Primera pregunta: qué quiere hacer el visitante. */
export const operationOptions: QuickOption[] = [
	{ labelKey: 'chat.op.comprar', value: 'comprar' },
	{ labelKey: 'chat.op.alquilar', value: 'alquilar' },
	{ labelKey: 'chat.op.vender', value: 'vender' }
];

/** Presupuesto de compra (precio de venta). */
export const saleBudgetOptions: QuickOption[] = [
	{ labelKey: 'chat.b.s1', value: 300000 },
	{ labelKey: 'chat.b.s2', value: 500000 },
	{ labelKey: 'chat.b.s3', value: 800000 },
	{ labelKey: 'chat.b.s4', value: 1200000 }
];

/** Presupuesto de alquiler (renta mensual). */
export const rentBudgetOptions: QuickOption[] = [
	{ labelKey: 'chat.b.r1', value: 800 },
	{ labelKey: 'chat.b.r2', value: 1200 },
	{ labelKey: 'chat.b.r3', value: 2000 },
	{ labelKey: 'chat.b.r4', value: 4000 }
];

const zones = ['Madrid', 'Barcelona', 'Valencia', 'Málaga', 'Bruselas', 'Amberes', 'Gante', 'Brujas'];

/** Cualificación para compradores / inquilinos. */
export const buyerFlow: FlowStep[] = [
	{ id: 'budget', botKey: 'chat.q.budget', options: saleBudgetOptions },
	{
		id: 'zone',
		botKey: 'chat.q.zone',
		options: zones.map((z) => ({ labelKey: z, value: z }))
	},
	{
		id: 'needsMortgage',
		botKey: 'chat.q.mortgage',
		options: [
			{ labelKey: 'chat.m.yes', value: true },
			{ labelKey: 'chat.m.approved', value: true },
			{ labelKey: 'chat.m.cash', value: false }
		]
	},
	{
		id: 'urgency',
		botKey: 'chat.q.urgency',
		options: [
			{ labelKey: 'chat.u.high', value: 'alta' },
			{ labelKey: 'chat.u.mid', value: 'media' },
			{ labelKey: 'chat.u.low', value: 'baja' }
		]
	}
];
