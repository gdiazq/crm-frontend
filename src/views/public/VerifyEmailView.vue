<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ButtonComponent, FooterComponent, ResendVerificationModal, ThemeToggle, VerificationCodeInputComponent } from '@/components'
import { AUTH_ROUTE_CREATE_PASSWORD, AUTH_ROUTE_LOGIN } from '@/constants'
import { initialResendVerificationForm, initialVerifyEmailForm, verifyEmailValidationRules } from '@/factories'
import { useFormValidation } from '@/composables'
import { mapperResendVerificationPayload, mapperVerifyEmailPayload } from '@/mappers'
import { useStoreAuth, useStoreTheme } from '@/stores'

const router = useRouter()
const storeAuth = useStoreAuth()
const storeTheme = useStoreTheme()
const { isDark } = storeToRefs(storeTheme)
const { verifySubmitting, resendSubmitting, errorMessage, successMessage, pendingVerifyEmail, pendingVerifyPhone } = storeToRefs(storeAuth)

const form = ref({ ...initialVerifyEmailForm })
const resendForm = ref({ ...initialResendVerificationForm })
const showResendModal = ref(false)
const resendModalError = ref<string | null>(null)
const { errors, validateAll } = useFormValidation(form, verifyEmailValidationRules)

const handleCodeValue = (value: string) => {
  form.value.code = value
}

const handleMessageAlert = (message: string) => {
  errorMessage.value = message
}

const normalizePhone = (value: string) => {
  return value.replace(/\s+/g, '')
}

const handleResendCode = async () => {
  resendModalError.value = null

  if (!pendingVerifyEmail.value) {
    resendModalError.value = 'No se encontro el correo para reenviar el codigo.'
    return
  }

  if (!pendingVerifyPhone.value) {
    resendModalError.value = 'No se encontro el telefono de verificacion. Vuelve a registrarte.'
    return
  }

  if (!resendForm.value.phoneNumber.trim()) {
    resendModalError.value = 'Debes ingresar tu numero de telefono para reenviar el codigo.'
    return
  }

  const inputPhone = normalizePhone(resendForm.value.phoneNumber)
  const expectedPhone = normalizePhone(pendingVerifyPhone.value)
  if (inputPhone !== expectedPhone) {
    resendModalError.value = 'El numero de telefono no coincide con el registrado.'
    return
  }

  const payload = mapperResendVerificationPayload(pendingVerifyEmail.value, resendForm.value.phoneNumber)
  const success = await storeAuth.resendVerification(payload)
  if (success) {
    form.value.code = ''
    resendForm.value.phoneNumber = ''
    closeResendModal()
    return
  }

  resendModalError.value = errorMessage.value || 'No se pudo reenviar el codigo.'
  errorMessage.value = null
}

const openResendModal = () => {
  resendForm.value.phoneNumber = ''
  resendModalError.value = null
  showResendModal.value = true
}

const closeResendModal = () => {
  resendModalError.value = null
  showResendModal.value = false
}

const handleResendPhoneValue = (value: string) => {
  resendForm.value.phoneNumber = value
}

const submitForm = async () => {
  if (!pendingVerifyEmail.value) {
    handleMessageAlert('No se encontro el correo a verificar o falta el codigo.')
    return
  }

  if (!validateAll()) {
    return
  }

  const payload = mapperVerifyEmailPayload(pendingVerifyEmail.value, form.value.code)
  const success = await storeAuth.verifyEmail(payload)
  if (success) {
    router.push(AUTH_ROUTE_CREATE_PASSWORD)
  }
}

const handleGoLogin = () => {
  router.push(AUTH_ROUTE_LOGIN)
}

onMounted(() => {
  if (!pendingVerifyEmail.value) handleMessageAlert('No se encontro el correo a verificar. Vuelve a registrarte.')
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

        <h1 class="mt-4 text-balance text-2xl font-bold">Verifica tu correo</h1>
        <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Ingresa el codigo enviado al correo para activar tu cuenta.
        </p>

        <form class="mt-7 space-y-4" @submit.prevent="submitForm">
          <VerificationCodeInputComponent :model-value="form.code" :error="errors.code" :on-value-change="handleCodeValue" />

          <button
            type="button"
            class="text-xs font-semibold text-cyan-700 transition hover:text-cyan-800 disabled:cursor-not-allowed disabled:opacity-50 dark:text-cyan-300 dark:hover:text-cyan-200"
            :disabled="resendSubmitting"
            @click="openResendModal"
          >
            {{ resendSubmitting ? 'Reenviando codigo...' : 'Reenviar codigo' }}
          </button>

          <ButtonComponent type="submit" variant="solid" :full-width="true" :disabled="verifySubmitting">
            {{ verifySubmitting ? 'Verificando...' : 'Verificar correo' }}
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

    <ResendVerificationModal
      :open="showResendModal"
      :phone-number="resendForm.phoneNumber"
      :submitting="resendSubmitting"
      :error-message="resendModalError"
      :on-close="closeResendModal"
      :on-confirm="handleResendCode"
      :on-phone-number-change="handleResendPhoneValue"
    />
  </main>
</template>
