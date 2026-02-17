import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { LAYOUT_PRIVATE, LAYOUT_PUBLIC } from '@/constants'
import { useStoreAuth } from '@/stores'
import { handleAuthentication } from '@/middlewares/auth.middleware'

import LoginView from '@/views/public/LoginView.vue'
import LoginCredentialsView from '@/views/public/LoginCredentialsView.vue'
import RecoveryView from '@/views/public/RecoveryView.vue'
import RegisterView from '@/views/public/RegisterView.vue'
import VerifyEmailView from '@/views/public/VerifyEmailView.vue'
import CreatePasswordView from '@/views/public/CreatePasswordView.vue'
import DashboardExampleView from '@/views/public/DashboardExampleView.vue'
import LogoutView from '@/views/public/LogoutView.vue'
import HomeView from '@/views/frontpage/HomeView.vue'
import DashboardView from '@/views/dashboard/DashboardView.vue'
import SettingsView from '@/views/settings/SettingsView.vue'
import UsersDashboardView from '@/views/users/UsersDashboardView.vue'
import UnauthorizedView from '@/views/errors/UnauthorizedView.vue'
import NotFoundView from '@/views/errors/NotFoundView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: {
      title: 'Login',
      layout: LAYOUT_PUBLIC,
      requiresAuth: false,
      permissionType: 'canRead',
      requiresPermissions: false,
      module: 'Login',
      parent: '',
    },
  },
  {
    path: '/login/credentials',
    name: 'login-credentials',
    component: LoginCredentialsView,
    meta: {
      title: 'Login',
      layout: LAYOUT_PUBLIC,
      requiresAuth: false,
      permissionType: 'canRead',
      requiresPermissions: false,
      module: 'LoginCredentials',
      parent: '',
    },
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: {
      title: 'Registro',
      layout: LAYOUT_PUBLIC,
      requiresAuth: false,
      permissionType: 'canRead',
      requiresPermissions: false,
      module: 'Register',
      parent: '',
    },
  },
  {
    path: '/recovery',
    name: 'recovery',
    component: RecoveryView,
    meta: {
      title: 'Recuperar contraseña',
      layout: LAYOUT_PUBLIC,
      requiresAuth: false,
      permissionType: 'canRead',
      requiresPermissions: false,
      module: 'Recovery',
      parent: '',
    },
  },
  {
    path: '/verify-email',
    name: 'verify-email',
    component: VerifyEmailView,
    meta: {
      title: 'Verificar correo',
      layout: LAYOUT_PUBLIC,
      requiresAuth: false,
      permissionType: 'canRead',
      requiresPermissions: false,
      module: 'VerifyEmail',
      parent: '',
    },
  },
  {
    path: '/create-password',
    name: 'create-password',
    component: CreatePasswordView,
    meta: {
      title: 'Crear contraseña',
      layout: LAYOUT_PUBLIC,
      requiresAuth: false,
      permissionType: 'canRead',
      requiresPermissions: false,
      module: 'CreatePassword',
      parent: '',
    },
  },
  {
    path: '/logout',
    name: 'Logout',
    component: LogoutView,
    meta: {
      title: 'Logout',
      layout: LAYOUT_PUBLIC,
      requiresAuth: false,
      permissionType: 'canRead',
      requiresPermissions: false,
      module: 'Logout',
      parent: '',
    },
  },
  {
    path: '/dashboard-example',
    name: 'dashboard-example',
    component: DashboardExampleView,
    meta: {
      title: 'Dashboard Publico',
      layout: LAYOUT_PUBLIC,
      requiresAuth: false,
      permissionType: 'canRead',
      requiresPermissions: false,
      module: 'DashboardExample',
      parent: '',
    },
  },
  {
    path: '/',
    name: 'Inicio',
    component: HomeView,
    meta: {
      title: 'Inicio',
      layout: LAYOUT_PUBLIC,
      requiresAuth: false,
      permissionType: 'canRead',
      requiresPermissions: false,
      module: 'Home',
      parent: '',
    },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: {
      title: 'Dashboard',
      layout: LAYOUT_PRIVATE,
      requiresAuth: true,
      permissionType: 'canRead',
      requiresPermissions: false,
      module: 'Dashboard',
      parent: '',
    },
  },
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsView,
    meta: {
      title: 'Settings',
      layout: LAYOUT_PRIVATE,
      requiresAuth: true,
      permissionType: 'canRead',
      requiresPermissions: false,
      module: 'Settings',
      parent: '',
    },
  },
  {
    path: '/users',
    name: 'Users',
    component: UsersDashboardView,
    meta: {
      title: 'Usuarios',
      layout: LAYOUT_PRIVATE,
      requiresAuth: true,
      permissionType: 'canRead',
      requiresPermissions: false,
      module: 'Users',
      parent: '',
    },
  },
  {
    path: '/unauthorized',
    name: 'unauthorized',
    component: UnauthorizedView,
    meta: {
      title: 'No autorizado',
      layout: LAYOUT_PRIVATE,
      requiresAuth: true,
      permissionType: 'canRead',
      requiresPermissions: false,
      module: 'Unauthorized',
      parent: '',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: NotFoundView,
    meta: {
      title: 'Not found',
      layout: LAYOUT_PUBLIC,
      requiresAuth: false,
      permissionType: 'canRead',
      requiresPermissions: false,
      module: 'NotFound',
      parent: '',
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'active',
  routes,
})

router.beforeEach(async (to, from) => {
  const storeAuth = useStoreAuth()
  return await handleAuthentication(to, from, storeAuth)
})

export default router
