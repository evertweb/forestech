const React = require('react');

const VehiclesSSR = ({ initialState, user }) => {
  const { data = {} } = initialState || {};
  const { vehicles = [], summary = {} } = data;

  return React.createElement(
    'div',
    {
      className: 'vehicles-ssr-container',
      style: { minHeight: '100vh', background: '#f8fafc' }
    },
    // Header
    React.createElement(
      'header',
      {
        className: 'vehicles-header',
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
      React.createElement('h1', null, 'Vehículos - Forestech'),
      React.createElement('div', null, `Bienvenido, ${user?.displayName || 'Usuario'}`)
    ),

    // Main content
    React.createElement(
      'main',
      {
        className: 'vehicles-main',
        style: { padding: '24px' },
      },
      
      // Summary Cards
      React.createElement(
        'div',
        {
          className: 'summary-grid',
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '32px',
          },
        },
        createStatCard('Total Vehículos', summary.totalVehicles || 0, '#0070f2'),
        createStatCard('Activos', summary.activeVehicles || 0, '#30914f'),
        createStatCard('Mantenimiento', summary.inMaintenance || 0, '#df6e00'),
        createStatCard('Inactivos', summary.inactiveVehicles || 0, '#dc0d0e')
      ),

      // Vehicles Grid
      React.createElement(
        'div',
        {
          className: 'vehicles-grid',
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px',
            marginBottom: '32px',
          },
        },
        ...vehicles.slice(0, 12).map((vehicle, index) =>
          React.createElement(
            'div',
            {
              key: vehicle.id || `vehicle-${index}`,
              className: 'vehicle-card',
              style: {
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                transition: 'transform 0.2s ease',
              },
            },
            // Vehicle Header
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
                      fontSize: '1.25rem',
                      fontWeight: '700',
                      color: '#111827'
                    },
                  },
                  vehicle.plate || 'N/A'
                ),
                React.createElement(
                  'p',
                  {
                    style: { 
                      margin: 0, 
                      color: '#6b7280',
                      fontSize: '0.875rem'
                    },
                  },
                  `${vehicle.brand || 'N/A'} ${vehicle.model || ''} (${vehicle.year || 'N/A'})`
                )
              ),
              React.createElement(
                'span',
                {
                  style: {
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    background: getStatusColor(vehicle.status).bg,
                    color: getStatusColor(vehicle.status).text,
                  },
                },
                vehicle.status ? vehicle.status.toUpperCase() : 'DESCONOCIDO'
              )
            ),

            // Vehicle Details
            React.createElement(
              'div',
              {
                className: 'vehicle-details',
                style: {
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  marginBottom: '16px',
                },
              },
              React.createElement(
                'div',
                {
                  className: 'detail-item',
                },
                React.createElement(
                  'span',
                  {
                    style: {
                      fontSize: '0.75rem',
                      color: '#9ca3af',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      display: 'block',
                      marginBottom: '4px',
                    },
                  },
                  'Tipo'
                ),
                React.createElement(
                  'span',
                  {
                    style: {
                      fontSize: '0.875rem',
                      color: '#374151',
                      fontWeight: '500',
                    },
                  },
                  vehicle.type || 'N/A'
                )
              ),
              React.createElement(
                'div',
                {
                  className: 'detail-item',
                },
                React.createElement(
                  'span',
                  {
                    style: {
                      fontSize: '0.75rem',
                      color: '#9ca3af',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      display: 'block',
                      marginBottom: '4px',
                    },
                  },
                  'Combustible'
                ),
                React.createElement(
                  'span',
                  {
                    style: {
                      fontSize: '0.875rem',
                      color: '#374151',
                      fontWeight: '500',
                    },
                  },
                  vehicle.fuelType || 'N/A'
                )
              )
            ),

            // Action placeholder
            React.createElement(
              'div',
              {
                className: 'vehicle-actions',
                style: {
                  padding: '12px',
                  background: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                },
              },
              React.createElement(
                'p',
                {
                  style: {
                    margin: 0,
                    fontSize: '0.75rem',
                    color: '#64748b',
                    textAlign: 'center',
                  },
                },
                '🔄 Cargando controles interactivos...'
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
            background: '#fef3c7',
            border: '1px solid #f59e0b',
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
              color: '#92400e',
              fontSize: '0.875rem',
              fontWeight: '500'
            },
          },
          '⚡ Cargando funcionalidad interactiva y filtros avanzados...'
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

function getStatusColor(status) {
  switch (status?.toLowerCase()) {
    case 'activo':
      return { bg: '#dcfce7', text: '#166534' };
    case 'mantenimiento':
      return { bg: '#fef3c7', text: '#92400e' };
    case 'inactivo':
      return { bg: '#fee2e2', text: '#dc2626' };
    default:
      return { bg: '#f3f4f6', text: '#6b7280' };
  }
}

module.exports = VehiclesSSR;