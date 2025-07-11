// combustibles/src/hooks/usePerformanceMonitor.js
// Sistema de monitoreo de performance - FASE 3 OPTIMIZACIÓN
import { useEffect, useRef, useState, useCallback } from 'react';

// Hook para monitorear renders de componentes
export const useRenderCounter = (componentName) => {
  const renderCount = useRef(0);
  const lastRender = useRef(Date.now());

  useEffect(() => {
    renderCount.current += 1;
    const now = Date.now();
    const timeSinceLastRender = now - lastRender.current;
    lastRender.current = now;

    if (process.env.NODE_ENV === 'development') {
      console.log(`🔄 [${componentName}] Render #${renderCount.current} (${timeSinceLastRender}ms desde último)`);
    }
  });

  return {
    renderCount: renderCount.current,
    lastRenderTime: lastRender.current
  };
};

// Hook para monitorear performance de operaciones
export const usePerformanceTracker = () => {
  const [metrics, setMetrics] = useState({
    firebaseReads: 0,
    cacheHits: 0,
    renderCount: 0,
    slowOperations: []
  });

  const trackFirebaseRead = useCallback(() => {
    setMetrics(prev => ({
      ...prev,
      firebaseReads: prev.firebaseReads + 1
    }));
  }, []);

  const trackCacheHit = useCallback(() => {
    setMetrics(prev => ({
      ...prev,
      cacheHits: prev.cacheHits + 1
    }));
  }, []);

  const trackOperation = useCallback((operationName, duration) => {
    if (duration > 1000) { // Operaciones lentas > 1s
      setMetrics(prev => ({
        ...prev,
        slowOperations: [...prev.slowOperations, { name: operationName, duration, timestamp: Date.now() }]
      }));
    }
  }, []);

  const resetMetrics = useCallback(() => {
    setMetrics({
      firebaseReads: 0,
      cacheHits: 0,
      renderCount: 0,
      slowOperations: []
    });
  }, []);

  return {
    metrics,
    trackFirebaseRead,
    trackCacheHit,
    trackOperation,
    resetMetrics
  };
};

// Hook para medir tiempo de operaciones
export const useOperationTimer = () => {
  const timers = useRef(new Map());

  const startTimer = useCallback((operationId) => {
    timers.current.set(operationId, performance.now());
  }, []);

  const endTimer = useCallback((operationId) => {
    const startTime = timers.current.get(operationId);
    if (startTime) {
      const duration = performance.now() - startTime;
      timers.current.delete(operationId);

      if (process.env.NODE_ENV === 'development') {
        console.log(`⏱️ [${operationId}] completado en ${duration.toFixed(2)}ms`);
      }

      return duration;
    }
    return 0;
  }, []);

  return { startTimer, endTimer };
};

// Hook para detectar re-renders innecesarios
export const useWhyDidYouUpdate = (name, props) => {
  const previousProps = useRef();

  useEffect(() => {
    if (previousProps.current) {
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      const changedProps = {};

      allKeys.forEach(key => {
        if (previousProps.current[key] !== props[key]) {
          changedProps[key] = {
            from: previousProps.current[key],
            to: props[key]
          };
        }
      });

      if (Object.keys(changedProps).length > 0 && process.env.NODE_ENV === 'development') {
        console.log(`🔍 [${name}] Re-render causado por:`, changedProps);
      }
    }

    previousProps.current = props;
  });
};
