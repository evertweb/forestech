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
  // Nueva paleta de colores unificada
  PRIMARY: {
    TEAL: '#0e7c7b',
    TEAL_LIGHT: 'rgba(14, 124, 123, 0.1)',
    TEAL_MEDIUM: 'rgba(14, 124, 123, 0.3)',
    TEAL_DARK: '#0a5f5e',
    TEAL_DARKER: '#074847',
    
    VERDIGRIS: '#17bebb',
    VERDIGRIS_LIGHT: 'rgba(23, 190, 187, 0.1)',
    VERDIGRIS_MEDIUM: 'rgba(23, 190, 187, 0.3)',
    VERDIGRIS_DARK: '#128f8d',
    VERDIGRIS_DARKER: '#0e6b69',
    
    NYANZA: '#d4f4dd',
    NYANZA_LIGHT: 'rgba(212, 244, 221, 0.5)',
    NYANZA_MEDIUM: 'rgba(212, 244, 221, 0.8)',
    NYANZA_DARK: '#b8e6c1',
    NYANZA_DARKER: '#9dd8a5',
    
    RUSTY_RED: '#d62246',
    RUSTY_RED_LIGHT: 'rgba(214, 34, 70, 0.1)',
    RUSTY_RED_MEDIUM: 'rgba(214, 34, 70, 0.3)',
    RUSTY_RED_DARK: '#b01d3a',
    RUSTY_RED_DARKER: '#8a162d',
    
    VIOLET_JTC: '#4b1d3f',
    VIOLET_JTC_LIGHT: 'rgba(75, 29, 63, 0.1)',
    VIOLET_JTC_MEDIUM: 'rgba(75, 29, 63, 0.3)',
    VIOLET_JTC_DARK: '#3a1630',
    VIOLET_JTC_DARKER: '#2a1024',
    
    // Mapeo semántico
    FORESTECH_PRIMARY: '#0e7c7b', // Teal
    FORESTECH_SECONDARY: '#17bebb', // Verdigris
    FORESTECH_ACCENT: '#4b1d3f', // Violet JTC
  },

  // Gradientes actualizados con nueva paleta
  GRADIENTS: {
    PRIMARY: 'linear-gradient(135deg, #0e7c7b 0%, #17bebb 100%)',
    SECONDARY: 'linear-gradient(135deg, #17bebb 0%, #d4f4dd 100%)',
    ACCENT: 'linear-gradient(135deg, #4b1d3f 0%, #0e7c7b 100%)',
    BACKGROUND: 'linear-gradient(135deg, #d4f4dd 0%, #ffffff 100%)',
    CARD_BACKGROUND: 'linear-gradient(135deg, #0e7c7b 0%, #17bebb 100%)',
    
    // Gradientes direccionales
    TOP: 'linear-gradient(0deg, #0e7c7b, #17bebb, #d4f4dd, #d62246, #4b1d3f)',
    RIGHT: 'linear-gradient(90deg, #0e7c7b, #17bebb, #d4f4dd, #d62246, #4b1d3f)',
    BOTTOM: 'linear-gradient(180deg, #0e7c7b, #17bebb, #d4f4dd, #d62246, #4b1d3f)',
    LEFT: 'linear-gradient(270deg, #0e7c7b, #17bebb, #d4f4dd, #d62246, #4b1d3f)',
    RADIAL: 'radial-gradient(#0e7c7b, #17bebb, #d4f4dd, #d62246, #4b1d3f)',
  },

  // Colores funcionales actualizados
  FUNCTIONAL: {
    SUCCESS: '#0e7c7b', // Teal para éxito
    SUCCESS_LIGHT: 'rgba(14, 124, 123, 0.1)',
    SUCCESS_MEDIUM: 'rgba(14, 124, 123, 0.3)',
    SUCCESS_DARK: '#0a5f5e',
    
    INFO: '#17bebb', // Verdigris para información
    INFO_LIGHT: 'rgba(23, 190, 187, 0.1)',
    INFO_MEDIUM: 'rgba(23, 190, 187, 0.3)',
    INFO_DARK: '#128f8d',
    
    WARNING: '#e67e22', // Naranja complementario
    WARNING_LIGHT: 'rgba(230, 126, 34, 0.1)',
    WARNING_MEDIUM: 'rgba(230, 126, 34, 0.3)',
    WARNING_DARK: '#d35400',
    
    ERROR: '#d62246', // Rusty Red para errores
    ERROR_LIGHT: 'rgba(214, 34, 70, 0.1)',
    ERROR_MEDIUM: 'rgba(214, 34, 70, 0.3)',
    ERROR_DARK: '#b01d3a',
    
    NEUTRAL: '#6c757d',
    NEUTRAL_LIGHT: 'rgba(108, 117, 125, 0.1)',
    NEUTRAL_MEDIUM: 'rgba(108, 117, 125, 0.3)',
    NEUTRAL_DARK: '#495057',
  },

  // Colores de texto actualizados
  TEXT: {
    PRIMARY: '#4b1d3f', // Violet JTC para texto principal
    SECONDARY: '#6c757d',
    TERTIARY: '#adb5bd',
    MUTED: '#868e96',
    WHITE: '#ffffff',
    BLACK: '#000000',
    ON_PRIMARY: '#ffffff',
    ON_SECONDARY: '#ffffff',
    ON_ACCENT: '#ffffff',
  },

  // Colores de fondo actualizados
  BACKGROUND: {
    PRIMARY: '#d4f4dd', // Nyanza como fondo principal
    SECONDARY: '#ffffff',
    TERTIARY: '#f8f9fa',
    QUATERNARY: '#e9ecef',
    WHITE: '#ffffff',
    LIGHT_GRAY: '#f8f9fa',
    MEDIUM_GRAY: '#e9ecef',
    
    OVERLAY: 'rgba(75, 29, 63, 0.1)',
    OVERLAY_DARK: 'rgba(75, 29, 63, 0.5)',
    OVERLAY_LIGHT: 'rgba(212, 244, 221, 0.8)',
    
    CARD: '#ffffff',
    CARD_HOVER: 'rgba(212, 244, 221, 0.5)',
    CARD_ACTIVE: 'rgba(212, 244, 221, 0.8)',
  },

  // Colores de bordes actualizados
  BORDER: {
    PRIMARY: '#0e7c7b',
    SECONDARY: '#17bebb',
    LIGHT: 'rgba(14, 124, 123, 0.2)',
    MEDIUM: 'rgba(14, 124, 123, 0.4)',
    DARK: '#0a5f5e',
    NEUTRAL: '#dee2e6',
    FOCUS: '#17bebb',
  },
};

