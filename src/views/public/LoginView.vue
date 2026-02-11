<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { ButtonComponent, FooterComponent, InputComponent, PasswordInputComponent, ThemeToggle } from '@/components'
import { useStoreAuth, useStoreTheme } from '@/stores'

const router = useRouter()
const storeAuth = useStoreAuth()
const storeTheme = useStoreTheme()
const { isDark } = storeToRefs(storeTheme)
const form = ref({
  email: '',
  password: '',
})
const remindMe = ref(false)

const controlIsValidForm = computed(() => {
  return Object.values(form.value).every((value) => Boolean(value))
})

const controlLoginAlert = computed(() => {
  return storeAuth.loginError
})

const handleEmailValue = (value: string) => {
  form.value.email = value
}

const handlePasswordValue = (value: string) => {
  form.value.password = value
}

const handleMessageAlert = (message?: string) => {
  storeAuth.loginError = true
  storeAuth.messageAlert = {
    icon: 'fa-solid fa-triangle-exclamation',
    variant: 'error',
    message: message || 'Debes completar usuario y contraseña.',
  }
}

const submitForm = async () => {
  if (!controlIsValidForm.value) {
    handleMessageAlert()
    return
  }

  const success = await storeAuth.login(form.value)
  if (!success) {
    handleMessageAlert(storeAuth.messageAlert.message || 'Usuario o contraseña incorrectos.')
    return
  }

  if (success) {
    if (remindMe.value) {
      localStorage.setItem('rememberEmail', form.value.email)
    } else {
      localStorage.removeItem('rememberEmail')
    }
    await router.push({ name: 'Dashboard' })
  }
}

const handleRecovery = () => {
  storeAuth.loginError = false
  storeAuth.messageAlert = {
    icon: 'fa-solid fa-circle-info',
    variant: 'info',
    message: 'Recuperacion de contraseña disponible proximamente.',
  }
}

const handleMicrosoftLogin = () => {
  storeAuth.loginError = true
  storeAuth.messageAlert = {
    icon: 'fa-solid fa-circle-info',
    variant: 'info',
    message: 'Login con Microsoft estara disponible pronto.',
  }
}

onMounted(() => {
  storeTheme.initTheme()
  const rememberedEmail = localStorage.getItem('rememberEmail')
  if (rememberedEmail) {
    handleEmailValue(rememberedEmail)
    remindMe.value = true
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
        <RouterLink
          to="/"
          class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide transition hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2"
          :class="isDark ? 'text-slate-300 opacity-90 focus-visible:ring-offset-slate-950' : 'text-slate-600 opacity-90 focus-visible:ring-offset-slate-50'"
        >
          <span aria-hidden="true">←</span>
          Volver al inicio
        </RouterLink>

        <div class="mt-4 text-center">
          <h2 class="mt-4 text-balance text-2xl font-bold">Hola, inicia sesion</h2>
          <p class="mt-2 text-sm" :class="isDark ? 'text-slate-300' : 'text-slate-600'">
            Ingresando los datos de tu cuenta corporativa
          </p>
        </div>

        <form class="mt-7 space-y-4" @submit.prevent="submitForm">
          <div
            v-if="controlLoginAlert"
            class="rounded-lg border px-3 py-2 text-sm"
            :class="isDark ? 'border-rose-400/40 bg-rose-900/20 text-rose-200' : 'border-rose-300 bg-rose-50 text-rose-700'"
          >
            {{ storeAuth.messageAlert.message || 'Usuario o contraseña incorrectos.' }}
          </div>

          <InputComponent
            v-model.trim="form.email"
            :is-dark="isDark"
            label="Correo electrónico"
            type="text"
            autocomplete="username"
            placeholder="usuario o correo"
            @update:model-value="handleEmailValue"
            required
          />

          <PasswordInputComponent
            v-model="form.password"
            :is-dark="isDark"
            label="Contraseña"
            :minlength="6"
            autocomplete="current-password"
            placeholder="••••••••"
            required
            @update:model-value="handlePasswordValue"
          />

          <div class="flex items-center justify-between text-sm">
            <label class="inline-flex items-center gap-2">
              <input v-model="remindMe" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-400" />
              <span :class="isDark ? 'text-slate-300' : 'text-slate-600'">Recordarme</span>
            </label>
            <button
              type="button"
              class="font-semibold transition"
              :class="isDark ? 'text-cyan-300 hover:text-cyan-200' : 'text-cyan-700 hover:text-cyan-800'"
              @click="handleRecovery"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <ButtonComponent
            :is-dark="isDark"
            type="submit"
            variant="solid"
            :full-width="true"
            :disabled="storeAuth.loginSubmitting"
          >
            {{ storeAuth.loginSubmitting ? 'Accediendo...' : 'Iniciar sesión' }}
          </ButtonComponent>

          <div class="flex items-center gap-3 py-1">
            <div class="h-px flex-1" :class="isDark ? 'bg-slate-700' : 'bg-slate-300'"></div>
            <span class="text-xs uppercase tracking-wide" :class="isDark ? 'text-slate-400' : 'text-slate-500'">o</span>
            <div class="h-px flex-1" :class="isDark ? 'bg-slate-700' : 'bg-slate-300'"></div>
          </div>

          <button
            type="button"
            class="inline-flex w-full items-center justify-center rounded-lg border px-4 py-3 text-sm font-semibold transition"
            :class="
              isDark
                ? 'border-slate-700 bg-slate-900 text-slate-100 hover:border-cyan-300/60'
                : 'border-slate-300 bg-white text-slate-700 hover:border-cyan-500'
            "
            :disabled="storeAuth.loginSubmitting"
            @click="handleMicrosoftLogin"
          >
            Continuar con Microsoft
          </button>
        </form>
      </section>
    </section>

    <FooterComponent :is-dark="isDark" />
  </main>
</template>
