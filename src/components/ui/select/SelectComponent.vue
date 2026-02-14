<script setup lang="ts">
interface SelectOption {
  label: string
  value: string
}

const props = withDefaults(
  defineProps<{
    modelValue: string
    label: string
    required?: boolean
    options: SelectOption[]
    error?: string | null
    onValidation?: () => void
    onValueChange?: (value: string) => void
  }>(),
  {
    required: false,
    error: null,
    onValidation: undefined,
    onValueChange: undefined,
  },
)

const handleChange = (event: Event) => {
  const target = event.target
  if (!(target instanceof HTMLSelectElement)) return
  props.onValueChange?.(target.value)
}
</script>

<template>
  <label class="block">
    <span class="mb-1 block text-xs font-semibold uppercase tracking-wide opacity-80">{{ label }}</span>
    <select
      :value="props.modelValue"
      :required="props.required"
      :class="[
        'w-full rounded-lg bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus-visible:ring-2 focus-visible:ring-offset-slate-50 dark:bg-slate-900 dark:text-slate-100 dark:focus-visible:ring-offset-slate-950',
        props.error
          ? 'border border-rose-400 focus-visible:ring-rose-400 dark:border-rose-400 dark:focus-visible:ring-rose-400'
          : 'border border-slate-300 focus-visible:ring-cyan-400 dark:border-slate-700 dark:focus-visible:ring-cyan-400',
      ]"
      @change="handleChange"
      @focusout="props.onValidation?.()"
    >
      <option value="" disabled>Selecciona una opcion</option>
      <option v-for="option in props.options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <p v-if="props.error" class="mt-1 text-xs text-rose-500 dark:text-rose-400">
      {{ props.error }}
    </p>
  </label>
</template>
