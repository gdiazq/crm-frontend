const storageKeys = {
  pendingVerifyEmail: 'pendingVerifyEmail',
  pendingVerifyPhone: 'pendingVerifyPhone',
  pendingPasswordToken: 'pendingPasswordToken',
  pendingPasswordTokenIssuedAt: 'pendingPasswordTokenIssuedAt',
  pendingRecoveryEmail: 'pendingRecoveryEmail',
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

  const setPendingVerifyPhone = (phone: string) => {
    sessionStorage.setItem(storageKeys.pendingVerifyPhone, phone)
  }

  const getPendingVerifyPhone = () => {
    return sessionStorage.getItem(storageKeys.pendingVerifyPhone)
  }

  const clearPendingVerifyPhone = () => {
    sessionStorage.removeItem(storageKeys.pendingVerifyPhone)
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

  const setPendingRecoveryEmail = (email: string) => {
    sessionStorage.setItem(storageKeys.pendingRecoveryEmail, email)
  }

  const getPendingRecoveryEmail = () => {
    return sessionStorage.getItem(storageKeys.pendingRecoveryEmail)
  }

  const clearPendingRecoveryEmail = () => {
    sessionStorage.removeItem(storageKeys.pendingRecoveryEmail)
  }

  return {
    setPendingVerifyEmail,
    getPendingVerifyEmail,
    clearPendingVerifyEmail,
    setPendingVerifyPhone,
    getPendingVerifyPhone,
    clearPendingVerifyPhone,
    setPendingPasswordToken,
    getPendingPasswordToken,
    getPendingPasswordTokenIssuedAt,
    clearPendingPasswordToken,
    setPendingRecoveryEmail,
    getPendingRecoveryEmail,
    clearPendingRecoveryEmail,
  }
}
