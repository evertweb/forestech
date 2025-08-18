import { useState, useEffect, useMemo } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import { COLLECTIONS } from '../firebase/collections';

/**
 * Hook para obtener tipos de combustibles dinámicos desde Firebase
 * Los productos de categoría 'combustible' se convierten en tipos de combustible
 */
export const useFuelTypes = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      // Query para obtener solo productos de combustible activos
      const q = query(
        collection(db, COLLECTIONS.PRODUCTS),
        where('category', '==', 'combustible'),
        where('isActive', '==', true),
        orderBy('name', 'asc')
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const productsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setProducts(productsData);
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.error('Error fetching fuel types:', err);
          setError(err.message);
          setLoading(false);
        }
      );

      return unsubscribe;
    } catch (err) {
      console.error('Error setting up fuel types listener:', err);
      setError(err.message);
      setLoading(false);
    }
  }, []);

  // Memoizar los tipos de combustible derivados para evitar re-renders innecesarios
  const fuelTypes = useMemo(() => {
    return products.map((product) => ({
      value: product.name.toUpperCase(),
      label: product.displayName || product.name,
      name: product.name,
      displayName: product.displayName || product.name,
      color: product.color || '#FF6B35',
      icon: product.icon || '🛢️',
      unit: product.unit || 'gal',
      defaultPrice: product.defaultPrice || 0,
      id: product.id,
    }));
  }, [products]);

  // Crear un objeto de información de combustibles para compatibilidad
  const fuelInfo = useMemo(() => {
    const info = {};
    products.forEach((product) => {
      const key = product.name.toUpperCase();
      info[key] = {
        name: product.displayName || product.name,
        color: product.color || '#FF6B35',
        icon: product.icon || '🛢️',
        unit: product.unit || 'gal',
        defaultPrice: product.defaultPrice || 0,
      };
    });
    return info;
  }, [products]);

  // Array simple de nombres para compatibilidad con código existente
  const fuelTypeNames = useMemo(() => {
    return products.map((product) => product.name.toUpperCase());
  }, [products]);

  return {
    products,
    fuelTypes,
    fuelInfo,
    fuelTypeNames,
    loading,
    error,
    // Función helper para obtener info de un tipo específico
    getFuelInfo: (fuelType) => {
      const product = products.find((p) => p.name.toUpperCase() === fuelType.toUpperCase());
      return product
        ? {
            name: product.displayName || product.name,
            color: product.color || '#FF6B35',
            icon: product.icon || '🛢️',
            unit: product.unit || 'gal',
            defaultPrice: product.defaultPrice || 0,
          }
        : null;
    },
  };
};

export default useFuelTypes;
