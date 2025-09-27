#!/usr/bin/env node

/**
 * Script para probar la inicialización de base de datos usando Cloud Run
 * Ejecuta las consultas SQL para crear todas las tablas necesarias
 * Forestech Combustibles App
 */

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import fetch from 'node-fetch';
import * as readline from 'readline';

// Configuración Firebase
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyCbU834quCY8hjSffRwljJLgZrcxK8i2F4",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "liquidacionapp-62962.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "liquidacionapp-62962",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "liquidacionapp-62962.firebasestorage.app",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "851382130132",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:851382130132:web:eaba38fab449f14fb5b241",
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID || "G-TPNSX0EGB0",
};

// Configuración Cloud Run
const CLOUD_RUN_URL = process.env.CLOUD_RUN_SQL_URL || 'https://forestech-sql-service-851382130132.us-central1.run.app';

class DatabaseInitTester {
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
      rl.question('Email: ', (email) => {
        rl.question('Password: ', (password) => {
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
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const token = await userCredential.user.getIdToken();

      console.log('✅ Token obtenido exitosamente');
      console.log('🔍 Token preview:', token.substring(0, 50) + '...');
      console.log('📅 Token expira:', new Date(userCredential.user.stsTokenManager.expirationTime).toISOString());

      this.token = token;
      return token;
    } catch (error) {
      console.error('❌ Error obteniendo token:', error.message);
      console.error('🔍 Error details:', error);
      throw error;
    }
  }

  /**
   * Hacer petición HTTP a Cloud Run
   */
  async makeRequest(endpoint, method = 'POST', data = {}) {
    const url = `${CLOUD_RUN_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
    };

    // Agregar token si está disponible
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    console.log(`🌐 ${method} ${url}`);
    console.log('🔑 Headers:', Object.keys(headers).join(', '));

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: method === 'POST' ? JSON.stringify(data) : undefined,
      });

      const responseText = await response.text();

      if (!response.ok) {
        console.log(`❌ HTTP ${response.status} - ${responseText}`);
        return {
          success: false,
          status: response.status,
          error: responseText,
          endpoint
        };
      }

      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (_e) {
        responseData = responseText;
      }

      return {
        success: true,
        status: response.status,
        data: responseData,
        endpoint
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        endpoint
      };
    }
  }

  /**
   * Probar inicialización de base de datos
   */
  async testDatabaseInit() {
    console.log('🚀 Iniciando prueba de inicialización de base de datos');
    console.log('═'.repeat(60));
    console.log(`🎯 URL: ${CLOUD_RUN_URL}`);
    console.log(`🔥 Firebase Project: ${firebaseConfig.projectId}`);
    console.log('═'.repeat(60));

    try {
      // Obtener token si no lo tenemos
      if (!this.token) {
        const credentials = await this.promptCredentials();
        await this.getFirebaseToken(credentials.email, credentials.password);
      }

      // Probar inicialización de base de datos
      console.log('\n🗄️  Probando inicialización de base de datos...');
      console.log('─'.repeat(50));

      const result = await this.makeRequest('/sqlInitializeDatabase', 'POST', {});

      if (result.success) {
        console.log('✅ Inicialización exitosa');
        console.log(`📊 Status: ${result.status}`);

        if (result.data) {
          console.log('📦 Respuesta:', JSON.stringify(result.data, null, 2));
        }
      } else {
        console.log('❌ Error en inicialización');
        console.log(`📊 Status: ${result.status || 'Unknown'}`);
        console.log('💥 Error:', result.error);
      }

    } catch (error) {
      console.log('❌ Error inesperado:', error.message);
    }
  }

  /**
   * Probar recreación forzada de tablas
   */
  async testForceRecreate() {
    console.log('\n⚠️  Probando recreación forzada de tablas...');
    console.log('─'.repeat(50));

    try {
      // Obtener token si no lo tenemos
      if (!this.token) {
        const credentials = await this.promptCredentials();
        await this.getFirebaseToken(credentials.email, credentials.password);
      }

      const result = await this.makeRequest('/sqlForceRecreateTables', 'POST', {});

      if (result.success) {
        console.log('✅ Recreación exitosa');
        console.log(`📊 Status: ${result.status}`);

        if (result.data) {
          console.log('📦 Respuesta:', JSON.stringify(result.data, null, 2));
        }
      } else {
        console.log('❌ Error en recreación');
        console.log(`📊 Status: ${result.status || 'Unknown'}`);
        console.log('💥 Error:', result.error);
      }

    } catch (error) {
      console.log('❌ Error inesperado:', error.message);
    }
  }

  /**
   * Ejecutar todas las pruebas
   */
  async runAllTests() {
    await this.testDatabaseInit();
    await this.testForceRecreate();

    console.log('\n🏁 Pruebas de inicialización completadas');
    console.log('═'.repeat(60));
  }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  const tester = new DatabaseInitTester();
  tester.runAllTests().catch(console.error);
}

export default DatabaseInitTester;