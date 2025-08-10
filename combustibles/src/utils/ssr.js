/**
 * Utilities para SSR - detectar entorno y guards
 */
import { useEffect } from 'react';

// Detectar si estamos en servidor
export const isServer = typeof window === 'undefined';

// Detectar si estamos en cliente
export const isClient = !isServer;

/**
 * Hook seguro para efectos que solo deben ejecutarse en cliente
 * @param {Function} effect - Función de efecto
 * @param {Array} deps - Dependencias del efecto
 */
export function useClientEffect(effect, deps = []) {
  useEffect(() => {
    if (isClient) {
      return effect();
    }
  }, [effect, ...deps]);
}

/**
 * Guard para código que solo debe ejecutarse en cliente
 * @param {Function} fn - Función a ejecutar
 * @param {*} fallback - Valor de fallback para servidor
 */
export function clientOnly(fn, fallback = null) {
  if (isClient) {
    return fn();
  }
  return fallback;
}

/**
 * Guard para acceso seguro a window
 * @param {Function} fn - Función que usa window
 * @param {*} fallback - Valor de fallback
 */
export function safeWindow(fn, fallback = null) {
  if (typeof window !== 'undefined') {
    return fn(window);
  }
  return fallback;
}

/**
 * Guard para acceso seguro a document
 * @param {Function} fn - Función que usa document
 * @param {*} fallback - Valor de fallback
 */
export function safeDocument(fn, fallback = null) {
  if (typeof document !== 'undefined') {
    return fn(document);
  }
  return fallback;
}
