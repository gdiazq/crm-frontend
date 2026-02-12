<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ButtonComponent, FooterComponent, InputComponent, ThemeToggle } from '@/components'
import { useStoreAuth, useStoreTheme } from '@/stores'

const router = useRouter()
const storeAuth = useStoreAuth()
const storeTheme = useStoreTheme()
const { errorMessage, registerSubmitting, checkEmailSubmitting, emailAvailable } = storeToRefs(storeAuth)

const form = ref({
  username: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
  email: '',
})

const controlIsValidForm = computed(() => {
  return Object.values(form.value).every((value) => Boolean(value))
})
const controlCanSubmit = computed(() => {
  return controlIsValidForm.value && emailAvailable.value !== false && !checkEmailSubmitting.value
})

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const emailCheckTimer = ref<ReturnType<typeof setTimeout> | null>(null)

const handleUsernameValue = (value: string) => {
  form.value.username = value
}

const handleFirstNameValue = (value: string) => {
  form.value.firstName = value
}

const handleLastNameValue = (value: string) => {
  form.value.lastName = value
}

const handlePhoneNumberValue = (value: string) => {
  form.value.phoneNumber = value
}

const handleEmailValue = (value: string) => {
  form.value.email = value
}

const handleMessageAlert = (message: string) => {
  errorMessage.value = message
}

const submitForm = async () => {
  if (!controlIsValidForm.value) {
    handleMessageAlert('Debes completar todos los campos obligatorios.')
    return
  }

  const available = await storeAuth.checkEmailAvailability(form.value.email.trim())
  if (available === false) {
    handleMessageAlert('El correo ya esta registrado.')
    return
  }
  if (available === null) {
    handleMessageAlert('No se pudo validar el correo. Intenta nuevamente.')
    return
  }

  const success = await storeAuth.register({
    username: form.value.username,
    email: form.value.email,
    firstName: form.value.firstName,
    lastName: form.value.lastName,
    phoneNumber: form.value.phoneNumber,
  })
  if (success) {
    storeAuth.setPendingVerifyEmail(form.value.email)
    router.push('/verify-email')
  }
}

const handleGoHome = () => {
  router.push('/')
}

onMounted(() => {
  storeTheme.initTheme()
})

watch(
  () => form.value.email,
  (value) => {
    const email = value.trim()
    errorMessage.value = null
    emailAvailable.value = null

    if (emailCheckTimer.value) {
      clearTimeout(emailCheckTimer.value)
      emailCheckTimer.value = null
    }

    if (!emailRegex.test(email)) return

    emailCheckTimer.value = setTimeout(async () => {
      await storeAuth.checkEmailAvailability(email)
    }, 350)
  },
)

onBeforeUnmount(() => {
  if (!emailCheckTimer.value) return
  clearTimeout(emailCheckTimer.value)
  emailCheckTimer.value = null
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
          @click="handleGoHome"
        >
          <span aria-hidden="true">←</span>
          Volver al inicio
        </button>
        <h1 class="mt-4 text-balance text-2xl font-bold">Crea tu cuenta</h1>
        <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">Registra tu acceso para usar el CRM.</p>

        <form class="mt-7 space-y-4" @submit.prevent="submitForm">
        <InputComponent
          v-model.trim="form.username"
          label="Usuario"
          type="text"
          autocomplete="username"
          placeholder="johndoe"
          @update:model-value="handleUsernameValue"
          required
        />
        <InputComponent
          v-model.trim="form.firstName"
          label="Nombre"
          type="text"
          autocomplete="given-name"
          placeholder="John"
          @update:model-value="handleFirstNameValue"
          required
        />
        <InputComponent
          v-model.trim="form.lastName"
          label="Apellido"
          type="text"
          autocomplete="family-name"
          placeholder="Doe"
          @update:model-value="handleLastNameValue"
          required
        />
        <InputComponent
          v-model.trim="form.email"
          label="Correo"
          type="email"
          autocomplete="email"
          placeholder="tu@empresa.com"
          @update:model-value="handleEmailValue"
          required
        />
        <InputComponent
          v-model.trim="form.phoneNumber"
          label="Telefono"
          type="tel"
          autocomplete="tel"
          placeholder="+1234567890"
          @update:model-value="handlePhoneNumberValue"
          required
        />

          <ButtonComponent
            type="submit"
            variant="solid"
            :full-width="true"
            :disabled="registerSubmitting || checkEmailSubmitting || !controlCanSubmit"
          >
            {{ registerSubmitting ? 'Registrando...' : 'Registrar cuenta' }}
          </ButtonComponent>
        </form>
        <p v-if="checkEmailSubmitting" class="mt-3 text-sm text-cyan-700 dark:text-cyan-300">
          Validando disponibilidad del correo...
        </p>
        <p v-else-if="emailAvailable === false" class="mt-3 text-sm text-rose-400">
          El correo ya esta registrado.
        </p>
        <p v-else-if="errorMessage" class="mt-3 text-sm text-rose-400">
          {{ errorMessage }}
        </p>
      </section>
    </section>
    <FooterComponent />
  </main>
</template>
