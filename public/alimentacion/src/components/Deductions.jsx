// src/components/Deductions.jsx
import React from 'react';

function DeductionItem({ deduction, onRemove, onUpdate }) {
    // ... (El sub-componente DeductionItem se queda exactamente igual)
    const { id, name, type, value, category } = deduction;
    return (
        <div className="deduction-input-group">
            <div className="deduction-header">
                <h4>Deducción</h4>
                <button className="remove-btn" onClick={() => onRemove(id)}>Eliminar</button>
            </div>
            <div className="deduction-input-row">
                <input type="text" className="deduction-name" value={name} onChange={(e) => onUpdate(id, 'name', e.target.value)} placeholder="Concepto" required/>
                <select className="deduction-type" value={type} onChange={(e) => onUpdate(id, 'type', e.target.value)}>
                    <option value="fixed">Fijo ($)</option>
                    <option value="percent">Porcentaje (%)</option>
                </select>
                <input type="number" className="deduction-value" value={value} onChange={(e) => onUpdate(id, 'value', parseFloat(e.target.value) || 0)} min="0" step="0.1" required/>
                <select className="deduction-category" value={category} onChange={(e) => onUpdate(id, 'category', e.target.value)}>
                    <option value="">Seleccionar...</option>
                    <option value="Impuesto">Impuesto</option>
                    <option value="Servicio">Servicio</option>
                    <option value="Personal">Personal</option>
                    <option value="Transporte">Transporte</option>
                    <option value="Otros">Otros</option>
                </select>
            </div>
        </div>
    );
}

// Deductions ahora recibe los datos y las funciones como props
function Deductions({ deductions, setDeductions }) {

    const addDeduction = () => {
        const newId = deductions.length > 0 ? Math.max(...deductions.map(d => d.id)) + 1 : 1;
        setDeductions([...deductions, { id: newId, name: '', type: 'fixed', value: 0, category: '' }]);
    };

    const removeDeduction = (idToRemove) => {
        setDeductions(deductions.filter(d => d.id !== idToRemove));
    };

    const updateDeduction = (id, field, value) => {
        setDeductions(deductions.map(d =>
            d.id === id ? { ...d, [field]: value } : d
        ));
    };

    return (
        <>
            <h3>💸 Deducciones del Facturador</h3>
            <div id="deduccionesContainer">
                {deductions.map(deduction => (
                    <DeductionItem key={deduction.id} deduction={deduction} onRemove={removeDeduction} onUpdate={updateDeduction} />
                ))}
            </div>
            <button className="secondary-button" onClick={addDeduction}>
                ➕ Añadir Deducción
            </button>
            <hr style={{ margin: '20px 0' }} />
        </>
    );
}

export default Deductions;