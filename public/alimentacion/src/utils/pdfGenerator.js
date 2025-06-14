// src/utils/pdfGenerator.js
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import { getCurrencyFormat } from "./calculations";
import { saveSettlement } from '../firebase/firestoreService'; // <-- 1. IMPORTAMOS LA FUNCIÓN

export const generatePDF = async (results) => { // <-- 2. LA CONVERTIMOS EN ASÍNCRONA
    if (!results) {
        alert("No hay datos calculados para generar el PDF.");
        return;
    }

    const { config, clientes, mariella } = results;
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });

    // ... (TODA LA LÓGICA PARA CREAR EL PDF SE QUEDA EXACTAMENTE IGUAL)
    // Header, tablas, etc.
    // ...

    const formato = getCurrencyFormat(config.locale, config.moneda);
    let y = 15;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 15;
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('LIQUIDACIÓN DE SERVICIO DE COMIDAS', pageWidth / 2, y, { align: 'center' });
    y += 15;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Facturador: ${config.nombreMariella}`, margin, y);
    y += 7;
    doc.text(`Mes del Servicio: ${config.mesServicio}`, margin, y);
    y += 15;
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
    y += 10;
    const deductionHead = [['Concepto de Deducción', 'Valor Aplicado', 'Monto Deducido']];
    const deductionBody = mariella.deducciones.map(d => [d.nombre, d.displayValue, `- ${formato.format(d.montoCalculado)}`]);
    autoTable(doc, {
        head: deductionHead,
        body: deductionBody,
        startY: y,
        theme: 'striped',
        didDrawPage: function (data) { y = data.cursor.y; }
    });
    y += 10;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`SALDO FINAL A RECIBIR: ${formato.format(mariella.saldoFinalNeto)}`, margin, y);


    // --- LÓGICA PARA GUARDAR ---
    const pdfBase64 = doc.output('datauristring');

    const settlementToSave = {
        timestamp: new Date().toLocaleString('es-CO'),
        status: 'Pendiente',
        summary: { // Guardamos un resumen para mostrar en la lista
            mesServicio: config.mesServicio,
            nombreMariella: config.nombreMariella,
            saldoFinalNeto: mariella.saldoFinalNeto,
            totalIngresoBruto: mariella.totalIngresoBruto,
            moneda: config.moneda,
            locale: config.locale
        },
        pdfBase64: pdfBase64 // Guardamos el PDF entero
    };

    try {
        // 3. LLAMAMOS A NUESTRO SERVICIO PARA GUARDAR LOS DATOS
        await saveSettlement(settlementToSave);
        console.log("Liquidación guardada en el historial.");
        // Aquí podrías mostrar una notificación "Toast" de éxito.
    } catch (error) {
        console.error("Error al guardar la liquidación:", error);
        alert("Error al guardar la liquidación en el historial.");
    }

    // La descarga se ejecuta después de intentar guardar
    doc.save(`liquidacion-${config.nombreMariella}-${config.mesServicio}.pdf`);
};