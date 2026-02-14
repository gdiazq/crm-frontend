<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { NotificationPanel, PrivateNavbar } from '@/components'
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
      <PrivateNavbar
        :unread-count="unreadCount"
        :on-go-dashboard="handleGoDashboard"
        :on-go-logout="handleGoLogout"
        :on-toggle-notifications="toggleNotificaciones"
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
