import { computed, reactive, watch, type Ref } from 'vue'
import type { ValidationOptions, ValidationRule } from '@/interfaces'
import { mapperIsFormValid, mapperValidateField } from '@/mappers'

export function useFormValidation(
  form: Ref<Record<string, string>>,
  rules: Record<string, ValidationRule>,
  options: ValidationOptions = {},
) {
  const trigger = options.trigger || 'validacion'

  const errors = reactive<Record<string, string | null>>({})
  Object.keys(form.value).forEach((key) => {
    errors[key] = null
  })

  const validateField = (name: string): boolean => {
    const rule = rules[name]
    if (!rule) {
      errors[name] = null
      return true
    }
    errors[name] = mapperValidateField(form.value[name] || '', rule)
    return errors[name] === null
  }

  const validateAll = (): boolean => {
    let valid = true
    Object.keys(rules).forEach((key) => {
      if (!validateField(key)) valid = false
    })
    return valid
  }

  const isValid = computed(() => mapperIsFormValid(form.value, rules))

  if (trigger === 'change') {
    watch(
      () => ({ ...form.value }),
      (newValue, oldValue) => {
        Object.keys(rules).forEach((key) => {
          if (!oldValue || newValue[key] !== oldValue[key]) {
            validateField(key)
          }
        })
      },
    )
  }

  const onValidation = (name: string) => {
    return () => {
      if (trigger === 'validacion') validateField(name)
    }
  }

  return {
    errors,
    isValid,
    validateField,
    validateAll,
    onValidation,
  }
}
