<script lang="ts">
	import Search from '@lucide/svelte/icons/search';
	import type { PropertyFilters } from '$lib/data/repository';
	import { t } from '$lib/i18n/i18n.svelte';
	import { formatEUR } from '$lib/utils/format';

	interface Props {
		filters: PropertyFilters;
		onclear: () => void;
	}
	let { filters = $bindable(), onclear }: Props = $props();

	const operations = [
		{ v: 'todas', k: 'filters.op.all' },
		{ v: 'venta', k: 'filters.op.sale' },
		{ v: 'alquiler', k: 'filters.op.rent' }
	] as const;
	const types = ['todos', 'piso', 'atico', 'casa', 'chalet', 'duplex', 'estudio'] as const;
	const countries = [
		{ v: 'todos', k: 'filters.country.all' },
		{ v: 'ES', k: 'country.es' },
		{ v: 'BE', k: 'country.be' }
	] as const;
	const bedrooms = [0, 1, 2, 3, 4];
	const prices = [undefined, 300000, 500000, 800000, 1500000];

	const selectClass =
		'h-11 rounded-lg border border-stone-300 bg-white px-3 text-sm text-ink transition-colors hover:border-stone-400 focus:border-ink focus:outline-none';
</script>

<div class="rounded-2xl border border-stone-200 bg-white p-4">
	<div class="flex flex-col gap-3 lg:flex-row lg:items-center">
		<div class="relative flex-1">
			<Search size={18} class="absolute top-1/2 left-3 -translate-y-1/2 text-stone-400" />
			<input
				type="search"
				placeholder={t('filters.search_ph')}
				bind:value={filters.query}
				class="h-11 w-full rounded-lg border border-stone-300 bg-white pr-3 pl-10 text-sm text-ink placeholder:text-stone-400 focus:border-ink focus:outline-none"
			/>
		</div>

		<div class="flex rounded-lg border border-stone-300 p-1">
			{#each operations as op (op.v)}
				<button
					type="button"
					onclick={() => (filters.operation = op.v)}
					class="rounded-md px-4 py-1.5 text-sm transition-colors {filters.operation === op.v
						? 'bg-ink text-white'
						: 'text-stone-600 hover:text-ink'}"
				>
					{t(op.k)}
				</button>
			{/each}
		</div>
	</div>

	<div class="mt-3 flex flex-wrap gap-3">
		<select bind:value={filters.type} class={selectClass} aria-label={t('filters.op.all')}>
			{#each types as ty (ty)}<option value={ty}>{t(`type.${ty}`)}</option>{/each}
		</select>
		<select bind:value={filters.country} class={selectClass} aria-label={t('filters.country.all')}>
			{#each countries as c (c.v)}<option value={c.v}>{t(c.k)}</option>{/each}
		</select>
		<select bind:value={filters.minBedrooms} class={selectClass} aria-label={t('filters.bedrooms')}>
			{#each bedrooms as b (b)}<option value={b}>{b === 0 ? t('filters.bedrooms') : `${b}+`}</option>{/each}
		</select>
		<select bind:value={filters.maxPrice} class={selectClass} aria-label={t('filters.price_any')}>
			{#each prices as pr (pr ?? 'any')}
				<option value={pr}>{pr === undefined ? t('filters.price_any') : `${t('filters.upto')} ${formatEUR(pr)}`}</option>
			{/each}
		</select>
		<button
			type="button"
			onclick={onclear}
			class="ml-auto text-sm text-stone-500 underline-offset-4 transition-colors hover:text-ink hover:underline"
		>
			{t('filters.clear')}
		</button>
	</div>
</div>
