/**
 * FacialCaptureImproved - Componente mejorado para captura facial
 * Soluciona problemas de UX y sincronización de vista previa
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';

const FacialCaptureImproved = ({ 
  onCapture, 
  onCancel, 
  loading = false,
  title = "Captura Facial",
  subtitle = "Colócate frente a la cámara",
  captureButtonText = "Capturar Imagen"
}) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [videoStream, setVideoStream] = useState(null);
  const [videoReady, setVideoReady] = useState(false);
  const [error, setError] = useState('');
  const [videoAspectRatio, setVideoAspectRatio] = useState(4/3); // Default 4:3

  // Definir cleanupCamera primero con useCallback
  const cleanupCamera = useCallback(() => {
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      setVideoStream(null);
    }
    setVideoReady(false);
  }, [videoStream]);

  const initializeCamera = async () => {
    try {
      setError('');
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640, min: 480 },
          height: { ideal: 480, min: 360 },
          facingMode: 'user',
          aspectRatio: { ideal: 4/3 }
        }
      });

      setVideoStream(stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accediendo a la cámara:', error);
      setError('No se pudo acceder a la cámara. Verifica los permisos.');
    }
  };

  // useEffect después de que cleanupCamera esté definida
  useEffect(() => {
    initializeCamera();
    return () => {
      cleanupCamera();
    };
  }, [cleanupCamera]); // Agregar cleanupCamera como dependencia

  const handleVideoLoaded = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const aspectRatio = video.videoWidth / video.videoHeight;
      setVideoAspectRatio(aspectRatio);
      setVideoReady(true);
      
      console.log('📷 Video cargado:', {
        width: video.videoWidth,
        height: video.videoHeight,
        aspectRatio: aspectRatio
      });
    }
  };

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current || !videoReady) {
      setError('Video no está listo para captura');
      return;
    }

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      // Usar las dimensiones reales del video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Dibujar la imagen actual del video (el mismo que ve el usuario)
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convertir a blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            onCapture(blob);
          } else {
            setError('Error generando la imagen');
          }
        },
        'image/jpeg',
        0.9
      );
    } catch (error) {
      console.error('Error capturando imagen:', error);
      setError('Error durante la captura. Intenta nuevamente.');
    }
  };

  const handleCancel = () => {
    cleanupCamera();
    onCancel();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
          📷
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-gray-600 text-sm">
          {subtitle}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          ⚠️ {error}
        </div>
      )}

      {/* Video Container con aspect ratio dinámico */}
      <div className="mb-6">
        <div 
          className="relative bg-gray-100 rounded-lg overflow-hidden mx-auto"
          style={{ 
            width: '100%',
            maxWidth: '400px',
            aspectRatio: videoAspectRatio
          }}
        >
          {/* Video Element */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            onLoadedMetadata={handleVideoLoaded}
            className="w-full h-full object-contain bg-gray-900"
            style={{ transform: 'scaleX(-1)' }} // Mirror para que se vea natural
          />

          {/* Overlay Guide - Círculo guía facial */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative">
              {/* Círculo guía principal */}
              <div 
                className="border-4 border-white border-opacity-70 rounded-full shadow-lg"
                style={{ 
                  width: '180px', 
                  height: '220px',
                  borderRadius: '50%'
                }}
              >
              </div>
              
              {/* Indicador de calidad */}
              {videoReady && (
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                  <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    ✓ Listo para capturar
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Loading overlay */}
          {!videoReady && !error && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-gray-600 text-sm">Inicializando cámara...</p>
              </div>
            </div>
          )}
        </div>

        {/* Instrucciones */}
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-500">
            • Centra tu rostro en el círculo guía<br/>
            • Asegúrate de tener buena iluminación<br/>
            • Mantén la cabeza recta y mira a la cámara
          </p>
        </div>
      </div>

      {/* Canvas oculto para captura */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={handleCapture}
          disabled={loading || !videoReady || !!error}
          className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="animate-spin">🔄</span>
              <span>Procesando...</span>
            </>
          ) : (
            <>
              <span>📸</span>
              <span>{captureButtonText}</span>
            </>
          )}
        </button>

        <button
          onClick={handleCancel}
          disabled={loading}
          className="px-6 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 font-medium py-3 rounded-lg transition-colors"
        >
          Cancelar
        </button>
      </div>

      {/* Tips adicionales */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-700">
          <strong>💡 Consejos:</strong> La cámara está reflejada para que te veas natural. 
          La imagen capturada será correcta para el reconocimiento facial.
        </p>
      </div>
    </div>
  );
};

export default FacialCaptureImproved;