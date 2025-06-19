// src/components/PdfCustomization.jsx
import React from 'react';

function PdfCustomization({ customData, setCustomData }) {

    // Función genérica para manejar los cambios en los campos de texto
    const handleTextChange = (e) => {
        const { id, value } = e.target;
        setCustomData(prevData => ({
            ...prevData,
            [id]: value
        }));
    };

    // Función para manejar la subida de archivos (logo y firma)
    const handleFileChange = (e) => {
        const { id, files } = e.target;
        const file = files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setCustomData(prevData => ({
                ...prevData,
                [id]: reader.result // Guardamos el archivo como un string Base64
            }));
        };
        reader.onerror = (error) => {
            console.error("Error al leer el archivo:", error);
            alert("No se pudo cargar el archivo.");
        };
    };

    return (
        <>
            <hr style={{ margin: '20px 0' }} />
            <h3>📄 Personalización de PDF</h3>

            <div className="input-group">
                <label htmlFor="logo">🖼️ Subir Logo (opcional):</label>
                <input type="file" id="logo" accept="image/png, image/jpeg" onChange={handleFileChange} />
            </div>

            <div className="input-group">
                <label htmlFor="signature">✍️ Subir Firma/Sello (opcional):</label>
                <input type="file" id="signature" accept="image/png, image/jpeg" onChange={handleFileChange} />
            </div>

            <div className="input-group">
                <label htmlFor="headerText">⬆️ Texto de Encabezado Personalizado:</label>
                <input
                    type="text"
                    id="headerText"
                    value={customData.headerText}
                    onChange={handleTextChange}
                    placeholder="Ej: Reporte Confidencial"
                />
            </div>

            <div className="input-group">
                <label htmlFor="footerText">⬇️ Texto de Pie de Página Personalizado:</label>
                <input
                    type="text"
                    id="footerText"
                    value={customData.footerText}
                    onChange={handleTextChange}
                    placeholder="Ej: Gracias por su confianza"
                />
            </div>
        </>
    );
}

export default PdfCustomization;