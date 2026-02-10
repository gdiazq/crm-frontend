<script setup lang="ts">
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
      <button
        type="button"
        class="rounded-lg px-5 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2"
        :class="isDark ? 'bg-cyan-400 text-slate-950 hover:bg-cyan-300' : 'bg-cyan-600 text-white hover:bg-cyan-700'"
      >
        Solicitar demo
      </button>
      <button
        type="button"
        class="rounded-lg border px-5 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2"
        :class="
          isDark
            ? 'border-slate-700 text-slate-100 hover:border-slate-500 focus-visible:ring-offset-slate-950'
            : 'border-slate-300 text-slate-700 hover:border-slate-500 focus-visible:ring-offset-slate-50'
        "
      >
        Ver dashboard
      </button>
    </div>
  </div>
</template>
