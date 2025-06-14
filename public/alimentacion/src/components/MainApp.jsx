// src/components/MainApp.jsx
import React, { useState, useEffect } from 'react';

import { calculateSettlement } from '../utils/calculations';
import { listenToHistory, deleteSettlement } from '../firebase/firestoreService';

import GeneralData from './GeneralData';
import Clients from './Clients';
import Deductions from './Deductions';
import ActionButtons from './ActionButtons';
import HistorySection from './HistorySection'; // <-- 1. Importamos el nuevo componente

function MainApp({ setResults, setIsModalOpen }) {

    const [generalData, setGeneralData] = useState({
        nombreMariella: 'Doña Mariella',
        facturadorDireccion: '',
        facturadorContacto: '',
        invoiceNumber: '',
        mesServicio: new Date().toISOString().slice(0, 7),
        moneda: 'COP',
        valorComida: 9000,
    });
    const [clients, setClients] = useState([ { id: 1, name: '', meals: 0 } ]);
    const [deductions, setDeductions] = useState([
        { id: 1, name: 'Retención en la Fuente', type: 'percent', value: 3.5, category: 'Impuesto' },
        { id: 2, name: 'Aporte Seguro Social', type: 'fixed', value: 185500, category: 'Personal' }
    ]);
    const [calculationResults, setCalculationResults] = useState(null);

    // --- 2. NUEVOS ESTADOS PARA EL HISTORIAL ---
    const [history, setHistory] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // --- 3. useEffect PARA ESCUCHAR EL HISTORIAL ---
    useEffect(() => {
        // La función 'listenToHistory' nos devuelve una función para "dejar de escuchar".
        // La guardamos para llamarla cuando el componente se desmonte.
        const unsubscribe = listenToHistory((newHistory) => {
            setHistory(newHistory);
        });

        // Esto es una buena práctica para evitar fugas de memoria.
        return () => unsubscribe();
    }, []); // El array vacío [] asegura que esto solo se ejecute una vez.


    const handleCalculate = async () => { // Lo convertimos en async
        const calculatedData = calculateSettlement(generalData, clients, deductions);
        setCalculationResults(calculatedData);
        setResults(calculatedData);
        setIsModalOpen(true);
    };

    // --- 4. FUNCIÓN PARA ELIMINAR ---
    const handleDeleteItem = async (id) => {
        try {
            await deleteSettlement(id);
            // Podríamos mostrar un toast de éxito aquí
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
                <ActionButtons onCalculate={handleCalculate} results={calculationResults} />

                {/* --- 5. RENDERIZAMOS EL COMPONENTE DEL HISTORIAL --- */}
                <HistorySection
                    history={history}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    onDeleteItem={handleDeleteItem}
                />
            </div>
        </div>
    );
}

export default MainApp;