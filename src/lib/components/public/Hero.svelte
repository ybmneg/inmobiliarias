<script lang="ts">
	import { repo } from '$lib/data/repository';
	import { t } from '$lib/i18n/i18n.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Reveal from '$lib/components/ui/Reveal.svelte';
	import Counter from '$lib/components/ui/Counter.svelte';
	import heroVideo from '$lib/assets/hero/exploded-house.mp4';
	import heroPoster from '$lib/assets/hero/exploded-house-poster.jpg';

	const activeProperties = repo.getAvailableProperties().length;
	const closedOps = repo.getClosedOperations().length;
	const agentsCount = repo.getAgents().length;

	const stats = [
		{ value: activeProperties, key: 'stats.properties' },
		{ value: 2, key: 'stats.countries' },
		{ value: closedOps, key: 'stats.operations' },
		{ value: agentsCount, key: 'stats.agents' }
	];

	// Carga diferida del vídeo: el póster pinta primero (LCP rápido) y el vídeo
	// se descarga cuando la página está inactiva, sin competir por el ancho de banda.
	let videoEl: HTMLVideoElement | undefined = $state();
	$effect(() => {
		if (!videoEl) return;
		const load = () => {
			if (videoEl) {
				videoEl.src = heroVideo;
				videoEl.load();
			}
		};
		if ('requestIdleCallback' in window) requestIdleCallback(load, { timeout: 1800 });
		else setTimeout(load, 900);
	});
</script>

<svelte:head>
	<link rel="preload" as="image" href={heroPoster} />
</svelte:head>

<section class="mx-auto max-w-5xl px-5 pt-36 pb-8 text-center lg:pt-44">
	<Reveal>
		<p class="text-xs font-semibold tracking-[0.25em] text-brand-600 uppercase">
			{t('hero.eyebrow')}
		</p>
		<h1 class="mx-auto mt-6 max-w-3xl text-4xl leading-[1.12] text-ink sm:text-6xl lg:text-7xl">
			{t('hero.title1')}
			<span class="italic text-brand-600">{t('hero.title2')}</span>
		</h1>
		<p class="mx-auto mt-6 max-w-xl text-base text-stone-500 sm:text-lg">
			{t('hero.subtitle')}
		</p>
		<div class="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
			<Button href="/propiedades" size="lg">{t('hero.cta1')}</Button>
			<Button href="/vender" variant="ghost" size="lg" bracket>{t('hero.cta2')}</Button>
		</div>
	</Reveal>

	<Reveal delay={150}>
		<div class="mt-14 overflow-hidden rounded-2xl border border-stone-200 bg-stone-100">
			<video
				bind:this={videoEl}
				poster={heroPoster}
				autoplay
				muted
				loop
				playsinline
				preload="none"
				class="aspect-video w-full object-cover"
				aria-label="Animación de una villa moderna despiezándose en sus componentes"
			></video>
		</div>
	</Reveal>

	<Reveal delay={200}>
		<dl class="mt-12 grid grid-cols-2 gap-y-8 border-y border-stone-200 py-8 sm:grid-cols-4">
			{#each stats as stat (stat.key)}
				<div class="flex flex-col">
					<dt class="sr-only">{t(stat.key)}</dt>
					<dd class="font-display text-3xl text-ink sm:text-4xl">
						<Counter value={stat.value} />
					</dd>
					<span class="mt-1 text-xs tracking-wide text-stone-500 uppercase">{t(stat.key)}</span>
				</div>
			{/each}
		</dl>
	</Reveal>
</section>
