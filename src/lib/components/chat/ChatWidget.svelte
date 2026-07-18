<script lang="ts">
	import { scale } from 'svelte/transition';
	import MessageCircle from '@lucide/svelte/icons/message-circle';
	import X from '@lucide/svelte/icons/x';
	import Send from '@lucide/svelte/icons/send';
	import { repo } from '$lib/data/repository';
	import { t } from '$lib/i18n/i18n.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { operationOptions, buyerFlow, rentBudgetOptions, type QuickOption } from './flow';

	interface Message {
		role: 'bot' | 'user';
		text: string;
	}
	type Stage =
		| 'operation'
		| 'qualify'
		| 'seller'
		| 'ask-name'
		| 'ask-phone'
		| 'ask-visit'
		| 'ask-date'
		| 'submitted';

	const askVisitOptions: QuickOption[] = [
		{ labelKey: 'chat.visit.yes', value: true },
		{ labelKey: 'chat.visit.no', value: false }
	];
	const todayStr = new Date().toISOString().slice(0, 10);
	const welcome = (): Message[] => [
		{ role: 'bot', text: t('chat.welcome1') },
		{ role: 'bot', text: t('chat.welcome2') }
	];

	let open = $state(false);
	let stage = $state<Stage>('operation');
	let qIndex = $state(0);
	let answers = $state<Record<string, string | number | boolean>>({});
	let messages = $state<Message[]>(welcome());
	let draft = $state('');
	let dateVal = $state('');
	let name = $state('');
	let phone = $state('');
	let listEl: HTMLDivElement | undefined = $state();

	const activeFlow = $derived(
		answers.operation === 'alquilar' ? buyerFlow.filter((s) => s.id !== 'needsMortgage') : buyerFlow
	);
	const currentOptions = $derived<QuickOption[]>(
		stage === 'operation'
			? operationOptions
			: stage === 'qualify'
				? activeFlow[qIndex].id === 'budget' && answers.operation === 'alquilar'
					? rentBudgetOptions
					: activeFlow[qIndex].options
				: stage === 'ask-visit'
					? askVisitOptions
					: []
	);

	$effect(() => {
		void messages.length;
		if (listEl) listEl.scrollTo({ top: listEl.scrollHeight, behavior: 'smooth' });
	});

	const pushBot = (text: string) => (messages = [...messages, { role: 'bot', text }]);
	const pushUser = (text: string) => (messages = [...messages, { role: 'user', text }]);

	function finalize(scheduleDate?: string): string | null {
		const urgency = (answers.urgency as 'alta' | 'media' | 'baja' | undefined) ?? null;
		const temperature = urgency === 'alta' ? 'caliente' : urgency === 'baja' ? 'frio' : 'templado';
		const wantsRent = answers.operation === 'alquilar';
		const budget = answers.budget != null ? Number(answers.budget) : null;

		const lead = repo.addLead({
			name,
			phone,
			type: 'comprador',
			source: 'chatbot',
			temperature,
			zone: String(answers.zone ?? ''),
			budget,
			needsMortgage: typeof answers.needsMortgage === 'boolean' ? answers.needsMortgage : null,
			urgency,
			notes: `Lead del chatbot · quiere ${answers.operation} en ${answers.zone}.`
		});

		if (!scheduleDate) return null;
		const match = repo.searchProperties({
			city: String(answers.zone),
			operation: wantsRent ? 'alquiler' : 'venta',
			maxPrice: budget ?? undefined,
			onlyAvailable: true
		})[0];
		if (!match) return null;
		repo.addVisit({
			propertyId: match.id,
			leadId: lead.id,
			agentId: match.agentId,
			date: scheduleDate,
			time: '11:00',
			notes: 'Visita solicitada desde el chatbot.'
		});
		repo.setLeadStatus(lead.id, 'visita');
		return match.title;
	}

	function handleOption(opt: QuickOption) {
		pushUser(t(opt.labelKey));
		if (stage === 'operation') {
			answers.operation = opt.value;
			if (opt.value === 'vender') {
				stage = 'seller';
				pushBot(t('chat.seller'));
			} else {
				stage = 'qualify';
				qIndex = 0;
				pushBot(t(opt.value === 'alquilar' ? 'chat.q.rent' : 'chat.q.budget'));
			}
		} else if (stage === 'qualify') {
			answers[activeFlow[qIndex].id] = opt.value;
			if (qIndex < activeFlow.length - 1) {
				qIndex += 1;
				pushBot(t(activeFlow[qIndex].botKey));
			} else {
				pushBot(t('chat.ask_name'));
				stage = 'ask-name';
			}
		} else if (stage === 'ask-visit') {
			if (opt.value === true) {
				stage = 'ask-date';
				pushBot(t('chat.ask_date'));
			} else {
				finalize();
				pushBot(t('chat.done_novisit'));
				stage = 'submitted';
			}
		}
	}

	function submitDraft() {
		const val = draft.trim();
		if (!val) return;
		pushUser(val);
		draft = '';
		if (stage === 'ask-name') {
			name = val;
			stage = 'ask-phone';
			pushBot(t('chat.ask_phone'));
		} else if (stage === 'ask-phone') {
			phone = val;
			stage = 'ask-visit';
			pushBot(t('chat.ask_visit'));
		}
	}

	function submitDate() {
		if (!dateVal) return;
		pushUser(dateVal);
		const prop = finalize(dateVal);
		pushBot(t(prop ? 'chat.done_visit' : 'chat.done_nomatch'));
		dateVal = '';
		stage = 'submitted';
	}

	function restart() {
		messages = welcome();
		stage = 'operation';
		qIndex = 0;
		answers = {};
		draft = dateVal = name = phone = '';
	}
