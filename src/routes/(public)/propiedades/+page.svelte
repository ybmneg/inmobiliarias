<script lang="ts">
	import { repo, type PropertyFilters as Filters } from '$lib/data/repository';
	import PropertyFiltersBar from '$lib/components/public/PropertyFilters.svelte';
	import PropertyCard from '$lib/components/public/PropertyCard.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { t } from '$lib/i18n/i18n.svelte';

	const initial = (): Filters => ({
		query: '',
		operation: 'todas',
		type: 'todos',
		country: 'todos',
		minBedrooms: 0,
		maxPrice: undefined
	});

	let filters = $state<Filters>(initial());

	// Resultados instantáneos: se recalculan al cambiar cualquier filtro.
	const results = $derived(
		repo
			.searchProperties(filters)
			.filter((p) => p.status !== 'vendida' && p.status !== 'alquilada')
	);

	function reset() {
		Object.assign(filters, initial());
	}
</script>

<svelte:head>
	<title>Propiedades en venta y alquiler · NEXUS INMO</title>
	<meta
		name="description"
		content="Explora propiedades en España y Bélgica: pisos, áticos, casas y chalets en venta y alquiler."
	/>
</svelte:head>

<section class="mx-auto max-w-6xl px-5 pt-28 pb-24 lg:pt-32">
	<header class="mb-10">
		<p class="text-xs font-semibold tracking-[0.25em] text-brand-600 uppercase">{t('search.eyebrow')}</p>
		<h1 class="mt-3 text-4xl leading-tight text-ink sm:text-5xl">{t('search.title')}</h1>
	</header>

	<PropertyFiltersBar bind:filters onclear={reset} />

	<p class="mt-6 mb-8 text-sm text-stone-500">
		{results.length}
		{results.length === 1 ? t('search.property') : t('search.properties')}
	</p>

	{#if results.length > 0}
		<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each results as property (property.id)}
				<PropertyCard {property} />
			{/each}
		</div>
	{:else}
		<div class="rounded-2xl border border-dashed border-stone-300 py-20 text-center">
			<p class="font-display text-xl text-ink">{t('search.empty.title')}</p>
			<p class="mt-2 text-sm text-stone-500">{t('search.empty.sub')}</p>
			<div class="mt-6 flex justify-center">
				<Button variant="outline" onclick={reset}>{t('filters.clear')}</Button>
			</div>
		</div>
	{/if}
</section>
