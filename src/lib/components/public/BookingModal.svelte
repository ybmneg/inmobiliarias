<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import X from '@lucide/svelte/icons/x';
	import Check from '@lucide/svelte/icons/check';
	import { repo } from '$lib/data/repository';
	import type { Property } from '$lib/data/types';
	import Button from '$lib/components/ui/Button.svelte';
	import { t } from '$lib/i18n/i18n.svelte';

	interface Props {
		property: Property;
		open: boolean;
		onclose: () => void;
	}
	let { property, open, onclose }: Props = $props();

	const todayStr = new Date().toISOString().slice(0, 10);
	const slots = ['10:00', '11:00', '12:00', '13:00', '16:00', '17:00', '18:00', '19:00'];

	let name = $state('');
	let phone = $state('');
	let email = $state('');
	let date = $state('');
	let time = $state('11:00');
	let done = $state(false);

	function submit(e: SubmitEvent) {
		e.preventDefault();
		const lead = repo.addLead({
			name,
			phone,
			email,
			type: 'comprador',
			source: 'ficha',
			temperature: 'caliente',
			propertyId: property.id,
			zone: property.location.zone,
			agentId: property.agentId,
			notes: `Solicitud de visita a ${property.ref} · ${property.title}`
		});
		repo.addVisit({
			propertyId: property.id,
			leadId: lead.id,
			agentId: property.agentId,
			date,
			time,
			notes: 'Visita solicitada desde la ficha (web).'
		});
		done = true;
	}

	function close() {
		onclose();
		// Reinicia para una próxima apertura.
		setTimeout(() => {
			done = false;
			name = phone = email = date = '';
			time = '11:00';
		}, 200);
	}
</script>

<svelte:window onkeydown={(e) => open && e.key === 'Escape' && close()} />

{#if open}
	<div class="fixed inset-0 z-[100] flex items-center justify-center p-4" transition:fade={{ duration: 150 }}>
		<button
			type="button"
			class="absolute inset-0 bg-ink/60 backdrop-blur-sm"
			aria-label="Cerrar"
			onclick={close}
		></button>
		<div
			class="relative w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 sm:p-8"
			transition:scale={{ duration: 200, start: 0.96 }}
			role="dialog"
			aria-modal="true"
			aria-label="Agendar visita"
			tabindex="-1"
		>
			<button
				type="button"
				onclick={close}
				class="absolute top-4 right-4 grid size-9 place-items-center rounded-lg text-stone-500 hover:bg-stone-100 hover:text-ink"
				aria-label="Cerrar"
			>
				<X size={20} />
			</button>

			{#if !done}
				<p class="text-xs font-semibold tracking-[0.25em] text-brand-600 uppercase">{t('ficha.book')}</p>
				<h3 class="mt-2 font-display text-2xl text-ink">{property.title}</h3>
				<p class="mt-1 text-sm text-stone-500">{property.location.zone}, {property.location.city}</p>

				<form class="mt-6 flex flex-col gap-4" onsubmit={submit}>
					<div class="flex flex-col gap-1.5">
						<label for="bk-name" class="text-sm text-ink">{t('booking.name')}</label>
						<input
							id="bk-name"
							bind:value={name}
							required
							placeholder={t('booking.name_ph')}
							class="h-11 rounded-lg border border-stone-300 px-3 text-sm text-ink focus:border-ink focus:outline-none"
						/>
					</div>
					<div class="flex flex-col gap-1.5">
						<label for="bk-phone" class="text-sm text-ink">{t('booking.phone')}</label>
						<input
							id="bk-phone"
							bind:value={phone}
							required
							type="tel"
							placeholder="+34 600 000 000"
							class="h-11 rounded-lg border border-stone-300 px-3 text-sm text-ink focus:border-ink focus:outline-none"
						/>
					</div>
					<div class="grid grid-cols-2 gap-3">
						<div class="flex flex-col gap-1.5">
							<label for="bk-date" class="text-sm text-ink">{t('booking.date')}</label>
							<input
								id="bk-date"
								bind:value={date}
								required
								type="date"
								min={todayStr}
								class="h-11 rounded-lg border border-stone-300 px-3 text-sm text-ink focus:border-ink focus:outline-none"
							/>
						</div>
						<div class="flex flex-col gap-1.5">
							<label for="bk-time" class="text-sm text-ink">{t('booking.time')}</label>
							<select
								id="bk-time"
								bind:value={time}
								class="h-11 rounded-lg border border-stone-300 px-3 text-sm text-ink focus:border-ink focus:outline-none"
							>
								{#each slots as slot (slot)}<option value={slot}>{slot}</option>{/each}
							</select>
						</div>
					</div>
					<Button type="submit" variant="accent" full>{t('booking.confirm')}</Button>
				</form>
			{:else}
				<div class="flex flex-col items-center py-6 text-center">
					<div class="grid size-14 place-items-center rounded-full bg-brand-500/15 text-brand-700">
						<Check size={28} />
					</div>
					<h3 class="mt-4 font-display text-2xl text-ink">{t('booking.success_title')}</h3>
					<p class="mt-2 max-w-xs text-sm text-stone-500">
						{t('booking.success_msg')}
					</p>
					<div class="mt-6 w-full">
						<Button variant="outline" full onclick={close}>{t('common.close')}</Button>
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}
