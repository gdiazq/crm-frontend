<script setup lang="ts">
import { ref } from 'vue'

withDefaults(
  defineProps<{
    isDark: boolean
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
        class="w-full rounded-lg border px-3 py-2.5 pr-11 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-cyan-400"
        :class="
          isDark
            ? 'border-slate-700 bg-slate-900 text-slate-100 placeholder:text-slate-500 focus-visible:ring-offset-slate-950'
            : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-offset-slate-50'
        "
      />
      <button
        type="button"
        class="absolute inset-y-0 right-2 my-auto h-8 rounded-md px-2 text-sm"
        :class="isDark ? 'text-slate-300 hover:text-cyan-300' : 'text-slate-600 hover:text-cyan-700'"
        @click="handleTogglePassword"
      >
        {{ showPassword ? 'Ocultar' : 'Ver' }}
      </button>
    </div>
  </label>
</template>
