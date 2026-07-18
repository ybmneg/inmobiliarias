<script lang="ts">
	import { session } from '$lib/auth/session.svelte';
	import LoginForm from '$lib/components/panel/LoginForm.svelte';
	import PanelShell from '$lib/components/panel/PanelShell.svelte';

	let { children } = $props();
</script>

{#if session.authenticated}
	<PanelShell>{@render children()}</PanelShell>
{:else}
	<LoginForm />
{/if}
