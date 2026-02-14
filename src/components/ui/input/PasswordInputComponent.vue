<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: string
    label: string
    type?: 'password' | 'text'
    placeholder?: string
    required?: boolean
    autocomplete?: string
    minlength?: number
    error?: string | null
    onBlur?: () => void
    onValueChange?: (value: string) => void
    showVisibilityToggle?: boolean
    visibilityLabel?: string
    onToggleVisibility?: () => void
  }>(),
  {
    type: 'password',
    placeholder: '',
    required: false,
    error: null,
    onBlur: undefined,
    onValueChange: undefined,
    showVisibilityToggle: false,
    visibilityLabel: 'Ver',
    onToggleVisibility: undefined,
  },
)

const handleInput = (event: Event) => {
  const target = event.target
  if (!(target instanceof HTMLInputElement)) return
  props.onValueChange?.(target.value)
}
</script>

<template>
  <label class="block">
    <span class="mb-1 block text-xs font-semibold uppercase tracking-wide opacity-80">{{ label }}</span>
    <div class="relative">
      <input
        :value="props.modelValue"
        :type="props.type"
        :required="props.required"
        :autocomplete="props.autocomplete"
        :minlength="props.minlength"
        :placeholder="props.placeholder"
        :class="[
          'w-full rounded-lg bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-offset-slate-50 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus-visible:ring-offset-slate-950',
          props.error
            ? 'border border-rose-400 focus-visible:ring-rose-400 dark:border-rose-400 dark:focus-visible:ring-rose-400'
            : 'border border-slate-300 focus-visible:ring-cyan-400 dark:border-slate-700 dark:focus-visible:ring-cyan-400',
          props.showVisibilityToggle && 'pr-14',
        ]"
        @input="handleInput"
        @blur="props.onBlur?.()"
      />
      <button
        v-if="props.showVisibilityToggle"
        type="button"
        class="absolute inset-y-0 right-2 my-auto h-8 rounded-md px-2 text-sm text-slate-600 hover:text-cyan-700 dark:text-slate-300 dark:hover:text-cyan-300"
        @click="props.onToggleVisibility?.()"
      >
        {{ props.visibilityLabel }}
      </button>
    </div>
    <p v-if="props.error" class="mt-1 text-xs text-rose-500 dark:text-rose-400">
      {{ props.error }}
    </p>
  </label>
</template>
