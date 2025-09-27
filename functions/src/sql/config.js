export const sqlConfig = {
  server: process.env.SQL_SERVER || 'oilforestech.privatelink.database.windows.net',
  database: process.env.SQL_DATABASE || 'forestechCombus',
  user: process.env.SQL_USER || 'oil',
  password: process.env.SQL_PASSWORD || '271202Ev.',
  options: {
    encrypt: true,
    trustServerCertificate: true, // Necesario para Private Link
    enableArithAbort: true,
  },
  port: 1433,
};