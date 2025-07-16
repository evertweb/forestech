// Script temporal para crear producto DIESEL
import { collection, addDoc } from 'firebase/firestore';

// Este script debe ejecutarse desde la consola del navegador
// donde Firebase ya está inicializado

window.createDieselProduct = async () => {
  try {
    const productData = {
      name: 'DIESEL',
      displayName: 'Diesel 🚛',
      category: 'Combustible',
      unit: 'gal',
      defaultPrice: 12500,
      color: '#FF6B35',
      icon: '🚛',
      description: 'Combustible diesel para vehículos pesados',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'manual-fix'
    };
    
    // Usar db global de Firebase
    const docRef = await addDoc(collection(window.db, 'combustibles_products'), productData);
    console.log('✅ Producto DIESEL creado con ID:', docRef.id);
    
    // Recargar la página para que se actualicen los productos
    window.location.reload();
  } catch (error) {
    console.error('❌ Error creando producto DIESEL:', error);
  }
};

console.log('📝 Script listo. Ejecuta: createDieselProduct()');