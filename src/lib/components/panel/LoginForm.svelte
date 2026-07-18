<script lang="ts">
	import { session } from '$lib/auth/session.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	let user = $state('');
	let pass = $state('');
	let error = $state(false);

	function submit(e: SubmitEvent) {
		e.preventDefault();
		error = !session.login(user, pass);
	}

	const inputClass =
		'h-11 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm text-ink focus:border-ink focus:outline-none';
</script>

<svelte:head><title>Acceso · NEXUS INMO</title></svelte:head>

<div class="flex min-h-dvh items-center justify-center px-5">
	<div class="w-full max-w-sm">
		<div class="text-center">
			<a href="/" class="font-display text-2xl tracking-tight text-ink">
				NEXUS<span class="text-brand-600"> INMO</span>
			</a>
			<p class="mt-2 text-sm text-stone-500">Acceso al panel de gestión</p>
		</div>

		<form
			onsubmit={submit}
			class="mt-8 flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-6"
		>
			<div class="flex flex-col gap-1.5">
				<label for="lg-user" class="text-sm text-ink">Usuario</label>
				<input id="lg-user" bind:value={user} required autocomplete="username" class={inputClass} />
			</div>
			<div class="flex flex-col gap-1.5">
				<label for="lg-pass" class="text-sm text-ink">Contraseña</label>
				<input
					id="lg-pass"
					type="password"
					bind:value={pass}
					required
					autocomplete="current-password"
					class={inputClass}
				/>
			</div>

			{#if error}
				<p class="text-sm text-rose-600">Usuario o contraseña incorrectos.</p>
			{/if}

			<Button type="submit" variant="accent" full>Entrar</Button>
			<p class="text-center text-xs text-stone-400">
				Demo · usuario: <span class="text-stone-600">demo</span> · contraseña:
				<span class="text-stone-600">demo2026</span>
			</p>
		</form>
	</div>
</div>
