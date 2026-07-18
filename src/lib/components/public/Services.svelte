<script lang="ts">
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import { t } from '$lib/i18n/i18n.svelte';
	import Reveal from '$lib/components/ui/Reveal.svelte';

	const items = [1, 2, 3, 4, 5];
</script>

<section class="border-t border-stone-200 bg-white">
	<div class="mx-auto grid max-w-6xl gap-12 px-5 py-24 lg:grid-cols-[0.8fr_1.2fr]">
		<div class="lg:sticky lg:top-28 lg:self-start">
			<p class="text-xs font-semibold tracking-[0.25em] text-brand-600 uppercase">
				{t('services.eyebrow')}
			</p>
			<h2 class="mt-3 text-3xl leading-tight text-ink sm:text-4xl">{t('services.title')}</h2>
		</div>

		<div>
			{#each items as n, i (n)}
				<Reveal delay={i * 60}>
					<div class="group flex items-center gap-6 border-t border-stone-200 py-6 last:border-b">
						<span class="font-display text-sm text-brand-600">0{n}</span>
						<div class="flex-1">
							<h3 class="font-display text-xl text-ink">{t(`services.${n}.title`)}</h3>
							<p class="mt-1 text-sm text-stone-500">{t(`services.${n}.desc`)}</p>
						</div>
						<ArrowRight
							size={20}
							class="shrink-0 text-stone-300 transition-all duration-300 ease-[var(--ease-out-quint)] group-hover:translate-x-1 group-hover:text-brand-600"
						/>
					</div>
				</Reveal>
			{/each}
		</div>
	</div>
</section>
