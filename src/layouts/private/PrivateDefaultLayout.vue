<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useStoreAuth, useStoreNotification } from '@/stores'

const router = useRouter()
const storeAuth = useStoreAuth()
const storeNotification = useStoreNotification()
const { filterNotifications, unreadCount } = storeToRefs(storeNotification)
const slideNotificaciones = ref(false)

const toggleNotificaciones = (event?: Event) => {
  slideNotificaciones.value = !slideNotificaciones.value
  event?.stopPropagation()
}

const handleCloseNotificaciones = () => {
  slideNotificaciones.value = false
}

const handleGoHome = () => {
  router.push('/')
}

const handleGoDashboard = () => {
  router.push('/dashboard')
}

const handleGoLogout = () => {
  router.push('/logout')
}

const handleMarkAllRead = () => {
  const userId = storeAuth.user?.id
  if (!userId) return
  storeNotification.mutationMarkAllAsRead(userId)
}

const handleMarkRead = (id: string) => {
  const userId = storeAuth.user?.id
  if (!userId) return
  const notification = storeNotification.notifications.find((item) => item.id === id)
  if (!notification) return
  storeNotification.mutationMarkAsRead(notification, userId)
}

const handleArchive = (id: string) => {
  const userId = storeAuth.user?.id
  if (!userId) return
  const notification = storeNotification.notifications.find((item) => item.id === id)
  if (!notification) return
  storeNotification.mutationArchiveNotification(notification, userId)
}

const formatTimestamp = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '--:--'
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

onMounted(() => {
  const userId = storeAuth.user?.id
  if (!userId) return

  storeNotification.captureTab(2)
  storeNotification.getNotifications(userId, '', 0, 20)
  storeNotification.getCounter(userId)
  storeNotification.connect(userId)
})

onBeforeUnmount(() => {
  storeNotification.disconnect()
})
</script>

<template>
  <main
    v-cloak
    id="layout-private-default"
    class="layout-private-default min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100"
  >
    <section class="mx-auto flex min-h-screen w-full max-w-7xl">
      <aside class="hidden w-72 border-r border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900/60 lg:block">
        <p class="text-sm font-semibold uppercase tracking-wide opacity-70">Menu privado</p>
        <nav class="mt-6 space-y-2 text-sm">
          <button
            type="button"
            class="block w-full rounded-lg px-3 py-2 text-left hover:bg-slate-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900"
            @click="handleGoHome"
          >
            Inicio
          </button>
          <button
            type="button"
            class="block w-full rounded-lg px-3 py-2 text-left hover:bg-slate-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900"
            @click="handleGoDashboard"
          >
            Dashboard
          </button>
          <button
            type="button"
            class="block w-full rounded-lg px-3 py-2 text-left hover:bg-slate-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900"
            @click="handleGoLogout"
          >
            Salir
          </button>
        </nav>
      </aside>

      <section class="flex min-h-screen flex-1 flex-col">
        <header class="flex items-center justify-between border-b border-slate-200 bg-white/80 px-6 py-4 dark:border-white/10 dark:bg-slate-900/40">
          <p class="text-sm font-semibold">Area privada</p>
          <button
            type="button"
            class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold hover:border-cyan-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-cyan-300/60 dark:focus-visible:ring-offset-slate-950"
            @click="toggleNotificaciones"
          >
            Notificaciones
            <span
              v-if="unreadCount > 0"
              class="ml-2 inline-flex min-w-6 items-center justify-center rounded-full bg-cyan-600 px-1.5 py-0.5 text-xs text-white dark:bg-cyan-400 dark:text-slate-900"
            >
              {{ unreadCount }}
            </span>
          </button>
        </header>

        <section class="flex-1 p-6">
          <RouterView />
        </section>
      </section>
    </section>

    <aside
      v-if="slideNotificaciones"
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
            @click="handleCloseNotificaciones"
          >
            Cerrar
          </button>
        </div>
      </div>
      <div class="mb-3 flex items-center justify-between">
        <p class="text-xs opacity-70">{{ unreadCount }} sin leer</p>
        <button
          type="button"
          class="text-xs font-semibold opacity-80 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900"
          @click="handleMarkAllRead"
        >
          Marcar todas leidas
        </button>
      </div>

      <div v-if="filterNotifications.length === 0" class="rounded-lg border border-slate-200 p-3 text-sm opacity-80 dark:border-white/10">
        Aun no hay notificaciones.
      </div>

      <ul v-else class="max-h-80 space-y-2 overflow-auto pr-1">
        <li
          v-for="item in filterNotifications"
          :key="item.id"
          class="rounded-lg border p-3"
          :class="[
            'border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-slate-900/40',
            !item.read && 'ring-1 ring-cyan-500/40 dark:ring-cyan-300/40',
          ]"
        >
          <div class="mb-1 flex items-center justify-between gap-2">
            <p class="text-sm font-semibold">{{ item.title }}</p>
            <p class="text-xs opacity-70">{{ formatTimestamp(item.createdAt) }}</p>
          </div>
          <p class="text-sm opacity-90">{{ item.message }}</p>
          <div class="mt-2 flex justify-end">
            <button
              type="button"
              class="text-xs font-semibold opacity-80 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900"
              @click="handleMarkRead(item.id)"
            >
              Marcar leida
            </button>
            <button
              type="button"
              class="ml-3 text-xs font-semibold opacity-80 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900"
              @click="handleArchive(item.id)"
            >
              Archivar
            </button>
          </div>
        </li>
      </ul>
    </aside>
  </main>
</template>
