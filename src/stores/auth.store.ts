import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import axios from 'axios'
import { axiosInstance } from '@/config'
import type {
  AlertsCore,
  AuthLoginPayload,
  AuthLoginResponse,
  AuthRegisterPayload,
  AuthVerifyEmailPayload,
  AuthUser,
  ModulePermission,
  UserAuthConfig,
} from '@/interfaces'

const ACCESS_TOKEN_KEY = 'authToken'
const REFRESH_TOKEN_KEY = 'refreshToken'
const TOKEN_TYPE_KEY = 'tokenType'
const EXPIRES_IN_KEY = 'expiresIn'
const USER_KEY = 'authUser'
const PERMISSIONS_KEY = 'permissions'
const CONFIG_KEY = 'config'
const MENU_KEY = 'menu'
const PENDING_VERIFY_EMAIL_KEY = 'pendingVerifyEmail'

const initialUserConfig: UserAuthConfig = {
  darkTheme: false,
}

const initialAlert: AlertsCore = {
  icon: 'fa-solid fa-circle-info',
  variant: 'info',
  message: '',
}

type PermissionType = 'canRead' | 'canCreate' | 'canUpdate' | 'canDelete'

const hasStringProp = (value: object, key: string) => {
  return typeof Reflect.get(value, key) === 'string'
}

const isAuthUser = (value: unknown): value is AuthUser => {
  if (typeof value !== 'object' || value === null) return false

  return (
    typeof Reflect.get(value, 'id') === 'number' &&
    hasStringProp(value, 'username') &&
    hasStringProp(value, 'email') &&
    hasStringProp(value, 'first_name') &&
    hasStringProp(value, 'last_name') &&
    Array.isArray(Reflect.get(value, 'roles'))
  )
}

const isModulePermissionArray = (value: unknown): value is ModulePermission[] => {
  if (!Array.isArray(value)) return false

  return value.every((item) => {
    if (typeof item !== 'object' || item === null) return false
    return hasStringProp(item, 'module')
  })
}

