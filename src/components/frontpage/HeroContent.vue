<script setup lang="ts">
import { ButtonComponent } from '@/components'

defineProps<{
  isDark: boolean
}>()
</script>

<template>
  <div>
    <h1 class="mt-6 text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
      Gestiona leads, oportunidades y soporte en un solo panel
    </h1>
    <p class="mt-5 max-w-xl" :class="isDark ? 'text-slate-300' : 'text-slate-600'">
      Centraliza tu pipeline comercial, automatiza seguimientos y mejora conversiones con una
      vista clara de todo el ciclo de cliente.
    </p>
    <div class="mt-8 flex flex-wrap gap-3">
      <ButtonComponent :is-dark="isDark" variant="solid">
        Solicitar demo
      </ButtonComponent>
      <ButtonComponent :is-dark="isDark" variant="outline">
        Ver dashboard
      </ButtonComponent>
    </div>
  </div>
</template>
