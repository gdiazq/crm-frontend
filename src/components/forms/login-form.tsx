"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button/button"
import { Input } from "@/components/ui/input/input"
import { Label } from "@/components/ui/label/label"

interface LoginFormProps {
  onSuccess?: () => void
  showForgotPassword?: boolean
}

export function LoginForm({ onSuccess, showForgotPassword = true }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica de autenticación
    console.log("Login:", { email, password })
    onSuccess?.()
  }

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica para enviar email de recuperación
    console.log("Forgot password:", { email })
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setIsForgotPassword(false)
      setEmail("")
    }, 3000)
  }

  if (isForgotPassword) {
    return (
      <div className="space-y-4">
        <div className="text-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recuperar contraseña
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Ingresa tu correo y te enviaremos instrucciones
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="forgot-email">Correo electrónico</Label>
              <Input
                id="forgot-email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Enviar instrucciones
            </Button>
            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsForgotPassword(false)}
                className="text-sm text-gray-600 dark:text-gray-400 hover:underline"
              >
                Volver a iniciar sesión
              </button>
            </div>
          </form>
        ) : (
          <div className="rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-4 py-3 text-center">
            <p className="text-sm font-medium text-green-800 dark:text-green-200">
              ✓ Te hemos enviado un correo con las instrucciones
            </p>
          </div>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Correo electrónico</Label>
        <Input
          id="email"
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full">
        Iniciar sesión
      </Button>
      {showForgotPassword && (
        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsForgotPassword(true)}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>
      )}
    </form>
  )
}
