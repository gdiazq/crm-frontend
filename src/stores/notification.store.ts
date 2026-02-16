import { defineStore } from 'pinia'
import { Client } from '@stomp/stompjs'
import axios from 'axios'
import { axiosInstance } from '@/config'
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
  mapperNotification,
  mapperNotificationFromPayload,
} from '@/mappers'
import {
  findNotificationById,
  updateNotificationsByIds,
  getInboxNotificationIds,
  getNotificationIds,
  convertIdsToNumbers,
  convertIdToNumber,
} from '@/utils'
import messages from '@/messages/messages'
import type {
  IncomingNotificationPayload,
  NotificationItem,
  NotificationCountResponse,
  NotificationPagedResponse,
} from '@/interfaces'

const NOTIFICATION_BASE_PATH = '/notification'
const MAX_NOTIFICATIONS = 50

let activeStompClient: Client | null = null

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

const requestWsTicket = async () => {
  const { data } = await axiosInstance.get<{ ticket?: string }>('/auth/ws-ticket')
  return typeof data.ticket === 'string' ? data.ticket : ''
}

const notificationTabFilters: Record<number, (item: NotificationItem) => boolean> = {
  1: (item) => item.inbox,
  2: (item) => !item.read && item.inbox,
  3: (item) => !item.inbox,
}

const isValidUserId = (userId: number) => Number.isInteger(userId) && userId > 0

export const useStoreNotification = defineStore('notification', {
  // State
  state: () => ({
    counter: { ...initialCounterNotification },
    notifications: [...initialNotifications],
    tab: initialTabNotification,
    status: initialStatusNotification,
    errorMessage: initialErrorMessageNotification,
    loadingNotifications: initialLoadingNotification,
  }),

  // Getters
  getters: {
    unreadCount: (state) => state.counter.totalUnread,
    hasNotifications: (state) => state.notifications.length > 0,
    filterNotifications: (state) => {
      const filterPredicate = notificationTabFilters[state.tab]
      if (typeof filterPredicate === 'function') return state.notifications.filter(filterPredicate)
      return state.notifications
    },
  },

  // Actions
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
        this.errorMessage = messages.notification.loadError
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
        this.errorMessage = messages.notification.counterError
      }
    },

    /* === Mutations === */
    async mutationMarkAllAsRead(userId: number) {
      if (!isValidUserId(userId)) {
        this.errorMessage = messages.notification.invalidUserMarkAll
        return
      }

      try {
        await axiosInstance.patch(`${NOTIFICATION_BASE_PATH}/read-all`, {
          userId,
        })
        this.notifications = updateNotificationsByIds(
          this.notifications,
          getNotificationIds(this.notifications),
          mapperMarkAsRead,
        )
        await this.getCounter(userId)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          this.errorMessage = error.response?.data?.message || messages.notification.markAllReadError
          return
        }
        this.errorMessage = messages.notification.markAllReadError
      }
    },

    async mutationArchiveAll(userId: number) {
      if (!isValidUserId(userId)) {
        this.errorMessage = messages.notification.invalidUserArchive
        return
      }

      const ids = getInboxNotificationIds(this.notifications)
      if (ids.length === 0) return

      const numericIds = convertIdsToNumbers(ids)
      if (numericIds.length === 0) {
        this.errorMessage = messages.notification.archiveConvertError
        return
      }

      try {
        await axiosInstance.patch(`${NOTIFICATION_BASE_PATH}/archive`, {
          ids: numericIds,
          userId,
        })
        this.notifications = updateNotificationsByIds(this.notifications, ids, mapperArchiveNotification)
        await this.getCounter(userId)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          this.errorMessage = error.response?.data?.message || messages.notification.archiveAllError
          return
        }
        this.errorMessage = messages.notification.archiveAllError
      }
    },

    async mutationArchiveNotification(payload: NotificationItem, userId: number) {
      if (!isValidUserId(userId)) {
        this.errorMessage = messages.notification.invalidUserArchive
        return
      }

      const numericId = convertIdToNumber(payload.id)
      if (numericId === null) {
        this.errorMessage = messages.notification.invalidIdArchive
        return
      }

      try {
        await axiosInstance.patch(`${NOTIFICATION_BASE_PATH}/archive`, {
          ids: [numericId],
          userId,
        })
        this.notifications = findNotificationById(this.notifications, payload.id, mapperArchiveNotification)
        await this.getCounter(userId)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          this.errorMessage = error.response?.data?.message || messages.notification.archiveOneError
          return
        }
        this.errorMessage = messages.notification.archiveOneError
      }
    },

    async mutationMarkAsRead(payload: NotificationItem, userId: number) {
      if (!isValidUserId(userId)) {
        this.errorMessage = messages.notification.invalidUserRead
        return
      }

      const numericId = convertIdToNumber(payload.id)
      if (numericId === null) {
        this.errorMessage = messages.notification.invalidIdRead
        return
      }

      try {
        await axiosInstance.patch(`${NOTIFICATION_BASE_PATH}/read`, {
          ids: [numericId],
          userId,
        })
        this.notifications = findNotificationById(this.notifications, payload.id, mapperMarkAsRead)
        await this.getCounter(userId)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          this.errorMessage = error.response?.data?.message || messages.notification.markReadError
          return
        }
        this.errorMessage = messages.notification.markReadError
      }
    },

    mutationMarkAsNotRead(payload: NotificationItem) {
      this.notifications = findNotificationById(this.notifications, payload.id, mapperMarkAsNotRead)
    },

    clearNotifications() {
      this.notifications = []
    },

    // Handlers
    disconnect() {
      if (!activeStompClient) return

      activeStompClient.deactivate()
      activeStompClient = null
      if (this.status !== 'idle') this.status = 'disconnected'
    },

    async connect(userId: number) {
      if (!userId) return
      if (activeStompClient?.active) return

      const wsUrl = resolveWsUrl()
      if (!wsUrl) {
        this.status = 'error'
        this.errorMessage = messages.notification.wsUrlMissing
        return
      }

      this.status = 'connecting'
      this.errorMessage = null

      let wsTicket = ''
      try {
        wsTicket = await requestWsTicket()
      } catch {
        this.status = 'error'
        this.errorMessage = messages.notification.wsTicketError
        return
      }

      if (!wsTicket) {
        this.status = 'error'
        this.errorMessage = messages.notification.wsTicketInvalid
        return
      }

      const encodedTicket = encodeURIComponent(wsTicket)
      const brokerURL = wsUrl.includes('?')
        ? `${wsUrl}&ticket=${encodedTicket}`
        : `${wsUrl}?ticket=${encodedTicket}`

      const client = new Client({
        brokerURL,
        reconnectDelay: 5000,
        onConnect: () => {
          this.status = 'connected'
          client.subscribe(`/topic/notifications/${userId}`, async (message) => {
            const payload = parseNotificationPayload(message.body)
            const notification = payload
              ? mapperNotificationFromPayload(payload, messages.notification.newNotificationFallback)
              : mapperNotificationFromPayload({}, String(message.body || messages.notification.newNotificationFallback))
            this.pushNotification(notification)
            await this.getCounter(userId)
          })
        },
        onWebSocketError: () => {
          this.status = 'error'
          this.errorMessage = messages.notification.wsConnectionError
        },
        onStompError: () => {
          this.status = 'error'
          this.errorMessage = messages.notification.wsStompError
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
