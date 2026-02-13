<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
    variant?: 'solid' | 'outline'
    fullWidth?: boolean
    disabled?: boolean
    onClick?: () => void
  }>(),
  {
    type: 'button',
    variant: 'outline',
    fullWidth: false,
    disabled: false,
    onClick: undefined,
  },
)

const variantClasses: Record<string, string> = {
  solid:
    'bg-cyan-600 text-white hover:bg-cyan-700 focus-visible:ring-offset-slate-50 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300 dark:focus-visible:ring-offset-slate-950',
  outline:
    'border border-slate-300 bg-white text-slate-700 hover:border-cyan-500 hover:text-cyan-700 focus-visible:ring-offset-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-cyan-300/60 dark:hover:text-cyan-300 dark:focus-visible:ring-offset-slate-950',
}

const classes = computed(() => [
  'rounded-lg px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2',
  variantClasses[props.variant],
  props.fullWidth && 'w-full',
  props.disabled && 'cursor-not-allowed opacity-60',
])
</script>

<template>
  <button :type="type" :disabled="disabled" :class="classes" @click="props.onClick">
    <slot />
  </button>
</template>
