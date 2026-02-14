import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useStoreAuth } from '@/stores'
import { handleAuthentication } from '@/middlewares/auth.middleware'

import LoginView from '@/views/public/LoginView.vue'
import RecoveryView from '@/views/public/RecoveryView.vue'
import RegisterView from '@/views/public/RegisterView.vue'
import VerifyEmailView from '@/views/public/VerifyEmailView.vue'
import CreatePasswordView from '@/views/public/CreatePasswordView.vue'
import LogoutView from '@/views/public/LogoutView.vue'
import HomeView from '@/views/HomeView.vue'
import DashboardView from '@/views/private/DashboardView.vue'
import SettingsView from '@/views/private/SettingsView.vue'
import UnauthorizedView from '@/views/UnauthorizedView.vue'
import NotFoundView from '@/views/NotFoundView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: {
      title: 'Login',
      layout: 'LayoutPublicDefault',
      requiresAuth: false,
      permissionType: 'canRead',
      requiresPermissions: false,
      module: 'Login',
      parent: '',
    },
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: {
      title: 'Registro',
      layout: 'LayoutPublicDefault',
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
      layout: 'LayoutPublicDefault',
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
      layout: 'LayoutPublicDefault',
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
      layout: 'LayoutPublicDefault',
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
      layout: 'LayoutPublicDefault',
      requiresAuth: false,
      permissionType: 'canRead',
      requiresPermissions: false,
      module: 'Logout',
      parent: '',
    },
  },
  {
    path: '/',
    name: 'Inicio',
    component: HomeView,
    meta: {
      title: 'Inicio',
      layout: 'LayoutPublicDefault',
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
      layout: 'LayoutPrivateDefault',
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
      layout: 'LayoutPrivateDefault',
      requiresAuth: true,
      permissionType: 'canRead',
      requiresPermissions: false,
      module: 'Settings',
      parent: '',
    },
  },
  {
    path: '/unauthorized',
    name: 'unauthorized',
    component: UnauthorizedView,
    meta: {
      title: 'No autorizado',
      layout: 'LayoutPrivateDefault',
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
      layout: 'LayoutPublicDefault',
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
