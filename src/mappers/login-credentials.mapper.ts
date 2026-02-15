import type { AuthLoginCredentialsPayload } from '@/interfaces'

export const mapperLoginCredentialsPayload = (
  email: string,
  password: string,
  totpCode = '',
): AuthLoginCredentialsPayload => {
  const normalizedTotpCode = totpCode.trim()

  return {
    email: email.trim(),
    password,
    ...(normalizedTotpCode ? { totpCode: normalizedTotpCode } : {}),
  }
}
