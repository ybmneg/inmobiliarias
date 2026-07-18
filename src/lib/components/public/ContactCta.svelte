<script lang="ts">
	import { site } from '$lib/config/site';
	import { t } from '$lib/i18n/i18n.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Reveal from '$lib/components/ui/Reveal.svelte';
</script>

<section class="bg-ink">
	<div class="mx-auto max-w-4xl px-5 py-28 text-center">
		<Reveal>
			<p class="text-xs font-semibold tracking-[0.25em] text-brand-400 uppercase">{t('cta.eyebrow')}</p>
			<h2 class="mx-auto mt-5 max-w-2xl text-4xl leading-tight text-white sm:text-5xl">
				{t('cta.title')}
			</h2>
			<p class="mx-auto mt-5 max-w-lg text-stone-400">{t('cta.subtitle')}</p>
			<div class="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
				<Button href="/propiedades" variant="accent" size="lg">{t('cta.button')}</Button>
				<a href="tel:{site.contact.phone}" class="text-sm text-stone-300 transition-colors hover:text-white">
					{t('cta.call')} <span class="text-white">{site.contact.phone}</span>
				</a>
			</div>
		</Reveal>
	</div>
</section>
