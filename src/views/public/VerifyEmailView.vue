<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ButtonComponent, FooterComponent, ThemeToggle, VerificationCodeInputComponent } from '@/components'
import { useStoreAuth, useStoreTheme } from '@/stores'

const router = useRouter()
const storeAuth = useStoreAuth()
const storeTheme = useStoreTheme()
const { verifySubmitting, errorMessage, successMessage, pendingVerifyEmail } = storeToRefs(storeAuth)

const form = ref({
  code: '',
})

const controlIsValidForm = computed(() => {
  return Boolean(pendingVerifyEmail.value && form.value.code)
})

const handleCodeValue = (value: string) => {
  form.value.code = value
}

const handleMessageAlert = (message: string) => {
  errorMessage.value = message
}

const submitForm = async () => {
  if (!controlIsValidForm.value) {
    handleMessageAlert('No se encontro el correo a verificar o falta el codigo.')
    return
  }

  const success = await storeAuth.verifyEmail({ email: pendingVerifyEmail.value || '', code: form.value.code })
  if (success) {
    router.push('/login')
  }
}

const handleGoLogin = () => {
  router.push('/login')
}

onMounted(() => {
  storeTheme.initTheme()
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
  </main>
</template>
