export type ValidationTrigger = 'blur' | 'change'

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  email?: boolean
  custom?: (value: string) => string | null
}

export interface ValidationOptions {
  trigger?: ValidationTrigger
}
