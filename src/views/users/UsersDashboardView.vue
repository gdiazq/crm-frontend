<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { ActionsDropdownComponent, ButtonComponent, PaginationComponent, SearchBarComponent, StatusBadgeComponent, TableComponent } from '@/components'
import { usersTableColumns } from '@/factories'
import messages from '@/messages/messages'
import { useStoreUsers } from '@/stores'
import { useUsersAction } from '@/utils'
import type { UserTableRow } from '@/interfaces'
import type { DropdownAction } from '@/utils'

const storeUsers = useStoreUsers()
const { actionViewDetail, actionUpdateUser, actionToggleStatus } = useUsersAction()
const { usersRows, pagination, queryParams, loadingUsers, errorMessage } = storeToRefs(storeUsers)
const openActionsRowId = ref<string | null>(null)
const actionsMessage = ref<string>('')
const actionsColumnIndex = computed(() => usersTableColumns.length - 1)

const currentPage = computed(() => pagination.value.page + 1)
const totalPages = computed(() => pagination.value.totalPages)

const handleGoPage = async (page: number) => {
  await storeUsers.goToPage(page - 1)
}

const handleOpenFilters = () => {
  actionsMessage.value = messages.users.filtersComingSoon
}

const handleCreateUser = () => {
  actionsMessage.value = messages.users.createComingSoon
}

const handleToggleRowActions = (rowId: string) => {
  openActionsRowId.value = openActionsRowId.value === rowId ? null : rowId
}

// Row action handlers
const handleViewDetail = (row: UserTableRow) => {
  actionsMessage.value = `${row.values[0]} ${messages.users.viewDetailComingSoon}`
  openActionsRowId.value = null
}

const handleUpdateUser = (row: UserTableRow) => {
  actionsMessage.value = `${row.values[0]} ${messages.users.updateUserComingSoon}`
  openActionsRowId.value = null
}

const handleToggleStatus = (row: UserTableRow) => {
  const nextStatus = !Boolean(row.status)
  storeUsers.mutationToggleUserStatus(row.id)
  actionsMessage.value = `${row.values[0]} ${nextStatus ? messages.users.toggleEnabledSuccess : messages.users.toggleDisabledSuccess}`
  openActionsRowId.value = null
}

const resolveRowActions = (row: UserTableRow): DropdownAction[] => [
  actionViewDetail(() => handleViewDetail(row)),
  actionUpdateUser(() => handleUpdateUser(row)),
  actionToggleStatus(Boolean(row.status), () => handleToggleStatus(row)),
]

const handleCloseRowActions = () => {
  openActionsRowId.value = null
}

onMounted(async () => {
  window.addEventListener('click', handleCloseRowActions)
  await storeUsers.getUsers()
})

onBeforeUnmount(() => {
  window.removeEventListener('click', handleCloseRowActions)
})
</script>

<template>
  <section class="space-y-4">
    <header class="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900/60">
      <h1 class="text-2xl font-bold">Dashboard de usuarios</h1>
    </header>

    <p
      v-if="errorMessage"
      class="rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-400/40 dark:bg-rose-900/20 dark:text-rose-200"
    >
      {{ errorMessage }}
    </p>
    <p
      v-if="actionsMessage"
      class="rounded-lg border border-cyan-300 bg-cyan-50 px-3 py-2 text-sm text-cyan-700 dark:border-cyan-400/40 dark:bg-cyan-900/20 dark:text-cyan-200"
    >
      {{ actionsMessage }}
    </p>

    <div class="flex flex-col gap-3 md:flex-row md:items-end">
      <div class="flex items-center">
        <ButtonComponent
          type="button"
          variant="outline"
          :disabled="loadingUsers"
          label="Filtro"
          :on-click="handleOpenFilters"
        />
      </div>
      <div class="flex-1">
        <SearchBarComponent
          :value="queryParams.search"
          :loading="loadingUsers"
          placeholder="Buscar por nombre, apellido o correo"
          :on-value-change="storeUsers.setSearch"
          :on-search="storeUsers.searchUsers"
        />
      </div>
      <div class="flex items-center md:ml-auto">
        <ButtonComponent
          type="button"
          variant="success"
          :disabled="loadingUsers"
          label="Nuevo usuario"
          :on-click="handleCreateUser"
        />
      </div>
    </div>

    <TableComponent
      :columns="usersTableColumns"
      :rows="usersRows"
      :loading="loadingUsers"
      empty-message="No hay usuarios registrados."
    >
      <template #cell="{ row, value, columnIndex }">
        <StatusBadgeComponent v-if="columnIndex === 6" :enabled="row.status" />
        <ActionsDropdownComponent
          v-else-if="columnIndex === actionsColumnIndex"
          :open="openActionsRowId === row.id"
          :actions="resolveRowActions(row)"
          :on-toggle="() => handleToggleRowActions(row.id)"
        />
        <span v-else>{{ value }}</span>
      </template>
    </TableComponent>

    <div class="flex justify-end">
      <PaginationComponent
        :current-page="currentPage"
        :total-pages="totalPages"
        :loading="loadingUsers"
        :on-go-page="handleGoPage"
        :on-previous="storeUsers.previousPage"
        :on-next="storeUsers.nextPage"
      />
    </div>
  </section>
</template>
