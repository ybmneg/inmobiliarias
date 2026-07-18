<script lang="ts">
	import { dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
	import { repo, type Lead, type LeadStatus } from '$lib/data/repository';
	import LeadCard from '$lib/components/panel/LeadCard.svelte';
	import ContractModal from '$lib/components/panel/ContractModal.svelte';

	let contractLead = $state<Lead | null>(null);

	const statuses: { id: LeadStatus; label: string }[] = [
		{ id: 'nuevo', label: 'Nuevo' },
		{ id: 'contactado', label: 'Contactado' },
		{ id: 'cualificado', label: 'Cualificado' },
		{ id: 'visita', label: 'Visita' },
		{ id: 'negociacion', label: 'Negociación' },
		{ id: 'cerrado', label: 'Cerrado' },
		{ id: 'perdido', label: 'Perdido' }
	];
	const FLIP = 150;

	// Estado local del tablero, sembrado del store. En finalize sincronizamos estados.
	let board = $state(
		statuses.map((s) => ({ ...s, items: repo.getLeads().filter((l) => l.status === s.id) }))
	);
	const total = $derived(board.reduce((n, c) => n + c.items.length, 0));

	type DndDetail = CustomEvent<{ items: Lead[] }>;

	function consider(colId: LeadStatus, e: DndDetail) {
		const col = board.find((c) => c.id === colId);
		if (col) col.items = e.detail.items;
	}
	function finalize(colId: LeadStatus, e: DndDetail) {
		const col = board.find((c) => c.id === colId);
		if (!col) return;
		col.items = e.detail.items;
		for (const item of col.items) {
			if (item.status !== colId) {
				repo.setLeadStatus(item.id, colId);
				item.status = colId;
			}
		}
	}
</script>

<svelte:head><title>Leads · NEXUS INMO</title></svelte:head>

<div class="p-6 lg:p-8">
	<header class="mb-6">
		<p class="text-xs font-semibold tracking-[0.25em] text-brand-600 uppercase">Panel</p>
		<h1 class="mt-2 font-sans text-3xl font-semibold text-ink">Leads</h1>
		<p class="mt-1 text-stone-500">{total} leads · arrastra las tarjetas para cambiar su estado.</p>
	</header>

	<div class="flex gap-4 overflow-x-auto pb-4">
		{#each board as col (col.id)}
			<div class="flex w-64 shrink-0 flex-col rounded-xl border border-stone-200 bg-stone-100/60">
				<header class="flex items-center justify-between px-3 py-2.5">
					<span class="text-sm font-medium text-ink">{col.label}</span>
					<span class="rounded-full bg-white px-2 py-0.5 text-xs text-stone-500">{col.items.length}</span>
				</header>
				<div
					use:dndzone={{ items: col.items, flipDurationMs: FLIP, dropTargetStyle: {} }}
					onconsider={(e) => consider(col.id, e as DndDetail)}
					onfinalize={(e) => finalize(col.id, e as DndDetail)}
					class="flex min-h-24 flex-1 flex-col gap-2 p-2"
				>
					{#each col.items as lead (lead.id)}
						<div animate:flip={{ duration: FLIP }} class="cursor-grab active:cursor-grabbing">
							<LeadCard {lead} oncontract={() => (contractLead = lead)} />
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>

{#if contractLead}
	<ContractModal lead={contractLead} onclose={() => (contractLead = null)} />
{/if}
