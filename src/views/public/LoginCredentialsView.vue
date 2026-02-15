<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ButtonComponent, FooterComponent, InputComponent, PasswordInputComponent, ThemeToggle } from '@/components'
import {
  AUTH_ROUTE_DASHBOARD,
  AUTH_ROUTE_LOGIN,
  AUTH_ROUTE_RECOVERY,
} from '@/constants'
import { initialLoginCredentialsForm, loginCredentialsValidationRules } from '@/factories'
import { useFormValidation } from '@/composables'
import { useStoreAuth, useStoreLoginCredentials, useStoreTheme } from '@/stores'

const router = useRouter()
const storeTheme = useStoreTheme()
const storeAuth = useStoreAuth()
const storeLoginCredentials = useStoreLoginCredentials()
const { isDark } = storeToRefs(storeTheme)
const form = ref({ ...initialLoginCredentialsForm })
const showPassword = ref(false)
const { errors, validateField, onValidation } = useFormValidation(form, loginCredentialsValidationRules)

const controlShowMfaInput = computed(() => storeLoginCredentials.mfaRequired)
const controlShowAlert = computed(() => storeLoginCredentials.loginError)

const handleGoToPreLogin = () => {
  storeLoginCredentials.clearSession()
  router.push(AUTH_ROUTE_LOGIN)
}

const handleRecovery = () => {
  router.push(AUTH_ROUTE_RECOVERY)
}

const handleTogglePassword = () => {
  showPassword.value = !showPassword.value
}

const handlePasswordValue = (value: string) => {
  form.value.password = value
}

const handleTotpCodeValue = (value: string) => {
  form.value.totpCode = value.replace(/\s+/g, '')
}

const submitForm = async () => {
  const passwordValid = validateField('password')
  if (!passwordValid) return

  if (storeLoginCredentials.mfaRequired && !form.value.totpCode.trim()) return

  const success = await storeLoginCredentials.submitLogin(form.value)
  if (!success) return

  router.push(AUTH_ROUTE_DASHBOARD)
}

const handleResetViewErrors = () => {
  storeAuth.loginError = false
  storeAuth.messageAlert = {
    icon: 'fa-solid fa-circle-info',
    variant: 'info',
    message: '',
  }
}

onMounted(() => {
  handleResetViewErrors()
  const hasSession = storeLoginCredentials.hydrate()
  if (!hasSession) {
    router.push(AUTH_ROUTE_LOGIN)
    return
  }
})

onBeforeUnmount(() => {
  handleResetViewErrors()
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
          @click="handleGoToPreLogin"
        >
          <span aria-hidden="true">←</span>
          Volver al login
        </button>

        <div class="mt-4 text-center">
          <h2 class="mt-4 text-balance text-2xl font-bold">Hola, inicia sesion</h2>
          <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Ingresa tu contraseña para continuar
          </p>
        </div>

        <form class="mt-7 space-y-4" @submit.prevent="submitForm">
          <PasswordInputComponent
            :model-value="form.password"
            label="Contraseña"
            :type="showPassword ? 'text' : 'password'"
            :minlength="6"
            autocomplete="current-password"
            placeholder="••••••••"
            required
            :error="errors.password"
            :on-value-change="handlePasswordValue"
            :on-validation="onValidation('password')"
            :show-visibility-toggle="true"
            :visibility-label="showPassword ? 'Ocultar' : 'Ver'"
            :on-toggle-visibility="handleTogglePassword"
          />

          <InputComponent
            v-if="controlShowMfaInput"
            :model-value="form.totpCode"
            label="Codigo MFA"
            type="text"
            autocomplete="one-time-code"
            placeholder="123456"
            :on-value-change="handleTotpCodeValue"
          />

          <div class="flex items-center justify-end text-sm">
            <button
              type="button"
              class="font-semibold text-cyan-700 transition hover:text-cyan-800 dark:text-cyan-300 dark:hover:text-cyan-200"
              @click="handleRecovery"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <ButtonComponent
            type="submit"
            variant="solid"
            :full-width="true"
            :disabled="storeLoginCredentials.loginSubmitting"
          >
            {{ storeLoginCredentials.loginSubmitting ? 'Accediendo...' : 'Iniciar sesión' }}
          </ButtonComponent>

          <div
            v-if="controlShowAlert"
            class="rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-400/40 dark:bg-rose-900/20 dark:text-rose-200"
          >
            {{ storeLoginCredentials.messageAlert.message || 'Usuario o contraseña incorrectos.' }}
          </div>
        </form>
      </section>
    </section>

    <FooterComponent />
  </main>
</template>
