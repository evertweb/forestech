import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { initSchemeFromStorage } from './utils/theme';
// Lazy load App para reducir FCP crítico
import { lazy, Suspense } from 'react';

const App = lazy(() => import('./App.jsx'));

// Detectar basename dinámico según el path actual.
// Esto permite que la app funcione correctamente cuando se sirve bajo /combustibles
// (por ejemplo, rutas como /combustibles/vehicle-wizard-popup) y en raíz '/'.
const getBaseName = () => {
  if (typeof window === 'undefined') return '/';
  const path = window.location.pathname || '/';
  if (path.startsWith('/combustibles')) return '/combustibles';
  if (path.startsWith('/alimentacion')) return '/alimentacion';
  return '/';
};

// Inicializar esquema de color lo antes posible para evitar FOUC del tema
if (typeof document !== 'undefined') {
  initSchemeFromStorage();
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={getBaseName()}>
      <Suspense
        fallback={
          <div className="loading-container">
            <div className="loader">
              <div className="spinner"></div>
              <p>Cargando aplicación...</p>
            </div>
          </div>
        }
      >
        <App />
      </Suspense>
    </BrowserRouter>
  </StrictMode>
);

// Registrar mediciones de Core Web Vitals después de la carga inicial
if (import.meta.env.DEV) {
  import('./utils/webVitals').then(({ registerWebVitals }) => {
    registerWebVitals();
  });
}
console.log('Build optimizado funcionando');
