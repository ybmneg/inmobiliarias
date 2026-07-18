import type { ClosedOperation } from '../types';

/**
 * 20 operaciones cerradas históricas repartidas en 12 meses (ago-2025 →
 * jun-2026). Fuente única de los informes (D8): ingresos por honorarios,
 * comparativa trimestral, ranking de agentes y tiempo medio lead→cierre
 * (closedAt − leadCreatedAt). `propertyId` es null: son operaciones ya
 * archivadas, ajenas a las 15 propiedades activas del catálogo. En venta
 * la comisión ≈ 3% del precio; en alquiler ≈ una mensualidad.
 */
export const closedOperations: ClosedOperation[] = [
	{ id: 'op-01', ref: 'NX-1901', propertyId: null, propertyTitle: 'Piso reformado en Chamberí', type: 'piso', operation: 'venta', city: 'Madrid', zone: 'Chamberí', country: 'ES', agentId: 'agent-01', clientName: 'Familia Ortega', finalPrice: 640000, commission: 19200, leadCreatedAt: '2025-06-20', closedAt: '2025-08-12' },
	{ id: 'op-02', ref: 'NX-1902', propertyId: null, propertyTitle: 'Piso con balcón en Gràcia', type: 'piso', operation: 'alquiler', city: 'Barcelona', zone: 'Gràcia', country: 'ES', agentId: 'agent-03', clientName: 'Marta Vidal', finalPrice: 1500, commission: 1500, leadCreatedAt: '2025-08-05', closedAt: '2025-08-28' },
	{ id: 'op-03', ref: 'NX-1903', propertyId: null, propertyTitle: 'Casa con patio en Ruzafa', type: 'casa', operation: 'venta', city: 'Valencia', zone: 'Ruzafa', country: 'ES', agentId: 'agent-04', clientName: 'Familia Blanco', finalPrice: 520000, commission: 15600, leadCreatedAt: '2025-07-10', closedAt: '2025-09-15' },
	{ id: 'op-04', ref: 'NX-1904', propertyId: null, propertyTitle: 'Piso junto al puerto', type: 'piso', operation: 'venta', city: 'Málaga', zone: 'Centro', country: 'ES', agentId: 'agent-05', clientName: 'Lucía Ramos', finalPrice: 298000, commission: 8940, leadCreatedAt: '2025-08-22', closedAt: '2025-09-30' },
	{ id: 'op-05', ref: 'NX-1905', propertyId: null, propertyTitle: 'Ático en Barrio de Salamanca', type: 'atico', operation: 'venta', city: 'Madrid', zone: 'Salamanca', country: 'ES', agentId: 'agent-02', clientName: 'Familia Herrero', finalPrice: 720000, commission: 21600, leadCreatedAt: '2025-08-15', closedAt: '2025-10-10' },
	{ id: 'op-06', ref: 'NX-1906', propertyId: null, propertyTitle: 'Appartement à Ixelles', type: 'piso', operation: 'venta', city: 'Bruselas', zone: 'Ixelles', country: 'BE', agentId: 'agent-02', clientName: 'Julie Lambert', finalPrice: 445000, commission: 13350, leadCreatedAt: '2025-09-12', closedAt: '2025-10-27' },
	{ id: 'op-07', ref: 'NX-1907', propertyId: null, propertyTitle: 'Ático con solárium en la Marina', type: 'atico', operation: 'alquiler', city: 'Valencia', zone: 'La Marina', country: 'ES', agentId: 'agent-04', clientName: 'Sergio Navarro', finalPrice: 2000, commission: 2000, leadCreatedAt: '2025-10-20', closedAt: '2025-11-08' },
	{ id: 'op-08', ref: 'NX-1908', propertyId: null, propertyTitle: 'Chalet con piscina en Marbella', type: 'chalet', operation: 'venta', city: 'Málaga', zone: 'Marbella', country: 'ES', agentId: 'agent-01', clientName: 'Mr. Whitaker', finalPrice: 1380000, commission: 41400, leadCreatedAt: '2025-08-30', closedAt: '2025-11-22' },
	{ id: 'op-09', ref: 'NX-1909', propertyId: null, propertyTitle: 'Maison de maître à Uccle', type: 'casa', operation: 'venta', city: 'Bruselas', zone: 'Uccle', country: 'BE', agentId: 'agent-01', clientName: 'Famille Rousseau', finalPrice: 855000, commission: 25650, leadCreatedAt: '2025-10-15', closedAt: '2025-12-05' },
	{ id: 'op-10', ref: 'NX-1910', propertyId: null, propertyTitle: 'Dúplex en el Eixample', type: 'duplex', operation: 'venta', city: 'Barcelona', zone: 'Eixample', country: 'ES', agentId: 'agent-02', clientName: 'Familia Soler', finalPrice: 705000, commission: 21150, leadCreatedAt: '2025-11-01', closedAt: '2025-12-19' },
	{ id: 'op-11', ref: 'NX-1911', propertyId: null, propertyTitle: 'Estudio junto al Retiro', type: 'estudio', operation: 'venta', city: 'Madrid', zone: 'Retiro', country: 'ES', agentId: 'agent-03', clientName: 'Alba Castro', finalPrice: 275000, commission: 8250, leadCreatedAt: '2025-12-05', closedAt: '2026-01-14' },
	{ id: 'op-12', ref: 'NX-1912', propertyId: null, propertyTitle: 'Duplex à Zurenborg', type: 'duplex', operation: 'alquiler', city: 'Amberes', zone: 'Zurenborg', country: 'BE', agentId: 'agent-04', clientName: 'Tom Claes', finalPrice: 1400, commission: 1400, leadCreatedAt: '2026-01-08', closedAt: '2026-01-29' },
	{ id: 'op-13', ref: 'NX-1913', propertyId: null, propertyTitle: 'Appartement au centre de Gand', type: 'piso', operation: 'venta', city: 'Gante', zone: 'Centrum', country: 'BE', agentId: 'agent-05', clientName: 'Elke Maes', finalPrice: 365000, commission: 10950, leadCreatedAt: '2025-12-20', closedAt: '2026-02-11' },
	{ id: 'op-14', ref: 'NX-1914', propertyId: null, propertyTitle: 'Maison historique à Bruges', type: 'casa', operation: 'venta', city: 'Brujas', zone: 'Centrum', country: 'BE', agentId: 'agent-01', clientName: 'Famille Dupont', finalPrice: 610000, commission: 18300, leadCreatedAt: '2025-12-28', closedAt: '2026-02-26' },
	{ id: 'op-15', ref: 'NX-1915', propertyId: null, propertyTitle: 'Piso señorial en Salamanca', type: 'piso', operation: 'venta', city: 'Madrid', zone: 'Salamanca', country: 'ES', agentId: 'agent-02', clientName: 'Familia Gil', finalPrice: 880000, commission: 26400, leadCreatedAt: '2026-01-20', closedAt: '2026-03-12' },
	{ id: 'op-16', ref: 'NX-1916', propertyId: null, propertyTitle: 'Ático de diseño en Chamberí', type: 'atico', operation: 'venta', city: 'Madrid', zone: 'Chamberí', country: 'ES', agentId: 'agent-03', clientName: 'Nuria Prieto', finalPrice: 668000, commission: 20040, leadCreatedAt: '2026-02-10', closedAt: '2026-03-30' },
	{ id: 'op-17', ref: 'NX-1917', propertyId: null, propertyTitle: 'Casa reformada en Valencia', type: 'casa', operation: 'venta', city: 'Valencia', zone: 'Ruzafa', country: 'ES', agentId: 'agent-04', clientName: 'Familia Aroca', finalPrice: 540000, commission: 16200, leadCreatedAt: '2026-02-25', closedAt: '2026-04-16' },
	{ id: 'op-18', ref: 'NX-1918', propertyId: null, propertyTitle: 'Estudio en Malasaña', type: 'estudio', operation: 'alquiler', city: 'Madrid', zone: 'Malasaña', country: 'ES', agentId: 'agent-03', clientName: 'Iván Molina', finalPrice: 1200, commission: 1200, leadCreatedAt: '2026-04-05', closedAt: '2026-04-28' },
	{ id: 'op-19', ref: 'NX-1919', propertyId: null, propertyTitle: 'Villa en Marbella (oficina)', type: 'chalet', operation: 'venta', city: 'Málaga', zone: 'Marbella', country: 'ES', agentId: 'agent-01', clientName: 'Mrs. Anderson', finalPrice: 1420000, commission: 42600, leadCreatedAt: '2026-03-01', closedAt: '2026-05-14' },
	{ id: 'op-20', ref: 'NX-1920', propertyId: null, propertyTitle: 'Appartement à Bruxelles', type: 'piso', operation: 'venta', city: 'Bruselas', zone: 'Ixelles', country: 'BE', agentId: 'agent-02', clientName: 'Camille Fontaine', finalPrice: 470000, commission: 14100, leadCreatedAt: '2026-04-18', closedAt: '2026-06-09' }
];

/** Búsqueda rápida de operación por id (devuelve undefined si no existe). */
export const operationById = (id: string): ClosedOperation | undefined =>
	closedOperations.find((o) => o.id === id);
