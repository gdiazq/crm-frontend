<script setup lang="ts">
import ButtonComponent from '@/components/ui/button/ButtonComponent.vue'
import InputComponent from '@/components/ui/input/InputComponent.vue'

const props = withDefaults(
  defineProps<{
    value: string
    loading?: boolean
    placeholder?: string
    buttonText?: string
    loadingButtonText?: string
    onValueChange: (value: string) => void
    onSearch: () => void
  }>(),
  {
    loading: false,
    placeholder: 'Buscar por nombre, apellido o correo',
    buttonText: 'Buscar',
    loadingButtonText: 'Buscando...',
  },
)

const handleSubmit = () => {
  props.onSearch()
}
</script>

<template>
  <form class="flex flex-col gap-3 md:flex-row md:items-end" @submit.prevent="handleSubmit">
    <div class="flex-1">
      <InputComponent
        :model-value="props.value"
        type="text"
        :placeholder="props.placeholder"
        :on-value-change="props.onValueChange"
      />
    </div>

    <ButtonComponent
      type="submit"
      variant="primary"
      :disabled="props.loading"
      :label="props.loading ? props.loadingButtonText : props.buttonText"
    />
  </form>
</template>
