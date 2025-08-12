import React from 'react';
import { StaticRouter } from 'react-router-dom/server';

// Logo animado simplificado para SSR
const AnimatedLogoSSR = ({ size = 80 }) => (
  <div 
    className="animated-logo-ssr" 
    style={{ 
      width: size, 
      height: size,
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '1.5rem',
      boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)'
    }}
  >
    <div style={{ 
      width: '60%', 
      height: '60%', 
      background: 'white', 
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: size * 0.3,
      color: '#10b981'
    }}>
      ⛽
    </div>
  </div>
);

// Componente SSR que replica la landing page del cliente
const LoginSSR = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-teal-500 to-blue-600 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Partículas de fondo simplificadas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute top-3/4 left-3/4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
      </div>

      <div className="relative z-10 text-center max-w-lg">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <AnimatedLogoSSR size={120} />
        </div>
        
        {/* Título principal */}
        <div className="hero-text mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Sistema de
          </h1>
          <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
            Combustibles
          </h1>
          <h2 className="text-2xl font-semibold text-emerald-100 mb-4 drop-shadow-md">
            Forestech Colombia
          </h2>
          <p className="text-lg text-white/90 drop-shadow-sm">
            Gestión inteligente de recursos energéticos
          </p>
        </div>

        {/* Botón CTA */}
        <button 
          className="hero-cta-button bg-white text-emerald-600 px-8 py-4 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3 mx-auto"
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
            border: '2px solid rgba(16, 185, 129, 0.2)'
          }}
        >
          <span className="text-2xl">🚀</span>
          <span>Ingresar al Sistema</span>
        </button>

        {/* Indicador SSR */}
        <div className="mt-8 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
          <p className="text-sm text-white/80 mb-2">
            🔄 Cargando sistema de autenticación...
          </p>
          <div className="w-full bg-white/20 rounded-full h-2 mb-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-1000" 
              style={{width: '75%'}}
            ></div>
          </div>
          <p className="text-xs text-white/70">
            SSR activo - Optimizado para rendimiento
          </p>
        </div>
        
        <div className="mt-4 text-center text-sm text-white/60">
          <p>La aplicación se hidratará automáticamente</p>
        </div>
      </div>
    </div>
  );
};

// Wrapper simple para SSR
const AppSSRMinimal = ({ location }) => {
  return (
    <StaticRouter location={location}>
      <LoginSSR />
    </StaticRouter>
  );
};

export default AppSSRMinimal;
