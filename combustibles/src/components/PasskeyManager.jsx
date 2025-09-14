/**
 * PasskeyManager - Componente para gestionar passkeys del usuario
 * Permite registrar, ver y eliminar passkeys
 */

import React, { useState, useEffect } from 'react';
import {
  registerPasskeyForUser,
  removeUserPasskeys,
  getUserPasskeyInfo,
  isWebAuthnSupported
} from '../services/firebasePasskeyService';
import { registerFace, checkFacialSupport, captureImageFromVideo } from '../services/firebaseFacialService';

const PasskeyManager = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [passkeyInfo, setPasskeyInfo] = useState(null);
  const [webAuthnSupported, setWebAuthnSupported] = useState(false);
  const [facialSupported, setFacialSupported] = useState(false);
  const [facialLoading, setFacialLoading] = useState(false);
  const [showFacialCapture, setShowFacialCapture] = useState(false);
  const [videoStream, setVideoStream] = useState(null);

  useEffect(() => {
    // Verificar soporte
    const webauthnSupported = isWebAuthnSupported();
    setWebAuthnSupported(webauthnSupported);

    const facialSupported = checkFacialSupport();
    setFacialSupported(facialSupported);

    // DEBUG: Logs para entender por qué no aparece el botón
    console.log('🔍 PasskeyManager - Soporte biométrico:', {
      webauthnSupported,
      facialSupported,
      navigator: !!navigator,
      mediaDevices: !!(navigator && navigator.mediaDevices),
      getUserMedia: !!(navigator && navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
      isSecure: window.location.protocol === 'https:' || window.location.hostname === 'localhost',
      isDev: import.meta.env.DEV
    });

    // Cargar información de passkeys
    loadPasskeyInfo();
  }, []);

  const loadPasskeyInfo = async () => {
    try {
      const info = await getUserPasskeyInfo();
      setPasskeyInfo(info);
    } catch (error) {
      console.error('Error cargando info de passkeys:', error);
    }
  };

  const clearMessages = () => {
    setMessage('');
    setError('');
  };

  const handleRegisterPasskey = async () => {
    clearMessages();
    setLoading(true);

    try {
      const result = await registerPasskeyForUser();

      if (result.success) {
        setMessage(result.message);
        await loadPasskeyInfo(); // Recargar información
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error inesperado: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePasskeys = async () => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar todas tus passkeys? Esta acción no se puede deshacer.')) {
      return;
    }

    clearMessages();
    setLoading(true);

    try {
      const result = await removeUserPasskeys();

      if (result.success) {
        setMessage(result.message);
        await loadPasskeyInfo(); // Recargar información
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error inesperado: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    await loadPasskeyInfo();
    setLoading(false);
  };

  const handleFacialRegister = async () => {
    clearMessages();
    setFacialLoading(true);

    try {
      // Solicitar acceso a la cámara
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
        } 
      });
      
      setVideoStream(stream);
      setShowFacialCapture(true);
    } catch (error) {
      console.error('Error accediendo a la cámara:', error);
      setError('No se pudo acceder a la cámara. Verifica los permisos.');
      setFacialLoading(false);
    }
  };

  const handleCaptureAndRegister = async () => {
    if (!videoStream) return;
    
    setFacialLoading(true);
    clearMessages();
    
    try {
      // Crear elementos canvas temporales
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      
      video.srcObject = videoStream;
      await video.play();
      
      // Capturar imagen
      const imageBlob = await captureImageFromVideo(video, canvas);
      
      // Detener el stream
      videoStream.getTracks().forEach(track => track.stop());
      setVideoStream(null);
      setShowFacialCapture(false);
      
      // Registrar rostro
      const result = await registerFace(imageBlob);
      
      if (result.success) {
        setMessage('Rostro registrado exitosamente para autenticación facial');
      } else {
        setError(result.error || 'Error registrando el rostro');
      }
    } catch (error) {
      console.error('Error en registro facial:', error);
      setError('Error en registro facial. Intenta nuevamente.');
    } finally {
      setFacialLoading(false);
    }
  };

  const cancelFacialCapture = () => {
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      setVideoStream(null);
    }
    setShowFacialCapture(false);
    setFacialLoading(false);
  };

  if (!webAuthnSupported && !facialSupported) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-900 mb-2">
          ❌ Autenticación Biométrica No Soportada
        </h3>
        <p className="text-red-700">
          Tu navegador no soporta passkeys ni reconocimiento facial. Necesitas un navegador moderno.
        </p>
      </div>
    );
  }

  // Vista de captura facial
  if (showFacialCapture) {
    return (
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            📷 Registrar Rostro
          </h3>
          <p className="text-gray-600 text-sm">
            Colócate frente a la cámara y captura tu imagen
          </p>
        </div>

        {/* Mensajes */}
        {message && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Video preview */}
        <div className="mb-6">
          <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ height: '300px' }}>
            {videoStream ? (
              <video
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                ref={(video) => {
                  if (video && videoStream) {
                    video.srcObject = videoStream;
                  }
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <span className="text-4xl">📷</span>
                  <p className="mt-2">Cámara no disponible</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleCaptureAndRegister}
            disabled={facialLoading || !videoStream}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {facialLoading ? (
              <>
                <span className="animate-spin">🔄</span>
                <span>Registrando...</span>
              </>
            ) : (
              <>
                <span>📸</span>
                <span>Capturar y Registrar</span>
              </>
            )}
          </button>

          <button
            onClick={cancelFacialCapture}
            className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 rounded-lg transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          🔐 Gestión de Autenticación Biométrica
        </h3>
        <p className="text-gray-600 text-sm">
          Gestiona tus passkeys y reconocimiento facial
        </p>
      </div>

      <div className="p-6">
        {/* Estado actual */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Estado Actual</h4>
          {passkeyInfo ? (
            <div className={`p-4 rounded-lg border ${
              passkeyInfo.hasPasskeys 
                ? 'bg-green-50 border-green-200' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`font-medium ${
                    passkeyInfo.hasPasskeys ? 'text-green-900' : 'text-gray-900'
                  }`}>
                    {passkeyInfo.hasPasskeys ? '✅ Passkeys Activas' : '❌ Sin Passkeys'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {passkeyInfo.hasPasskeys 
                      ? `Tienes ${passkeyInfo.credentials?.length || 0} passkey(s) registrada(s)`
                      : 'No tienes passkeys registradas'
                    }
                  </p>
                </div>
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50"
                >
                  🔄 Actualizar
                </button>
              </div>

              {/* Información detallada */}
              {passkeyInfo.hasPasskeys && passkeyInfo.userData && (
                <div className="mt-3 pt-3 border-t border-green-200">
                  <p className="text-xs text-green-700">
                    <strong>Creada:</strong> {new Date(passkeyInfo.userData.passkeyCreatedAt).toLocaleDateString()}
                  </p>
                  {passkeyInfo.userData.lastLogin && (
                    <p className="text-xs text-green-700">
                      <strong>Último uso:</strong> {new Date(passkeyInfo.userData.lastLogin).toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-500">Cargando información...</p>
            </div>
          )}
        </div>

        {/* Mensajes */}
        {message && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Acciones */}
        <div className="space-y-4">
          {/* Passkeys */}
          {webAuthnSupported && (
            <div className="border-b border-gray-200 pb-4">
              <h4 className="font-medium text-gray-900 mb-3">🔐 Passkeys</h4>
              {!passkeyInfo?.hasPasskeys ? (
                <button
                  onClick={handleRegisterPasskey}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin">🔄</span>
                      <span>Registrando...</span>
                    </>
                  ) : (
                    <>
                      <span>🔐</span>
                      <span>Registrar Passkey</span>
                    </>
                  )}
                </button>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={handleRegisterPasskey}
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="animate-spin">🔄</span>
                        <span>Creando...</span>
                      </>
                    ) : (
                      <>
                        <span>➕</span>
                        <span>Agregar Passkey Adicional</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleRemovePasskeys}
                    disabled={loading}
                    className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="animate-spin">🔄</span>
                        <span>Eliminando...</span>
                      </>
                    ) : (
                      <>
                        <span>🗑️</span>
                        <span>Eliminar Todas las Passkeys</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Reconocimiento Facial */}
          {/* DEBUG: Mostrar temporalmente info de soporte */}
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>DEBUG - Soporte Facial:</strong> {facialSupported ? '✅ SOPORTADO' : '❌ NO SOPORTADO'}
            </p>
            <p className="text-xs text-yellow-600">
              MediaDevices: {navigator?.mediaDevices ? 'Sí' : 'No'} |
              getUserMedia: {navigator?.mediaDevices?.getUserMedia ? 'Sí' : 'No'} |
              Secure: {(window.location.protocol === 'https:' || window.location.hostname === 'localhost') ? 'Sí' : 'No'}
            </p>
          </div>
          
          {/* TEMPORAL: Mostrar siempre para debug */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">📷 Reconocimiento Facial</h4>
            <button
              onClick={handleFacialRegister}
              disabled={facialLoading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {facialLoading ? (
                <>
                  <span className="animate-spin">🔄</span>
                  <span>Accediendo a cámara...</span>
                </>
              ) : (
                <>
                  <span>📷</span>
                  <span>Registrar Rostro [DEBUG: {facialSupported ? 'SOPORTADO' : 'NO SOPORTADO'}]</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h5 className="font-medium text-blue-900 mb-2">📋 Métodos de autenticación disponibles</h5>
          <ul className="text-sm text-blue-700 space-y-1">
            {webAuthnSupported && (
              <>
                <li>• <strong>Passkeys:</strong> Touch ID, Face ID o Windows Hello</li>
                <li>• Más seguras que las contraseñas tradicionales</li>
                <li>• Puedes tener múltiples passkeys para diferentes dispositivos</li>
              </>
            )}
            {facialSupported && (
              <>
                <li>• <strong>Reconocimiento Facial:</strong> Usa IA para verificar tu identidad</li>
                <li>• Requiere acceso a la cámara del dispositivo</li>
                <li>• Solo una imagen facial por usuario</li>
              </>
            )}
            <li>• Una vez configurados, puedes usarlos en la página de login</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PasskeyManager;