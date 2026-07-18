<script lang="ts">
	interface Datum {
		label: string;
		value: number;
	}
	interface Props {
		data: Datum[];
		format?: (n: number) => string;
		height?: number;
	}
	let { data, format = (n) => `${n}`, height = 180 }: Props = $props();

	const max = $derived(Math.max(1, ...data.map((d) => d.value)));
	let hovered = $state<number | null>(null);
	let mounted = $state(false);

	// Animación de entrada: las barras crecen desde 0 al montar.
	$effect(() => {
		mounted = true;
	});

	const barHeight = (v: number) => (mounted && v > 0 ? Math.max(6, (v / max) * height) : 0);
</script>

<div>
	<div class="flex items-end gap-1.5 border-b border-stone-200" style="height: {height}px">
		{#each data as d, i (d.label)}
			<div class="relative flex flex-1 flex-col items-center justify-end">
				{#if hovered === i}
					<div
						class="pointer-events-none absolute bottom-full mb-1.5 rounded-md bg-ink px-2 py-1 text-xs whitespace-nowrap text-white"
					>
						{d.label} · {format(d.value)}
					</div>
				{/if}
				<div
					class="w-full max-w-10 rounded-t bg-brand-500 transition-all duration-700 ease-[var(--ease-out-quint)] hover:bg-brand-600"
					style="height: {barHeight(d.value)}px"
					onmouseenter={() => (hovered = i)}
					onmouseleave={() => (hovered = null)}
					role="img"
					aria-label="{d.label}: {format(d.value)}"
				></div>
			</div>
		{/each}
	</div>
	<div class="mt-2 flex gap-1.5">
		{#each data as d (d.label)}
			<span class="flex-1 text-center text-xs text-stone-400">{d.label}</span>
		{/each}
	</div>
</div>