</script>

{#if open}
	<div
		class="fixed right-4 bottom-24 z-[90] flex h-[70vh] max-h-[560px] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xl"
		transition:scale={{ duration: 200, start: 0.95 }}
	>
		<header class="flex items-center justify-between gap-3 bg-ink px-4 py-3.5 text-white">
			<div class="flex items-center gap-2.5">
				<span class="grid size-9 place-items-center rounded-full bg-brand-500 text-sm font-bold text-ink">N</span>
				<div>
					<p class="text-sm font-medium">NEXUS INMO</p>
					<p class="flex items-center gap-1.5 text-xs text-stone-400">
						<span class="size-1.5 rounded-full bg-emerald-400"></span> {t('chat.online')}
					</p>
				</div>
			</div>
			<button
				onclick={() => (open = false)}
				class="grid size-8 place-items-center rounded-lg text-stone-400 hover:bg-white/10 hover:text-white"
				aria-label={t('chat.online')}
			>
				<X size={18} />
			</button>
		</header>

		<div bind:this={listEl} class="flex-1 space-y-3 overflow-y-auto bg-stone-50 p-4">
			{#each messages as msg, i (i)}
				<div class="flex {msg.role === 'user' ? 'justify-end' : 'justify-start'}">
					<div
						class="max-w-[82%] rounded-2xl px-3.5 py-2 text-sm {msg.role === 'user'
							? 'rounded-br-sm bg-ink text-white'
							: 'rounded-bl-sm border border-stone-200 bg-white text-stone-700'}"
					>
						{msg.text}
					</div>
				</div>
			{/each}
		</div>

		<div class="border-t border-stone-200 bg-white p-3">
			{#if currentOptions.length > 0}
				<div class="flex flex-wrap gap-2">
					{#each currentOptions as opt (opt.labelKey)}
						<button
							onclick={() => handleOption(opt)}
							class="rounded-full border border-stone-300 px-3.5 py-2 text-sm text-ink transition-colors hover:border-ink hover:bg-stone-50"
						>
							{t(opt.labelKey)}
						</button>
					{/each}
				</div>
			{:else if stage === 'ask-name' || stage === 'ask-phone'}
				<div class="flex items-center gap-2">
					<input
						bind:value={draft}
						onkeydown={(e) => e.key === 'Enter' && submitDraft()}
						type={stage === 'ask-phone' ? 'tel' : 'text'}
						placeholder={stage === 'ask-phone' ? t('chat.phone_ph') : t('chat.name_ph')}
						class="h-10 flex-1 rounded-full border border-stone-300 px-4 text-sm text-ink focus:border-ink focus:outline-none"
					/>
					<button
						onclick={submitDraft}
						disabled={!draft.trim()}
						class="grid size-10 shrink-0 place-items-center rounded-full bg-brand-500 text-ink transition-colors hover:bg-brand-400 disabled:opacity-40"
						aria-label={t('booking.confirm')}
					>
						<Send size={18} />
					</button>
				</div>
			{:else if stage === 'ask-date'}
				<div class="flex items-center gap-2">
					<input
						bind:value={dateVal}
						type="date"
						min={todayStr}
						class="h-10 flex-1 rounded-full border border-stone-300 px-4 text-sm text-ink focus:border-ink focus:outline-none"
					/>
					<button
						onclick={submitDate}
						disabled={!dateVal}
						class="grid size-10 shrink-0 place-items-center rounded-full bg-brand-500 text-ink transition-colors hover:bg-brand-400 disabled:opacity-40"
						aria-label={t('booking.confirm')}
					>
						<Send size={18} />
					</button>
				</div>
			{:else if stage === 'seller'}
				<div class="flex flex-col gap-2">
					<Button href="/vender" variant="accent" full>{t('chat.seller_cta')}</Button>
					<button onclick={restart} class="text-xs text-stone-500 hover:text-ink">{t('chat.restart')}</button>
				</div>
			{:else}
				<div class="flex flex-col gap-2">
					<Button href="/propiedades" variant="outline" full>{t('cta.button')}</Button>
					<button onclick={restart} class="text-xs text-stone-500 hover:text-ink">{t('chat.restart')}</button>
				</div>
			{/if}
		</div>
	</div>
{/if}

<button
	onclick={() => (open = !open)}
	class="fixed right-4 bottom-4 z-[90] grid size-14 place-items-center rounded-full bg-ink text-white shadow-lg transition-all duration-200 ease-[var(--ease-spring)] hover:-translate-y-0.5 hover:bg-brand-600 active:scale-95"
	aria-label={t('chat.welcome2')}
>
	{#if open}
		<span in:scale={{ duration: 150 }}><X size={24} /></span>
	{:else}
		<span in:scale={{ duration: 150 }}><MessageCircle size={24} /></span>
	{/if}
</button>
