import type {
  AuthUser,
  SettingDeviceSession,
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
