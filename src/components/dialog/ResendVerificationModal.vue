<script setup lang="ts">
import ButtonComponent from '@/components/ui/button/ButtonComponent.vue'
import InputComponent from '@/components/ui/input/InputComponent.vue'

const props = defineProps<{
  open: boolean
  phoneNumber: string
  submitting: boolean
  errorMessage: string | null
  onClose: () => void
  onConfirm: () => void
  onPhoneNumberChange: (value: string) => void
}>()
</script>

<template>
  <section
    v-if="props.open"
    class="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 p-4"
    @click.self="props.onClose"
  >
    <section class="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-slate-900">
      <h3 class="text-lg font-semibold">Reenviar codigo</h3>
      <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
        Ingresa tu numero de telefono para confirmar el reenvio.
      </p>

      <div class="mt-4">
        <InputComponent
          :model-value="props.phoneNumber"
          label="Telefono"
          type="tel"
          autocomplete="tel"
          placeholder="+56912345678"
          required
          :on-value-change="props.onPhoneNumberChange"
        />
      </div>
      <p v-if="props.errorMessage" class="mt-2 text-sm text-rose-500">
        {{ props.errorMessage }}
      </p>

      <div class="mt-4 flex justify-end gap-2">
        <ButtonComponent variant="outline" :disabled="props.submitting" :on-click="props.onClose">
          Cancelar
        </ButtonComponent>
        <ButtonComponent variant="solid" :disabled="props.submitting" :on-click="props.onConfirm">
          {{ props.submitting ? 'Reenviando...' : 'Confirmar reenvio' }}
        </ButtonComponent>
      </div>
    </section>
  </section>
</template>
