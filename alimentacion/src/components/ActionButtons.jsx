// src/components/ActionButtons.jsx
import React from 'react';
import { generateCSV } from '../utils/csvGenerator';

// 1. Recibimos el nuevo prop 'onNewSettlement'
function ActionButtons({ onCalculate, results, onNewSettlement }) {

    const handleExportCSV = () => {
        if (!results) return;
        generateCSV(results);
    };

    // El botón de Reiniciar App aún no lo hemos conectado, pero lo dejamos.
    const handleResetApp = () => {
        if(window.confirm("¿Estás seguro de que quieres reiniciar TODA la aplicación? Se borrará el historial y las configuraciones.")) {
            // Aquí iría la lógica de borrado completo
            console.log("Reiniciando app...");
        }
    };

    return (
        <>
            {/* --- INICIO DE LA MODIFICACIÓN --- */}

            {/* 2. Lógica condicional: Si NO hay resultados, muestra el botón de Calcular */}
            {!results && (
                <button id="procesarBtn" className="main-button" onClick={onCalculate}>
                    🚀 Calcular Liquidación
                </button>
            )}

            {/* Si SÍ hay resultados, muestra los otros botones */}
            {results && (
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>

                    <button className="start-new-btn" onClick={onNewSettlement}>
                        ✨ Nueva Liquidación
                    </button>

                    <button className="csv-btn" onClick={handleExportCSV}>
                        📈 Exportar CSV
                    </button>

                </div>
            )}

            {/* El botón de Reiniciar App siempre es visible, pero lo ponemos al final */}
            <div style={{marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '20px'}}>
                <button className="reset-btn" onClick={handleResetApp}>🔄 Reiniciar Toda la App</button>
            </div>

            {/* --- FIN DE LA MODIFICACIÓN --- */}
        </>
    );
}

export default ActionButtons;