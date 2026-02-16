import type { SettingDeviceSession } from '@/interfaces'
import messages from '@/messages/messages'

export const formatLastSeen = (value?: string): string => {
  if (!value) return messages.settings.sessionNoActivity
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('es-CL')
}

export const findDeviceById = (
  devices: SettingDeviceSession[],
  id: string,
): SettingDeviceSession | undefined => {
  return devices.find((item) => item.id === id)
}

export const removeDeviceById = (
  devices: SettingDeviceSession[],
  id: string,
): SettingDeviceSession[] => {
  return devices.filter((item) => item.id !== id)
}

export const keepCurrentDevices = (
  devices: SettingDeviceSession[],
): SettingDeviceSession[] => {
  return devices.filter((item) => item.current)
}
