import React from 'react';
import { Helmet } from 'react-helmet';

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Política de Privacidad - Forestech Colombia</title>
        <meta
          name="description"
          content="Política de privacidad de Forestech Colombia. Conoce cómo protegemos y manejamos tu información personal."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://forestech.co/politica-privacidad" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="overflow-hidden rounded-lg bg-white shadow-lg">
            <div className="bg-emerald-600 px-8 py-6 text-white">
              <h1 className="text-3xl font-bold">Política de Privacidad</h1>
              <p className="mt-2 text-emerald-100">Forestech Colombia S.A.S.</p>
            </div>

            <div className="prose prose-lg max-w-none px-8 py-8">
              <p className="mb-6 text-gray-600">
                <strong>Última actualización:</strong> 19 de agosto de 2025
              </p>

              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold text-gray-800">
                  1. Información que Recopilamos
                </h2>
                <p className="mb-4 text-gray-700">
                  En Forestech Colombia, recopilamos la siguiente información:
                </p>
                <ul className="list-disc space-y-2 pl-6 text-gray-700">
                  <li>
                    <strong>Información de identificación personal:</strong> Nombre, correo
                    electrónico, número de teléfono, documento de identidad.
                  </li>
                  <li>
                    <strong>Información empresarial:</strong> Nombre de la empresa, NIT, dirección
                    comercial, actividad económica.
                  </li>
                  <li>
                    <strong>Información de uso:</strong> Datos sobre cómo utiliza nuestra plataforma
                    de gestión de combustibles.
                  </li>
                  <li>
                    <strong>Información técnica:</strong> Dirección IP, tipo de navegador, sistema
                    operativo, cookies.
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold text-gray-800">
                  2. Cómo Utilizamos su Información
                </h2>
                <p className="mb-4 text-gray-700">Utilizamos su información para:</p>
                <ul className="list-disc space-y-2 pl-6 text-gray-700">
                  <li>Proporcionar y mantener nuestros servicios de gestión de combustibles</li>
                  <li>Procesar transacciones y generar reportes</li>
                  <li>Comunicarnos con usted sobre su cuenta y servicios</li>
                  <li>Mejorar nuestros servicios y desarrollar nuevas funcionalidades</li>
                  <li>Cumplir con obligaciones legales y regulatorias</li>
                  <li>Prevenir fraudes y garantizar la seguridad</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold text-gray-800">
                  3. Compartir Información
                </h2>
                <p className="mb-4 text-gray-700">
                  No vendemos ni alquilamos su información personal. Podemos compartir información
                  limitada con:
                </p>
                <ul className="list-disc space-y-2 pl-6 text-gray-700">
                  <li>
                    <strong>Proveedores de servicios:</strong> Para procesamiento de pagos, análisis
                    y soporte técnico
                  </li>
                  <li>
                    <strong>Autoridades gubernamentales:</strong> Cuando sea requerido por ley o
                    regulaciones
                  </li>
                  <li>
                    <strong>Socios comerciales:</strong> Con su consentimiento explícito
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold text-gray-800">4. Seguridad de Datos</h2>
                <p className="mb-4 text-gray-700">
                  Implementamos medidas de seguridad técnicas, administrativas y físicas para
                  proteger su información:
                </p>
                <ul className="list-disc space-y-2 pl-6 text-gray-700">
                  <li>Encriptación de datos en tránsito y en reposo</li>
                  <li>Autenticación de dos factores</li>
                  <li>Monitoreo continuo de seguridad</li>
                  <li>Acceso restringido basado en roles</li>
                  <li>Auditorías regulares de seguridad</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold text-gray-800">5. Sus Derechos</h2>
                <p className="mb-4 text-gray-700">
                  Bajo la legislación colombiana de protección de datos, usted tiene derecho a:
                </p>
                <ul className="list-disc space-y-2 pl-6 text-gray-700">
                  <li>Conocer, actualizar y rectificar sus datos personales</li>
                  <li>Solicitar prueba de la autorización otorgada</li>
                  <li>Ser informado sobre el uso de sus datos</li>
                  <li>Presentar quejas ante la Superintendencia de Industria y Comercio</li>
                  <li>Revocar la autorización y/o solicitar la supresión de datos</li>
                  <li>Acceder de forma gratuita a sus datos personales</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold text-gray-800">6. Retención de Datos</h2>
                <p className="mb-4 text-gray-700">
                  Conservamos su información personal durante el tiempo necesario para:
                </p>
                <ul className="list-disc space-y-2 pl-6 text-gray-700">
                  <li>Cumplir con los fines para los cuales fue recolectada</li>
                  <li>Cumplir con obligaciones legales (mínimo 5 años para registros contables)</li>
                  <li>Resolver disputas y hacer cumplir nuestros acuerdos</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold text-gray-800">
                  7. Cookies y Tecnologías Similares
                </h2>
                <p className="mb-4 text-gray-700">
                  Utilizamos cookies para mejorar su experiencia y proporcionar funcionalidades
                  personalizadas. Puede configurar su navegador para rechazar cookies, aunque esto
                  puede afectar algunas funcionalidades.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold text-gray-800">
                  8. Cambios a esta Política
                </h2>
                <p className="mb-4 text-gray-700">
                  Podemos actualizar esta política periódicamente. Le notificaremos sobre cambios
                  significativos a través del correo electrónico o mediante un aviso prominente en
                  nuestro sitio web.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold text-gray-800">9. Contacto</h2>
                <div className="rounded-lg bg-emerald-50 p-6">
                  <p className="mb-2 text-gray-700">
                    Para ejercer sus derechos o si tiene preguntas sobre esta política, contáctenos:
                  </p>
                  <ul className="space-y-1 text-gray-700">
                    <li>
                      <strong>Email:</strong> privacidad@forestech.co
                    </li>
                    <li>
                      <strong>Teléfono:</strong> +57 (1) 123-4567
                    </li>
                    <li>
                      <strong>Dirección:</strong> Carrera 11 #93-07, Bogotá, Colombia
                    </li>
                    <li>
                      <strong>Horario de atención:</strong> Lunes a Viernes, 8:00 AM - 6:00 PM
                    </li>
                  </ul>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
