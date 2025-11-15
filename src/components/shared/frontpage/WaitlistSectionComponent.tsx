"use client"

import { useState } from "react"

export function WaitlistSection() {
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica para enviar a la API
    console.log("Waitlist submission:", { email, company })
    setSubmitted(true)
    setEmail("")
    setCompany("")

    // Resetear después de 3 segundos
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <section id="waitlist" className="bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Solicita una Demo Personalizada
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Descubre cómo BusinessHub puede transformar tu negocio. Agenda una demostración
            gratuita con nuestro equipo y te mostraremos todas las funcionalidades.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mx-auto mt-10 max-w-md">
          <div className="grid grid-cols-1 gap-4">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border-0 px-4 
                          py-3 text-gray-900 dark:text-white 
                          shadow-sm ring-1 ring-inset ring-gray-300 
                          dark:ring-gray-700 placeholder:text-gray-400 
                          focus:ring-2 focus:ring-inset focus:ring-blue-600 
                          dark:bg-gray-800 outline-none transition"
                placeholder="Tu email corporativo"
              />
            </div>

            {/* Company Input */}
            <div>
              <label htmlFor="company" className="sr-only">
                Empresa
              </label>
              <input
                id="company"
                name="company"
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full rounded-md border-0 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:bg-gray-800 outline-none transition"
                placeholder="Nombre de tu empresa"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition"
            >
              Solicitar Demo Ahora
            </button>
          </div>

          {/* Success Message */}
          {submitted && (
            <div className="mt-4 rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-4 py-3 text-center">
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                ✓ ¡Gracias! Te contactaremos pronto para agendar tu demo.
              </p>
            </div>
          )}
        </form>

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Respuesta en menos de 24 horas • Demo personalizada de 30 minutos • Sin compromiso
        </p>
      </div>
    </section>
  )
}
