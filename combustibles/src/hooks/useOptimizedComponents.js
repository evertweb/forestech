// combustibles/src/hooks/useOptimizedComponents.js
// Sistema de optimización con React.memo y cache - NIVEL 3 OPTIMIZACIÓN
import { memo, useMemo, useCallback } from 'react';

// HOC para optimizar componentes con React.memo inteligente
export const withOptimization = (Component, customCompare) => {
  const OptimizedComponent = memo(Component, customCompare);
  OptimizedComponent.displayName = `Optimized(${Component.displayName || Component.name})`;
  return OptimizedComponent;
};

// Hook para memoización inteligente de datos
export const useOptimizedData = (data, dependencies = []) => {
  return useMemo(() => {
    if (!data || !Array.isArray(data)) return data;

    // Ordenar por ID para comparación consistente
    return [...data].sort((a, b) => (a.id || a._id || '').localeCompare(b.id || b._id || ''));
  }, [data, ...dependencies]);
};

// Hook para callbacks optimizados
export const useOptimizedCallbacks = (callbacks) => {
  return useMemo(() => {
    const optimizedCallbacks = {};
    const callbackKeys = Object.keys(callbacks);
    
    // Pre-create all callbacks to avoid calling hooks in loop
    for (const key of callbackKeys) {
      optimizedCallbacks[key] = callbacks[key];
    }

    return optimizedCallbacks;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, Object.values(callbacks));
};

// Función para comparación personalizada de props en React.memo
export const createCustomCompare = (fields = []) => {
  return (prevProps, nextProps) => {
    // Si no se especifican campos, usar comparación superficial
    if (fields.length === 0) {
      return Object.keys(prevProps).every(key =>
        prevProps[key] === nextProps[key]
      );
    }

    // Comparar solo los campos especificados
    return fields.every(field =>
      prevProps[field] === nextProps[field]
    );
  };
};

// Hook para detectar cambios significativos en arrays
export const useArrayChanges = (array, keyField = 'id') => {
  return useMemo(() => {
    if (!Array.isArray(array)) return { items: array, hasChanges: false };

    const sortedArray = [...array].sort((a, b) =>
      (a[keyField] || '').localeCompare(b[keyField] || '')
    );

    return {
      items: sortedArray,
      hasChanges: true,
      count: sortedArray.length,
      isEmpty: sortedArray.length === 0
    };
  }, [array, keyField]);
};
