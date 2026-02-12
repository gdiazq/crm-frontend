import axios from 'axios'
import router from '@/router'

import { APP_URL } from '@/constants'
import { useAuthSessionStorage } from '@/composables'
import type { AuthLoginResponse } from '@/interfaces'

type PendingRequestResolver = (token: string | null) => void

const authSessionStorage = useAuthSessionStorage()
let isRefreshingToken = false
let pendingRequests: PendingRequestResolver[] = []

const shouldSkipRefresh = (url?: string) => {
  if (!url) return false
  return ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout'].some((path) => url.includes(path))
}

const isAuthExpiredStatus = (status?: number) => {
  return status === 401 || status === 403
}

const resolvePendingRequests = (token: string | null) => {
  pendingRequests.forEach((resolver) => resolver(token))
  pendingRequests = []
}

const axiosInstance = axios.create({
  baseURL: APP_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  //withCredentials: true
})

// Request interceptor
axiosInstance.interceptors.request.use(function (config) {
  const token = authSessionStorage.getAccessToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
}, function (error) {
  return Promise.reject(error)
})

// Response interceptor
axiosInstance.interceptors.response.use(function (response) {
  return response
}, async function (error) {
  const status = error.response?.status
  const originalRequest = error.config

  if (!originalRequest || !isAuthExpiredStatus(status) || shouldSkipRefresh(originalRequest.url)) {
    return Promise.reject(error)
  }

  const alreadyRetried = Reflect.get(originalRequest, '_retry')
  if (alreadyRetried) {
    router.push('/logout')
    return Promise.reject(error)
  }

  const refreshToken = authSessionStorage.getRefreshToken()
  if (!refreshToken) {
    router.push('/logout')
    return Promise.reject(error)
  }

  if (isRefreshingToken) {
    return new Promise((resolve, reject) => {
      pendingRequests.push((token) => {
        if (!token) {
          reject(error)
          return
        }
        resolve(axiosInstance(originalRequest))
      })
    })
  }

  Reflect.set(originalRequest, '_retry', true)
  isRefreshingToken = true

  try {
    const { data } = await axios.post<AuthLoginResponse>(`${APP_URL}/auth/refresh`, {
      refreshToken,
    })

    authSessionStorage.setAuthTokens(data)
    resolvePendingRequests(data.access_token)
    return axiosInstance(originalRequest)
  } catch (refreshError) {
    resolvePendingRequests(null)
    router.push('/logout')
    return Promise.reject(refreshError)
  } finally {
    isRefreshingToken = false
  }
})

export default axiosInstance
