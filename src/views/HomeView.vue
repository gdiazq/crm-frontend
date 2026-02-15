<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { FeatureGrid, FooterComponent, HeroContent, HeroHeader, KpiPanel, ThemeToggle } from '@/components'
import {
  AUTH_ROUTE_DASHBOARD_EXAMPLE,
  AUTH_ROUTE_LOGIN,
  AUTH_ROUTE_REGISTER,
  CRM_FEATURES,
  CRM_STAGES,
  CRM_STATS,
} from '@/constants'
import { useStoreTheme } from '@/stores'

const router = useRouter()
const storeTheme = useStoreTheme()
const { isDark } = storeToRefs(storeTheme)

const handleGoRegister = () => {
  router.push(AUTH_ROUTE_REGISTER)
}

const handleGoLogin = () => {
  router.push(AUTH_ROUTE_LOGIN)
}

const handleGoDashboard = () => {
  router.push(AUTH_ROUTE_DASHBOARD_EXAMPLE)
}
</script>

<template>
  <main class="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
    <div class="fixed right-4 top-4 z-50">
      <ThemeToggle :is-dark="isDark" :on-toggle="storeTheme.toggleTheme" />
    </div>
    <section class="relative isolate overflow-hidden border-b border-slate-200 dark:border-white/10">
      <div class="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(8,145,178,0.12),_transparent_45%),radial-gradient(circle_at_80%_20%,_rgba(14,116,144,0.1),_transparent_35%)] dark:bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.2),_transparent_40%),radial-gradient(circle_at_80%_20%,_rgba(14,165,233,0.15),_transparent_30%)]"></div>
      <div class="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
        <HeroHeader :on-go-register="handleGoRegister" :on-go-login="handleGoLogin" />
        <div class="mt-12 grid gap-10 lg:grid-cols-2 lg:items-center">
          <HeroContent :on-go-register="handleGoRegister" :on-go-dashboard="handleGoDashboard" />
          <KpiPanel :stats="CRM_STATS" :stages="CRM_STAGES" />
        </div>
      </div>
    </section>

    <FeatureGrid :features="CRM_FEATURES" />
    <FooterComponent />
  </main>
</template>
