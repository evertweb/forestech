/**
 * Design Tokens y valores de diseño centralizados para la app combustibles
 * Centraliza colores, espaciado, tipografía, breakpoints y otros valores de diseño.
 * Cada bloque está documentado para facilitar el mantenimiento y la extensión.
 */

// ===================================================================
// COLORES CORPORATIVOS FORESTECH
// -------------------------------------------------------------------
// Paleta de colores principal, gradientes y colores funcionales para la marca
// ===================================================================
export const COLORS = {
  // Colores principales de marca
  PRIMARY: {
    FORESTECH_GREEN: '#2c5530',
    FORESTECH_GREEN_LIGHT: '#3d7c47',
    FORESTECH_GREEN_DARK: '#1b4332',
    FORESTECH_SECONDARY: '#2d5016',
  },

  // Gradientes de la marca y fondos
  GRADIENTS: {
    PRIMARY: 'linear-gradient(135deg, #2c5530 0%, #3d7c47 100%)',
    BACKGROUND: 'linear-gradient(135deg, #1b4332 0%, #2d5016 50%, #1b4332 100%)',
    CARD_BACKGROUND: 'linear-gradient(135deg, #2c5530 0%, #3d7c47 100%)',
  },

  // Colores funcionales para estados de la UI (éxito, advertencia, error, info)
  FUNCTIONAL: {
    SUCCESS: '#16a34a', // green-600
    SUCCESS_LIGHT: '#22c55e', // green-500
    WARNING: '#ca8a04', // yellow-600
    WARNING_LIGHT: '#eab308', // yellow-500
    ERROR: '#dc2626', // red-600
    ERROR_LIGHT: '#ef4444', // red-500
    INFO: '#2563eb', // blue-600
    INFO_LIGHT: '#3b82f6', // blue-500
  },

  // Colores de texto principales y secundarios
  TEXT: {
    PRIMARY: '#2c5530',
    SECONDARY: '#666',
    TERTIARY: '#555',
    MUTED: '#999',
    WHITE: '#ffffff',
    BLACK: '#000000',
  },

  // Colores de fondo
  BACKGROUND: {
    WHITE: '#ffffff',
    LIGHT_GRAY: '#f8f9fa',
    MEDIUM_GRAY: '#e9ecef',
    OVERLAY: 'rgba(255, 255, 255, 0.1)',
    OVERLAY_DARK: 'rgba(0, 0, 0, 0.5)',
    CARD: 'rgba(255, 255, 255, 0.1)',
  },

  // Colores de bordes
  BORDER: {
    LIGHT: 'rgba(255, 255, 255, 0.3)',
    MEDIUM: 'rgba(255, 255, 255, 0.5)',
    DARK: 'rgba(0, 0, 0, 0.1)',
    FOCUS: '#2c5530',
  },
};

// ===================================================================
// COLORES PARA PRODUCTOS
// ===================================================================
export const PRODUCT_COLORS = [
  '#FF6B35', // Naranja
  '#4CAF50', // Verde
  '#2196F3', // Azul
  '#FF9800', // Ámbar
  '#F44336', // Rojo
  '#9C27B0', // Púrpura
  '#E91E63', // Rosa
  '#795548', // Marrón
  '#607D8B', // Azul gris
  '#FFC107', // Amarillo
];

// ===================================================================
// ESPACIADO Y DIMENSIONES
// ===================================================================
export const SPACING = {
  // Espaciado base (en rem)
  XS: '0.25rem', // 4px
  SM: '0.5rem', // 8px
  MD: '1rem', // 16px
  LG: '1.5rem', // 24px
  XL: '2rem', // 32px
  XXL: '3rem', // 48px

  // Espaciado específico para componentes
  CARD_PADDING: '1.5rem',
  MODAL_PADDING: '2rem',
  BUTTON_PADDING: '0.75rem 1.5rem',
  INPUT_PADDING: '0.75rem 1rem',

  // Márgenes
  SECTION_MARGIN: '2rem 0',
  ELEMENT_MARGIN: '1rem 0',

  // Anchos y altos específicos
  MODAL_MAX_WIDTH: '600px',
  SIDEBAR_WIDTH: '250px',
  HEADER_HEIGHT: '60px',
};

