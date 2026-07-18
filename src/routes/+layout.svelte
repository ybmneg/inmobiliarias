<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import fontDisplay from '@fontsource/libre-baskerville/files/libre-baskerville-latin-400-normal.woff2';
	import fontBody from '@fontsource-variable/open-sans/files/open-sans-latin-wght-normal.woff2';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<!-- Precarga de las fuentes críticas (mejora el LCP: titulares/logo serif) -->
	<link rel="preload" as="font" type="font/woff2" href={fontDisplay} crossorigin="anonymous" />
	<link rel="preload" as="font" type="font/woff2" href={fontBody} crossorigin="anonymous" />
</svelte:head>
{@render children()}
