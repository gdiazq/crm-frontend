const storageKeys = {
  pendingVerifyEmail: 'pendingVerifyEmail',
  pendingPasswordToken: 'pendingPasswordToken',
  pendingPasswordTokenIssuedAt: 'pendingPasswordTokenIssuedAt',
}

export const useAuthSessionStorage = () => {
  const setPendingVerifyEmail = (email: string) => {
    sessionStorage.setItem(storageKeys.pendingVerifyEmail, email)
  }

  const getPendingVerifyEmail = () => {
    return sessionStorage.getItem(storageKeys.pendingVerifyEmail)
  }

  const clearPendingVerifyEmail = () => {
    sessionStorage.removeItem(storageKeys.pendingVerifyEmail)
  }

  const setPendingPasswordToken = (token: string) => {
    sessionStorage.setItem(storageKeys.pendingPasswordToken, token)
    sessionStorage.setItem(storageKeys.pendingPasswordTokenIssuedAt, String(Date.now()))
  }

  const getPendingPasswordToken = () => {
    return sessionStorage.getItem(storageKeys.pendingPasswordToken)
  }

  const getPendingPasswordTokenIssuedAt = () => {
    const value = sessionStorage.getItem(storageKeys.pendingPasswordTokenIssuedAt)
    if (!value) return null
    const issuedAt = Number.parseInt(value, 10)
    if (!Number.isFinite(issuedAt)) return null
    return issuedAt
  }

  const clearPendingPasswordToken = () => {
    sessionStorage.removeItem(storageKeys.pendingPasswordToken)
    sessionStorage.removeItem(storageKeys.pendingPasswordTokenIssuedAt)
  }

  return {
    setPendingVerifyEmail,
    getPendingVerifyEmail,
    clearPendingVerifyEmail,
    setPendingPasswordToken,
    getPendingPasswordToken,
    getPendingPasswordTokenIssuedAt,
    clearPendingPasswordToken,
  }
}