// ===================================================================
// TIPOGRAFÍA
// ===================================================================
export const TYPOGRAPHY = {
  // Familias de fuentes
  FONT_FAMILIES: {
    PRIMARY: 'Open Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    SAP: '72, "Open Sans", sans-serif',
    RETRO: 'Orbitron, "Rajdhani", monospace',
    MONOSPACE: '"Courier New", monospace',
  },

  // Tamaños de fuente
  FONT_SIZES: {
    XS: '0.75rem', // 12px
    SM: '0.875rem', // 14px
    MD: '1rem', // 16px
    LG: '1.125rem', // 18px
    XL: '1.25rem', // 20px
    XXL: '1.5rem', // 24px
    XXXL: '2rem', // 32px
  },

  // Pesos de fuente
  FONT_WEIGHTS: {
    LIGHT: 300,
    NORMAL: 400,
    MEDIUM: 500,
    SEMIBOLD: 600,
    BOLD: 700,
  },

  // Alturas de línea
  LINE_HEIGHTS: {
    TIGHT: 1.2,
    NORMAL: 1.5,
    RELAXED: 1.75,
  },
};

// ===================================================================
// BREAKPOINTS RESPONSIVE
// ===================================================================
export const BREAKPOINTS = {
  // Tamaños de pantalla
  MOBILE: '768px',
  TABLET: '1024px',
  DESKTOP: '1200px',
  LARGE_DESKTOP: '1440px',

  // Media queries
  MEDIA_QUERIES: {
    MOBILE: '(max-width: 768px)',
    TABLET: '(min-width: 769px) and (max-width: 1024px)',
    DESKTOP: '(min-width: 1025px)',
    LARGE_DESKTOP: '(min-width: 1441px)',
  },
};

// ===================================================================
// SOMBRAS Y EFECTOS
// ===================================================================
export const SHADOWS = {
  // Sombras base
  SM: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  MD: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  LG: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  XL: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',

  // Sombras específicas
  CARD: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  MODAL: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  BUTTON: '0 2px 4px 0 rgba(0, 0, 0, 0.1)',

  // Efectos especiales
  INNER: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  GLOW: '0 0 0 3px rgba(44, 85, 48, 0.1)',
};

// ===================================================================
// BORDES Y RADIOS
// ===================================================================
export const BORDERS = {
  // Anchos de borde
  WIDTHS: {
    THIN: '1px',
    MEDIUM: '2px',
    THICK: '4px',
  },

  // Radios de borde
  RADIUS: {
    NONE: '0',
    SM: '0.25rem', // 4px
    MD: '0.5rem', // 8px
    LG: '0.75rem', // 12px
    XL: '1rem', // 16px
    FULL: '9999px', // Círculo perfecto
  },

  // Estilos de borde
  STYLES: {
    SOLID: 'solid',
    DASHED: 'dashed',
    DOTTED: 'dotted',
  },
};

// ===================================================================
// TIEMPOS DE ANIMACIÓN
// ===================================================================
export const ANIMATIONS = {
  // Duraciones
  DURATION: {
    FAST: '150ms',
    NORMAL: '300ms',
    SLOW: '500ms',
  },

  // Funciones de temporización
  TIMING: {
    EASE: 'ease',
    EASE_IN: 'ease-in',
    EASE_OUT: 'ease-out',
    EASE_IN_OUT: 'ease-in-out',
    LINEAR: 'linear',
  },

  // Transiciones comunes
  TRANSITIONS: {
    ALL: 'all 300ms ease',
    OPACITY: 'opacity 300ms ease',
    TRANSFORM: 'transform 300ms ease',
    BACKGROUND: 'background-color 300ms ease',
    BORDER: 'border-color 300ms ease',
  },
};

// ===================================================================
// Z-INDEX LAYERS
// ===================================================================
export const Z_INDEX = {
  BACKGROUND: -1,
  BASE: 0,
  CONTENT: 10,
  HEADER: 100,
  SIDEBAR: 200,
  DROPDOWN: 500,
  MODAL: 1000,
  NOTIFICATION: 1100,
  TOOLTIP: 1200,
  OVERLAY: 1300,
};

// ===================================================================
// CONFIGURACIONES ESPECÍFICAS
// ===================================================================
export const CACHE_CONFIG = {
  // Duraciones de caché
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutos en milisegundos
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutos
  REFRESH_INTERVAL: 1000, // 1 segundo

  // Límites
  MAX_ITEMS_PER_PAGE: 50,
  DEFAULT_PAGE_SIZE: 10,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
};

