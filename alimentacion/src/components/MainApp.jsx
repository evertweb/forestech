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
            `}</style>
        </div>
    );
}

export default MainApp;