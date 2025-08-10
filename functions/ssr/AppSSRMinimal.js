import React from 'react';

// Componente SSR minimalista para login (sin JSX, sin router)
const LoginSSR = () => {
  return React.createElement('div', {
    style: {
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #eff6ff, #e0e7ff)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }
  }, 
    React.createElement('div', {
      style: {
        maxWidth: '28rem',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        padding: '2rem'
      }
    },
      React.createElement('div', {
        style: { textAlign: 'center', marginBottom: '2rem' }
      },
        React.createElement('h1', {
          style: {
            fontSize: '1.875rem',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '0.5rem'
          }
        }, 'Combustibles'),
        React.createElement('p', {
          style: {
            color: '#6b7280'
          }
        }, 'Sistema de Gestión de Inventario')
      ),
      React.createElement('div', {
        style: { marginBottom: '1.5rem' }
      },
        React.createElement('div', {
          style: {
            textAlign: 'center',
            padding: '1.5rem',
            backgroundColor: '#eff6ff',
            borderRadius: '0.5rem'
          }
        },
          React.createElement('div', {
            style: {
              width: '3rem',
              height: '3rem',
              backgroundColor: '#dbeafe',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }
          }, '🔒'),
          React.createElement('p', {
            style: {
              fontSize: '0.875rem',
              color: '#1e40af',
              marginBottom: '0.5rem'
            }
          }, 'Cargando sistema de autenticación...'),
          React.createElement('div', {
            style: {
              width: '100%',
              backgroundColor: '#bfdbfe',
              borderRadius: '9999px',
              height: '0.5rem',
              marginBottom: '0.5rem'
            }
          },
            React.createElement('div', {
              style: {
                backgroundColor: '#2563eb',
                height: '0.5rem',
                borderRadius: '9999px',
                width: '75%',
                animation: 'pulse 2s infinite'
              }
            })
          ),
          React.createElement('p', {
            style: {
              fontSize: '0.75rem',
              color: '#2563eb'
            }
          }, 'SSR activo - Optimizado para rendimiento')
        ),
        React.createElement('div', {
          style: {
            textAlign: 'center',
            fontSize: '0.875rem',
            color: '#6b7280'
          }
        },
          React.createElement('p', null, 'La aplicación se hidratará automáticamente')
        )
      )
    )
  );
};

// Wrapper simple para SSR (sin router por ahora)
const AppSSRMinimal = ({ location }) => {
  return React.createElement(LoginSSR);
};

export default AppSSRMinimal;
