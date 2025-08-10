import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import './index.css';
import { initSchemeFromStorage } from './utils/theme-ssr';
import AppRouter from './AppRouter.jsx';

// Inicializar esquema de color lo antes posible para evitar FOUC del tema
if (typeof document !== 'undefined') {
  initSchemeFromStorage();
}

// Hydration del SSR - usar hydrateRoot en lugar de createRoot
const container = document.getElementById('root');

// Recuperar initial state del SSR si existe
const initialStateScript = document.getElementById('__INITIAL_STATE__');
let initialState = {};
if (initialStateScript) {
  try {
    initialState = JSON.parse(initialStateScript.textContent || '{}');
  } catch (e) {
    console.warn('Error parsing initial state from SSR:', e);
  }
}

hydrateRoot(
  container,
  <StrictMode>
    <AppRouter initialState={initialState} />
  </StrictMode>
);
