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
    onValueChange?: (value: string) => void
  }>(),
  {
    type: 'password',
    placeholder: '',
    required: false,
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
    <span class="mb-1 block text-xs font-semibold uppercase tracking-wide opacity-80">{{ label }}</span>
    <div class="relative">
      <input
        :value="props.modelValue"
        :type="props.type"
        :required="props.required"
        :autocomplete="props.autocomplete"
        :minlength="props.minlength"
        :placeholder="props.placeholder"
        class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus-visible:ring-offset-slate-950"
        @input="handleInput"
      />
    </div>
  </label>
</template>
