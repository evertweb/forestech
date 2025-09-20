/**
 * Configuración de conexión Azure SQL Server
 * Forestech Combustibles App
 */

const sqlConfig = {
  server: process.env.VITE_AZURE_SQL_SERVER || 'oilforestech.database.windows.net',
  port: 1433,
  database: process.env.VITE_AZURE_SQL_DATABASE || 'forestechCombus',
  user: process.env.VITE_AZURE_SQL_USER || 'oil',
  password: process.env.VITE_AZURE_SQL_PASSWORD || '271202ev',
  options: {
    encrypt: true, // Requerido para Azure
    trustServerCertificate: false,
    enableArithAbort: true,
    connectionTimeout: 30000,
    requestTimeout: 30000,
    cancelTimeout: 5000,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000,
      acquireTimeoutMillis: 30000,
      createTimeoutMillis: 30000,
      destroyTimeoutMillis: 5000,
      reapIntervalMillis: 1000,
      createRetryIntervalMillis: 200,
    },
  },
  // Configuración adicional para debugging
  debug: {
    packet: process.env.NODE_ENV === 'development',
    data: process.env.NODE_ENV === 'development',
    payload: process.env.NODE_ENV === 'development',
    token: false,
    log: process.env.NODE_ENV === 'development',
  },
};

export default sqlConfig;