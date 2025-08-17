#!/usr/bin/env node

/**
 * Script para crear datos de ejemplo en Firestore
 * Esto permitirá que las cards muestren información real
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, setDoc } from 'firebase/firestore';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCbU834quCY8hjSffRwljJLgZrcxK8i2F4",
  authDomain: "liquidacionapp-62962.firebaseapp.com",
  projectId: "liquidacionapp-62962",
  storageBucket: "liquidacionapp-62962.firebasestorage.app",
  messagingSenderId: "851382130132",
  appId: "1:851382130132:web:eaba38fab449f14fb5b241",
  measurementId: "G-TPNSX0EGB0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Datos de ejemplo para inventario
const inventoryData = [
  {
    id: "diesel_tanque_1",
    name: "Diesel Tanque Principal",
    fuelType: "DIESEL",
    currentStock: 1500,
    maxCapacity: 2000,
    minStock: 300,
    pricePerUnit: 12500,
    location: "Tanque Principal",
    status: "active",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "gasolina_tanque_1",
    name: "Gasolina Tanque Secundario",
    fuelType: "GASOLINA",
    currentStock: 800,
    maxCapacity: 1500,
    minStock: 200,
    pricePerUnit: 14200,
    location: "Tanque Secundario",
    status: "active",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "diesel_tanque_2", 
    name: "Diesel Tanque Reserva",
    fuelType: "DIESEL",
    currentStock: 150, // Stock bajo para generar alerta
    maxCapacity: 1000,
    minStock: 200,
    pricePerUnit: 12500,
    location: "Bodega Norte",
    status: "active",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Datos de ejemplo para vehículos
const vehiclesData = [
  {
    id: "tractor_001",
    vehicleId: "TR001",
    plate: "ABC123",
    type: "Tractor",
    status: "activo",
    totalHoursWorked: 1250,
    fuelType: "DIESEL",
    currentHours: 1250,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "camion_001",
    vehicleId: "CM001", 
    plate: "DEF456",
    type: "Camión",
    status: "activo",
    totalHoursWorked: 850,
    fuelType: "DIESEL",
    currentHours: 850,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "motobomba_001",
    vehicleId: "MB001",
    plate: "N/A",
    type: "Motobomba",
    status: "activo", 
    totalHoursWorked: 320,
    fuelType: "GASOLINA",
    currentHours: 320,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Datos de ejemplo para movimientos
const movementsData = [
  {
    type: "entrada",
    fuelType: "DIESEL",
    quantity: 500,
    unitPrice: 12500,
    location: "Tanque Principal",
    status: "completado",
    description: "Reabastecimiento semanal",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // hace 2 días
  },
  {
    type: "salida",
    fuelType: "DIESEL", 
    quantity: 150,
    unitPrice: 12500,
    vehicleId: "TR001",
    location: "Tanque Principal",
    status: "completado",
    description: "Combustible para tractor",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // hace 1 día
  },
  {
    type: "entrada",
    fuelType: "GASOLINA",
    quantity: 300,
    unitPrice: 14200,
    location: "Tanque Secundario", 
    status: "completado",
    description: "Reabastecimiento gasolina",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // hace 3 días
  }
];

async function createSampleData() {
  try {
    console.log('🚀 Creando datos de ejemplo en Firestore...\n');

    // Crear datos de inventario
    console.log('📦 Creando inventario...');
    for (const item of inventoryData) {
      const docRef = doc(db, 'combustibles_inventory', item.id);
      await setDoc(docRef, item);
      console.log(`✅ Creado: ${item.name}`);
    }

    // Crear datos de vehículos
    console.log('\n🚜 Creando vehículos...');
    for (const vehicle of vehiclesData) {
      const docRef = doc(db, 'combustibles_vehicles', vehicle.id);
      await setDoc(docRef, vehicle);
      console.log(`✅ Creado: ${vehicle.type} ${vehicle.plate}`);
    }

    // Crear datos de movimientos
    console.log('\n📊 Creando movimientos...');
    for (const movement of movementsData) {
      const docRef = await addDoc(collection(db, 'combustibles_movements'), movement);
      console.log(`✅ Creado: ${movement.type} de ${movement.quantity} gal`);
    }

    console.log('\n🎉 ¡Datos de ejemplo creados exitosamente!');
    console.log('\n📋 Resumen:');
    console.log(`   • ${inventoryData.length} productos de inventario`);
    console.log(`   • ${vehiclesData.length} vehículos`); 
    console.log(`   • ${movementsData.length} movimientos`);
    console.log('\n💡 Ahora las cards deberían mostrar datos reales.');

  } catch (error) {
    console.error('❌ Error al crear datos:', error);
  }
}

await createSampleData();
process.exit(0);