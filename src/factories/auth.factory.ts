import type {
  AuthCreatePasswordForm,
  AuthForgotPasswordForm,
  AuthLoginForm,
  AuthRegisterForm,
  AuthResendVerificationForm,
  AuthUpdateAvatarForm,
  AuthUpdateProfileForm,
  AuthVerifyEmailForm,
  PasswordRequirement,
} from '@/interfaces'

export const initialCreatePasswordForm: AuthCreatePasswordForm = {
  password: '',
  confirmPassword: '',
}

export const initialLoginForm: AuthLoginForm = {
  email: '',
  password: '',
}

export const initialForgotPasswordForm: AuthForgotPasswordForm = {
  email: '',
}

export const initialRegisterForm: AuthRegisterForm = {
  username: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
  email: '',
}

export const initialVerifyEmailForm: AuthVerifyEmailForm = {
  code: '',
}

export const initialResendVerificationForm: AuthResendVerificationForm = {
  phoneNumber: '',
}

export const initialUpdateProfileForm: AuthUpdateProfileForm = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
}

export const initialUpdateAvatarForm: AuthUpdateAvatarForm = {
  file: null,
  previewUrl: '',
}

export const initialPasswordRequirements: PasswordRequirement[] = [
  { key: 'lowercase', label: 'Al menos 1 letra minuscula', valid: false },
  { key: 'uppercase', label: 'Al menos 1 letra mayuscula', valid: false },
  { key: 'number', label: 'Al menos 1 numero', valid: false },
  { key: 'specialChar', label: 'Al menos 1 caracter especial', valid: false },
  { key: 'minLength', label: 'Minimo 10 caracteres', valid: false },
]
