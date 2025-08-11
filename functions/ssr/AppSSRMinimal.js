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

// Componente SSR para movements
const MovementsSSR = ({ user, data }) => {
  const movements = data?.movements || [];
  const movementsCount = movements.length;
  
  return React.createElement('div', {
    style: {
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #fef3c7, #fed7aa)',
      padding: '1rem'
    }
  },
    React.createElement('div', {
      style: {
        maxWidth: '64rem',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        padding: '2rem'
      }
    },
      React.createElement('div', {
        style: { 
          borderBottom: '1px solid #e5e7eb',
          paddingBottom: '1rem',
          marginBottom: '2rem'
        }
      },
        React.createElement('h1', {
          style: {
            fontSize: '1.875rem',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '0.5rem'
          }
        }, `Movimientos (${movementsCount})`),
        React.createElement('p', {
          style: { color: '#6b7280' }
        }, user ? `Bienvenido, ${user.email}` : 'Cargando datos de movimientos...'),
        React.createElement('div', {
          style: {
            display: 'inline-block',
            backgroundColor: '#dcfce7',
            color: '#166534',
            fontSize: '0.75rem',
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            marginTop: '0.5rem'
          }
        }, 'SSR Activo')
      ),
      
      // Lista de movimientos
      React.createElement('div', {
        style: { marginBottom: '2rem' }
      },
        movements.length > 0 ? 
          movements.map((movement, index) =>
            React.createElement('div', {
              key: movement.id,
              style: {
                padding: '1rem',
                backgroundColor: index % 2 === 0 ? '#f9fafb' : 'white',
                borderLeft: `4px solid ${movement.type === 'entrada' ? '#10b981' : '#ef4444'}`,
                marginBottom: '0.5rem',
                borderRadius: '0.25rem'
              }
            },
              React.createElement('div', {
                style: { 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '0.5rem'
                }
              },
                React.createElement('span', {
                  style: {
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: movement.type === 'entrada' ? '#065f46' : '#991b1b'
                  }
                }, `${movement.type.toUpperCase()} - ${movement.quantity}L`),
                React.createElement('span', {
                  style: {
                    fontSize: '0.875rem',
                    color: '#6b7280'
                  }
                }, new Date(movement.date).toLocaleDateString('es-ES'))
              ),
              React.createElement('div', {
                style: {
                  fontSize: '0.875rem',
                  color: '#374151'
                }
              },
                React.createElement('span', null, `${movement.fuel} • ${movement.vehicle}`)
              )
            )
          ) :
          React.createElement('div', {
            style: {
              textAlign: 'center',
              padding: '3rem',
              backgroundColor: '#f9fafb',
              borderRadius: '0.5rem'
            }
          },
            React.createElement('p', {
              style: { color: '#6b7280', marginBottom: '1rem' }
            }, 'No hay movimientos registrados'),
            React.createElement('div', {
              style: {
                fontSize: '0.75rem',
                color: '#9ca3af'
              }
            }, 'La hydration cargará los datos dinámicos')
          )
      ),
      
      // Footer con info de SSR
      React.createElement('div', {
        style: {
          borderTop: '1px solid #e5e7eb',
          paddingTop: '1rem',
          fontSize: '0.75rem',
          color: '#6b7280',
          textAlign: 'center'
        }
      },
        React.createElement('p', null, 'Datos iniciales cargados via SSR • La hydration agregará interactividad')
      )
    )
  );
};

// Wrapper con router básico para SSR
const AppSSRMinimal = ({ location, initialState = {}, user = null }) => {
  const route = location || '/combustibles/';
  const data = initialState?.data || {};
  
  // Determinar qué componente renderizar según la ruta
  if (route.includes('/movements')) {
    return React.createElement(MovementsSSR, { user, data });
  }
  
  // Por defecto, mostrar login
  return React.createElement(LoginSSR);
};

export default AppSSRMinimal;
