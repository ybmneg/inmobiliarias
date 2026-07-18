<script lang="ts">
	import Phone from '@lucide/svelte/icons/phone';
	import Mail from '@lucide/svelte/icons/mail';
	import MessageCircle from '@lucide/svelte/icons/message-circle';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import { site } from '$lib/config/site';
	import { t } from '$lib/i18n/i18n.svelte';
	import Reveal from '$lib/components/ui/Reveal.svelte';

	const cards = [
		{
			icon: Phone,
			label: 'contact.phone_label',
			value: site.contact.phone,
			href: `tel:${site.contact.phone}`
		},
		{
			icon: Mail,
			label: 'contact.email_label',
			value: site.contact.email,
			href: `mailto:${site.contact.email}`
		},
		{
			icon: MessageCircle,
			label: 'contact.whatsapp_label',
			value: 'contact.whatsapp_cta',
			href: `https://wa.me/${site.contact.whatsapp}`,
			valueIsKey: true
		}
	];
</script>

<svelte:head>
	<title>{t('contact.title')} · {site.name}</title>
	<meta name="description" content={t('contact.subtitle')} />
</svelte:head>

<section class="mx-auto max-w-5xl px-5 pt-36 pb-24 lg:pt-44">
	<Reveal>
		<div class="max-w-2xl">
			<p class="text-xs font-semibold tracking-[0.25em] text-brand-600 uppercase">
				{t('contact.eyebrow')}
			</p>
			<h1 class="mt-3 text-4xl leading-tight text-ink sm:text-5xl">{t('contact.title')}</h1>
			<p class="mt-4 text-stone-500">{t('contact.subtitle')}</p>
		</div>
	</Reveal>

	<div class="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each cards as card (card.label)}
			{@const Icon = card.icon}
			<a
				href={card.href}
				target={card.href.startsWith('http') ? '_blank' : undefined}
				rel={card.href.startsWith('http') ? 'noopener noreferrer' : undefined}
				class="group flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-stone-300"
			>
				<span class="grid size-11 place-items-center rounded-xl bg-brand-500/10 text-brand-700">
					<Icon size={20} />
				</span>
				<span class="text-xs tracking-wide text-stone-500 uppercase">{t(card.label)}</span>
				<span class="font-medium text-ink">{card.valueIsKey ? t(card.value) : card.value}</span>
			</a>
		{/each}

		<div class="flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-6 sm:col-span-2 lg:col-span-3">
			<span class="grid size-11 place-items-center rounded-xl bg-brand-500/10 text-brand-700">
				<MapPin size={20} />
			</span>
			<span class="text-xs tracking-wide text-stone-500 uppercase">{t('contact.address_label')}</span>
			<span class="font-medium text-ink">{site.contact.address}</span>
		</div>
	</div>
</section>
