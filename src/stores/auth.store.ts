import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import axios from 'axios'
import { axiosInstance } from '@/config'
import { useAuthSessionStorage } from '@/composables'
import type {
  AlertsCore,
  AuthCheckEmailResponse,
  AuthCreatePasswordPayload,
  AuthLoginPayload,
  AuthRegisterPayload,
  AuthVerifyEmailResponse,
  AuthVerifyEmailPayload,
  AuthUser,
  ModulePermission,
} from '@/interfaces'

const initialAlert: AlertsCore = {
  icon: 'fa-solid fa-circle-info',
  variant: 'info',
  message: '',
}

type PermissionType = 'canRead' | 'canCreate' | 'canUpdate' | 'canDelete'

export const useStoreAuth = defineStore('auth', () => {
  const authSessionStorage = useAuthSessionStorage()
  const user = ref<AuthUser | null>(null)
  const permissions = ref<ModulePermission[]>([])
  const menu = ref(null)

  const sidebar = reactive({
    toggleMobile: false,
    toggleCollapse: false,
  })

  const loginSubmitting = ref(false)
  const registerSubmitting = ref(false)
  const verifySubmitting = ref(false)
  const createPasswordSubmitting = ref(false)
  const checkEmailSubmitting = ref(false)
  const loginError = ref(false)
  const messageAlert = ref<AlertsCore>({ ...initialAlert })
  const successMessage = ref<string | null>(null)
  const errorMessage = ref<string | null>(null)
  const errorBack = ref<unknown | null>(null)
  const loadingUser = ref(false)
  let currentUserRequest: Promise<void> | null = null
  const pendingVerifyEmail = ref<string | null>(authSessionStorage.getPendingVerifyEmail())
  const pendingPasswordToken = ref<string | null>(authSessionStorage.getPendingPasswordToken())
  const pendingPasswordTokenIssuedAt = ref<number | null>(authSessionStorage.getPendingPasswordTokenIssuedAt())
  const emailAvailable = ref<boolean | null>(null)

  const getUserConfig = async () => {
    try {
      const response = await fetch('/db/config/config.json')
      if (!response.ok) return
      const data = await response.json()
      menu.value = data.menu ?? null
    } catch (error) {
      errorBack.value = error
    }
  }

  const login = async (credentials: AuthLoginPayload) => {
    try {
      loginSubmitting.value = true
      loginError.value = false
      errorMessage.value = null
      successMessage.value = null

      const payload = {
        email: credentials.email,
        password: credentials.password,
      }

      const { data } = await axiosInstance.post<{ user: AuthUser; modules?: ModulePermission[] }>('/auth/login', payload)
      user.value = data.user
      permissions.value = data.modules || []
      await getUserConfig()
      successMessage.value = 'Inicio de sesion exitoso.'
      return true
    } catch (error) {
      loginError.value = true
      errorBack.value = error
      let message = 'No se pudo iniciar sesion. Intenta nuevamente.'

      if (axios.isAxiosError(error)) {
        const status = error.response?.status
        if (status === 400) message = 'Datos invalidos. Verifica correo y contraseña.'
        if (status === 401) message = 'Credenciales invalidas.'
        if (status === 500 || status === 503) message = 'Servicio no disponible temporalmente.'
      }

      messageAlert.value = {
        icon: 'fa-solid fa-triangle-exclamation',
        variant: 'error',
        message,
      }
      errorMessage.value = message
      return false
    } finally {
      loginSubmitting.value = false
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
      authSessionStorage.setPendingVerifyEmail(payload.email)
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
      authSessionStorage.clearPendingVerifyEmail()
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

  async function getCurrentUser() {
    if (currentUserRequest) return currentUserRequest

    loadingUser.value = true

    currentUserRequest = (async () => {
      try {
        const { data } = await axiosInstance.get<{ user: AuthUser; modules?: ModulePermission[] }>('/auth/me')
        user.value = data.user
        permissions.value = data.modules || []
        await getUserConfig()
      } catch (error) {
        user.value = null
        permissions.value = []
        errorBack.value = error
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
    menu.value = null
    pendingPasswordToken.value = null
    pendingPasswordTokenIssuedAt.value = null
    authSessionStorage.clearPendingPasswordToken()
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
    menu,
    sidebar,
    loginSubmitting,
    registerSubmitting,
    verifySubmitting,
    createPasswordSubmitting,
    checkEmailSubmitting,
    loginError,
    messageAlert,
    successMessage,
    errorMessage,
    errorBack,
    loadingUser,
    pendingVerifyEmail,
    pendingPasswordToken,
    pendingPasswordTokenIssuedAt,
    emailAvailable,
    getUserConfig,
    login,
    register,
    checkEmailAvailability,
    verifyEmail,
    createPassword,
    getCurrentUser,
    reset,
    logout,
    setPendingVerifyEmail,
    setPendingPasswordToken,
    clearPendingPasswordToken,
    handleSidebarCollapse,
    handleSidebarMobile,
    hasPermission,
  }
})
