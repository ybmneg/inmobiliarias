<script lang="ts">
	import { Tween } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import Check from '@lucide/svelte/icons/check';
	import { repo } from '$lib/data/repository';
	import { formatEUR } from '$lib/utils/format';
	import { t } from '$lib/i18n/i18n.svelte';
	import { estimateValue, CITIES, type Condition, type ValuationResult } from '$lib/utils/valuation';
	import type { PropertyType } from '$lib/data/types';
	import Button from '$lib/components/ui/Button.svelte';

	const types: PropertyType[] = ['piso', 'atico', 'casa', 'chalet', 'duplex', 'estudio'];
	const conditions: Condition[] = ['nuevo', 'bueno', 'reformar'];
	const extras = ['terrace', 'parking', 'pool'] as const;

	let step = $state(1);
	let type = $state<PropertyType>('piso');
	let city = $state('Madrid');
	let area = $state<number | null>(null);
	let bedrooms = $state(2);
	let condition = $state<Condition>('bueno');
	let terrace = $state(false);
	let parking = $state(false);
	let pool = $state(false);
	let name = $state('');
	let phone = $state('');
	let email = $state('');
	let result = $state<ValuationResult | null>(null);

	const animated = new Tween(0, { duration: 1400, easing: cubicOut });
	const canProceed = $derived(step !== 2 || (area ?? 0) > 0);
	const selectClass =
		'h-11 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm text-ink focus:border-ink focus:outline-none';

	const extraOn = (k: (typeof extras)[number]) =>
		k === 'terrace' ? terrace : k === 'parking' ? parking : pool;
	function toggleExtra(k: (typeof extras)[number]) {
		if (k === 'terrace') terrace = !terrace;
		else if (k === 'parking') parking = !parking;
		else pool = !pool;
	}

	function next() {
		if (canProceed && step < 4) step += 1;
	}
	function back() {
		if (step > 1) step -= 1;
	}
	function finish(e: SubmitEvent) {
		e.preventDefault();
		const res = estimateValue({ type, city, area: area ?? 0, condition, terrace, parking, pool });
		const country = CITIES.find((c) => c.name === city)?.country ?? 'ES';
		repo.addLead({
			name,
			phone,
			email,
			type: 'vendedor',
			source: 'valoracion',
			temperature: 'caliente',
			zone: city,
			notes: `Valoración online: ${type} en ${city} (${area} m², ${condition}). Estimación ${formatEUR(res.min)}–${formatEUR(res.max)}. País: ${country}.`
		});
		result = res;
		animated.target = res.mid;
	}
</script>

