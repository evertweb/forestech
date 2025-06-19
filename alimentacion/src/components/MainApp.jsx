// src/components/MainApp.jsx
import React, { useState, useEffect } from 'react';

import { calculateSettlement } from '../utils/calculations';
import { listenToHistory, deleteSettlement } from '../firebase/firestoreService';

import GeneralData from './GeneralData';
import Clients from './Clients';
import Deductions from './Deductions';
import PdfCustomization from './PdfCustomization';
import ActionButtons from './ActionButtons';
import HistorySection from './HistorySection';

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
            {/* --- INICIO DE LA NUEVA SOLUCIÓN --- */}
            {/* 3. Le pasamos la 'resetKey' como el prop 'key' al div que envuelve los formularios.
          Cuando 'resetKey' cambie, todo lo que está dentro de este div se destruirá y se volverá a crear desde cero.
      */}
            <div className="input-section" key={resetKey}>
                {/* --- FIN DE LA NUEVA SOLUCIÓN --- */}

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
        </div>
    );
}

export default MainApp;