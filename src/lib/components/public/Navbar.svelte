<script lang="ts">
	import { slide } from 'svelte/transition';
	import { page } from '$app/state';
	import { site } from '$lib/config/site';
	import { t } from '$lib/i18n/i18n.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import LanguageSelector from '$lib/i18n/LanguageSelector.svelte';
	import Menu from '@lucide/svelte/icons/menu';
	import X from '@lucide/svelte/icons/x';

	const nav = [
		{ key: 'propiedades', href: '/propiedades' },
		{ key: 'vender', href: '/vender' },
		{ key: 'nosotros', href: '/nosotros' },
		{ key: 'contacto', href: '/contacto' }
	];

	let open = $state(false);
	let scrolled = $state(false);

	$effect(() => {
		const onScroll = () => (scrolled = window.scrollY > 8);
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});

	$effect(() => {
		void page.url.pathname;
		open = false;
	});

	const isActive = (href: string) =>
		href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(href);
</script>

<header
	class="fixed inset-x-0 top-0 z-50 transition-colors duration-300 {scrolled || open
		? 'border-b border-stone-200 bg-canvas/85 backdrop-blur-xl'
		: 'border-b border-transparent'}"
>
	<nav class="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
		<a href="/" class="font-display text-xl tracking-tight text-ink" aria-label={site.name}>
			{site.logoMark}<span class="text-brand-600"> INMO</span>
		</a>

		<div class="hidden items-center gap-8 md:flex">
			{#each nav as link (link.href)}
				<a
					href={link.href}
					class="text-sm transition-colors hover:text-ink {isActive(link.href)
						? 'text-ink'
						: 'text-ink/60'}"
				>
					{t(`nav.${link.key}`)}
				</a>
			{/each}
		</div>

		<div class="flex items-center gap-1">
			<LanguageSelector />
			<div class="hidden md:block">
				<Button href={site.cta.href} variant="ghost" size="sm" bracket>{t('nav.cta')}</Button>
			</div>
			<button
				class="grid size-10 place-items-center rounded-lg text-ink hover:bg-stone-100 md:hidden"
				onclick={() => (open = !open)}
				aria-label="Menú"
				aria-expanded={open}
			>
				{#if open}<X size={22} />{:else}<Menu size={22} />{/if}
			</button>
		</div>
	</nav>

	{#if open}
		<div class="border-t border-stone-200 bg-canvas md:hidden" transition:slide>
			<div class="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-4">
				{#each nav as link (link.href)}
					<a
						href={link.href}
						class="rounded-lg px-4 py-3 text-ink transition-colors hover:bg-stone-100"
					>
						{t(`nav.${link.key}`)}
					</a>
				{/each}
				<div class="mt-3">
					<Button href={site.cta.href} full>{t('nav.cta')}</Button>
				</div>
			</div>
		</div>
	{/if}
</header>
