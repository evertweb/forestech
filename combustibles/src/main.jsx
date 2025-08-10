import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { initSchemeFromStorage } from './utils/theme';
// Lazy load App para reducir FCP crítico
import { lazy, Suspense } from 'react';

const App = lazy(() => import('./App.jsx'));

// Inicializar esquema de color lo antes posible para evitar FOUC del tema
if (typeof document !== 'undefined') {
  initSchemeFromStorage();
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename="/combustibles">
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
