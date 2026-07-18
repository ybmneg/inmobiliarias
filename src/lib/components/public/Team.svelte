<script lang="ts">
	import { repo } from '$lib/data/repository';
	import { t } from '$lib/i18n/i18n.svelte';
	import Reveal from '$lib/components/ui/Reveal.svelte';

	const agents = repo.getAgents();
	const portrait = (url: string) => url.replace(/w=\d+/, 'w=600');
</script>

<section class="border-t border-stone-200 bg-white">
	<div class="mx-auto max-w-6xl px-5 py-24">
		<div class="mb-14 max-w-2xl">
			<p class="text-xs font-semibold tracking-[0.25em] text-brand-600 uppercase">{t('team.eyebrow')}</p>
			<h2 class="mt-3 text-3xl leading-tight text-ink sm:text-4xl">{t('team.title')}</h2>
		</div>

		<div class="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-5">
			{#each agents as agent, i (agent.id)}
				<Reveal delay={i * 70}>
					<div class="group">
						<div class="overflow-hidden rounded-xl border border-stone-200">
							<img
								src={portrait(agent.avatar)}
								alt={agent.name}
								loading="lazy"
								class="aspect-[3/4] w-full object-cover grayscale transition-all duration-500 ease-[var(--ease-out-quint)] group-hover:grayscale-0"
							/>
						</div>
						<h3 class="mt-4 font-display text-lg text-ink">{agent.name}</h3>
						<p class="text-sm text-brand-700">{t(`role.${agent.role}`)}</p>
						<p class="mt-1 text-xs text-stone-500">{agent.zones.join(' · ')}</p>
					</div>
				</Reveal>
			{/each}
		</div>
	</div>
</section>
