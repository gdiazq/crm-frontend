<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ButtonComponent, FooterComponent, PasswordInputComponent, ThemeToggle } from '@/components'
import { AUTH_ROUTE_LOGIN } from '@/constants'
import { initialCreatePasswordForm } from '@/factories'
import { mapperCreatePasswordPayload, mapperMissingPasswordRequirements, mapperPasswordRequirements } from '@/mappers'
import { useStoreAuth, useStoreTheme } from '@/stores'

const PASSWORD_TOKEN_MAX_AGE_MS = 2 * 60 * 1000

const router = useRouter()
const storeAuth = useStoreAuth()
const storeTheme = useStoreTheme()
const { isDark } = storeToRefs(storeTheme)
const { createPasswordSubmitting, errorMessage, successMessage, pendingPasswordToken, pendingPasswordTokenIssuedAt } = storeToRefs(storeAuth)

const form = ref({ ...initialCreatePasswordForm })
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const remainingSeconds = ref(0)
let expirationTimer: ReturnType<typeof setTimeout> | null = null
let countdownTimer: ReturnType<typeof setInterval> | null = null

const passwordRequirements = computed(() => mapperPasswordRequirements(form.value.password, 10))
const missingPasswordRequirements = computed(() => mapperMissingPasswordRequirements(passwordRequirements.value))
const controlPasswordsMatch = computed(() => form.value.password.length > 0 && form.value.password === form.value.confirmPassword)

const controlIsValidForm = computed(() => {
  return (
    Boolean(pendingPasswordToken.value) &&
    missingPasswordRequirements.value.length === 0 &&
    controlPasswordsMatch.value
  )
})

const handlePasswordValue = (value: string) => {
  form.value.password = value
}

const handleConfirmPasswordValue = (value: string) => {
  form.value.confirmPassword = value
}

const handleTogglePassword = () => {
  showPassword.value = !showPassword.value
}

const handleToggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

const handleMessageAlert = (message: string) => {
  errorMessage.value = message
}

const clearTimers = () => {
  if (expirationTimer) {
    clearTimeout(expirationTimer)
    expirationTimer = null
  }
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
}

const redirectToLoginByExpiration = () => {
  clearTimers()
  storeAuth.clearPendingPasswordToken()
  router.push(AUTH_ROUTE_LOGIN)
}

const setupTokenExpiration = () => {
  if (!pendingPasswordToken.value || !pendingPasswordTokenIssuedAt.value) {
    handleMessageAlert('No hay token para crear contraseña. Verifica tu correo nuevamente.')
    redirectToLoginByExpiration()
    return
  }

  const expiresAt = pendingPasswordTokenIssuedAt.value + PASSWORD_TOKEN_MAX_AGE_MS
  const remainingMs = expiresAt - Date.now()
  if (remainingMs <= 0) {
    handleMessageAlert('El token para crear contraseña expiro. Vuelve a iniciar el proceso.')
    redirectToLoginByExpiration()
    return
  }

  remainingSeconds.value = Math.ceil(remainingMs / 1000)
  countdownTimer = setInterval(() => {
    const seconds = Math.ceil((expiresAt - Date.now()) / 1000)
    remainingSeconds.value = Math.max(seconds, 0)
    if (remainingSeconds.value === 0) {
      clearTimers()
    }
  }, 1000)

  expirationTimer = setTimeout(() => {
    handleMessageAlert('El token para crear contraseña expiro. Vuelve a iniciar el proceso.')
    redirectToLoginByExpiration()
  }, remainingMs)
}

const submitForm = async () => {
  if (!controlIsValidForm.value) {
    const issues = [...missingPasswordRequirements.value]
    if (!controlPasswordsMatch.value) issues.push('La confirmacion de contraseña no coincide')
    handleMessageAlert(`Faltan requisitos: ${issues.join(', ')}.`)
    return
  }

  const payload = mapperCreatePasswordPayload(pendingPasswordToken.value || '', form.value.password)
  const success = await storeAuth.createPassword(payload)
  if (success) {
    clearTimers()
    storeAuth.reset()
    router.push(AUTH_ROUTE_LOGIN)
  }
}

const handleGoLogin = () => {
  router.push(AUTH_ROUTE_LOGIN)
}

onMounted(() => {
  setupTokenExpiration()
})

onBeforeUnmount(() => {
  clearTimers()
})
</script>

<template>
  <main class="relative flex min-h-screen flex-col overflow-hidden bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
    <div class="fixed right-4 top-4 z-50">
      <ThemeToggle :is-dark="isDark" :on-toggle="storeTheme.toggleTheme" />
    </div>
    <div class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(8,145,178,0.12),_transparent_45%),radial-gradient(circle_at_80%_20%,_rgba(14,116,144,0.1),_transparent_35%)] dark:bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_40%),radial-gradient(circle_at_80%_20%,_rgba(14,165,233,0.12),_transparent_35%)]"></div>

    <section class="flex flex-1 items-center justify-center p-6">
      <section class="w-full max-w-md rounded-2xl border border-slate-200 bg-white/90 p-8 shadow-2xl shadow-slate-200/70 backdrop-blur dark:border-white/10 dark:bg-slate-900/75 dark:shadow-none">
        <button
          type="button"
          class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600 opacity-90 transition hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:text-slate-300 dark:focus-visible:ring-offset-slate-950"
          @click="handleGoLogin"
        >
          <span aria-hidden="true">←</span>
          Volver al login
        </button>

        <h1 class="mt-4 text-balance text-2xl font-bold">Crea tu contraseña</h1>
        <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">Tiempo restante: {{ remainingSeconds }}s</p>

        <div class="mt-4 grid gap-1 text-xs">
          <p
            v-for="requirement in passwordRequirements"
            :key="requirement.label"
            :class="requirement.valid ? 'text-emerald-500' : 'text-slate-500 dark:text-slate-400'"
          >
            {{ requirement.valid ? '✓' : '•' }} {{ requirement.label }}
          </p>
        </div>

        <form class="mt-7 space-y-4" @submit.prevent="submitForm">
          <PasswordInputComponent
            :model-value="form.password"
            label="Nueva contraseña"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="new-password"
            :minlength="10"
            :on-value-change="handlePasswordValue"
            :show-visibility-toggle="true"
            :visibility-label="showPassword ? 'Ocultar' : 'Ver'"
            :on-toggle-visibility="handleTogglePassword"
            required
          />

          <PasswordInputComponent
            :model-value="form.confirmPassword"
            label="Confirmar contraseña"
            :type="showConfirmPassword ? 'text' : 'password'"
            autocomplete="new-password"
            :minlength="10"
            :on-value-change="handleConfirmPasswordValue"
            :show-visibility-toggle="true"
            :visibility-label="showConfirmPassword ? 'Ocultar' : 'Ver'"
            :on-toggle-visibility="handleToggleConfirmPassword"
            required
          />

          <p v-if="form.confirmPassword && !controlPasswordsMatch" class="text-xs text-rose-400">
            Las contraseñas no coinciden.
          </p>

          <ButtonComponent type="submit" variant="solid" :full-width="true" :disabled="createPasswordSubmitting">
            {{ createPasswordSubmitting ? 'Guardando...' : 'Crear contraseña' }}
          </ButtonComponent>
        </form>

        <p v-if="errorMessage" class="mt-3 text-sm text-rose-400">
          {{ errorMessage }}
        </p>
        <p v-else-if="successMessage" class="mt-3 text-sm text-emerald-400">
          {{ successMessage }}
        </p>
      </section>
    </section>

    <FooterComponent />
  </main>
</template>
