<script setup lang="ts">
import type { DropdownAction } from '@/utils'

const props = withDefaults(
  defineProps<{
    open: boolean
    actions: DropdownAction[]
    onToggle: () => void
  }>(),
  {
    open: false,
  },
)
</script>

<template>
  <div class="relative inline-flex" @click.stop>
    <button
      type="button"
      class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:ring-offset-slate-900"
      @click.stop="props.onToggle"
    >
      <span class="sr-only">Abrir acciones</span>
      <span class="text-base leading-none">...</span>
    </button>

    <div
      v-if="props.open"
      class="absolute right-0 top-10 z-30 min-w-52 rounded-lg border border-slate-200 bg-white p-1.5 shadow-xl dark:border-white/10 dark:bg-slate-900"
    >
      <button
        v-for="action in props.actions"
        :key="action.id"
        type="button"
        class="flex w-full items-center rounded-md px-3 py-2 text-left text-sm transition hover:bg-slate-100 dark:hover:bg-slate-800"
        :class="action.tone === 'danger' ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-200'"
        @click.stop="action.handler()"
      >
        {{ action.label }}
      </button>
    </div>
  </div>
</template>
