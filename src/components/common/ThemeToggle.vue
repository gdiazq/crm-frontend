<script setup lang="ts">
defineProps<{
  isDark: boolean
}>()

const emit = defineEmits<{
  toggle: []
}>()
</script>

<template>
  <button
    type="button"
    class="rounded-lg border px-3 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2"
    :class="
      isDark
        ? 'border-slate-700 bg-slate-900 text-slate-100 hover:border-cyan-300/60 hover:text-cyan-300 focus-visible:ring-offset-slate-950'
        : 'border-slate-300 bg-white text-slate-700 hover:border-cyan-500 hover:text-cyan-700 focus-visible:ring-offset-slate-50'
    "
    @click="emit('toggle')"
  >
    {{ isDark ? 'Modo claro' : 'Modo oscuro' }}
  </button>
</template>
