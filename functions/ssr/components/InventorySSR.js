import React from 'react';

const InventorySSR = ({ initialState, user }) => {
  const { data = {} } = initialState || {};
  const { inventory = [], summary = {}, tanks = [] } = data;

  return React.createElement(
    'div',
    {
      className: 'inventory-ssr-container',
      style: { minHeight: '100vh', background: '#f8fafc' }
    },
    // Header
    React.createElement(
      'header',
      {
        className: 'inventory-header',
        style: {
          height: '70px',
          background: 'linear-gradient(135deg, #2d5a27 0%, #1e3a1a 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          color: 'white',
        },
      },
      React.createElement('h1', null, 'Inventario - Forestech'),
      React.createElement('div', null, `Bienvenido, ${user?.displayName || 'Usuario'}`)
    ),

    // Main content
    React.createElement(
      'main',
      {
        className: 'inventory-main',
        style: { padding: '24px' },
      },
      
      // Summary Cards
      React.createElement(
        'div',
        {
          className: 'inventory-summary-grid',
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '32px',
          },
        },
        createStatCard('Total Combustible', `${summary.totalLiters || 0} L`, '#0070f2'),
        createStatCard('Tipos de Combustible', summary.fuelTypes || 0, '#30914f'),
        createStatCard('Tanques Activos', summary.activeTanks || 0, '#df6e00'),
        createStatCard('Stock Crítico', summary.lowStockItems || 0, '#dc0d0e')
      ),

      // Tanks Overview
      React.createElement(
        'div',
        {
          className: 'tanks-section',
          style: {
            marginBottom: '32px',
          },
        },
        React.createElement(
          'h2',
          {
            style: {
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '20px',
              borderBottom: '2px solid #e5e7eb',
              paddingBottom: '8px',
            },
          },
          'Estado de Tanques'
        ),
        React.createElement(
          'div',
          {
            className: 'tanks-grid',
            style: {
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px',
            },
          },
          ...tanks.slice(0, 6).map((tank, index) =>
            React.createElement(
              'div',
              {
                key: tank.id || `tank-${index}`,
                className: 'tank-card',
                style: {
                  background: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                },
              },
              React.createElement(
                'div',
                {
                  style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '16px',
                  },
                },
                React.createElement(
                  'div',
                  null,
                  React.createElement(
                    'h3',
                    {
                      style: {
                        margin: '0 0 4px 0',
                        fontSize: '1.125rem',
                        fontWeight: '600',
                        color: '#111827',
                      },
                    },
                    tank.name || `Tanque ${index + 1}`
                  ),
                  React.createElement(
                    'p',
                    {
                      style: {
                        margin: 0,
                        color: '#6b7280',
                        fontSize: '0.875rem',
                      },
                    },
                    tank.fuelType || 'Combustible desconocido'
                  )
                ),
                React.createElement(
                  'span',
                  {
                    style: {
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      background: getTankStatusColor(tank.currentLevel, tank.capacity).bg,
                      color: getTankStatusColor(tank.currentLevel, tank.capacity).text,
                    },
                  },
                  getTankStatusText(tank.currentLevel, tank.capacity)
                )
              ),
              
              // Tank level visualization
              React.createElement(
                'div',
                {
                  className: 'tank-level',
                  style: {
                    marginBottom: '12px',
                  },
                },
                React.createElement(
                  'div',
                  {
                    style: {
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px',
                    },
                  },
                  React.createElement(
                    'span',
                    {
                      style: {
                        fontSize: '0.75rem',
                        color: '#9ca3af',
                        textTransform: 'uppercase',
                      },
                    },
                    'Nivel Actual'
                  ),
                  React.createElement(
                    'span',
                    {
                      style: {
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#374151',
                      },
                    },
                    `${tank.currentLevel || 0}L / ${tank.capacity || 0}L`
                  )
                ),
                React.createElement(
                  'div',
                  {
                    style: {
                      width: '100%',
                      height: '8px',
                      backgroundColor: '#e5e7eb',
                      borderRadius: '4px',
                      overflow: 'hidden',
                    },
                  },
                  React.createElement(
                    'div',
                    {
                      style: {
                        width: `${Math.min(100, (tank.currentLevel / tank.capacity) * 100) || 0}%`,
                        height: '100%',
                        backgroundColor: getTankLevelColor(tank.currentLevel, tank.capacity),
                        borderRadius: '4px',
                        transition: 'width 0.3s ease',
                      },
                    }
                  )
                ),
                React.createElement(
                  'p',
                  {
                    style: {
                      margin: '8px 0 0 0',
                      fontSize: '0.75rem',
                      color: '#6b7280',
                    },
                  },
                  `${Math.round((tank.currentLevel / tank.capacity) * 100) || 0}% de capacidad`
                )
              )
            )
          )
        )
      ),

      // Inventory Items Table
      React.createElement(
        'div',
        {
          className: 'inventory-table-section',
          style: {
            marginBottom: '32px',
          },
        },
        React.createElement(
          'h2',
          {
            style: {
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '20px',
              borderBottom: '2px solid #e5e7eb',
              paddingBottom: '8px',
            },
          },
          'Detalle de Inventario'
        ),
        React.createElement(
          'div',
          {
            className: 'inventory-table-container',
            style: {
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              overflow: 'hidden',
            },
          },
          React.createElement(
            'table',
            {
              style: { width: '100%', borderCollapse: 'collapse' },
            },
            // Header
            React.createElement(
              'thead',
              null,
              React.createElement(
                'tr',
                {
                  style: { background: '#f9fafb' },
                },
                React.createElement(
                  'th',
                  {
                    style: { 
                      padding: '16px 12px', 
                      textAlign: 'left', 
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      color: '#374151'
                    },
                  },
                  'Combustible'
                ),
                React.createElement(
                  'th',
                  {
                    style: { 
                      padding: '16px 12px', 
                      textAlign: 'right', 
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      color: '#374151'
                    },
                  },
                  'Stock Actual'
                ),
                React.createElement(
                  'th',
                  {
                    style: { 
                      padding: '16px 12px', 
                      textAlign: 'right', 
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      color: '#374151'
                    },
                  },
                  'Stock Mínimo'
                ),
                React.createElement(
                  'th',
                  {
                    style: { 
                      padding: '16px 12px', 
                      textAlign: 'center', 
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      color: '#374151'
                    },
                  },
                  'Estado'
                )
              )
            ),

            // Body
            React.createElement(
              'tbody',
              null,
              ...inventory.slice(0, 8).map((item, i) =>
                React.createElement(
                  'tr',
                  {
                    key: item.id || `item-${i}`,
                    style: { 
                      borderTop: i > 0 ? '1px solid #f3f4f6' : 'none',
                      '&:hover': { background: '#f8fafc' }
                    },
                  },
                  React.createElement(
                    'td',
                    {
                      style: { 
                        padding: '16px 12px',
                        fontSize: '0.875rem',
                        color: '#111827',
                        fontWeight: '500'
                      },
                    },
                    item.name || 'N/A'
                  ),
                  React.createElement(
                    'td',
                    {
                      style: { 
                        padding: '16px 12px', 
                        textAlign: 'right',
                        fontSize: '0.875rem',
                        color: '#374151',
                        fontWeight: '600'
                      },
                    },
                    `${item.currentStock || 0} L`
                  ),
                  React.createElement(
                    'td',
                    {
                      style: { 
                        padding: '16px 12px', 
                        textAlign: 'right',
                        fontSize: '0.875rem',
                        color: '#6b7280'
                      },
                    },
                    `${item.minStock || 0} L`
                  ),
                  React.createElement(
                    'td',
                    {
                      style: { 
                        padding: '16px 12px', 
                        textAlign: 'center'
                      },
                    },
                    React.createElement(
                      'span',
                      {
                        style: {
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          ...getStockStatusStyle(item.currentStock, item.minStock)
                        },
                      },
                      getStockStatusText(item.currentStock, item.minStock)
                    )
                  )
                )
              )
            )
          )
        )
      ),

      // Hydration notice
      React.createElement(
        'div',
        {
          className: 'ssr-hydration-notice',
          style: {
            padding: '20px',
            background: '#ecfdf5',
            border: '1px solid #10b981',
            borderRadius: '12px',
            textAlign: 'center',
            marginTop: '24px',
          },
        },
        React.createElement(
          'p',
          {
            style: { 
              margin: 0, 
              color: '#047857',
              fontSize: '0.875rem',
              fontWeight: '500'
            },
          },
          '🔄 Cargando herramientas de gestión de inventario y reportes...'
        )
      )
    )
  );
};

