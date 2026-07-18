import { browser } from '$app/environment';
import type { Agent, ClosedOperation, Lead, Property, Visit } from './types';
import { agents as seedAgents } from './seed/agents';
import { properties as seedProperties } from './seed/properties';
import { leads as seedLeads } from './seed/leads';
import { visits as seedVisits } from './seed/visits';
import { closedOperations as seedOperations } from './seed/operations';

/**
 * Estado reactivo central de NEXUS INMO (runes de Svelte 5).
 *
 * ⚠️ Los componentes NO deben importar este módulo directamente. Su única
 * puerta de acceso es `repository.ts`. Cuando se conecte Supabase, solo
 * cambiarán el repository y este store; la UI permanece intacta.
 *
 * Persistencia: sessionStorage. Sobrevive a recargas dentro de la misma
 * pestaña — así, un lead captado en la web (bot, ficha, valoración) sigue ahí
 * al abrir /panel escribiendo la URL — y se reinicia solo al cerrar la pestaña.
 */
const KEY = 'nexus-demo-db-v1';

interface Snapshot {
	properties: Property[];
	agents: Agent[];
	leads: Lead[];
	visits: Visit[];
	operations: ClosedOperation[];
}

function seed(): Snapshot {
	return {
		properties: structuredClone(seedProperties),
		agents: structuredClone(seedAgents),
		leads: structuredClone(seedLeads),
		visits: structuredClone(seedVisits),
		operations: structuredClone(seedOperations)
	};
}

function initial(): Snapshot {
	if (browser) {
		try {
			const saved = sessionStorage.getItem(KEY);
			if (saved) return JSON.parse(saved) as Snapshot;
		} catch {
			/* datos corruptos: caemos al seed */
		}
	}
	return seed();
}

const init = initial();

class DataStore {
	properties = $state<Property[]>(init.properties);
	agents = $state<Agent[]>(init.agents);
	leads = $state<Lead[]>(init.leads);
	visits = $state<Visit[]>(init.visits);
	operations = $state<ClosedOperation[]>(init.operations);
}

/** Instancia única en memoria, viva durante toda la sesión. */
export const db = new DataStore();

/** Persiste el estado en sessionStorage. Lo invoca el repository tras cada escritura. */
export function persist(): void {
	if (!browser) return;
	try {
		sessionStorage.setItem(
			KEY,
			JSON.stringify({
				properties: db.properties,
				agents: db.agents,
				leads: db.leads,
				visits: db.visits,
				operations: db.operations
			})
		);
	} catch {
		/* cuota excedida: se ignora */
	}
}

/** Reinicia la demo a los datos de fábrica (útil antes de una presentación). */
export function resetDemo(): void {
	const s = seed();
	db.properties = s.properties;
	db.agents = s.agents;
	db.leads = s.leads;
	db.visits = s.visits;
	db.operations = s.operations;
	persist();
}
