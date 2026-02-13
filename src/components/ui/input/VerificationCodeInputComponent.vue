<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: string
  length?: number
  onValueChange?: (value: string) => void
}>(), {
  length: 6,
  onValueChange: undefined,
})

const digits = computed(() => {
  const cleanValue = (props.modelValue || '').replace(/\D/g, '').slice(0, props.length)
  return Array.from({ length: props.length }, (_, index) => cleanValue[index] || '')
})

const handleInput = (index: number, event: Event) => {
  const target = event.target
  if (!(target instanceof HTMLInputElement)) return
  const nextDigit = target.value.replace(/\D/g, '').slice(-1)

  const nextDigits = [...digits.value]
  nextDigits[index] = nextDigit
  props.onValueChange?.(nextDigits.join(''))
}

const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault()
  const pasted = event.clipboardData?.getData('text')?.replace(/\D/g, '') || ''
  props.onValueChange?.(pasted.slice(0, props.length))
}
</script>

<template>
  <div>
    <span class="mb-1 block text-xs font-semibold uppercase tracking-wide opacity-80">Codigo de verificacion</span>
    <div class="grid grid-cols-6 gap-2" @paste="handlePaste">
      <input
        v-for="(_, index) in digits"
        :key="index"
        :value="digits[index]"
        type="text"
        inputmode="numeric"
        pattern="[0-9]*"
        maxlength="1"
        autocomplete="one-time-code"
        class="h-12 w-full rounded-lg border border-slate-300 bg-white text-center text-lg font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus-visible:ring-offset-slate-950"
        @input="handleInput(index, $event)"
      />
    </div>
  </div>
</template>
