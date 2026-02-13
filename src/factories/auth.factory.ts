import type { AuthCreatePasswordForm, PasswordRequirement } from '@/interfaces'

export const initialCreatePasswordForm: AuthCreatePasswordForm = {
  password: '',
  confirmPassword: '',
}

export const initialPasswordRequirements: PasswordRequirement[] = [
  { key: 'lowercase', label: 'Al menos 1 letra minuscula', valid: false },
  { key: 'uppercase', label: 'Al menos 1 letra mayuscula', valid: false },
  { key: 'number', label: 'Al menos 1 numero', valid: false },
  { key: 'specialChar', label: 'Al menos 1 caracter especial', valid: false },
  { key: 'minLength', label: 'Minimo 10 caracteres', valid: false },
]
