<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fly } from 'svelte/transition';
	import { page } from '$app/state';
	import { session } from '$lib/auth/session.svelte';
	import LayoutDashboard from '@lucide/svelte/icons/layout-dashboard';
	import Users from '@lucide/svelte/icons/users';
	import Calendar from '@lucide/svelte/icons/calendar';
	import Building2 from '@lucide/svelte/icons/building-2';
	import BarChart3 from '@lucide/svelte/icons/bar-chart-3';
	import LogOut from '@lucide/svelte/icons/log-out';
	import Menu from '@lucide/svelte/icons/menu';
	import X from '@lucide/svelte/icons/x';

	let { children }: { children: Snippet } = $props();
	let drawerOpen = $state(false);

	const nav = [
		{ label: 'Dashboard', href: '/panel', icon: LayoutDashboard },
		{ label: 'Leads', href: '/panel/leads', icon: Users },
		{ label: 'Visitas', href: '/panel/visitas', icon: Calendar },
		{ label: 'Propiedades', href: '/panel/propiedades', icon: Building2 },
		{ label: 'Informes', href: '/panel/informes', icon: BarChart3 }
	];

	const isActive = (href: string) =>
		href === '/panel' ? page.url.pathname === '/panel' : page.url.pathname.startsWith(href);

	$effect(() => {
		void page.url.pathname;
		drawerOpen = false;
	});
</script>

{#snippet navLinks()}
	{#each nav as item (item.href)}
		{@const Icon = item.icon}
		<a
			href={item.href}
			class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors {isActive(
				item.href
			)
				? 'bg-white/10 text-white'
				: 'text-stone-400 hover:bg-white/5 hover:text-white'}"
		>
			<Icon size={18} class={isActive(item.href) ? 'text-brand-400' : ''} />
			{item.label}
		</a>
	{/each}
{/snippet}

{#snippet sidebarBody()}
	<a href="/panel" class="px-2 font-display text-xl text-white">
		NEXUS<span class="text-brand-400"> INMO</span>
	</a>
	<nav class="mt-8 flex flex-1 flex-col gap-1">{@render navLinks()}</nav>
	<div class="border-t border-white/10 pt-4">
		<div class="flex items-center justify-between px-2">
			<div>
				<p class="text-sm text-white">Demo</p>
				<p class="text-xs text-stone-500">Administrador</p>
			</div>
			<button
				onclick={() => session.logout()}
				class="grid size-9 place-items-center rounded-lg text-stone-400 hover:bg-white/10 hover:text-white"
				aria-label="Cerrar sesión"
			>
				<LogOut size={18} />
			</button>
		</div>
	</div>
{/snippet}

<div class="min-h-dvh bg-canvas">
	<!-- Sidebar escritorio -->
	<aside class="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col bg-ink p-4 lg:flex">
		{@render sidebarBody()}
	</aside>

	<!-- Topbar móvil -->
	<header
		class="sticky top-0 z-30 flex items-center justify-between border-b border-stone-200 bg-canvas/85 px-5 py-3 backdrop-blur-lg lg:hidden"
	>
		<a href="/panel" class="font-display text-lg text-ink">NEXUS<span class="text-brand-600"> INMO</span></a>
		<button
			onclick={() => (drawerOpen = true)}
			class="grid size-10 place-items-center rounded-lg text-ink hover:bg-stone-100"
			aria-label="Abrir menú"
		>
			<Menu size={22} />
		</button>
	</header>

	<!-- Drawer móvil -->
	{#if drawerOpen}
		<div class="fixed inset-0 z-50 lg:hidden">
			<button
				class="absolute inset-0 bg-ink/50"
				onclick={() => (drawerOpen = false)}
				aria-label="Cerrar menú"
			></button>
			<aside
				class="absolute inset-y-0 left-0 flex w-64 flex-col bg-ink p-4"
				transition:fly={{ x: -260, duration: 200 }}
			>
				<button
					onclick={() => (drawerOpen = false)}
					class="absolute top-4 right-4 grid size-8 place-items-center rounded-lg text-stone-400 hover:bg-white/10 hover:text-white"
					aria-label="Cerrar"
				>
					<X size={18} />
				</button>
				{@render sidebarBody()}
			</aside>
		</div>
	{/if}

	<!-- Contenido -->
	<main class="lg:pl-60">
		{@render children()}
	</main>
</div>
