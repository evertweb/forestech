/**
 * ================================================================================================================================
 * ARCHIVO: Dashboard.jsx
 * MÓDULO: combustibles
 * DESCRIPCIÓN: Componente principal que sirve como punto de entrada para todas las vistas del dashboard.
 *
 * FUNCIONALIDAD:
 * - Este componente es el "entry point" para las rutas protegidas que se muestran dentro del dashboard.
 * - Utiliza `DashboardLayout` para proporcionar una estructura visual consistente (header, sidebar, etc.) a todas las sub-vistas.
 * - Renderiza las rutas anidadas (sub-vistas) a través del componente `Outlet` de `react-router-dom`.
 * 
 * CÓMO FUNCIONA:
 * 1. Cuando un usuario navega a una ruta anidada bajo "/dashboard" (ej. "/dashboard/home", "/dashboard/reports"),
 *    este componente `Dashboard` se renderiza primero.
 * 2. `Dashboard` envuelve la vista específica de la ruta (que se carga en el `Outlet`) con el `DashboardLayout`.
 * 3. Esto asegura que todas las páginas dentro del dashboard compartan la misma navegación y apariencia.
 * ================================================================================================================================
 */

import React from 'react';
import { Outlet } from 'react-router-dom'; // Importa Outlet para renderizar rutas anidadas.
import DashboardLayout from './DashboardLayout'; // Importa el layout principal del dashboard.
import './Dashboard.css'; // Importa los estilos CSS para el dashboard.

const Dashboard = () => {
  return (
    // El DashboardLayout envuelve a todas las vistas que se renderizarán dentro del Outlet.
    // Esto proporciona la estructura común de Header, Sidebar y Main Content.
    <DashboardLayout>
      {/* 
        Outlet es un marcador de posición de react-router-dom.
        Aquí es donde se renderizará el componente correspondiente a la ruta anidada actual.
        Por ejemplo, si la URL es /dashboard/home, aquí se montará el componente de la página de inicio.
      */}
      <Outlet />
    </DashboardLayout>
  );
};

export default Dashboard;