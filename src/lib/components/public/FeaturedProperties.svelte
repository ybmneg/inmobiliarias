<script lang="ts">
	import { repo } from '$lib/data/repository';
	import PropertyCard from './PropertyCard.svelte';
	import Reveal from '$lib/components/ui/Reveal.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	const featured = repo.getFeaturedProperties();
</script>

<section class="mx-auto max-w-6xl px-5 py-24">
	<div class="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
		<div>
			<p class="text-xs font-semibold tracking-[0.25em] text-brand-600 uppercase">Selección</p>
			<h2 class="mt-3 text-3xl text-ink sm:text-4xl">Propiedades destacadas</h2>
			<p class="mt-3 max-w-md text-stone-500">
				Una muestra de nuestras mejores oportunidades en España y Bélgica.
			</p>
		</div>
		<Button href="/propiedades" variant="ghost" bracket>Ver todas</Button>
	</div>

	<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
		{#each featured as property, i (property.id)}
			<Reveal delay={i * 80} class="h-full">
				<PropertyCard {property} />
			</Reveal>
		{/each}
	</div>
</section>