function createStatCard(title, value, color) {
  return React.createElement(
    'div',
    {
      className: 'stat-card',
      style: {
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '20px',
        position: 'relative',
        minHeight: '120px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
      },
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
        borderRadius: '12px 0 0 12px',
      },
    }),

    // Content
    React.createElement(
      'div',
      {
        style: {
          marginLeft: '8px',
        }
      },
      React.createElement(
        'h3',
        {
          style: {
            fontSize: '0.875rem',
            color: '#6b7280',
            margin: '0 0 8px 0',
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          },
        },
        title
      ),
      React.createElement(
        'p',
        {
          style: {
            fontSize: '2.25rem',
            color: '#111827',
            margin: 0,
            fontWeight: '700',
            lineHeight: 1.1,
          },
        },
        value.toString()
      )
    )
  );
}

function getTankStatusColor(currentLevel, capacity) {
  const percentage = (currentLevel / capacity) * 100;
  if (percentage < 20) return { bg: '#fee2e2', text: '#dc2626' };
  if (percentage < 50) return { bg: '#fef3c7', text: '#92400e' };
  return { bg: '#dcfce7', text: '#166534' };
}

function getTankStatusText(currentLevel, capacity) {
  const percentage = (currentLevel / capacity) * 100;
  if (percentage < 20) return 'CRÍTICO';
  if (percentage < 50) return 'BAJO';
  return 'NORMAL';
}

function getTankLevelColor(currentLevel, capacity) {
  const percentage = (currentLevel / capacity) * 100;
  if (percentage < 20) return '#dc2626';
  if (percentage < 50) return '#f59e0b';
  return '#10b981';
}

function getStockStatusStyle(currentStock, minStock) {
  if (currentStock <= minStock) {
    return { background: '#fee2e2', color: '#dc2626' };
  }
  if (currentStock <= minStock * 1.5) {
    return { background: '#fef3c7', color: '#92400e' };
  }
  return { background: '#dcfce7', color: '#166534' };
}

function getStockStatusText(currentStock, minStock) {
  if (currentStock <= minStock) return 'CRÍTICO';
  if (currentStock <= minStock * 1.5) return 'BAJO';
  return 'OK';
}

export default InventorySSR;