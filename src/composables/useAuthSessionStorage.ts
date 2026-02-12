const storageKeys = {
  pendingVerifyEmail: 'pendingVerifyEmail',
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

  return {
    setPendingVerifyEmail,
    getPendingVerifyEmail,
    clearPendingVerifyEmail,
  }
}
