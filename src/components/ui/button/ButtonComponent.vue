<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { RouteLocationRaw } from 'vue-router'

const props = withDefaults(
  defineProps<{
    isDark: boolean
    to?: RouteLocationRaw
    type?: 'button' | 'submit' | 'reset'
    variant?: 'solid' | 'outline'
    fullWidth?: boolean
    disabled?: boolean
  }>(),
  {
    type: 'button',
    variant: 'outline',
    fullWidth: false,
    disabled: false,
  },
)

const componentTag = computed(() => (props.to ? RouterLink : 'button'))

const classes = computed(() => {
  const base =
    'rounded-lg px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2'
  const width = props.fullWidth ? ' w-full' : ''
  const disabled = props.disabled ? ' cursor-not-allowed opacity-60' : ''

  if (props.variant === 'solid') {
    return props.isDark
      ? `${base}${width}${disabled} bg-cyan-400 text-slate-950 hover:bg-cyan-300 focus-visible:ring-offset-slate-950`
      : `${base}${width}${disabled} bg-cyan-600 text-white hover:bg-cyan-700 focus-visible:ring-offset-slate-50`
  }

  return props.isDark
    ? `${base}${width}${disabled} border border-slate-700 bg-slate-900 text-slate-100 hover:border-cyan-300/60 hover:text-cyan-300 focus-visible:ring-offset-slate-950`
    : `${base}${width}${disabled} border border-slate-300 bg-white text-slate-700 hover:border-cyan-500 hover:text-cyan-700 focus-visible:ring-offset-slate-50`
})
</script>

<template>
  <component :is="componentTag" :to="to" :type="to ? undefined : type" :disabled="disabled" :class="classes">
    <slot />
  </component>
</template>
