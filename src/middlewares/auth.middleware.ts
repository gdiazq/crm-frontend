import type { RouteLocationNormalized } from 'vue-router'
import type { useStoreAuth } from '@/stores'

type AuthStore = ReturnType<typeof useStoreAuth>

export async function handleAuthentication(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  storeAuth: AuthStore,
): Promise<true | { path: string } | { name: string }> {
  const requiresAuth = to.matched.some((r) => r.meta.requiresAuth)
  const requiresPermissions = to.matched.some((r) => r.meta.requiresPermissions)
  const isLogoutRoute = to.path === '/logout'

  try {
    if (requiresAuth && !storeAuth.user && !storeAuth.loadingUser) {
      await storeAuth.getCurrentUser()
    }
  } catch {
    return { path: '/login' }
  }

  if (!storeAuth.user && requiresAuth) return { path: '/login' }
  if (storeAuth.user && !requiresAuth && !isLogoutRoute) return { path: '/' }

  if (storeAuth.user && requiresPermissions) {
    const canAccess = storeAuth.hasPermission(to.meta.module, to.meta.permissionType)
    if (!canAccess) return { name: 'unauthorized' }
  }

  return true
}
