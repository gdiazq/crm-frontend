<script setup lang="ts">
withDefaults(
  defineProps<{
    isDark: boolean
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
      class="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-cyan-400"
      :class="
        isDark
          ? 'border-slate-700 bg-slate-900 text-slate-100 placeholder:text-slate-500 focus-visible:ring-offset-slate-950'
          : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-offset-slate-50'
      "
    />
  </label>
</template>