// ===================================================================
// TOKENS ESPECÍFICOS PARA TEMAS
// ===================================================================
export const THEME_TOKENS = {
  // Tema SAP Fiori
  SAP: {
    PRIMARY_COLOR: '#0070f3',
    SECONDARY_COLOR: '#f4f5f6',
    ACCENT_COLOR: '#ff6b35',
    FONT_FAMILY: TYPOGRAPHY.FONT_FAMILIES.SAP,
    BORDER_RADIUS: BORDERS.RADIUS.SM,
    SHADOW: SHADOWS.MD,
  },

  // Tema Retro 80s
  RETRO: {
    PRIMARY_COLOR: '#ff00ff',
    SECONDARY_COLOR: '#00ffff',
    ACCENT_COLOR: '#ffff00',
    FONT_FAMILY: TYPOGRAPHY.FONT_FAMILIES.RETRO,
    BORDER_RADIUS: BORDERS.RADIUS.NONE,
    SHADOW: SHADOWS.XL,
  },

  // Tema Default/Forestech
  DEFAULT: {
    PRIMARY_COLOR: COLORS.PRIMARY.FORESTECH_GREEN,
    SECONDARY_COLOR: COLORS.PRIMARY.FORESTECH_GREEN_LIGHT,
    ACCENT_COLOR: COLORS.FUNCTIONAL.SUCCESS,
    FONT_FAMILY: TYPOGRAPHY.FONT_FAMILIES.PRIMARY,
    BORDER_RADIUS: BORDERS.RADIUS.MD,
    SHADOW: SHADOWS.CARD,
  },
};

// ===================================================================
// CSS VARIABLES DINÁMICAS
// ===================================================================
export const CSS_VARIABLES = {
  // Función para generar CSS variables desde tokens
  generateCSSVariables: (theme = 'default') => {
    const themeTokens = THEME_TOKENS[theme.toUpperCase()] || THEME_TOKENS.DEFAULT;

    return {
      // Colores principales
      '--forestech-primary': themeTokens.PRIMARY_COLOR,
      '--forestech-secondary': themeTokens.SECONDARY_COLOR,
      '--forestech-accent': themeTokens.ACCENT_COLOR,

      // Colores Forestech
      '--forestech-green': COLORS.PRIMARY.FORESTECH_GREEN,
      '--forestech-green-light': COLORS.PRIMARY.FORESTECH_GREEN_LIGHT,
      '--forestech-green-dark': COLORS.PRIMARY.FORESTECH_GREEN_DARK,

      // Colores funcionales
      '--color-success': COLORS.FUNCTIONAL.SUCCESS,
      '--color-success-light': COLORS.FUNCTIONAL.SUCCESS_LIGHT,
      '--color-warning': COLORS.FUNCTIONAL.WARNING,
      '--color-warning-light': COLORS.FUNCTIONAL.WARNING_LIGHT,
      '--color-error': COLORS.FUNCTIONAL.ERROR,
      '--color-error-light': COLORS.FUNCTIONAL.ERROR_LIGHT,
      '--color-info': COLORS.FUNCTIONAL.INFO,
      '--color-info-light': COLORS.FUNCTIONAL.INFO_LIGHT,

      // Colores de texto
      '--text-primary': COLORS.TEXT.PRIMARY,
      '--text-secondary': COLORS.TEXT.SECONDARY,
      '--text-tertiary': COLORS.TEXT.TERTIARY,
      '--text-muted': COLORS.TEXT.MUTED,
      '--text-white': COLORS.TEXT.WHITE,
      '--text-black': COLORS.TEXT.BLACK,

      // Colores de fondo
      '--bg-white': COLORS.BACKGROUND.WHITE,
      '--bg-light-gray': COLORS.BACKGROUND.LIGHT_GRAY,
      '--bg-medium-gray': COLORS.BACKGROUND.MEDIUM_GRAY,
      '--bg-overlay': COLORS.BACKGROUND.OVERLAY,
      '--bg-overlay-dark': COLORS.BACKGROUND.OVERLAY_DARK,
      '--bg-card': COLORS.BACKGROUND.CARD,

      // Espaciado
      '--spacing-xs': SPACING.XS,
      '--spacing-sm': SPACING.SM,
      '--spacing-md': SPACING.MD,
      '--spacing-lg': SPACING.LG,
      '--spacing-xl': SPACING.XL,
      '--spacing-xxl': SPACING.XXL,

      // Tipografía
      '--font-family-primary': themeTokens.FONT_FAMILY,
      '--font-size-xs': TYPOGRAPHY.FONT_SIZES.XS,
      '--font-size-sm': TYPOGRAPHY.FONT_SIZES.SM,
      '--font-size-md': TYPOGRAPHY.FONT_SIZES.MD,
      '--font-size-lg': TYPOGRAPHY.FONT_SIZES.LG,
      '--font-size-xl': TYPOGRAPHY.FONT_SIZES.XL,
      '--font-size-xxl': TYPOGRAPHY.FONT_SIZES.XXL,

      // Sombras
      '--shadow-sm': SHADOWS.SM,
      '--shadow-md': SHADOWS.MD,
      '--shadow-lg': SHADOWS.LG,
      '--shadow-card': SHADOWS.CARD,
      '--shadow-modal': SHADOWS.MODAL,

      // Bordes
      '--border-radius-sm': BORDERS.RADIUS.SM,
      '--border-radius-md': themeTokens.BORDER_RADIUS,
      '--border-radius-lg': BORDERS.RADIUS.LG,
      '--border-radius-full': BORDERS.RADIUS.FULL,

      // Transiciones
      '--transition-all': ANIMATIONS.TRANSITIONS.ALL,
      '--transition-fast': `all ${ANIMATIONS.DURATION.FAST} ${ANIMATIONS.TIMING.EASE}`,
      '--transition-normal': `all ${ANIMATIONS.DURATION.NORMAL} ${ANIMATIONS.TIMING.EASE}`,
      '--transition-slow': `all ${ANIMATIONS.DURATION.SLOW} ${ANIMATIONS.TIMING.EASE}`,

      // Z-index
      '--z-modal': Z_INDEX.MODAL,
      '--z-dropdown': Z_INDEX.DROPDOWN,
      '--z-tooltip': Z_INDEX.TOOLTIP,
      '--z-overlay': Z_INDEX.OVERLAY,
    };
  },

  // Aplicar variables CSS al DOM
  applyThemeVariables: (theme = 'default') => {
    const variables = CSS_VARIABLES.generateCSSVariables(theme);
    const root = document.documentElement;

    Object.entries(variables).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  },
};

