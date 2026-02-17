<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { PaginationComponent, StatusBadgeComponent, TableComponent } from '@/components'
import { usersTableColumns } from '@/factories'
import { useStoreUsers } from '@/stores'

const storeUsers = useStoreUsers()
const { usersRows, pagination, loadingUsers, errorMessage } = storeToRefs(storeUsers)

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

onMounted(async () => {
  await storeUsers.getUsers()
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

    <TableComponent
      :columns="usersTableColumns"
      :rows="usersRows"
      :loading="loadingUsers"
      empty-message="No hay usuarios registrados."
    >
      <template #cell="{ row, value, columnIndex }">
        <StatusBadgeComponent v-if="columnIndex === 6" :enabled="row.status" />
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
