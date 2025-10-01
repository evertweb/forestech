// components/Popups/VehicleWizardPopup.jsx
// Wrapper que vive en la ruta dedicada y monta VehicleWizard usando los providers globales
// MIGRADO A ZUSTAND (Fase 2 - Sprint 1)

import React, { useEffect, useState, Suspense, lazy } from 'react';
import { CombustiblesProvider } from '../../contexts/CombustiblesContext';
import { subscribeToCategories as subscribeToVehicleCategories } from '../../services/FirebaseVehicleCategoriesService';
import {
  addMessageListener,
  POPUP_EVENTS,
  validateInitPayload,
  postMessageSafe,
} from '../../services/popupCommunication';
import '../../styles/sap-vehicles.css';
import '../Movements/WizardSteps-Government.css';

const VehicleFormCorporate = lazy(() => import('../Vehicles/VehicleFormCorporate'));

const PopupInner = () => {
  // MIGRADO: subscribeToVehicleCategories desde servicio
  const [, setInitData] = useState(null);
  const [showWizard, setShowWizard] = useState(false);
  const [, setCategories] = useState([]);

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

  // Suscribirse a categorías dentro del popup si es necesario
  useEffect(() => {
    let unsubscribe = null;
    if (showWizard) {
      unsubscribe = subscribeToVehicleCategories((list) => setCategories(list || []));
    }
    return () => unsubscribe && unsubscribe();
  }, [showWizard]);

  if (!showWizard) {
    return (
      <div className="loading-container sap-theme" style={{ padding: 24 }}>
        <div className="loading-spinner sap-theme" />
        <p>Preparando formulario de vehículo...</p>
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
      <VehicleFormCorporate
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
        // VehicleFormCorporate usa contexto para data; initData conserva theme/config si se requiere.
      />
    </Suspense>
  );
};

const VehicleWizardPopup = () => {
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

export default VehicleWizardPopup;
