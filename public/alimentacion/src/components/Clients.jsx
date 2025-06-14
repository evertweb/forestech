// src/components/Clients.jsx
import React from 'react';

function ClientItem({ client, onRemove, onUpdate }) {
    // ... (El sub-componente ClientItem se queda exactamente igual)
    const { id, name, meals } = client;
    return (
        <div className="client-input-group">
            <div className="client-header">
                <h4>Cliente</h4>
                <button className="remove-btn" onClick={() => onRemove(id)}>Eliminar</button>
            </div>
            <div className="input-group">
                <label htmlFor={`nombre_${id}`}>Nombre del Cliente:</label>
                <input type="text" id={`nombre_${id}`} value={name} onChange={(e) => onUpdate(id, 'name', e.target.value)} placeholder="Ej: Jaider" required />
            </div>
            <div className="input-group">
                <label htmlFor={`comidas_${id}`}>Comidas Facturadas:</label>
                <div className="input-wrapper">
                    <input type="number" id={`comidas_${id}`} value={meals} onChange={(e) => onUpdate(id, 'meals', parseInt(e.target.value) || 0)} min="0" />
                </div>
            </div>
        </div>
    );
}

// Clients ahora recibe los datos y las funciones como props
function Clients({ clients, setClients }) {

    const addClient = () => {
        const newId = clients.length > 0 ? Math.max(...clients.map(c => c.id)) + 1 : 1;
        setClients([...clients, { id: newId, name: '', meals: 0 }]);
    };

    const removeClient = (idToRemove) => {
        if (clients.length <= 1) return;
        setClients(clients.filter(client => client.id !== idToRemove));
    };

    const updateClient = (id, field, value) => {
        setClients(clients.map(client =>
            client.id === id ? { ...client, [field]: value } : client
        ));
    };

    return (
        <>
            <h3>👤 Clientes</h3>
            <div id="clientesContainer">
                {clients.map(client => (
                    <ClientItem key={client.id} client={client} onRemove={removeClient} onUpdate={updateClient}/>
                ))}
            </div>
            <button className="secondary-button" onClick={addClient}>
                ➕ Añadir Cliente
            </button>
            <hr style={{ margin: '20px 0' }} />
        </>
    );
}

export default Clients;