// ===================================================================
// COLORES ESPECÍFICOS DE PRODUCTOS (consolidado)
// ===================================================================
export const PRODUCT_CATEGORY_COLORS = {
  // Mapeo de categorías a colores sugeridos
  COMBUSTIBLE: '#FF6B35', // Naranja Forestech
  ACEITE: '#795548', // Café
  LUBRICANTE: '#9C27B0', // Púrpura
  FLUIDO: '#2196F3', // Azul
};

// Función para obtener color por categoría
export const getColorByCategory = (category) => {
  return PRODUCT_CATEGORY_COLORS[category] || PRODUCT_COLORS[0];
};

// ===================================================================
// UTILIDADES PARA RESPONSIVE DESIGN
// ===================================================================
export const RESPONSIVE_UTILS = {
  // Generar media queries
  mediaQuery: (breakpoint) => {
    return BREAKPOINTS.MEDIA_QUERIES[breakpoint.toUpperCase()] || BREAKPOINTS.MEDIA_QUERIES.DESKTOP;
  },

  // Generar estilos responsive
  generateResponsiveSpacing: (mobile, tablet, desktop) => {
    return {
      padding: mobile,
      [`@media ${BREAKPOINTS.MEDIA_QUERIES.TABLET}`]: {
        padding: tablet || mobile,
      },
      [`@media ${BREAKPOINTS.MEDIA_QUERIES.DESKTOP}`]: {
        padding: desktop || tablet || mobile,
      },
    };
  },
};

// ===================================================================
// 📊 CHART COLORS - Arrays unificados para gráficos
// ===================================================================
export const CHART_COLORS = {
  DEFAULT: [
    'var(--forestech-green)',
    'var(--color-error)',
    'var(--color-info)',
    'var(--color-warning-dark)',
    'var(--color-purple)',
    'var(--color-success)',
    'var(--color-warning)',
    'var(--color-primary)',
  ],
};

// ===================================================================
// 🎨 CATEGORY COLORS - Colores para categorías de vehículos
// ===================================================================
export const CATEGORY_COLORS = [
  { color: '#3b82f6', name: 'Azul', description: 'Profesional y confiable' },
  { color: '#10b981', name: 'Verde', description: 'Natural y ecológico' },
  { color: '#f59e0b', name: 'Naranja', description: 'Energético y llamativo' },
  { color: '#ef4444', name: 'Rojo', description: 'Urgente e importante' },
  { color: '#8b5cf6', name: 'Morado', description: 'Elegante y distintivo' },
  { color: '#06b6d4', name: 'Cian', description: 'Moderno y tecnológico' },
  { color: '#84cc16', name: 'Lima', description: 'Fresco y dinámico' },
  { color: '#f97316', name: 'Ámbar', description: 'Cálido y acogedor' },
  { color: '#ec4899', name: 'Rosa', description: 'Creativo y único' },
  { color: '#64748b', name: 'Gris', description: 'Neutro y versátil' },
];

// ===================================================================
// EXPORTACIÓN PRINCIPAL
// ===================================================================
export const DESIGN_TOKENS = {
  COLORS,
  SPACING,
  TYPOGRAPHY,
  BREAKPOINTS,
  SHADOWS,
  BORDERS,
  ANIMATIONS,
  Z_INDEX,
  CACHE_CONFIG,
  THEME_TOKENS,
  CSS_VARIABLES,
  PRODUCT_COLORS,
  PRODUCT_CATEGORY_COLORS,
  getColorByCategory,
  CHART_COLORS,
  CATEGORY_COLORS,
  RESPONSIVE_UTILS,
};

export default DESIGN_TOKENS;
