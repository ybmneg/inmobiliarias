<script lang="ts">
	import { site } from '$lib/config/site';
	import { t } from '$lib/i18n/i18n.svelte';

	const year = new Date().getFullYear();
	const nav = [
		{ key: 'propiedades', href: '/propiedades' },
		{ key: 'vender', href: '/vender' },
		{ key: 'nosotros', href: '/nosotros' },
		{ key: 'contacto', href: '/contacto' }
	];
	const legal = ['legal.aviso', 'legal.privacidad', 'legal.cookies'];
</script>

<footer class="bg-ink text-stone-400">
	<div class="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:grid-cols-2 lg:grid-cols-4">
		<!-- Marca -->
		<div class="flex flex-col gap-4">
			<a href="/" class="font-display text-xl text-white" aria-label={site.name}>
				{site.logoMark}<span class="text-brand-400"> INMO</span>
			</a>
			<p class="max-w-xs text-sm text-stone-400">{site.description}</p>
			<p class="text-sm text-stone-500">
				{t('footer.cobertura')}: <span class="text-stone-300">España · Bélgica</span>
			</p>
		</div>

		<!-- Explora -->
		<nav class="flex flex-col gap-3">
			<p class="text-xs font-semibold tracking-widest text-white uppercase">{t('footer.explora')}</p>
			{#each nav as link (link.href)}
				<a href={link.href} class="text-sm text-stone-400 transition-colors hover:text-brand-400">
					{t(`nav.${link.key}`)}
				</a>
			{/each}
		</nav>

		<!-- Contacto -->
		<div class="flex flex-col gap-3">
			<p class="text-xs font-semibold tracking-widest text-white uppercase">{t('footer.contacto')}</p>
			<a href="tel:{site.contact.phone}" class="text-sm text-stone-400 hover:text-brand-400">
				{site.contact.phone}
			</a>
			<a href="mailto:{site.contact.email}" class="text-sm text-stone-400 hover:text-brand-400">
				{site.contact.email}
			</a>
			<a
				href="https://wa.me/{site.contact.whatsapp}"
				target="_blank"
				rel="noopener noreferrer"
				class="text-sm text-stone-400 hover:text-brand-400"
			>
				WhatsApp
			</a>
			<p class="text-sm text-stone-500">{site.contact.address}</p>
		</div>

		<!-- Redes -->
		<div class="flex flex-col gap-3">
			<p class="text-xs font-semibold tracking-widest text-white uppercase">{t('footer.siguenos')}</p>
			{#each site.socials as s (s.href)}
				<a
					href={s.href}
					target="_blank"
					rel="noopener noreferrer"
					class="text-sm text-stone-400 transition-colors hover:text-brand-400"
				>
					{s.label}
				</a>
			{/each}
		</div>
	</div>

	<div class="border-t border-white/10">
		<div
			class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-6 text-xs text-stone-500 sm:flex-row"
		>
			<p>© {year} {site.name}. {t('footer.rights')}</p>
			<div class="flex gap-4">
				{#each legal as item (item)}
					<a href="#top" class="hover:text-stone-300">{t(item)}</a>
				{/each}
			</div>
		</div>
	</div>
</footer>
