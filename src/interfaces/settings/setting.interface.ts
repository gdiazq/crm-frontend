export interface SettingDeviceSession {
  id: string
  name: string
  location: string
  lastSeen: string
  current: boolean
}

export interface SettingMfaState {
  enabled: boolean
  verified: boolean
  method: string
  lastVerification: string
}

export interface SettingUpdateProfilePayload {
  id: number
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
}

export interface SettingUpdateProfileForm {
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
}

export interface SettingUpdateAvatarPayload {
  file: File
}

export interface SettingUpdateAvatarForm {
  file: File | null
  previewUrl: string
}
