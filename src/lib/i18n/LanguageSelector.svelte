<script lang="ts">
	import { fly } from 'svelte/transition';
	import Globe from '@lucide/svelte/icons/globe';
	import Check from '@lucide/svelte/icons/check';
	import { getLocale, setLocale, initLocale } from '$lib/i18n/i18n.svelte';
	import { locales, localeNames, type Locale } from '$lib/i18n/messages';

	let open = $state(false);

	$effect(() => {
		initLocale();
	});

	function pick(l: Locale) {
		setLocale(l);
		open = false;
	}
</script>

<div class="relative">
	<button
		onclick={() => (open = !open)}
		class="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm text-ink/70 transition-colors hover:text-ink"
		aria-label="Idioma"
		aria-expanded={open}
	>
		<Globe size={16} />
		<span class="uppercase">{getLocale()}</span>
	</button>

	{#if open}
		<button
			class="fixed inset-0 z-40 cursor-default"
			onclick={() => (open = false)}
			aria-hidden="true"
			tabindex="-1"
		></button>
		<div
			class="absolute right-0 z-50 mt-1 w-36 overflow-hidden rounded-lg border border-stone-200 bg-white shadow-lg"
			transition:fly={{ y: -6, duration: 150 }}
		>
			{#each locales as l (l)}
				<button
					onclick={() => pick(l)}
					class="flex w-full items-center justify-between px-3 py-2 text-sm text-ink transition-colors hover:bg-stone-50"
				>
					{localeNames[l]}
					{#if getLocale() === l}<Check size={14} class="text-brand-600" />{/if}
				</button>
			{/each}
		</div>
	{/if}
</div>
