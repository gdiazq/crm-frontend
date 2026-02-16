<script setup lang="ts">
import type { NotificationItem } from '@/interfaces'

const props = defineProps<{
  isOpen: boolean
  unreadCount: number
  notifications: NotificationItem[]
  onClose: () => void
  onMarkAllRead: () => void
  onMarkRead: (id: string) => void
  onArchive: (id: string) => void
  formatTimestamp: (value: string) => string
}>()
</script>

<template>
  <aside
    v-if="props.isOpen"
    class="fixed right-4 top-20 w-96 rounded-xl border border-slate-200 bg-white p-4 text-slate-900 shadow-xl dark:border-white/10 dark:bg-slate-900 dark:text-slate-100"
  >
    <div class="mb-3 flex items-center justify-between">
      <div>
        <p class="font-semibold">Notificaciones</p>
      </div>
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="text-sm opacity-70 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900"
          @click="props.onClose"
        >
          Cerrar
        </button>
      </div>
    </div>
    <div class="mb-3 flex items-center justify-between">
      <p class="text-xs opacity-70">{{ props.unreadCount }} sin leer</p>
      <button
        type="button"
        class="text-xs font-semibold opacity-80 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900"
        @click="props.onMarkAllRead"
      >
        Marcar todas leidas
      </button>
    </div>

    <div v-if="props.notifications.length === 0" class="rounded-lg border border-slate-200 p-3 text-sm opacity-80 dark:border-white/10">
      Aun no hay notificaciones.
    </div>

    <ul v-else class="max-h-80 space-y-2 overflow-auto pr-1">
      <li
        v-for="item in props.notifications"
        :key="item.id"
        class="rounded-lg border p-3"
        :class="[
          'border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-slate-900/40',
          !item.read && 'ring-1 ring-cyan-500/40 dark:ring-cyan-300/40',
        ]"
      >
        <div class="mb-1 flex items-center justify-between gap-2">
          <p class="text-sm font-semibold">{{ item.title }}</p>
          <p class="text-xs opacity-70">{{ props.formatTimestamp(item.createdAt) }}</p>
        </div>
        <p class="text-sm opacity-90">{{ item.message }}</p>
        <div class="mt-2 flex justify-end">
          <button
            type="button"
            class="text-xs font-semibold opacity-80 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900"
            @click="props.onMarkRead(item.id)"
          >
            Marcar leida
          </button>
          <button
            type="button"
            class="ml-3 text-xs font-semibold opacity-80 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900"
            @click="props.onArchive(item.id)"
          >
            Archivar
          </button>
        </div>
      </li>
    </ul>
  </aside>
</template>
