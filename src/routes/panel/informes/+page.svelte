<script lang="ts">
	import Wallet from '@lucide/svelte/icons/wallet';
	import Building2 from '@lucide/svelte/icons/building-2';
	import Clock from '@lucide/svelte/icons/clock';
	import TrendingUp from '@lucide/svelte/icons/trending-up';
	import Download from '@lucide/svelte/icons/download';
	import { repo } from '$lib/data/repository';
	import { formatEUR } from '$lib/utils/format';
	import {
		operationsByMonth,
		agentRanking,
		avgDaysToClose,
		quarterlyComparison,
		totalRevenue
	} from '$lib/utils/metrics';
	import { generateReportPdf } from '$lib/pdf/report';
	import StatCard from '$lib/components/panel/StatCard.svelte';
	import BarChart from '$lib/components/panel/BarChart.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	let generating = $state(false);
	async function download() {
		generating = true;
		await generateReportPdf({
			generatedAt: new Date().toISOString().slice(0, 10),
			totalRevenue: ingresos,
			totalDeals: ops.length,
			avgDaysToClose: tiempoMedio,
			avgCommission: comisionMedia,
			monthly,
			ranking,
			quarter
		});
		generating = false;
	}

	const ops = $derived(repo.getClosedOperations());
	const ingresos = $derived(totalRevenue());
	const comisionMedia = $derived(ops.length ? Math.round(ingresos / ops.length) : 0);
	const tiempoMedio = $derived(avgDaysToClose());
	const monthly = $derived(operationsByMonth().map((b) => ({ label: b.label, value: b.count })));
	const ranking = $derived(agentRanking());
	const maxRev = $derived(Math.max(1, ...ranking.map((r) => r.revenue)));
	const quarter = $derived(quarterlyComparison());
</script>

<svelte:head><title>Informes · NEXUS INMO</title></svelte:head>

<div class="p-6 lg:p-8">
	<header class="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
		<div>
			<p class="text-xs font-semibold tracking-[0.25em] text-brand-600 uppercase">Panel</p>
			<h1 class="mt-2 font-sans text-3xl font-semibold text-ink">Informes</h1>
			<p class="mt-1 text-stone-500">Rendimiento de las operaciones cerradas.</p>
		</div>
		<Button variant="accent" onclick={download} disabled={generating}>
			<Download size={16} />
			{generating ? 'Generando…' : 'Descargar informe (PDF)'}
		</Button>
	</header>

	<div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
		<StatCard label="Ingresos totales" value={formatEUR(ingresos)} icon={Wallet} hint="Honorarios" />
		<StatCard label="Operaciones" value={`${ops.length}`} icon={Building2} hint="Cerradas" />
		<StatCard label="Tiempo medio" value={`${tiempoMedio} días`} icon={Clock} hint="Lead → cierre" />
		<StatCard label="Comisión media" value={formatEUR(comisionMedia)} icon={TrendingUp} hint="Por operación" />
	</div>

	<div class="mt-6 grid gap-4 lg:grid-cols-3">
		<div class="rounded-xl border border-stone-200 bg-white p-5 lg:col-span-2">
			<h2 class="font-sans text-sm font-semibold text-ink">Operaciones por mes</h2>
			<p class="mb-5 text-xs text-stone-400">Últimos 12 meses</p>
			<BarChart data={monthly} />
		</div>

		<div class="rounded-xl border border-stone-200 bg-white p-5">
			<h2 class="font-sans text-sm font-semibold text-ink">Comparativa trimestral</h2>
			<p class="mb-5 text-xs text-stone-400">Ingresos por trimestre</p>
			<div class="flex items-end justify-between">
				<div>
					<p class="text-xs text-stone-500">{quarter.current.label}</p>
					<p class="mt-1 text-2xl font-semibold text-ink">{formatEUR(quarter.current.revenue)}</p>
					<p class="text-xs text-stone-400">{quarter.current.deals} operaciones</p>
				</div>
				<span
					class="rounded-full px-2 py-1 text-xs font-medium {quarter.deltaPct >= 0
						? 'bg-emerald-50 text-emerald-700'
						: 'bg-rose-50 text-rose-700'}"
				>
					{quarter.deltaPct >= 0 ? '+' : ''}{quarter.deltaPct}%
				</span>
			</div>
			<div class="mt-4 border-t border-stone-100 pt-3">
				<p class="text-xs text-stone-500">{quarter.previous.label}</p>
				<p class="mt-0.5 text-base font-medium text-stone-600">{formatEUR(quarter.previous.revenue)}</p>
			</div>
		</div>
	</div>

	<div class="mt-6 rounded-xl border border-stone-200 bg-white p-5">
		<h2 class="font-sans text-sm font-semibold text-ink">Ranking de agentes</h2>
		<p class="mb-5 text-xs text-stone-400">Por ingresos generados</p>
		<div class="flex flex-col gap-3">
			{#each ranking as r, i (r.agentId)}
				<div class="flex items-center gap-3">
					<span class="w-5 shrink-0 text-sm font-semibold text-stone-400">{i + 1}</span>
					<div class="min-w-0 flex-1">
						<div class="flex items-center justify-between gap-3">
							<span class="truncate text-sm text-ink">{r.name}</span>
							<span class="shrink-0 text-sm font-medium text-brand-700">{formatEUR(r.revenue)}</span>
						</div>
						<div class="mt-1.5 h-1.5 overflow-hidden rounded-full bg-stone-100">
							<div class="h-full rounded-full bg-brand-500" style="width: {(r.revenue / maxRev) * 100}%"></div>
						</div>
					</div>
					<span class="w-16 shrink-0 text-right text-xs text-stone-400">{r.deals} ops.</span>
				</div>
			{/each}
		</div>
	</div>
</div>
