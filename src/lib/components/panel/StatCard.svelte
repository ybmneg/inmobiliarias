<script lang="ts">
	import type { Component } from 'svelte';

	interface Props {
		label: string;
		value: string;
		icon: Component;
		hint?: string;
	}
	let { label, value, icon: Icon, hint }: Props = $props();
</script>

<div class="rounded-xl border border-stone-200 bg-white p-5">
	<div class="flex items-center justify-between gap-3">
		<span class="text-sm text-stone-500">{label}</span>
		<span class="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-500/10 text-brand-700">
			<Icon size={18} />
		</span>
	</div>
	<p class="mt-3 text-3xl font-semibold text-ink">{value}</p>
	{#if hint}<p class="mt-1 text-xs text-stone-400">{hint}</p>{/if}
</div>