<div class="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
	{#if !result}
		<div class="mb-8">
			<div class="flex items-center justify-between text-xs text-stone-500">
				<span>{t('widget.step')} {step} {t('widget.of')} 4</span>
				<span>{Math.round((step / 4) * 100)}%</span>
			</div>
			<div class="mt-2 h-1 overflow-hidden rounded-full bg-stone-200">
				<div
					class="h-full rounded-full bg-brand-500 transition-all duration-500 ease-[var(--ease-out-quint)]"
					style="width: {(step / 4) * 100}%"
				></div>
			</div>
		</div>

		{#if step === 1}
			<h2 class="font-display text-2xl text-ink">{t('widget.q1')}</h2>
			<div class="mt-5 grid grid-cols-3 gap-2">
				{#each types as ty (ty)}
					<button
						type="button"
						onclick={() => (type = ty)}
						class="rounded-lg border px-3 py-3 text-sm transition-colors {type === ty
							? 'border-ink bg-ink text-white'
							: 'border-stone-300 text-ink hover:border-stone-400'}"
					>
						{t(`type.${ty}`)}
					</button>
				{/each}
			</div>
			<label for="v-city" class="mt-6 block text-sm text-ink">{t('widget.city')}</label>
			<select id="v-city" bind:value={city} class="{selectClass} mt-1.5">
				{#each CITIES as c (c.name)}<option value={c.name}>{c.name}</option>{/each}
			</select>
		{:else if step === 2}
			<h2 class="font-display text-2xl text-ink">{t('widget.q2')}</h2>
			<label for="v-area" class="mt-5 block text-sm text-ink">{t('widget.area')}</label>
			<input id="v-area" type="number" min="1" bind:value={area} placeholder="90" class="{selectClass} mt-1.5" />
			<label for="v-beds" class="mt-6 block text-sm text-ink">{t('ficha.bedrooms')}</label>
			<select id="v-beds" bind:value={bedrooms} class="{selectClass} mt-1.5">
				{#each [1, 2, 3, 4, 5] as b (b)}<option value={b}>{b}</option>{/each}
			</select>
		{:else if step === 3}
			<h2 class="font-display text-2xl text-ink">{t('widget.q3')}</h2>
			<div class="mt-5 grid grid-cols-3 gap-2">
				{#each conditions as c (c)}
					<button
						type="button"
						onclick={() => (condition = c)}
						class="rounded-lg border px-3 py-3 text-sm transition-colors {condition === c
							? 'border-ink bg-ink text-white'
							: 'border-stone-300 text-ink hover:border-stone-400'}"
					>
						{t(`widget.cond.${c}`)}
					</button>
				{/each}
			</div>
			<div class="mt-6 flex flex-wrap gap-2">
				{#each extras as k (k)}
					<button
						type="button"
						onclick={() => toggleExtra(k)}
						class="inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition-colors {extraOn(
							k
						)
							? 'border-brand-500 bg-brand-500/10 text-brand-700'
							: 'border-stone-300 text-stone-600 hover:border-stone-400'}"
					>
						{#if extraOn(k)}<Check size={14} />{/if}
						{t(`widget.extra.${k}`)}
					</button>
				{/each}
			</div>
		{:else if step === 4}
			<h2 class="font-display text-2xl text-ink">{t('widget.q4')}</h2>
			<p class="mt-2 text-sm text-stone-500">{t('widget.q4_sub')}</p>
			<form class="mt-5 flex flex-col gap-4" onsubmit={finish}>
				<input bind:value={name} required placeholder={t('booking.name')} class={selectClass} aria-label={t('booking.name')} />
				<input bind:value={phone} required type="tel" placeholder={t('booking.phone')} class={selectClass} aria-label={t('booking.phone')} />
				<input bind:value={email} type="email" placeholder={t('widget.email')} class={selectClass} aria-label={t('widget.email')} />
				<Button type="submit" variant="accent" full>{t('widget.calc')}</Button>
			</form>
		{/if}

		{#if step < 4}
			<div class="mt-8 flex items-center justify-between">
				{#if step > 1}
					<Button variant="ghost" onclick={back}><ArrowLeft size={16} /> {t('widget.back')}</Button>
				{:else}
					<span></span>
				{/if}
				<Button onclick={next} disabled={!canProceed}>{t('widget.next')} <ArrowRight size={16} /></Button>
			</div>
		{:else}
			<div class="mt-6">
				<Button variant="ghost" onclick={back}><ArrowLeft size={16} /> {t('widget.back')}</Button>
			</div>
		{/if}
	{:else}
		<div class="py-4 text-center">
			<p class="text-xs font-semibold tracking-[0.25em] text-brand-600 uppercase">
				{t('widget.result_eyebrow')}
			</p>
			<p class="mt-4 font-display text-5xl font-bold text-ink">{formatEUR(Math.round(animated.current))}</p>
			<p class="mt-3 text-stone-500">
				{t('widget.range')}
				<span class="text-ink">{formatEUR(result.min)}</span>
				{t('widget.and')}
				<span class="text-ink">{formatEUR(result.max)}</span>
			</p>
			<p class="mt-6 text-sm text-stone-500">
				{t('widget.thanks_pre')}, {name.split(' ')[0]}. {t('widget.thanks_post')}
			</p>
			<div class="mt-8 flex justify-center gap-3">
				<Button href="/propiedades" variant="outline">{t('cta.button')}</Button>
			</div>
		</div>
	{/if}
</div>
