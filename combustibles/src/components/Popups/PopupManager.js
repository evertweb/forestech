// components/Popups/PopupManager.js
// Utilidad para abrir y administrar la ventana popup del MovementWizard

import { postMessageSafe, POPUP_EVENTS } from '../../services/popupCommunication';

const DEFAULT_FEATURES = {
  width: 900,
  height: 800,
  scrollbars: 'yes',
  resizable: 'yes',
  status: 'no',
  location: 'no',
  toolbar: 'no',
  menubar: 'no',
};

const featuresToString = (feat) =>
  Object.entries(feat)
    .map(([k, v]) => `${k}=${v}`)
    .join(',');

// Detectar si estamos en subdomain o en path con prefijo
const getRoutePrefix = () => {
  if (typeof window === 'undefined') return '';
  const hostname = window.location.hostname || '';
  
  // Si estamos en combustibles.forestechdecolombia.com.co, NO usar prefijo
  if (hostname.startsWith('combustibles.')) {
    return '';
  }
  
  // Si estamos en forestechdecolombia.com.co/combustibles, usar prefijo
  return '/combustibles';
};

export class PopupManager {
  constructor(route = 'movement-wizard-popup', features = DEFAULT_FEATURES) {
    // Aplicar el prefijo adecuado según el dominio
    const prefix = getRoutePrefix();
    this.route = prefix ? `${prefix}/${route}` : `/${route}`;
    this.features = features;
    this.popupRef = null;
    this.onMessage = null;
    this.closedInterval = null;
  }

  // Eliminar funciones/referencias no clonables del payload
  sanitizeInitialData(data) {
    if (!data || typeof data !== 'object') return {};
    const safeUser = data.user
      ? {
          uid: data.user.uid,
          email: data.user.email || null,
          displayName: data.user.displayName || null,
          photoURL: data.user.photoURL || null,
        }
      : null;
    const passThrough = (arr) =>
      Array.isArray(arr)
        ? arr.map((x) => {
            if (x && typeof x === 'object') {
              // Shallow copy only plain data fields
              const y = {};
              for (const k of Object.keys(x)) {
                const v = x[k];
                if (typeof v === 'function') continue;
                if (typeof v === 'object' && v !== null) {
                  // Convert Date to ISO; leave others as-is for now
                  if (v instanceof Date) y[k] = v.toISOString();
                  else if (v.toDate && typeof v.toDate === 'function')
                    y[k] = v.toDate().toISOString();
                  else y[k] = JSON.parse(JSON.stringify(v));
                } else {
                  y[k] = v;
                }
              }
              return y;
            }
            return x;
          })
        : [];

    return {
      theme: data.theme || 'sap-fiori',
      user: safeUser,
      inventory: passThrough(data.inventory),
      vehicles: passThrough(data.vehicles),
      suppliers: passThrough(data.suppliers),
    };
  }

  open(initialData, onMessage) {
    // Centrar popup
    const dualScreenLeft = window.screenLeft ?? window.screenX;
    const dualScreenTop = window.screenTop ?? window.screenY;
    const width = window.innerWidth ?? document.documentElement.clientWidth ?? screen.width;
    const height = window.innerHeight ?? document.documentElement.clientHeight ?? screen.height;

    const systemZoom = width / window.screen.availWidth;
    const isMobile = Math.min(width, height) < 768;
    const w = isMobile ? window.screen.availWidth : this.features.width;
    const h = isMobile ? window.screen.availHeight : this.features.height;
    const left = isMobile ? 0 : (width - w) / 2 / systemZoom + dualScreenLeft;
    const top = isMobile ? 0 : (height - h) / 2 / systemZoom + dualScreenTop;

    const features = featuresToString({
      ...this.features,
      left: Math.max(0, left),
      top: Math.max(0, top),
    });

    const popup = window.open(this.route, 'movementWizardPopup', features);
    if (!popup || popup.closed) {
      return {
        success: false,
        error: 'Popup bloqueado. Permite ventanas emergentes e inténtalo de nuevo.',
      };
    }

    this.popupRef = popup;
    this.onMessage = onMessage;

    // Intentar foco
    try {
      popup.focus();
    } catch {
      /* ignorar fallo de focus */
    }

    // Monitor de cierre inesperado
    this.closedInterval = window.setInterval(() => {
      if (!this.popupRef || this.popupRef.closed) {
        this.cleanup();
        if (typeof this.onMessage === 'function') {
          this.onMessage({ type: POPUP_EVENTS.WIZARD_CANCEL, payload: { reason: 'closed' } });
        }
      }
    }, 500);

    // Enviar INIT cuando el popup avise que está listo
    const handleMessage = ({ type }) => {
      if (type === POPUP_EVENTS.POPUP_READY) {
        const safeData = this.sanitizeInitialData(initialData);
        postMessageSafe(this.popupRef, POPUP_EVENTS.INIT_WIZARD, safeData);
      }
    };

    // Conectar listener temporal del READY
    window.addEventListener(
      'message',
      (ev) => {
        const originOk = ev.origin === window.location.origin;
        if (!originOk || !ev.data) return;
        if (ev.data.type === POPUP_EVENTS.POPUP_READY) {
          handleMessage({ type: POPUP_EVENTS.POPUP_READY });
        }
      },
      { once: true }
    );

    // Suscripción principal del consumidor
    if (typeof onMessage === 'function') {
      const listener = (ev) => {
        const originOk = ev.origin === window.location.origin;
        if (!originOk || !ev.data) return;
        const { type, payload } = ev.data;
        if (
          [
            POPUP_EVENTS.WIZARD_SUCCESS,
            POPUP_EVENTS.WIZARD_CANCEL,
            POPUP_EVENTS.WIZARD_ERROR,
          ].includes(type)
        ) {
          onMessage({ type, payload });
          if (type !== POPUP_EVENTS.WIZARD_ERROR) {
            this.close();
          }
        }
      };
      window.addEventListener('message', listener);
      this.detach = () => window.removeEventListener('message', listener);
    }

    return { success: true, popup };
  }

  close() {
    if (this.popupRef && !this.popupRef.closed) {
      try {
        this.popupRef.close();
      } catch {
        /* ignorar fallo de cierre */
      }
    }
    this.cleanup();
  }

  cleanup() {
    if (this.closedInterval) {
      clearInterval(this.closedInterval);
      this.closedInterval = null;
    }
    if (this.detach) {
      this.detach();
      this.detach = null;
    }
    this.popupRef = null;
  }
}

export const openMovementWizardPopup = (initialData, onMessage) => {
  const manager = new PopupManager('movement-wizard-popup');
  const res = manager.open(initialData, onMessage);
  return { ...res, manager };
};

export const openVehicleWizardPopup = (initialData, onMessage) => {
  const manager = new PopupManager('vehicle-wizard-popup', {
    ...DEFAULT_FEATURES,
    width: 900,
    height: 800,
  });
  const res = manager.open(initialData, onMessage);
  return { ...res, manager };
};

export const openProductWizardPopup = (initialData, onMessage) => {
  const manager = new PopupManager('product-wizard-popup', {
    ...DEFAULT_FEATURES,
    width: 900,
    height: 700,
  });
  const res = manager.open(initialData, onMessage);
  return { ...res, manager };
};
