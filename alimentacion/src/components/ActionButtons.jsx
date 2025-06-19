// src/components/ActionButtons.jsx
import React from 'react';

// Recibimos los props necesarios desde MainApp
function ActionButtons({ onCalculate, results, onNewSettlement }) {


    const handleResetApp = () => {
        // Añadimos una confirmación antes de la acción
        if(window.confirm("¿Estás seguro de que quieres reiniciar TODA la aplicación? Se borrará el historial y las configuraciones guardadas.")) {
            // La lógica para el reseteo completo la implementaremos si lo decides más adelante
            console.log("Reiniciando app...");
            // Por ejemplo: localStorage.clear(); window.location.reload();
        }
    };

    return (
        <>
            {/* Lógica condicional: Si NO hay resultados, muestra el botón de Calcular */}
            {!results && (
                <button id="procesarBtn" className="main-button" onClick={onCalculate}>
                    🚀 Calcular Liquidación
                </button>
            )}

            {/* Si SÍ hay resultados, muestra el botón de Nueva Liquidación y el de Exportar */}
            {results && (
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>

                    <button className="start-new-btn" onClick={onNewSettlement}>
                        ✨ Nueva Liquidación
                    </button>



                </div>
            )}

            {/* El botón de Reiniciar App siempre está visible al final */}
            <div style={{marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '20px'}}>
                <button className="reset-btn" onClick={handleResetApp}>🔄 Reiniciar Toda la App</button>
            </div>
        </>
    );
}

export default ActionButtons;