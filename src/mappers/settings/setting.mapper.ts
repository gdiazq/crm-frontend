import type {
  AuthUser,
  SettingDeviceSession,
  SettingMfaSetupData,
  SettingMfaState,
  SettingUpdateProfileForm,
  SettingUpdateAvatarPayload,
  SettingUpdateProfilePayload,
} from '@/interfaces'

export function mapperUpdateProfilePayload(id: number, form: SettingUpdateProfileForm): SettingUpdateProfilePayload {
  return {
    id,
    email: form.email.trim(),
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    phoneNumber: form.phoneNumber.trim(),
  }
}

export function mapperUpdateAvatarFormData(payload: SettingUpdateAvatarPayload): FormData {
  const formData = new FormData()
  formData.append('file', payload.file)
  return formData
}

export function mapperSettingProfileForm(user: AuthUser): SettingUpdateProfileForm {
  return {
    email: user.email || '',
    firstName: user.first_name || '',
    lastName: user.last_name || '',
    phoneNumber: user.phone_number || '',
  }
}

export function mapperMfaStateFromResponse(data: SettingMfaState): SettingMfaState {
  return {
    enabled: data.enabled ?? false,
    verified: data.verified ?? false,
    method: data.method || 'Authenticator App (TOTP)',
    lastVerification: data.lastVerification || 'Sin verificacion reciente',
  }
}

export function mapperMfaSetupDataFromResponse(data: SettingMfaSetupData): SettingMfaSetupData {
  return {
    qrCodeUrl: data.qrCodeUrl || '',
    secret: data.secret || '',
    otpauthUri: data.otpauthUri || '',
  }
}

export function mapperSettingSessionsFromResponse(data: SettingDeviceSession[]): SettingDeviceSession[] {
  return data.filter((item) => item.id)
}
