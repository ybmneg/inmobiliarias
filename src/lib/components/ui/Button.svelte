<script lang="ts">
	import type { Snippet } from 'svelte';

	type Variant = 'primary' | 'accent' | 'outline' | 'ghost';
	type Size = 'sm' | 'md' | 'lg';

	interface Props {
		variant?: Variant;
		size?: Size;
		href?: string;
		type?: 'button' | 'submit' | 'reset';
		disabled?: boolean;
		full?: boolean;
		external?: boolean;
		bracket?: boolean; // corchetes editoriales [ ... ] estilo Manzil
		class?: string;
		onclick?: (e: MouseEvent) => void;
		children: Snippet;
	}

	let {
		variant = 'primary',
		size = 'md',
		href,
		type = 'button',
		disabled = false,
		full = false,
		external = false,
		bracket = false,
		class: extra = '',
		onclick,
		children
	}: Props = $props();

	const base =
		'inline-flex items-center justify-center gap-2 rounded-full font-medium transform-gpu transition-all duration-200 ease-[var(--ease-spring)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap';

	const variants: Record<Variant, string> = {
		primary: 'bg-ink text-white hover:-translate-y-0.5 hover:bg-brand-600',
		accent: 'bg-brand-500 text-ink hover:-translate-y-0.5 hover:bg-brand-400',
		outline: 'border border-stone-300 text-ink hover:border-ink hover:bg-white',
		ghost: 'text-ink hover:text-brand-700'
	};

	const sizes: Record<Size, string> = {
		sm: 'h-9 px-4 text-sm',
		md: 'h-11 px-6 text-sm',
		lg: 'h-13 px-8 text-base'
	};

	const cls = $derived(
		`${base} ${variants[variant]} ${sizes[size]} ${full ? 'w-full' : ''} ${extra}`
	);
</script>

{#snippet label()}
	{#if bracket}<span class="text-brand-500">[</span>{/if}
	{@render children()}
	{#if bracket}<span class="text-brand-500">]</span>{/if}
{/snippet}

{#if href}
	<a
		{href}
		class={cls}
		aria-disabled={disabled}
		target={external ? '_blank' : undefined}
		rel={external ? 'noopener noreferrer' : undefined}
		{onclick}
	>
		{@render label()}
	</a>
{:else}
	<button {type} {disabled} class={cls} {onclick}>
		{@render label()}
	</button>
{/if}
