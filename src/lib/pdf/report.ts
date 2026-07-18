/**
 * Generador del informe de actividad en PDF (jsPDF), reutilizando el mismo
 * motor que los contratos (D6). Recibe datos ya calculados (no toca el store).
 * jsPDF se importa de forma dinámica → fuera del bundle SSR.
 */

export interface ReportData {
	generatedAt: string; // ISO date
	totalRevenue: number;
	totalDeals: number;
	avgDaysToClose: number;
	avgCommission: number;
	monthly: { label: string; value: number }[];
	ranking: { name: string; deals: number; revenue: number }[];
	quarter: {
		current: { label: string; revenue: number; deals: number };
		previous: { label: string; revenue: number };
		deltaPct: number;
	};
}

const eur = (n: number) =>
	new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

export async function generateReportPdf(data: ReportData): Promise<void> {
	const { jsPDF } = await import('jspdf');
	const doc = new jsPDF({ unit: 'pt', format: 'a4' });
	const W = doc.internal.pageSize.getWidth();
	const H = doc.internal.pageSize.getHeight();
	const M = 56;
	const maxW = W - M * 2;
	let y = M;

	const dateLabel = new Date(`${data.generatedAt}T00:00`).toLocaleDateString('es-ES', {
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	});
	const ensure = (need: number) => {
		if (y + need > H - M) {
			doc.addPage();
			y = M;
		}
	};
	const heading = (text: string) => {
		ensure(30);
		doc.setFont('helvetica', 'bold');
		doc.setFontSize(12);
		doc.setTextColor(3, 3, 4);
		doc.text(text, M, y);
		y += 18;
	};

	// Cabecera
	doc.setFont('helvetica', 'bold');
	doc.setFontSize(18);
	doc.setTextColor(3, 3, 4);
	doc.text('Informe de actividad', M, y);
	y += 10;
	doc.setDrawColor(192, 148, 88);
	doc.setLineWidth(1.5);
	doc.line(M, y, M + 90, y);
	y += 20;
	doc.setFont('helvetica', 'normal');
	doc.setFontSize(10);
	doc.setTextColor(90, 86, 80);
	doc.text(`NEXUS INMO · Generado el ${dateLabel}`, M, y);
	y += 24;

	// Resumen
	doc.setFontSize(10);
	doc.setTextColor(40, 37, 37);
	const summary = `En los últimos 12 meses se han cerrado ${data.totalDeals} operaciones, generando ${eur(data.totalRevenue)} en honorarios, con un tiempo medio de ${data.avgDaysToClose} días desde la entrada del lead hasta el cierre y una comisión media de ${eur(data.avgCommission)} por operación.`;
	for (const line of doc.splitTextToSize(summary, maxW)) {
		ensure(14);
		doc.text(line, M, y);
		y += 14;
	}
	y += 12;

	// KPIs (4 cajas)
	const boxW = (maxW - 3 * 10) / 4;
	const kpis = [
		['Ingresos', eur(data.totalRevenue)],
		['Operaciones', `${data.totalDeals}`],
		['Tiempo medio', `${data.avgDaysToClose} días`],
		['Comisión media', eur(data.avgCommission)]
	];
	ensure(60);
	kpis.forEach(([label, value], i) => {
		const bx = M + i * (boxW + 10);
		doc.setDrawColor(225, 222, 216);
		doc.setLineWidth(0.75);
		doc.roundedRect(bx, y, boxW, 50, 4, 4, 'S');
		doc.setFontSize(8);
		doc.setTextColor(120, 116, 110);
		doc.text(label, bx + 8, y + 16);
		doc.setFont('helvetica', 'bold');
		doc.setFontSize(11);
		doc.setTextColor(3, 3, 4);
		doc.text(value, bx + 8, y + 34);
		doc.setFont('helvetica', 'normal');
	});
	y += 74;

	// Gráfica: operaciones por mes
	heading('Operaciones por mes');
	const chartH = 110;
	ensure(chartH + 30);
	const maxVal = Math.max(1, ...data.monthly.map((m) => m.value));
	const gap = 6;
	const barW = (maxW - gap * (data.monthly.length - 1)) / data.monthly.length;
	const baseY = y + chartH;
	doc.setDrawColor(210, 210, 210);
	doc.setLineWidth(0.5);
	doc.line(M, baseY, M + maxW, baseY);
	data.monthly.forEach((m, i) => {
		const bx = M + i * (barW + gap);
		const bh = (m.value / maxVal) * chartH;
		doc.setFillColor(192, 148, 88);
		doc.rect(bx, baseY - bh, barW, bh, 'F');
		doc.setFontSize(6);
		doc.setTextColor(140, 140, 140);
		doc.text(m.label, bx + barW / 2, baseY + 10, { align: 'center' });
		if (m.value > 0) doc.text(`${m.value}`, bx + barW / 2, baseY - bh - 3, { align: 'center' });
	});
	y = baseY + 28;

	// Ranking de agentes
	heading('Ranking de agentes');
	doc.setFontSize(9);
	data.ranking.forEach((r, i) => {
		ensure(16);
		doc.setTextColor(40, 37, 37);
		doc.text(`${i + 1}. ${r.name}`, M, y);
		doc.setTextColor(120, 116, 110);
		doc.text(`${r.deals} ops.`, M + 260, y);
		doc.setTextColor(166, 126, 70);
		doc.text(eur(r.revenue), M + maxW, y, { align: 'right' });
		y += 16;
	});
	y += 10;

	// Comparativa trimestral
	heading('Comparativa trimestral');
	doc.setFont('helvetica', 'normal');
	doc.setFontSize(10);
	doc.setTextColor(40, 37, 37);
	const q = data.quarter;
	const signo = q.deltaPct >= 0 ? '+' : '';
	for (const line of doc.splitTextToSize(
		`${q.current.label}: ${eur(q.current.revenue)} (${q.current.deals} operaciones). ${q.previous.label}: ${eur(q.previous.revenue)}. Variación: ${signo}${q.deltaPct}%.`,
		maxW
	)) {
		ensure(14);
		doc.text(line, M, y);
		y += 14;
	}
	y += 16;

	doc.setFontSize(8);
	doc.setTextColor(150, 146, 140);
	ensure(12);
	doc.text('Informe generado automáticamente por NEXUS INMO · datos de demostración.', M, y);

	doc.save(`informe-nexus-inmo-${data.generatedAt}.pdf`);
}
