// combustibles/src/components/Admin/AdminModalTrigger.jsx
// Componente que maneja la apertura del modal de administración desde la navegación
import React, { useState } from 'react';
import { useCombustibles } from '../../contexts/CombustiblesContext';
import AdminDashboardLayout from './AdminDashboardLayout';
import './AdminDashboard.css';

const AdminModalTrigger = () => {
  const { user, userProfile } = useCombustibles();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Botón para abrir el modal de admin */}
      <button
        onClick={handleOpenModal}
        className="admin-modal-trigger"
        title="Abrir panel de administración"
      >
        ⚙️ Admin
      </button>

      {/* Modal del Dashboard Admin */}
      <AdminDashboardLayout
        user={user}
        userProfile={userProfile}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default AdminModalTrigger;