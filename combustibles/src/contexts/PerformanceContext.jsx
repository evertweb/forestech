// combustibles/src/contexts/PerformanceContext.jsx
// Contexto global para métricas de performance - FASE 3 OPTIMIZACIÓN
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useCallback, useEffect } from 'react';
import { optimizedFirestore } from '../services/optimizedFirestore';

// Contexto global para métricas de performance
export const PerformanceContext = createContext();

export const PerformanceProvider = ({ children }) => {
  const [globalMetrics, setGlobalMetrics] = useState({
    totalRenders: 0,
    totalFirebaseReads: 0,
    totalCacheHits: 0,
    optimizedComponents: 0,
    unoptimizedComponents: 0,
    averageRenderTime: 0
  });

  const updateGlobalMetrics = useCallback((metric, value) => {
    setGlobalMetrics(prev => ({
      ...prev,
      [metric]: prev[metric] + value
    }));
  }, []);

  const logOptimizationStats = useCallback(() => {
    const cacheEfficiency = globalMetrics.totalCacheHits / (globalMetrics.totalFirebaseReads + globalMetrics.totalCacheHits) * 100;
    const optimizationRatio = globalMetrics.optimizedComponents / (globalMetrics.optimizedComponents + globalMetrics.unoptimizedComponents) * 100;

    console.log('📊 PERFORMANCE STATS - FASE 3:');
    console.log(`🔄 Total renders: ${globalMetrics.totalRenders}`);
    console.log(`🔥 Firebase reads: ${globalMetrics.totalFirebaseReads}`);
    console.log(`⚡ Cache hits: ${globalMetrics.totalCacheHits}`);
    console.log(`📈 Cache efficiency: ${cacheEfficiency.toFixed(1)}%`);
    console.log(`✨ Components optimizados: ${globalMetrics.optimizedComponents}`);
    console.log(`⚠️ Components sin optimizar: ${globalMetrics.unoptimizedComponents}`);
    console.log(`🎯 Ratio optimización: ${optimizationRatio.toFixed(1)}%`);
  }, [globalMetrics]);

  // ✅ Inject performance tracker into optimizedFirestore on mount
  useEffect(() => {
    optimizedFirestore.setPerformanceTracker({ updateGlobalMetrics });
    
    console.log('🔗 PerformanceContext conectado con optimizedFirestore');
  }, [updateGlobalMetrics]);

  return (
    <PerformanceContext.Provider value={{
      globalMetrics,
      updateGlobalMetrics,
      logOptimizationStats
    }}>
      {children}
    </PerformanceContext.Provider>
  );
};
