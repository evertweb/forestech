import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import './Dashboard.css';

const Dashboard = () => {
  // Error intencional: variable no utilizada
  const unusedVariable = "esto causará un error de lint";
  
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default Dashboard;
