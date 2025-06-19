// src/components/HistorySection.jsx
import React from 'react';

function HistoryItem({ item, onDelete, onOpenPaymentModal }) {
    const { id, summary, timestamp, status, pdfDownloadURL, comprobantePagoBase64 } = item;

    const handleDelete = () => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar la liquidación de ${summary.mesServicio}?`)) {
            onDelete(id);
        }
    };

    const handleViewPdf = () => {
        if (pdfDownloadURL) {
            window.open(pdfDownloadURL, '_blank');
        } else {
            alert("No se encontró el enlace del PDF para esta liquidación.");
        }
    };

    const handleViewReceipt = () => {
        if (comprobantePagoBase64) {
            const newWindow = window.open();
            if (newWindow) {
                newWindow.document.write('<html><head><title>Visor de Comprobante</title></head><body style="margin:0;">');
                newWindow.document.write(`<img src='${comprobantePagoBase64}' style='max-width:100%;'>`);
                newWindow.document.write('</body></html>');
            } else {
                alert("No se pudo abrir la nueva pestaña. Por favor, revisa los permisos de tu navegador.");
            }
        } else {
            alert("No se encontró el comprobante de pago para esta liquidación.");
        }
    };

    return (
        <div className="history-item">
            <div className="history-item-info">
                <div>
                    <strong>{summary.nombreMariella || 'N/A'}</strong> - {summary.mesServicio || 'N/A'}
                    <br />
                    <small>Guardado: {timestamp || 'N/A'}</small>
                </div>
                <span className={`status-label status-${(status || 'pendiente').toLowerCase()}`}>{status || 'Pendiente'}</span>
            </div>
            <div className="history-item-actions">
                <button className="view-pdf-btn" onClick={handleViewPdf}>Ver PDF</button>
                {status === 'Pagada' ? (
                    <button className="view-receipt-btn" onClick={handleViewReceipt}>Ver Comprobante</button>
                ) : (
                    <button className="register-payment-btn" onClick={() => onOpenPaymentModal(id)}>Registrar Pago</button>
                )}
                <button className="history-delete-btn" onClick={handleDelete}>Eliminar</button>
            </div>
        </div>
    );
}

function HistorySection({ history, searchTerm, setSearchTerm, onDeleteItem, onOpenPaymentModal }) {
    const filteredHistory = history.filter(item => {
        if (!item.summary) return false;
        const search = searchTerm.toLowerCase();
        const nameMatch = (item.summary.nombreMariella || '').toLowerCase().includes(search);
        const monthMatch = (item.summary.mesServicio || '').toLowerCase().includes(search);
        const statusMatch = (item.status || '').toLowerCase().includes(search);
        return nameMatch || monthMatch || statusMatch;
    });

    return (
        <>
            <hr style={{ margin: '20px 0' }} />
            <div className="history-section-header">
                <h3>⏳ Historial de Liquidaciones</h3>
                <div className="history-search-filter">
                    <input
                        type="text"
                        id="historySearch"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar por nombre, mes o estado..."
                    />
                </div>
            </div>
            <div id="historyContainer">
                {filteredHistory.length > 0 ? (
                    filteredHistory.map(item => (
                        <HistoryItem
                            key={item.id}
                            item={item}
                            onDelete={onDeleteItem}
                            onOpenPaymentModal={onOpenPaymentModal}
                        />
                    ))
                ) : (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted-color)' }}>
                        No hay liquidaciones guardadas.
                    </p>
                )}
            </div>
        </>
    );
}

export default HistorySection;