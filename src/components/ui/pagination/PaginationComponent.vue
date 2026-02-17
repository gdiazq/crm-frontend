<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    currentPage: number
    totalPages: number
    loading?: boolean
    onGoPage: (page: number) => void
    onPrevious: () => void
    onNext: () => void
  }>(),
  {
    loading: false,
  },
)

const controlCanGoPrevious = computed(() => props.currentPage > 1 && !props.loading)
const controlCanGoNext = computed(() => props.currentPage < props.totalPages && !props.loading)
const controlShowPagination = computed(() => props.totalPages > 0)

const pageItems = computed<(number | string)[]>(() => {
  const total = props.totalPages
  const current = props.currentPage

  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1)
  }

  const items: (number | string)[] = [1]
  const left = Math.max(current - 1, 2)
  const right = Math.min(current + 1, total - 1)

  if (left > 2) items.push('...')
  for (let page = left; page <= right; page += 1) items.push(page)
  if (right < total - 1) items.push('...')

  items.push(total)
  return items
})
</script>

<template>
  <nav v-if="controlShowPagination" class="flex items-center gap-2">
    <button
      type="button"
      class="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
      :disabled="!controlCanGoPrevious"
      @click="props.onPrevious"
    >
      Anterior
    </button>

    <button
      v-for="item in pageItems"
      :key="String(item) + '-' + currentPage"
      type="button"
      class="rounded-lg border px-3 py-2 text-xs font-semibold transition disabled:cursor-default disabled:opacity-60"
      :class="[
        typeof item === 'number' && item === props.currentPage
          ? 'border-cyan-500 bg-cyan-600 text-white dark:border-cyan-300 dark:bg-cyan-500 dark:text-white'
          : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800',
      ]"
      :disabled="typeof item !== 'number' || props.loading"
      @click="typeof item === 'number' ? props.onGoPage(item) : undefined"
    >
      {{ item }}
    </button>

    <button
      type="button"
      class="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
      :disabled="!controlCanGoNext"
      @click="props.onNext"
    >
      Siguiente
    </button>
  </nav>
</template>
