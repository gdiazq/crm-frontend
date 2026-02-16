import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { initialDashboardExample } from '@/factories'
import { mapperDashboardExample } from '@/mappers'
import messages from '@/messages/messages'
import type { DashboardExample, DashboardExampleRaw } from '@/interfaces'

export const useStoreDashboardExample = defineStore('dashboardExample', () => {
  // State
  const dashboard = ref<DashboardExample>({ ...initialDashboardExample })

  // Loading
  const loadingDashboard = ref(false)

  // Messages
  const errorMessage = ref('')

  // Actions
  const getDashboard = async () => {
    try {
      loadingDashboard.value = true
      errorMessage.value = ''

      const { data } = await axios.get<DashboardExampleRaw>('/db/dashboard/dashboard-example.mock.json')
      dashboard.value = mapperDashboardExample(data)
    } catch {
      errorMessage.value = messages.dashboard.loadError
    } finally {
      loadingDashboard.value = false
    }
  }

  return {
    // State
    dashboard,
    // Loading
    loadingDashboard,
    // Messages
    errorMessage,
    // Actions
    getDashboard,
  }
})
