<script setup lang="ts">
import type { DashboardExampleActivity, DashboardExampleClient, DashboardExampleTask } from '@/interfaces'

const props = defineProps<{
  tasks: DashboardExampleTask[]
  topClients: DashboardExampleClient[]
  recentActivity: DashboardExampleActivity[]
}>()

const priorityClass: Record<DashboardExampleTask['priority'], string> = {
  alta: 'text-rose-600 dark:text-rose-400',
  media: 'text-amber-600 dark:text-amber-400',
  baja: 'text-emerald-600 dark:text-emerald-400',
}
</script>

<template>
  <section class="space-y-6">
    <div class="rounded-2xl border border-slate-200 bg-white/90 p-5 dark:border-white/10 dark:bg-slate-900/70">
      <h3 class="text-lg font-semibold">Agenda del Dia</h3>
      <div class="mt-4 space-y-3">
        <article
          v-for="task in props.tasks"
          :key="task.id"
          class="rounded-xl border border-slate-200 p-3 dark:border-white/10"
        >
          <p class="text-sm font-semibold">{{ task.title }}</p>
          <div class="mt-1 flex items-center justify-between">
            <p class="text-xs text-slate-500 dark:text-slate-400">{{ task.dueAtLabel }}</p>
            <p class="text-xs font-semibold uppercase" :class="priorityClass[task.priority]">{{ task.priority }}</p>
          </div>
        </article>
      </div>
    </div>

    <div class="rounded-2xl border border-slate-200 bg-white/90 p-5 dark:border-white/10 dark:bg-slate-900/70">
      <h3 class="text-lg font-semibold">Top Clientes</h3>
      <div class="mt-4 space-y-3">
        <article
          v-for="client in props.topClients"
          :key="client.id"
          class="rounded-xl border border-slate-200 p-3 dark:border-white/10"
        >
          <p class="text-sm font-semibold">{{ client.name }}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400">{{ client.company }}</p>
          <div class="mt-2 flex items-center justify-between">
            <p class="text-sm font-bold text-cyan-700 dark:text-cyan-300">{{ client.amountLabel }}</p>
            <p class="text-xs font-semibold uppercase" :class="client.status === 'activo' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'">
              {{ client.status }}
            </p>
          </div>
        </article>
      </div>
    </div>

    <div class="rounded-2xl border border-slate-200 bg-white/90 p-5 dark:border-white/10 dark:bg-slate-900/70">
      <h3 class="text-lg font-semibold">Actividad Reciente</h3>
      <div class="mt-4 space-y-2">
        <article
          v-for="item in props.recentActivity"
          :key="item.id"
          class="rounded-lg border border-slate-200 px-3 py-2 dark:border-white/10"
        >
          <p class="text-sm">{{ item.text }}</p>
          <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ item.atLabel }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
