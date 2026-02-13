<script setup lang="ts">
import { ButtonComponent } from '@/components'

const props = defineProps<{
  onGoRegister: () => void
  onGoLogin: () => void
}>()
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div class="rounded-xl bg-cyan-100 p-2 ring-1 ring-cyan-300/70 dark:bg-cyan-400/20 dark:ring-cyan-300/30">
        <span class="text-sm font-bold text-cyan-700 dark:text-cyan-300">CRM</span>
      </div>
      <p class="text-sm tracking-wide text-slate-600 dark:text-slate-300">
        Velocity Suite
      </p>
    </div>

    <div class="flex items-center gap-2">
      <ButtonComponent variant="outline" :on-click="props.onGoRegister">
        Registrar
      </ButtonComponent>
      <ButtonComponent variant="outline" :on-click="props.onGoLogin">
        Iniciar sesion
      </ButtonComponent>
    </div>
  </div>
</template>
