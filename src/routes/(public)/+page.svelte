<script lang="ts">
	import Hero from '$lib/components/public/Hero.svelte';
	import FeaturedProperties from '$lib/components/public/FeaturedProperties.svelte';
	import WhyUs from '$lib/components/public/WhyUs.svelte';
	import Services from '$lib/components/public/Services.svelte';
	import Team from '$lib/components/public/Team.svelte';
	import Testimonials from '$lib/components/public/Testimonials.svelte';
	import Faq from '$lib/components/public/Faq.svelte';
	import ContactCta from '$lib/components/public/ContactCta.svelte';
	import { site } from '$lib/config/site';
</script>

<svelte:head>
	<title>NEXUS INMO — Inmobiliaria inteligente en España y Bélgica</title>
	<meta name="description" content={site.description} />
</svelte:head>

<Hero />
<FeaturedProperties />
<WhyUs />
<Services />
<Team />
<Testimonials />
<Faq />
<ContactCta />
