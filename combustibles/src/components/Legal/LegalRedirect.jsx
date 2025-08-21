import { useEffect } from 'react';

const LegalRedirect = ({ type }) => {
  useEffect(() => {
    const targetUrl =
      type === 'privacy' ? '/legal/politica-privacidad.html' : '/legal/terminos-servicio.html';

    // Redirección inmediata
    window.location.replace(targetUrl);
  }, [type]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-emerald-600"></div>
        <p className="text-gray-600">Redirigiendo...</p>
        <p className="mt-2 text-sm text-gray-500">
          Si no es redirigido automáticamente,{' '}
          <a
            href={
              type === 'privacy'
                ? '/legal/politica-privacidad.html'
                : '/legal/terminos-servicio.html'
            }
            className="text-emerald-600 underline hover:text-emerald-700"
          >
            haga clic aquí
          </a>
        </p>
      </div>
    </div>
  );
};

export default LegalRedirect;
