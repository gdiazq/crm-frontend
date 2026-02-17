<script setup lang="ts">
import type { UserTableRow } from '@/interfaces'

const props = withDefaults(
  defineProps<{
    columns: string[]
    rows: UserTableRow[]
    loading?: boolean
    emptyMessage?: string
  }>(),
  {
    loading: false,
    emptyMessage: 'Sin datos para mostrar.',
  },
)
</script>

<template>
  <section class="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900/60">
    <div v-if="props.loading" class="p-6 text-sm text-slate-600 dark:text-slate-300">
      Cargando usuarios...
    </div>

    <div v-else-if="props.rows.length === 0" class="p-6 text-sm text-slate-600 dark:text-slate-300">
      {{ props.emptyMessage }}
    </div>

    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-slate-200 dark:divide-white/10">
        <thead class="bg-slate-100/80 dark:bg-slate-800/70">
          <tr>
            <th
              v-for="column in props.columns"
              :key="column"
              class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-200"
            >
              {{ column }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200 dark:divide-white/10">
          <tr v-for="row in props.rows" :key="row.id" class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
            <td
              v-for="(value, index) in row.values"
              :key="`${row.id}-${index}`"
              class="whitespace-nowrap px-4 py-3 text-sm text-slate-700 dark:text-slate-200"
            >
              <slot name="cell" :row="row" :value="value" :column-index="index">
                {{ value }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
