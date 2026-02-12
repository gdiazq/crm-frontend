<script setup lang="ts">
interface SelectOption {
  label: string
  value: string
}

withDefaults(
  defineProps<{
    label: string
    required?: boolean
    options: SelectOption[]
  }>(),
  {
    required: false,
  },
)

const modelValue = defineModel<string>({ default: '' })
</script>

<template>
  <label class="block">
    <span class="mb-1 block text-xs font-semibold uppercase tracking-wide opacity-80">{{ label }}</span>
    <select
      v-model="modelValue"
      :required="required"
      class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus-visible:ring-offset-slate-950"
    >
      <option value="" disabled>Selecciona una opcion</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </label>
</template>
