<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useStoreAuth } from '@/stores'

const router = useRouter()
const storeAuth = useStoreAuth()

const handleLogin = async () => {
  storeAuth.login()
  await router.push({ name: 'Inicio' })
}
</script>

<template>
  <main class="flex min-h-screen items-center justify-center bg-slate-100 p-6">
    <section class="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8">
      <h1 class="text-balance text-2xl font-bold text-slate-900">Login</h1>
      <p class="mt-2 text-sm text-slate-600">Vista publica de acceso.</p>
      <button
        type="button"
        class="mt-6 w-full rounded-lg bg-cyan-600 px-4 py-3 text-sm font-semibold text-white hover:bg-cyan-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        @click="handleLogin"
      >
        Iniciar sesion (demo)
      </button>
    </section>
  </main>
</template>
