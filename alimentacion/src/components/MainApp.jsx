// src/components/MainApp.jsx
import React, { useState, useEffect } from 'react';

import { calculateSettlement } from '../utils/calculations';
import { listenToHistory, deleteSettlement } from '../firebase/firestoreService';
import { useUser } from '../contexts/UserContext';

import GeneralData from './GeneralData';
import Clients from './Clients';
import Deductions from './Deductions';
import PdfCustomization from './PdfCustomization';
import ActionButtons from './ActionButtons';
import HistorySection from './HistorySection';
import AdminPanel from './AdminPanel';

const initialGeneralData = {
    nombreMariella: 'Doña Mariella',
    facturadorDireccion: '',
    facturadorContacto: '',
    invoiceNumber: '',
    mesServicio: new Date().toISOString().slice(0, 7),
    moneda: 'COP',
    valorComida: 9000,
};
const initialClients = [{ id: 1, name: '', meals: 0 }];
const initialDeductions = [
    { id: 1, name: 'Retención en la Fuente', type: 'percent', value: 3.5, category: 'Impuesto' },
    { id: 2, name: 'Aporte Seguro Social', type: 'fixed', value: 185500, category: 'Personal' }
];
const initialCustomizationData = {
    logo: null,
    signature: null,
    headerText: '',
    footerText: '',
};

