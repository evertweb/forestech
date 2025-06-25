/**
 * Firebase Messaging Service Worker
 * Maneja notificaciones push en background
 * Archivo requerido por Firebase Cloud Messaging
 */

// Importar Firebase scripts para Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// Configuración de Firebase (usar las mismas variables que en config.js)
const firebaseConfig = {
  apiKey: "AIzaSyDVBZf4NDEQD3U8H9vj8QcW1KRU4xTk8Po",
  authDomain: "liquidacionapp-62962.firebaseapp.com", 
  projectId: "liquidacionapp-62962",
  storageBucket: "liquidacionapp-62962.firebasestorage.app",
  messagingSenderId: "894765623264",
  appId: "1:894765623264:web:7dafe8e3c7f59bd7b2e7a7",
  measurementId: "G-DR2TJESVPX"
};

// Inicializar Firebase en Service Worker
firebase.initializeApp(firebaseConfig);

// Obtener instancia de messaging
const messaging = firebase.messaging();

// Manejar mensajes en background
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Mensaje recibido en background:', payload);

  // Extraer información de la notificación
  const notificationTitle = payload.notification?.title || 'Forestech - Nueva notificación';
  const notificationOptions = {
    body: payload.notification?.body || 'Tienes una nueva notificación',
    icon: payload.notification?.icon || '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'forestech-notification',
    data: {
      ...payload.data,
      click_action: payload.notification?.click_action || '/'
    },
    actions: [
      {
        action: 'open',
        title: 'Abrir App'
      },
      {
        action: 'close',
        title: 'Cerrar'
      }
    ],
    requireInteraction: false,
    silent: false
  };

  // Mostrar notificación
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Manejar click en notificación
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Click en notificación:', event);
  
  event.notification.close();

  // Abrir o enfocar la aplicación
  if (event.action === 'open' || !event.action) {
    const urlToOpen = event.notification.data?.click_action || '/alimentacion/';
    
    event.waitUntil(
      clients.matchAll({
        type: 'window',
        includeUncontrolled: true
      }).then((clientList) => {
        // Buscar ventana ya abierta
        for (const client of clientList) {
          if (client.url.includes('/alimentacion/') && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Si no hay ventana abierta, abrir nueva
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
    );
  }
});

// Manejar cierre de notificación
self.addEventListener('notificationclose', (event) => {
  console.log('[firebase-messaging-sw.js] Notificación cerrada:', event);
  
  // Aquí podrías enviar analytics sobre notificaciones cerradas
  // No se puede usar el servicio de analytics directamente desde SW
});

// Información del Service Worker
console.log('[firebase-messaging-sw.js] Service Worker de Firebase Messaging cargado');

// Instalar Service Worker (sin cache para evitar errores)
self.addEventListener('install', (event) => {
  console.log('[firebase-messaging-sw.js] Service Worker instalado');
  self.skipWaiting();
});

// Activar Service Worker
self.addEventListener('activate', (event) => {
  console.log('[firebase-messaging-sw.js] Service Worker activado');
  event.waitUntil(self.clients.claim());
});