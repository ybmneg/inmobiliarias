<script lang="ts">
	import Clock from '@lucide/svelte/icons/clock';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import User from '@lucide/svelte/icons/user';
	import CalendarX from '@lucide/svelte/icons/calendar-x';
	import { repo } from '$lib/data/repository';
	import type { VisitStatus } from '$lib/data/types';
	import Badge from '$lib/components/ui/Badge.svelte';

	let filter = $state<'proximas' | 'todas'>('proximas');

	const rows = $derived.by(() => {
		let vs = repo.getVisits().slice();
		if (filter === 'proximas') {
			const now = Date.now();
			vs = vs.filter(
				(v) => v.status === 'agendada' && new Date(`${v.date}T${v.time}`).getTime() >= now
			);
		}
		return vs
			.sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`))
			.map((v) => ({
				visit: v,
				property: repo.getPropertyById(v.propertyId),
				lead: repo.getLeadById(v.leadId),
				agent: repo.getAgentById(v.agentId)
			}));
	});

	const groups = $derived.by(() => {
		const map = new Map<string, typeof rows>();
		for (const r of rows) {
			const arr = map.get(r.visit.date) ?? [];
			arr.push(r);
			map.set(r.visit.date, arr);
		}
		return [...map.entries()].map(([date, items]) => ({ date, items }));
	});

	const dayLabel = (date: string) =>
		new Date(`${date}T00:00`).toLocaleDateString('es-ES', {
			weekday: 'long',
			day: 'numeric',
			month: 'long'
		});

	const statusTone: Record<VisitStatus, 'brand' | 'success' | 'neutral'> = {
		agendada: 'brand',
		realizada: 'success',
		cancelada: 'neutral'
	};
	const statusLabel: Record<VisitStatus, string> = {
		agendada: 'Agendada',
		realizada: 'Realizada',
		cancelada: 'Cancelada'
	};
</script>

<svelte:head><title>Visitas · NEXUS INMO</title></svelte:head>

<div class="p-6 lg:p-8">
	<header class="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
		<div>
			<p class="text-xs font-semibold tracking-[0.25em] text-brand-600 uppercase">Panel</p>
			<h1 class="mt-2 font-sans text-3xl font-semibold text-ink">Visitas</h1>
			<p class="mt-1 text-stone-500">{rows.length} visitas</p>
		</div>
		<div class="flex rounded-lg border border-stone-300 p-1">
			{#each [{ v: 'proximas', l: 'Próximas' }, { v: 'todas', l: 'Todas' }] as opt (opt.v)}
				<button
					onclick={() => (filter = opt.v as typeof filter)}
					class="rounded-md px-4 py-1.5 text-sm transition-colors {filter === opt.v
						? 'bg-ink text-white'
						: 'text-stone-600 hover:text-ink'}"
				>
					{opt.l}
				</button>
			{/each}
		</div>
	</header>

	{#if groups.length > 0}
		<div class="flex flex-col gap-8">
			{#each groups as group (group.date)}
				<div>
					<h2 class="mb-3 font-sans text-sm font-semibold text-ink capitalize">{dayLabel(group.date)}</h2>
					<div class="flex flex-col gap-2">
						{#each group.items as row (row.visit.id)}
							<div
								class="flex items-center gap-4 rounded-xl border border-stone-200 bg-white p-4"
							>
								<div class="flex w-16 shrink-0 flex-col items-center border-r border-stone-100 pr-4">
									<Clock size={16} class="text-brand-600" />
									<span class="mt-1 text-sm font-semibold text-ink">{row.visit.time}</span>
								</div>
								<div class="min-w-0 flex-1">
									<p class="flex items-center gap-1.5 truncate text-sm font-medium text-ink">
										<MapPin size={14} class="shrink-0 text-stone-400" />
										{row.property?.title ?? 'Propiedad'}
									</p>
									<p class="mt-1 flex items-center gap-1.5 truncate text-xs text-stone-500">
										<User size={13} class="shrink-0 text-stone-400" />
										{row.lead?.name ?? 'Cliente'} · {row.agent?.name ?? ''}
									</p>
								</div>
								<Badge tone={statusTone[row.visit.status]}>{statusLabel[row.visit.status]}</Badge>
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<div class="rounded-2xl border border-dashed border-stone-300 py-20 text-center">
			<CalendarX size={28} class="mx-auto text-stone-300" />
			<p class="mt-3 font-sans font-medium text-ink">No hay visitas {filter === 'proximas' ? 'próximas' : ''}.</p>
			<p class="mt-1 text-sm text-stone-500">Las visitas agendadas desde la web aparecerán aquí.</p>
		</div>
	{/if}
</div>
