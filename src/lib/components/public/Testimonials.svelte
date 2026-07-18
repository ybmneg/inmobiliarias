<script lang="ts">
	import Star from '@lucide/svelte/icons/star';
	import { t } from '$lib/i18n/i18n.svelte';
	import Reveal from '$lib/components/ui/Reveal.svelte';

	const reviews = [
		{ n: 1, name: 'Carla Ríos', location: 'Madrid, España' },
		{ n: 2, name: 'Thomas & Marie', location: 'Bruselas, Bélgica' },
		{ n: 3, name: 'Álvaro Méndez', location: 'Valencia, España' }
	];
</script>

<section class="mx-auto max-w-6xl px-5 py-24">
	<div class="mb-14 max-w-2xl">
		<p class="text-xs font-semibold tracking-[0.25em] text-brand-600 uppercase">
			{t('testimonials.eyebrow')}
		</p>
		<h2 class="mt-3 text-3xl leading-tight text-ink sm:text-4xl">{t('testimonials.title')}</h2>
	</div>

	<div class="grid gap-6 md:grid-cols-3">
		{#each reviews as review, i (review.n)}
			<Reveal delay={i * 80} class="h-full">
				<figure class="flex h-full flex-col rounded-xl border border-stone-200 bg-white p-6">
					<div class="flex gap-0.5">
						{#each Array(5) as _, s (s)}
							<Star size={15} class="fill-brand-500 text-brand-500" />
						{/each}
					</div>
					<blockquote class="mt-4 flex-1 font-display text-lg leading-relaxed text-ink italic">
						“{t(`testimonials.${review.n}.quote`)}”
					</blockquote>
					<figcaption class="mt-5">
						<p class="text-sm font-medium text-ink">{review.name}</p>
						<p class="text-xs text-stone-500">{review.location}</p>
					</figcaption>
				</figure>
			</Reveal>
		{/each}
	</div>
</section>
