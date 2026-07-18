<script lang="ts">
	import { repo } from '$lib/data/repository';
	import { formatEUR } from '$lib/utils/format';
	import StatCard from '$lib/components/panel/StatCard.svelte';
	import UserPlus from '@lucide/svelte/icons/user-plus';
	import Flame from '@lucide/svelte/icons/flame';
	import CalendarCheck from '@lucide/svelte/icons/calendar-check';
	import TrendingUp from '@lucide/svelte/icons/trending-up';
	import BarChart from '$lib/components/panel/BarChart.svelte';
	import ColdLeads from '$lib/components/panel/ColdLeads.svelte';
	import { operationsByMonth, leadsBySource } from '$lib/utils/metrics';

	const leadsNuevos = $derived(repo.getLeadsByStatus('nuevo').length);
	const leadsCalientes = $derived(
		repo.getLeads().filter((l) => l.temperature === 'caliente' && l.status !== 'perdido').length
	);
	const visitasProximas = $derived(repo.getUpcomingVisits().length);
	const ingresos = $derived(repo.getClosedOperations().reduce((sum, o) => sum + o.commission, 0));
	const revenueByMonth = $derived(operationsByMonth().map((b) => ({ label: b.label, value: b.revenue })));
	const sourceData = $derived(leadsBySource().map((s) => ({ label: s.label, value: s.count })));
</script>

<svelte:head><title>Dashboard · NEXUS INMO</title></svelte:head>

<div class="p-6 lg:p-8">
	<header class="mb-8">
		<p class="text-xs font-semibold tracking-[0.25em] text-brand-600 uppercase">Panel</p>
		<h1 class="mt-2 font-sans text-3xl font-semibold text-ink">Dashboard</h1>
		<p class="mt-1 text-stone-500">Resumen de actividad en tiempo real.</p>
	</header>

	<div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
		<StatCard label="Leads nuevos" value={`${leadsNuevos}`} icon={UserPlus} hint="Sin contactar aún" />
		<StatCard label="Leads calientes" value={`${leadsCalientes}`} icon={Flame} hint="Alta prioridad" />
		<StatCard label="Visitas próximas" value={`${visitasProximas}`} icon={CalendarCheck} hint="Agendadas" />
		<StatCard
			label="Ingresos (12 meses)"
			value={formatEUR(ingresos)}
			icon={TrendingUp}
			hint="Honorarios acumulados"
		/>
	</div>

	<div class="mt-6 grid gap-4 lg:grid-cols-2">
		<div class="rounded-xl border border-stone-200 bg-white p-5">
			<h2 class="font-sans text-sm font-semibold text-ink">Ingresos por mes</h2>
			<p class="mb-5 text-xs text-stone-400">
				Honorarios de operaciones cerradas · últimos 12 meses
			</p>
			<BarChart data={revenueByMonth} format={formatEUR} />
		</div>
		<div class="rounded-xl border border-stone-200 bg-white p-5">
			<h2 class="font-sans text-sm font-semibold text-ink">Leads por origen</h2>
			<p class="mb-5 text-xs text-stone-400">Reparto de la captación por canal</p>
			<BarChart data={sourceData} />
		</div>
	</div>

	<div class="mt-6">
		<ColdLeads />
	</div>
</div>
