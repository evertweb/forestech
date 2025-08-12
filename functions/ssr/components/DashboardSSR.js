import React from 'react';

/**
 * Crear tarjeta de estadística para SSR
 */
function createStatCard(title, value, color) {
  return React.createElement('div', {
    className: 'stat-card',
    style: {
      background: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      padding: '24px',
      position: 'relative',
      minHeight: '120px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)'
    }
  },
    // Color indicator
    React.createElement('div', {
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '4px',
        height: '100%',
        background: color,
        borderRadius: '12px 0 0 12px'
      }
    }),
    
    // Content
    React.createElement('div', null,
      React.createElement('h3', {
        style: {
          fontSize: '0.875rem',
          color: '#6b7280',
          margin: '0 0 8px 0',
          fontWeight: '500'
        }
      }, title),
      React.createElement('p', {
        style: {
          fontSize: '2rem',
          color: '#111827',
          margin: 0,
          fontWeight: '700',
          lineHeight: 1.2
        }
      }, value)
    )
  );
}

/**
 * Componente Dashboard SSR - Fase 1 del roadmap
 * Renderiza la vista principal del dashboard con estadísticas básicas
 */
const DashboardSSR = ({ initialState, user }) => {
  const { data = {} } = initialState || {};
  const { stats = {} } = data;
  
  return React.createElement('div', {
    className: 'dashboard-ssr-container',
    style: { minHeight: '100vh', background: '#f9fafb' }
  },
    // Header SSR
    React.createElement('header', {
      className: 'dashboard-header',
      style: { 
        height: '70px',
        background: 'linear-gradient(135deg, #2d5a27 0%, #1e3a1a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        color: 'white',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }
    },
      React.createElement('div', {
        style: { display: 'flex', alignItems: 'center', gap: '16px' }
      },
        React.createElement('div', {
          style: {
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem'
          }
        }, '⛽'),
        React.createElement('h1', {
          style: { 
            margin: 0, 
            fontSize: '1.5rem',
            fontWeight: '600'
          }
        }, 'Dashboard - Forestech')
      ),
      React.createElement('div', {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }
      },
        React.createElement('div', {
          style: {
            width: '32px',
            height: '32px',
            background: '#10b981',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem'
          }
        }, '👤'),
        React.createElement('span', {
          style: { fontSize: '0.9rem' }
        }, `Bienvenido, ${user?.displayName || 'Usuario'}`)
      )
    ),
    
    // Stats Grid SSR
    React.createElement('main', {
      className: 'dashboard-main',
      style: { padding: '24px' }
    },
      // Breadcrumb
      React.createElement('nav', {
        style: { marginBottom: '24px' }
      },
        React.createElement('div', {
          style: {
            fontSize: '0.875rem',
            color: '#6b7280',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }
        },
          React.createElement('span', null, 'Inicio'),
          React.createElement('span', null, '>'),
          React.createElement('span', {
            style: { color: '#111827', fontWeight: '500' }
          }, 'Dashboard')
        )
      ),

      React.createElement('div', {
        className: 'stats-grid',
        style: {
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }
      },
        // Stat Cards
        createStatCard('Vehículos Activos', stats.vehicles || '0', '#0070f2'),
        createStatCard('Litros en Stock', stats.fuel || '0', '#30914f'),
        createStatCard('Movimientos Hoy', stats.movements || '0', '#df6e00'),
        createStatCard('Alertas', stats.alerts || '0', '#dc0d0e')
      ),

      // Quick Actions Grid
      React.createElement('div', {
        style: {
          marginBottom: '32px'
        }
      },
        React.createElement('h2', {
          style: {
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '16px'
          }
        }, 'Acciones Rápidas'),
        React.createElement('div', {
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }
        },
          // Movimientos
          React.createElement('div', {
            style: {
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }
          },
            React.createElement('div', {
              style: {
                fontSize: '2rem',
                marginBottom: '8px'
              }
            }, '📊'),
            React.createElement('h3', {
              style: {
                fontSize: '1rem',
                fontWeight: '600',
                margin: '0 0 4px 0'
              }
            }, 'Ver Movimientos'),
            React.createElement('p', {
              style: {
                fontSize: '0.875rem',
                color: '#6b7280',
                margin: 0
              }
            }, 'Registro de operaciones')
          ),

          // Inventario
          React.createElement('div', {
            style: {
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }
          },
            React.createElement('div', {
              style: {
                fontSize: '2rem',
                marginBottom: '8px'
              }
            }, '📦'),
            React.createElement('h3', {
              style: {
                fontSize: '1rem',
                fontWeight: '600',
                margin: '0 0 4px 0'
              }
            }, 'Inventario'),
            React.createElement('p', {
              style: {
                fontSize: '0.875rem',
                color: '#6b7280',
                margin: 0
              }
            }, 'Stock disponible')
          ),

          // Vehículos
          React.createElement('div', {
            style: {
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }
          },
            React.createElement('div', {
              style: {
                fontSize: '2rem',
                marginBottom: '8px'
              }
            }, '🚛'),
            React.createElement('h3', {
              style: {
                fontSize: '1rem',
                fontWeight: '600',
                margin: '0 0 4px 0'
              }
            }, 'Vehículos'),
            React.createElement('p', {
              style: {
                fontSize: '0.875rem',
                color: '#6b7280',
                margin: 0
              }
            }, 'Gestión de flota')
          ),

          // Reportes
          React.createElement('div', {
            style: {
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }
          },
            React.createElement('div', {
              style: {
                fontSize: '2rem',
                marginBottom: '8px'
              }
            }, '📈'),
            React.createElement('h3', {
              style: {
                fontSize: '1rem',
                fontWeight: '600',
                margin: '0 0 4px 0'
              }
            }, 'Reportes'),
            React.createElement('p', {
              style: {
                fontSize: '0.875rem',
                color: '#6b7280',
                margin: 0
              }
            }, 'Análisis de datos')
          )
        )
      ),
      
      // Loading indicator para hydration
      React.createElement('div', {
        className: 'ssr-hydration-notice',
        style: {
          padding: '16px',
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '8px',
          textAlign: 'center'
        }
      },
        React.createElement('p', {
          style: { 
            margin: 0, 
            color: '#166534',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }
        }, 
          React.createElement('span', null, '🔄'),
          React.createElement('span', null, 'Cargando componentes interactivos...')
        )
      )
    )
  );
};

export default DashboardSSR;