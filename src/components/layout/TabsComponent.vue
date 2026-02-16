<script setup lang="ts">
import type { SettingTabKey, SettingTabOption } from '@/interfaces'

const props = defineProps<{
  tabs: SettingTabOption[]
  activeTab: SettingTabKey
  onTabChange: (tab: SettingTabKey) => void
}>()
</script>

<template>
  <div class="rounded-xl border border-slate-200 bg-white p-1 dark:border-white/10 dark:bg-slate-900/60">
    <div class="flex flex-wrap gap-1">
      <button
        v-for="tab in props.tabs"
        :key="tab.key"
        type="button"
        class="rounded-lg px-3 py-2 text-sm font-semibold transition"
        :class="tab.key === props.activeTab
          ? 'bg-cyan-600 text-white dark:bg-cyan-400 dark:text-slate-950'
          : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'"
        @click="props.onTabChange(tab.key)"
      >
        {{ tab.label }}
      </button>
    </div>
  </div>
</template>
