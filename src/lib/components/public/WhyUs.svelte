<script lang="ts">
	import { t } from '$lib/i18n/i18n.svelte';
	import Reveal from '$lib/components/ui/Reveal.svelte';

	const items = [1, 2, 3, 4];
</script>

<section class="mx-auto max-w-6xl px-5 py-24">
	<div class="mb-14 max-w-2xl">
		<p class="text-xs font-semibold tracking-[0.25em] text-brand-600 uppercase">{t('whyus.eyebrow')}</p>
		<h2 class="mt-3 text-3xl leading-tight text-ink sm:text-4xl">{t('whyus.title')}</h2>
	</div>

	<div class="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
		{#each items as n, i (n)}
			<Reveal delay={i * 80}>
				<div class="border-t border-stone-300 pt-5">
					<span class="font-display text-sm text-brand-600">0{n}</span>
					<h3 class="mt-3 font-display text-xl text-ink">{t(`whyus.${n}.title`)}</h3>
					<p class="mt-2 text-sm leading-relaxed text-stone-500">{t(`whyus.${n}.desc`)}</p>
				</div>
			</Reveal>
		{/each}
	</div>
</section>
