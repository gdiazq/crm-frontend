<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { ActionsDropdownComponent, ButtonComponent, PaginationComponent, SearchBarComponent, StatusBadgeComponent, TableComponent } from '@/components'
import { usersTableColumns } from '@/factories'
import { mapperUsersRowActions } from '@/mappers'
import { useStoreUsers } from '@/stores'
import type { UserTableRow } from '@/interfaces'

const storeUsers = useStoreUsers()
const { usersRows, pagination, queryParams, loadingUsers, errorMessage } = storeToRefs(storeUsers)
const openActionsRowId = ref<string | null>(null)
const actionsMessage = ref<string>('')
const actionsColumnIndex = computed(() => usersTableColumns.length - 1)

const currentPage = computed(() => pagination.value.page + 1)
const totalPages = computed(() => pagination.value.totalPages)

const handleGoPage = async (page: number) => {
  await storeUsers.goToPage(page - 1)
}

const handlePreviousPage = async () => {
  await storeUsers.previousPage()
}

const handleNextPage = async () => {
  await storeUsers.nextPage()
}

const handleSearchValue = (value: string) => {
  storeUsers.setSearch(value)
}

const handleSearchUsers = async () => {
  await storeUsers.searchUsers()
}

const handleOpenFilters = () => {
  actionsMessage.value = 'Filtros avanzados disponibles proximamente.'
}

const handleCreateUser = () => {
  actionsMessage.value = 'Creacion de nuevo usuario disponible proximamente.'
}

const handleToggleRowActions = (rowId: string) => {
  openActionsRowId.value = openActionsRowId.value === rowId ? null : rowId
}

const resolveRowActions = (row: UserTableRow) => {
  return mapperUsersRowActions(Boolean(row.status))
}

const handleSelectRowAction = (row: UserTableRow, actionId: string) => {
  if (actionId === 'view-detail') {
    actionsMessage.value = `Detalle de usuario ${row.values[0]} disponible proximamente.`
  }

  if (actionId === 'toggle-status') {
    const nextStatus = !Boolean(row.status)
    storeUsers.mutationToggleUserStatus(row.id)
    actionsMessage.value = nextStatus
      ? `Usuario ${row.values[0]} habilitado correctamente.`
      : `Usuario ${row.values[0]} deshabilitado correctamente.`
  }

  if (actionId === 'custom-reset-mfa') {
    actionsMessage.value = `Reset MFA para ${row.values[0]} disponible proximamente.`
  }

  if (actionId === 'custom-resend-invite') {
    actionsMessage.value = `Reenvio de invitacion para ${row.values[0]} disponible proximamente.`
  }

  openActionsRowId.value = null
}

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
          :on-value-change="handleSearchValue"
          :on-search="handleSearchUsers"
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
          :on-select="(actionId) => handleSelectRowAction(row, actionId)"
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
        :on-previous="handlePreviousPage"
        :on-next="handleNextPage"
      />
    </div>
  </section>
</template>
