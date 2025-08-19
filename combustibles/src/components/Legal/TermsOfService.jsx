import React from 'react';
import { Helmet } from 'react-helmet';

const TermsOfService = () => {
  return (
    <>
      <Helmet>
        <title>Términos de Servicio - Forestech Colombia</title>
        <meta
          name="description"
          content="Términos y condiciones de servicio de Forestech Colombia. Conoce las condiciones de uso de nuestros servicios."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://forestech.co/terminos-servicio" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="overflow-hidden rounded-lg bg-white shadow-lg">
            <div className="bg-emerald-600 px-8 py-6 text-white">
              <h1 className="text-3xl font-bold">Términos de Servicio</h1>
              <p className="mt-2 text-emerald-100">Forestech Colombia S.A.S.</p>
            </div>

            <div className="prose prose-lg max-w-none px-8 py-8">
              <p className="mb-6 text-gray-600">
                <strong>Última actualización:</strong> 19 de agosto de 2025
              </p>

              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold text-gray-800">
                  1. Aceptación de los Términos
                </h2>
                <p className="mb-4 text-gray-700">
                  Al acceder y utilizar los servicios de Forestech Colombia S.A.S. ("Forestech",
                  "nosotros", "nuestro"), usted acepta estar sujeto a estos Términos de Servicio
                  ("Términos"). Si no está de acuerdo con alguna parte de estos términos, no debe
                  utilizar nuestros servicios.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold text-gray-800">
                  2. Descripción del Servicio
                </h2>
                <p className="mb-4 text-gray-700">Forestech Colombia proporciona servicios de:</p>
                <ul className="list-disc space-y-2 pl-6 text-gray-700">
                  <li>
                    <strong>Gestión de Combustibles:</strong> Sistema integral para el control y
                    administración de inventarios de combustibles
                  </li>
                  <li>
                    <strong>Gestión de Alimentación:</strong> Plataforma para liquidación y control
                    de servicios de alimentación
                  </li>
                  <li>
                    <strong>Monitoreo SSR:</strong> Sistema de alertas automáticas para
                    infraestructura crítica
                  </li>
                  <li>
                    <strong>Notificaciones Automáticas:</strong> Envío de alertas por email,
                    WhatsApp y otros canales
                  </li>
                  <li>
                    <strong>Reportes y Analytics:</strong> Generación automática de reportes
                    operacionales
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold text-gray-800">3. Registro de Cuenta</h2>
                <p className="mb-4 text-gray-700">
                  Para utilizar nuestros servicios, debe crear una cuenta proporcionando información
                  precisa y completa. Usted es responsable de:
                </p>
                <ul className="list-disc space-y-2 pl-6 text-gray-700">
                  <li>Mantener la confidencialidad de su cuenta y contraseña</li>
                  <li>Todas las actividades que ocurran bajo su cuenta</li>
                  <li>Notificar inmediatamente cualquier uso no autorizado</li>
                  <li>Proporcionar información veraz y actualizada</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold text-gray-800">4. Uso Aceptable</h2>
                <p className="mb-4 text-gray-700">
                  Al usar nuestros servicios, usted se compromete a:
                </p>
                <ul className="list-disc space-y-2 pl-6 text-gray-700">
                  <li>Cumplir con todas las leyes y regulaciones aplicables</li>
                  <li>No utilizar los servicios para actividades ilegales o fraudulentas</li>
                  <li>No intentar acceder a sistemas o datos no autorizados</li>
                  <li>No interferir con el funcionamiento normal de los servicios</li>
                  <li>No transmitir malware, virus o código malicioso</li>
                  <li>Respetar los derechos de propiedad intelectual</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold text-gray-800">
                  5. Privacidad y Protección de Datos
                </h2>
                <p className="mb-4 text-gray-700">
                  El manejo de su información personal se rige por nuestra{' '}
                  <a
                    href="/politica-privacidad"
                    className="text-emerald-600 underline hover:text-emerald-700"
                  >
                    Política de Privacidad
                  </a>
                  , la cual forma parte integral de estos Términos. Cumplimos con la Ley 1581 de
                  2012 de Colombia sobre protección de datos personales.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold text-gray-800">
                  6. Notificaciones Automáticas
                </h2>
                <p className="mb-4 text-gray-700">
                  Al utilizar nuestros servicios de alertas automáticas, usted consiente recibir
                  notificaciones a través de:
                </p>
                <ul className="list-disc space-y-2 pl-6 text-gray-700">
                  <li>
                    <strong>Correo electrónico:</strong> Para alertas de sistema y comunicaciones
                    importantes
                  </li>
                  <li>
                    <strong>WhatsApp Business:</strong> Para alertas críticas que requieren atención
                    inmediata
                  </li>
                  <li>
                    <strong>SMS:</strong> Para confirmaciones y alertas de seguridad
                  </li>
                  <li>
                    <strong>Notificaciones Push:</strong> En aplicaciones móviles cuando estén
                    disponibles
                  </li>
                </ul>
                <p className="mt-4 text-gray-700">
                  Estas notificaciones son parte esencial del servicio y pueden ser configuradas
                  pero no completamente desactivadas.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold text-gray-800">
                  7. Propiedad Intelectual
                </h2>
                <p className="mb-4 text-gray-700">
                  Todos los derechos de propiedad intelectual sobre los servicios, incluidos
                  software, diseños, textos, gráficos, logotipos y marcas comerciales, pertenecen a
                  Forestech Colombia o sus licenciantes.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold text-gray-800">
                  8. Limitación de Responsabilidad
                </h2>
                <p className="mb-4 text-gray-700">En la medida permitida por la ley:</p>
                <ul className="list-disc space-y-2 pl-6 text-gray-700">
                  <li>
                    Los servicios se proporcionan "tal como están" sin garantías expresas o
                    implícitas
                  </li>
                  <li>
                    No garantizamos que los servicios estén libres de errores o interrupciones
                  </li>
                  <li>
                    Nuestra responsabilidad máxima no excederá el monto pagado por los servicios en
                    los últimos 12 meses
                  </li>
                  <li>
                    No seremos responsables por daños indirectos, incidentales o consecuenciales
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold text-gray-800">9. Terminación</h2>
                <p className="mb-4 text-gray-700">
                  Cualquiera de las partes puede terminar este acuerdo con previo aviso de 30 días.
                  Podemos suspender o terminar su acceso inmediatamente en caso de violación de
                  estos Términos.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold text-gray-800">10. Modificaciones</h2>
                <p className="mb-4 text-gray-700">
                  Nos reservamos el derecho de modificar estos Términos en cualquier momento. Las
                  modificaciones serán efectivas al ser publicadas en nuestro sitio web. Su uso
                  continuado de los servicios constituye aceptación de los términos modificados.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold text-gray-800">11. Ley Aplicable</h2>
                <p className="mb-4 text-gray-700">
                  Estos Términos se regirán por las leyes de la República de Colombia. Cualquier
                  disputa será resuelta por los tribunales competentes de Bogotá, D.C.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold text-gray-800">12. Contacto</h2>
                <div className="rounded-lg bg-gray-50 p-6">
                  <p className="mb-2 text-gray-700">
                    <strong>Forestech Colombia S.A.S.</strong>
                  </p>
                  <p className="mb-2 text-gray-700">
                    Correo electrónico:{' '}
                    <a
                      href="mailto:cardenasever072@gmail.com"
                      className="text-emerald-600 hover:text-emerald-700"
                    >
                      cardenasever072@gmail.com
                    </a>
                  </p>
                  <p className="mb-2 text-gray-700">
                    Sitio web:{' '}
                    <a
                      href="https://forestechdecolombia.com.co"
                      className="text-emerald-600 hover:text-emerald-700"
                    >
                      forestechdecolombia.com.co
                    </a>
                  </p>
                  <p className="text-gray-700">
                    Para consultas sobre estos Términos de Servicio o nuestros servicios, no dude en
                    contactarnos a través de los medios indicados.
                  </p>
                </div>
              </section>

              <div className="mt-8 border-t pt-6">
                <p className="text-center text-sm text-gray-500">
                  © 2025 Forestech Colombia S.A.S. Todos los derechos reservados.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsOfService;
