import React from 'react';

// Logo animado simplificado para SSR (sin JSX)
const AnimatedLogoSSR = ({ size = 80 }) => {
  return React.createElement('div', {
    style: {
      width: size,
      height: size,
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '1.5rem',
      boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)'
    }
  }, 
    React.createElement('div', {
      style: {
        width: '60%',
        height: '60%',
        background: 'white',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.3,
        color: '#10b981'
      }
    }, '⛽')
  );
};

// Componente SSR que replica la landing page del cliente (sin JSX)
const LoginSSR = () => {
  return React.createElement('div', {
    style: {
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #34d399, #14b8a6, #3b82f6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      position: 'relative',
      overflow: 'hidden'
    }
  },
    // Partículas de fondo
    React.createElement('div', {
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        pointerEvents: 'none'
      }
    },
      React.createElement('div', {
        style: {
          position: 'absolute',
          top: '25%',
          left: '25%',
          width: '16rem',
          height: '16rem',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          filter: 'blur(48px)'
        }
      }),
      React.createElement('div', {
        style: {
          position: 'absolute',
          bottom: '25%',
          right: '25%',
          width: '12rem',
          height: '12rem',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '50%',
          filter: 'blur(32px)'
        }
      }),
      React.createElement('div', {
        style: {
          position: 'absolute',
          top: '75%',
          left: '75%',
          width: '8rem',
          height: '8rem',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          filter: 'blur(24px)'
        }
      })
    ),
    
    // Contenido principal
    React.createElement('div', {
      style: {
        position: 'relative',
        zIndex: 10,
        textAlign: 'center',
        maxWidth: '32rem'
      }
    },
      // Logo
      React.createElement('div', {
        style: {
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '2rem'
        }
      }, React.createElement(AnimatedLogoSSR, { size: 120 })),
      
      // Título principal
      React.createElement('div', {
        style: { marginBottom: '2rem' }
      },
        React.createElement('h1', {
          style: {
            fontSize: '3rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '1rem',
            filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
          }
        }, 'Sistema de'),
        React.createElement('h1', {
          style: {
            fontSize: '3rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '0.5rem',
            filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
          }
        }, 'Combustibles'),
        React.createElement('h2', {
          style: {
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#a7f3d0',
            marginBottom: '1rem',
            filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
          }
        }, 'Forestech Colombia'),
        React.createElement('p', {
          style: {
            fontSize: '1.125rem',
            color: 'rgba(255, 255, 255, 0.9)',
            filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
          }
        }, 'Gestión inteligente de recursos energéticos')
      ),

      // Botón CTA
      React.createElement('button', {
        style: {
          background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
          color: '#059669',
          padding: '1rem 2rem',
          borderRadius: '9999px',
          fontSize: '1.125rem',
          fontWeight: '600',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '2px solid rgba(16, 185, 129, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          margin: '0 auto',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }
      },
        React.createElement('span', {
          style: { fontSize: '1.5rem' }
        }, '🚀'),
        React.createElement('span', null, 'Ingresar al Sistema')
      ),

      // Indicador SSR
      React.createElement('div', {
        style: {
          marginTop: '2rem',
          padding: '1rem',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(8px)',
          borderRadius: '0.5rem',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }
      },
        React.createElement('p', {
          style: {
            fontSize: '0.875rem',
            color: 'rgba(255, 255, 255, 0.8)',
            marginBottom: '0.5rem'
          }
        }, '🔄 Cargando sistema de autenticación...'),
        React.createElement('div', {
          style: {
            width: '100%',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '9999px',
            height: '0.5rem',
            marginBottom: '0.5rem'
          }
        },
          React.createElement('div', {
            style: {
              background: 'white',
              height: '0.5rem',
              borderRadius: '9999px',
              width: '75%',
              transition: 'all 1s ease'
            }
          })
        ),
        React.createElement('p', {
          style: {
            fontSize: '0.75rem',
            color: 'rgba(255, 255, 255, 0.7)'
          }
        }, 'SSR activo - Optimizado para rendimiento')
      ),
      
      React.createElement('div', {
        style: {
          marginTop: '1rem',
          textAlign: 'center',
          fontSize: '0.875rem',
          color: 'rgba(255, 255, 255, 0.6)'
        }
      },
        React.createElement('p', null, 'La aplicación se hidratará automáticamente')
      )
    )
  );
};

// Importar componentes SSR
import DashboardSSR from './components/DashboardSSR.js';
import MovementsSSR from './components/MovementsSSR.js';
import VehiclesSSR from './components/VehiclesSSR.js';
import InventorySSR from './components/InventorySSR.js';

// Wrapper expandido para SSR - REFACTOR FASE 1
const AppSSRMinimal = ({ location, initialState, user }) => {
  const route = location || '';
  
  // Landing/Login (actual)
  if (route === '/combustibles' || route === '/combustibles/') {
    return React.createElement(LoginSSR);
  }
  
  // Dashboard SSR (Fase 1)
  if (route.includes('/dashboard')) {
    if (user && !user.isAnonymous) {
      return React.createElement(DashboardSSR, { 
        initialState, 
        user 
      });
    }
    // Sin usuario autenticado -> fallback a login
    return React.createElement(LoginSSR);
  }
  
  // Movements SSR (Fase 2 - NUEVO)
  if (route.includes('/movimientos')) {
    if (user && !user.isAnonymous) {
      return React.createElement(MovementsSSR, { 
        initialState, 
        user 
      });
    }
    // Sin usuario autenticado -> fallback a login
    return React.createElement(LoginSSR);
  }
  
  // Vehicles SSR (Fase 3 - NUEVO)
  if (route.includes('/vehiculos')) {
    if (user && !user.isAnonymous) {
      return React.createElement(VehiclesSSR, { 
        initialState, 
        user 
      });
    }
    // Sin usuario autenticado -> fallback a login
    return React.createElement(LoginSSR);
  }
  
  // Inventory SSR (Fase 3 - NUEVO)
  if (route.includes('/inventario')) {
    if (user && !user.isAnonymous) {
      return React.createElement(InventorySSR, { 
        initialState, 
        user 
      });
    }
    // Sin usuario autenticado -> fallback a login
    return React.createElement(LoginSSR);
  }
  
  // Health check SSR
  if (route === '/combustibles/ssr-health') {
    return React.createElement('div', {
      style: {
        padding: '2rem',
        textAlign: 'center',
        fontFamily: 'system-ui, sans-serif'
      }
    },
      React.createElement('h1', null, '✅ SSR Health Check'),
      React.createElement('p', null, `Route: ${route}`),
      React.createElement('p', null, `User: ${user ? 'Authenticated' : 'Anonymous'}`),
      React.createElement('p', null, `Timestamp: ${new Date().toISOString()}`)
    );
  }
  
  // Fallback a login para rutas no reconocidas
  return React.createElement(LoginSSR);
};

export default AppSSRMinimal;
