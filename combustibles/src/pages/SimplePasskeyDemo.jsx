/**
 * SimplePasskeyDemo - Página de demostración de la versión simplificada de passkeys
 */

import React from 'react';
import SimplePasskeyAuth from '../components/SimplePasskeyAuth';

const SimplePasskeyDemo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🔐 Demo de Passkeys Sencillas
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Versión simplificada usando solo WebAuthn nativo
          </p>
          <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              🎯 ¿Qué hace esta demo?
            </h2>
            <div className="text-left space-y-3">
              <div className="flex items-start">
                <span className="text-green-500 mr-2">✅</span>
                <span>Usa solo WebAuthn nativo (sin Firebase extensions)</span>
              </div>
              <div className="flex items-start">
                <span className="text-green-500 mr-2">✅</span>
                <span>Guarda credenciales en localStorage (simple)</span>
              </div>
              <div className="flex items-start">
                <span className="text-green-500 mr-2">✅</span>
                <span>Funciona con Touch ID, Face ID, Windows Hello</span>
              </div>
              <div className="flex items-start">
                <span className="text-green-500 mr-2">✅</span>
                <span>Código mucho más simple (~200 líneas vs 1200+)</span>
              </div>
              <div className="flex items-start">
                <span className="text-blue-500 mr-2">🔄</span>
                <span>Próximo paso: integrar con Firebase Auth</span>
              </div>
            </div>
          </div>
        </div>

        <SimplePasskeyAuth />
      </div>
    </div>
  );
};

export default SimplePasskeyDemo;