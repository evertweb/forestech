/**
 * Puente de compatibilidad: reexporta componentes desde la carpeta "shared" (minúsculas).
 * Esto evita problemas de resolución en sistemas case-sensitive.
 */

// Shimmer components
export {
  default as ShimmerLoader,
  ShimmerBase,
  ShimmerCard,
  ShimmerTable,
  ShimmerCardsGrid,
  ShimmerDashboard,
} from '../shared/ShimmerLoader';

// Page layout
export { default as PageLayout } from '../shared/PageLayout';

// Hour Meter components
export { default as HourMeterInput } from './HourMeterInput';
export { default as HourMeterDisplay } from './HourMeterDisplay';
export { default as HourMeterHistory } from './HourMeterHistory';
