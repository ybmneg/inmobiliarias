import type { Agent } from '../types';

/** Construye la URL del avatar (retratos Unsplash verificados HTTP 200). */
const avatar = (id: string): string =>
	`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=400&q=75`;

/**
 * Equipo ficticio de NEXUS INMO. Nombres mixtos España/Bélgica para
 * encajar con ambos mercados objetivo de la demo.
 */
export const agents: Agent[] = [
	{
		id: 'agent-01',
		name: 'Elena Márquez',
		role: 'director',
		email: 'elena.marquez@nexusinmo.demo',
		phone: '+34 600 100 201',
		avatar: avatar('1494790108377-be9c29b29330'),
		zones: ['Madrid', 'Málaga', 'Brujas']
	},
	{
		id: 'agent-02',
		name: 'Marc Vermeulen',
		role: 'agente',
		email: 'marc.vermeulen@nexusinmo.demo',
		phone: '+34 600 100 202',
		avatar: avatar('1507003211169-0a1dd7228f2d'),
		zones: ['Madrid', 'Barcelona', 'Bruselas']
	},
	{
		id: 'agent-03',
		name: 'Sofía Delgado',
		role: 'agente',
		email: 'sofia.delgado@nexusinmo.demo',
		phone: '+34 600 100 203',
		avatar: avatar('1438761681033-6461ffad8d80'),
		zones: ['Madrid', 'Barcelona']
	},
	{
		id: 'agent-04',
		name: 'Thomas Janssens',
		role: 'agente',
		email: 'thomas.janssens@nexusinmo.demo',
		phone: '+32 470 100 204',
		avatar: avatar('1500648767791-00dcc994a43e'),
		zones: ['Valencia', 'Amberes']
	},
	{
		id: 'agent-05',
		name: 'Nadia El Amrani',
		role: 'captacion',
		email: 'nadia.elamrani@nexusinmo.demo',
		phone: '+34 600 100 205',
		avatar: avatar('1544005313-94ddf0286df2'),
		zones: ['Málaga', 'Gante']
	}
];

/** Búsqueda rápida de agente por id (devuelve undefined si no existe). */
export const agentById = (id: string): Agent | undefined =>
	agents.find((a) => a.id === id);
