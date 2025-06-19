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

// --- INICIO DE LA MODIFICACIÓN ---

// 1. Definimos los estados iniciales fuera del componente.
// Esto nos permite reutilizarlos fácilmente en la función de reseteo.
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

    // Usamos las constantes para inicializar los estados.
    const [generalData, setGeneralData] = useState(initialGeneralData);
    const [clients, setClients] = useState(initialClients);
    const [deductions, setDeductions] = useState(initialDeductions);
    const [customizationData, setCustomizationData] = useState(initialCustomizationData);

    const [calculationResults, setCalculationResults] = useState(null);
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

    // 2. Nueva función para limpiar los formularios e iniciar de nuevo.
    const handleNewSettlement = () => {
        setGeneralData(initialGeneralData);
        setClients(initialClients);
        setDeductions(initialDeductions);
        setCustomizationData(initialCustomizationData);
        setCalculationResults(null); // <-- Esto es clave para que vuelva a aparecer el botón "Calcular"
        // Limpiamos los inputs de archivos manualmente
        const logoInput = document.getElementById('logo');
        if (logoInput) logoInput.value = '';
        const signatureInput = document.getElementById('signature');
        if (signatureInput) signatureInput.value = '';
    };

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
            <div className="input-section">
                <GeneralData data={generalData} setData={setGeneralData} />
                <Deductions deductions={deductions} setDeductions={setDeductions} />
                <Clients clients={clients} setClients={setClients} />
                <PdfCustomization customData={customizationData} setCustomData={setCustomizationData} />

                {/* 3. Pasamos la nueva función y los resultados a ActionButtons */}
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