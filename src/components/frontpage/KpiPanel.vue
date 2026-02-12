<script setup lang="ts">
import type { CrmStage, CrmStat } from '@/interfaces'

defineProps<{
  stats: CrmStat[]
  stages: CrmStage[]
}>()
</script>

<template>
  <div
    class="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-2xl shadow-slate-200/70 dark:border-white/10 dark:bg-slate-900/70 dark:shadow-none"
  >
    <div v-if="stats.length > 0" class="grid gap-4 sm:grid-cols-3">
      <article
        v-for="stat in stats"
        :key="stat.label"
        class="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900"
      >
        <p class="text-xs text-slate-500 dark:text-slate-400">{{ stat.label }}</p>
        <p class="mt-2 text-2xl font-bold">{{ stat.value }}</p>
        <p class="mt-1 text-xs" :class="stat.trendClass">{{ stat.trend }}</p>
      </article>
    </div>
    <article
      v-else
      class="rounded-xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600 dark:border-white/20 dark:bg-slate-900 dark:text-slate-300"
    >
      No hay metricas disponibles en este momento.
    </article>

    <div class="mt-5 rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
      <div class="mb-4 flex items-center justify-between">
        <p class="text-sm font-semibold">Pipeline comercial</p>
        <span class="text-xs text-slate-500 dark:text-slate-400">Q1 2026</span>
      </div>
      <div v-if="stages.length > 0" class="space-y-3">
        <div v-for="stage in stages" :key="stage.label" class="flex items-center gap-3">
          <span class="w-28 text-xs text-slate-500 dark:text-slate-400">
            {{ stage.label }}
          </span>
          <div class="h-2 flex-1 rounded-full bg-slate-200 dark:bg-slate-800">
            <div class="h-2 rounded-full" :style="{ width: stage.width }" :class="stage.barClass"></div>
          </div>
        </div>
      </div>
      <p v-else class="text-sm text-slate-600 dark:text-slate-300">
        No hay etapas de pipeline configuradas.
      </p>
    </div>
  </div>
</template>
