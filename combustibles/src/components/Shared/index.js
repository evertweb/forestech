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
