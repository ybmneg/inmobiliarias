<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		delay?: number; // ms — para revelados en cascada
		y?: number; // desplazamiento vertical inicial (px)
		once?: boolean;
		class?: string;
		children: Snippet;
	}
	let { delay = 0, y = 18, once = true, class: extra = '', children }: Props = $props();

	let el: HTMLElement | undefined = $state();
	let visible = $state(false);

	$effect(() => {
		if (!el) return;
		// Respeta la preferencia de movimiento reducido: aparece sin animar.
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			visible = true;
			return;
		}
		const io = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						visible = true;
						if (once) io.disconnect();
					} else if (!once) {
						visible = false;
					}
				}
			},
			{ threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
		);
		io.observe(el);
		return () => io.disconnect();
	});
</script>

<div
	bind:this={el}
	class="transform-gpu transition-all duration-700 ease-[var(--ease-out-quint)] motion-reduce:!transition-none {extra}"
	class:opacity-0={!visible}
	class:opacity-100={visible}
	style="transition-delay: {delay}ms; transform: translateY({visible ? 0 : y}px);"
>
	{@render children()}
</div>
