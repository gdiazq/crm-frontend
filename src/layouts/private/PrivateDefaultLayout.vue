<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { NavbarComponent, NotificationPanel } from '@/components'
import { useStoreAuth, useStoreNotification, useStoreTheme } from '@/stores'

const router = useRouter()
const storeAuth = useStoreAuth()
const storeNotification = useStoreNotification()
const storeTheme = useStoreTheme()
const { filterNotifications, unreadCount } = storeToRefs(storeNotification)
const { isDark } = storeToRefs(storeTheme)
const slideNotificaciones = ref(false)
const slideSettings = ref(false)

const toggleNotificaciones = (event?: Event) => {
  slideNotificaciones.value = !slideNotificaciones.value
  if (slideNotificaciones.value) slideSettings.value = false
  event?.stopPropagation()
}

const handleCloseNotificaciones = () => {
  slideNotificaciones.value = false
}

const handleToggleSettings = () => {
  slideSettings.value = !slideSettings.value
  if (slideSettings.value) slideNotificaciones.value = false
}

const handleCloseSettings = () => {
  slideSettings.value = false
}

const handleGoDashboard = () => {
  slideSettings.value = false
  router.push('/dashboard')
}

const handleGoSettings = () => {
  slideSettings.value = false
  router.push('/settings')
}

const handleGoLogout = () => {
  slideSettings.value = false
  router.push('/logout')
}

const handleToggleTheme = () => {
  storeTheme.toggleTheme()
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

const formatNotificationTimestamp = (value: string) => {
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
    <section class="flex min-h-screen w-full flex-col">
      <NavbarComponent
        :unread-count="unreadCount"
        :user-label="storeAuth.user?.username || storeAuth.user?.email || 'Usuario'"
        :user-email="storeAuth.user?.email || ''"
        :is-dark="isDark"
        :on-go-dashboard="handleGoDashboard"
        :settings-dropdown-open="slideSettings"
        :on-toggle-settings-dropdown="handleToggleSettings"
        :on-close-settings-dropdown="handleCloseSettings"
        :on-go-settings="handleGoSettings"
        :on-go-logout="handleGoLogout"
        :on-toggle-notifications="toggleNotificaciones"
        :on-toggle-theme="handleToggleTheme"
      />

      <section class="flex-1 p-6">
        <RouterView />
      </section>
    </section>

    <NotificationPanel
      :is-open="slideNotificaciones"
      :unread-count="unreadCount"
      :notifications="filterNotifications"
      :on-close="handleCloseNotificaciones"
      :on-mark-all-read="handleMarkAllRead"
      :on-mark-read="handleMarkRead"
      :on-archive="handleArchive"
      :format-timestamp="formatNotificationTimestamp"
    />
  </main>
</template>
