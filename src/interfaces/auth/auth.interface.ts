export interface AuthUser {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  roles: string[]
}

export interface AuthLoginPayload {
  email: string
  password: string
}

export interface AuthRegisterPayload {
  username: string
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
}

export interface AuthVerifyEmailPayload {
  email: string
  code: string
}

export interface AuthVerifyEmailResponse {
  message: string
  token: string
}

export interface AuthCreatePasswordPayload {
  token: string
  newPassword: string
}

export interface AuthCreatePasswordForm {
  password: string
  confirmPassword: string
}

export interface PasswordRequirement {
  key: 'lowercase' | 'uppercase' | 'number' | 'specialChar' | 'minLength'
  label: string
  valid: boolean
}

export interface AuthCheckEmailResponse {
  available: boolean
}

export interface AuthResendVerificationPayload {
  email: string
  phoneNumber: string
}

export interface AlertsCore {
  icon: string
  variant: 'success' | 'error' | 'warning' | 'info'
  message: string
}

export interface ModulePermission {
  module: string
  canRead?: boolean
  canCreate?: boolean
  canUpdate?: boolean
  canDelete?: boolean
}
