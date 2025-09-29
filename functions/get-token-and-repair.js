#!/usr/bin/env node

/**
 * Script para obtener token Firebase y ejecutar auto-reparación
 * Forestech Combustibles - Database Auto-Repair
 */

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import fetch from 'node-fetch';
import * as readline from 'readline';

// Configuración Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCbU834quCY8hjSffRwljJLgZrcxK8i2F4",
  authDomain: "liquidacionapp-62962.firebaseapp.com",
  projectId: "liquidacionapp-62962",
  storageBucket: "liquidacionapp-62962.firebasestorage.app",
  messagingSenderId: "851382130132",
  appId: "1:851382130132:web:eaba38fab449f14fb5b241",
  measurementId: "G-TPNSX0EGB0",
};

// URL del servidor local
const SERVER_URL = 'http://localhost:8080';

class DatabaseRepairer {
  constructor() {
    this.app = initializeApp(firebaseConfig);
    this.auth = getAuth(this.app);
    this.token = null;
  }

  /**
   * Solicitar credenciales al usuario
   */
  async promptCredentials() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise((resolve) => {
      rl.question('📧 Email: ', (email) => {
        rl.question('🔐 Password: ', (password) => {
          rl.close();
          resolve({ email, password });
        });
      });
    });
  }

  /**
   * Obtener token de Firebase Auth
   */
  async getFirebaseToken(email, password) {
    try {
      console.log('🔐 Obteniendo token de Firebase Auth...');
      console.log(`👤 Email: ${email}`);
      
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const token = await userCredential.user.getIdToken();

      console.log('✅ Token obtenido exitosamente');
      console.log('🔍 Token preview:', token.substring(0, 50) + '...');
      
      this.token = token;
      return token;
    } catch (error) {
      console.error('❌ Error obteniendo token:', error.message);
      throw error;
    }
  }

  /**
   * Verificar estado del sistema
   */
  async checkSystemStatus() {
    try {
      console.log('\n🔍 Verificando estado del sistema...');
      
      const response = await fetch(`${SERVER_URL}/health/database`);
      const data = await response.json();
      
      console.log('📊 Estado de conexión:', data.connection?.status);
      console.log('📊 Estado del sistema:', data.system?.status);
      console.log('📊 Score del sistema:', data.system?.score);
      
      if (data.system?.issues?.length > 0) {
        console.log('⚠️  Issues encontrados:');
        data.system.issues.forEach(issue => {
          console.log(`   - ${issue.description}`);
        });
      }
      
      return data;
    } catch (error) {
      console.error('❌ Error verificando estado:', error.message);
      throw error;
    }
  }

  /**
   * Ejecutar auto-reparación
   */
  async runAutoRepair() {
    try {
      console.log('\n🔧 Ejecutando auto-reparación...');
      
      const response = await fetch(`${SERVER_URL}/system/autorepair`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        console.log('✅ Auto-reparación exitosa!');
        console.log('📊 Resultado:', JSON.stringify(data, null, 2));
      } else {
        console.log('❌ Auto-reparación falló');
        console.log('📊 Error:', JSON.stringify(data, null, 2));
      }
      
      return data;
    } catch (error) {
      console.error('❌ Error en auto-reparación:', error.message);
      throw error;
    }
  }

  /**
   * Proceso completo
   */
  async run() {
    try {
      console.log('🚀 Iniciando proceso de reparación de base de datos');
      console.log('═'.repeat(60));
      
      // 1. Verificar estado inicial
      await this.checkSystemStatus();
      
      // 2. Obtener credenciales y token
      const credentials = await this.promptCredentials();
      await this.getFirebaseToken(credentials.email, credentials.password);
      
      // 3. Ejecutar auto-reparación
      await this.runAutoRepair();
      
      // 4. Verificar estado final
      console.log('\n📋 Estado final del sistema:');
      await this.checkSystemStatus();
      
      console.log('\n🏁 Proceso completado');
      console.log('═'.repeat(60));
      
    } catch (error) {
      console.error('\n💥 Error en el proceso:', error.message);
      console.log('\n📋 Intentando mostrar estado actual del sistema:');
      try {
        await this.checkSystemStatus();
      } catch (_) {
        console.log('❌ No se pudo obtener estado del sistema');
      }
    }
  }
}

// Ejecutar script
const repairer = new DatabaseRepairer();
repairer.run().then(() => {
  console.log('\n✅ Script terminado');
  process.exit(0);
}).catch((error) => {
  console.error('\n💥 Script falló:', error.message);
  process.exit(1);
});