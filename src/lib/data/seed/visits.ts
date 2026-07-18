import type { Visit } from '../types';

/**
 * 8 visitas ficticias. Fecha de referencia: 2026-07-16. Mezcla de agendadas
 * (futuras, para el calendario D4), realizadas y una cancelada. El agente de
 * cada visita coincide con el agente asignado al lead y a la propiedad.
 */
export const visits: Visit[] = [
	{
		id: 'visit-01', propertyId: 'prop-15', leadId: 'lead-11', agentId: 'agent-01',
		date: '2026-07-17', time: '17:30', status: 'agendada',
		notes: 'Segunda visita a la casa histórica de Brujas.'
	},
	{
		id: 'visit-02', propertyId: 'prop-11', leadId: 'lead-04', agentId: 'agent-01',
		date: '2026-07-18', time: '11:00', status: 'agendada',
		notes: 'Comprador al contado. Llevar dossier de gastos de compraventa.'
	},
	{
		id: 'visit-03', propertyId: 'prop-07', leadId: 'lead-05', agentId: 'agent-01',
		date: '2026-07-19', time: '12:00', status: 'agendada',
		notes: 'Revisita del chalet antes de firmar la oferta de 1.400.000 €.'
	},
	{
		id: 'visit-04', propertyId: 'prop-01', leadId: 'lead-01', agentId: 'agent-01',
		date: '2026-07-20', time: '10:30', status: 'agendada',
		notes: 'Primera visita al ático de Chamberí. Financiación aprobada.'
	},
	{
		id: 'visit-05', propertyId: 'prop-02', leadId: 'lead-12', agentId: 'agent-02',
		date: '2026-07-21', time: '13:00', status: 'agendada',
		notes: 'Visita al piso señorial de Salamanca solicitada en oficina.'
	},
	{
		id: 'visit-06', propertyId: 'prop-04', leadId: 'lead-06', agentId: 'agent-02',
		date: '2026-07-12', time: '18:00', status: 'realizada',
		notes: 'Visita realizada. El cliente se lo piensa; hacer seguimiento.'
	},
	{
		id: 'visit-07', propertyId: 'prop-08', leadId: 'lead-08', agentId: 'agent-05',
		date: '2026-07-08', time: '16:00', status: 'realizada',
		notes: 'Visita realizada con el inversor. Interesado, sin prisa.'
	},
	{
		id: 'visit-08', propertyId: 'prop-03', leadId: 'lead-10', agentId: 'agent-03',
		date: '2026-06-24', time: '19:00', status: 'cancelada',
		notes: 'Cancelada por el cliente. Encontró otra opción.'
	}
];

/** Búsqueda rápida de visita por id (devuelve undefined si no existe). */
export const visitById = (id: string): Visit | undefined => visits.find((v) => v.id === id);
