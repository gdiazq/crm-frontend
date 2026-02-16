import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import axios from 'axios'
import { axiosInstance } from '@/config'
import { useDeviceId } from '@/composables'
import type { SettingDeviceSession, SettingMfaSetupData, SettingMfaState } from '@/interfaces'
import {
  initialSettingsDevices,
  initialSettingsMfaSetupData,
  initialSettingsMfaState,
  initialSettingsStatusMessage,
  initialSettingsTab,
  settingsMfaSetupSteps,
  settingsTabs,
} from '@/factories'
import {
  mapperFindSettingDeviceById,
  mapperKeepCurrentSettingDevices,
  mapperMfaSetupDataFromResponse,
  mapperMfaStateFromResponse,
  mapperRemoveSettingDeviceById,
  mapperSettingSessionsFromResponse,
} from '@/mappers'

const AUTH_BASE_PATH = '/auth'

export const useStoreSettings = defineStore('settings', () => {
  const { getDeviceId } = useDeviceId()
  // Data
  const mfaState = ref({ ...initialSettingsMfaState })
  const mfaSetupData = ref({ ...initialSettingsMfaSetupData })
  const mfaVerificationCode = ref('')
  const mfaStatusEmail = ref('')
  const statusMessage = ref(initialSettingsStatusMessage)
  const devices = ref([...initialSettingsDevices])
  const mfaSetupSteps = ref([...settingsMfaSetupSteps])
  const tabs = ref([...settingsTabs])
  const activeTab = ref(initialSettingsTab)

  // Loading
  const loadingMfaStatus = ref(false)
  const loadingSessions = ref(false)
  const loadingMfaAction = ref(false)
  const loadingLogoutDevice = ref(false)

  // Error
  const errorBack = ref<unknown | null>(null)

  // Getters
  const activeSessions = computed(() => devices.value.length)
  const otherSessions = computed(() => devices.value.filter((device) => !device.current))
  const mfaStatusLabel = computed(() => (mfaState.value.enabled ? 'Habilitado' : 'Deshabilitado'))
  const mfaStatusClass = computed(() => (
    mfaState.value.enabled
      ? 'text-emerald-600 dark:text-emerald-400'
      : 'text-rose-600 dark:text-rose-400'
  ))

  // Actions
  const setStatusMessage = (message: string) => {
    statusMessage.value = message
  }

  const setActiveTab = (tab: typeof activeTab.value) => {
    activeTab.value = tab
  }

  const setMfaVerificationCode = (value: string) => {
    mfaVerificationCode.value = value
  }

  const setMfaStatusEmail = (email: string) => {
    mfaStatusEmail.value = email
  }

  const clearMfaVerificationCode = () => {
    mfaVerificationCode.value = ''
  }

  const getMfaStatus = async (email: string) => {
    if (!email) return
    try {
      loadingMfaStatus.value = true
      errorBack.value = null
      const { data } = await axiosInstance.get<SettingMfaState>(`${AUTH_BASE_PATH}/mfa/status/${encodeURIComponent(email)}`)
      mfaState.value = mapperMfaStateFromResponse(data)
    } catch (error) {
      errorBack.value = error
      setStatusMessage('No se pudo obtener el estado de MFA.')
    } finally {
      loadingMfaStatus.value = false
    }
  }

  const mutationMfaSetup = async (username: string) => {
    if (!username) return false
    try {
      loadingMfaAction.value = true
      errorBack.value = null
      const { data } = await axiosInstance.post<SettingMfaSetupData>(
        `${AUTH_BASE_PATH}/mfa/setup`,
        { username },
        {
          headers: {
            'X-Device-Id': getDeviceId(),
          },
        },
      )
      mfaSetupData.value = mapperMfaSetupDataFromResponse(data)
      if (mfaStatusEmail.value) {
        await getMfaStatus(mfaStatusEmail.value)
      }
      setStatusMessage('Setup MFA iniciado. Escanea el QR y verifica con un codigo de 6 digitos.')
      return true
    } catch (error) {
      errorBack.value = error
      if (axios.isAxiosError(error)) {
        setStatusMessage(error.response?.data?.message || 'No se pudo iniciar el setup MFA.')
      } else {
        setStatusMessage('No se pudo iniciar el setup MFA.')
      }
      return false
    } finally {
      loadingMfaAction.value = false
    }
  }

  const mutationMfaVerify = async (username: string) => {
    if (!username) return false
    if (mfaVerificationCode.value.trim().length !== 6) {
      setStatusMessage('Ingresa un codigo MFA valido de 6 digitos.')
      return false
    }
    try {
      loadingMfaAction.value = true
      errorBack.value = null
      await axiosInstance.post(
        `${AUTH_BASE_PATH}/mfa/verify`,
        {
          username,
          code: mfaVerificationCode.value.trim(),
        },
        {
          headers: {
            'X-Device-Id': getDeviceId(),
          },
        },
      )
      clearMfaVerificationCode()
      if (mfaStatusEmail.value) {
        await getMfaStatus(mfaStatusEmail.value)
      }
      setStatusMessage('MFA verificado correctamente.')
      return true
    } catch (error) {
      errorBack.value = error
      if (axios.isAxiosError(error)) {
        setStatusMessage(error.response?.data?.message || 'No se pudo verificar el codigo MFA.')
      } else {
        setStatusMessage('No se pudo verificar el codigo MFA.')
      }
      return false
    } finally {
      loadingMfaAction.value = false
    }
  }

  const mutationMfaDisable = async (username: string) => {
    if (!username) return false
    try {
      loadingMfaAction.value = true
      errorBack.value = null
      await axiosInstance.post(
        `${AUTH_BASE_PATH}/mfa/disable`,
        { username },
        {
          headers: {
            'X-Device-Id': getDeviceId(),
          },
        },
      )
      if (mfaStatusEmail.value) {
        await getMfaStatus(mfaStatusEmail.value)
      }
      setStatusMessage('MFA deshabilitado correctamente.')
      return true
    } catch (error) {
      errorBack.value = error
      if (axios.isAxiosError(error)) {
        setStatusMessage(error.response?.data?.message || 'No se pudo deshabilitar MFA.')
      } else {
        setStatusMessage('No se pudo deshabilitar MFA.')
      }
      return false
    } finally {
      loadingMfaAction.value = false
    }
  }

  const getSessions = async (username: string) => {
    if (!username) return
    try {
      loadingSessions.value = true
      errorBack.value = null
      const { data } = await axiosInstance.get<SettingDeviceSession[]>(`${AUTH_BASE_PATH}/sessions`, {
        headers: {
          'X-Username': username,
        },
      })
      devices.value = mapperSettingSessionsFromResponse(data)
    } catch (error) {
      errorBack.value = error
      setStatusMessage('No se pudieron obtener las sesiones del usuario.')
    } finally {
      loadingSessions.value = false
    }
  }

  const mutationLogoutDevice = async (username: string, deviceId: string) => {
    if (!username || !deviceId) return false
    try {
      loadingLogoutDevice.value = true
      errorBack.value = null
      await axiosInstance.post(`${AUTH_BASE_PATH}/logout-device`, null, {
        headers: {
          'X-Username': username,
          'X-Device-Id': deviceId,
        },
      })
      devices.value = mapperRemoveSettingDeviceById(devices.value, deviceId)
      setStatusMessage('Dispositivo deslogueado correctamente.')
      return true
    } catch (error) {
      errorBack.value = error
      if (axios.isAxiosError(error)) {
        setStatusMessage(error.response?.data?.message || 'No se pudo desloguear el dispositivo.')
      } else {
        setStatusMessage('No se pudo desloguear el dispositivo.')
      }
      return false
    } finally {
      loadingLogoutDevice.value = false
    }
  }

  const loadMfaAndSessions = async (username: string, email: string) => {
    if (!username || !email) return
    setMfaStatusEmail(email)
    await Promise.all([
      getMfaStatus(email),
      getSessions(username),
    ])
  }

  // Handlers for current view
  const enableMfa = async (username: string) => mutationMfaSetup(username)

  const disableMfa = async (username: string) => mutationMfaDisable(username)

  const verifyMfa = async (username: string) => mutationMfaVerify(username)

  const logoutDevice = async (username: string, id: string) => {
    const device = mapperFindSettingDeviceById(devices.value, id)
    if (!device) return
    if (device.current) {
      setStatusMessage('No puedes desloguear la sesion actual desde este dispositivo.')
      return
    }
    await mutationLogoutDevice(username, id)
  }

  const logoutAllOtherDevices = async (username: string) => {
    if (!username) return
    if (otherSessions.value.length === 0) {
      setStatusMessage('No hay otros dispositivos activos.')
      return
    }
    const ids = mapperKeepCurrentSettingDevices(devices.value).map((item) => item.id)
    const targets = devices.value.filter((item) => !ids.includes(item.id))
    await Promise.all(targets.map((item) => mutationLogoutDevice(username, item.id)))
    setStatusMessage('Todas las otras sesiones fueron cerradas.')
  }

  return {
    mfaState,
    mfaSetupData,
    mfaVerificationCode,
    statusMessage,
    devices,
    mfaSetupSteps,
    tabs,
    activeTab,
    loadingMfaStatus,
    loadingSessions,
    loadingMfaAction,
    loadingLogoutDevice,
    errorBack,
    activeSessions,
    otherSessions,
    mfaStatusLabel,
    mfaStatusClass,
    setStatusMessage,
    setActiveTab,
    setMfaVerificationCode,
    setMfaStatusEmail,
    clearMfaVerificationCode,
    getMfaStatus,
    mutationMfaSetup,
    mutationMfaVerify,
    mutationMfaDisable,
    getSessions,
    mutationLogoutDevice,
    loadMfaAndSessions,
    enableMfa,
    disableMfa,
    verifyMfa,
    logoutDevice,
    logoutAllOtherDevices,
  }
})
