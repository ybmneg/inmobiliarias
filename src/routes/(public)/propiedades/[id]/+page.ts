import { properties } from '$lib/data/seed/properties';

// Prerender de cada ficha: una página estática por propiedad del catálogo.
export const prerender = true;
export const entries = () => properties.map((p) => ({ id: p.id }));
