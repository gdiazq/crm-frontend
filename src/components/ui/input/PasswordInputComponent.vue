<script setup lang="ts">
import { ref } from 'vue'

withDefaults(
  defineProps<{
    label: string
    placeholder?: string
    required?: boolean
    autocomplete?: string
    minlength?: number
  }>(),
  {
    placeholder: '',
    required: false,
  },
)

const modelValue = defineModel<string>({ default: '' })
const showPassword = ref(false)

const handleTogglePassword = () => {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <label class="block">
    <span class="mb-1 block text-xs font-semibold uppercase tracking-wide opacity-80">{{ label }}</span>
    <div class="relative">
      <input
        v-model="modelValue"
        :type="showPassword ? 'text' : 'password'"
        :required="required"
        :autocomplete="autocomplete"
        :minlength="minlength"
        :placeholder="placeholder"
        class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus-visible:ring-offset-slate-950"
      />
      <button
        type="button"
        class="absolute inset-y-0 right-2 my-auto h-8 rounded-md px-2 text-sm text-slate-600 hover:text-cyan-700 dark:text-slate-300 dark:hover:text-cyan-300"
        @click="handleTogglePassword"
      >
        {{ showPassword ? 'Ocultar' : 'Ver' }}
      </button>
    </div>
  </label>
</template>
