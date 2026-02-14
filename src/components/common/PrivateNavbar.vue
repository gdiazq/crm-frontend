<script setup lang="ts">
const props = defineProps<{
  unreadCount: number
  onGoDashboard: () => void
  onGoLogout: () => void
  onToggleNotifications: () => void
}>()
</script>

<template>
  <header class="flex items-center justify-between border-b border-slate-200 bg-white/80 px-6 py-4 dark:border-white/10 dark:bg-slate-900/40">
    <nav class="flex items-center gap-2 text-sm">
      <button
        type="button"
        class="rounded-lg px-3 py-2 hover:bg-slate-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900"
        @click="props.onGoDashboard"
      >
        Dashboard
      </button>
      <button
        type="button"
        class="rounded-lg px-3 py-2 hover:bg-slate-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900"
        @click="props.onGoLogout"
      >
        Salir
      </button>
    </nav>

    <button
      type="button"
      class="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold hover:border-cyan-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-cyan-300/60 dark:focus-visible:ring-offset-slate-950"
      @click="props.onToggleNotifications"
    >
      <svg class="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2a6 6 0 0 0-6 6v3.6l-1.7 2.9A1 1 0 0 0 5.2 16h13.6a1 1 0 0 0 .9-1.5L18 11.6V8a6 6 0 0 0-6-6Zm0 20a3 3 0 0 0 2.8-2h-5.6A3 3 0 0 0 12 22Z" />
      </svg>
      Notificacion
      <span
        v-if="props.unreadCount > 0"
        class="ml-2 inline-flex min-w-6 items-center justify-center rounded-full bg-cyan-600 px-1.5 py-0.5 text-xs text-white dark:bg-cyan-400 dark:text-slate-900"
      >
        {{ props.unreadCount }}
      </span>
    </button>
  </header>
</template>
