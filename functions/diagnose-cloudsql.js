/**
 * Diagnóstico de red y configuración para SQL Server en DigitalOcean
 * Simula condiciones de Firebase Functions
 */

import { execSync } from 'child_process';

async function analyzeCloudSQLConnectivity() {
  console.log('🔍 ANÁLISIS DE CONECTIVIDAD SQL SERVER (DIGITALOCEAN)');
  console.log('=====================================================');

  const dropletIP = '24.199.89.134';
  const port = 1433;

  // 1. Verificar IP pública local
  console.log('\n📍 1. IP LOCAL');
  try {
    const localIP = execSync('curl -s https://ipinfo.io/ip').toString().trim();
    console.log(`   IP pública local: ${localIP}`);
  } catch (error) {
    console.log(`   ❌ Error obteniendo IP: ${error.message}`);
  }

  // 2. Verificar conectividad IP
  console.log('\n🏓 2. CONECTIVIDAD IP');
  try {
    console.log(`   Probando ping a ${dropletIP}...`);
    execSync(`ping -c 2 ${dropletIP}`, { stdio: 'inherit' });
    console.log('   ✅ IP responde a ping');
  } catch (error) {
    console.log('   ❌ IP no responde a ping');
  }

  // 3. Verificar puerto específico
  console.log('\n🔌 3. CONECTIVIDAD PUERTO');
  console.log(`   Probando puerto ${port}...`);
  try {
    execSync(`timeout 10 bash -c "echo > /dev/tcp/${dropletIP}/${port}"`, { stdio: 'inherit' });
    console.log('   ✅ Puerto accesible');
  } catch (error) {
    console.log('   ❌ Puerto no accesible (verificar firewall o reglas inbound)');
  }

  // 4. Información de Firebase Functions IPs
  console.log('\n🔥 4. FIREBASE FUNCTIONS IPS');
  console.log('   Firebase Functions usa IPs dinámicas de Google Cloud:');
  console.log('   - Región us-central1: rangos 34.0.0.0/8, 35.0.0.0/8, 104.0.0.0/5 (aprox.)');
  console.log('   - Autoriza estos bloques en el firewall del Droplet para el puerto 1433');
  console.log('   - Documentación DO Firewall: https://docs.digitalocean.com/products/networking/firewalls/');

  // 5. Recomendaciones
  console.log('\n💡 5. SOLUCIONES RECOMENDADAS');
  console.log('   Opción A: Autorizar solo IPs necesarias (recomendado):');
  console.log('     - Añade reglas inbound TCP 1433 para bloques de Firebase Functions');
  console.log('   ');
  console.log('   Opción B: Abrir acceso temporal 0.0.0.0/0 (solo debugging):');
  console.log('     - Recuerda revertir la regla cuando termines las pruebas');
  console.log('   ');
  console.log('   Opción C: Establecer túnel seguro (ideal):');
  console.log('     - Configurar VPN/WireGuard y cerrar exposición pública del puerto 1433');

  // 6. Comandos útiles en DigitalOcean
  console.log('\n⚙️ 6. COMANDOS DIAGNÓSTICO DIGITALOCEAN');
  console.log('   Listar firewalls: doctl compute firewall list');
  console.log('   ');
  console.log('   Agregar regla temporal:');
  console.log('   doctl compute firewall add-rules \\');
  console.log('     --inbound-protocol tcp --inbound-ports 1433 \\');
  console.log('     --inbound-sources-addresses 0.0.0.0/0 <FIREWALL_ID>');
  console.log('   ');
  console.log('   Monitorear SQL Server: sudo journalctl -u mssql-server -f');
}

// Ejecutar análisis
analyzeCloudSQLConnectivity().catch(console.error);