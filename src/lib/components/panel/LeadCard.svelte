<script lang="ts">
	import type { Lead } from '$lib/data/types';
	import Flame from '@lucide/svelte/icons/flame';
	import FileText from '@lucide/svelte/icons/file-text';
	import { repo } from '$lib/data/repository';
	import { formatEUR, initials } from '$lib/utils/format';

	interface Props {
		lead: Lead;
		oncontract?: () => void;
	}
	let { lead, oncontract }: Props = $props();

	const SOURCE: Record<string, string> = {
		chatbot: 'Chatbot',
		valoracion: 'Valoración',
		ficha: 'Ficha',
		oficina: 'Oficina',
		portal: 'Portal'
	};
	const agent = $derived(lead.agentId ? repo.getAgentById(lead.agentId) : undefined);
</script>

<div class="rounded-lg border border-stone-200 bg-white p-3">
	<div class="flex items-start justify-between gap-2">
		<p class="text-sm font-medium text-ink">{lead.name}</p>
		{#if lead.temperature === 'caliente'}
			<span
				class="flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-1.5 py-0.5 text-amber-600"
				title="Lead caliente"
			>
				<Flame size={12} /> <span class="text-[10px] font-medium">Caliente</span>
			</span>
		{/if}
	</div>
	<p class="mt-1 text-xs text-stone-500">
		{SOURCE[lead.source]}{lead.zone ? ` · ${lead.zone}` : ''}
	</p>
	{#if lead.budget}
		<p class="mt-1.5 text-xs font-medium text-brand-700">{formatEUR(lead.budget)}</p>
	{/if}
	<div class="mt-2 flex items-center justify-between gap-2">
		{#if agent}
			<div class="flex min-w-0 items-center gap-1.5">
				<span
					class="grid size-5 shrink-0 place-items-center rounded-full bg-stone-100 text-[10px] font-medium text-stone-600"
				>
					{initials(agent.name)}
				</span>
				<span class="truncate text-[11px] text-stone-400">{agent.name}</span>
			</div>
		{:else}
			<span></span>
		{/if}
		<button
			type="button"
			onclick={(e) => {
				e.stopPropagation();
				oncontract?.();
			}}
			class="flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-[11px] text-stone-500 transition-colors hover:bg-stone-100 hover:text-ink"
			title="Generar contrato"
		>
			<FileText size={12} /> Contrato
		</button>
	</div>
</div>
