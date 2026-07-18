<script lang="ts">
	import { t } from '$lib/i18n/i18n.svelte';
	import { site } from '$lib/config/site';
	import Reveal from '$lib/components/ui/Reveal.svelte';
	import WhyUs from '$lib/components/public/WhyUs.svelte';
	import Team from '$lib/components/public/Team.svelte';
	import ContactCta from '$lib/components/public/ContactCta.svelte';
</script>

<svelte:head>
	<title>{t('about.eyebrow')} · {site.name}</title>
	<meta name="description" content={t('about.subtitle')} />
</svelte:head>

<section class="mx-auto max-w-3xl px-5 pt-36 pb-8 text-center lg:pt-44">
	<Reveal>
		<p class="text-xs font-semibold tracking-[0.25em] text-brand-600 uppercase">{t('about.eyebrow')}</p>
		<h1 class="mx-auto mt-6 max-w-2xl text-4xl leading-[1.12] text-ink sm:text-5xl">
			{t('about.title')}
		</h1>
		<p class="mx-auto mt-6 max-w-xl text-base text-stone-500 sm:text-lg">{t('about.subtitle')}</p>
	</Reveal>
</section>

<WhyUs />
<Team />
<ContactCta />
