/**
 * PasskeyDemo - Página de demostración de passkeys
 * Wrapper del componente PasskeyAuth para testing y demostración
 */

import React from 'react';
import PasskeyAuth from '../components/PasskeyAuth';

const PasskeyDemo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-white">🔐 Demo de Passkeys</h1>
          <p className="text-lg text-gray-300">
            Prueba la funcionalidad de autenticación con passkeys
          </p>
          <div className="mt-4 rounded-lg border border-blue-500/30 bg-blue-900/30 p-4">
            <p className="text-sm text-blue-200">
              <strong>Nota:</strong> Esta es una página de demostración. La funcionalidad de
              passkeys está integrada en el login principal.
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <PasskeyAuth />
        </div>

        <div className="mt-8 text-center">
          <a
            href="/combustibles"
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-700"
          >
            <span>🏠</span>
            Volver al Login Principal
          </a>
        </div>
      </div>
    </div>
  );
};

export default PasskeyDemo;
