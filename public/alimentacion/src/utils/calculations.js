// src/utils/calculations.js

// Función de ayuda para formatear la moneda.
export const getCurrencyFormat = (locale = 'es-CO', currency = 'COP') => {
    try {
        return new Intl.NumberFormat(locale, { style: 'currency', currency: currency });
    } catch (e) {
        // Fallback a USD si la configuración es inválida
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
    }
};

// La función principal que realiza todos los cálculos.
export const calculateSettlement = (generalData, clients, deductions) => {
    const { valorComida, moneda } = generalData;
    const locale = 'es-CO'; // Podríamos hacerlo más dinámico en el futuro

    const valorComidaNum = parseFloat(valorComida) || 0;

    // Calcula los datos por cliente
    const calculatedClients = clients.map(cliente => {
        const comidasNum = parseInt(cliente.meals, 10) || 0;
        const ingresoBrutoCliente = comidasNum * valorComidaNum;
        return { ...cliente, comidas: comidasNum, ingresoBrutoCliente };
    });

    const totalComidasGeneral = calculatedClients.reduce((sum, c) => sum + c.comidas, 0);
    const totalIngresoBrutoMariella = totalComidasGeneral * valorComidaNum;

    // Calcula las deducciones
    const calculatedDeductions = deductions.map(d => {
        const valorDeduccion = parseFloat(d.value) || 0;
        const montoCalculado = d.type === 'fixed'
            ? valorDeduccion
            : totalIngresoBrutoMariella * (valorDeduccion / 100);
        const displayValue = d.type === 'percent' ? `${valorDeduccion}%` : getCurrencyFormat(locale, moneda).format(valorDeduccion);
        return { ...d, montoCalculado, displayValue };
    });

    const totalDeducciones = calculatedDeductions.reduce((sum, d) => sum + d.montoCalculado, 0);
    const saldoFinalMariella = totalIngresoBrutoMariella - totalDeducciones;

    // Devuelve el objeto completo de resultados, igual que en tu app original
    return {
        config: { ...generalData, locale, moneda },
        clientes: calculatedClients,
        mariella: {
            totalComidasGestionadas: totalComidasGeneral,
            totalIngresoBruto: totalIngresoBrutoMariella,
            deducciones: calculatedDeductions,
            totalDeducciones,
            saldoFinalNeto: saldoFinalMariella
        }
    };
};