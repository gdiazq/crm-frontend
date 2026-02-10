<script setup lang="ts">
defineProps<{
  isDark: boolean
}>()
</script>

<template>
  <footer
    class="border-t py-6"
    :class="isDark ? 'border-white/10 bg-slate-950 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-600'"
  >
    <div class="mx-auto max-w-7xl px-6 text-center text-sm lg:px-8">
      Desarrollado por Guillermo Diaz Q. - 2026
    </div>
  </footer>
</template>
