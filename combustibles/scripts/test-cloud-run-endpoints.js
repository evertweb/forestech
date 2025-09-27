#!/usr/bin/env node

/**
 * Script de testing para endpoints Cloud Run
 * Prueba los endpoints SQL con tokens reales de Firebase Auth
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

// Endpoints a probar
const ENDPOINTS_TO_TEST = [
  { name: 'Health Check', endpoint: '/health', method: 'GET', requiresAuth: false },
  { name: 'Test Endpoint', endpoint: '/test', method: 'GET', requiresAuth: false },
  { name: 'Get All Products', endpoint: '/sqlGetAllProducts', method: 'POST', requiresAuth: true },
  { name: 'Get All Movements', endpoint: '/sqlGetAllMovements', method: 'POST', requiresAuth: true },
  { name: 'Get All Vehicles', endpoint: '/sqlGetAllVehicles', method: 'POST', requiresAuth: true },
  { name: 'Get Inventory', endpoint: '/sqlGetAllInventory', method: 'POST', requiresAuth: true },
];

class CloudRunTester {
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

    // Agregar token si requiere autenticación
    if (endpoint.includes('/sql') || endpoint.includes('/health') === false) {
      if (!this.token) {
        throw new Error('Token no disponible');
      }
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
   * Probar un endpoint específico
   */
  async testEndpoint(endpointConfig) {
    const { name, endpoint, method, requiresAuth } = endpointConfig;

    console.log(`\n🧪 Probando: ${name}`);
    console.log('─'.repeat(50));

    try {
      // Si requiere auth y no tenemos token, intentar obtenerlo
      if (requiresAuth && !this.token) {
        const credentials = await this.promptCredentials();
        await this.getFirebaseToken(credentials.email, credentials.password);
      }

      const result = await this.makeRequest(endpoint, method, requiresAuth ? { filters: {} } : {});

      if (result.success) {
        console.log('✅ Éxito');
        console.log(`📊 Status: ${result.status}`);

        if (result.data) {
          if (typeof result.data === 'object') {
            console.log('📦 Respuesta:', JSON.stringify(result.data, null, 2));
          } else {
            console.log('📦 Respuesta:', result.data);
          }
        }
      } else {
        console.log('❌ Error');
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
    console.log('🚀 Iniciando pruebas de Cloud Run endpoints');
    console.log('═'.repeat(60));
    console.log(`🎯 URL: ${CLOUD_RUN_URL}`);
    console.log(`🔥 Firebase Project: ${firebaseConfig.projectId}`);
    console.log('═'.repeat(60));

    for (const endpointConfig of ENDPOINTS_TO_TEST) {
      await this.testEndpoint(endpointConfig);
      // Pequeña pausa entre pruebas
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('\n🏁 Pruebas completadas');
    console.log('═'.repeat(60));
  }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  const tester = new CloudRunTester();
  tester.runAllTests().catch(console.error);
}

export default CloudRunTester;