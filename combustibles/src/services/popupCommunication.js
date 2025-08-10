// servicios/popupCommunication.js
// Comunicación segura entre ventana principal y popup usando postMessage

const ORIGIN = window.location.origin;

export const POPUP_EVENTS = {
  INIT_WIZARD: 'INIT_WIZARD',
  POPUP_READY: 'POPUP_READY',
  WIZARD_SUCCESS: 'WIZARD_SUCCESS',
  WIZARD_CANCEL: 'WIZARD_CANCEL',
  WIZARD_ERROR: 'WIZARD_ERROR',
  PING: 'PING',
  PONG: 'PONG',
};

export const isSameOrigin = (event) => event.origin === ORIGIN;

export const postMessageSafe = (targetWindow, type, payload = {}) => {
  if (!targetWindow || targetWindow.closed) return false;
  try {
    targetWindow.postMessage({ type, payload }, ORIGIN);
    return true;
  } catch (e) {
    const name = e?.name || '';
    if (name === 'DataCloneError') {
      console.error('[popupCommunication] DataCloneError: payload contiene datos no clonables');
    } else {
      console.error('[popupCommunication] Error al enviar mensaje:', e);
    }
    return false;
  }
};

// Suscriptor genérico con validación de origen y tipo permitido
export const addMessageListener = (handler, allowedTypes = Object.values(POPUP_EVENTS)) => {
  const listener = (event) => {
    if (!isSameOrigin(event)) return; // Seguridad: solo mismo origen
    const { data } = event;
    if (!data || typeof data !== 'object') return;
    const { type, payload } = data;
    if (!allowedTypes.includes(type)) return;

    try {
      handler({ type, payload, event });
    } catch (e) {
      console.error('[popupCommunication] Error en handler de mensaje:', e);
    }
  };
  window.addEventListener('message', listener);
  return () => window.removeEventListener('message', listener);
};

// Helper para esperar un tipo específico de mensaje (promesa con timeout)
export const waitForMessage = (type, timeoutMs = 5000) =>
  new Promise((resolve, reject) => {
    const off = addMessageListener(
      ({ type: t, payload }) => {
        if (t === type) {
          off();
          resolve(payload);
        }
      },
      [type]
    );

    const to = setTimeout(() => {
      off();
      reject(new Error(`Timeout esperando mensaje ${type}`));
    }, timeoutMs);

    const originalResolve = resolve;
    resolve = (v) => {
      clearTimeout(to);
      originalResolve(v);
    };
  });

// Validación básica de payloads esperados
export const validateInitPayload = (payload) => {
  if (!payload) return false;
  return (
    typeof payload === 'object' &&
    'theme' in payload &&
    ['user', 'inventory', 'vehicles', 'suppliers'].every((k) => k in payload)
  );
};
