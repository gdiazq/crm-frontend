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

export interface SettingMfaSetupData {
  qrCodeUrl: string
  secret: string
  otpauthUri: string
}

export type SettingTabKey = 'account' | 'mfa'

export interface SettingTabOption {
  key: SettingTabKey
  label: string
}
