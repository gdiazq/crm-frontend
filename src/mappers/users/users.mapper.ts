import type { UserPagedResponse, UserRaw, UserTableRow, UsersPagination } from '@/interfaces'

const roleLabels: Record<string, string> = {
  ROLE_ADMIN: 'Administrador',
  ROLE_USER: 'Usuario',
  ROLE_MANAGER: 'Coordinador',
  ROLE_COORDINATOR: 'Coordinador',
}

const formatDateTime = (value: string) => {
  if (!value) return 'Sin registro'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('es-CL')
}

const formatRoleLabel = (roleName: string) => {
  return roleLabels[roleName] || roleName
}

export function mapperUsersRows(result: UserRaw[]): UserTableRow[] {
  return result.map((item) => ({
    id: String(item.id),
    status: item.status,
    values: [
      item.username || '-',
      `${item.firstName || ''} ${item.lastName || ''}`.trim() || '-',
      item.email || '-',
      item.phoneNumber || '-',
      item.roles?.map((role) => formatRoleLabel(role.name)).join(', ') || '-',
      item.emailVerified ? 'Si' : 'No',
      item.status ? 'Habilitado' : 'Deshabilitado',
      formatDateTime(item.createdAt),
      formatDateTime(item.lastLogin),
    ],
  }))
}

export function mapperUsersPagination(result: UserPagedResponse): UsersPagination {
  return {
    page: result.number ?? 0,
    size: result.size ?? 10,
    totalElements: result.totalElements ?? 0,
    totalPages: result.totalPages ?? 0,
    first: result.first ?? true,
    last: result.last ?? true,
  }
}
