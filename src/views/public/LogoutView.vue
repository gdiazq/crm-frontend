<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStoreAuth } from '@/stores'

const router = useRouter()
const storeAuth = useStoreAuth()

onMounted(async () => {
  await storeAuth.logout()
  await router.replace('/')
})
</script>

<template>
  <main class="flex min-h-screen items-center justify-center bg-slate-100 p-6">
    <p class="text-sm text-slate-600">Cerrando sesion…</p>
  </main>
</template>
