import type { UserTableRow, UsersPagination } from '@/interfaces'

export const usersTableColumns: string[] = [
  'Usuario',
  'Nombre',
  'Email',
  'Telefono',
  'Roles',
  'Verificado',
  'Estado',
  'Creado',
  'Ultimo acceso',
]

export const initialUsersRows: UserTableRow[] = []

export const initialUsersPagination: UsersPagination = {
  page: 0,
  size: 8,
  totalElements: 0,
  totalPages: 0,
  first: true,
  last: true,
}
