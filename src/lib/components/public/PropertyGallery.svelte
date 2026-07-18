<script lang="ts">
	interface Props {
		images: string[];
		title: string;
	}
	let { images, title }: Props = $props();

	let selected = $state(0);
	const thumb = (url: string, w: number) => url.replace(/([?&])w=\d+/, `$1w=${w}`);
</script>

<div class="flex flex-col gap-3">
	<div class="overflow-hidden rounded-2xl border border-stone-200">
		<img
			src={thumb(images[selected], 1200)}
			alt={title}
			fetchpriority="high"
			class="aspect-[16/10] w-full object-cover"
		/>
	</div>

	{#if images.length > 1}
		<div class="grid grid-cols-4 gap-3">
			{#each images as img, i (img)}
				<button
					type="button"
					onclick={() => (selected = i)}
					class="overflow-hidden rounded-lg border-2 transition-colors {selected === i
						? 'border-brand-500'
						: 'border-transparent hover:border-stone-300'}"
					aria-label="Ver imagen {i + 1}"
				>
					<img src={thumb(img, 400)} alt="" class="aspect-[4/3] w-full object-cover" />
				</button>
			{/each}
		</div>
	{/if}
</div>
