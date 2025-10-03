import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { initSchemeFromStorage } from './utils/theme';
// Lazy load App para reducir FCP crítico
import { lazy, Suspense } from 'react';

const App = lazy(() => import('./App.jsx'));

// Detectar basename dinámico según el dominio/path actual.
// - En combustibles.forestechdecolombia.com.co → basename='/' (subdomain dedicado)
// - En forestechdecolombia.com.co/combustibles → basename='/combustibles' (legacy)
// - En alimentacion.forestechdecolombia.com.co → basename='/' (subdomain dedicado)
// - En forestechdecolombia.com.co/alimentacion → basename='/alimentacion' (legacy)
const getBaseName = () => {
  if (typeof window === 'undefined') return '/';
  
  const hostname = window.location.hostname || '';
  const path = window.location.pathname || '/';
  
  // Si el hostname es un subdomain específico, usar raíz
  if (hostname.startsWith('combustibles.')) {
    return '/';
  }
  if (hostname.startsWith('alimentacion.')) {
    return '/';
  }
  
  // Legacy: si el path tiene el prefijo, usarlo como basename
  if (path.startsWith('/combustibles')) {
    return '/combustibles';
  }
  if (path.startsWith('/alimentacion')) {
    return '/alimentacion';
  }
  
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

// Registrar Web Vitals y Firebase Performance Monitoring
if (typeof window !== 'undefined') {
  // En producción y desarrollo
  import('./firebase/performanceMonitoring').then(({ initWebVitalsMonitoring }) => {
    initWebVitalsMonitoring();
  });
  
  // Mantener legacy webVitals en desarrollo
  if (import.meta.env.DEV) {
    import('./utils/webVitals').then(({ registerWebVitals }) => {
      registerWebVitals();
    });
  }
}
console.log('Build optimizado funcionando');
