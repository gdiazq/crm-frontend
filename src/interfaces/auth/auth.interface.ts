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

export interface AuthCheckEmailResponse {
  available: boolean
}

export interface AuthLoginResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
  user: AuthUser
  modules?: ModulePermission[]
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
