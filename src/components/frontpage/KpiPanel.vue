<script setup lang="ts">
import type { CrmStage, CrmStat } from '@/interfaces'

defineProps<{
  isDark: boolean
  stats: CrmStat[]
  stages: CrmStage[]
}>()
</script>

<template>
  <div
    class="rounded-2xl border p-6 shadow-2xl"
    :class="isDark ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white/90 shadow-slate-200/70'"
  >
    <div v-if="stats.length > 0" class="grid gap-4 sm:grid-cols-3">
      <article
        v-for="stat in stats"
        :key="stat.label"
        class="rounded-xl border p-4"
        :class="isDark ? 'border-white/10 bg-slate-900' : 'border-slate-200 bg-white'"
      >
        <p class="text-xs" :class="isDark ? 'text-slate-400' : 'text-slate-500'">{{ stat.label }}</p>
        <p class="mt-2 text-2xl font-bold">{{ stat.value }}</p>
        <p class="mt-1 text-xs" :class="stat.trendClass">{{ stat.trend }}</p>
      </article>
    </div>
    <article
      v-else
      class="rounded-xl border border-dashed p-4 text-sm"
      :class="isDark ? 'border-white/20 bg-slate-900 text-slate-300' : 'border-slate-300 bg-white text-slate-600'"
    >
      No hay metricas disponibles en este momento.
    </article>

    <div
      class="mt-5 rounded-xl border p-4"
      :class="isDark ? 'border-white/10 bg-slate-900' : 'border-slate-200 bg-white'"
    >
      <div class="mb-4 flex items-center justify-between">
        <p class="text-sm font-semibold">Pipeline comercial</p>
        <span class="text-xs" :class="isDark ? 'text-slate-400' : 'text-slate-500'">Q1 2026</span>
      </div>
      <div v-if="stages.length > 0" class="space-y-3">
        <div v-for="stage in stages" :key="stage.label" class="flex items-center gap-3">
          <span class="w-28 text-xs" :class="isDark ? 'text-slate-400' : 'text-slate-500'">
            {{ stage.label }}
          </span>
          <div class="h-2 flex-1 rounded-full" :class="isDark ? 'bg-slate-800' : 'bg-slate-200'">
            <div class="h-2 rounded-full" :style="{ width: stage.width }" :class="stage.barClass"></div>
          </div>
        </div>
      </div>
      <p v-else class="text-sm" :class="isDark ? 'text-slate-300' : 'text-slate-600'">
        No hay etapas de pipeline configuradas.
      </p>
    </div>
  </div>
</template>
