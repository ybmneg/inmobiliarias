<script lang="ts">
	import { untrack } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import X from '@lucide/svelte/icons/x';
	import Check from '@lucide/svelte/icons/check';
	import { repo } from '$lib/data/repository';
	import type { Property } from '$lib/data/types';
	import { formatPrice } from '$lib/utils/format';
	import Button from '$lib/components/ui/Button.svelte';

	interface Props {
		property: Property;
		onclose: () => void;
	}
	let { property, onclose }: Props = $props();

	const isRent = $derived(property.operation === 'alquiler');
	const todayStr = new Date().toISOString().slice(0, 10);
	const agents = repo.getAgents();

	let client = $state('');
	let price = $state<number>(untrack(() => property.price));
	let date = $state(todayStr);
	let agentId = $state(untrack(() => property.agentId));
	let done = $state(false);

	function submit(e: SubmitEvent) {
		e.preventDefault();
		repo.closeOperation({
			propertyId: property.id,
			propertyTitle: property.title,
			type: property.type,
			operation: property.operation,
			city: property.location.city,
			zone: property.location.zone,
			country: property.location.country,
			agentId,
			clientName: client,
			finalPrice: price,
			closedAt: date,
			leadCreatedAt: date
		});
		repo.setPropertyStatus(property.id, isRent ? 'alquilada' : 'vendida');
		done = true;
	}

	const inputClass =
		'h-11 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm text-ink focus:border-ink focus:outline-none';
</script>

<svelte:window onkeydown={(e) => e.key === 'Escape' && onclose()} />

<div
	class="fixed inset-0 z-[100] flex items-center justify-center p-4"
	transition:fade={{ duration: 150 }}
>
	<button class="absolute inset-0 bg-ink/60 backdrop-blur-sm" aria-label="Cerrar" onclick={onclose}
	></button>
	<div
		class="relative w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 sm:p-8"
		transition:scale={{ duration: 200, start: 0.96 }}
		role="dialog"
		aria-modal="true"
		aria-label="Cerrar operación"
		tabindex="-1"
	>
		<button
			type="button"
			onclick={onclose}
			class="absolute top-4 right-4 grid size-9 place-items-center rounded-lg text-stone-500 hover:bg-stone-100 hover:text-ink"
			aria-label="Cerrar"
		>
			<X size={20} />
		</button>

		{#if !done}
			<p class="text-xs font-semibold tracking-[0.25em] text-brand-600 uppercase">
				Marcar como {isRent ? 'alquilada' : 'vendida'}
			</p>
			<h3 class="mt-2 font-sans text-xl font-semibold text-ink">{property.title}</h3>
			<p class="mt-1 text-sm text-stone-500">Precio publicado: {formatPrice(property.price, property.operation)}</p>

			<form class="mt-6 flex flex-col gap-4" onsubmit={submit}>
				<div class="flex flex-col gap-1.5">
					<label for="cd-client" class="text-sm text-ink">Cliente</label>
					<input
						id="cd-client"
						bind:value={client}
						required
						placeholder="Nombre del cliente"
						class={inputClass}
					/>
				</div>
				<div class="grid grid-cols-2 gap-3">
					<div class="flex flex-col gap-1.5">
						<label for="cd-price" class="text-sm text-ink">
							Precio final {isRent ? '(€/mes)' : '(€)'}
						</label>
						<input id="cd-price" type="number" min="1" bind:value={price} required class={inputClass} />
					</div>
					<div class="flex flex-col gap-1.5">
						<label for="cd-date" class="text-sm text-ink">Fecha de cierre</label>
						<input id="cd-date" type="date" bind:value={date} required class={inputClass} />
					</div>
				</div>
				<div class="flex flex-col gap-1.5">
					<label for="cd-agent" class="text-sm text-ink">Agente</label>
					<select id="cd-agent" bind:value={agentId} class={inputClass}>
						{#each agents as a (a.id)}<option value={a.id}>{a.name}</option>{/each}
					</select>
				</div>
				<Button type="submit" variant="accent" full>Confirmar cierre</Button>
			</form>
		{:else}
			<div class="flex flex-col items-center py-6 text-center">
				<div class="grid size-14 place-items-center rounded-full bg-emerald-100 text-emerald-700">
					<Check size={28} />
				</div>
				<h3 class="mt-4 font-sans text-xl font-semibold text-ink">Operación cerrada</h3>
				<p class="mt-2 max-w-xs text-sm text-stone-500">
					{property.title} marcada como {isRent ? 'alquilada' : 'vendida'}. Ya aparece en los informes.
				</p>
				<div class="mt-6 w-full">
					<Button variant="outline" full onclick={onclose}>Cerrar</Button>
				</div>
			</div>
		{/if}
	</div>
</div>
