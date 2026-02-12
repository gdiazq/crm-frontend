<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string
    type?: string
    placeholder?: string
    required?: boolean
    autocomplete?: string
    minlength?: number
  }>(),
  {
    type: 'text',
    placeholder: '',
    required: false,
  },
)

const modelValue = defineModel<string>({ default: '' })
</script>

<template>
  <label class="block">
    <span class="mb-1 block text-xs font-semibold uppercase tracking-wide opacity-80">{{ label }}</span>
    <input
      v-model="modelValue"
      :type="type"
      :required="required"
      :autocomplete="autocomplete"
      :minlength="minlength"
      :placeholder="placeholder"
      class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus-visible:ring-offset-slate-950"
    />
  </label>
</template>
