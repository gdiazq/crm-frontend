<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ComponentPublicInstance } from 'vue'

const props = defineProps<{
  isDark: boolean
  length?: number
}>()

const modelValue = defineModel<string>({ default: '' })
const codeDigits = ref<string[]>(Array(props.length ?? 6).fill(''))
const inputRefs = ref<HTMLInputElement[]>([])

const syncModelFromDigits = () => {
  modelValue.value = codeDigits.value.join('')
}

const focusAt = (index: number) => {
  const input = inputRefs.value[index]
  if (!input) return
  input.focus()
  input.select()
}

const handleInput = (index: number, event: Event) => {
  const target = event.target
  if (!(target instanceof HTMLInputElement)) return

  const value = target.value.replace(/\D/g, '')
  codeDigits.value[index] = value.slice(-1)
  syncModelFromDigits()

  if (value && index < codeDigits.value.length - 1) {
    focusAt(index + 1)
  }
}

const handleKeydown = (index: number, event: KeyboardEvent) => {
  if (event.key === 'Backspace' && !codeDigits.value[index] && index > 0) {
    focusAt(index - 1)
  }

  if (event.key === 'ArrowLeft' && index > 0) {
    focusAt(index - 1)
  }

  if (event.key === 'ArrowRight' && index < codeDigits.value.length - 1) {
    focusAt(index + 1)
  }
}

const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault()
  const pasted = event.clipboardData?.getData('text')?.replace(/\D/g, '') || ''
  const digits = pasted.slice(0, codeDigits.value.length).split('')

  codeDigits.value = codeDigits.value.map((_, index) => digits[index] || '')
  syncModelFromDigits()

  const nextIndex = Math.min(digits.length, codeDigits.value.length - 1)
  focusAt(nextIndex)
}

const setInputRef = (index: number, el: Element | ComponentPublicInstance | null) => {
  if (el instanceof HTMLInputElement) {
    inputRefs.value[index] = el
  }
}

watch(
  () => modelValue.value,
  (value) => {
    const digits = (value || '').replace(/\D/g, '').slice(0, codeDigits.value.length).split('')
    codeDigits.value = codeDigits.value.map((_, index) => digits[index] || '')
  },
  { immediate: true },
)
</script>

<template>
  <div>
    <span class="mb-1 block text-xs font-semibold uppercase tracking-wide opacity-80">Codigo de verificacion</span>
    <div class="grid grid-cols-6 gap-2" @paste="handlePaste">
      <input
        v-for="(_, index) in codeDigits"
        :key="index"
        :ref="(el) => setInputRef(index, el)"
        v-model="codeDigits[index]"
        type="text"
        inputmode="numeric"
        pattern="[0-9]*"
        maxlength="1"
        autocomplete="one-time-code"
        class="h-12 w-full rounded-lg border text-center text-lg font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-cyan-400"
        :class="
          isDark
            ? 'border-slate-700 bg-slate-900 text-slate-100 placeholder:text-slate-500 focus-visible:ring-offset-slate-950'
            : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-offset-slate-50'
        "
        @input="handleInput(index, $event)"
        @keydown="handleKeydown(index, $event)"
      />
    </div>
  </div>
</template>
