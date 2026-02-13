<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ButtonComponent, FooterComponent, InputComponent, ThemeToggle, VerificationCodeInputComponent } from '@/components'
import { useStoreAuth } from '@/stores'

const router = useRouter()
const storeAuth = useStoreAuth()
const { verifySubmitting, resendSubmitting, errorMessage, successMessage, pendingVerifyEmail, pendingVerifyPhone } = storeToRefs(storeAuth)

const form = ref({
  code: '',
})
const resendPhone = ref('')
const showResendModal = ref(false)
const resendModalError = ref<string | null>(null)

const controlIsValidForm = computed(() => {
  return Boolean(pendingVerifyEmail.value && form.value.code)
})

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

  if (!resendPhone.value.trim()) {
    resendModalError.value = 'Debes ingresar tu numero de telefono para reenviar el codigo.'
    return
  }

  const inputPhone = normalizePhone(resendPhone.value)
  const expectedPhone = normalizePhone(pendingVerifyPhone.value)
  if (inputPhone !== expectedPhone) {
    resendModalError.value = 'El numero de telefono no coincide con el registrado.'
    return
  }

  const success = await storeAuth.resendVerification({
    email: pendingVerifyEmail.value,
    phoneNumber: resendPhone.value.trim(),
  })
  if (success) {
    form.value.code = ''
    resendPhone.value = ''
    closeResendModal()
    router.replace('/verify-email')
    return
  }

  resendModalError.value = errorMessage.value || 'No se pudo reenviar el codigo.'
  errorMessage.value = null
}

const openResendModal = () => {
  resendPhone.value = ''
  resendModalError.value = null
  showResendModal.value = true
}

const closeResendModal = () => {
  resendModalError.value = null
  showResendModal.value = false
}

const submitForm = async () => {
  if (!controlIsValidForm.value) {
    handleMessageAlert('No se encontro el correo a verificar o falta el codigo.')
    return
  }

  const success = await storeAuth.verifyEmail({ email: pendingVerifyEmail.value || '', code: form.value.code })
  if (success) {
    router.push('/create-password')
  }
}

const handleGoLogin = () => {
  router.push('/login')
}

onMounted(() => {
  if (!pendingVerifyEmail.value) handleMessageAlert('No se encontro el correo a verificar. Vuelve a registrarte.')
})
</script>

<template>
  <main class="relative flex min-h-screen flex-col overflow-hidden bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
    <div class="fixed right-4 top-4 z-50">
      <ThemeToggle />
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
          <VerificationCodeInputComponent v-model="form.code" @update:model-value="handleCodeValue" />

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

    <section
      v-if="showResendModal"
      class="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 p-4"
      @click.self="closeResendModal"
    >
      <section class="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-slate-900">
        <h3 class="text-lg font-semibold">Reenviar codigo</h3>
        <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Ingresa tu numero de telefono para confirmar el reenvio.
        </p>

        <div class="mt-4">
          <InputComponent
            v-model="resendPhone"
            label="Telefono"
            type="tel"
            autocomplete="tel"
            placeholder="+56912345678"
            required
          />
        </div>
        <p v-if="resendModalError" class="mt-2 text-sm text-rose-500">
          {{ resendModalError }}
        </p>

        <div class="mt-4 flex justify-end gap-2">
          <ButtonComponent variant="outline" :disabled="resendSubmitting" @click="closeResendModal">
            Cancelar
          </ButtonComponent>
          <ButtonComponent variant="solid" :disabled="resendSubmitting" @click="handleResendCode">
            {{ resendSubmitting ? 'Reenviando...' : 'Confirmar reenvio' }}
          </ButtonComponent>
        </div>
      </section>
    </section>
  </main>
</template>
