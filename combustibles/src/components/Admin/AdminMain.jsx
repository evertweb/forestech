// combustibles/src/components/Admin/AdminMain.jsx
// Componente principal del módulo de administración - REDISEÑADO V2
import React from 'react';
import { useCombustibles } from '../../contexts/CombustiblesContext';
import AdminDashboardLayout from './AdminDashboardLayout';
import './AdminDashboard.css';

const AdminMain = () => {
  const { user, userProfile } = useCombustibles();

  return (
    <AdminDashboardLayout 
      user={user} 
      userProfile={userProfile} 
    />
  );
};

export default AdminMain;
