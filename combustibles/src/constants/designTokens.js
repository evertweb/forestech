/**
 * Design Tokens y valores de diseño centralizados para la app combustibles
 * Centraliza colores, espaciado, tipografía, breakpoints y otros valores de diseño
 */

// ===================================================================
// COLORES CORPORATIVOS FORESTECH
// ===================================================================
export const COLORS = {
  // Colores principales de marca
  PRIMARY: {
    FORESTECH_GREEN: '#2c5530',
    FORESTECH_GREEN_LIGHT: '#3d7c47',
    FORESTECH_GREEN_DARK: '#1b4332',
    FORESTECH_SECONDARY: '#2d5016'
  },
  
  // Gradientes
  GRADIENTS: {
    PRIMARY: 'linear-gradient(135deg, #2c5530 0%, #3d7c47 100%)',
    BACKGROUND: 'linear-gradient(135deg, #1b4332 0%, #2d5016 50%, #1b4332 100%)',
    CARD_BACKGROUND: 'linear-gradient(135deg, #2c5530 0%, #3d7c47 100%)'
  },
  
  // Colores funcionales
  FUNCTIONAL: {
    SUCCESS: '#16a34a',      // green-600
    SUCCESS_LIGHT: '#22c55e', // green-500
    WARNING: '#ca8a04',      // yellow-600
    WARNING_LIGHT: '#eab308', // yellow-500
    ERROR: '#dc2626',        // red-600
    ERROR_LIGHT: '#ef4444',  // red-500
    INFO: '#2563eb',         // blue-600
    INFO_LIGHT: '#3b82f6'    // blue-500
  },
  
  // Colores de texto
  TEXT: {
    PRIMARY: '#2c5530',
    SECONDARY: '#666',
    TERTIARY: '#555',
    MUTED: '#999',
    WHITE: '#ffffff',
    BLACK: '#000000'
  },
  
  // Colores de fondo
  BACKGROUND: {
    WHITE: '#ffffff',
    LIGHT_GRAY: '#f8f9fa',
    MEDIUM_GRAY: '#e9ecef',
    OVERLAY: 'rgba(255, 255, 255, 0.1)',
    OVERLAY_DARK: 'rgba(0, 0, 0, 0.5)',
    CARD: 'rgba(255, 255, 255, 0.1)'
  },
  
  // Colores de bordes
  BORDER: {
    LIGHT: 'rgba(255, 255, 255, 0.3)',
    MEDIUM: 'rgba(255, 255, 255, 0.5)',
    DARK: 'rgba(0, 0, 0, 0.1)',
    FOCUS: '#2c5530'
  }
};

// ===================================================================
// ESPACIADO Y DIMENSIONES
// ===================================================================
export const SPACING = {
  // Espaciado base (en rem)
  XS: '0.25rem',    // 4px
  SM: '0.5rem',     // 8px
  MD: '1rem',       // 16px
  LG: '1.5rem',     // 24px
  XL: '2rem',       // 32px
  XXL: '3rem',      // 48px
  
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
  HEADER_HEIGHT: '60px'
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
    MONOSPACE: '"Courier New", monospace'
  },
  
  // Tamaños de fuente
  FONT_SIZES: {
    XS: '0.75rem',    // 12px
    SM: '0.875rem',   // 14px
    MD: '1rem',       // 16px
    LG: '1.125rem',   // 18px
    XL: '1.25rem',    // 20px
    XXL: '1.5rem',    // 24px
    XXXL: '2rem'      // 32px
  },
  
  // Pesos de fuente
  FONT_WEIGHTS: {
    LIGHT: 300,
    NORMAL: 400,
    MEDIUM: 500,
    SEMIBOLD: 600,
    BOLD: 700
  },
  
  // Alturas de línea
  LINE_HEIGHTS: {
    TIGHT: 1.2,
    NORMAL: 1.5,
    RELAXED: 1.75
  }
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
    LARGE_DESKTOP: '(min-width: 1441px)'
  }
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
  GLOW: '0 0 0 3px rgba(44, 85, 48, 0.1)'
};

// ===================================================================
// BORDES Y RADIOS
// ===================================================================
export const BORDERS = {
  // Anchos de borde
  WIDTHS: {
    THIN: '1px',
    MEDIUM: '2px',
    THICK: '4px'
  },
  
  // Radios de borde
  RADIUS: {
    NONE: '0',
    SM: '0.25rem',    // 4px
    MD: '0.5rem',     // 8px
    LG: '0.75rem',    // 12px
    XL: '1rem',       // 16px
    FULL: '9999px'    // Círculo perfecto
  },
  
  // Estilos de borde
  STYLES: {
    SOLID: 'solid',
    DASHED: 'dashed',
    DOTTED: 'dotted'
  }
};

// ===================================================================
// TIEMPOS DE ANIMACIÓN
// ===================================================================
export const ANIMATIONS = {
  // Duraciones
  DURATION: {
    FAST: '150ms',
    NORMAL: '300ms',
    SLOW: '500ms'
  },
  
  // Funciones de temporización
  TIMING: {
    EASE: 'ease',
    EASE_IN: 'ease-in',
    EASE_OUT: 'ease-out',
    EASE_IN_OUT: 'ease-in-out',
    LINEAR: 'linear'
  },
  
  // Transiciones comunes
  TRANSITIONS: {
    ALL: 'all 300ms ease',
    OPACITY: 'opacity 300ms ease',
    TRANSFORM: 'transform 300ms ease',
    BACKGROUND: 'background-color 300ms ease',
    BORDER: 'border-color 300ms ease'
  }
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
  OVERLAY: 1300
};

// ===================================================================
// CONFIGURACIONES ESPECÍFICAS
// ===================================================================
export const CACHE_CONFIG = {
  // Duraciones de caché
  CACHE_DURATION: 5 * 60 * 1000,  // 5 minutos en milisegundos
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutos
  REFRESH_INTERVAL: 1000,          // 1 segundo
  
  // Límites
  MAX_ITEMS_PER_PAGE: 50,
  DEFAULT_PAGE_SIZE: 10,
  MAX_FILE_SIZE: 10 * 1024 * 1024  // 10MB
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
    SHADOW: SHADOWS.MD
  },
  
  // Tema Retro 80s
  RETRO: {
    PRIMARY_COLOR: '#ff00ff',
    SECONDARY_COLOR: '#00ffff',
    ACCENT_COLOR: '#ffff00',
    FONT_FAMILY: TYPOGRAPHY.FONT_FAMILIES.RETRO,
    BORDER_RADIUS: BORDERS.RADIUS.NONE,
    SHADOW: SHADOWS.XL
  },
  
  // Tema Default/Forestech
  DEFAULT: {
    PRIMARY_COLOR: COLORS.PRIMARY.FORESTECH_GREEN,
    SECONDARY_COLOR: COLORS.PRIMARY.FORESTECH_GREEN_LIGHT,
    ACCENT_COLOR: COLORS.FUNCTIONAL.SUCCESS,
    FONT_FAMILY: TYPOGRAPHY.FONT_FAMILIES.PRIMARY,
    BORDER_RADIUS: BORDERS.RADIUS.MD,
    SHADOW: SHADOWS.CARD
  }
};

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
  THEME_TOKENS
};

export default DESIGN_TOKENS;