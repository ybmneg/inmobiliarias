<script lang="ts">
	import type { Property } from '$lib/data/types';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import Bed from '@lucide/svelte/icons/bed';
	import Bath from '@lucide/svelte/icons/bath';
	import Maximize from '@lucide/svelte/icons/maximize';
	import Badge from '$lib/components/ui/Badge.svelte';
	import { formatPrice, formatArea } from '$lib/utils/format';
	import { t } from '$lib/i18n/i18n.svelte';

	interface Props {
		property: Property;
	}
	let { property }: Props = $props();

	const thumb = (url: string, w: number) => url.replace(/([?&])w=\d+/, `$1w=${w}`);
	const srcset = $derived(
		[400, 800, 1200].map((w) => `${thumb(property.images[0], w)} ${w}w`).join(', ')
	);
	const operationLabel = $derived(t(`op.${property.operation}`));
</script>

<a
	href="/propiedades/{property.id}"
	class="group flex h-full flex-col overflow-hidden rounded-xl border border-stone-200 bg-white transition-all duration-300 ease-[var(--ease-out-quint)] hover:-translate-y-1 hover:border-stone-300"
>
	<div class="relative aspect-[4/3] overflow-hidden">
		<img
			src={thumb(property.images[0], 800)}
			{srcset}
			sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
			alt={property.title}
			loading="lazy"
			decoding="async"
			class="size-full object-cover transition-transform duration-500 ease-[var(--ease-out-quint)] group-hover:scale-105"
		/>
		<div class="absolute inset-x-0 top-0 flex items-center justify-between p-3">
			<Badge tone={property.operation === 'venta' ? 'brand' : 'neutral'}>{operationLabel}</Badge>
			{#if property.status === 'reservada'}
				<Badge tone="warning">{t('status.reservada')}</Badge>
			{/if}
		</div>
	</div>

	<div class="flex flex-1 flex-col gap-2 p-5">
		<h3 class="line-clamp-1 font-display text-lg leading-snug text-ink">{property.title}</h3>

		<p class="flex items-center gap-1.5 text-sm text-stone-500">
			<MapPin size={14} class="shrink-0 text-brand-600" />
			{property.location.zone}, {property.location.city}
		</p>

		<p class="mt-1 font-display text-xl font-bold text-brand-700">
			{formatPrice(property.price, property.operation)}
		</p>

		<div
			class="mt-auto flex items-center gap-4 border-t border-stone-100 pt-4 text-sm text-stone-600"
		>
			<span class="flex items-center gap-1.5" title="Habitaciones">
				<Bed size={16} class="text-stone-400" />
				{property.specs.bedrooms}
			</span>
			<span class="flex items-center gap-1.5" title="Baños">
				<Bath size={16} class="text-stone-400" />
				{property.specs.bathrooms}
			</span>
			<span class="flex items-center gap-1.5" title="Superficie">
				<Maximize size={16} class="text-stone-400" />
				{formatArea(property.specs.area)}
			</span>
		</div>
	</div>
</a>
