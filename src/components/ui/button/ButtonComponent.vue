<script setup lang="ts">
import { computed } from 'vue'

type ButtonVariant = 'solid' | 'outline' | 'primary' | 'success' | 'danger' | 'subtle'
type ButtonSize = 'sm' | 'md'

const props = withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
    variant?: ButtonVariant
    size?: ButtonSize
    fullWidth?: boolean
    disabled?: boolean
    label?: string
    className?: string
    onClick?: () => void
  }>(),
  {
    type: 'button',
    variant: 'outline',
    size: 'md',
    fullWidth: false,
    disabled: false,
    label: '',
    className: '',
    onClick: undefined,
  },
)

const variantClasses: Record<ButtonVariant, string> = {
  solid:
    'bg-cyan-600 text-white hover:bg-cyan-700 focus-visible:ring-offset-slate-50 dark:bg-cyan-400 dark:text-white dark:hover:bg-cyan-300 dark:focus-visible:ring-offset-slate-950',
  primary:
    'bg-cyan-600 text-white hover:bg-cyan-700 focus-visible:ring-offset-slate-50 dark:bg-cyan-400 dark:text-white dark:hover:bg-cyan-300 dark:focus-visible:ring-offset-slate-950',
  success:
    'bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-offset-slate-50 dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-400 dark:focus-visible:ring-offset-slate-950',
  danger:
    'bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-offset-slate-50 dark:bg-rose-500 dark:text-white dark:hover:bg-rose-400 dark:focus-visible:ring-offset-slate-950',
  outline:
    'border border-slate-300 bg-slate-700 text-white hover:border-cyan-500 hover:text-white focus-visible:ring-offset-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:border-cyan-300/60 dark:hover:text-white dark:focus-visible:ring-offset-slate-950',
  subtle:
    'border border-slate-300 bg-slate-600 text-white hover:border-slate-400 hover:text-white focus-visible:ring-offset-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:border-slate-600 dark:hover:text-white dark:focus-visible:ring-offset-slate-950',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-2 text-xs',
  md: 'px-4 py-2 text-sm',
}

const classes = computed(() => [
  'rounded-lg font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2',
  sizeClasses[props.size],
  variantClasses[props.variant],
  props.fullWidth && 'w-full',
  props.disabled && 'cursor-not-allowed opacity-60',
  props.className,
])
</script>

<template>
  <button :type="type" :disabled="disabled" :class="classes" @click="props.onClick">
    <slot>{{ props.label }}</slot>
  </button>
</template>
