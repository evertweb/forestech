// components/Popups/MovementWizardPopup.jsx
// Wrapper que vive en la ruta dedicada y monta MovementWizard usando los providers globales
//
// MIGRADO A ZUSTAND (Fase 2 - Sprint 1)
// - subscribeToSuppliers desde servicio directamente (no hay store aún)

import React, { useEffect, useState, Suspense, lazy } from 'react';
import { CombustiblesProvider } from '../../contexts/CombustiblesContext';
import { subscribeToSuppliers } from '../../services/FirebaseSuppliersService';
import {
  addMessageListener,
  POPUP_EVENTS,
  validateInitPayload,
  postMessageSafe,
} from '../../services/popupCommunication';
import '../../components/Movements/WizardSteps-Government.css';

const MovementWizard = lazy(() => import('../Movements/MovementWizard'));

const PopupInner = () => {
  // Note: subscribeToSuppliers usado directamente del servicio
  const [initData, setInitData] = useState(null);
  const [showWizard, setShowWizard] = useState(false);
  const [, setSuppliers] = useState([]);

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

  // Suscribirse a suppliers dentro del popup si es necesario
  useEffect(() => {
    let unsubscribe = null;
    if (showWizard) {
      unsubscribe = subscribeToSuppliers((list) => setSuppliers(list || []));
    }
    return () => unsubscribe && unsubscribe();
  }, [showWizard]);

  if (!showWizard) {
    return (
      <div className="loading-container sap-theme" style={{ padding: 24 }}>
        <div className="loading-spinner sap-theme" />
        <p>Preparando formulario...</p>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="loading-container">
          <p>Cargando asistente...</p>
        </div>
      }
    >
      <MovementWizard
        isOpen={true}
        onClose={() => {
          if (window.opener) {
            postMessageSafe(window.opener, POPUP_EVENTS.WIZARD_CANCEL, { reason: 'user_cancel' });
          }
          window.close();
        }}
        onSuccess={(result) => {
          if (window.opener) {
            postMessageSafe(window.opener, POPUP_EVENTS.WIZARD_SUCCESS, result || {});
          }
          window.close();
        }}
        theme={initData?.theme || 'government'}
        // MovementWizard usa contexto para data; initData conserva theme/config si se requiere.
      />
    </Suspense>
  );
};

const MovementWizardPopup = () => {
  const [overrides, setOverrides] = useState(null);

  // Capturar INIT para preparar overrides a nivel Provider
  useEffect(() => {
    const off = addMessageListener(
      ({ type, payload }) => {
        if (type === POPUP_EVENTS.INIT_WIZARD && validateInitPayload(payload)) {
          setOverrides({
            user: payload.user || null,
            inventory: payload.inventory || [],
            vehicles: payload.vehicles || [],
            suppliers: payload.suppliers || [],
          });
        }
      },
      [POPUP_EVENTS.INIT_WIZARD]
    );
    return () => off();
  }, []);

  return (
    <CombustiblesProvider overrides={overrides}>
      <PopupInner />
    </CombustiblesProvider>
  );
};

export default MovementWizardPopup;
