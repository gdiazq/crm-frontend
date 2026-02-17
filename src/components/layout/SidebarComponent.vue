<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    currentPath: string
    mobileOpen: boolean
    collapsed: boolean
    onCloseMobile?: () => void
    onToggleDesktopCollapse?: () => void
    onGoDashboard: () => void
    onGoUsers: () => void
    onGoLogout: () => void
  }>(),
  {
    onCloseMobile: undefined,
    onToggleDesktopCollapse: undefined,
  },
)

const isDashboardActive = computed(() => props.currentPath === '/dashboard')
const isUsersActive = computed(() => props.currentPath === '/users')

const getItemClasses = (active: boolean) => {
  if (active) {
    return 'bg-cyan-600 text-white dark:bg-cyan-500 dark:text-white'
  }
  return 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
}
</script>

<template>
  <div class="lg:min-h-screen lg:shrink-0">
    <div
      v-if="props.mobileOpen"
      class="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
      @click="props.onCloseMobile?.()"
    ></div>

    <aside
      class="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white p-4 transition-all duration-200 dark:border-white/10 dark:bg-slate-900 lg:static lg:z-auto lg:min-h-screen lg:translate-x-0"
      :class="[
        props.mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        props.collapsed ? 'lg:w-20' : 'lg:w-72',
      ]"
    >
      <div class="mb-6 flex items-center justify-between">
        <p class="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300" :class="props.collapsed ? 'lg:hidden' : ''">
          Menu
        </p>
        <button
          type="button"
          class="hidden rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:inline-flex lg:items-center lg:justify-center dark:text-slate-300 dark:hover:bg-slate-800"
          @click="props.onToggleDesktopCollapse?.()"
        >
          <span class="sr-only">Contraer o expandir menu</span>
          <svg
            viewBox="0 0 24 24"
            class="h-4 w-4 transition-transform"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            :class="props.collapsed ? 'rotate-180' : ''"
          >
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
        <button
          type="button"
          class="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden dark:text-slate-300 dark:hover:bg-slate-800"
          @click="props.onCloseMobile?.()"
        >
          <span class="sr-only">Cerrar menu</span>
          <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 6l12 12M18 6l-12 12" />
          </svg>
        </button>
      </div>

      <nav class="space-y-2">
        <button
          type="button"
          class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold transition"
          :class="[getItemClasses(isDashboardActive), props.collapsed ? 'lg:justify-center lg:px-2' : '']"
          :title="props.collapsed ? 'Dashboard' : ''"
          @click="props.onGoDashboard"
        >
          <svg viewBox="0 0 24 24" class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 13h8V3H3v10zm10 8h8V3h-8v18zM3 21h8v-6H3v6z" />
          </svg>
          <span :class="props.collapsed ? 'lg:hidden' : ''">Dashboard</span>
        </button>

        <button
          type="button"
          class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold transition"
          :class="[getItemClasses(isUsersActive), props.collapsed ? 'lg:justify-center lg:px-2' : '']"
          :title="props.collapsed ? 'Usuarios' : ''"
          @click="props.onGoUsers"
        >
          <svg viewBox="0 0 24 24" class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <path d="M20 8v6M23 11h-6" />
          </svg>
          <span :class="props.collapsed ? 'lg:hidden' : ''">Usuarios</span>
        </button>

      </nav>

      <div class="mt-auto border-t border-slate-200 pt-4 dark:border-white/10">
        <button
          type="button"
          class="flex w-full items-center gap-3 rounded-lg bg-rose-600 px-3 py-2 text-left text-sm font-semibold text-white transition hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-400"
          :class="props.collapsed ? 'lg:justify-center lg:px-2' : ''"
          :title="props.collapsed ? 'Salir' : ''"
          @click="props.onGoLogout"
        >
          <svg viewBox="0 0 24 24" class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <path d="M16 17l5-5-5-5" />
            <path d="M21 12H9" />
          </svg>
          <span :class="props.collapsed ? 'lg:hidden' : ''">Salir</span>
        </button>
      </div>
    </aside>
  </div>
</template>
