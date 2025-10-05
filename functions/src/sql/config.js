export const sqlConfig = {
  server: process.env.SQL_SERVER || '24.199.89.134',
  database: process.env.SQL_DATABASE || 'DBforestech',
  user: process.env.SQL_USER || 'SA',
  password: process.env.SQL_PASSWORD || 'Forestech2024!SecureDB',
  options: {
    encrypt: true,
    trustServerCertificate: true, // Requerido por certificado autofirmado en el droplet
    enableArithAbort: true,
  },
  port: 1433,
};