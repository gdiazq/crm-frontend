import type { AuthPreLoginPayload, AuthPreLoginResponse } from '@/interfaces'

export const mapperPreLoginPayload = (email: string): AuthPreLoginPayload => {
  return { email: email.trim() }
}

export const mapperPreLoginMfaRequired = (response: AuthPreLoginResponse): boolean => {
  return response.mfaRequired === true || response.mfa_required === true
}
