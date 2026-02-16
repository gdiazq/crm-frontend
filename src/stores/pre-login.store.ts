import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { axiosInstance } from '@/config'
import { mapperPreLoginMfaRequired } from '@/mappers'
import messages from '@/messages/messages'
import type { AuthPreLoginResponse } from '@/interfaces'

const PRE_LOGIN_EMAIL_KEY = 'preLoginEmail'
const PRE_LOGIN_MFA_REQUIRED_KEY = 'preLoginMfaRequired'

export const useStorePreLogin = defineStore('preLogin', () => {
  // State
  const preLoginSubmitting = ref(false)
  const loginError = ref(false)
  const mfaRequired = ref(false)

  // Messages
  const errorMessage = ref<string>('')

  // Setters
  const setPreLoginSession = (email: string, requiresMfa: boolean) => {
    sessionStorage.setItem(PRE_LOGIN_EMAIL_KEY, email)
    sessionStorage.setItem(PRE_LOGIN_MFA_REQUIRED_KEY, String(requiresMfa))
  }

  const getPreLoginEmail = () => {
    return sessionStorage.getItem(PRE_LOGIN_EMAIL_KEY) || ''
  }

  const getPreLoginMfaRequired = () => {
    return sessionStorage.getItem(PRE_LOGIN_MFA_REQUIRED_KEY) === 'true'
  }

  const clearPreLoginSession = () => {
    sessionStorage.removeItem(PRE_LOGIN_EMAIL_KEY)
    sessionStorage.removeItem(PRE_LOGIN_MFA_REQUIRED_KEY)
  }

  const resetStatus = () => {
    loginError.value = false
    errorMessage.value = ''
  }

  // Actions
  const preLogin = async (email: string) => {
    try {
      preLoginSubmitting.value = true
      loginError.value = false
      errorMessage.value = ''

      const { data } = await axiosInstance.post<AuthPreLoginResponse>('/auth/pre-login', {
        email: email.trim(),
      })

      mfaRequired.value = mapperPreLoginMfaRequired(data)
      setPreLoginSession(email.trim(), mfaRequired.value)
      return true
    } catch (error) {
      loginError.value = true
      mfaRequired.value = false
      errorMessage.value = messages.auth.preLoginInvalidEmail

      if (axios.isAxiosError(error)) {
        const status = error.response?.status
        if (status === 400) errorMessage.value = messages.auth.preLoginInvalidEmailShort
      }
      return false
    } finally {
      preLoginSubmitting.value = false
    }
  }

  return {
    // State
    preLoginSubmitting,
    loginError,
    mfaRequired,
    // Messages
    errorMessage,
    // Actions
    preLogin,
    // Setters
    getPreLoginEmail,
    getPreLoginMfaRequired,
    clearPreLoginSession,
    resetStatus,
  }
})
