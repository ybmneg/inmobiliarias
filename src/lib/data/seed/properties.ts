import type { Property } from '../types';

/**
 * Pool de imágenes Unsplash verificadas (todas comprobadas HTTP 200).
 * img() centraliza la construcción de URL: tamaño/calidad se cambian
 * en un único sitio. pics() arma la galería (la primera es la portada).
 */
const img = (id: string, w = 1600): string =>
	`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;
const pics = (...ids: string[]): string[] => ids.map((id) => img(id));

export const properties: Property[] = [
	{
		id: 'prop-01', ref: 'NX-2041', agentId: 'agent-01',
		title: 'Ático de diseño con terraza panorámica',
		description: 'Vivienda exterior reformada en el corazón de Chamberí, con terraza de 40 m² y vistas abiertas al skyline de Madrid.',
		type: 'atico', operation: 'venta', status: 'disponible', price: 685000,
		location: { city: 'Madrid', zone: 'Chamberí', country: 'ES', lat: 40.4361, lng: -3.7038 },
		specs: { bedrooms: 3, bathrooms: 2, area: 128, floor: 7, parking: true, terrace: true, pool: false, elevator: true, energyRating: 'B', yearBuilt: 2019 },
		amenities: ['Terraza 40 m²', 'Aire acondicionado', 'Domótica', 'Trastero'],
		images: pics('1600585154340-be6161a56a0c', '1600596542815-ffad4c1539a9', '1600607687939-ce8a6c25118c', '1600566753086-00f18fb6b3ea'),
		featured: true, createdAt: '2026-06-02'
	},
	{
		id: 'prop-02', ref: 'NX-2042', agentId: 'agent-02',
		title: 'Piso señorial en Barrio de Salamanca',
		description: 'Clásico reformado con techos altos, suelos de roble y molduras originales. Portero físico y finca rehabilitada de lujo.',
		type: 'piso', operation: 'venta', status: 'disponible', price: 895000,
		location: { city: 'Madrid', zone: 'Salamanca', country: 'ES', lat: 40.4278, lng: -3.6796 },
		specs: { bedrooms: 4, bathrooms: 3, area: 186, floor: 3, parking: false, terrace: false, pool: false, elevator: true, energyRating: 'C', yearBuilt: 1974 },
		amenities: ['Techos 3,2 m', 'Portero físico', 'Armarios empotrados', 'Cocina office'],
		images: pics('1600047509807-ba8f99d2cdde', '1600210492486-724fe5c67fb0', '1600566752355-35792bedcfea', '1600607688969-a5bfcd646154'),
		featured: true, createdAt: '2026-05-18'
	},
	{
		id: 'prop-03', ref: 'NX-2043', agentId: 'agent-03',
		title: 'Estudio luminoso en pleno Malasaña',
		description: 'Ideal para inversión o primera vivienda. Totalmente amueblado, alta rentabilidad por su ubicación en zona de máxima demanda.',
		type: 'estudio', operation: 'alquiler', status: 'disponible', price: 1150,
		location: { city: 'Madrid', zone: 'Malasaña', country: 'ES', lat: 40.4257, lng: -3.7038 },
		specs: { bedrooms: 1, bathrooms: 1, area: 42, floor: 2, parking: false, terrace: false, pool: false, elevator: false, energyRating: 'D', yearBuilt: 1960 },
		amenities: ['Amueblado', 'Reformado', 'Fibra óptica', 'Zona céntrica'],
		images: pics('1583608205776-bfd35f0d9f83', '1502672260266-1c1ef2d93688', '1493809842364-78817add7ffb', '1522708323590-d24dbb6b0267'),
		featured: false, createdAt: '2026-06-21'
	},
	{
		id: 'prop-04', ref: 'NX-2044', agentId: 'agent-02',
		title: 'Dúplex modernista en el Eixample',
		description: 'Vivienda de dos plantas con elementos modernistas restaurados, gran salón con balcones a la calle y suite principal independiente.',
		type: 'duplex', operation: 'venta', status: 'disponible', price: 749000,
		location: { city: 'Barcelona', zone: 'Eixample', country: 'ES', lat: 41.3888, lng: 2.1590 },
		specs: { bedrooms: 3, bathrooms: 2, area: 145, floor: 4, parking: false, terrace: true, pool: false, elevator: true, energyRating: 'C', yearBuilt: 1928 },
		amenities: ['Balcones modernistas', 'Suite principal', 'Calefacción central', 'Trastero'],
		images: pics('1568605114967-8130f3a36994', '1560448204-e02f11c3d0e2', '1560185007-cde436f6a4d0', '1512918728675-ed5a9ecdebfd'),
		featured: true, createdAt: '2026-05-29'
	},
	{
		id: 'prop-05', ref: 'NX-2045', agentId: 'agent-03',
		title: 'Piso con encanto en Gràcia',
		description: 'En una de las zonas más auténticas de Barcelona. Balcón a plaza tranquila, mucha luz natural y a un paso de bares y mercados.',
		type: 'piso', operation: 'alquiler', status: 'disponible', price: 1650,
		location: { city: 'Barcelona', zone: 'Gràcia', country: 'ES', lat: 41.4036, lng: 2.1560 },
		specs: { bedrooms: 2, bathrooms: 1, area: 78, floor: 3, parking: false, terrace: false, pool: false, elevator: false, energyRating: 'E', yearBuilt: 1955 },
		amenities: ['Balcón a plaza', 'Suelo hidráulico', 'Muy luminoso', 'Amueblado'],
		images: pics('1600047509358-9dc75507daeb', '1502005229762-cf1b2da7c5d6', '1616486338812-3dadae4b4ace', '1616137466211-f939a420be84'),
		featured: false, createdAt: '2026-06-10'
	},
	{
		id: 'prop-06', ref: 'NX-2046', agentId: 'agent-04',
		title: 'Casa con patio en Ruzafa',
		description: 'Casa reformada con patio interior ajardinado en el barrio más de moda de Valencia. Perfecta combinación de tradición y diseño actual.',
		type: 'casa', operation: 'venta', status: 'disponible', price: 545000,
		location: { city: 'Valencia', zone: 'Ruzafa', country: 'ES', lat: 39.4590, lng: -0.3730 },
		specs: { bedrooms: 3, bathrooms: 2, area: 160, floor: 0, parking: true, terrace: true, pool: false, elevator: false, energyRating: 'B', yearBuilt: 2015 },
		amenities: ['Patio ajardinado', 'Garaje', 'Cocina de diseño', 'Placas solares'],
		images: pics('1570129477492-45c003edd2be', '1616594039964-ae9021a400a0', '1615529182904-14819c35db37', '1567496898669-ee935f5f647a'),
		featured: false, createdAt: '2026-04-27'
	},
	{
		id: 'prop-07', ref: 'NX-2047', agentId: 'agent-01',
		title: 'Chalet con piscina en Marbella',
		description: 'Villa mediterránea a 400 m de la playa, con piscina privada, jardín tropical y amplias zonas exteriores para vida al aire libre.',
		type: 'chalet', operation: 'venta', status: 'disponible', price: 1450000,
		location: { city: 'Málaga', zone: 'Marbella', country: 'ES', lat: 36.5099, lng: -4.8856 },
		specs: { bedrooms: 5, bathrooms: 4, area: 320, floor: 0, parking: true, terrace: true, pool: true, elevator: false, energyRating: 'A', yearBuilt: 2021 },
		amenities: ['Piscina privada', 'Jardín tropical', 'Garaje 2 coches', 'Domótica integral'],
		images: pics('1512917774080-9991f1c4c750', '1556909212-d5b604d0c90d', '1556912173-3bb406ef7e77', '1502005097973-6a7082348e28'),
		featured: true, createdAt: '2026-05-06'
	},
	{
		id: 'prop-08', ref: 'NX-2048', agentId: 'agent-05',
		title: 'Piso reformado junto al puerto',
		description: 'A pocos metros del centro histórico de Málaga y del Muelle Uno. Reforma integral reciente lista para entrar a vivir.',
		type: 'piso', operation: 'venta', status: 'reservada', price: 315000,
		location: { city: 'Málaga', zone: 'Centro', country: 'ES', lat: 36.7213, lng: -4.4214 },
		specs: { bedrooms: 2, bathrooms: 1, area: 74, floor: 5, parking: false, terrace: false, pool: false, elevator: true, energyRating: 'C', yearBuilt: 1998 },
		amenities: ['Reforma integral', 'Aire acondicionado', 'A 300 m de la playa', 'Ascensor'],
		images: pics('1600585152220-90363fe7e115', '1600596542815-ffad4c1539a9', '1600210492486-724fe5c67fb0', '1502672260266-1c1ef2d93688'),
		featured: false, createdAt: '2026-06-14'
	},
	{
		id: 'prop-09', ref: 'NX-2049', agentId: 'agent-04',
		title: 'Ático con solárium en la Marina',
		description: 'Espectacular ático en alquiler con solárium privado y vistas al mar. Acabados premium y plaza de garaje incluida.',
		type: 'atico', operation: 'alquiler', status: 'disponible', price: 2100,
		location: { city: 'Valencia', zone: 'La Marina', country: 'ES', lat: 39.4610, lng: -0.3250 },
		specs: { bedrooms: 3, bathrooms: 2, area: 110, floor: 9, parking: true, terrace: true, pool: true, elevator: true, energyRating: 'A', yearBuilt: 2020 },
		amenities: ['Solárium privado', 'Vistas al mar', 'Piscina comunitaria', 'Garaje'],
		images: pics('1600585153490-76fb20a32601', '1600607687939-ce8a6c25118c', '1600566752355-35792bedcfea', '1493809842364-78817add7ffb'),
		featured: false, createdAt: '2026-06-25'
	},
	{
		id: 'prop-10', ref: 'NX-2050', agentId: 'agent-02',
		title: 'Appartement lumineux à Ixelles',
		description: 'Piso reformado en una de las zonas más vibrantes de Bruselas, cerca de los estanques de Ixelles y con excelente conexión de transporte.',
		type: 'piso', operation: 'venta', status: 'disponible', price: 465000,
		location: { city: 'Bruselas', zone: 'Ixelles', country: 'BE', lat: 50.8270, lng: 4.3670 },
		specs: { bedrooms: 2, bathrooms: 1, area: 92, floor: 2, parking: false, terrace: true, pool: false, elevator: true, energyRating: 'C', yearBuilt: 1935 },
		amenities: ['Parquet original', 'Balcón', 'Cave privée', 'Doble acristalamiento'],
		images: pics('1580587771525-78b9dba3b914', '1600566753086-00f18fb6b3ea', '1600607688969-a5bfcd646154', '1522708323590-d24dbb6b0267'),
		featured: false, createdAt: '2026-05-22'
	},
	{
		id: 'prop-11', ref: 'NX-2051', agentId: 'agent-01',
		title: 'Maison de maître à Uccle',
		description: 'Elegante casa señorial con jardín privado y piscina en la zona residencial más cotizada de Bruselas. Amplios espacios y mucha luz.',
		type: 'casa', operation: 'venta', status: 'disponible', price: 890000,
		location: { city: 'Bruselas', zone: 'Uccle', country: 'BE', lat: 50.8010, lng: 4.3380 },
		specs: { bedrooms: 5, bathrooms: 3, area: 280, floor: 0, parking: true, terrace: true, pool: true, elevator: false, energyRating: 'B', yearBuilt: 2008 },
		amenities: ['Jardín privado', 'Piscina', 'Chimenea', 'Garaje doble'],
		images: pics('1449844908441-8829872d2607', '1560448204-e02f11c3d0e2', '1502005229762-cf1b2da7c5d6', '1615529182904-14819c35db37'),
		featured: true, createdAt: '2026-04-19'
	},
	{
		id: 'prop-12', ref: 'NX-2052', agentId: 'agent-04',
		title: 'Duplex Art Nouveau à Zurenborg',
		description: 'Dúplex en alquiler en el célebre barrio Art Nouveau de Amberes. Detalles de época restaurados con confort contemporáneo.',
		type: 'duplex', operation: 'alquiler', status: 'disponible', price: 1450,
		location: { city: 'Amberes', zone: 'Zurenborg', country: 'BE', lat: 51.2050, lng: 4.4310 },
		specs: { bedrooms: 3, bathrooms: 2, area: 130, floor: 1, parking: false, terrace: true, pool: false, elevator: false, energyRating: 'D', yearBuilt: 1905 },
		amenities: ['Vidrieras originales', 'Terraza', 'Techos altos', 'Calefacción de gas'],
		images: pics('1484154218962-a197022b5858', '1560185007-cde436f6a4d0', '1616486338812-3dadae4b4ace', '1616594039964-ae9021a400a0'),
		featured: false, createdAt: '2026-06-05'
	},
	{
		id: 'prop-13', ref: 'NX-2053', agentId: 'agent-05',
		title: 'Appartement au centre de Gand',
		description: 'Piso céntrico en Gante a un paso de los canales medievales. Perfecto para vivir o invertir en una ciudad universitaria en auge.',
		type: 'piso', operation: 'venta', status: 'disponible', price: 379000,
		location: { city: 'Gante', zone: 'Centrum', country: 'BE', lat: 51.0540, lng: 3.7250 },
		specs: { bedrooms: 2, bathrooms: 1, area: 85, floor: 3, parking: false, terrace: false, pool: false, elevator: true, energyRating: 'B', yearBuilt: 2012 },
		amenities: ['Vistas al canal', 'Cocina equipada', 'Ascensor', 'Trastero'],
		images: pics('1522156373667-4c7234bbd804', '1512918728675-ed5a9ecdebfd', '1616137466211-f939a420be84', '1567496898669-ee935f5f647a'),
		featured: false, createdAt: '2026-06-18'
	},
	{
		id: 'prop-14', ref: 'NX-2054', agentId: 'agent-03',
		title: 'Estudio junto al Parque del Retiro',
		description: 'Coqueto estudio a 200 m del Retiro, reformado y muy luminoso. Excelente oportunidad de inversión con alquiler asegurado.',
		type: 'estudio', operation: 'venta', status: 'disponible', price: 289000,
		location: { city: 'Madrid', zone: 'Retiro', country: 'ES', lat: 40.4150, lng: -3.6830 },
		specs: { bedrooms: 1, bathrooms: 1, area: 38, floor: 4, parking: false, terrace: false, pool: false, elevator: true, energyRating: 'D', yearBuilt: 1969 },
		amenities: ['Junto al Retiro', 'Reformado', 'Ascensor', 'Alta rentabilidad'],
		images: pics('1554995207-c18c203602cb', '1600596542815-ffad4c1539a9', '1600566752355-35792bedcfea', '1600607688969-a5bfcd646154'),
		featured: false, createdAt: '2026-06-28'
	},
	{
		id: 'prop-15', ref: 'NX-2055', agentId: 'agent-01',
		title: 'Maison historique à Bruges',
		description: 'Casa histórica con fachada protegida en el centro de Brujas, patrimonio de la Unesco. Encanto medieval con reformas de calidad.',
		type: 'casa', operation: 'venta', status: 'disponible', price: 625000,
		location: { city: 'Brujas', zone: 'Centrum', country: 'BE', lat: 51.2090, lng: 3.2247 },
		specs: { bedrooms: 4, bathrooms: 2, area: 205, floor: 0, parking: false, terrace: true, pool: false, elevator: false, energyRating: 'C', yearBuilt: 1890 },
		amenities: ['Fachada protegida', 'Vigas de madera', 'Jardín trasero', 'Chimenea original'],
		images: pics('1615873968403-89e068629265', '1600566753086-00f18fb6b3ea', '1502672260266-1c1ef2d93688', '1522708323590-d24dbb6b0267'),
		featured: true, createdAt: '2026-05-11'
	}
];

/** Búsqueda rápida de propiedad por id (devuelve undefined si no existe). */
export const propertyById = (id: string): Property | undefined =>
	properties.find((p) => p.id === id);
