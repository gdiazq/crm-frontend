import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
  initialSettingsDevices,
  initialSettingsMfaState,
  initialSettingsStatusMessage,
  initialSettingsTab,
  settingsMfaSetupSteps,
  settingsTabs,
} from '@/factories'
import {
  mapperFindSettingDeviceById,
  mapperKeepCurrentSettingDevices,
  mapperRemoveSettingDeviceById,
} from '@/mappers'

export const useStoreSettings = defineStore('settings', () => {
  const mfaState = ref({ ...initialSettingsMfaState })
  const statusMessage = ref(initialSettingsStatusMessage)
  const devices = ref([...initialSettingsDevices])
  const mfaSetupSteps = ref([...settingsMfaSetupSteps])
  const tabs = ref([...settingsTabs])
  const activeTab = ref(initialSettingsTab)

  const activeSessions = computed(() => devices.value.length)
  const otherSessions = computed(() => devices.value.filter((device) => !device.current))
  const mfaStatusLabel = computed(() => (mfaState.value.enabled ? 'Habilitado' : 'Deshabilitado'))
  const mfaStatusClass = computed(() => (
    mfaState.value.enabled
      ? 'text-emerald-600 dark:text-emerald-400'
      : 'text-rose-600 dark:text-rose-400'
  ))

  const enableMfa = () => {
    mfaState.value.enabled = true
    statusMessage.value = 'MFA habilitado (mock). Completa verificacion para estado seguro.'
  }

  const disableMfa = () => {
    mfaState.value.enabled = false
    mfaState.value.verified = false
    mfaState.value.lastVerification = 'Sin verificacion reciente'
    statusMessage.value = 'MFA deshabilitado (mock).'
  }

  const verifyMfa = () => {
    if (!mfaState.value.enabled) {
      statusMessage.value = 'Primero debes habilitar MFA para verificar su estado.'
      return
    }

    mfaState.value.verified = true
    mfaState.value.lastVerification = 'Hace 1 minuto'
    statusMessage.value = 'MFA verificado correctamente (mock).'
  }

  const logoutDevice = (id: string) => {
    const device = mapperFindSettingDeviceById(devices.value, id)
    if (!device) return

    if (device.current) {
      statusMessage.value = 'No puedes desloguear la sesion actual desde este mock.'
      return
    }

    devices.value = mapperRemoveSettingDeviceById(devices.value, id)
    statusMessage.value = `Sesion cerrada para ${device.name} (mock).`
  }

  const logoutAllOtherDevices = () => {
    if (otherSessions.value.length === 0) {
      statusMessage.value = 'No hay otros dispositivos activos.'
      return
    }

    devices.value = mapperKeepCurrentSettingDevices(devices.value)
    statusMessage.value = 'Todas las otras sesiones fueron cerradas (mock).'
  }

  const setStatusMessage = (message: string) => {
    statusMessage.value = message
  }

  const setActiveTab = (tab: typeof activeTab.value) => {
    activeTab.value = tab
  }

  return {
    mfaState,
    statusMessage,
    devices,
    mfaSetupSteps,
    tabs,
    activeTab,
    activeSessions,
    otherSessions,
    mfaStatusLabel,
    mfaStatusClass,
    enableMfa,
    disableMfa,
    verifyMfa,
    logoutDevice,
    logoutAllOtherDevices,
    setStatusMessage,
    setActiveTab,
  }
})
