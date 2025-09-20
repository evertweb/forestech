import { testConnection } from './testConnection.js';

async function runTest() {
  console.log('🧪 Prueba local de conexión SQL...');
  const result = await testConnection();
  console.log('Resultado:', result);
}

runTest().catch(console.error);