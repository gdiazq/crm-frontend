import Link from "next/link";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Básico",
    price: "29",
    description: "Perfecto para emprendedores y pequeños negocios",
    features: [
      "Hasta 500 contactos",
      "CRM básico",
      "Pipeline de ventas",
      "2 usuarios incluidos",
      "Soporte por email",
      "Reportes básicos",
    ],
    cta: "Iniciar prueba gratis",
    popular: false,
  },
  {
    name: "Profesional",
    price: "79",
    description: "Ideal para equipos en crecimiento",
    features: [
      "Hasta 5,000 contactos",
      "CRM + ERP completo",
      "Gestión de inventario",
      "10 usuarios incluidos",
      "Soporte prioritario 24/7",
      "Reportes avanzados",
      "Facturación electrónica",
      "Integraciones API",
      "Capacitación incluida",
    ],
    cta: "Comenzar ahora",
    popular: true,
  },
  {
    name: "Empresarial",
    price: "199",
    description: "Para empresas con necesidades avanzadas",
    features: [
      "Contactos ilimitados",
      "CRM + ERP + BI avanzado",
      "Multi-almacén",
      "Usuarios ilimitados",
      "Soporte dedicado",
      "Personalización completa",
      "Auditoría y trazabilidad",
      "Múltiples empresas",
      "Onboarding personalizado",
      "SLA garantizado 99.9%",
    ],
    cta: "Contactar ventas",
    popular: false,
  },
];

export function PricingSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Planes y Precios
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Elige el plan que mejor se adapte a tu negocio. Todos incluyen 30 días de prueba gratuita.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-2xl ${
              plan.popular
                ? "bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/30 dark:to-gray-800 border-2 border-blue-500 shadow-xl"
                : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg"
            } p-8 flex flex-col`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold px-4 py-1 rounded-full shadow-lg">
                  Más Popular
                </span>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {plan.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {plan.description}
              </p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline">
                <span className="text-5xl font-extrabold text-gray-900 dark:text-white">
                  ${plan.price}
                </span>
                <span className="text-gray-600 dark:text-gray-400 ml-2">
                  /mes
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                Facturación mensual
              </p>
            </div>

            <ul className="space-y-4 mb-8 flex-grow">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <Link
              href="/register"
              className={`block text-center px-6 py-3 rounded-lg font-semibold transition ${
                plan.popular
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg"
                  : "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100"
              }`}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          ¿Necesitas un plan personalizado?{" "}
          <Link href="/contact" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
            Contáctanos
          </Link>
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
          Todos los precios están en USD. Sin cargos ocultos. Cancela cuando quieras.
        </p>
      </div>
    </section>
  );
}
