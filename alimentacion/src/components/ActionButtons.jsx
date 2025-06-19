// src/components/ActionButtons.jsx
import React from 'react';

function ActionButtons({ onCalculate, results }) {

    return (
        <>
            <button id="procesarBtn" className="main-button" onClick={onCalculate}>
                🚀 Calcular Liquidación
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                <button className="reset-btn">🔄 Reiniciar App</button>

                <button className="csv-btn" disabled={!results}>📈 Exportar CSV</button>
            </div>
        </>
    );
}

export default ActionButtons;