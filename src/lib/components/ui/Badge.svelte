<script lang="ts">
	import type { Snippet } from 'svelte';

	type Tone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';

	interface Props {
		tone?: Tone;
		dot?: boolean;
		class?: string;
		children: Snippet;
	}

	let { tone = 'neutral', dot = false, class: extra = '', children }: Props = $props();

	const tones: Record<Tone, string> = {
		neutral: 'border-stone-200 bg-white text-stone-600',
		brand: 'border-brand-500/30 bg-brand-500/10 text-brand-700',
		success: 'border-emerald-600/20 bg-emerald-50 text-emerald-700',
		warning: 'border-amber-600/20 bg-amber-50 text-amber-700',
		danger: 'border-rose-600/20 bg-rose-50 text-rose-700',
		info: 'border-sky-600/20 bg-sky-50 text-sky-700'
	};
	const dotColors: Record<Tone, string> = {
		neutral: 'bg-stone-400',
		brand: 'bg-brand-500',
		success: 'bg-emerald-500',
		warning: 'bg-amber-500',
		danger: 'bg-rose-500',
		info: 'bg-sky-500'
	};
</script>

<span
	class="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium {tones[
		tone
	]} {extra}"
>
	{#if dot}
		<span class="size-1.5 rounded-full {dotColors[tone]}"></span>
	{/if}
	{@render children()}
</span>
