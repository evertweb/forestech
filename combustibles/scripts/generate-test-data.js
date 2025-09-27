#!/usr/bin/env node

/**
 * Script para generar datos de prueba en Azure SQL Server
 * Forestech Combustibles App
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

const CLOUD_RUN_URL = 'https://forestech-sql-service-851382130132.us-central1.run.app';

// Datos de prueba
const SAMPLE_DATA = {
  products: [
    {
      name: "Gasolina Extra",
      code: "GEXT001",
      category: "COMBUSTIBLE",
      unitPrice: 4500,
      currentStock: 1000,
      minThreshold: 200,
      maxCapacity: 2000,
      fuelType: "GASOLINE",
      isActive: true
    },
    {
      name: "Diesel",
      code: "DIES001",
      category: "COMBUSTIBLE",
      unitPrice: 4200,
      currentStock: 1500,
      minThreshold: 300,
      maxCapacity: 3000,
      fuelType: "DIESEL",
      isActive: true
    },
    {
      name: "Aceite Motor",
      code: "ACEM001",
      category: "LUBRICANTE",
      unitPrice: 15000,
      currentStock: 50,
      minThreshold: 10,
      maxCapacity: 100,
      fuelType: "DIESEL",
      isActive: true
    }
  ],

  vehicles: [
    {
      vehicleId: "CAM001",
      name: "Camión Volvo FH16",
      type: "camion",
      fuelType: "DIESEL",
      fuelCapacity: 400,
      enginePower: 540,
      status: "active",
      location: "Base Principal",
      hourMeter: 12500
    },
    {
      vehicleId: "EXC001",
      name: "Excavadora CAT 320",
      type: "excavadora",
      fuelType: "DIESEL",
      fuelCapacity: 300,
      enginePower: 150,
      status: "active",
      location: "Sitio A",
      hourMeter: 8500
    },
    {
      vehicleId: "MOT001",
      name: "Motobomba Honda",
      type: "motobomba",
      fuelType: "GASOLINE",
      fuelCapacity: 20,
      enginePower: 25,
      status: "active",
      location: "Almacén",
      hourMeter: 1200
    }
  ],

  movements: [
    {
      type: "entrada",
      fuelType: "DIESEL",
      quantity: 1000,
      unitPrice: 4200,
      totalValue: 4200000,
      supplierName: "Terpel S.A.",
      destinationLocation: "Base Principal",
      vehicleId: "CAM001",
      notes: "Abastecimiento semanal"
    },
    {
      type: "salida",
      fuelType: "DIESEL",
      quantity: 150,
      unitPrice: 4200,
      totalValue: 630000,
      destinationLocation: "Sitio A",
      vehicleId: "EXC001",
      notes: "Trabajo en sitio"
    },
    {
      type: "entrada",
      fuelType: "GASOLINE",
      quantity: 200,
      unitPrice: 4500,
      totalValue: 900000,
      supplierName: "Gas Express",
      destinationLocation: "Almacén",
      vehicleId: "MOT001",
      notes: "Abastecimiento para herramientas"
    }
  ]
};

class DataGenerator {
  constructor() {
    this.app = initializeApp(firebaseConfig);
    this.auth = getAuth(this.app);
    this.token = null;
  }

  /**
   * Obtener token de Firebase
   */
  async getToken(email, password) {
    try {
      console.log('🔐 Obteniendo token de Firebase...');
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      this.token = await userCredential.user.getIdToken();
      console.log('✅ Token obtenido exitosamente');
      return this.token;
    } catch (error) {
      console.error('❌ Error obteniendo token:', error.message);
      throw error;
    }
  }

  /**
   * Hacer petición a Cloud Run
   */
  async makeRequest(endpoint, data) {
    const response = await fetch(`${CLOUD_RUN_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.text();
    return { success: response.ok, status: response.status, data: result };
  }

  /**
   * Crear productos de prueba
   */
  async createProducts() {
    console.log('\n📦 Creando productos de prueba...');

    for (const product of SAMPLE_DATA.products) {
      try {
        const result = await this.makeRequest('/sqlCreateProduct', { productData: product });
        if (result.success) {
          console.log(`✅ Producto creado: ${product.name}`);
        } else {
          console.log(`❌ Error creando ${product.name}: ${result.data}`);
        }
      } catch (error) {
        console.log(`❌ Error creando ${product.name}:`, error.message);
      }
    }
  }

  /**
   * Crear vehículos de prueba
   */
  async createVehicles() {
    console.log('\n🚗 Creando vehículos de prueba...');

    for (const vehicle of SAMPLE_DATA.vehicles) {
      try {
        const result = await this.makeRequest('/sqlCreateVehicle', { vehicleData: vehicle });
        if (result.success) {
          console.log(`✅ Vehículo creado: ${vehicle.name}`);
        } else {
          console.log(`❌ Error creando ${vehicle.name}: ${result.data}`);
        }
      } catch (error) {
        console.log(`❌ Error creando ${vehicle.name}:`, error.message);
      }
    }
  }

  /**
   * Crear movimientos de prueba
   */
  async createMovements() {
    console.log('\n📊 Creando movimientos de prueba...');

    for (const movement of SAMPLE_DATA.movements) {
      try {
        const result = await this.makeRequest('/sqlCreateMovement', { movementData: movement });
        if (result.success) {
          console.log(`✅ Movimiento creado: ${movement.type} - ${movement.quantity}L`);
        } else {
          console.log(`❌ Error creando movimiento: ${result.data}`);
        }
      } catch (error) {
        console.log(`❌ Error creando movimiento:`, error.message);
      }
    }
  }

  /**
   * Ejecutar generación completa
   */
  async run() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    try {
      console.log('🚀 Generador de Datos de Prueba - Forestech');
      console.log('═'.repeat(50));

      const email = await this.askQuestion(rl, 'Email de Firebase: ');
      const password = await this.askQuestion(rl, 'Password de Firebase: ');

      await this.getToken(email, password);

      console.log('\n🗂️ Generando datos de prueba...');
      await this.createProducts();
      await this.createVehicles();
      await this.createMovements();

      console.log('\n✅ Generación de datos completada!');
      console.log('📊 Resumen:');
      console.log(`   - Productos: ${SAMPLE_DATA.products.length}`);
      console.log(`   - Vehículos: ${SAMPLE_DATA.vehicles.length}`);
      console.log(`   - Movimientos: ${SAMPLE_DATA.movements.length}`);

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
  const generator = new DataGenerator();
  generator.run().catch(console.error);
}