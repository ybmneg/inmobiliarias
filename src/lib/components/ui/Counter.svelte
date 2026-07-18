<script lang="ts">
	import { untrack } from 'svelte';
	import { Tween } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	interface Props {
		value: number;
		duration?: number;
		class?: string;
	}
	let { value, duration = 1200, class: extra = '' }: Props = $props();

	const n = new Tween(0, { duration: untrack(() => duration), easing: cubicOut });
	let el: HTMLElement | undefined = $state();
	let done = $state(false);

	$effect(() => {
		if (!el || done) return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			n.set(value, { duration: 0 });
			done = true;
			return;
		}
		const io = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						n.target = value;
						done = true;
						io.disconnect();
					}
				}
			},
			{ threshold: 0.4 }
		);
		io.observe(el);
		return () => io.disconnect();
	});
</script>

<span bind:this={el} class={extra}>{Math.round(n.current)}</span>
