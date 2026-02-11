<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ButtonComponent, FooterComponent, InputComponent, ThemeToggle } from '@/components'
import { useStoreAuth, useStoreTheme } from '@/stores'

const route = useRoute()
const router = useRouter()
const storeAuth = useStoreAuth()
const storeTheme = useStoreTheme()
const { isDark } = storeToRefs(storeTheme)
const { verifySubmitting, errorMessage, successMessage } = storeToRefs(storeAuth)

const form = ref({
  email: '',
  code: '',
})

const controlIsValidForm = computed(() => {
  return Object.values(form.value).every((value) => Boolean(value))
})

const handleEmailValue = (value: string) => {
  form.value.email = value
}

const handleCodeValue = (value: string) => {
  form.value.code = value
}

const handleMessageAlert = (message: string) => {
  errorMessage.value = message
}

const submitForm = async () => {
  if (!controlIsValidForm.value) {
    handleMessageAlert('Debes completar correo y codigo.')
    return
  }

  const success = await storeAuth.verifyEmail(form.value)
  if (success) {
    router.push('/login')
  }
}

const handleGoLogin = () => {
  router.push('/login')
}

onMounted(() => {
  storeTheme.initTheme()
  const queryEmail = route.query.email
  if (typeof queryEmail === 'string') {
    handleEmailValue(queryEmail)
  }
})
</script>

<template>
  <main
    class="relative flex min-h-screen flex-col overflow-hidden transition-colors"
    :class="isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'"
  >
    <div class="fixed right-4 top-4 z-50">
      <ThemeToggle :is-dark="isDark" @toggle="storeTheme.toggleTheme" />
    </div>
    <div
      class="pointer-events-none absolute inset-0 -z-10"
      :class="
        isDark
          ? 'bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_40%),radial-gradient(circle_at_80%_20%,_rgba(14,165,233,0.12),_transparent_35%)]'
          : 'bg-[radial-gradient(circle_at_top,_rgba(8,145,178,0.12),_transparent_45%),radial-gradient(circle_at_80%_20%,_rgba(14,116,144,0.1),_transparent_35%)]'
      "
    ></div>

    <section class="flex flex-1 items-center justify-center p-6">
      <section
        class="w-full max-w-md rounded-2xl border p-8 shadow-2xl backdrop-blur"
        :class="isDark ? 'border-white/10 bg-slate-900/75' : 'border-slate-200 bg-white/90 shadow-slate-200/70'"
      >
        <button
          type="button"
          class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide transition hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2"
          :class="isDark ? 'text-slate-300 opacity-90 focus-visible:ring-offset-slate-950' : 'text-slate-600 opacity-90 focus-visible:ring-offset-slate-50'"
          @click="handleGoLogin"
        >
          <span aria-hidden="true">←</span>
          Volver al login
        </button>

        <h1 class="mt-4 text-balance text-2xl font-bold">Verifica tu correo</h1>
        <p class="mt-2 text-sm" :class="isDark ? 'text-slate-300' : 'text-slate-600'">
          Ingresa el codigo enviado al correo para activar tu cuenta.
        </p>

        <form class="mt-7 space-y-4" @submit.prevent="submitForm">
          <InputComponent
            v-model.trim="form.email"
            :is-dark="isDark"
            label="Correo"
            type="email"
            autocomplete="email"
            placeholder="tu@empresa.com"
            @update:model-value="handleEmailValue"
            required
          />
          <InputComponent
            v-model.trim="form.code"
            :is-dark="isDark"
            label="Codigo de verificacion"
            type="text"
            autocomplete="one-time-code"
            placeholder="123456"
            @update:model-value="handleCodeValue"
            required
          />

          <ButtonComponent :is-dark="isDark" type="submit" variant="solid" :full-width="true" :disabled="verifySubmitting">
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

    <FooterComponent :is-dark="isDark" />
  </main>
</template>
