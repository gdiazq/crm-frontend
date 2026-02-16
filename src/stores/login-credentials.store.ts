import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useStoreAuth } from './auth.store'
import { mapperLoginCredentialsPayload } from '@/mappers'
import type { AuthLoginCredentialsForm } from '@/interfaces'

const PRE_LOGIN_EMAIL_KEY = 'preLoginEmail'
const PRE_LOGIN_MFA_REQUIRED_KEY = 'preLoginMfaRequired'

export const useStoreLoginCredentials = defineStore('loginCredentials', () => {
  const storeAuth = useStoreAuth()

  // State
  const email = ref('')
  const mfaRequired = ref(false)

  // Getters
  const loginSubmitting = computed(() => storeAuth.loginSubmitting)
  const loginError = computed(() => storeAuth.loginError)
  const messageAlert = computed(() => storeAuth.messageAlert)

  // Actions
  const hydrate = () => {
    email.value = sessionStorage.getItem(PRE_LOGIN_EMAIL_KEY) || ''
    mfaRequired.value = sessionStorage.getItem(PRE_LOGIN_MFA_REQUIRED_KEY) === 'true'
    return email.value.length > 0
  }

  const clearSession = () => {
    sessionStorage.removeItem(PRE_LOGIN_EMAIL_KEY)
    sessionStorage.removeItem(PRE_LOGIN_MFA_REQUIRED_KEY)
  }

  const submitLogin = async (form: AuthLoginCredentialsForm) => {
    const payload = mapperLoginCredentialsPayload(email.value, form)
    const success = await storeAuth.login(payload)

    if (success) {
      clearSession()
      return true
    }

    if (storeAuth.mfaRequired) {
      mfaRequired.value = true
      sessionStorage.setItem(PRE_LOGIN_MFA_REQUIRED_KEY, 'true')
    }
    return false
  }

  return {
    // State
    email,
    mfaRequired,
    // Getters
    loginSubmitting,
    loginError,
    messageAlert,
    // Actions
    hydrate,
    clearSession,
    submitLogin,
  }
})
