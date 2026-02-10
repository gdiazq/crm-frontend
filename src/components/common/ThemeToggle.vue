<script setup lang="ts">
const props = defineProps<{
  isDark: boolean
}>()

const emit = defineEmits<{
  toggle: []
}>()
</script>

<template>
  <button
    type="button"
    :aria-label="isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
    class="inline-flex h-11 w-11 items-center justify-center rounded-full border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2"
    :class="
      isDark
        ? 'border-slate-700 bg-slate-900 text-slate-100 hover:border-cyan-300/60 hover:text-cyan-300 focus-visible:ring-offset-slate-950'
        : 'border-slate-300 bg-white text-slate-700 hover:border-cyan-500 hover:text-cyan-700 focus-visible:ring-offset-slate-50'
    "
    @click="emit('toggle')"
  >
    <img
      :src="props.isDark ? '/icons/sun.svg' : '/icons/moon.svg'"
      :alt="props.isDark ? 'Activar modo claro' : 'Activar modo oscuro'"
      class="h-5 w-5"
    />
  </button>
</template>
