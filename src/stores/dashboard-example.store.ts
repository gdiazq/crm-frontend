import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { initialDashboardExample } from '@/factories'
import { mapperDashboardExample } from '@/mappers'
import type { DashboardExample, DashboardExampleRaw } from '@/interfaces'

export const useStoreDashboardExample = defineStore('dashboardExample', () => {
  const dashboard = ref<DashboardExample>({ ...initialDashboardExample })
  const loadingDashboard = ref(false)
  const errorMessage = ref('')

  const getDashboard = async () => {
    try {
      loadingDashboard.value = true
      errorMessage.value = ''

      const { data } = await axios.get<DashboardExampleRaw>('/db/dashboard/dashboard-example.mock.json')
      dashboard.value = mapperDashboardExample(data)
    } catch {
      errorMessage.value = 'No se pudo cargar el dashboard demo.'
    } finally {
      loadingDashboard.value = false
    }
  }

  return {
    dashboard,
    loadingDashboard,
    errorMessage,
    getDashboard,
  }
})
