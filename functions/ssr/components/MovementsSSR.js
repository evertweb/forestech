import React from 'react';

/**
 * Componente Movements SSR - Fase 2 del roadmap
 * Renderiza la vista de movimientos de combustible con tabla optimizada para SSR
 */
const MovementsSSR = ({ initialState, user }) => {
  const { data = {} } = initialState || {};
  const { movements = [], pagination = {} } = data;

  return React.createElement('div', {
    className: 'movements-ssr-container',
    style: { minHeight: '100vh', background: '#f9fafb' }
  },
    // Header consistente con Dashboard
    React.createElement('header', {
      className: 'movements-header',
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
        }, '📊'),
        React.createElement('h1', {
          style: { 
            margin: 0, 
            fontSize: '1.5rem',
            fontWeight: '600'
          }
        }, 'Movimientos - Forestech')
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

    // Main content
    React.createElement('main', {
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
          }, 'Movimientos')
        )
      ),

      // Summary header
      React.createElement('div', {
        className: 'movements-header-info',
        style: {
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)'
        }
      },
        React.createElement('div', {
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px'
          }
        },
          React.createElement('h1', {
            style: { 
              margin: 0, 
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#111827'
            }
          }, 'Movimientos de Combustible'),
          React.createElement('div', {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: '#f0fdf4',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #bbf7d0'
            }
          },
            React.createElement('span', {
              style: { fontSize: '1rem' }
            }, '🔄'),
            React.createElement('span', {
              style: {
                fontSize: '0.875rem',
                color: '#166534',
                fontWeight: '500'
              }
            }, 'Datos en tiempo real')
          )
        ),
        React.createElement('p', {
          style: { 
            margin: 0, 
            color: '#6b7280',
            fontSize: '0.9rem'
          }
        }, `${pagination.total || 0} registros encontrados - Mostrando los más recientes`)
      ),

      // Movements Table SSR
      React.createElement('div', {
        className: 'movements-table-container',
        style: {
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)'
        }
      },
        React.createElement('table', {
          style: { 
            width: '100%', 
            borderCollapse: 'collapse',
            fontSize: '0.875rem'
          }
        },
          // Header
          React.createElement('thead', null,
            React.createElement('tr', {
              style: { 
                background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
                borderBottom: '2px solid #e5e7eb'
              }
            },
              React.createElement('th', {
                style: { 
                  padding: '16px 12px', 
                  textAlign: 'left', 
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }
              }, 'Fecha'),
              React.createElement('th', {
                style: { 
                  padding: '16px 12px', 
                  textAlign: 'left', 
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }
              }, 'Tipo'),
              React.createElement('th', {
                style: { 
                  padding: '16px 12px', 
                  textAlign: 'left', 
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }
              }, 'Combustible'),
              React.createElement('th', {
                style: { 
                  padding: '16px 12px', 
                  textAlign: 'left', 
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }
              }, 'Vehículo'),
              React.createElement('th', {
                style: { 
                  padding: '16px 12px', 
                  textAlign: 'right', 
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }
              }, 'Cantidad')
            )
          ),

          // Body
          React.createElement('tbody', null,
            ...movements.slice(0, 10).map((movement, i) =>
              React.createElement('tr', {
                key: movement.id || i,
                style: { 
                  borderTop: i > 0 ? '1px solid #f3f4f6' : 'none',
                  transition: 'background-color 0.15s ease'
                }
              },
                React.createElement('td', {
                  style: { 
                    padding: '16px 12px',
                    color: '#374151',
                    fontWeight: '500'
                  }
                },
                  React.createElement('div', {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px'
                    }
                  },
                    React.createElement('span', {
                      style: { fontWeight: '600' }
                    }, new Date(movement.date).toLocaleDateString('es-CO')),
                    React.createElement('span', {
                      style: { 
                        fontSize: '0.75rem',
                        color: '#6b7280'
                      }
                    }, new Date(movement.date).toLocaleTimeString('es-CO', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    }))
                  )
                ),
                React.createElement('td', {
                  style: { padding: '16px 12px' }
                },
                  React.createElement('span', {
                    style: {
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      textTransform: 'capitalize',
                      background: movement.type === 'entrada' ? '#dcfce7' : '#fef3c7',
                      color: movement.type === 'entrada' ? '#166534' : '#92400e',
                      border: `1px solid ${movement.type === 'entrada' ? '#bbf7d0' : '#fde68a'}`
                    }
                  }, movement.type)
                ),
                React.createElement('td', {
                  style: { 
                    padding: '16px 12px',
                    color: '#374151',
                    fontWeight: '500',
                    textTransform: 'capitalize'
                  }
                }, movement.fuel),
                React.createElement('td', {
                  style: { 
                    padding: '16px 12px',
                    color: '#374151'
                  }
                }, movement.vehicle || 'N/A'),
                React.createElement('td', {
                  style: { 
                    padding: '16px 12px', 
                    textAlign: 'right',
                    fontWeight: '600',
                    color: '#111827'
                  }
                },
                  React.createElement('div', {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      gap: '2px'
                    }
                  },
                    React.createElement('span', null, `${movement.quantity.toLocaleString()} L`),
                    React.createElement('span', {
                      style: {
                        fontSize: '0.75rem',
                        color: '#6b7280'
                      }
                    }, movement.type === 'entrada' ? '+' : '-')
                  )
                )
              )
            ),
            
            // Fila vacía si no hay movimientos
            movements.length === 0 && React.createElement('tr', null,
              React.createElement('td', {
                colSpan: 5,
                style: {
                  padding: '48px 24px',
                  textAlign: 'center',
                  color: '#6b7280'
                }
              },
                React.createElement('div', {
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px'
                  }
                },
                  React.createElement('div', {
                    style: { fontSize: '3rem', opacity: 0.5 }
                  }, '📊'),
                  React.createElement('p', {
                    style: { margin: 0, fontSize: '1rem', fontWeight: '500' }
                  }, 'No hay movimientos registrados'),
                  React.createElement('p', {
                    style: { margin: 0, fontSize: '0.875rem' }
                  }, 'Los movimientos aparecerán aquí cuando se registren')
                )
              )
            )
          )
        )
      ),

      // Info adicional
      React.createElement('div', {
        style: {
          marginTop: '24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px'
        }
      },
        // Filtros info
        React.createElement('div', {
          style: {
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '16px'
          }
        },
          React.createElement('h3', {
            style: {
              margin: '0 0 8px 0',
              fontSize: '1rem',
              fontWeight: '600',
              color: '#111827'
            }
          }, '🔍 Filtros Disponibles'),
          React.createElement('p', {
            style: {
              margin: 0,
              fontSize: '0.875rem',
              color: '#6b7280'
            }
          }, 'Filtros por fecha, tipo, combustible y vehículo se cargarán con la versión interactiva.')
        ),

        // Exportar info
        React.createElement('div', {
          style: {
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '16px'
          }
        },
          React.createElement('h3', {
            style: {
              margin: '0 0 8px 0',
              fontSize: '1rem',
              fontWeight: '600',
              color: '#111827'
            }
          }, '📤 Exportar Datos'),
          React.createElement('p', {
            style: {
              margin: 0,
              fontSize: '0.875rem',
              color: '#6b7280'
            }
          }, 'Opciones de exportación a Excel y PDF estarán disponibles en la versión completa.')
        )
      ),
      
      // Hydration notice
      React.createElement('div', {
        className: 'ssr-notice',
        style: {
          marginTop: '24px',
          padding: '16px',
          background: '#fef3c7',
          border: '1px solid #f59e0b',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)'
        }
      },
        React.createElement('div', {
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }
        },
          React.createElement('span', {
            style: { fontSize: '1.25rem' }
          }, '⚡'),
          React.createElement('p', {
            style: { 
              margin: 0, 
              color: '#92400e',
              fontSize: '0.875rem',
              fontWeight: '500'
            }
          }, 'Cargando filtros y funcionalidad interactiva...')
        )
      )
    )
  );
};

export default MovementsSSR;