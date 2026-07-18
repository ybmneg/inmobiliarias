<script lang="ts">
	import { slide } from 'svelte/transition';
	import Snowflake from '@lucide/svelte/icons/snowflake';
	import Send from '@lucide/svelte/icons/send';
	import { repo } from '$lib/data/repository';
	import type { Lead } from '$lib/data/types';
	import { relativeDays } from '$lib/utils/format';

	// Leads sin actividad desde hace +3 días (excluye cerrados/perdidos).
	const cold = $derived(repo.getColdLeads());
	let sent = $state<string | null>(null);

	function reactivate(lead: Lead) {
		sent = lead.name;
		repo.touchLead(lead.id); // actualiza lastActivityAt → sale de la lista de fríos
		setTimeout(() => (sent = null), 2500);
	}
</script>

<div class="rounded-xl border border-stone-200 bg-white p-5">
	<div class="mb-1 flex items-center gap-2">
		<Snowflake size={18} class="text-sky-500" />
		<h2 class="font-sans text-sm font-semibold text-ink">Seguimiento de fríos</h2>
		<span class="ml-auto rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-500">{cold.length}</span>
	</div>
	<p class="mb-3 text-xs text-stone-400">Leads sin actividad desde hace más de 3 días.</p>

	{#if sent}
		<p class="mb-3 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
			Mensaje de reactivación enviado a {sent}.
		</p>
	{/if}

	{#if cold.length > 0}
		<div class="flex flex-col divide-y divide-stone-100">
			{#each cold as lead (lead.id)}
				<div class="flex items-center gap-3 py-3" transition:slide={{ duration: 200 }}>
					<div class="min-w-0 flex-1">
						<p class="truncate text-sm font-medium text-ink">{lead.name}</p>
						<p class="text-xs text-stone-500">
							Sin actividad {relativeDays(lead.lastActivityAt)}{lead.zone ? ` · ${lead.zone}` : ''}
						</p>
					</div>
					<button
						onclick={() => reactivate(lead)}
						class="flex shrink-0 items-center gap-1.5 rounded-lg border border-stone-300 px-3 py-1.5 text-xs text-ink transition-colors hover:border-ink hover:bg-stone-50"
					>
						<Send size={13} /> Reactivar
					</button>
				</div>
			{/each}
		</div>
	{:else}
		<p class="py-6 text-center text-sm text-stone-500">No hay leads fríos. ¡Todo al día!</p>
	{/if}
</div>
