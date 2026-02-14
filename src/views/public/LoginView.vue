<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ButtonComponent, FooterComponent, InputComponent, PasswordInputComponent, ThemeToggle } from '@/components'
import { loginValidationRules, initialLoginForm } from '@/factories'
import { useFormValidation } from '@/composables'
import { mapperLoginPayload } from '@/mappers'
import { useStoreAuth, useStoreTheme } from '@/stores'

const router = useRouter()
const storeAuth = useStoreAuth()
const storeTheme = useStoreTheme()
const { isDark } = storeToRefs(storeTheme)
const form = ref({ ...initialLoginForm })
const remindMe = ref(false)
const showPassword = ref(false)
const loginStep = ref<'email' | 'credentials'>('email')
const { errors, validateField, onValidation } = useFormValidation(form, loginValidationRules)

const controlLoginAlert = computed(() => {
  return storeAuth.loginError || storeAuth.mfaRequired
})
const controlIsInfoAlert = computed(() => storeAuth.messageAlert.variant === 'info')
const controlShowMfaInput = computed(() => storeAuth.mfaRequired)
const controlShowEmailStep = computed(() => loginStep.value === 'email')
const controlShowCredentialsStep = computed(() => loginStep.value === 'credentials')
const controlHeaderBackLabel = computed(() => (controlShowEmailStep.value ? 'Volver al inicio' : 'Volver al login'))
const controlShowTopAlert = computed(() => controlLoginAlert.value && controlShowCredentialsStep.value)
const controlShowBottomEmailAlert = computed(() => controlLoginAlert.value && controlShowEmailStep.value && !controlIsInfoAlert.value)

const handleMessageAlert = (message?: string) => {
  storeAuth.loginError = true
  storeAuth.messageAlert = {
    icon: 'fa-solid fa-triangle-exclamation',
    variant: 'error',
    message: message || 'Debes completar usuario y contraseña.',
  }
}

const submitForm = async () => {
  if (controlShowEmailStep.value) {
    const emailValid = validateField('email')
    if (!emailValid) return

    const canContinue = await storeAuth.preLogin(form.value.email)
    if (!canContinue) return

    loginStep.value = 'credentials'
    return
  }

  const passwordValid = validateField('password')
  if (!passwordValid) {
    return
  }

  if (storeAuth.mfaRequired && !form.value.totpCode.trim()) {
    handleMessageAlert('Ingresa tu codigo MFA de 6 digitos.')
    return
  }

  const payload = mapperLoginPayload(form.value.email, form.value.password, form.value.totpCode)
  const success = await storeAuth.login(payload)
  if (!success) {
    handleMessageAlert(storeAuth.messageAlert.message || 'Usuario o contraseña incorrectos.')
    return
  }

  if (remindMe.value) {
    localStorage.setItem('rememberEmail', form.value.email)
  } else {
    localStorage.removeItem('rememberEmail')
  }
  router.push('/dashboard')
}

const handleRecovery = () => {
  storeAuth.loginError = false
  router.push('/recovery')
}

const handleBackToEmail = () => {
  loginStep.value = 'email'
  form.value.password = ''
  form.value.totpCode = ''
  storeAuth.loginError = false
  storeAuth.clearMfaRequired()
}

const handleTogglePassword = () => {
  showPassword.value = !showPassword.value
}

const handleEmailValue = (value: string) => {
  form.value.email = value
  if (storeAuth.mfaRequired) {
    form.value.totpCode = ''
    storeAuth.clearMfaRequired()
  }
}

const handlePasswordValue = (value: string) => {
  form.value.password = value
  if (storeAuth.mfaRequired) {
    form.value.totpCode = ''
    storeAuth.clearMfaRequired()
  }
}

const handleTotpCodeValue = (value: string) => {
  form.value.totpCode = value.replace(/\s+/g, '')
}

