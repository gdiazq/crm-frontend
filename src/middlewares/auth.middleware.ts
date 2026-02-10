import type { RouteLocationNormalized } from 'vue-router'
import type { useStoreAuth } from '@/stores'

type AuthStore = ReturnType<typeof useStoreAuth>

export const handleAuthentication = async (
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  storeAuth: AuthStore,
) => {
  storeAuth.hydrate()

  if (to.meta.requiresAuth && !storeAuth.isAuthenticated) {
    return { name: 'login' }
  }

  if (to.name === 'login' && storeAuth.isAuthenticated) {
    return { name: 'Inicio' }
  }

  if (to.meta.requiresPermissions) {
    const canAccess = storeAuth.hasPermission(to.meta.module, to.meta.permissionType)
    if (!canAccess) {
      return { name: 'unauthorized' }
    }
  }

  if (to.meta.title) {
    document.title = to.meta.title
  }

  return true
}
