import type { IncomingNotificationPayload, NotificationApiItem, NotificationItem, NotificationVariant } from '@/interfaces'

const normalizeVariant = (value: unknown): NotificationVariant => {
  const normalized = typeof value === 'string' ? value.toLowerCase() : 'info'
  if (normalized === 'success' || normalized === 'warning' || normalized === 'error') return normalized
  return 'info'
}

export const mapperNotification = (item: NotificationApiItem): NotificationItem => {
  return {
    id: String(item.id),
    title: item.title || 'Nueva notificacion',
    message: item.message || '',
    createdAt: item.createdAt,
    read: Boolean(item.read),
    inbox: !item.archived,
    variant: normalizeVariant(item.type),
  }
}

export const mapperNotificationFromPayload = (
  payload: IncomingNotificationPayload,
  fallbackMessage: string,
): NotificationItem => {
  const timestamp = new Date().toISOString()
  const id = payload.id ? String(payload.id) : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

  return {
    id,
    title: payload.title || 'Nueva notificacion',
    message: payload.message || fallbackMessage,
    createdAt: payload.createdAt || timestamp,
    read: Boolean(payload.read),
    inbox: true,
    variant: normalizeVariant(payload.variant || payload.type),
  }
}

export const mapperMarkAsRead = (item: NotificationItem): NotificationItem => {
  return { ...item, read: true }
}

export const mapperMarkAsNotRead = (item: NotificationItem): NotificationItem => {
  return { ...item, read: false, inbox: true }
}

export const mapperArchiveNotification = (item: NotificationItem): NotificationItem => {
  return { ...item, read: true, inbox: false }
}

export const mapperNotificationIdsFromInbox = (items: NotificationItem[]): string[] => {
  return items.filter((item) => item.inbox).map((item) => item.id)
}

export const mapperNotificationIds = (items: NotificationItem[]): string[] => {
  return items.map((item) => item.id)
}

export const mapperNotificationIdsToNumbers = (ids: string[]): number[] => {
  return ids
    .map((id) => Number.parseInt(id, 10))
    .filter((id) => Number.isInteger(id) && id > 0)
}

export const mapperNotificationIdToNumber = (id: string): number | null => {
  const numericId = Number.parseInt(id, 10)
  if (!Number.isInteger(numericId) || numericId <= 0) return null
  return numericId
}

export const mapperNotificationsById = (
  items: NotificationItem[],
  id: string,
  mapper: (item: NotificationItem) => NotificationItem,
): NotificationItem[] => {
  return items.map((item) => {
    if (item.id !== id) return item
    return mapper(item)
  })
}

export const mapperNotificationsByIds = (
  items: NotificationItem[],
  ids: string[],
  mapper: (item: NotificationItem) => NotificationItem,
): NotificationItem[] => {
  return items.map((item) => {
    if (!ids.includes(item.id)) return item
    return mapper(item)
  })
}
