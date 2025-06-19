// src/components/GeneralData.jsx
import React from 'react';

// Recibimos 'data' y 'setData' como props desde el padre (MainApp)
function GeneralData({ data, setData }) {

    // Creamos un manejador de cambios genérico
    const handleChange = (e) => {
        const { id, value } = e.target;
        setData(prevData => ({
            ...prevData,
            [id]: value
        }));
    };

    return (
        <>
            <h2>📊 Datos Generales</h2>
            <div className="input-group">
                <label htmlFor="nombreMariella">👩‍🍳 Nombre del Facturador:</label>
                <input type="text" id="nombreMariella" value={data.nombreMariella} onChange={handleChange} required />
            </div>
            <div className="input-group">
                <label htmlFor="facturadorDireccion">📍 Campamento del Facturador:</label>
                <select id="facturadorDireccion" value={data.campamento} onChange={handleChange} required >
                    <option value="">Selecciona un campamento</option>
                    <option value="AUSTRIA">AUSTRIA</option>
                    <option value="BARQUEREÑA">BARQUEREÑA</option>
                    <option value="TERQUEDAD">TERQUEDAD</option>
                    <option value="ATABAPO">ATABAPO</option>
                </select>
            </div>
            {/* Repetimos el patrón para todos los demás campos */}
            <div className="input-group">
                <label htmlFor="facturadorContacto">📞 Contacto:</label>
                <input type="text" id="facturadorContacto" value={data.contacto} onChange={handleChange} placeholder="Email/Teléfono"/>
            </div>
            <div className="input-group">
                <label htmlFor="invoiceNumber">#️⃣ Número de Factura:</label>
                <input type="text" id="invoiceNumber" value={data.facturaNum} onChange={handleChange} placeholder="Opcional"/>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="input-group">
                    <label htmlFor="mesServicio">📅 Mes del Servicio:</label>
                    <input type="month" id="mesServicio" name="mesServicio" value={data.mes} onChange={handleChange}/>
                </div>
                <div className="input-group">
                    <label htmlFor="moneda">💵 Moneda:</label>
                    <select id="moneda" value={data.moneda} onChange={handleChange}>
                        <option value="COP">Peso Colombiano (COP)</option>
                        <option value="USD">Dólar Americano (USD)</option>
                        <option value="EUR">Euro (EUR)</option>
                        <option value="MXN">Peso Mexicano (MXN)</option>
                    </select>
                </div>
            </div>
            <div className="input-group">
                <label htmlFor="valorComida">💰 Valor por Comida:</label>
                <input type="number" id="valorComida" value={data.valorComida} onChange={handleChange} min="0" step="100" required/>
            </div>
            <hr style={{ margin: '20px 0' }} />
        </>
    );
}

export default GeneralData;