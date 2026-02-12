<script setup lang="ts">
import { ButtonComponent } from '@/components'
import router from '@/router'

const handleGoRegister = () => {
  router.push('/register')
}

const handleGoDashboard = () => {
  router.push('/dashboard')
}
</script>

<template>
  <div>
    <h1 class="mt-6 text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
      Gestiona leads, oportunidades y soporte en un solo panel
    </h1>
    <p class="mt-5 max-w-xl text-slate-600 dark:text-slate-300">
      Centraliza tu pipeline comercial, automatiza seguimientos y mejora conversiones con una
      vista clara de todo el ciclo de cliente.
    </p>
    <div class="mt-8 flex flex-wrap gap-3">
      <ButtonComponent variant="solid" @click="handleGoRegister">
        Solicitar demo
      </ButtonComponent>
      <ButtonComponent variant="outline" @click="handleGoDashboard">
        Ver dashboard
      </ButtonComponent>
    </div>
  </div>
</template>
