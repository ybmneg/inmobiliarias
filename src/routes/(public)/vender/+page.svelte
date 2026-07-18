<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import { t } from '$lib/i18n/i18n.svelte';
	import ValuationWidget from '$lib/components/public/ValuationWidget.svelte';

	const benefits = ['vender.benefit1', 'vender.benefit2', 'vender.benefit3'];
</script>

<svelte:head>
	<title>¿Cuánto vale tu piso? · Valoración gratuita · NEXUS INMO</title>
	<meta
		name="description"
		content="Calcula el valor de tu vivienda en España o Bélgica en 30 segundos, gratis y sin compromiso."
	/>
</svelte:head>

<section class="mx-auto max-w-6xl px-5 pt-28 pb-24">
	<div class="grid gap-12 lg:grid-cols-2 lg:items-center">
		<div>
			<p class="text-xs font-semibold tracking-[0.25em] text-brand-600 uppercase">{t('vender.eyebrow')}</p>
			<h1 class="mt-3 text-4xl leading-tight text-ink sm:text-5xl">{t('vender.title')}</h1>
			<p class="mt-5 max-w-md text-stone-500">{t('vender.subtitle')}</p>
			<ul class="mt-8 flex flex-col gap-3">
				{#each benefits as benefit (benefit)}
					<li class="flex items-center gap-2.5 text-sm text-stone-700">
						<span class="grid size-5 shrink-0 place-items-center rounded-full bg-brand-500/15 text-brand-700">
							<Check size={12} />
						</span>
						{t(benefit)}
					</li>
				{/each}
			</ul>
		</div>

		<ValuationWidget />
	</div>
</section>
