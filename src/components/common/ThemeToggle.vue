<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useStoreTheme } from '@/stores'

const storeTheme = useStoreTheme()
const { isDark } = storeToRefs(storeTheme)
</script>

<template>
  <button
    type="button"
    :aria-label="isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
    class="inline-flex h-11 w-11 items-center justify-center rounded-full border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2"
    :class="[
      'border-slate-300 bg-white text-slate-700 hover:border-cyan-500 hover:text-cyan-700 focus-visible:ring-offset-slate-50',
      'dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-cyan-300/60 dark:hover:text-cyan-300 dark:focus-visible:ring-offset-slate-950',
    ]"
    @click="storeTheme.toggleTheme"
  >
    <img
      :src="isDark ? '/icons/sun.svg' : '/icons/moon.svg'"
      :alt="isDark ? 'Activar modo claro' : 'Activar modo oscuro'"
      class="h-5 w-5"
    />
  </button>
</template>
