// src/components/HistorySection.jsx
import React from 'react';

function HistoryItem({ item, onDelete }) {
    const { id, summary, timestamp, status } = item;

    const handleDelete = () => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar la liquidación de ${summary.mesServicio}?`)) {
            onDelete(id);
        }
    }

    return (
        <div className="history-item">
            <div className="history-item-info">
                <div>
                    <strong>{summary.nombreMariella || 'N/A'}</strong> - {summary.mesServicio || 'N/A'}
                    <br />
                    <small>Guardado: {timestamp || 'N/A'}</small>
                </div>
                <span className={`status-label status-${status.toLowerCase()}`}>{status}</span>
            </div>
            <div className="history-item-actions">
                <button className="view-pdf-btn">Ver PDF</button>
                <button className="register-payment-btn">Registrar Pago</button>
                <button className="history-delete-btn" onClick={handleDelete}>Eliminar</button>
            </div>
        </div>
    );
}

function HistorySection({ history, searchTerm, setSearchTerm, onDeleteItem }) {
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
                        <HistoryItem key={item.id} item={item} onDelete={onDeleteItem} />
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