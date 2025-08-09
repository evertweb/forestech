/**
 * Gestor de imagen de fondo para el login
 * combustibles/src/components/Admin/BackgroundImageManager.jsx
 */

import React, { useState, useEffect } from 'react';
import { getBackgroundImageUrl, uploadBackgroundImage } from '../../services/backgroundImageService';

const BackgroundImageManager = () => {
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCurrentImage();
  }, []);

  const loadCurrentImage = async () => {
    try {
      const url = await getBackgroundImageUrl();
      setCurrentImageUrl(url);
    } catch {
      setMessage({ type: 'error', text: 'Error cargando imagen actual' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    setMessage({ type: '', text: '' });

    try {
      const result = await uploadBackgroundImage(file);
      
      if (result.success) {
        setMessage({ type: 'success', text: '✅ Imagen subida exitosamente' });
        setCurrentImageUrl(result.url);
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    } catch {
      setMessage({ type: 'error', text: 'Error subiendo imagen' });
    } finally {
      setUploading(false);
      // Limpiar input
      event.target.value = '';
    }
  };

  if (loading) {
    return (
      <div className="background-manager">
        <h3>🖼️ Imagen de Fondo del Login</h3>
        <div className="loading">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="background-manager">
      <h3>🖼️ Imagen de Fondo del Login</h3>
      
      {/* Vista previa actual */}
      <div className="current-image-section">
        <h4>Imagen Actual:</h4>
        <div className="image-preview">
          {currentImageUrl ? (
            <img 
              src={currentImageUrl} 
              alt="Imagen de fondo actual" 
              loading="lazy"
              decoding="async"
              width={600}
              height={200}
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover',
                borderRadius: '8px',
                border: '2px solid var(--text-muted)'
              }}
            />
          ) : (
            <div className="no-image">Sin imagen configurada</div>
          )}
        </div>
      </div>

      {/* Subida de nueva imagen */}
      <div className="upload-section">
        <h4>Subir Nueva Imagen:</h4>
        <div className="upload-form">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            id="background-upload"
            style={{ display: 'none' }}
          />
          <label 
            htmlFor="background-upload"
            className={`upload-button ${uploading ? 'disabled' : ''}`}
          >
            {uploading ? '📤 Subiendo...' : '📁 Seleccionar Nueva Imagen'}
          </label>
        </div>

        <div className="upload-info">
          <small>
            • Formato: JPG, PNG, WebP<br/>
            • Tamaño máximo: 5MB<br/>
            • Resolución recomendada: 1920x1080 o superior
          </small>
        </div>
      </div>

      {/* Mensajes */}
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Instrucciones */}
      <div className="instructions">
        <h4>📋 Instrucciones:</h4>
        <ul>
          <li>La imagen se mostrará como fondo en la pantalla de login</li>
          <li>Se aplicará un overlay semitransparente automáticamente</li>
          <li>Para mejor calidad, usa imágenes de alta resolución</li>
          <li>Los cambios se aplican inmediatamente</li>
        </ul>
      </div>

      <style jsx>{`
        .background-manager {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .background-manager h3 {
          margin-top: 0;
          color: #2d5016;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 10px;
        }

        .background-manager h4 {
          color: #1b4332;
          margin: 20px 0 10px 0;
        }

        .current-image-section {
          margin-bottom: 30px;
        }

        .image-preview {
          margin-top: 10px;
        }

        .no-image {
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f9fafb;
          border: 2px dashed #d1d5db;
          border-radius: 8px;
          color: #6b7280;
        }

        .upload-section {
          margin-bottom: 30px;
        }

        .upload-button {
          display: inline-block;
          padding: 12px 24px;
          background: var(--gradient-background);
          color: white;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 600;
          text-decoration: none;
        }

        .upload-button:hover:not(.disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(45, 80, 22, 0.3);
        }

        .upload-button.disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .upload-info {
          margin-top: 15px;
          padding: 12px;
          background: var(--bg-light-gray);
          border-radius: 6px;
          border-left: 4px solid var(--color-success);
        }

        .upload-info small {
          color: #166534;
          line-height: 1.5;
        }

        .message {
          padding: 12px 16px;
          border-radius: 8px;
          margin: 15px 0;
          font-weight: 500;
        }

        .message.success {
          background: var(--bg-light-gray);
          color: #166534;
          border-left: 4px solid var(--color-success);
        }

        .message.error {
          background: var(--bg-light-gray);
          color: #dc2626;
          border-left: 4px solid var(--color-error);
        }

        .instructions {
          background: #fafafa;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .instructions ul {
          margin: 10px 0 0 0;
          padding-left: 20px;
        }

        .instructions li {
          margin-bottom: 8px;
          color: #374151;
          line-height: 1.5;
        }

        .loading {
          text-align: center;
          padding: 40px;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
};

export default BackgroundImageManager;