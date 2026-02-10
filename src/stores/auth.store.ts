import { defineStore } from 'pinia'
import { ref } from 'vue'

const AUTH_KEY = 'crm-auth'

type PermissionType = 'canRead' | 'canCreate' | 'canUpdate' | 'canDelete'

export const useStoreAuth = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const user = ref<{ name: string } | null>(null)

  const hydrate = () => {
    if (typeof window === 'undefined') return
    const session = window.localStorage.getItem(AUTH_KEY)
    isAuthenticated.value = session === '1'
    user.value = isAuthenticated.value ? { name: 'Admin' } : null
  }

  const login = () => {
    isAuthenticated.value = true
    user.value = { name: 'Admin' }
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(AUTH_KEY, '1')
    }
  }

  const logout = () => {
    isAuthenticated.value = false
    user.value = null
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(AUTH_KEY)
    }
  }

  const hasPermission = (_module: string, _permissionType: PermissionType) => {
    return true
  }

  return {
    isAuthenticated,
    user,
    hydrate,
    login,
    logout,
    hasPermission,
  }
})
