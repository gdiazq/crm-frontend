<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ButtonComponent, InputComponent, ThemeToggle } from '@/components'
import { useStoreAuth, useStoreTheme } from '@/stores'

const router = useRouter()
const storeAuth = useStoreAuth()
const storeTheme = useStoreTheme()
const { isDark } = storeToRefs(storeTheme)
const { errorMessage, registerSubmitting } = storeToRefs(storeAuth)

const fullName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const handleRegister = async () => {
  if (!fullName.value || !email.value || !password.value || password.value !== confirmPassword.value) return
  const success = await storeAuth.register({
    fullName: fullName.value,
    email: email.value,
    password: password.value,
  })
  if (success) {
    await router.push({ name: 'Dashboard' })
  }
}

onMounted(() => {
  storeTheme.initTheme()
})
</script>

<template>
  <main
    class="relative flex min-h-screen items-center justify-center overflow-hidden p-6 transition-colors"
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
      <h1 class="mt-4 text-balance text-2xl font-bold">Crea tu cuenta</h1>
      <p class="mt-2 text-sm" :class="isDark ? 'text-slate-300' : 'text-slate-600'">
        Registra tu acceso para usar el CRM.
      </p>

      <form class="mt-7 space-y-4" @submit.prevent="handleRegister">
        <InputComponent
          v-model.trim="fullName"
          :is-dark="isDark"
          label="Nombre completo"
          type="text"
          autocomplete="name"
          placeholder="Guillermo Diaz"
          required
        />
        <InputComponent
          v-model.trim="email"
          :is-dark="isDark"
          label="Correo"
          type="email"
          autocomplete="email"
          placeholder="tu@empresa.com"
          required
        />
        <InputComponent
          v-model="password"
          :is-dark="isDark"
          label="Contraseña"
          type="password"
          autocomplete="new-password"
          placeholder="••••••••"
          :minlength="6"
          required
        />
        <InputComponent
          v-model="confirmPassword"
          :is-dark="isDark"
          label="Confirmar contraseña"
          type="password"
          autocomplete="new-password"
          placeholder="••••••••"
          :minlength="6"
          required
        />

        <ButtonComponent :is-dark="isDark" type="submit" variant="solid" :full-width="true">
          {{ registerSubmitting ? 'Registrando...' : 'Registrar cuenta' }}
        </ButtonComponent>
      </form>
      <p v-if="password !== confirmPassword && confirmPassword.length > 0" class="mt-3 text-sm text-rose-400">
        Las contraseñas no coinciden.
      </p>
      <p v-else-if="errorMessage" class="mt-3 text-sm text-rose-400">
        {{ errorMessage }}
      </p>
    </section>
  </main>
</template>
