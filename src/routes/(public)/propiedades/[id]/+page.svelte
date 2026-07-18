<script lang="ts">
	import { page } from '$app/state';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import Bed from '@lucide/svelte/icons/bed';
	import Bath from '@lucide/svelte/icons/bath';
	import Maximize from '@lucide/svelte/icons/maximize';
	import Calendar from '@lucide/svelte/icons/calendar';
	import Check from '@lucide/svelte/icons/check';
	import MessageCircle from '@lucide/svelte/icons/message-circle';
	import { repo } from '$lib/data/repository';
	import { site } from '$lib/config/site';
	import { t } from '$lib/i18n/i18n.svelte';
	import { formatPrice, formatArea } from '$lib/utils/format';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import PropertyGallery from '$lib/components/public/PropertyGallery.svelte';
	import BookingModal from '$lib/components/public/BookingModal.svelte';

	const property = $derived(repo.getPropertyById(page.params.id ?? ''));
	const agent = $derived(property ? repo.getAgentById(property.agentId) : undefined);

	const whatsappUrl = $derived(
		property
			? `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(
					`Hola, me interesa la propiedad ${property.ref} · ${property.title}`
				)}`
			: '#'
	);

	let booking = $state(false);
</script>

<svelte:head>
	<title>{property ? `${property.title} · NEXUS INMO` : 'NEXUS INMO'}</title>
</svelte:head>

<section class="mx-auto max-w-6xl px-5 pt-28 pb-24">
	{#if property}
		<a
			href="/propiedades"
			class="inline-flex items-center gap-1.5 text-sm text-stone-500 transition-colors hover:text-ink"
		>
			<ArrowLeft size={16} /> {t('ficha.back')}
		</a>

		<div class="mt-5">
			<PropertyGallery images={property.images} title={property.title} />
		</div>

		<div class="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
			<div>
				<div class="flex flex-wrap items-center gap-2">
					<Badge tone={property.operation === 'venta' ? 'brand' : 'neutral'}>
						{t(`op.${property.operation}`)}
					</Badge>
					{#if property.status === 'reservada'}<Badge tone="warning">{t('status.reservada')}</Badge>{/if}
					<span class="text-xs text-stone-400">{t('ficha.ref')} {property.ref}</span>
				</div>

				<h1 class="mt-4 text-3xl leading-tight text-ink sm:text-4xl">{property.title}</h1>
				<p class="mt-2 flex items-center gap-1.5 text-stone-500">
					<MapPin size={16} class="text-brand-600" />
					{property.location.zone}, {property.location.city}
				</p>

				<div class="mt-8 grid grid-cols-2 gap-4 border-y border-stone-200 py-6 sm:grid-cols-4">
					{#snippet spec(Icon: typeof Bed, value: string, label: string)}
						<div class="flex flex-col gap-1">
							<Icon size={20} class="text-brand-600" />
							<span class="mt-1 font-display text-xl text-ink">{value}</span>
							<span class="text-xs tracking-wide text-stone-500 uppercase">{label}</span>
						</div>
					{/snippet}
					{@render spec(Bed, `${property.specs.bedrooms}`, t('ficha.bedrooms'))}
					{@render spec(Bath, `${property.specs.bathrooms}`, t('ficha.bathrooms'))}
					{@render spec(Maximize, formatArea(property.specs.area), t('ficha.surface'))}
					{@render spec(Calendar, `${property.specs.yearBuilt}`, t('ficha.year'))}
				</div>

				<div class="mt-8">
					<h2 class="text-xl text-ink">{t('ficha.description')}</h2>
					<p class="mt-3 leading-relaxed text-stone-600">{property.description}</p>
				</div>

				<div class="mt-8">
					<h2 class="text-xl text-ink">{t('ficha.features')}</h2>
					<ul class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
						{#each property.amenities as amenity (amenity)}
							<li class="flex items-center gap-2.5 text-sm text-stone-700">
								<span class="grid size-5 shrink-0 place-items-center rounded-full bg-brand-500/15 text-brand-700">
									<Check size={12} />
								</span>
								{amenity}
							</li>
						{/each}
						<li class="flex items-center gap-2.5 text-sm text-stone-700">
							<span class="grid size-5 shrink-0 place-items-center rounded-full bg-brand-500/15 text-brand-700">
								<Check size={12} />
							</span>
							{t('ficha.energy')} {property.specs.energyRating}
						</li>
					</ul>
				</div>
			</div>

			<aside class="lg:sticky lg:top-28 lg:h-fit">
				<div class="rounded-2xl border border-stone-200 bg-white p-6">
					<p class="font-display text-3xl font-bold text-brand-700">
						{formatPrice(property.price, property.operation)}
					</p>
					<p class="mt-1 text-sm text-stone-500">
						{property.operation === 'venta' ? t('ficha.price_sale') : t('ficha.price_rent')}
					</p>

					{#if agent}
						<div class="mt-6 flex items-center gap-3 border-t border-stone-100 pt-6">
							<img src={agent.avatar} alt={agent.name} class="size-12 rounded-full object-cover" />
							<div>
								<p class="text-sm font-medium text-ink">{agent.name}</p>
								<p class="text-xs text-stone-500">{t('ficha.agent')} · {property.location.city}</p>
							</div>
						</div>
					{/if}

					<div class="mt-6 flex flex-col gap-3">
						<Button href={whatsappUrl} external variant="accent" full>
							<MessageCircle size={18} /> {t('ficha.whatsapp')}
						</Button>
						<Button variant="outline" full onclick={() => (booking = true)}>
							<Calendar size={18} /> {t('ficha.book')}
						</Button>
					</div>
				</div>
			</aside>
		</div>

		<BookingModal {property} open={booking} onclose={() => (booking = false)} />
	{:else}
		<div class="py-24 text-center">
			<p class="font-display text-3xl text-ink">{t('ficha.notfound.title')}</p>
			<p class="mt-2 text-stone-500">{t('ficha.notfound.sub')}</p>
			<div class="mt-6 flex justify-center">
				<Button href="/propiedades" variant="outline">{t('ficha.notfound.cta')}</Button>
			</div>
		</div>
	{/if}
</section>