const handleMicrosoftLogin = () => {
  storeAuth.loginError = true
  storeAuth.messageAlert = {
    icon: 'fa-solid fa-circle-info',
    variant: 'info',
    message: 'Login con Microsoft estara disponible pronto.',
  }
}

const handleGoHome = () => {
  router.push('/')
}

const handleHeaderBack = () => {
  if (controlShowCredentialsStep.value) {
    handleBackToEmail()
    return
  }
  handleGoHome()
}

onMounted(() => {
  storeAuth.loginError = false
  storeAuth.clearMfaRequired()
  storeAuth.messageAlert = {
    icon: 'fa-solid fa-circle-info',
    variant: 'info',
    message: '',
  }
  const rememberedEmail = localStorage.getItem('rememberEmail')
  if (rememberedEmail) {
    form.value.email = rememberedEmail
    remindMe.value = true
  }
})

onBeforeUnmount(() => {
  storeAuth.loginError = false
  storeAuth.clearMfaRequired()
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
          @click="handleHeaderBack"
        >
          <span aria-hidden="true">←</span>
          {{ controlHeaderBackLabel }}
        </button>

        <div class="mt-4 text-center">
          <h2 class="mt-4 text-balance text-2xl font-bold">Hola, inicia sesion</h2>
          <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Ingresando los datos de tu cuenta corporativa
          </p>
        </div>

        <form class="mt-7 space-y-4" @submit.prevent="submitForm">
          <div
            v-if="controlShowTopAlert"
            class="rounded-lg border px-3 py-2 text-sm"
            :class="[
              controlIsInfoAlert
                ? 'border-cyan-300 bg-cyan-50 text-cyan-700 dark:border-cyan-400/40 dark:bg-cyan-900/20 dark:text-cyan-200'
                : 'border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-400/40 dark:bg-rose-900/20 dark:text-rose-200',
            ]"
          >
            {{ storeAuth.messageAlert.message || 'Usuario o contraseña incorrectos.' }}
          </div>

          <InputComponent
            v-if="controlShowEmailStep"
            :model-value="form.email"
            label="Correo electrónico"
            type="text"
            autocomplete="username"
            placeholder="Ingresa tu correo"
            :error="errors.email"
            :on-value-change="handleEmailValue"
            :on-validation="onValidation('email')"
            required
          />

          <template v-if="controlShowCredentialsStep">
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
          </template>

          <div class="flex items-center justify-between text-sm">
            <label class="inline-flex items-center gap-2">
              <input v-model="remindMe" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-400" />
              <span class="text-slate-600 dark:text-slate-300">Recordarme</span>
            </label>
            <button
              v-if="controlShowCredentialsStep"
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
            :disabled="storeAuth.loginSubmitting || storeAuth.preLoginSubmitting"
          >
            {{
              controlShowEmailStep
                ? storeAuth.preLoginSubmitting
                  ? 'Validando...'
                  : 'Continuar'
                : storeAuth.loginSubmitting
                  ? 'Accediendo...'
                  : 'Iniciar sesión'
            }}
          </ButtonComponent>

          <div
            v-if="controlShowBottomEmailAlert"
            class="rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-400/40 dark:bg-rose-900/20 dark:text-rose-200"
          >
            {{ storeAuth.messageAlert.message || 'Correo invalido o no registrado.' }}
          </div>

          <template v-if="controlShowCredentialsStep">
          <div class="flex items-center gap-3 py-1">
            <div class="h-px flex-1 bg-slate-300 dark:bg-slate-700"></div>
            <span class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">o</span>
            <div class="h-px flex-1 bg-slate-300 dark:bg-slate-700"></div>
          </div>

          <button
            type="button"
            class="inline-flex w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-cyan-300/60"
            :disabled="storeAuth.loginSubmitting"
            @click="handleMicrosoftLogin"
          >
            Continuar con Microsoft
          </button>
          </template>
        </form>
      </section>
    </section>

    <FooterComponent />
  </main>
</template>
