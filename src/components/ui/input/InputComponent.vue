<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: string
    label?: string
    type?: string
    placeholder?: string
    required?: boolean
    autocomplete?: string
    minlength?: number
    error?: string | null
    onValidation?: () => void
    onValueChange?: (value: string) => void
  }>(),
  {
    label: '',
    type: 'text',
    placeholder: '',
    required: false,
    error: null,
    onValidation: undefined,
    onValueChange: undefined,
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
    <span v-if="props.label" class="mb-1 block text-xs font-semibold uppercase tracking-wide opacity-80">{{ props.label }}</span>
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
      ]"
      @input="handleInput"
      @focusout="props.onValidation?.()"
    />
    <p v-if="props.error" class="mt-1 text-xs text-rose-500 dark:text-rose-400">
      {{ props.error }}
    </p>
  </label>
</template>
