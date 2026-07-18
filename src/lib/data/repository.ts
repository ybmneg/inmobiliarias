import { db, persist } from './stores.svelte';
import type {
	Agent,
	ClosedOperation,
	Country,
	Lead,
	LeadStatus,
	OperationType,
	Property,
	PropertyStatus,
	PropertyType,
	Visit,
	VisitStatus
} from './types';

// Re-exportamos los tipos para que la UI importe todo desde este único módulo.
export type * from './types';

// ---------------------------------------------------------------- helpers
const genId = (prefix: string): string => `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
const nowIso = (): string => new Date().toISOString();
const today = (): string => nowIso().slice(0, 10);
const when = (date: string, time = '00:00'): number => new Date(`${date}T${time}`).getTime();

// ------------------------------------------------------ DTOs de consulta
export interface PropertyFilters {
	query?: string;
	operation?: OperationType | 'todas';
	type?: PropertyType | 'todos';
	country?: Country | 'todos';
	city?: string | 'todas';
	minPrice?: number;
	maxPrice?: number;
	minBedrooms?: number;
	onlyAvailable?: boolean;
}

// ------------------------------------------------------ DTOs de creación
export interface NewLeadInput {
	name: string;
	phone: string;
	email?: string;
	type: Lead['type'];
	source: Lead['source'];
	temperature?: Lead['temperature'];
	propertyId?: string | null;
	budget?: number | null;
	zone?: string | null;
	needsMortgage?: boolean | null;
	urgency?: Lead['urgency'];
	notes?: string;
	agentId?: string | null;
}

export interface NewVisitInput {
	propertyId: string;
	leadId: string;
	agentId: string;
	date: string;
	time: string;
	notes?: string;
}

export interface NewOperationInput {
	propertyId?: string | null;
	propertyTitle: string;
	type: PropertyType;
	operation: OperationType;
	city: string;
	zone: string;
	country: Country;
	agentId: string;
	clientName: string;
	finalPrice: number;
	commission?: number;
	leadCreatedAt?: string;
	closedAt?: string;
}

// ==================================================== PROPIEDADES (lectura)
function getProperties(): Property[] {
	return db.properties;
}
function getAvailableProperties(): Property[] {
	return db.properties.filter((p) => p.status === 'disponible');
}
function getFeaturedProperties(): Property[] {
	return db.properties.filter((p) => p.featured && p.status === 'disponible');
}
function getPropertyById(id: string): Property | undefined {
	return db.properties.find((p) => p.id === id);
}
function searchProperties(f: PropertyFilters = {}): Property[] {
	const q = f.query?.trim().toLowerCase();
	return db.properties.filter((p) => {
		if (f.onlyAvailable && p.status !== 'disponible') return false;
		if (f.operation && f.operation !== 'todas' && p.operation !== f.operation) return false;
		if (f.type && f.type !== 'todos' && p.type !== f.type) return false;
		if (f.country && f.country !== 'todos' && p.location.country !== f.country) return false;
		if (f.city && f.city !== 'todas' && p.location.city !== f.city) return false;
		if (f.minPrice != null && p.price < f.minPrice) return false;
		if (f.maxPrice != null && p.price > f.maxPrice) return false;
		if (f.minBedrooms != null && p.specs.bedrooms < f.minBedrooms) return false;
		if (q) {
			const hay = `${p.title} ${p.location.city} ${p.location.zone} ${p.ref}`.toLowerCase();
			if (!hay.includes(q)) return false;
		}
		return true;
	});
}

// ==================================================== PROPIEDADES (escritura)
function setPropertyStatus(id: string, status: PropertyStatus): Property | undefined {
	const p = db.properties.find((x) => x.id === id);
	if (p) p.status = status;
	persist();
	return p;
}

// ==================================================================== AGENTES
function getAgents(): Agent[] {
	return db.agents;
}
function getAgentById(id: string): Agent | undefined {
	return db.agents.find((a) => a.id === id);
}

// ============================================================= LEADS (lectura)
function getLeads(): Lead[] {
	return db.leads;
}
function getLeadById(id: string): Lead | undefined {
	return db.leads.find((l) => l.id === id);
}
function getLeadsByStatus(status: LeadStatus): Lead[] {
	return db.leads.filter((l) => l.status === status);
}
/** Leads sin actividad desde hace `days` días (excluye cerrados y perdidos). Alimenta D7. */
function getColdLeads(days = 3, reference: Date = new Date()): Lead[] {
	const threshold = reference.getTime() - days * 86_400_000;
	return db.leads.filter(
		(l) =>
			l.status !== 'cerrado' &&
			l.status !== 'perdido' &&
			when(l.lastActivityAt.slice(0, 10), l.lastActivityAt.slice(11, 16)) < threshold
	);
}

// ========================================================== LEADS (escritura)
function addLead(input: NewLeadInput): Lead {
	const ts = nowIso();
	const lead: Lead = {
		id: genId('lead'),
		name: input.name,
		phone: input.phone,
		email: input.email ?? '',
		type: input.type,
		status: 'nuevo',
		source: input.source,
		temperature: input.temperature ?? 'templado',
		agentId: input.agentId ?? null,
		propertyId: input.propertyId ?? null,
		budget: input.budget ?? null,
		zone: input.zone ?? null,
		needsMortgage: input.needsMortgage ?? null,
		urgency: input.urgency ?? null,
		notes: input.notes ?? '',
		createdAt: ts,
		lastActivityAt: ts
	};
	db.leads = [lead, ...db.leads];
	persist();
	return lead;
}
function updateLead(id: string, patch: Partial<Lead>): Lead | undefined {
	const lead = db.leads.find((l) => l.id === id);
	if (!lead) return undefined;
	Object.assign(lead, patch, { lastActivityAt: nowIso() });
	persist();
	return lead;
}
function setLeadStatus(id: string, status: LeadStatus): Lead | undefined {
	return updateLead(id, { status });
}
/** Marca actividad reciente (botón "Reactivar" de D7). */
function touchLead(id: string): Lead | undefined {
	return updateLead(id, {});
}

// ========================================================== VISITAS
function getVisits(): Visit[] {
	return db.visits;
}
function getVisitsByStatus(status: VisitStatus): Visit[] {
	return db.visits.filter((v) => v.status === status);
}
/** Visitas agendadas a partir de la fecha de referencia, ordenadas cronológicamente. */
function getUpcomingVisits(reference: Date = new Date()): Visit[] {
	const ref = reference.getTime();
	return db.visits
		.filter((v) => v.status === 'agendada' && when(v.date, v.time) >= ref)
		.sort((a, b) => when(a.date, a.time) - when(b.date, b.time));
}
function addVisit(input: NewVisitInput): Visit {
	const visit: Visit = {
		id: genId('visit'),
		propertyId: input.propertyId,
		leadId: input.leadId,
		agentId: input.agentId,
		date: input.date,
		time: input.time,
		status: 'agendada',
		notes: input.notes ?? ''
	};
	db.visits = [...db.visits, visit];
	persist();
	return visit;
}
function setVisitStatus(id: string, status: VisitStatus): Visit | undefined {
	const visit = db.visits.find((v) => v.id === id);
	if (visit) visit.status = status;
	persist();
	return visit;
}

// ========================================================== OPERACIONES CERRADAS
function getClosedOperations(): ClosedOperation[] {
	return db.operations;
}
/** Registra una operación cerrada (D5). Comisión por defecto: 3% venta / 1 mensualidad alquiler. */
function closeOperation(input: NewOperationInput): ClosedOperation {
	const op: ClosedOperation = {
		id: genId('op'),
		ref: `NX-${Math.floor(1000 + Math.random() * 9000)}`,
		propertyId: input.propertyId ?? null,
		propertyTitle: input.propertyTitle,
		type: input.type,
		operation: input.operation,
		city: input.city,
		zone: input.zone,
		country: input.country,
		agentId: input.agentId,
		clientName: input.clientName,
		finalPrice: input.finalPrice,
		commission: input.commission ?? Math.round(input.finalPrice * (input.operation === 'venta' ? 0.03 : 1)),
		leadCreatedAt: input.leadCreatedAt ?? today(),
		closedAt: input.closedAt ?? today()
	};
	db.operations = [op, ...db.operations];
	persist();
	return op;
}

/**
 * API ÚNICA de acceso a datos. Todos los componentes usan `repo`.
 * Es el único punto que cambia al migrar a Supabase (ver ROADMAP-BACKEND.md).
 */
export const repo = {
	getProperties,
	getAvailableProperties,
	getFeaturedProperties,
	getPropertyById,
	searchProperties,
	setPropertyStatus,
	getAgents,
	getAgentById,
	getLeads,
	getLeadById,
	getLeadsByStatus,
	getColdLeads,
	addLead,
	updateLead,
	setLeadStatus,
	touchLead,
	getVisits,
	getVisitsByStatus,
	getUpcomingVisits,
	addVisit,
	setVisitStatus,
	getClosedOperations,
	closeOperation
};
