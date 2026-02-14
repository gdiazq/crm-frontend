const DEVICE_ID_KEY = 'crm-device-id'

const generateDeviceId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `web-${Date.now()}`
}

export const useDeviceId = () => {
  const getDeviceId = () => {
    const saved = localStorage.getItem(DEVICE_ID_KEY)
    if (saved) return saved
    const created = generateDeviceId()
    localStorage.setItem(DEVICE_ID_KEY, created)
    return created
  }

  return {
    getDeviceId,
  }
}