function MainApp({ setResults, setIsModalOpen, onOpenPaymentModal }) {
    const { isAdmin } = useUser();

    const [generalData, setGeneralData] = useState(initialGeneralData);
    const [clients, setClients] = useState(initialClients);
    const [deductions, setDeductions] = useState(initialDeductions);
    const [customizationData, setCustomizationData] = useState(initialCustomizationData);
    const [calculationResults, setCalculationResults] = useState(null);

    // --- INICIO DE LA NUEVA SOLUCIÓN ---
    // 1. Creamos un estado que actuará como nuestra 'llave' de reseteo.
    const [resetKey, setResetKey] = useState(0);
    // --- FIN DE LA NUEVA SOLUCIÓN ---

    const [history, setHistory] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Estado para manejar las pestañas (liquidaciones vs admin)
    const [activeTab, setActiveTab] = useState('liquidaciones');

    useEffect(() => {
        const unsubscribe = listenToHistory((newHistory) => {
            setHistory(newHistory);
        });
        return () => unsubscribe();
    }, []);

    const handleCalculate = () => {
        const calculatedData = {
            ...calculateSettlement(generalData, clients, deductions),
            customization: customizationData
        };

        setCalculationResults(calculatedData);
        setResults(calculatedData);
        setIsModalOpen(true);
    };

    // --- INICIO DE LA NUEVA SOLUCIÓN ---
    // 2. La función de nueva liquidación ahora es mucho más simple.
    const handleNewSettlement = () => {
        // Simplemente incrementamos la llave. Esto forzará un re-montaje.
        setResetKey(prevKey => prevKey + 1);
        setCalculationResults(null);
    };
    // --- FIN DE LA NUEVA SOLUCIÓN ---

    const handleDeleteItem = async (id) => {
        try {
            await deleteSettlement(id);
            console.log("Liquidación eliminada con éxito");
        } catch (error) {
            console.error("Error al eliminar la liquidación:", error);
            alert("No se pudo eliminar la liquidación.");
        }
    };

    return (
        <div className="content">
            {/* Sistema de pestañas - solo mostrar si es admin */}
            {isAdmin() && (
                <div className="app-tabs">
                    <button 
                        className={`app-tab ${activeTab === 'liquidaciones' ? 'active' : ''}`}
                        onClick={() => setActiveTab('liquidaciones')}
                    >
                        💼 Liquidaciones
                    </button>
                    <button 
                        className={`app-tab ${activeTab === 'admin' ? 'active' : ''}`}
                        onClick={() => setActiveTab('admin')}
                    >
                        👑 Administración
                    </button>
                    <button 
                        className={`app-tab ${activeTab === 'otros' ? 'active' : ''}`}
                        onClick={() => setActiveTab('otros')}
                    >
                        🔗 Otros Módulos
                    </button>
                </div>
            )}

            {/* Contenido de liquidaciones */}
            {activeTab === 'liquidaciones' && (
                <div className="input-section" key={resetKey}>
                    <GeneralData data={generalData} setData={setGeneralData} />
                    <Deductions deductions={deductions} setDeductions={setDeductions} />
                    <Clients clients={clients} setClients={setClients} />
                    <PdfCustomization customData={customizationData} setCustomData={setCustomizationData} />

                    <ActionButtons
                        onCalculate={handleCalculate}
                        results={calculationResults}
                        onNewSettlement={handleNewSettlement}
                    />

                    <HistorySection
                        history={history}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        onDeleteItem={handleDeleteItem}
                        onOpenPaymentModal={onOpenPaymentModal}
                    />
                </div>
            )}

            {/* Panel de administración - solo para admins */}
            {activeTab === 'admin' && isAdmin() && (
                <AdminPanel />
            )}

            {/* Panel de otros módulos - solo para admins */}
            {activeTab === 'otros' && isAdmin() && (
                <div className="otros-modulos-panel">
                    <div className="modulos-grid">
                        <div className="modulo-card">
                            <div className="modulo-header">
                                <h3>⛽ Combustibles</h3>
                                <span className="modulo-status disponible">Disponible</span>
                            </div>
                            <div className="modulo-content">
                                <p>Gestión completa de inventario, movimientos, vehículos y reportes de combustibles.</p>
                                <div className="modulo-features">
                                    <span className="feature">📊 Movimientos</span>
                                    <span className="feature">🚛 Vehículos</span>
                                    <span className="feature">📈 Reportes</span>
                                    <span className="feature">📦 Inventario</span>
                                </div>
                                <div className="modulo-actions">
                                    <button 
                                        className="btn-modulo primary"
                                        onClick={() => window.open('/combustibles/', '_blank')}
                                    >
                                        🚀 Abrir Combustibles
                                    </button>
                                    <button 
                                        className="btn-modulo secondary"
                                        onClick={() => window.open('/combustibles/movements', '_blank')}
                                    >
                                        ➕ Nuevo Movimiento
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="modulo-card">
                            <div className="modulo-header">
                                <h3>📊 Reportes Generales</h3>
                                <span className="modulo-status desarrollo">En Desarrollo</span>
                            </div>
                            <div className="modulo-content">
                                <p>Dashboard ejecutivo con métricas consolidadas de todas las aplicaciones.</p>
                                <div className="modulo-features">
                                    <span className="feature">📈 KPIs Ejecutivos</span>
                                    <span className="feature">💰 Análisis Financiero</span>
                                    <span className="feature">📋 Reportes Cruzados</span>
                                </div>
                                <div className="modulo-actions">
                                    <button className="btn-modulo disabled" disabled>
                                        🔄 Próximamente
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="info-navegacion">
                        <h4>💡 ¿Buscas gestionar movimientos de combustibles?</h4>
                        <p>Los movimientos de combustibles se gestionan en el módulo específico de <strong>Combustibles</strong>. Esta aplicación está enfocada en liquidaciones de alimentación bovina.</p>
                        <button 
                            className="btn-navegacion-rapida"
                            onClick={() => window.open('/combustibles/movements', '_blank')}
                        >
                            ⛽ Ir a Movimientos de Combustibles
                        </button>
                    </div>
                </div>
            )}

            <style jsx>{`
                .app-tabs {
                    display: flex;
                    border-bottom: 2px solid #e1e5e9;
                    margin-bottom: 30px;
                    background: white;
                    border-radius: 8px 8px 0 0;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                
                .app-tab {
                    padding: 16px 24px;
                    border: none;
                    background: none;
                    cursor: pointer;
                    font-size: 16px;
                    font-weight: 500;
                    color: #666;
                    border-bottom: 3px solid transparent;
                    transition: all 0.2s ease;
                    flex: 1;
                    text-align: center;
                }
                
                .app-tab:hover {
                    color: #007bff;
                    background: #f8f9fa;
                }
                
                .app-tab.active {
                    color: #007bff;
                    border-bottom-color: #007bff;
                    font-weight: 600;
                    background: #f8f9fa;
                }
                
                .app-tab:first-child {
                    border-radius: 8px 0 0 0;
                }
                
                .app-tab:last-child {
                    border-radius: 0 8px 0 0;
                }
                
                @media (max-width: 768px) {
                    .app-tab {
                        font-size: 14px;
                        padding: 12px 16px;
                    }
                }

                /* Estilos para el panel de otros módulos */
                .otros-modulos-panel {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                }

                .modulos-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                    gap: 24px;
                    margin-bottom: 40px;
                }

                .modulo-card {
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    padding: 24px;
                    border: 1px solid #e1e5e9;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }

                .modulo-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
                }

                .modulo-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 16px;
                }

                .modulo-header h3 {
                    margin: 0;
                    font-size: 20px;
                    color: #2c3e50;
                }

                .modulo-status {
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                    text-transform: uppercase;
                }

                .modulo-status.disponible {
                    background: #d4edda;
                    color: #155724;
                }

                .modulo-status.desarrollo {
                    background: #fff3cd;
                    color: #856404;
                }

                .modulo-content p {
                    color: #666;
                    margin-bottom: 16px;
                    line-height: 1.5;
                }

                .modulo-features {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    margin-bottom: 20px;
                }

                .feature {
                    background: #f8f9fa;
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 14px;
                    color: #495057;
                    border: 1px solid #e9ecef;
                }

                .modulo-actions {
                    display: flex;
                    gap: 12px;
                    flex-wrap: wrap;
                }

                .btn-modulo {
                    padding: 10px 16px;
                    border: none;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                }

                .btn-modulo.primary {
                    background: #007bff;
                    color: white;
                }

                .btn-modulo.primary:hover {
                    background: #0056b3;
                    transform: translateY(-1px);
                }

                .btn-modulo.secondary {
                    background: #28a745;
                    color: white;
                }

                .btn-modulo.secondary:hover {
                    background: #1e7e34;
                    transform: translateY(-1px);
                }

                .btn-modulo.disabled {
                    background: #e9ecef;
                    color: #6c757d;
                    cursor: not-allowed;
                }

                .info-navegacion {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 24px;
                    border-radius: 12px;
                    text-align: center;
                }

                .info-navegacion h4 {
                    margin: 0 0 12px 0;
                    font-size: 18px;
                }

                .info-navegacion p {
                    margin: 0 0 20px 0;
                    opacity: 0.9;
                    line-height: 1.5;
                }

                .btn-navegacion-rapida {
                    background: rgba(255,255,255,0.2);
                    color: white;
                    border: 2px solid rgba(255,255,255,0.3);
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .btn-navegacion-rapida:hover {
                    background: rgba(255,255,255,0.3);
                    border-color: rgba(255,255,255,0.5);
                    transform: translateY(-2px);
                }

                @media (max-width: 768px) {
                    .modulos-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .modulo-actions {
                        flex-direction: column;
                    }
                    
                    .btn-modulo {
                        justify-content: center;
                    }
                }
            `}</style>
        </div>
    );
}

export default MainApp;