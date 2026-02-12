const storageKeys = {
  accessToken: 'authToken',
  refreshToken: 'refreshToken',
  pendingVerifyEmail: 'pendingVerifyEmail',
}

export const useAuthSessionStorage = () => {
  const setAuthTokens = (data: { access_token: string; refresh_token: string }) => {
    localStorage.setItem(storageKeys.accessToken, data.access_token)
    localStorage.setItem(storageKeys.refreshToken, data.refresh_token)
  }

  const getAccessToken = () => localStorage.getItem(storageKeys.accessToken)

  const getRefreshToken = () => localStorage.getItem(storageKeys.refreshToken)

  const clearAuthSession = () => {
    localStorage.removeItem(storageKeys.accessToken)
    localStorage.removeItem(storageKeys.refreshToken)
  }

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
    setAuthTokens,
    getAccessToken,
    getRefreshToken,
    clearAuthSession,
    setPendingVerifyEmail,
    getPendingVerifyEmail,
    clearPendingVerifyEmail,
  }
}
