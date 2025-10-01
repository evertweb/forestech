/**
 * Diagnóstico de red y configuración Cloud SQL
 * Simula condiciones de Firebase Functions
 */

import { execSync } from 'child_process';

async function analyzeCloudSQLConnectivity() {
  console.log('🔍 ANÁLISIS DE CONECTIVIDAD CLOUD SQL');
  console.log('====================================');
  
  const cloudSQLIP = '34.61.242.157';
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
    console.log(`   Probando ping a ${cloudSQLIP}...`);
    execSync(`ping -c 2 ${cloudSQLIP}`, { stdio: 'inherit' });
    console.log('   ✅ IP responde a ping');
  } catch (error) {
    console.log('   ❌ IP no responde a ping');
  }
  
  // 3. Verificar puerto específico
  console.log('\n🔌 3. CONECTIVIDAD PUERTO');
  console.log(`   Probando puerto ${port}...`);
  try {
    // Usar timeout más corto para diagnóstico rápido
    execSync(`timeout 10 bash -c "echo > /dev/tcp/${cloudSQLIP}/${port}"`, { stdio: 'inherit' });
    console.log('   ✅ Puerto accesible');
  } catch (error) {
    console.log('   ❌ Puerto no accesible (probable firewall/authorized networks)');
  }
  
  // 4. Información de Firebase Functions IPs
  console.log('\n🔥 4. FIREBASE FUNCTIONS IPS');
  console.log('   Firebase Functions usa IPs dinámicas de Google Cloud:');
  console.log('   - Región us-central1: Múltiples rangos CIDR');
  console.log('   - Para permitir acceso: usar 0.0.0.0/0 O rangos específicos de GCP');
  console.log('   - Documentación: https://cloud.google.com/sql/docs/mysql/authorize-networks');
  
  // 5. Recomendaciones
  console.log('\n💡 5. SOLUCIONES RECOMENDADAS');
  console.log('   Option A: Autorizar todas las IPs (menos seguro):');
  console.log('     - Agregar 0.0.0.0/0 a Authorized Networks');
  console.log('   ');
  console.log('   Option B: Usar Cloud SQL Auth Proxy (más seguro):');
  console.log('     - Configurar Service Account con Cloud SQL Client role');
  console.log('     - Usar biblioteca @google-cloud/sql-connector');
  console.log('   ');
  console.log('   Option C: VPC + Private IP (más seguro):');
  console.log('     - Configurar Cloud SQL con IP privada');
  console.log('     - Usar VPC Connector para Firebase Functions');
  
  // 6. Comando gcloud para diagnóstico
  console.log('\n⚙️ 6. COMANDOS DIAGNÓSTICO GCLOUD');
  console.log('   Para verificar configuración actual:');
  console.log('   gcloud sql instances describe oil');
  console.log('   ');
  console.log('   Para agregar IP autorizada (temporal):');
  console.log('   gcloud sql instances patch oil \\');
  console.log('     --authorized-networks=200.189.27.77');
  console.log('   ');
  console.log('   Para permitir todas las IPs (SOLO PARA TESTING):');
  console.log('   gcloud sql instances patch oil \\');
  console.log('     --authorized-networks=0.0.0.0/0');
}

// Ejecutar análisis
analyzeCloudSQLConnectivity().catch(console.error);