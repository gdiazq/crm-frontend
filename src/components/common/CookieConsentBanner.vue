<script setup lang="ts">
import { onMounted, ref } from 'vue'

const COOKIE_CONSENT_KEY = 'crm_cookie_consent'
const isVisible = ref(false)

const hasConsentCookie = () => {
  const cookieString = document.cookie || ''
  return cookieString.split(';').some((rawCookie) => {
    const cookie = rawCookie.trim()
    return cookie === `${COOKIE_CONSENT_KEY}=accepted`
  })
}

const handleAccept = () => {
  document.cookie = `${COOKIE_CONSENT_KEY}=accepted; Path=/; Max-Age=31536000; SameSite=Lax`
  isVisible.value = false
}

onMounted(() => {
  isVisible.value = !hasConsentCookie()
})
</script>

<template>
  <section
    v-if="isVisible"
    class="fixed inset-x-0 bottom-0 z-[100] border-t border-slate-200 bg-white/95 p-4 backdrop-blur dark:border-white/10 dark:bg-slate-900/95"
  >
    <div class="mx-auto flex w-full max-w-7xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <p class="text-sm text-slate-700 dark:text-slate-200">
        Usamos cookies para mantener tu sesion iniciada, proteger el acceso y recordar preferencias basicas del sistema.
      </p>
      <button
        type="button"
        class="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300 dark:focus-visible:ring-offset-slate-950"
        @click="handleAccept"
      >
        Entendido
      </button>
    </div>
  </section>
</template>
