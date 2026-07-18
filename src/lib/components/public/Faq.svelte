<script lang="ts">
	import { slide } from 'svelte/transition';
	import Plus from '@lucide/svelte/icons/plus';
	import { t } from '$lib/i18n/i18n.svelte';

	const items = [1, 2, 3, 4, 5];
	let openIndex = $state<number | null>(0);
	const toggle = (i: number) => (openIndex = openIndex === i ? null : i);
</script>

<section class="border-t border-stone-200 bg-white">
	<div class="mx-auto max-w-3xl px-5 py-24">
		<div class="mb-12 text-center">
			<p class="text-xs font-semibold tracking-[0.25em] text-brand-600 uppercase">{t('faq.eyebrow')}</p>
			<h2 class="mt-3 text-3xl leading-tight text-ink sm:text-4xl">{t('faq.title')}</h2>
		</div>

		<div>
			{#each items as n, i (n)}
				<div class="border-t border-stone-200 last:border-b">
					<button
						class="flex w-full items-center justify-between gap-4 py-6 text-left"
						onclick={() => toggle(i)}
						aria-expanded={openIndex === i}
					>
						<span class="font-display text-lg text-ink">{t(`faq.${n}.q`)}</span>
						<Plus
							size={20}
							class="shrink-0 text-brand-600 transition-transform duration-300 ease-[var(--ease-out-quint)] {openIndex ===
							i
								? 'rotate-45'
								: ''}"
						/>
					</button>
					{#if openIndex === i}
						<p class="pb-6 leading-relaxed text-stone-500" transition:slide={{ duration: 250 }}>
							{t(`faq.${n}.a`)}
						</p>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</section>
