<script setup lang="ts">
import type { DashboardExampleKpi, DashboardExamplePipelineStage } from '@/interfaces'

const props = defineProps<{
  kpis: DashboardExampleKpi[]
  pipeline: DashboardExamplePipelineStage[]
  periodLabel: string
}>()
</script>

<template>
  <section class="space-y-6">
    <div class="rounded-2xl border border-slate-200 bg-white/90 p-5 dark:border-white/10 dark:bg-slate-900/70">
      <p class="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">
        Resumen Comercial
      </p>
      <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
        {{ props.periodLabel }}
      </p>

      <div class="mt-4 grid gap-3 sm:grid-cols-2">
        <article
          v-for="item in props.kpis"
          :key="item.id"
          class="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-slate-950/50"
        >
          <p class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{{ item.label }}</p>
          <p class="mt-2 text-2xl font-bold">{{ item.displayValue }}</p>
          <p
            class="mt-1 text-xs font-semibold"
            :class="item.variationPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'"
          >
            {{ item.variationLabel }}
          </p>
        </article>
      </div>
    </div>

    <div class="rounded-2xl border border-slate-200 bg-white/90 p-5 dark:border-white/10 dark:bg-slate-900/70">
      <h3 class="text-lg font-semibold">Pipeline de Ventas</h3>
      <div class="mt-4 grid gap-3 sm:grid-cols-2">
        <article
          v-for="stage in props.pipeline"
          :key="stage.id"
          class="rounded-xl border border-slate-200 p-4 dark:border-white/10"
        >
          <p class="text-sm font-semibold">{{ stage.label }}</p>
          <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">{{ stage.countLabel }}</p>
          <p class="text-base font-bold text-cyan-700 dark:text-cyan-300">{{ stage.amountLabel }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
