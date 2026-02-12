import { defineStore } from 'pinia'
import { Client } from '@stomp/stompjs'
import axios from 'axios'
import { axiosInstance } from '@/config'
import { useAuthSessionStorage } from '@/composables'
import {
  initialCounterNotification,
  initialErrorMessageNotification,
  initialLoadingNotification,
  initialNotifications,
  initialStatusNotification,
  initialTabNotification,
} from '@/factories'
import {
  mapperArchiveNotification,
  mapperMarkAsNotRead,
  mapperMarkAsRead,
  mapperNotificationIdToNumber,
  mapperNotificationIds,
  mapperNotificationIdsToNumbers,
  mapperNotificationIdsFromInbox,
  mapperNotificationsById,
  mapperNotificationsByIds,
  mapperNotification,
  mapperNotificationFromPayload,
} from '@/mappers'
import type {
  IncomingNotificationPayload,
  NotificationItem,
  NotificationCountResponse,
  NotificationPagedResponse,
} from '@/interfaces'

const NOTIFICATION_BASE_PATH = '/notification'
const MAX_NOTIFICATIONS = 50

let activeStompClient: Client | null = null
const authSessionStorage = useAuthSessionStorage()

const isObjectRecord = (value: unknown) => {
  return typeof value === 'object' && value !== null
}

const getStringValue = (value: object, key: string) => {
  const property = Reflect.get(value, key)
  return typeof property === 'string' ? property : undefined
}

const getBooleanValue = (value: object, key: string) => {
  const property = Reflect.get(value, key)
  return typeof property === 'boolean' ? property : undefined
}

const getStringOrNumberValue = (value: object, key: string) => {
  const property = Reflect.get(value, key)
  if (typeof property === 'string' || typeof property === 'number') return property
  return undefined
}

const parseNotificationPayload = (raw: string): IncomingNotificationPayload | null => {
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!isObjectRecord(parsed)) return null

    const nested = Reflect.get(parsed, 'notification')
    if (isObjectRecord(nested)) {
      return {
        id: getStringOrNumberValue(nested, 'id'),
        title: getStringValue(nested, 'title'),
        message: getStringValue(nested, 'message'),
        createdAt: getStringValue(nested, 'createdAt'),
        read: getBooleanValue(nested, 'read'),
        variant: getStringValue(nested, 'variant'),
        type: getStringValue(nested, 'type'),
      }
    }

    return {
      id: getStringOrNumberValue(parsed, 'id'),
      title: getStringValue(parsed, 'title'),
      message: getStringValue(parsed, 'message'),
      createdAt: getStringValue(parsed, 'createdAt'),
      read: getBooleanValue(parsed, 'read'),
      variant: getStringValue(parsed, 'variant'),
      type: getStringValue(parsed, 'type'),
    }
  } catch {
    return null
  }
}

const resolveWsUrl = () => {
  const configuredUrl = import.meta.env.VITE_NOTIFICATIONS_WS_URL
  if (typeof configuredUrl === 'string') return configuredUrl.trim()
  return ''
}

const buildConnectHeaders = (token: string | null): Record<string, string> => {
  const headers: Record<string, string> = {}
  if (token) headers.Authorization = `Bearer ${token}`
  return headers
}

const notificationTabFilters: Record<number, (item: NotificationItem) => boolean> = {
  1: (item) => item.inbox,
  2: (item) => !item.read && item.inbox,
  3: (item) => !item.inbox,
}

const isValidUserId = (userId: number) => Number.isInteger(userId) && userId > 0

