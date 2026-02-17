<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    enabled?: boolean
    enabledLabel?: string
    disabledLabel?: string
  }>(),
  {
    enabled: false,
    enabledLabel: 'Habilitado',
    disabledLabel: 'Deshabilitado',
  },
)

const label = computed(() => (props.enabled ? props.enabledLabel : props.disabledLabel))
const classes = computed(() => {
  if (props.enabled) {
    return 'bg-emerald-100 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-400/30'
  }
  return 'bg-rose-100 text-rose-700 ring-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:ring-rose-400/30'
})
</script>

<template>
  <span
    class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset"
    :class="classes"
  >
    {{ label }}
  </span>
</template>
