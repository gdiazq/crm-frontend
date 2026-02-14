import type {
  AuthCreatePasswordPayload,
  AuthForgotPasswordPayload,
  AuthLoginPayload,
  AuthRegisterPayload,
  AuthResendVerificationPayload,
  AuthUpdateAvatarPayload,
  AuthUpdateProfilePayload,
  AuthVerifyEmailPayload,
  PasswordRequirement,
} from '@/interfaces'

export const mapperLoginPayload = (email: string, password: string): AuthLoginPayload => {
  return {
    email: email.trim(),
    password,
  }
}

export const mapperCreatePasswordPayload = (token: string, password: string): AuthCreatePasswordPayload => {
  return {
    token,
    newPassword: password,
  }
}

export const mapperForgotPasswordPayload = (email: string): AuthForgotPasswordPayload => {
  return { email: email.trim() }
}

export const mapperRegisterPayload = (
  username: string,
  email: string,
  firstName: string,
  lastName: string,
  phoneNumber: string,
): AuthRegisterPayload => {
  return {
    username: username.trim(),
    email: email.trim(),
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    phoneNumber: phoneNumber.trim(),
  }
}

export const mapperVerifyEmailPayload = (email: string, code: string): AuthVerifyEmailPayload => {
  return {
    email: email.trim(),
    code: code.trim(),
  }
}

export const mapperResendVerificationPayload = (email: string, phoneNumber: string): AuthResendVerificationPayload => {
  return {
    email: email.trim(),
    phoneNumber: phoneNumber.trim(),
  }
}

export const mapperUpdateProfilePayload = (
  email: string,
  firstName: string,
  lastName: string,
  phoneNumber: string,
): AuthUpdateProfilePayload => {
  return {
    email: email.trim(),
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    phoneNumber: phoneNumber.trim(),
  }
}

export const mapperUpdateAvatarFormData = (payload: AuthUpdateAvatarPayload): FormData => {
  const formData = new FormData()
  formData.append('file', payload.file)
  return formData
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
