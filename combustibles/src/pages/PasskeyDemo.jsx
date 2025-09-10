/**
 * PasskeyDemo.jsx - Página de demostración y pruebas de passkeys
 * Para probar la funcionalidad completa de Firebase Web Authn
 */

import React from 'react';
import PasskeyAuth from '../components/PasskeyAuth';

const PasskeyDemo = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🔐 Demo de Passkeys - Forestech Combustibles
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Prueba la autenticación con passkeys usando Touch ID, Face ID o Windows Hello
          </p>
          <p className="text-sm text-gray-500">
            Esta página te permite probar todas las funcionalidades de passkeys antes de integrarlas en la app principal
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Componente de autenticación */}
          <div>
            <PasskeyAuth />
          </div>

          {/* Información y guía */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                ℹ️ ¿Qué son las Passkeys?
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>
                  Las passkeys son una forma moderna y segura de autenticación que reemplaza las contraseñas tradicionales.
                </p>
                <p>
                  <strong>Ventajas:</strong>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Más seguras que las contraseñas</li>
                  <li>No se pueden robar en ataques de phishing</li>
                  <li>Más rápidas y convenientes</li>
                  <li>Funcionan sin conexión a internet</li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                🛠️ Compatibilidad
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div>
                  <h4 className="font-semibold text-gray-800">iOS/macOS:</h4>
                  <p>Touch ID, Face ID (iOS 16+, macOS Ventura+)</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Android:</h4>
                  <p>Huella digital, reconocimiento facial (Android 9+)</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Windows:</h4>
                  <p>Windows Hello, PIN, huella digital</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Navegadores:</h4>
                  <p>Chrome 67+, Firefox 60+, Safari 14+, Edge 18+</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                🚀 Flujo de Trabajo
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded mr-3 mt-0.5">1</span>
                  <div>
                    <strong>Registrar:</strong> Crea una nueva cuenta usando tu dispositivo biométrico
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded mr-3 mt-0.5">2</span>
                  <div>
                    <strong>Iniciar sesión:</strong> Autentica usando la passkey guardada en tu dispositivo
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-1 rounded mr-3 mt-0.5">3</span>
                  <div>
                    <strong>Gestionar:</strong> Agrega o elimina passkeys adicionales para múltiples dispositivos
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Requisitos importantes:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Debes estar en HTTPS (o localhost para desarrollo)</li>
                <li>• Tu dispositivo debe tener autenticación biométrica configurada</li>
                <li>• El navegador debe soportar WebAuthn API</li>
                <li>• La extensión Firebase Web Authn debe estar instalada</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer con enlaces útiles */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p className="mb-2">
            🔗 Enlaces útiles:
          </p>
          <div className="space-x-4">
            <a
              href="https://console.firebase.google.com/project/liquidacionapp-62962"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              Firebase Console
            </a>
            <a
              href="https://extensions.dev/extensions/gavinsawyer/firebase-web-authn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              Extensión Web Authn
            </a>
            <a
              href="https://webauthn.guide/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              Guía WebAuthn
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasskeyDemo;
