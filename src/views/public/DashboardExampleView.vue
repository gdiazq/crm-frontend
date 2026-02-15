<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import {
  FooterComponent,
  SellerDashboardMainComponent,
  SellerDashboardSideComponent,
  ThemeToggle,
} from '@/components'
import { AUTH_ROUTE_HOME } from '@/constants'
import { useStoreDashboardExample, useStoreTheme } from '@/stores'

const router = useRouter()
const storeTheme = useStoreTheme()
const storeDashboardExample = useStoreDashboardExample()
const { isDark } = storeToRefs(storeTheme)

const dashboard = computed(() => storeDashboardExample.dashboard)

const handleGoHome = () => {
  router.push(AUTH_ROUTE_HOME)
}

onMounted(async () => {
  await storeDashboardExample.getDashboard()
})
</script>

<template>
  <main class="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
    <div class="fixed right-4 top-4 z-50">
      <ThemeToggle :is-dark="isDark" :on-toggle="storeTheme.toggleTheme" />
    </div>

    <section class="relative overflow-hidden border-b border-slate-200 dark:border-white/10">
      <div class="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(8,145,178,0.12),_transparent_45%),radial-gradient(circle_at_80%_20%,_rgba(14,116,144,0.1),_transparent_35%)] dark:bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.2),_transparent_40%),radial-gradient(circle_at_80%_20%,_rgba(14,165,233,0.15),_transparent_30%)]"></div>
      <div class="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <button
          type="button"
          class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
          @click="handleGoHome"
        >
          <span aria-hidden="true">←</span>
          Volver al inicio
        </button>

        <div class="mt-6">
          <p class="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700 dark:text-cyan-300">Dashboard Publico</p>
          <h1 class="mt-3 text-balance text-4xl font-bold leading-tight sm:text-5xl">
            Panel vendedor de {{ dashboard.seller.name || 'equipo comercial' }}
          </h1>
          <p class="mt-4 max-w-2xl text-slate-600 dark:text-slate-300">
            Vista demo para seguimiento de oportunidades, actividad diaria y foco de cierre en terreno {{ dashboard.seller.territory }}.
          </p>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      <template v-if="storeDashboardExample.loadingDashboard">
        <div class="rounded-2xl border border-dashed border-cyan-400/40 p-8 text-center text-sm">
          Cargando dashboard...
        </div>
      </template>

      <template v-else-if="storeDashboardExample.errorMessage">
        <div class="rounded-2xl border border-rose-300 bg-rose-50 p-6 text-sm text-rose-700 dark:border-rose-400/40 dark:bg-rose-900/20 dark:text-rose-200">
          {{ storeDashboardExample.errorMessage }}
        </div>
      </template>

      <template v-else>
        <div class="grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
          <SellerDashboardMainComponent
            :kpis="dashboard.kpis"
            :pipeline="dashboard.pipeline"
            :period-label="dashboard.periodLabel"
          />

          <SellerDashboardSideComponent
            :tasks="dashboard.tasks"
            :top-clients="dashboard.topClients"
            :recent-activity="dashboard.recentActivity"
          />
        </div>
      </template>
    </section>

    <FooterComponent />
  </main>
</template>
