<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { FeatureGrid, HeroContent, HeroHeader, KpiPanel, ThemeToggle } from '@/components'
import { CRM_FEATURES, CRM_STAGES, CRM_STATS } from '@/constants'
import { useStoreTheme } from '@/stores'

const themeStore = useStoreTheme()
const { isDark } = storeToRefs(themeStore)

onMounted(() => {
  themeStore.initTheme()
})
</script>

<template>
  <main
    class="min-h-screen transition-colors"
    :class="isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'"
  >
    <div class="fixed right-4 top-4 z-50">
      <ThemeToggle :is-dark="isDark" @toggle="themeStore.toggleTheme" />
    </div>
    <section
      class="relative isolate overflow-hidden border-b"
      :class="isDark ? 'border-white/10' : 'border-slate-200'"
    >
      <div
        class="absolute inset-0 -z-10"
        :class="
          isDark
            ? 'bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.2),_transparent_40%),radial-gradient(circle_at_80%_20%,_rgba(14,165,233,0.15),_transparent_30%)]'
            : 'bg-[radial-gradient(circle_at_top,_rgba(8,145,178,0.12),_transparent_45%),radial-gradient(circle_at_80%_20%,_rgba(14,116,144,0.1),_transparent_35%)]'
        "
      ></div>
      <div class="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
        <HeroHeader :is-dark="isDark" />
        <div class="mt-12 grid gap-10 lg:grid-cols-2 lg:items-center">
          <HeroContent :is-dark="isDark" />
          <KpiPanel :is-dark="isDark" :stats="CRM_STATS" :stages="CRM_STAGES" />
        </div>
      </div>
    </section>

    <FeatureGrid :is-dark="isDark" :features="CRM_FEATURES" />
  </main>
</template>
