// Firebase Functions index.js - Exports functions (Mixed Gen 1/Gen 2)
import { onRequest } from 'firebase-functions/v1/https';

// Webhook functions
export { combustiblesWebhookReceiver } from './webhooks/combustibles-webhooks-http.js';

// Passkey auth functions
export {
  generatePasskeyToken,
  checkUserPasskeys,
  registerFace,
  loginFace
} from './passkey-auth.js';

// SSR functions
import { ssrHandler } from './ssr/server.js';
export {
  combustiblesVehicles,
  combustiblesMovements,
  combustiblesInventory,
  combustiblesSuppliers,
  combustiblesProducts,
  combustiblesMaintenance,
  combustiblesHourMeter,
  combustiblesCategories
} from './combustibles-functions.js';

export const ssrCombustibles = onRequest(ssrHandler);