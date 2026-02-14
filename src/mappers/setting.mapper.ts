import type {
  AuthUser,
  SettingDeviceSession,
  SettingMfaSetupData,
  SettingUpdateProfileForm,
  SettingUpdateAvatarPayload,
  SettingUpdateProfilePayload,
} from '@/interfaces'

export const mapperUpdateProfilePayload = (
  id: number,
  email: string,
  firstName: string,
  lastName: string,
  phoneNumber: string,
): SettingUpdateProfilePayload => {
  return {
    id,
    email: email.trim(),
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    phoneNumber: phoneNumber.trim(),
  }
}

export const mapperUpdateAvatarFormData = (payload: SettingUpdateAvatarPayload): FormData => {
  const formData = new FormData()
  formData.append('file', payload.file)
  return formData
}

export const mapperFindSettingDeviceById = (
  devices: SettingDeviceSession[],
  id: string,
): SettingDeviceSession | undefined => {
  return devices.find((item) => item.id === id)
}

export const mapperRemoveSettingDeviceById = (
  devices: SettingDeviceSession[],
  id: string,
): SettingDeviceSession[] => {
  return devices.filter((item) => item.id !== id)
}

export const mapperKeepCurrentSettingDevices = (
  devices: SettingDeviceSession[],
): SettingDeviceSession[] => {
  return devices.filter((item) => item.current)
}

export const mapperSettingProfileForm = (user: AuthUser): SettingUpdateProfileForm => {
  return {
    email: user.email || '',
    firstName: user.first_name || '',
    lastName: user.last_name || '',
    phoneNumber: user.phone_number || '',
  }
}

const isObjectRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null
}

const getString = (record: Record<string, unknown>, key: string) => {
  const value = record[key]
  return typeof value === 'string' ? value : ''
}

const getBoolean = (record: Record<string, unknown>, key: string) => {
  const value = record[key]
  return typeof value === 'boolean' ? value : false
}

export const mapperMfaStateFromResponse = (input: unknown) => {
  if (!isObjectRecord(input)) {
    return {
      enabled: false,
      verified: false,
      method: 'Authenticator App (TOTP)',
      lastVerification: 'Sin verificacion reciente',
    }
  }

  return {
    enabled: getBoolean(input, 'enabled') || getBoolean(input, 'mfaEnabled'),
    verified: getBoolean(input, 'verified') || getBoolean(input, 'mfaVerified'),
    method: getString(input, 'method') || getString(input, 'type') || 'Authenticator App (TOTP)',
    lastVerification: getString(input, 'lastVerification') || getString(input, 'lastVerifiedAt') || 'Sin verificacion reciente',
  }
}

export const mapperMfaSetupDataFromResponse = (input: unknown): SettingMfaSetupData => {
  if (!isObjectRecord(input)) {
    return {
      qrCodeUrl: '',
      secret: '',
      otpauthUri: '',
    }
  }

  return {
    qrCodeUrl: getString(input, 'qrCodeUrl') || getString(input, 'qrCode') || getString(input, 'qrImage'),
    secret: getString(input, 'secret'),
    otpauthUri: getString(input, 'otpauthUrl') || getString(input, 'otpauthUri') || getString(input, 'otpauthURL'),
  }
}

export const mapperSettingSessionsFromResponse = (input: unknown): SettingDeviceSession[] => {
  if (!Array.isArray(input)) return []

  return input
    .filter((item): item is Record<string, unknown> => isObjectRecord(item))
    .map((item) => {
      const id = getString(item, 'deviceId') || getString(item, 'id')
      const name = getString(item, 'deviceName') || getString(item, 'name') || 'Dispositivo'
      const location = getString(item, 'location') || getString(item, 'ipAddress') || 'Ubicacion no disponible'
      const lastSeen = getString(item, 'lastSeen') || getString(item, 'lastSeenAt') || 'Sin actividad reciente'
      const current = getBoolean(item, 'current') || getBoolean(item, 'isCurrent')
      return { id, name, location, lastSeen, current }
    })
    .filter((item) => item.id.length > 0)
}