export const useStoreNotification = defineStore('notification', {
  state: () => ({
    counter: { ...initialCounterNotification },
    notifications: [...initialNotifications],
    tab: initialTabNotification,
    status: initialStatusNotification,
    errorMessage: initialErrorMessageNotification,
    loadingNotifications: initialLoadingNotification,
  }),
  getters: {
    unreadCount: (state) => state.counter.totalUnread,
    hasNotifications: (state) => state.notifications.length > 0,
    filterNotifications: (state) => {
      const filterPredicate = notificationTabFilters[state.tab]
      if (typeof filterPredicate === 'function') return state.notifications.filter(filterPredicate)
      return state.notifications
    },
  },
  actions: {
    captureTab(tab: number) {
      this.tab = tab
    },

    pushNotification(item: NotificationItem) {
      this.notifications = [item, ...this.notifications].slice(0, MAX_NOTIFICATIONS)
    },

    async getNotifications(userId: number, type: '' | 'unread' | 'archived' = '', page = 0, size = 20) {
      try {
        this.loadingNotifications = true
        this.errorMessage = null

        const { data } = await axiosInstance.get<NotificationPagedResponse>(`${NOTIFICATION_BASE_PATH}/paged`, {
          params: { userId, type, page, size },
        })

        this.notifications = data.content.map(mapperNotification)
      } catch {
        this.errorMessage = 'No se pudieron cargar las notificaciones.'
      } finally {
        this.loadingNotifications = false
      }
    },

    async getCounter(userId: number) {
      try {
        const { data } = await axiosInstance.get<NotificationCountResponse>(`${NOTIFICATION_BASE_PATH}/count`, {
          params: { userId },
        })
        this.counter = data
      } catch {
        this.errorMessage = 'No se pudo obtener el contador de notificaciones.'
      }
    },

    async mutationMarkAllAsRead(userId: number) {
      if (!isValidUserId(userId)) {
        this.errorMessage = 'Usuario invalido para marcar notificaciones.'
        return
      }

      try {
        await axiosInstance.patch(`${NOTIFICATION_BASE_PATH}/read-all`, null, {
          params: { userId },
        })
        this.notifications = mapperNotificationsByIds(
          this.notifications,
          mapperNotificationIds(this.notifications),
          mapperMarkAsRead,
        )
        await this.getCounter(userId)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          this.errorMessage = error.response?.data?.message || 'No se pudieron marcar todas como leidas.'
          return
        }
        this.errorMessage = 'No se pudieron marcar todas como leidas.'
      }
    },

    async mutationArchiveAll(userId: number) {
      if (!isValidUserId(userId)) {
        this.errorMessage = 'Usuario invalido para archivar notificaciones.'
        return
      }

      const ids = mapperNotificationIdsFromInbox(this.notifications)
      if (ids.length === 0) return

      const numericIds = mapperNotificationIdsToNumbers(ids)
      if (numericIds.length === 0) {
        this.errorMessage = 'No se pudo convertir los ids para archivar.'
        return
      }

      try {
        await axiosInstance.patch(`${NOTIFICATION_BASE_PATH}/archive`, {
          ids: numericIds,
          userId,
        })
        this.notifications = mapperNotificationsByIds(this.notifications, ids, mapperArchiveNotification)
        await this.getCounter(userId)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          this.errorMessage = error.response?.data?.message || 'No se pudieron archivar las notificaciones.'
          return
        }
        this.errorMessage = 'No se pudieron archivar las notificaciones.'
      }
    },

    async mutationArchiveNotification(payload: NotificationItem, userId: number) {
      if (!isValidUserId(userId)) {
        this.errorMessage = 'Usuario invalido para archivar notificaciones.'
        return
      }

      const numericId = mapperNotificationIdToNumber(payload.id)
      if (numericId === null) {
        this.errorMessage = 'Id de notificacion invalido para archivar.'
        return
      }

      try {
        await axiosInstance.patch(`${NOTIFICATION_BASE_PATH}/archive`, {
          ids: [numericId],
          userId,
        })
        this.notifications = mapperNotificationsById(this.notifications, payload.id, mapperArchiveNotification)
        await this.getCounter(userId)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          this.errorMessage = error.response?.data?.message || 'No se pudo archivar la notificacion.'
          return
        }
        this.errorMessage = 'No se pudo archivar la notificacion.'
      }
    },

    async mutationMarkAsRead(payload: NotificationItem, userId: number) {
      if (!isValidUserId(userId)) {
        this.errorMessage = 'Usuario invalido para marcar como leida.'
        return
      }

      const numericId = mapperNotificationIdToNumber(payload.id)
      if (numericId === null) {
        this.errorMessage = 'Id de notificacion invalido para marcar como leida.'
        return
      }

      try {
        await axiosInstance.patch(`${NOTIFICATION_BASE_PATH}/read`, {
          ids: [numericId],
          userId,
        })
        this.notifications = mapperNotificationsById(this.notifications, payload.id, mapperMarkAsRead)
        await this.getCounter(userId)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          this.errorMessage = error.response?.data?.message || 'No se pudo marcar la notificacion como leida.'
          return
        }
        this.errorMessage = 'No se pudo marcar la notificacion como leida.'
      }
    },

    mutationMarkAsNotRead(payload: NotificationItem) {
      this.notifications = mapperNotificationsById(this.notifications, payload.id, mapperMarkAsNotRead)
    },

    clearNotifications() {
      this.notifications = []
    },

    disconnect() {
      if (!activeStompClient) return

      activeStompClient.deactivate()
      activeStompClient = null
      if (this.status !== 'idle') this.status = 'disconnected'
    },

    connect(userId: number) {
      if (!userId) return
      if (activeStompClient?.active) return

      const wsUrl = resolveWsUrl()
      if (!wsUrl) {
        this.status = 'error'
        this.errorMessage = 'Falta configurar VITE_NOTIFICATIONS_WS_URL para notificaciones.'
        return
      }

      this.status = 'connecting'
      this.errorMessage = null

      const token = authSessionStorage.getAccessToken()
      const connectHeaders = buildConnectHeaders(token)

      const client = new Client({
        brokerURL: wsUrl,
        connectHeaders,
        reconnectDelay: 5000,
        onConnect: () => {
          this.status = 'connected'
          client.subscribe(`/topic/notifications/${userId}`, async (message) => {
            const payload = parseNotificationPayload(message.body)
            const notification = payload
              ? mapperNotificationFromPayload(payload, 'Tienes una nueva notificacion.')
              : mapperNotificationFromPayload({}, String(message.body || 'Tienes una nueva notificacion.'))
            this.pushNotification(notification)
            await this.getCounter(userId)
          })
        },
        onWebSocketError: () => {
          this.status = 'error'
          this.errorMessage = 'Error en la conexion de notificaciones.'
        },
        onStompError: () => {
          this.status = 'error'
          this.errorMessage = 'Error en el broker STOMP de notificaciones.'
        },
        onDisconnect: () => {
          if (this.status !== 'error') this.status = 'disconnected'
        },
      })

      activeStompClient = client
      client.activate()
    },
  },
})
