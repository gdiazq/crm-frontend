import type { AuthCreatePasswordPayload, PasswordRequirement } from '@/interfaces'

export const mapperCreatePasswordPayload = (token: string, password: string): AuthCreatePasswordPayload => {
  return {
    token,
    newPassword: password,
  }
}

export const mapperPasswordRequirements = (password: string, minLength = 10): PasswordRequirement[] => {
  return [
    { key: 'lowercase', label: 'Al menos 1 letra minuscula', valid: /[a-z]/.test(password) },
    { key: 'uppercase', label: 'Al menos 1 letra mayuscula', valid: /[A-Z]/.test(password) },
    { key: 'number', label: 'Al menos 1 numero', valid: /[0-9]/.test(password) },
    { key: 'specialChar', label: 'Al menos 1 caracter especial', valid: /[^A-Za-z0-9]/.test(password) },
    { key: 'minLength', label: `Minimo ${minLength} caracteres`, valid: password.length >= minLength },
  ]
}

export const mapperMissingPasswordRequirements = (requirements: PasswordRequirement[]): string[] => {
  return requirements.filter((requirement) => !requirement.valid).map((requirement) => requirement.label)
}
