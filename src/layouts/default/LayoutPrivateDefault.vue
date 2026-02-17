<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import {
  AUTH_ROUTE_DASHBOARD,
  AUTH_ROUTE_LOGIN,
  AUTH_ROUTE_LOGOUT,
  AUTH_ROUTE_SETTINGS,
  AUTH_ROUTE_USERS,
} from '@/constants'
import { NavbarComponent, NotificationPanel, SidebarComponent } from '@/components'
import { useStoreAuth, useStoreNotification, useStoreTheme } from '@/stores'

const route = useRoute()
const router = useRouter()
const storeAuth = useStoreAuth()
const storeNotification = useStoreNotification()
const storeTheme = useStoreTheme()
const { filterNotifications, unreadCount } = storeToRefs(storeNotification)
const { isDark } = storeToRefs(storeTheme)
const slideSidebarMobile = ref(false)
const sidebarCollapsed = ref(false)
const slideNotificaciones = ref(false)
const slideSettings = ref(false)

const handleToggleSidebarMobile = () => {
  slideSidebarMobile.value = !slideSidebarMobile.value
}

const handleCloseSidebarMobile = () => {
  slideSidebarMobile.value = false
}

const handleToggleSidebarCollapse = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

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
  slideSidebarMobile.value = false
  slideSettings.value = false
  router.push(AUTH_ROUTE_DASHBOARD)
}

const handleGoUsers = () => {
  slideSidebarMobile.value = false
  slideSettings.value = false
  router.push(AUTH_ROUTE_USERS)
}

const handleGoSettings = () => {
  slideSidebarMobile.value = false
  slideSettings.value = false
  router.push(AUTH_ROUTE_SETTINGS)
}

const handleGoLogout = () => {
  slideSidebarMobile.value = false
  slideSettings.value = false
  router.push(AUTH_ROUTE_LOGOUT)
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

onMounted(async () => {
  if (!storeAuth.user) {
    try {
      await storeAuth.getCurrentUser()
    } catch {
      router.push(AUTH_ROUTE_LOGIN)
      return
    }
  }

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
    class="layout-private-default flex min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100"
  >
    <SidebarComponent
      :current-path="route.path"
      :mobile-open="slideSidebarMobile"
      :collapsed="sidebarCollapsed"
      :on-close-mobile="handleCloseSidebarMobile"
      :on-toggle-desktop-collapse="handleToggleSidebarCollapse"
      :on-go-dashboard="handleGoDashboard"
      :on-go-users="handleGoUsers"
      :on-go-logout="handleGoLogout"
    />

    <section class="flex min-h-screen w-full flex-col lg:pl-0">
      <NavbarComponent
        :unread-count="unreadCount"
        :user-label="storeAuth.user?.username || storeAuth.user?.email || 'Usuario'"
        :user-email="storeAuth.user?.email || ''"
        :avatar-url="storeAuth.user?.avatar_url || ''"
        :is-dark="isDark"
        :on-go-dashboard="handleGoDashboard"
        :settings-dropdown-open="slideSettings"
        :on-toggle-settings-dropdown="handleToggleSettings"
        :on-close-settings-dropdown="handleCloseSettings"
        :on-toggle-sidebar="handleToggleSidebarMobile"
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
