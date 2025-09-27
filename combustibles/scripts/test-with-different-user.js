#!/usr/bin/env node

/**
 * Script para probar con diferentes usuarios Firebase
 * Forestech Combustibles App
 */

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
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

const CLOUD_RUN_URL = 'https://forestech-sql-service-851382130132.us-central1.run.app';

class FirebaseUserTester {
  constructor() {
    this.app = initializeApp(firebaseConfig);
    this.auth = getAuth(this.app);
  }

  /**
   * Crear usuario de prueba
   */
  async createTestUser(email, password) {
    try {
      console.log(`👤 Creando usuario de prueba: ${email}`);
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);

      console.log('✅ Usuario creado exitosamente');
      return userCredential;
    } catch (error) {
      console.error('❌ Error creando usuario:', error.message);
      throw error;
    }
  }

  /**
   * Hacer login con usuario existente
   */
  async loginUser(email, password) {
    try {
      console.log(`🔐 Iniciando sesión: ${email}`);
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const token = await userCredential.user.getIdToken();

      console.log('✅ Login exitoso');
      console.log('🔑 Token:', token.substring(0, 50) + '...');
      return { userCredential, token };
    } catch (error) {
      console.error('❌ Error en login:', error.message);
      throw error;
    }
  }

  /**
   * Probar endpoint con token
   */
  async testEndpoint(token, endpoint = '/sqlGetAllProducts') {
    const url = `${CLOUD_RUN_URL}${endpoint}`;

    try {
      console.log(`🌐 Probando: ${endpoint}`);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ filters: {} }),
      });

      const responseText = await response.text();

      if (response.ok) {
        console.log('✅ Éxito');
        console.log(`📊 Status: ${response.status}`);
        try {
          const data = JSON.parse(responseText);
          console.log('📦 Respuesta:', JSON.stringify(data, null, 2));
        } catch (_e) {
          console.log('📦 Respuesta:', responseText);
        }
      } else {
        console.log('❌ Error');
        console.log(`📊 Status: ${response.status}`);
        console.log('💥 Error:', responseText);
      }

      return response.ok;
    } catch (error) {
      console.log('❌ Error de conexión:', error.message);
      return false;
    }
  }

  /**
   * Ejecutar pruebas
   */
  async runTests() {
    console.log('🚀 Testing Firebase Auth con Cloud Run');
    console.log('═'.repeat(50));

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    try {
      // Opción 1: Crear usuario de prueba
      console.log('\n📋 Opciones:');
      console.log('1. Crear usuario de prueba');
      console.log('2. Usar usuario existente');

      const option = await this.askQuestion(rl, 'Elige una opción (1 o 2): ');

      let token;

      if (option === '1') {
        const email = await this.askQuestion(rl, 'Email del usuario de prueba: ');
        const password = await this.askQuestion(rl, 'Password del usuario de prueba: ');

        await this.createTestUser(email, password);
        const result = await this.loginUser(email, password);
        token = result.token;
      } else {
        const email = await this.askQuestion(rl, 'Email: ');
        const password = await this.askQuestion(rl, 'Password: ');

        const result = await this.loginUser(email, password);
        token = result.token;
      }

      // Probar endpoints
      console.log('\n🧪 Probando endpoints...');
      await this.testEndpoint(token, '/sqlGetAllProducts');
      await this.testEndpoint(token, '/sqlGetAllMovements');
      await this.testEndpoint(token, '/sqlGetAllVehicles');

    } catch (error) {
      console.error('❌ Error general:', error);
    } finally {
      rl.close();
    }
  }

  /**
   * Helper para preguntas
   */
  askQuestion(rl, question) {
    return new Promise((resolve) => {
      rl.question(question, resolve);
    });
  }
}

// Ejecutar
if (import.meta.url === `file://${process.argv[1]}`) {
  const tester = new FirebaseUserTester();
  tester.runTests().catch(console.error);
}