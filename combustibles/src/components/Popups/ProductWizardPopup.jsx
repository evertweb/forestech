// components/Popups/ProductWizardPopup.jsx
// Wrapper que vive en la ruta dedicada y monta ProductWizard usando los providers globales

import React, { useEffect, useState, Suspense, lazy } from 'react';
import { CombustiblesProvider, useCombustibles } from '../../contexts/CombustiblesContext';
import { subscribeToProducts } from '../../services/productsService';
import {
  addMessageListener,
  POPUP_EVENTS,
  validateInitPayload,
  postMessageSafe,
} from '../../services/popupCommunication';
import '../Products/ProductsMain-SAP.css';

const ProductWizard = lazy(() => import('../Products/ProductWizard'));

const PopupInner = () => {
  const [, setInitData] = useState(null);
  const [showWizard, setShowWizard] = useState(false);
  const [, setProducts] = useState([]);

  // Anunciar READY y esperar INIT
  useEffect(() => {
    // Avisar a la ventana padre que el popup está listo
    if (window.opener) {
      postMessageSafe(window.opener, POPUP_EVENTS.POPUP_READY, {});
    }

    const off = addMessageListener(
      ({ type, payload }) => {
        if (type === POPUP_EVENTS.INIT_WIZARD && validateInitPayload(payload)) {
          // Guardar copia segura solo con datos planos
          setInitData({
            theme: payload.theme,
            user: payload.user
              ? {
                  uid: payload.user.uid,
                  email: payload.user.email || null,
                  displayName: payload.user.displayName || null,
                  photoURL: payload.user.photoURL || null,
                }
              : null,
          });
          setShowWizard(true);
        }
      },
      [POPUP_EVENTS.INIT_WIZARD]
    );

    return () => off();
  }, []);

  // Cargar productos disponibles
  useEffect(() => {
    if (showWizard) {
      const unsubscribe = subscribeToProducts(
        (productsData) => {
          setProducts(productsData);
        },
        (error) => {
          console.error('Error loading products in popup:', error);
        }
      );
      return () => unsubscribe();
    }
  }, [showWizard, subscribeToProducts]);

  if (!showWizard) {
    return (
      <div className="popup-loading sap-theme">
        <div className="loading-spinner sap-theme">
          <div className="spinner"></div>
          <p>Inicializando wizard de productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="popup-container sap-theme product-wizard-popup">
      <div className="popup-header sap-theme">
        <h1 className="popup-title sap-theme">🛢️ Nuevo Producto</h1>
        <p className="popup-subtitle sap-theme">Crear un nuevo producto o combustible</p>
      </div>

      <div className="popup-content sap-theme">
        <Suspense
          fallback={
            <div className="wizard-loading sap-theme">
              <div className="loading-spinner sap-theme">
                <div className="spinner"></div>
                <p>Cargando formulario...</p>
              </div>
            </div>
          }
        >
          <ProductWizard />
        </Suspense>
      </div>
    </div>
  );
};

// Wrapper principal con provider
const ProductWizardPopup = () => {
  return (
    <CombustiblesProvider>
      <PopupInner />
    </CombustiblesProvider>
  );
};

export default ProductWizardPopup;