// ===================================================================
// COLORES PARA PRODUCTOS
// ===================================================================
export const PRODUCT_COLORS = [
  '#0e7c7b', // Teal - Color principal
  '#17bebb', // Verdigris - Color secundario
  '#4b1d3f', // Violet JTC - Color de acento
  '#d62246', // Rusty Red - Color de alerta
  '#e67e22', // Naranja complementario
  '#0a5f5e', // Teal oscuro
  '#128f8d', // Verdigris oscuro
  '#3a1630', // Violet JTC oscuro
  '#b01d3a', // Rusty Red oscuro
  '#d4f4dd', // Nyanza - Color suave
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
  // Tema SAP Fiori actualizado con nueva paleta
  SAP: {
    PRIMARY_COLOR: COLORS.PRIMARY.TEAL,
    SECONDARY_COLOR: COLORS.PRIMARY.VERDIGRIS,
    ACCENT_COLOR: COLORS.PRIMARY.VIOLET_JTC,
    FONT_FAMILY: TYPOGRAPHY.FONT_FAMILIES.SAP,
    BORDER_RADIUS: BORDERS.RADIUS.SM,
    SHADOW: SHADOWS.MD,
  },

  // Tema Retro 80s actualizado
  RETRO: {
    PRIMARY_COLOR: COLORS.PRIMARY.VIOLET_JTC,
    SECONDARY_COLOR: COLORS.PRIMARY.VERDIGRIS,
    ACCENT_COLOR: COLORS.PRIMARY.RUSTY_RED,
    FONT_FAMILY: TYPOGRAPHY.FONT_FAMILIES.RETRO,
    BORDER_RADIUS: BORDERS.RADIUS.NONE,
    SHADOW: SHADOWS.XL,
  },

  // Tema Default/Forestech con nueva paleta
  DEFAULT: {
    PRIMARY_COLOR: COLORS.PRIMARY.FORESTECH_PRIMARY,
    SECONDARY_COLOR: COLORS.PRIMARY.FORESTECH_SECONDARY,
    ACCENT_COLOR: COLORS.PRIMARY.FORESTECH_ACCENT,
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
      // Colores principales actualizados
      '--forestech-primary': themeTokens.PRIMARY_COLOR,
      '--forestech-secondary': themeTokens.SECONDARY_COLOR,
      '--forestech-accent': themeTokens.ACCENT_COLOR,

      // Nueva paleta de colores
      '--color-teal': COLORS.PRIMARY.TEAL,
      '--color-teal-light': COLORS.PRIMARY.TEAL_LIGHT,
      '--color-teal-medium': COLORS.PRIMARY.TEAL_MEDIUM,
      '--color-teal-dark': COLORS.PRIMARY.TEAL_DARK,
      '--color-teal-darker': COLORS.PRIMARY.TEAL_DARKER,
      
      '--color-verdigris': COLORS.PRIMARY.VERDIGRIS,
      '--color-verdigris-light': COLORS.PRIMARY.VERDIGRIS_LIGHT,
      '--color-verdigris-medium': COLORS.PRIMARY.VERDIGRIS_MEDIUM,
      '--color-verdigris-dark': COLORS.PRIMARY.VERDIGRIS_DARK,
      '--color-verdigris-darker': COLORS.PRIMARY.VERDIGRIS_DARKER,
      
      '--color-nyanza': COLORS.PRIMARY.NYANZA,
      '--color-nyanza-light': COLORS.PRIMARY.NYANZA_LIGHT,
      '--color-nyanza-medium': COLORS.PRIMARY.NYANZA_MEDIUM,
      '--color-nyanza-dark': COLORS.PRIMARY.NYANZA_DARK,
      '--color-nyanza-darker': COLORS.PRIMARY.NYANZA_DARKER,
      
      '--color-rusty-red': COLORS.PRIMARY.RUSTY_RED,
      '--color-rusty-red-light': COLORS.PRIMARY.RUSTY_RED_LIGHT,
      '--color-rusty-red-medium': COLORS.PRIMARY.RUSTY_RED_MEDIUM,
      '--color-rusty-red-dark': COLORS.PRIMARY.RUSTY_RED_DARK,
      '--color-rusty-red-darker': COLORS.PRIMARY.RUSTY_RED_DARKER,
      
      '--color-violet-jtc': COLORS.PRIMARY.VIOLET_JTC,
      '--color-violet-jtc-light': COLORS.PRIMARY.VIOLET_JTC_LIGHT,
      '--color-violet-jtc-medium': COLORS.PRIMARY.VIOLET_JTC_MEDIUM,
      '--color-violet-jtc-dark': COLORS.PRIMARY.VIOLET_JTC_DARK,
      '--color-violet-jtc-darker': COLORS.PRIMARY.VIOLET_JTC_DARKER,

      // Colores funcionales actualizados
      '--color-success': COLORS.FUNCTIONAL.SUCCESS,
      '--color-success-light': COLORS.FUNCTIONAL.SUCCESS_LIGHT,
      '--color-success-medium': COLORS.FUNCTIONAL.SUCCESS_MEDIUM,
      '--color-success-dark': COLORS.FUNCTIONAL.SUCCESS_DARK,
      
      '--color-info': COLORS.FUNCTIONAL.INFO,
      '--color-info-light': COLORS.FUNCTIONAL.INFO_LIGHT,
      '--color-info-medium': COLORS.FUNCTIONAL.INFO_MEDIUM,
      '--color-info-dark': COLORS.FUNCTIONAL.INFO_DARK,
      
      '--color-warning': COLORS.FUNCTIONAL.WARNING,
      '--color-warning-light': COLORS.FUNCTIONAL.WARNING_LIGHT,
      '--color-warning-medium': COLORS.FUNCTIONAL.WARNING_MEDIUM,
      '--color-warning-dark': COLORS.FUNCTIONAL.WARNING_DARK,
      
      '--color-error': COLORS.FUNCTIONAL.ERROR,
      '--color-error-light': COLORS.FUNCTIONAL.ERROR_LIGHT,
      '--color-error-medium': COLORS.FUNCTIONAL.ERROR_MEDIUM,
      '--color-error-dark': COLORS.FUNCTIONAL.ERROR_DARK,
      
      '--color-neutral': COLORS.FUNCTIONAL.NEUTRAL,
      '--color-neutral-light': COLORS.FUNCTIONAL.NEUTRAL_LIGHT,
      '--color-neutral-medium': COLORS.FUNCTIONAL.NEUTRAL_MEDIUM,
      '--color-neutral-dark': COLORS.FUNCTIONAL.NEUTRAL_DARK,

      // Colores de texto actualizados
      '--text-primary': COLORS.TEXT.PRIMARY,
      '--text-secondary': COLORS.TEXT.SECONDARY,
      '--text-tertiary': COLORS.TEXT.TERTIARY,
      '--text-muted': COLORS.TEXT.MUTED,
      '--text-white': COLORS.TEXT.WHITE,
      '--text-black': COLORS.TEXT.BLACK,
      '--text-on-primary': COLORS.TEXT.ON_PRIMARY,
      '--text-on-secondary': COLORS.TEXT.ON_SECONDARY,
      '--text-on-accent': COLORS.TEXT.ON_ACCENT,

      // Colores de fondo actualizados
      '--bg-primary': COLORS.BACKGROUND.PRIMARY,
      '--bg-secondary': COLORS.BACKGROUND.SECONDARY,
      '--bg-tertiary': COLORS.BACKGROUND.TERTIARY,
      '--bg-quaternary': COLORS.BACKGROUND.QUATERNARY,
      '--bg-white': COLORS.BACKGROUND.WHITE,
      '--bg-light-gray': COLORS.BACKGROUND.LIGHT_GRAY,
      '--bg-medium-gray': COLORS.BACKGROUND.MEDIUM_GRAY,
      '--bg-overlay': COLORS.BACKGROUND.OVERLAY,
      '--bg-overlay-dark': COLORS.BACKGROUND.OVERLAY_DARK,
      '--bg-overlay-light': COLORS.BACKGROUND.OVERLAY_LIGHT,
      '--bg-card': COLORS.BACKGROUND.CARD,
      '--bg-card-hover': COLORS.BACKGROUND.CARD_HOVER,
      '--bg-card-active': COLORS.BACKGROUND.CARD_ACTIVE,
      
      // Colores de borde actualizados
      '--border-primary': COLORS.BORDER.PRIMARY,
      '--border-secondary': COLORS.BORDER.SECONDARY,
      '--border-light': COLORS.BORDER.LIGHT,
      '--border-medium': COLORS.BORDER.MEDIUM,
      '--border-dark': COLORS.BORDER.DARK,
      '--border-neutral': COLORS.BORDER.NEUTRAL,
      '--border-focus': COLORS.BORDER.FOCUS,

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
  // Mapeo de categorías a colores con nueva paleta
  COMBUSTIBLE: '#0e7c7b', // Teal - Color principal para combustibles
  ACEITE: '#4b1d3f', // Violet JTC - Color elegante para aceites
  LUBRICANTE: '#17bebb', // Verdigris - Color fresco para lubricantes
  FLUIDO: '#e67e22', // Naranja complementario para fluidos
  ADITIVO: '#d62246', // Rusty Red para aditivos
  OTROS: '#6c757d', // Neutral para otros productos
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
    'var(--color-teal)',
    'var(--color-verdigris)',
    'var(--color-violet-jtc)',
    'var(--color-rusty-red)',
    'var(--color-warning)',
    'var(--color-teal-dark)',
    'var(--color-verdigris-dark)',
    'var(--color-violet-jtc-dark)',
  ],
};

// ===================================================================
// 🎨 CATEGORY COLORS - Colores para categorías de vehículos
// ===================================================================
export const CATEGORY_COLORS = [
  { color: '#0e7c7b', name: 'Teal', description: 'Confianza y estabilidad' },
  { color: '#17bebb', name: 'Verdigris', description: 'Modernidad y frescura' },
  { color: '#4b1d3f', name: 'Violet JTC', description: 'Elegancia y profundidad' },
  { color: '#d62246', name: 'Rusty Red', description: 'Urgencia controlada' },
  { color: '#d4f4dd', name: 'Nyanza', description: 'Naturaleza y calma' },
  { color: '#e67e22', name: 'Naranja', description: 'Energético y complementario' },
  { color: '#0a5f5e', name: 'Teal Oscuro', description: 'Seriedad y confianza' },
  { color: '#128f8d', name: 'Verdigris Oscuro', description: 'Sofisticación moderna' },
  { color: '#b01d3a', name: 'Rusty Red Oscuro', description: 'Intensidad controlada' },
  { color: '#6c757d', name: 'Gris Neutro', description: 'Equilibrio y versatilidad' },
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
