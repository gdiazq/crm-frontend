<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ButtonComponent, FooterComponent, InputComponent, ThemeToggle } from '@/components'
import { initialPreLoginForm, preLoginValidationRules } from '@/factories'
import { useFormValidation } from '@/composables'
import { mapperPreLoginPayload } from '@/mappers'
import { useStorePreLogin, useStoreTheme } from '@/stores'

const router = useRouter()
const storeTheme = useStoreTheme()
const storePreLogin = useStorePreLogin()
const { isDark } = storeToRefs(storeTheme)
const form = ref({ ...initialPreLoginForm })
const { errors, validateField, onValidation } = useFormValidation(form, preLoginValidationRules)

const controlShowError = computed(() => storePreLogin.loginError)

const handleEmailValue = (value: string) => {
  form.value.email = value
}

const handleGoHome = () => {
  router.push('/')
}

const submitForm = async () => {
  const emailValid = validateField('email')
  if (!emailValid) return

  const payload = mapperPreLoginPayload(form.value.email)
  const success = await storePreLogin.preLogin(payload.email)
  if (!success) return

  router.push('/login/credentials')
}

onMounted(() => {
  const rememberedEmail = localStorage.getItem('rememberEmail')
  if (rememberedEmail) {
    form.value.email = rememberedEmail
  }
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
          @click="handleGoHome"
        >
          <span aria-hidden="true">←</span>
          Volver al inicio
        </button>

        <div class="mt-4 text-center">
          <h2 class="mt-4 text-balance text-2xl font-bold">Hola, inicia sesion</h2>
          <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Ingresa tu correo para continuar
          </p>
        </div>

        <form class="mt-7 space-y-4" @submit.prevent="submitForm">
          <InputComponent
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

          <ButtonComponent
            type="submit"
            variant="solid"
            :full-width="true"
            :disabled="storePreLogin.preLoginSubmitting"
          >
            {{ storePreLogin.preLoginSubmitting ? 'Validando...' : 'Continuar' }}
          </ButtonComponent>

          <div
            v-if="controlShowError"
            class="rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-400/40 dark:bg-rose-900/20 dark:text-rose-200"
          >
            {{ storePreLogin.errorMessage }}
          </div>
        </form>
      </section>
    </section>

    <FooterComponent />
  </main>
</template>
