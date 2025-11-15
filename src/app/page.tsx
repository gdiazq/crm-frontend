import Link from "next/link";
import { ThemeToggle } from "@/components/ui/toggle/theme-toggle";
import { PricingSection } from "@/components/shared/frontpage/pricing-section";
import { WaitlistSection } from "@/components/shared/frontpage/waitlist-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Navbar */}
      <nav className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                BusinessHub
              </h1>
            </div>
            <div className="flex gap-4 items-center">
              <ThemeToggle />
              <Link
                href="/login"
                className="text-sm font-semibold leading-6 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition"
              >
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            {/* Title */}
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              Gestión Empresarial{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Todo en Uno
              </span>
            </h1>

            {/* Description */}
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Plataforma integrada de CRM y ERP para PyMEs. Controla ventas, inventario,
              finanzas y clientes desde un solo lugar. Simplifica tu operación empresarial.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/register"
                className="rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition"
              >
                Comenzar
              </Link>
              <a
                href="#waitlist"
                className="text-sm font-semibold leading-6 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                Quiero una demo <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>

        {/* Decorative blobs */}
        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
          <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-blue-400 to-purple-600 opacity-20 dark:opacity-10 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center mb-4 dark:text-white">
          Módulos Integrados para tu Negocio
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-16 max-w-2xl mx-auto">
          CRM y ERP trabajando juntos para automatizar procesos, mejorar la eficiencia y tomar decisiones informadas
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 - CRM */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition border-l-4 border-blue-500">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">CRM</span>
            </div>
            <h3 className="text-lg font-semibold mb-2 dark:text-white">Gestión de Clientes</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Base de datos centralizada con historial completo, seguimiento de interacciones y segmentación avanzada.
            </p>
          </div>

          {/* Feature 2 - CRM */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition border-l-4 border-blue-500">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">CRM</span>
            </div>
            <h3 className="text-lg font-semibold mb-2 dark:text-white">Pipeline de Ventas</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Gestiona oportunidades desde el primer contacto hasta el cierre, con pronósticos y análisis de conversión.
            </p>
          </div>

          {/* Feature 3 - ERP */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition border-l-4 border-purple-500">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">ERP</span>
            </div>
            <h3 className="text-lg font-semibold mb-2 dark:text-white">Control de Inventario</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Administra stock en tiempo real, alertas de reabastecimiento, trazabilidad de productos y múltiples almacenes.
            </p>
          </div>

          {/* Feature 4 - ERP */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition border-l-4 border-purple-500">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">ERP</span>
            </div>
            <h3 className="text-lg font-semibold mb-2 dark:text-white">Contabilidad y Finanzas</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Facturación electrónica, control de gastos, flujo de caja, reportes financieros y conciliación bancaria.
            </p>
          </div>

          {/* Feature 5 - ERP */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition border-l-4 border-purple-500">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">ERP</span>
            </div>
            <h3 className="text-lg font-semibold mb-2 dark:text-white">Compras y Proveedores</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Órdenes de compra, gestión de proveedores, comparación de precios y control de recepciones.
            </p>
          </div>

          {/* Feature 6 - Analytics */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition border-l-4 border-green-500">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-green-600 dark:text-green-400">ANALYTICS</span>
            </div>
            <h3 className="text-lg font-semibold mb-2 dark:text-white">Business Intelligence</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Dashboards personalizables, KPIs en tiempo real, reportes automatizados y análisis predictivo.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection />

      {/* Waitlist Section */}
      <WaitlistSection />

      {/* Footer */}
      <footer className="border-t bg-gray-50 dark:bg-gray-900 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p>&copy; 2025 BusinessHub. Todos los derechos reservados.</p>
            <p className="text-sm mt-2">Sistema de gestión empresarial CRM + ERP</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
