<script setup lang="ts">
import { ButtonComponent } from '@/components'
import router from '@/router'

defineProps<{
  isDark: boolean
}>()

const handleGoRegister = () => {
  router.push('/register')
}

const handleGoLogin = () => {
  router.push('/login')
}
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div
        class="rounded-xl p-2 ring-1"
        :class="isDark ? 'bg-cyan-400/20 ring-cyan-300/30' : 'bg-cyan-100 ring-cyan-300/70'"
      >
        <span class="text-sm font-bold" :class="isDark ? 'text-cyan-300' : 'text-cyan-700'">CRM</span>
      </div>
      <p class="text-sm tracking-wide" :class="isDark ? 'text-slate-300' : 'text-slate-600'">
        Velocity Suite
      </p>
    </div>

    <div class="flex items-center gap-2">
      <ButtonComponent :is-dark="isDark" variant="outline" @click="handleGoRegister">
        Registrar
      </ButtonComponent>
      <ButtonComponent :is-dark="isDark" variant="outline" @click="handleGoLogin">
        Iniciar sesion
      </ButtonComponent>
    </div>
  </div>
</template>
