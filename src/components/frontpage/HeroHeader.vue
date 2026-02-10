<script setup lang="ts">
import { ThemeToggle } from '@/components'

defineProps<{
  isDark: boolean
}>()

const emit = defineEmits<{
  toggleTheme: []
}>()
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

    <div class="flex items-center gap-3">
      <ThemeToggle :is-dark="isDark" @toggle="emit('toggleTheme')" />
      <RouterLink
        to="/login"
        class="rounded-lg border px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2"
        :class="
          isDark
            ? 'border-slate-700 bg-slate-900 text-slate-100 hover:border-cyan-300/60 hover:text-cyan-300 focus-visible:ring-offset-slate-950'
            : 'border-slate-300 bg-white text-slate-700 hover:border-cyan-500 hover:text-cyan-700 focus-visible:ring-offset-slate-50'
        "
      >
        Iniciar sesion
      </RouterLink>
    </div>
  </div>
</template>
