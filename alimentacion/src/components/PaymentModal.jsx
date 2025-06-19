// src/components/PaymentModal.jsx
import React, { useState } from 'react';

function PaymentModal({ isOpen, onClose, settlementId, onUpdate }) {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    if (!isOpen) {
        return null;
    }

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = () => {
        if (!file) {
            alert("Por favor, selecciona un archivo.");
            return;
        }
        setLoading(true);

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            const receiptBase64 = reader.result;
            await onUpdate(settlementId, receiptBase64);
            setLoading(false);
            onClose();
        };
        reader.onerror = (error) => {
            console.error("Error al leer el archivo:", error);
            alert("Error al procesar el archivo.");
            setLoading(false);
        };
    };

    return (
        <div className="modal" style={{ display: 'flex' }}>
            <div className="modal-content">
                <span className="modal-close-button" onClick={onClose}>&times;</span>
                <h3>Subir Comprobante de Pago</h3>
                <p>Para marcar esta liquidación como "Pagada", adjunta el comprobante (PDF, JPG, PNG).</p>
                <div className="input-group">
                    <input type="file" id="receiptFileInput" accept="application/pdf,image/jpeg,image/png" onChange={handleFileChange} />
                </div>
                <button
                    className="modal-confirm-btn confirm-upload"
                    onClick={handleUpload}
                    disabled={!file || loading}
                >
                    {loading ? "Subiendo..." : "Subir y Marcar como Pagada"}
                </button>
            </div>
        </div>
    );
}

export default PaymentModal;