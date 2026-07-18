<script lang="ts">
	import Navbar from '$lib/components/public/Navbar.svelte';
	import Footer from '$lib/components/public/Footer.svelte';
	import ChatWidget from '$lib/components/chat/ChatWidget.svelte';

	let { children } = $props();
</script>

<Navbar />
{@render children()}
<Footer />
<ChatWidget />
