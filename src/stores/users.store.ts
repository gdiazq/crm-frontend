import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { axiosInstance } from '@/config'
import { initialUsersPagination, initialUsersQueryParams, initialUsersRows } from '@/factories'
import { mapperUsersPagination, mapperUsersQueryParams, mapperUsersRows } from '@/mappers'
import messages from '@/messages/messages'
import type { UserPagedResponse, UserTableRow, UsersPagination, UsersQueryParams } from '@/interfaces'

export const useStoreUsers = defineStore('users', () => {
  // State
  const usersRows = ref<UserTableRow[]>([...initialUsersRows])
  const pagination = ref<UsersPagination>({ ...initialUsersPagination })
  const queryParams = ref<UsersQueryParams>({ ...initialUsersQueryParams })

  // Loading
  const loadingUsers = ref(false)

  // Messages
  const errorMessage = ref<string | null>(null)
  const errorBack = ref<unknown | null>(null)

  // Actions
  const getUsers = async () => {
    try {
      loadingUsers.value = true
      errorMessage.value = null
      errorBack.value = null

      const { data } = await axiosInstance.get<UserPagedResponse>('/user/paged', {
        params: mapperUsersQueryParams(queryParams.value),
      })
      usersRows.value = mapperUsersRows(data.content || [])
      pagination.value = mapperUsersPagination(data)
      queryParams.value.page = pagination.value.page
      queryParams.value.size = pagination.value.size
    } catch (error) {
      errorBack.value = error
      if (axios.isAxiosError(error)) {
        errorMessage.value = error.response?.data?.message || messages.users.loadError
      } else {
        errorMessage.value = messages.users.loadError
      }
    } finally {
      loadingUsers.value = false
    }
  }

  const goToPage = async (page: number) => {
    const lastPageIndex = Math.max((pagination.value.totalPages || 1) - 1, 0)
    if (page < 0 || page > lastPageIndex) return
    pagination.value.page = page
    queryParams.value.page = page
    await getUsers()
  }

  const nextPage = async () => {
    if (pagination.value.last) return
    await goToPage(pagination.value.page + 1)
  }

  const previousPage = async () => {
    if (pagination.value.first) return
    await goToPage(pagination.value.page - 1)
  }

  const setSearch = (value: string) => {
    queryParams.value.search = value
  }

  const searchUsers = async () => {
    pagination.value.page = 0
    queryParams.value.page = 0
    await getUsers()
  }

  const mutationToggleUserStatus = (userId: string) => {
    usersRows.value = usersRows.value.map((row) => {
      if (row.id !== userId) return row
      const nextStatus = !Boolean(row.status)
      return {
        ...row,
        status: nextStatus,
        values: row.values.map((value, index) => {
          if (index !== 6) return value
          return nextStatus ? messages.users.statusEnabled : messages.users.statusDisabled
        }),
      }
    })
  }

  return {
    // State
    usersRows,
    pagination,
    queryParams,
    // Loading
    loadingUsers,
    // Messages
    errorMessage,
    errorBack,
    // Actions
    getUsers,
    goToPage,
    nextPage,
    previousPage,
    setSearch,
    searchUsers,
    mutationToggleUserStatus,
  }
})
