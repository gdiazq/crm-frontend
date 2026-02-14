import type { ValidationRule } from '@/interfaces'

export const loginValidationRules: Record<string, ValidationRule> = {
  email: { required: true, email: true },
  password: { required: true, minLength: 6 },
}

export const registerValidationRules: Record<string, ValidationRule> = {
  username: { required: true, minLength: 3 },
  firstName: { required: true },
  lastName: { required: true },
  phoneNumber: { required: true },
  email: { required: true, email: true },
}

export const verifyEmailValidationRules: Record<string, ValidationRule> = {
  code: { required: true, minLength: 6 },
}

export const updateProfileValidationRules: Record<string, ValidationRule> = {
  firstName: { required: true, minLength: 2 },
  lastName: { required: true, minLength: 2 },
  email: { required: true, email: true },
  phoneNumber: { required: true, pattern: /^\+?[0-9]{8,15}$/ },
}
