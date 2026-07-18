<script lang="ts">
	import { repo } from '$lib/data/repository';
	import type { Property, PropertyStatus } from '$lib/data/types';
	import { formatPrice } from '$lib/utils/format';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import CloseDealModal from '$lib/components/panel/CloseDealModal.svelte';

	const properties = $derived(repo.getProperties());
	let closing = $state<Property | null>(null);

	const thumb = (url: string) => url.replace(/([?&])w=\d+/, '$1w=200');

	const meta: Record<PropertyStatus, { tone: 'neutral' | 'warning' | 'success'; label: string }> = {
		disponible: { tone: 'neutral', label: 'Disponible' },
		reservada: { tone: 'warning', label: 'Reservada' },
		vendida: { tone: 'success', label: 'Vendida' },
		alquilada: { tone: 'success', label: 'Alquilada' }
	};
	const isOpen = (s: PropertyStatus) => s === 'disponible' || s === 'reservada';
</script>

<svelte:head><title>Propiedades · NEXUS INMO</title></svelte:head>

<div class="p-6 lg:p-8">
	<header class="mb-6">
		<p class="text-xs font-semibold tracking-[0.25em] text-brand-600 uppercase">Panel</p>
		<h1 class="mt-2 font-sans text-3xl font-semibold text-ink">Propiedades</h1>
		<p class="mt-1 text-stone-500">{properties.length} propiedades · márcalas como vendidas o alquiladas.</p>
	</header>

	<div class="flex flex-col gap-2">
		{#each properties as property (property.id)}
			<div
				class="flex flex-col gap-3 rounded-xl border border-stone-200 bg-white p-3 sm:flex-row sm:items-center"
			>
				<img
					src={thumb(property.images[0])}
					alt={property.title}
					class="h-16 w-full rounded-lg object-cover sm:w-24"
				/>
				<div class="min-w-0 flex-1">
					<p class="truncate text-sm font-medium text-ink">{property.title}</p>
					<p class="text-xs text-stone-500">
						{property.ref} · {property.location.city} · {formatPrice(property.price, property.operation)}
					</p>
				</div>
				<Badge tone={meta[property.status].tone}>{meta[property.status].label}</Badge>
				<div class="sm:w-52 sm:text-right">
					{#if isOpen(property.status)}
						<Button size="sm" variant="outline" onclick={() => (closing = property)}>
							Marcar como {property.operation === 'venta' ? 'vendida' : 'alquilada'}
						</Button>
					{:else}
						<span class="text-xs text-emerald-700">Cerrado</span>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>

{#if closing}
	<CloseDealModal property={closing} onclose={() => (closing = null)} />
{/if}
