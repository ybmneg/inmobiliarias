import { repo } from '$lib/data/repository';

/**
 * Agregaciones de negocio para el dashboard (D2) y los informes (D8).
 * Leen del store por el repository, así que son reactivas dentro de $derived.
 */

const MONTHS_ES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

export interface MonthBucket {
	key: string; // 'YYYY-MM'
	label: string; // 'jul'
	count: number;
	revenue: number;
}

/** Operaciones e ingresos por mes durante los últimos `months` meses. */
export function operationsByMonth(months = 12, reference: Date = new Date()): MonthBucket[] {
	const buckets: MonthBucket[] = [];
	for (let i = months - 1; i >= 0; i--) {
		const d = new Date(reference.getFullYear(), reference.getMonth() - i, 1);
		const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
		buckets.push({ key, label: MONTHS_ES[d.getMonth()], count: 0, revenue: 0 });
	}
	const map = new Map(buckets.map((b) => [b.key, b]));
	for (const op of repo.getClosedOperations()) {
		const b = map.get(op.closedAt.slice(0, 7));
		if (b) {
			b.count += 1;
			b.revenue += op.commission;
		}
	}
	return buckets;
}

export interface CategoryBucket {
	label: string;
	count: number;
}

const SOURCE_LABELS: Record<string, string> = {
	chatbot: 'Chatbot',
	valoracion: 'Valoración',
	ficha: 'Ficha',
	oficina: 'Oficina',
	portal: 'Portal'
};

/** Reparto de leads por origen (solo orígenes con al menos 1 lead). */
export function leadsBySource(): CategoryBucket[] {
	const counts = new Map<string, number>();
	for (const l of repo.getLeads()) counts.set(l.source, (counts.get(l.source) ?? 0) + 1);
	return Object.keys(SOURCE_LABELS)
		.map((k) => ({ label: SOURCE_LABELS[k], count: counts.get(k) ?? 0 }))
		.filter((b) => b.count > 0);
}

/** Total de honorarios (ingresos) de las operaciones cerradas. */
export function totalRevenue(): number {
	return repo.getClosedOperations().reduce((sum, o) => sum + o.commission, 0);
}

export interface AgentRank {
	agentId: string;
	name: string;
	deals: number;
	revenue: number;
}

/** Ranking de agentes por ingresos generados. */
export function agentRanking(): AgentRank[] {
	const map = new Map<string, { deals: number; revenue: number }>();
	for (const op of repo.getClosedOperations()) {
		const e = map.get(op.agentId) ?? { deals: 0, revenue: 0 };
		e.deals += 1;
		e.revenue += op.commission;
		map.set(op.agentId, e);
	}
	return [...map.entries()]
		.map(([agentId, v]) => ({ agentId, name: repo.getAgentById(agentId)?.name ?? agentId, ...v }))
		.sort((a, b) => b.revenue - a.revenue);
}

/** Tiempo medio (días) desde la entrada del lead hasta el cierre. */
export function avgDaysToClose(): number {
	const ops = repo.getClosedOperations();
	if (ops.length === 0) return 0;
	const total = ops.reduce((sum, o) => {
		const days = (new Date(o.closedAt).getTime() - new Date(o.leadCreatedAt).getTime()) / 86_400_000;
		return sum + Math.max(0, days);
	}, 0);
	return Math.round(total / ops.length);
}

export interface QuarterStat {
	label: string;
	revenue: number;
	deals: number;
}
export interface QuarterlyComparison {
	current: QuarterStat;
	previous: QuarterStat;
	deltaPct: number;
}

const quarterLabel = (year: number, q: number) => `T${q + 1} ${year}`;

/** Comparativa del último trimestre con datos frente al anterior. */
export function quarterlyComparison(): QuarterlyComparison {
	const ops = repo.getClosedOperations();
	// Anclamos al trimestre de la operación más reciente (demo siempre poblada).
	const anchor = ops.length
		? new Date(Math.max(...ops.map((o) => new Date(o.closedAt).getTime())))
		: new Date();
	const curY = anchor.getFullYear();
	const curQ = Math.floor(anchor.getMonth() / 3);
	const prevQ = curQ === 0 ? 3 : curQ - 1;
	const prevY = curQ === 0 ? curY - 1 : curY;

	const stat = (year: number, q: number): QuarterStat => {
		let revenue = 0;
		let deals = 0;
		for (const o of ops) {
			const d = new Date(o.closedAt);
			if (d.getFullYear() === year && Math.floor(d.getMonth() / 3) === q) {
				revenue += o.commission;
				deals += 1;
			}
		}
		return { label: quarterLabel(year, q), revenue, deals };
	};

	const current = stat(curY, curQ);
	const previous = stat(prevY, prevQ);
	const deltaPct = previous.revenue > 0 ? ((current.revenue - previous.revenue) / previous.revenue) * 100 : 0;
	return { current, previous, deltaPct: Math.round(deltaPct) };
}
