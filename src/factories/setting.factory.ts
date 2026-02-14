import type {
  SettingDeviceSession,
  SettingMfaState,
  SettingUpdateAvatarForm,
  SettingUpdateProfileForm,
  ValidationRule,
} from '@/interfaces'

export const initialUpdateProfileForm: SettingUpdateProfileForm = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
}

export const initialUpdateAvatarForm: SettingUpdateAvatarForm = {
  file: null,
  previewUrl: '',
}

export const initialSettingsMfaState: SettingMfaState = {
  enabled: false,
  verified: false,
  method: 'Authenticator App (TOTP)',
  lastVerification: 'Sin verificacion reciente',
}

export const initialSettingsStatusMessage = 'Configuracion usando datos mock para integrar backend luego.'

export const settingsMfaSetupSteps: string[] = [
  '1. Instala Google Authenticator, Microsoft Authenticator o Authy.',
  '2. Escanea el QR de configuracion de 2FA.',
  '3. Ingresa el codigo de 6 digitos para confirmar setup.',
]

export const initialSettingsDevices: SettingDeviceSession[] = [
  {
    id: 'device-1',
    name: 'MacBook Pro - Chrome',
    location: 'Santiago, CL',
    lastSeen: 'Ahora',
    current: true,
  },
  {
    id: 'device-2',
    name: 'iPhone 15 - Safari',
    location: 'Santiago, CL',
    lastSeen: 'Hace 2 horas',
    current: false,
  },
  {
    id: 'device-3',
    name: 'Windows 11 - Edge',
    location: 'Valparaiso, CL',
    lastSeen: 'Ayer',
    current: false,
  },
]

export const settingsUpdateProfileValidationRules: Record<string, ValidationRule> = {
  firstName: { required: true, minLength: 2 },
  lastName: { required: true, minLength: 2 },
  email: { required: true, email: true },
  phoneNumber: { required: true, pattern: /^\+?[0-9]{8,15}$/ },
}