export const useStoreAuth = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const permissions = ref<ModulePermission[]>([])
  const config = ref<UserAuthConfig>(
    JSON.parse(localStorage.getItem(CONFIG_KEY) || 'null') || { ...initialUserConfig },
  )
  const menu = ref(JSON.parse(localStorage.getItem(MENU_KEY) || 'null'))
  const isAuthenticated = ref(false)

  const sidebar = reactive({
    toggleMobile: false,
    toggleCollapse: false,
  })

  const loginSubmitting = ref(false)
  const registerSubmitting = ref(false)
  const verifySubmitting = ref(false)
  const loginError = ref(false)
  const messageAlert = ref<AlertsCore>({ ...initialAlert })
  const successMessage = ref<string | null>(null)
  const errorMessage = ref<string | null>(null)
  const errorBack = ref<unknown | null>(null)
  const loadingUser = ref(false)
  const pendingVerifyEmail = ref<string | null>(sessionStorage.getItem(PENDING_VERIFY_EMAIL_KEY))

  const setSession = (data: AuthLoginResponse) => {
    user.value = data.user
    permissions.value = data.modules || []
    isAuthenticated.value = true

    localStorage.setItem(ACCESS_TOKEN_KEY, data.access_token)
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token)
    localStorage.setItem(TOKEN_TYPE_KEY, data.token_type)
    localStorage.setItem(EXPIRES_IN_KEY, String(data.expires_in))
    localStorage.setItem(USER_KEY, JSON.stringify(data.user))
    localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(permissions.value))
  }

  const hydrate = () => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY)
    const savedUser = localStorage.getItem(USER_KEY)
    const savedPermissions = localStorage.getItem(PERMISSIONS_KEY)
    const parsedUser: unknown = savedUser ? JSON.parse(savedUser) : null
    const parsedPermissions: unknown = savedPermissions ? JSON.parse(savedPermissions) : null

    isAuthenticated.value = Boolean(token)
    user.value = isAuthUser(parsedUser) ? parsedUser : null
    permissions.value = isModulePermissionArray(parsedPermissions) ? parsedPermissions : []

    return isAuthenticated.value
  }

  const getUserConfig = async () => {
    try {
      const response = await fetch('/db/config/config.json')
      if (!response.ok) return
      const data = await response.json()
      menu.value = data.menu ?? null
      if (!localStorage.getItem(CONFIG_KEY) && data.config) {
        localStorage.setItem(CONFIG_KEY, JSON.stringify(data.config))
        config.value = data.config
      }
      if (menu.value) {
        localStorage.setItem(MENU_KEY, JSON.stringify(menu.value))
      }
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

      const { data } = await axiosInstance.post<AuthLoginResponse>('/auth/login', payload)

      setSession(data)
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
      sessionStorage.setItem(PENDING_VERIFY_EMAIL_KEY, payload.email)
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

  const verifyEmail = async (payload: AuthVerifyEmailPayload) => {
    try {
      verifySubmitting.value = true
      loginError.value = false
      errorMessage.value = null
      successMessage.value = null

      await axiosInstance.post('/auth/verify-email', payload)
      pendingVerifyEmail.value = null
      sessionStorage.removeItem(PENDING_VERIFY_EMAIL_KEY)
      successMessage.value = 'Correo verificado correctamente. Ya puedes iniciar sesion.'
      return true
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
      return false
    } finally {
      verifySubmitting.value = false
    }
  }

  async function getCurrentUser() {
    loadingUser.value = true

    try {
      const token = localStorage.getItem(ACCESS_TOKEN_KEY)
      if (!token) {
        user.value = null
        isAuthenticated.value = false
        return
      }

      const { data } = await axiosInstance.get<{ user: AuthUser; modules?: ModulePermission[] }>('/auth/me')
      user.value = data.user
      permissions.value = data.modules || []
      isAuthenticated.value = true
      localStorage.setItem(USER_KEY, JSON.stringify(data.user))
      localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(permissions.value))
      await getUserConfig()
    } catch (error) {
      user.value = null
      permissions.value = []
      isAuthenticated.value = false
      errorBack.value = error
    } finally {
      loadingUser.value = false
    }
  }

  const reset = () => {
    user.value = null
    permissions.value = []
    menu.value = null
    isAuthenticated.value = false
  }

  const logout = async () => {
    reset()
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(PERMISSIONS_KEY)
    localStorage.removeItem(MENU_KEY)
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(TOKEN_TYPE_KEY)
    localStorage.removeItem(EXPIRES_IN_KEY)
  }

  const setPendingVerifyEmail = (email: string) => {
    pendingVerifyEmail.value = email
    sessionStorage.setItem(PENDING_VERIFY_EMAIL_KEY, email)
  }

  const handleSidebarCollapse = () => {
    sidebar.toggleCollapse = !sidebar.toggleCollapse
  }

  const handleSidebarMobile = () => {
    sidebar.toggleMobile = !sidebar.toggleMobile
  }

  const darkThemeToggle = () => {
    if (!config.value) return
    config.value.darkTheme = !config.value.darkTheme
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config.value))
  }

  const changeTheme = () => {
    if (!config.value?.darkTheme) {
      document.documentElement.setAttribute('data-eit-theme', 'light')
    } else {
      document.documentElement.setAttribute('data-eit-theme', 'dark')
    }
  }

  const hasPermission = (moduleName: string, permissionType: PermissionType) => {
    const module = permissions.value.find((item) => item.module === moduleName)
    if (!module) return false
    return Boolean(module[permissionType])
  }

  return {
    user,
    permissions,
    config,
    menu,
    sidebar,
    isAuthenticated,
    loginSubmitting,
    registerSubmitting,
    verifySubmitting,
    loginError,
    messageAlert,
    successMessage,
    errorMessage,
    errorBack,
    loadingUser,
    pendingVerifyEmail,
    hydrate,
    getUserConfig,
    login,
    register,
    verifyEmail,
    getCurrentUser,
    reset,
    logout,
    setPendingVerifyEmail,
    handleSidebarCollapse,
    handleSidebarMobile,
    darkThemeToggle,
    changeTheme,
    hasPermission,
  }
})
