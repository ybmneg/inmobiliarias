// ============================================================
// NEXUS INMO — Modelo de dominio (capa de datos)
// Única fuente de verdad de tipos. La consumen el seed, los stores,
// el repository y toda la UI. Diseñado para mapear 1:1 a tablas de
// Supabase en el futuro sin tocar los componentes.
// ============================================================

export type Country = 'ES' | 'BE';
export type Locale = 'es' | 'fr' | 'en';

// ----------------------------------------------------------------
// Propiedades
// ----------------------------------------------------------------
export type PropertyType = 'piso' | 'atico' | 'casa' | 'chalet' | 'duplex' | 'estudio';
export type OperationType = 'venta' | 'alquiler';
export type PropertyStatus = 'disponible' | 'reservada' | 'vendida' | 'alquilada';
export type EnergyRating = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

export interface GeoLocation {
	city: string;
	zone: string;
	country: Country;
	lat: number;
	lng: number;
}

export interface PropertySpecs {
	bedrooms: number;
	bathrooms: number;
	area: number; // m² construidos
	floor?: number;
	parking: boolean;
	terrace: boolean;
	pool: boolean;
	elevator: boolean;
	energyRating: EnergyRating;
	yearBuilt: number;
}

export interface Property {
	id: string;
	ref: string; // referencia comercial (NX-XXXX)
	agentId: string;
	title: string;
	description: string;
	type: PropertyType;
	operation: OperationType;
	status: PropertyStatus;
	price: number; // € en venta · €/mes en alquiler
	location: GeoLocation;
	specs: PropertySpecs;
	amenities: string[];
	images: string[]; // URLs verificadas (la primera es la portada)
	featured: boolean; // destacada en la home
	createdAt: string; // ISO date
}

// ----------------------------------------------------------------
// Agentes
// ----------------------------------------------------------------
export type AgentRole = 'director' | 'agente' | 'captacion';

export interface Agent {
	id: string;
	name: string;
	role: AgentRole;
	email: string; // ficticio
	phone: string; // ficticio
	avatar: string; // URL
	zones: string[];
}

// ----------------------------------------------------------------
// Leads
// ----------------------------------------------------------------
export type LeadType = 'comprador' | 'vendedor';
export type LeadStatus =
	| 'nuevo'
	| 'contactado'
	| 'cualificado'
	| 'visita'
	| 'negociacion'
	| 'cerrado'
	| 'perdido';
export type LeadSource = 'chatbot' | 'valoracion' | 'ficha' | 'oficina' | 'portal';
export type LeadTemperature = 'frio' | 'templado' | 'caliente';
export type Urgency = 'baja' | 'media' | 'alta';

export interface Lead {
	id: string;
	name: string;
	phone: string;
	email: string;
	type: LeadType;
	status: LeadStatus;
	source: LeadSource;
	temperature: LeadTemperature;
	agentId: string | null;
	propertyId: string | null; // propiedad de interés
	budget: number | null; // presupuesto máximo (€)
	zone: string | null;
	needsMortgage: boolean | null;
	urgency: Urgency | null;
	notes: string;
	createdAt: string; // ISO datetime
	lastActivityAt: string; // ISO datetime — clave para detectar leads fríos
}

// ----------------------------------------------------------------
// Visitas
// ----------------------------------------------------------------
export type VisitStatus = 'agendada' | 'realizada' | 'cancelada';

export interface Visit {
	id: string;
	propertyId: string;
	leadId: string;
	agentId: string;
	date: string; // ISO date
	time: string; // 'HH:mm'
	status: VisitStatus;
	notes: string;
}

// ----------------------------------------------------------------
// Operaciones cerradas — fuente de datos de los informes (Bloque D8)
// ----------------------------------------------------------------
export interface ClosedOperation {
	id: string;
	ref: string;
	propertyId: string | null; // null si entró por oficina sin ficha
	propertyTitle: string; // snapshot del título
	type: PropertyType;
	operation: OperationType;
	city: string;
	zone: string;
	country: Country;
	agentId: string;
	clientName: string;
	finalPrice: number; // precio de cierre (€)
	commission: number; // honorarios de la agencia (€)
	leadCreatedAt: string; // ISO date — para el tiempo medio lead→cierre
	closedAt: string; // ISO date
}
