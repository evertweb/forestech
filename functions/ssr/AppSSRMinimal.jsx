import React from 'react';
import { StaticRouter } from 'react-router-dom/server';

// Componente SSR minimalista para login
const LoginSSR = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Combustibles
          </h1>
          <p className="text-gray-600">
            Sistema de Gestión de Inventario
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <p className="text-sm text-blue-800 mb-2">
              Cargando sistema de autenticación...
            </p>
            <div className="w-full bg-blue-200 rounded-full h-2 mb-2">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{width: '75%'}}></div>
            </div>
            <p className="text-xs text-blue-600">
              SSR activo - Optimizado para rendimiento
            </p>
          </div>
          
          <div className="text-center text-sm text-gray-500">
            <p>La aplicación se hidratará automáticamente</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Wrapper simple para SSR
const AppSSRMinimal = ({ location }) => {
  return (
    <StaticRouter location={location}>
      <LoginSSR />
    </StaticRouter>
  );
};

export default AppSSRMinimal;
