// utils/webVitals.js - Medición de Core Web Vitals
import { onCLS, onLCP, onINP, onFCP, onTTFB } from 'web-vitals';
import { logger } from './logger';

const sendMetric = (metric) => {
  // En dev: log; en prod podríamos enviar a endpoint / analytics
  logger.info('WebVital', {
    name: metric.name,
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    rating: metric.rating,
    id: metric.id,
  });
};

export const registerWebVitals = () => {
  if (import.meta.env.MODE !== 'development') return;
  try {
    onCLS(sendMetric);
    onINP(sendMetric); // INP (Interaction to Next Paint) replaced FID in web-vitals v3+
    onLCP(sendMetric);
    onFCP(sendMetric);
    onTTFB(sendMetric);
    logger.info('WebVitals registrados');
  } catch (e) {
    logger.warn('Error registrando WebVitals', { error: e?.message });
  }
};
