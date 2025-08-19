import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';
import AppSSR from './AppSSR.jsx';
import { isServer } from './utils/ssr.js';

/**
 * AppRouter - Wrapper que maneja routing para SSR y CSR
 * @param {Object} props
 * @param {string} props.location - URL para StaticRouter (solo servidor)
 * @param {Object} props.initialState - Estado inicial para hydration
 */
function AppRouter({ location, initialState = {} }) {
  const RouterComponent = isServer ? StaticRouter : BrowserRouter;
  // Usar el mismo basename en SSR y CSR para que las rutas /combustibles/* hagan match
  const routerProps = isServer
    ? { location, basename: '/combustibles' }
    : { basename: '/combustibles' };

  // Hacer disponible el initial state para los componentes
  React.useEffect(() => {
    if (!isServer && typeof window !== 'undefined') {
      window.__INITIAL_STATE__ = initialState;
    }
  }, [initialState]);

  return (
    <RouterComponent {...routerProps}>
      <AppSSR />
    </RouterComponent>
  );
}

export default AppRouter;
