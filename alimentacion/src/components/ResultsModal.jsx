// src/components/ResultsModal.jsx
import React, { useRef } from 'react';
import { getCurrencyFormat } from '../utils/calculations';
import { generatePDF } from '../utils/pdfGenerator';
import ChartComponent from './ChartComponent';

function ResultsModal({ results, onClose }) {
    const doughnutRef = useRef(null);
    const pieRef = useRef(null);
    const barRef = useRef(null);

    if (!results) return null;

    const { config, clientes, mariella } = results;
    const formato = getCurrencyFormat(config.locale, config.moneda);

    const doughnutData = {
        labels: ['Saldo Neto', 'Total Deducciones'],
        datasets: [{
            data: [mariella.saldoFinalNeto, mariella.totalDeducciones],
            backgroundColor: ['#2ecc71', '#e74c3c'],
            borderColor: [document.body.classList.contains('dark-mode') ? '#2d3748' : '#fff'],
            borderWidth: 4,
        }],
    };

    const categoryTotals = mariella.deducciones.reduce((acc, d) => {
        const category = d.category || 'Otros';
        acc[category] = (acc[category] || 0) + d.montoCalculado;
        return acc;
    }, {});
    const pieData = {
        labels: Object.keys(categoryTotals),
        datasets: [{
            data: Object.values(categoryTotals),
            backgroundColor: ['#e74c3c', '#f39c12', '#f1c40f', '#3498db', '#9b59b6', '#1abc9c'],
            borderColor: [document.body.classList.contains('dark-mode') ? '#2d3748' : '#fff'],
            borderWidth: 2,
        }],
    };

    const filteredClients = clientes.filter(c => c.comidas > 0);
    const barData = {
        labels: filteredClients.map(c => c.name),
        datasets: [{
            label: `Ingreso Bruto por Cliente (${config.moneda})`,
            data: filteredClients.map(c => c.ingresoBrutoCliente),
            backgroundColor: 'rgba(52, 152, 219, 0.7)',
        }],
    };

    const doughnutOptions = { responsive: true, maintainAspectRatio: false, plugins: { title: { display: true, text: 'Distribución Ingreso' } } };
    const pieOptions = { responsive: true, maintainAspectRatio: false, plugins: { title: { display: true, text: 'Deducciones por Categoría' } } };
    const barOptions = { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { title: { display: true, text: 'Aporte por Cliente' } } };

    const handleDownloadPDF = () => {
        const chartImages = {
            doughnut: doughnutRef.current?.toBase64Image(),
            pie: pieRef.current?.toBase64Image(),
            bar: barRef.current?.toBase64Image(),
        };
        generatePDF(results, chartImages);
    };

    return (
        <div className="modal" style={{ display: 'flex' }}>
            <div className="modal-content">
                <span className="modal-close-button" onClick={onClose}>&times;</span>
                <h3>📈 Resultados de Liquidación</h3>
                <div className="summary-cards">
                    <div className="summary-card show"><h3>👩‍🍳 {config.nombreMariella} (Neto)</h3><div className="amount">{formato.format(mariella.saldoFinalNeto)}</div></div>
                    <div className="summary-card show"><h3>👥 Total Bruto Clientes</h3><div className="amount">{formato.format(mariella.totalIngresoBruto)}</div></div>
                </div>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px', height: '300px'}}>
                    <div className="chart-container"><ChartComponent ref={doughnutRef} type="doughnut" data={doughnutData} options={doughnutOptions} /></div>
                    <div className="chart-container"><ChartComponent ref={pieRef} type="pie" data={pieData} options={pieOptions} /></div>
                </div>
                <div className="chart-container" style={{height: '250px', marginTop: '20px'}}><ChartComponent ref={barRef} type="bar" data={barData} options={barOptions} /></div>
                <div className="detailed-results-container">
                    <h3 className="section-title">📄 Detalle por Cliente</h3>
                    {clientes.filter(c => c.comidas > 0).map(cliente => (
                        <div key={cliente.id} className="client-breakdown show">
                            <div className="person-header">👤 Cliente: {cliente.name}</div>
                            <div className="deduction-item"><span className="label">Comidas Facturadas:</span><span className="value">{cliente.comidas}</span></div>
                            <div className="deduction-item"><span className="label">Ingreso Bruto Generado:</span><span className="value">{formato.format(cliente.ingresoBrutoCliente)}</span></div>
                        </div>
                    ))}
                </div>
                <div className="mariella-settlement-section">
                    <h3 className="section-title">💸 Liquidación Detallada: {(config.nombreMariella || '').toUpperCase()}</h3>
                    <div className="person-deductions show">
                        <div className="deduction-item"><span className="label">Total Ingreso Bruto:</span><span className="value">{formato.format(mariella.totalIngresoBruto)}</span></div>
                        {mariella.deducciones.map((d, index) => ( <div key={index} className="deduction-item"><span className="label">(-) {d.name} ({d.displayValue}):</span><span className="value">{formato.format(d.montoCalculado)}</span></div> ))}
                        <div className="deduction-item" style={{borderTop: '2px solid var(--border-color)', marginTop: '5px', paddingTop: '5px'}}><span className="label" style={{fontWeight:'bold'}}>(=) SALDO FINAL A RECIBIR:</span><span className="value final-value">{formato.format(mariella.saldoFinalNeto)}</span></div>
                    </div>
                </div>
                <hr style={{margin: '20px 0'}}/>
                <button className="main-button" onClick={handleDownloadPDF}>📄 Descargar Reporte en PDF</button>
            </div>
        </div>
    );
}

export default ResultsModal;