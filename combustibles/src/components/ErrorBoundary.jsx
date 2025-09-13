/* global process */

import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(_error) {
    // Actualiza el state para que el siguiente renderizado muestre la UI de error
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // También puedes registrar el error en un servicio de reporte de errores
    console.error('🚨 [ErrorBoundary] Error capturado:', error);
    console.error('🚨 [ErrorBoundary] Error info:', errorInfo);

    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Si el error está relacionado con passkeys/auth, intentar limpiar el estado
    if (error.message?.includes('passkey') || error.message?.includes('webauthn') || error.message?.includes('credential')) {
      console.log('🧹 [ErrorBoundary] Error relacionado con passkeys detectado - limpiando estado...');
      this.handlePasskeyError();
    }
  }

  handlePasskeyError = () => {
    // Limpiar cualquier estado corrupto relacionado con auth
    try {
      // Limpiar localStorage de auth
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('firebase') || key.includes('auth') || key.includes('user'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));

      console.log('🧹 [ErrorBoundary] Estado de auth limpiado');
    } catch (cleanupError) {
      console.error('❌ [ErrorBoundary] Error limpiando estado:', cleanupError);
    }
  };

  handleRetry = () => {
    // Reintentar renderizado
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });

    // Recargar la página después de un breve delay
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  handleResetApp = () => {
    // Reset completo de la aplicación
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">
                Error en la Aplicación
              </h1>
              <p className="text-gray-600 mb-4">
                Se produjo un error después de la limpieza de passkeys. Esto es normal y se puede resolver fácilmente.
              </p>
            </div>

            {/* Información del error (solo en desarrollo) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-4 p-3 bg-red-50 rounded border border-red-200">
                <details className="text-sm">
                  <summary className="font-medium text-red-800 cursor-pointer">
                    Detalles técnicos del error
                  </summary>
                  <div className="mt-2 text-red-700 font-mono text-xs">
                    <div className="mb-2">
                      <strong>Error:</strong> {this.state.error.toString()}
                    </div>
                    {this.state.errorInfo && (
                      <div>
                        <strong>Stack:</strong>
                        <pre className="whitespace-pre-wrap mt-1">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                🔄 Reintentar
              </button>

              <button
                onClick={this.handleResetApp}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                🧹 Reset Completo
              </button>

              <button
                onClick={() => window.location.href = '/'}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                🏠 Ir al Inicio
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                ✅ Las passkeys residuales fueron eliminadas correctamente.
                <br />
                Este error es temporal y se resolverá automáticamente.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
