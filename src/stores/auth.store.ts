import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import axios from 'axios'
import { axiosInstance } from '@/config'
import { useAuthSessionStorage, useDeviceId } from '@/composables'
import { initialAlert } from '@/factories'
import { mapperUpdateAvatarFormData } from '@/mappers'
import type {
  AlertsCore,
  AuthCheckEmailResponse,
  AuthCreatePasswordPayload,
  AuthForgotPasswordPayload,
  AuthLoginErrorResponse,
  AuthPreLoginResponse,
  AuthLoginPayload,
  AuthResendVerificationPayload,
  AuthRegisterPayload,
  AuthVerifyEmailResponse,
  AuthVerifyEmailPayload,
  AuthUser,
  ModulePermission,
  SettingUpdateAvatarPayload,
  SettingUpdateProfilePayload,
} from '@/interfaces'

type PermissionType = 'canRead' | 'canCreate' | 'canUpdate' | 'canDelete'

export const useStoreAuth = defineStore('auth', () => {
  const authSessionStorage = useAuthSessionStorage()
  const { getDeviceId } = useDeviceId()
  const user = ref<AuthUser | null>(null)
  const permissions = ref<ModulePermission[]>([])

  const sidebar = reactive({
    toggleMobile: false,
    toggleCollapse: false,
  })

  const loginSubmitting = ref(false)
  const registerSubmitting = ref(false)
  const preLoginSubmitting = ref(false)
  const forgotPasswordSubmitting = ref(false)
  const verifySubmitting = ref(false)
  const createPasswordSubmitting = ref(false)
  const resendSubmitting = ref(false)
  const checkEmailSubmitting = ref(false)
  const updateProfileSubmitting = ref(false)
  const updateAvatarSubmitting = ref(false)
  const loginError = ref(false)
  const mfaRequired = ref(false)
  const messageAlert = ref<AlertsCore>({ ...initialAlert })
  const successMessage = ref<string | null>(null)
  const errorMessage = ref<string | null>(null)
  const errorBack = ref<unknown | null>(null)
  const loadingUser = ref(false)
  let currentUserRequest: Promise<void> | null = null
  const pendingVerifyEmail = ref<string | null>(authSessionStorage.getPendingVerifyEmail())
  const pendingVerifyPhone = ref<string | null>(authSessionStorage.getPendingVerifyPhone())
  const pendingRecoveryEmail = ref<string | null>(authSessionStorage.getPendingRecoveryEmail())
  const pendingPasswordToken = ref<string | null>(authSessionStorage.getPendingPasswordToken())
  const pendingPasswordTokenIssuedAt = ref<number | null>(authSessionStorage.getPendingPasswordTokenIssuedAt())
  const emailAvailable = ref<boolean | null>(null)

  const login = async (credentials: AuthLoginPayload) => {
    try {
      loginSubmitting.value = true
      loginError.value = false
      errorMessage.value = null
      successMessage.value = null

      const payload = {
        email: credentials.email,
        password: credentials.password,
        ...(credentials.totpCode ? { totpCode: credentials.totpCode } : {}),
      }

      const { data } = await axiosInstance.post<{ user: AuthUser; modules?: ModulePermission[] }>('/auth/login', payload, {
        headers: {
          'X-Device-Id': getDeviceId(),
        },
      })
      user.value = data.user
      permissions.value = data.modules || []
      mfaRequired.value = false

      try {
        const { data: fullProfile } = await axiosInstance.get<AuthUser>('/auth/me')
        user.value = fullProfile
      } catch {
        // Login data is sufficient to proceed
      }

      successMessage.value = 'Inicio de sesion exitoso.'
      return true
    } catch (error) {
      loginError.value = true
      errorBack.value = error
      let message = 'No se pudo iniciar sesion. Intenta nuevamente.'
      let alertVariant: AlertsCore['variant'] = 'error'
      let alertIcon = 'fa-solid fa-triangle-exclamation'

      if (axios.isAxiosError(error)) {
        const status = error.response?.status
        const responseData = (error.response?.data || {}) as AuthLoginErrorResponse
        const backendMessage = responseData.message
        const isMfaRequiredResponse =
          responseData.mfaRequired === true ||
          responseData.mfa_required === true ||
          responseData.error === 'MFA Required' ||
          backendMessage === 'MFA code required'

        if (status === 403 && isMfaRequiredResponse) {
          mfaRequired.value = true
          loginError.value = false
          alertVariant = 'info'
          alertIcon = 'fa-solid fa-shield-halved'
          message = 'Ingresa tu codigo MFA de 6 digitos para continuar.'
        }

        if (status === 400) message = 'Datos invalidos. Verifica correo y contraseña.'
        if (status === 401) {
          if (mfaRequired.value && credentials.totpCode) message = 'Codigo MFA invalido.'
          else {
            mfaRequired.value = false
            message = 'Credenciales invalidas.'
          }
        }
        if (status === 500 || status === 503) message = 'Servicio no disponible temporalmente.'
        if (
          typeof backendMessage === 'string' &&
          backendMessage.length > 0 &&
          !(status === 403 && isMfaRequiredResponse)
        ) {
          message = backendMessage
        }
      }

      messageAlert.value = {
        icon: alertIcon,
        variant: alertVariant,
        message,
      }
      errorMessage.value = message
      return false
    } finally {
      loginSubmitting.value = false
    }
  }

  const preLogin = async (email: string) => {
    try {
      preLoginSubmitting.value = true
      loginError.value = false
      errorMessage.value = null
      successMessage.value = null

      const { data } = await axiosInstance.post<AuthPreLoginResponse>('/auth/pre-login', {
        email: email.trim(),
      })

      mfaRequired.value = data.mfaRequired === true || data.mfa_required === true
      messageAlert.value = {
        icon: mfaRequired.value ? 'fa-solid fa-shield-halved' : 'fa-solid fa-circle-info',
        variant: 'info',
        message: mfaRequired.value
          ? 'Tu cuenta tiene MFA activo. Ingresa contraseña y codigo.'
          : 'Ingresa tu contraseña para continuar.',
      }
      return true
    } catch (error) {
      errorBack.value = error
      mfaRequired.value = false
      let message = 'Correo invalido o no registrado.'

      if (axios.isAxiosError(error)) {
        const status = error.response?.status
        if (status === 401 || status === 404) message = 'Correo invalido o no registrado.'
        if (status === 400) message = 'Correo invalido.'
      }

      loginError.value = true
      messageAlert.value = {
        icon: 'fa-solid fa-triangle-exclamation',
        variant: 'error',
        message,
      }
      errorMessage.value = message
      return false
    } finally {
      preLoginSubmitting.value = false
    }
  }

  const register = async (payload: AuthRegisterPayload) => {
    try {
      registerSubmitting.value = true
      loginError.value = false
      errorMessage.value = null
      successMessage.value = null

      const data_ = {
        username: payload.username,
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        phoneNumber: payload.phoneNumber,
      }

      await axiosInstance.post('/auth/register', data_)
      pendingVerifyEmail.value = payload.email
      pendingVerifyPhone.value = payload.phoneNumber
      authSessionStorage.setPendingVerifyEmail(payload.email)
      authSessionStorage.setPendingVerifyPhone(payload.phoneNumber)
      successMessage.value = 'Registro exitoso. Revisa tu correo para verificar tu cuenta.'
      return true
    } catch (error) {
      errorBack.value = error
      let message = 'No se pudo completar el registro.'

      if (axios.isAxiosError(error)) {
        const status = error.response?.status
        if (status === 409) message = 'El correo ya esta registrado.'
        if (status === 400) message = 'Datos de registro invalidos.'
      }

      messageAlert.value = {
        icon: 'fa-solid fa-triangle-exclamation',
        variant: 'error',
        message,
      }
      errorMessage.value = message
      return false
    } finally {
      registerSubmitting.value = false
    }
  }

  const checkEmailAvailability = async (email: string) => {
    try {
      checkEmailSubmitting.value = true
      emailAvailable.value = null

      const { data } = await axiosInstance.get<AuthCheckEmailResponse>('/auth/check-email', {
        params: { email },
      })

      emailAvailable.value = data.available
      return data.available
    } catch (error) {
      errorBack.value = error
      emailAvailable.value = null
      return null
    } finally {
      checkEmailSubmitting.value = false
    }
  }

  const verifyEmail = async (payload: AuthVerifyEmailPayload) => {
    try {
      verifySubmitting.value = true
      loginError.value = false
      errorMessage.value = null
      successMessage.value = null

      const { data } = await axiosInstance.post<AuthVerifyEmailResponse>('/auth/verify-email', payload)
      pendingPasswordToken.value = data.token
      authSessionStorage.setPendingPasswordToken(data.token)
      pendingPasswordTokenIssuedAt.value = authSessionStorage.getPendingPasswordTokenIssuedAt()
      pendingVerifyEmail.value = null
      pendingVerifyPhone.value = null
      authSessionStorage.clearPendingVerifyEmail()
      authSessionStorage.clearPendingVerifyPhone()
      successMessage.value = 'Correo verificado correctamente.'
      return data.token
    } catch (error) {
      errorBack.value = error
      let message = 'No se pudo verificar el correo.'

      if (axios.isAxiosError(error)) {
        const status = error.response?.status
        if (status === 400) message = 'Codigo invalido o expirado.'
        if (status === 404) message = 'No se encontro una cuenta para ese correo.'
      }

      messageAlert.value = {
        icon: 'fa-solid fa-triangle-exclamation',
        variant: 'error',
        message,
      }
      errorMessage.value = message
      return null
    } finally {
      verifySubmitting.value = false
    }
  }

  const forgotPassword = async (payload: AuthForgotPasswordPayload) => {
    try {
      forgotPasswordSubmitting.value = true
      loginError.value = false
      errorMessage.value = null
      successMessage.value = null

      await axiosInstance.post('/auth/forgot-password', payload)
      pendingRecoveryEmail.value = payload.email
      authSessionStorage.setPendingRecoveryEmail(payload.email)
      successMessage.value = 'Te enviamos un codigo de recuperacion al correo.'
      return true
    } catch (error) {
      errorBack.value = error
      let message = 'No se pudo iniciar la recuperacion de contraseña.'

      if (axios.isAxiosError(error)) {
        const status = error.response?.status
        if (status === 400) message = 'Correo invalido.'
        if (status === 404) message = 'No existe una cuenta con ese correo.'
      }

      messageAlert.value = {
        icon: 'fa-solid fa-triangle-exclamation',
        variant: 'error',
        message,
      }
      errorMessage.value = message
      return false
    } finally {
      forgotPasswordSubmitting.value = false
    }
  }

  const resendVerification = async (payload: AuthResendVerificationPayload) => {
    try {
      resendSubmitting.value = true
      errorMessage.value = null
      successMessage.value = null

      await axiosInstance.post('/auth/resend-verification', payload)
      successMessage.value = 'Codigo reenviado correctamente. Revisa tu correo.'
      return true
    } catch (error) {
      errorBack.value = error
      let message = 'No se pudo reenviar el codigo.'

      if (axios.isAxiosError(error)) {
        const status = error.response?.status
        if (status === 400) message = 'Correo invalido para reenviar el codigo.'
        if (status === 404) message = 'No se encontro una cuenta para ese correo.'
      }

      errorMessage.value = message
      return false
    } finally {
      resendSubmitting.value = false
    }
  }

  const createPassword = async (payload: AuthCreatePasswordPayload) => {
    try {
      createPasswordSubmitting.value = true
      loginError.value = false
      errorMessage.value = null
      successMessage.value = null

      await axiosInstance.post('/auth/create-password', payload)
      pendingPasswordToken.value = null
      pendingPasswordTokenIssuedAt.value = null
      authSessionStorage.clearPendingPasswordToken()
      successMessage.value = 'Contraseña creada correctamente. Ya puedes iniciar sesion.'
      return true
    } catch (error) {
      errorBack.value = error
      let message = 'No se pudo crear la contraseña.'

      if (axios.isAxiosError(error)) {
        const status = error.response?.status
        if (status === 400) {
          message = 'La contraseña no cumple los requisitos o el token es invalido.'
        }
        if (status === 404) message = 'No se encontro el proceso de creacion de contraseña.'
      }

      messageAlert.value = {
        icon: 'fa-solid fa-triangle-exclamation',
        variant: 'error',
        message,
      }
      errorMessage.value = message
      return false
    } finally {
      createPasswordSubmitting.value = false
    }
  }

  const updateProfile = async (payload: SettingUpdateProfilePayload) => {
    try {
      updateProfileSubmitting.value = true
      errorMessage.value = null

      await axiosInstance.put('/user/update', payload)

      if (user.value) {
        user.value = {
          ...user.value,
          email: payload.email,
          first_name: payload.firstName,
          last_name: payload.lastName,
          phone_number: payload.phoneNumber,
        }
      }

      successMessage.value = 'Informacion de cuenta actualizada correctamente.'
      return true
    } catch (error) {
      errorBack.value = error
      let message = 'No se pudo actualizar la informacion de cuenta.'

      if (axios.isAxiosError(error)) {
        const status = error.response?.status
        if (status === 400) message = 'Datos invalidos para actualizar el perfil.'
        if (status === 404) message = 'No se encontro el usuario a actualizar.'
      }

      errorMessage.value = message
      return false
    } finally {
      updateProfileSubmitting.value = false
    }
  }

  const updateAvatar = async (userId: number, payload: SettingUpdateAvatarPayload) => {
    try {
      updateAvatarSubmitting.value = true
      errorMessage.value = null

      const formData = mapperUpdateAvatarFormData(payload)
      await axiosInstance.post(`/user/${userId}/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      await getCurrentUser()

      successMessage.value = 'Avatar actualizado correctamente.'
      return true
    } catch (error) {
      errorBack.value = error
      let message = 'No se pudo actualizar el avatar.'

      if (axios.isAxiosError(error)) {
        const status = error.response?.status
        if (status === 400) message = 'El archivo de avatar es invalido.'
        if (status === 404) message = 'No se encontro el usuario para actualizar avatar.'
      }

      errorMessage.value = message
      return false
    } finally {
      updateAvatarSubmitting.value = false
    }
  }

  async function getCurrentUser() {
    if (currentUserRequest) return currentUserRequest

    loadingUser.value = true

    currentUserRequest = (async () => {
      try {
        const { data } = await axiosInstance.get<AuthUser>('/auth/me')
        user.value = data
      } catch (error) {
        errorBack.value = error
        if (axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
          user.value = null
          permissions.value = []
        }
        throw error
      } finally {
        loadingUser.value = false
        currentUserRequest = null
      }
    })()

    return currentUserRequest
  }

  const reset = () => {
    user.value = null
    permissions.value = []
    mfaRequired.value = false
    pendingPasswordToken.value = null
    pendingPasswordTokenIssuedAt.value = null
    authSessionStorage.clearPendingPasswordToken()
    pendingRecoveryEmail.value = null
    authSessionStorage.clearPendingRecoveryEmail()
  }

  const logout = async () => {
    try {
      await axiosInstance.post('/auth/logout')
    } catch (error) {
      errorBack.value = error
    }
    reset()
  }

  const setPendingVerifyEmail = (email: string) => {
    pendingVerifyEmail.value = email
    authSessionStorage.setPendingVerifyEmail(email)
  }

  const setPendingVerifyPhone = (phone: string) => {
    pendingVerifyPhone.value = phone
    authSessionStorage.setPendingVerifyPhone(phone)
  }

  const setPendingRecoveryEmail = (email: string) => {
    pendingRecoveryEmail.value = email
    authSessionStorage.setPendingRecoveryEmail(email)
  }

  const setPendingPasswordToken = (token: string) => {
    pendingPasswordToken.value = token
    authSessionStorage.setPendingPasswordToken(token)
    pendingPasswordTokenIssuedAt.value = authSessionStorage.getPendingPasswordTokenIssuedAt()
  }

  const clearPendingPasswordToken = () => {
    pendingPasswordToken.value = null
    pendingPasswordTokenIssuedAt.value = null
    authSessionStorage.clearPendingPasswordToken()
  }

  const clearMfaRequired = () => {
    mfaRequired.value = false
  }

  const handleSidebarCollapse = () => {
    sidebar.toggleCollapse = !sidebar.toggleCollapse
  }

  const handleSidebarMobile = () => {
    sidebar.toggleMobile = !sidebar.toggleMobile
  }

  const hasPermission = (moduleName: string, permissionType: PermissionType) => {
    const module = permissions.value.find((item) => item.module === moduleName)
    if (!module) return false
    return Boolean(module[permissionType])
  }

  return {
    user,
    permissions,
    sidebar,
    loginSubmitting,
    preLoginSubmitting,
    registerSubmitting,
    forgotPasswordSubmitting,
    verifySubmitting,
    createPasswordSubmitting,
    resendSubmitting,
    checkEmailSubmitting,
    updateProfileSubmitting,
    updateAvatarSubmitting,
    loginError,
    mfaRequired,
    messageAlert,
    successMessage,
    errorMessage,
    errorBack,
    loadingUser,
    pendingVerifyEmail,
    pendingVerifyPhone,
    pendingRecoveryEmail,
    pendingPasswordToken,
    pendingPasswordTokenIssuedAt,
    emailAvailable,
    login,
    preLogin,
    register,
    forgotPassword,
    checkEmailAvailability,
    verifyEmail,
    resendVerification,
    createPassword,
    updateProfile,
    updateAvatar,
    getCurrentUser,
    reset,
    logout,
    setPendingVerifyEmail,
    setPendingVerifyPhone,
    setPendingRecoveryEmail,
    setPendingPasswordToken,
    clearPendingPasswordToken,
    clearMfaRequired,
    handleSidebarCollapse,
    handleSidebarMobile,
    hasPermission,
  }
})
