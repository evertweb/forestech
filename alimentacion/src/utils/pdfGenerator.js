// src/utils/pdfGenerator.js
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import { getCurrencyFormat } from "./calculations";
import { saveSettlement } from '../firebase/firestoreService';
import { storage, auth } from '../firebase/config';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { notifyPDFGenerated } from '../firebase/notificationService';

export const generatePDF = async (results, chartImages = {}) => {
    if (!results) {
        alert("No hay datos calculados para generar el PDF.");
        return;
    }

    const { config, clientes, mariella, customization } = results;
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    const formato = getCurrencyFormat(config.locale, config.moneda);

    let y = 15;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 15;

    if (customization.logo) {
        try {
            doc.addImage(customization.logo, 'PNG', margin, y - 5, 25, 25);
        } catch(e) { console.error("Error al añadir el logo:", e); }
    }
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    const headerText = customization.headerText || 'LIQUIDACIÓN DE SERVICIO DE COMIDAS';
    doc.text(headerText, pageWidth / 2, y + 5, { align: 'center' });
    y += 20;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Facturador: ${config.nombreMariella}`, margin, y); y += 7;
    doc.text(`Mes del Servicio: ${config.mesServicio}`, margin, y); y += 15;

    const clientHead = [['#', 'Nombre del Cliente', 'Comidas', 'Valor a Pagar']];
    const clientBody = clientes.map((c, i) => [i + 1, c.name, c.comidas, formato.format(c.ingresoBrutoCliente)]);
    autoTable(doc, {
        head: clientHead,
        body: clientBody,
        startY: y,
        theme: 'grid',
        headStyles: { fillColor: [102, 126, 234] },
        didDrawPage: function (data) { y = data.cursor.y; }
    });

    const deductionHead = [['Concepto', 'Valor Aplicado', 'Monto Deducido']];
    // Usamos 'd.name' (en inglés) para que coincida con el estado.
    const deductionBody = mariella.deducciones.map(d => [d.name, d.displayValue, `- ${formato.format(d.montoCalculado)}`]);
    autoTable(doc, {
        head: deductionHead,
        body: deductionBody,
        startY: y + 10,
        theme: 'striped',
        didDrawPage: function (data) { y = data.cursor.y; }
    });

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`SALDO FINAL A RECIBIR: ${formato.format(mariella.saldoFinalNeto)}`, margin, y + 10);

    if (chartImages.doughnut || chartImages.pie || chartImages.bar) {
        doc.addPage();
        let chartY = 15;
        doc.setFontSize(16);
        doc.text('Resumen Gráfico', pageWidth / 2, chartY, { align: 'center' });
        chartY += 10;

        if (chartImages.doughnut) {
            try { doc.addImage(chartImages.doughnut, 'PNG', margin, chartY, 80, 80); }
            catch(e) { console.error("Error añadiendo gráfico doughnut:", e); }
        }
        if (chartImages.pie) {
            try { doc.addImage(chartImages.pie, 'PNG', pageWidth - 80 - margin, chartY, 80, 80); }
            catch(e) { console.error("Error añadiendo gráfico pie:", e); }
        }
        chartY += 90;
        if (chartImages.bar) {
            try { doc.addImage(chartImages.bar, 'PNG', margin, chartY, pageWidth - (margin * 2), 80); }
            catch(e) { console.error("Error añadiendo gráfico bar:", e); }
        }
    }

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        if(customization.footerText) {
            doc.setFontSize(8);
            doc.text(customization.footerText, pageWidth / 2, doc.internal.pageSize.height - 10, { align: 'center' });
        }
    }

    doc.setPage(pageCount);
    if (customization.signature) {
        try { doc.addImage(customization.signature, 'PNG', 150, 250, 50, 25); }
        catch(e) { console.error("Error añadiendo firma:", e); }
    }

    try {
        const pdfBlob = doc.output('blob');
        const settlementId = Date.now();
        const userId = auth.currentUser.uid;
        const storageRef = ref(storage, `settlements/${userId}/${settlementId}-${config.mesServicio}.pdf`);
        const snapshot = await uploadBytes(storageRef, pdfBlob);
        const downloadURL = await getDownloadURL(snapshot.ref);

        const settlementToSave = {
            timestamp: new Date().toLocaleString('es-CO'),
            status: 'Pendiente',
            summary: {
                mesServicio: config.mesServicio,
                nombreMariella: config.nombreMariella,
                saldoFinalNeto: mariella.saldoFinalNeto,
                totalIngresoBruto: mariella.totalIngresoBruto,
                moneda: config.moneda,
                locale: config.locale,
            },
            pdfDownloadURL: downloadURL,
            storagePath: snapshot.metadata.fullPath,
            comprobantePago: null,
        };

        await saveSettlement(settlementToSave);
        console.log("Liquidación guardada y PDF subido a Storage.");
    } catch (error) {
        console.error("Error en el proceso de guardado y subida:", error);
        alert("Hubo un error al guardar el reporte.");
    }

    doc.save(`liquidacion-${config.nombreMariella}-${config.mesServicio}.pdf`);
    
    // Enviar notificación automática después de generar y descargar el PDF
    notifyPDFGenerated({
        totalPayment: mariella.saldoFinalNeto,
        mesServicio: config.mesServicio,
        nombreMariella: config.nombreMariella
    });
};