// src/components/ActionButtons.jsx
import React from 'react';
import { generatePDF } from '../utils/pdfGenerator'; // Importamos la función

function ActionButtons({ onCalculate, results }) {

    // Esta función llama a la lógica que importamos.
    const handleDownloadPDF = () => {
        generatePDF(results);
    };

    return (
        <>
            <button id="procesarBtn" className="main-button" onClick={onCalculate}>
                🚀 Calcular Liquidación
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                <button className="reset-btn">🔄 Reiniciar App</button>

                {/* El botón llama a handleDownloadPDF y se activa/desactiva según si 'results' existe */}
                <button className="download-btn" onClick={handleDownloadPDF} disabled={!results}>
                    📄 Descargar PDF
                </button>
                <button className="csv-btn" disabled={!results}>📈 Exportar CSV</button>
            </div>
        </>
    );
}

export default ActionButtons;