/**
 * Generador de contratos en PDF (jsPDF). Plantillas España: arras (venta) y
 * arrendamiento (alquiler), con marca de agua "BORRADOR". Estructura preparada
 * para añadir plantillas de Bélgica (nuevo `kind` + set de cláusulas).
 * jsPDF se importa de forma dinámica → no entra en el bundle SSR.
 */

export type ContractKind = 'arras' | 'alquiler';

export interface ContractInput {
	kind: ContractKind;
	city: string;
	date: string; // ISO (YYYY-MM-DD)
	ownerName: string;
	clientName: string;
	clientId: string;
	propertyTitle: string;
	propertyRef: string;
	propertyAddress: string;
	price: number;
	deposit: number;
}

const eur = (n: number) =>
	new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

export async function generateContractPdf(input: ContractInput): Promise<void> {
	const { jsPDF } = await import('jspdf');
	const doc = new jsPDF({ unit: 'pt', format: 'a4' });
	const W = doc.internal.pageSize.getWidth();
	const H = doc.internal.pageSize.getHeight();
	const M = 56;
	const maxW = W - M * 2;
	let y = M;

	const dateLabel = new Date(`${input.date}T00:00`).toLocaleDateString('es-ES', {
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	});

	const watermark = () => {
		doc.setFont('helvetica', 'bold');
		doc.setFontSize(24);
		doc.setTextColor(232, 224, 210);
		doc.text('BORRADOR · PENDIENTE DE REVISIÓN LEGAL', W / 2, H / 2, { align: 'center', angle: 32 });
	};
	const ensure = (need: number) => {
		if (y + need > H - M) {
			doc.addPage();
			y = M;
			watermark();
		}
	};
	const heading = (text: string) => {
		ensure(30);
		doc.setFont('helvetica', 'bold');
		doc.setFontSize(11);
		doc.setTextColor(3, 3, 4);
		doc.text(text, M, y);
		y += 16;
	};
	const paragraph = (text: string) => {
		doc.setFont('helvetica', 'normal');
		doc.setFontSize(10);
		doc.setTextColor(40, 37, 37);
		for (const line of doc.splitTextToSize(text, maxW)) {
			ensure(14);
			doc.text(line, M, y);
			y += 14;
		}
		y += 6;
	};

	watermark();

	// Título
	doc.setFont('helvetica', 'bold');
	doc.setFontSize(16);
	doc.setTextColor(3, 3, 4);
	doc.text(
		input.kind === 'arras' ? 'CONTRATO DE ARRAS PENITENCIALES' : 'CONTRATO DE ARRENDAMIENTO DE VIVIENDA',
		M,
		y
	);
	y += 10;
	doc.setDrawColor(192, 148, 88);
	doc.setLineWidth(1.5);
	doc.line(M, y, M + 90, y);
	y += 22;
	doc.setFont('helvetica', 'normal');
	doc.setFontSize(10);
	doc.setTextColor(90, 86, 80);
	doc.text(`NEXUS INMO · Documento generado el ${dateLabel}`, M, y);
	y += 24;

	paragraph(`En ${input.city}, a ${dateLabel}.`);

	heading('REUNIDOS');
	paragraph(
		`De una parte, ${input.ownerName}, en calidad de ${input.kind === 'arras' ? 'parte vendedora' : 'parte arrendadora'} (en adelante, la "Propiedad").`
	);
	paragraph(
		`De otra parte, ${input.clientName}, con documento de identidad ${input.clientId || '—'}, en calidad de ${input.kind === 'arras' ? 'parte compradora' : 'parte arrendataria'} (en adelante, el "Cliente").`
	);

	heading('EXPONEN');
	paragraph(
		`Que la Propiedad es titular del inmueble "${input.propertyTitle}" (Ref. ${input.propertyRef}), sito en ${input.propertyAddress}, y que ambas partes acuerdan formalizar el presente contrato conforme a las siguientes cláusulas.`
	);

	heading('CLÁUSULAS');
	if (input.kind === 'arras') {
		paragraph('PRIMERA. Objeto. La parte vendedora venderá y la compradora comprará el inmueble descrito, libre de cargas y al corriente de pagos.');
		paragraph(`SEGUNDA. Precio. El precio total de la compraventa se fija en ${eur(input.price)}.`);
		paragraph(`TERCERA. Arras. En este acto la parte compradora entrega ${eur(input.deposit)} en concepto de arras penitenciales (art. 1.454 del Código Civil), a descontar del precio final.`);
		paragraph('CUARTA. Desistimiento. Si desiste la compradora, perderá las arras entregadas; si desiste la vendedora, las devolverá duplicadas.');
		paragraph('QUINTA. Elevación a público. Las partes firmarán la escritura pública en un plazo máximo de 60 días naturales.');
		paragraph('SEXTA. Gastos. Los gastos e impuestos se distribuirán conforme a la ley aplicable.');
	} else {
		paragraph('PRIMERA. Objeto. La parte arrendadora cede en arrendamiento el inmueble descrito, destinado a vivienda habitual del arrendatario.');
		paragraph(`SEGUNDA. Renta. La renta mensual se fija en ${eur(input.price)}, pagadera en los siete primeros días de cada mes.`);
		paragraph(`TERCERA. Fianza. El arrendatario entrega ${eur(input.deposit)} en concepto de fianza legal (una mensualidad), conforme a la Ley de Arrendamientos Urbanos.`);
		paragraph('CUARTA. Duración. El contrato tendrá una duración inicial de un año, prorrogable hasta cinco años a voluntad del arrendatario (art. 9 LAU).');
		paragraph('QUINTA. Actualización. La renta se actualizará anualmente conforme al índice legal de referencia.');
		paragraph('SEXTA. Conservación. El arrendatario mantendrá la vivienda en buen estado y la devolverá a la finalización del contrato.');
	}

	heading('FIRMAS');
	ensure(80);
	y += 26;
	doc.setDrawColor(150, 150, 150);
	doc.setLineWidth(0.5);
	doc.line(M, y, M + 180, y);
	doc.line(W - M - 180, y, W - M, y);
	y += 14;
	doc.setFont('helvetica', 'normal');
	doc.setFontSize(9);
	doc.setTextColor(90, 86, 80);
	doc.text('La Propiedad', M, y);
	doc.text('El Cliente', W - M - 180, y);
	y += 26;

	doc.setFontSize(8);
	doc.setTextColor(150, 146, 140);
	for (const line of doc.splitTextToSize(
		'Documento BORRADOR generado automáticamente por NEXUS INMO. No constituye asesoramiento legal y debe ser revisado por un profesional antes de su firma.',
		maxW
	)) {
		ensure(11);
		doc.text(line, M, y);
		y += 11;
	}

	doc.save(`contrato-${input.kind}-${input.propertyRef || 'nexus'}.pdf`);
}
