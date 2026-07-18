import type { Lead } from '../types';

/**
 * 12 leads ficticios repartidos por el pipeline. Fecha de referencia de la
 * demo: 2026-07-16. Los `lastActivityAt` con +3 días de antigüedad alimentan
 * el seguimiento de fríos (D7); los 'caliente' disparan las alertas 🔥 (D3).
 */
export const leads: Lead[] = [
	{
		id: 'lead-01', name: 'María González', phone: '+34 611 200 301', email: 'maria.gonzalez@email.demo',
		type: 'comprador', status: 'nuevo', source: 'chatbot', temperature: 'caliente',
		agentId: 'agent-01', propertyId: 'prop-01', budget: 700000, zone: 'Chamberí',
		needsMortgage: true, urgency: 'alta',
		notes: 'Busca ático con terraza en Chamberí. Financiación ya aprobada por su banco.',
		createdAt: '2026-07-16T09:12:00', lastActivityAt: '2026-07-16T09:12:00'
	},
	{
		id: 'lead-02', name: 'Johan De Smet', phone: '+32 471 200 302', email: 'johan.desmet@email.demo',
		type: 'comprador', status: 'contactado', source: 'portal', temperature: 'templado',
		agentId: 'agent-02', propertyId: 'prop-10', budget: 500000, zone: 'Ixelles',
		needsMortgage: true, urgency: 'media',
		notes: 'Pareja joven, primera compra en Bruselas. Pendiente de simulación hipotecaria.',
		createdAt: '2026-07-14T17:40:00', lastActivityAt: '2026-07-15T11:05:00'
	},
	{
		id: 'lead-03', name: 'Laura Fernández', phone: '+34 611 200 303', email: 'laura.fernandez@email.demo',
		type: 'vendedor', status: 'cualificado', source: 'valoracion', temperature: 'caliente',
		agentId: 'agent-02', propertyId: null, budget: null, zone: 'Salamanca',
		needsMortgage: null, urgency: 'alta',
		notes: 'Quiere vender piso heredado en Salamanca. Valoración online: 850.000 €. Muy motivada.',
		createdAt: '2026-07-13T12:30:00', lastActivityAt: '2026-07-16T08:20:00'
	},
	{
		id: 'lead-04', name: 'Antoine Lefebvre', phone: '+32 471 200 304', email: 'antoine.lefebvre@email.demo',
		type: 'comprador', status: 'visita', source: 'ficha', temperature: 'caliente',
		agentId: 'agent-01', propertyId: 'prop-11', budget: 950000, zone: 'Uccle',
		needsMortgage: false, urgency: 'alta',
		notes: 'Comprador al contado. Visita agendada a la maison de Uccle. Decisión inminente.',
		createdAt: '2026-07-10T10:15:00', lastActivityAt: '2026-07-15T16:45:00'
	},
	{
		id: 'lead-05', name: 'Carmen Ruiz', phone: '+34 611 200 305', email: 'carmen.ruiz@email.demo',
		type: 'comprador', status: 'negociacion', source: 'chatbot', temperature: 'caliente',
		agentId: 'agent-01', propertyId: 'prop-07', budget: 1400000, zone: 'Marbella',
		needsMortgage: true, urgency: 'alta',
		notes: 'Negociando el chalet de Marbella. Ha ofertado 1.400.000 €. Cierre muy probable.',
		createdAt: '2026-07-02T18:05:00', lastActivityAt: '2026-07-14T13:10:00'
	},
	{
		id: 'lead-06', name: 'David Martín', phone: '+34 611 200 306', email: 'david.martin@email.demo',
		type: 'comprador', status: 'contactado', source: 'chatbot', temperature: 'templado',
		agentId: 'agent-02', propertyId: 'prop-04', budget: 780000, zone: 'Eixample',
		needsMortgage: true, urgency: 'media',
		notes: 'Interesado en el dúplex del Eixample. No responde desde la primera llamada.',
		createdAt: '2026-07-08T09:50:00', lastActivityAt: '2026-07-11T09:50:00'
	},
	{
		id: 'lead-07', name: 'Sophie Dubois', phone: '+32 471 200 307', email: 'sophie.dubois@email.demo',
		type: 'comprador', status: 'nuevo', source: 'ficha', temperature: 'templado',
		agentId: 'agent-04', propertyId: 'prop-12', budget: 1600, zone: 'Zurenborg',
		needsMortgage: null, urgency: 'media',
		notes: 'Busca dúplex en alquiler en Amberes. Presupuesto máx. 1.600 €/mes.',
		createdAt: '2026-07-16T14:22:00', lastActivityAt: '2026-07-16T14:22:00'
	},
	{
		id: 'lead-08', name: 'Pedro Sánchez', phone: '+34 611 200 308', email: 'pedro.sanchez@email.demo',
		type: 'comprador', status: 'cualificado', source: 'portal', temperature: 'templado',
		agentId: 'agent-05', propertyId: 'prop-08', budget: 320000, zone: 'Centro',
		needsMortgage: true, urgency: 'baja',
		notes: 'Inversor. Interesado en el piso reservado junto al puerto. Sin prisa.',
		createdAt: '2026-06-28T11:30:00', lastActivityAt: '2026-07-09T10:00:00'
	},
	{
		id: 'lead-09', name: 'Isabelle Moreau', phone: '+32 471 200 309', email: 'isabelle.moreau@email.demo',
		type: 'vendedor', status: 'nuevo', source: 'valoracion', temperature: 'caliente',
		agentId: 'agent-05', propertyId: null, budget: null, zone: 'Gante',
		needsMortgage: null, urgency: 'media',
		notes: 'Solicita valoración de apartamento en el centro de Gante. Lead recién entrado.',
		createdAt: '2026-07-16T16:05:00', lastActivityAt: '2026-07-16T16:05:00'
	},
	{
		id: 'lead-10', name: 'Miguel Torres', phone: '+34 611 200 310', email: 'miguel.torres@email.demo',
		type: 'comprador', status: 'perdido', source: 'chatbot', temperature: 'frio',
		agentId: 'agent-03', propertyId: 'prop-03', budget: 1000, zone: 'Malasaña',
		needsMortgage: null, urgency: 'baja',
		notes: 'Buscaba estudio en alquiler. Encontró opción por su cuenta. Descartado.',
		createdAt: '2026-06-20T13:00:00', lastActivityAt: '2026-06-25T13:00:00'
	},
	{
		id: 'lead-11', name: 'Anaïs Peeters', phone: '+32 471 200 311', email: 'anais.peeters@email.demo',
		type: 'comprador', status: 'visita', source: 'ficha', temperature: 'caliente',
		agentId: 'agent-01', propertyId: 'prop-15', budget: 600000, zone: 'Brujas',
		needsMortgage: true, urgency: 'alta',
		notes: 'Enamorada de la casa histórica de Brujas. Segunda visita esta semana.',
		createdAt: '2026-07-11T15:20:00', lastActivityAt: '2026-07-14T18:00:00'
	},
	{
		id: 'lead-12', name: 'Javier López', phone: '+34 611 200 312', email: 'javier.lopez@email.demo',
		type: 'comprador', status: 'contactado', source: 'oficina', temperature: 'templado',
		agentId: 'agent-02', propertyId: 'prop-02', budget: 900000, zone: 'Salamanca',
		needsMortgage: false, urgency: 'media',
		notes: 'Llegó a la oficina preguntando por el piso señorial de Salamanca. Sin seguimiento reciente.',
		createdAt: '2026-07-05T10:40:00', lastActivityAt: '2026-07-10T10:40:00'
	}
];

/** Búsqueda rápida de lead por id (devuelve undefined si no existe). */
export const leadById = (id: string): Lead | undefined => leads.find((l) => l.id === id);
