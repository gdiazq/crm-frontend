import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { axiosInstance } from '@/config'
import { initialUsersPagination, initialUsersRows } from '@/factories'
import { mapperUsersPagination, mapperUsersRows } from '@/mappers'
import type { UserPagedResponse, UserTableRow, UsersPagination } from '@/interfaces'

export const useStoreUsers = defineStore('users', () => {
  // State
  const usersRows = ref<UserTableRow[]>([...initialUsersRows])
  const pagination = ref<UsersPagination>({ ...initialUsersPagination })

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
        params: {
          page: pagination.value.page,
          size: pagination.value.size,
        },
      })
      usersRows.value = mapperUsersRows(data.content || [])
      pagination.value = mapperUsersPagination(data)
    } catch (error) {
      errorBack.value = error
      if (axios.isAxiosError(error)) {
        errorMessage.value = error.response?.data?.message || 'No se pudo cargar la lista de usuarios.'
      } else {
        errorMessage.value = 'No se pudo cargar la lista de usuarios.'
      }
    } finally {
      loadingUsers.value = false
    }
  }

  const goToPage = async (page: number) => {
    const lastPageIndex = Math.max((pagination.value.totalPages || 1) - 1, 0)
    if (page < 0 || page > lastPageIndex) return
    pagination.value.page = page
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

  return {
    // State
    usersRows,
    pagination,
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
  }
})
