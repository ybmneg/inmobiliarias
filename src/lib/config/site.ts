/**
 * Configuración de marca ficticia de NEXUS INMO.
 * Marca genérica y datos inventados: la demo se presenta a cualquier cliente.
 * NOTA: la navegación NO incluye /panel (zona privada oculta, solo por URL).
 */

export interface NavLink {
	label: string;
	href: string;
}

export interface SiteConfig {
	name: string;
	logoMark: string; // parte destacada del wordmark tipográfico
	tagline: string;
	description: string;
	nav: NavLink[];
	cta: NavLink;
	contact: {
		phone: string;
		whatsapp: string; // solo dígitos, para enlaces wa.me
		email: string;
		address: string;
	};
	socials: NavLink[];
}

export const site: SiteConfig = {
	name: 'NEXUS INMO',
	logoMark: 'NEXUS',
	tagline: 'Inmobiliaria inteligente',
	description:
		'Encuentra tu próxima propiedad en España y Bélgica con la agencia más avanzada del sector.',
	nav: [
		{ label: 'Propiedades', href: '/propiedades' },
		{ label: 'Vender', href: '/vender' },
		{ label: 'Nosotros', href: '/nosotros' },
		{ label: 'Contacto', href: '/contacto' }
	],
	cta: { label: '¿Cuánto vale tu piso?', href: '/vender' },
	contact: {
		phone: '+34 900 123 456',
		whatsapp: '34900123456',
		email: 'hola@nexusinmo.demo',
		address: 'Gran Vía 00, Madrid · Avenue Louise 00, Bruxelles'
	},
	socials: [
		{ label: 'Instagram', href: 'https://instagram.com' },
		{ label: 'LinkedIn', href: 'https://linkedin.com' },
		{ label: 'Facebook', href: 'https://facebook.com' }
	]
};
