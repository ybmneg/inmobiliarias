<script lang="ts">
	import { untrack } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import X from '@lucide/svelte/icons/x';
	import FileText from '@lucide/svelte/icons/file-text';
	import { repo } from '$lib/data/repository';
	import type { Lead } from '$lib/data/types';
	import { formatEUR } from '$lib/utils/format';
	import { generateContractPdf, type ContractKind } from '$lib/pdf/contract';
	import Button from '$lib/components/ui/Button.svelte';

	interface Props {
		lead: Lead;
		onclose: () => void;
	}
	let { lead, onclose }: Props = $props();

	const property = untrack(() => (lead.propertyId ? repo.getPropertyById(lead.propertyId) : undefined));

	let kind = $state<ContractKind>(property?.operation === 'alquiler' ? 'alquiler' : 'arras');
	let clientName = $state(untrack(() => lead.name));
	let clientId = $state('');
	let price = $state<number>(untrack(() => property?.price ?? 0));
	let city = $state(untrack(() => property?.location.city ?? lead.zone ?? 'Madrid'));
	let generating = $state(false);
	let generated = $state(false);

	const deposit = $derived(kind === 'arras' ? Math.round(price * 0.1) : price);
	const today = new Date().toISOString().slice(0, 10);

	async function generate(e: SubmitEvent) {
		e.preventDefault();
		generating = true;
		await generateContractPdf({
			kind,
			city,
			date: today,
			ownerName: 'NEXUS INMO (en representación del propietario)',
			clientName,
			clientId,
			propertyTitle: property?.title ?? 'Inmueble',
			propertyRef: property?.ref ?? '—',
			propertyAddress: property ? `${property.location.zone}, ${property.location.city}` : (lead.zone ?? '—'),
			price,
			deposit
		});
		generating = false;
		generated = true;
	}

	const inputClass =
		'h-11 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm text-ink focus:border-ink focus:outline-none';
</script>

<svelte:window onkeydown={(e) => e.key === 'Escape' && onclose()} />

<div class="fixed inset-0 z-[100] flex items-center justify-center p-4" transition:fade={{ duration: 150 }}>
	<button class="absolute inset-0 bg-ink/60 backdrop-blur-sm" aria-label="Cerrar" onclick={onclose}></button>
	<div
		class="relative w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 sm:p-8"
		transition:scale={{ duration: 200, start: 0.96 }}
		role="dialog"
		aria-modal="true"
		aria-label="Generar contrato"
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

		{#if !generated}
			<p class="text-xs font-semibold tracking-[0.25em] text-brand-600 uppercase">Generar contrato</p>
			<h3 class="mt-2 font-sans text-xl font-semibold text-ink">{lead.name}</h3>
			{#if property}
				<p class="mt-1 text-sm text-stone-500">{property.title} · Ref. {property.ref}</p>
			{/if}

			<form class="mt-6 flex flex-col gap-4" onsubmit={generate}>
				<div class="flex rounded-lg border border-stone-300 p-1">
					{#each [{ v: 'arras', l: 'Arras (venta)' }, { v: 'alquiler', l: 'Alquiler' }] as opt (opt.v)}
						<button
							type="button"
							onclick={() => (kind = opt.v as ContractKind)}
							class="flex-1 rounded-md px-3 py-1.5 text-sm transition-colors {kind === opt.v
								? 'bg-ink text-white'
								: 'text-stone-600 hover:text-ink'}"
						>
							{opt.l}
						</button>
					{/each}
				</div>

				<div class="grid grid-cols-2 gap-3">
					<div class="flex flex-col gap-1.5">
						<label for="ct-client" class="text-sm text-ink">Cliente</label>
						<input id="ct-client" bind:value={clientName} required class={inputClass} />
					</div>
					<div class="flex flex-col gap-1.5">
						<label for="ct-id" class="text-sm text-ink">DNI / NIE</label>
						<input id="ct-id" bind:value={clientId} placeholder="00000000X" class={inputClass} />
					</div>
				</div>

				<div class="grid grid-cols-2 gap-3">
					<div class="flex flex-col gap-1.5">
						<label for="ct-price" class="text-sm text-ink">
							{kind === 'arras' ? 'Precio (€)' : 'Renta (€/mes)'}
						</label>
						<input id="ct-price" type="number" min="1" bind:value={price} required class={inputClass} />
					</div>
					<div class="flex flex-col gap-1.5">
						<label for="ct-city" class="text-sm text-ink">Ciudad</label>
						<input id="ct-city" bind:value={city} required class={inputClass} />
					</div>
				</div>

				<p class="text-xs text-stone-500">
					{kind === 'arras' ? 'Arras (10%)' : 'Fianza (1 mensualidad)'}:
					<span class="font-medium text-ink">{formatEUR(deposit)}</span>
				</p>

				<Button type="submit" variant="accent" full disabled={generating}>
					<FileText size={16} />
					{generating ? 'Generando…' : 'Generar PDF (borrador)'}
				</Button>
			</form>
		{:else}
			<div class="flex flex-col items-center py-6 text-center">
				<div class="grid size-14 place-items-center rounded-full bg-brand-500/15 text-brand-700">
					<FileText size={26} />
				</div>
				<h3 class="mt-4 font-sans text-xl font-semibold text-ink">Contrato descargado</h3>
				<p class="mt-2 max-w-xs text-sm text-stone-500">
					El PDF se ha generado con marca de agua “BORRADOR”. Revísalo con tu asesor legal antes de firmarlo.
				</p>
				<div class="mt-6 w-full">
					<Button variant="outline" full onclick={onclose}>Cerrar</Button>
				</div>
			</div>
		{/if}
	</div>
</div>
