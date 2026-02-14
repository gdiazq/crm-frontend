<script setup lang="ts">
import DrodownComponente from '@/components/common/DrodownComponente.vue'

const props = defineProps<{
  unreadCount: number
  userLabel?: string
  userEmail?: string
  avatarUrl?: string
  isDark: boolean
  onGoDashboard: () => void
  settingsDropdownOpen: boolean
  onToggleSettingsDropdown: () => void
  onCloseSettingsDropdown: () => void
  onToggleNotifications: () => void
  onToggleTheme: () => void
  onGoSettings: () => void
  onGoLogout: () => void
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
    </nav>

    <div class="flex items-center gap-2">
      <DrodownComponente
        :open="props.settingsDropdownOpen"
        :user-label="props.userLabel"
        :user-email="props.userEmail"
        :avatar-url="props.avatarUrl"
        :unread-count="props.unreadCount"
        :is-dark="props.isDark"
        :on-toggle="props.onToggleSettingsDropdown"
        :on-close="props.onCloseSettingsDropdown"
        :on-toggle-notifications="props.onToggleNotifications"
        :on-toggle-theme="props.onToggleTheme"
        :on-go-settings="props.onGoSettings"
        :on-go-logout="props.onGoLogout"
      />
    </div>
  </header>
</template>
