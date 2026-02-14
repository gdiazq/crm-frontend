<script setup lang="ts">
const props = defineProps<{
  open: boolean
  userLabel?: string
  userEmail?: string
  avatarUrl?: string
  unreadCount: number
  isDark: boolean
  onToggle: () => void
  onClose: () => void
  onToggleNotifications: () => void
  onToggleTheme: () => void
  onGoSettings: () => void
  onGoLogout: () => void
}>()
</script>

<template>
  <div class="relative">
    <button
      type="button"
      class="inline-flex items-center rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm font-semibold hover:border-cyan-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-cyan-300/60 dark:focus-visible:ring-offset-slate-950"
      @click="props.onToggle"
    >
      <img
        v-if="props.avatarUrl"
        :src="props.avatarUrl"
        alt="Avatar de usuario"
        class="h-7 w-7 rounded-full object-cover"
      >
      <span
        v-else
        class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-cyan-100 text-xs font-bold text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300"
      >
        {{ (props.userLabel || 'U').slice(0, 1).toUpperCase() }}
      </span>
      <span class="ml-2 max-w-24 truncate text-sm">
        {{ props.userLabel || 'Usuario' }}
      </span>
      <svg class="ml-2 h-4 w-4 opacity-70" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M5.2 7.2a.75.75 0 0 1 1.06 0L10 10.94l3.74-3.74a.75.75 0 1 1 1.06 1.06l-4.27 4.27a.75.75 0 0 1-1.06 0L5.2 8.26a.75.75 0 0 1 0-1.06Z" />
      </svg>
    </button>

    <button v-if="props.open" type="button" class="fixed inset-0 z-40" @click="props.onClose"></button>

    <div
      v-if="props.open"
      class="absolute right-0 z-50 mt-2 w-48 rounded-lg border border-slate-200 bg-white p-1 shadow-lg dark:border-white/10 dark:bg-slate-900"
    >
      <div class="rounded-md px-3 py-2">
        <p class="truncate text-xs text-slate-500 dark:text-slate-400">{{ props.userEmail || 'Sin correo' }}</p>
      </div>
      <div class="my-1 border-t border-slate-200 dark:border-white/10"></div>
      <button
        type="button"
        class="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
        @click="props.onToggleNotifications"
      >
        <span>Notificacion</span>
        <span
          v-if="props.unreadCount > 0"
          class="ml-2 inline-flex min-w-6 items-center justify-center rounded-full bg-cyan-600 px-1.5 py-0.5 text-xs text-white dark:bg-cyan-400 dark:text-slate-900"
        >
          {{ props.unreadCount }}
        </span>
      </button>
      <button
        type="button"
        class="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
        @click="props.onGoSettings"
      >
        Configuracion
      </button>
      <button
        type="button"
        class="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
        @click="props.onToggleTheme"
      >
        {{ props.isDark ? 'Modo claro' : 'Modo oscuro' }}
      </button>
      <div class="my-1 border-t border-slate-200 dark:border-white/10"></div>
      <button
        type="button"
        class="block w-full rounded-md px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/20"
        @click="props.onGoLogout"
      >
        Cerrar sesion
      </button>
    </div>
  </div>
</template>
