import { defineStore } from 'pinia'
import { ref } from 'vue'

const THEME_KEY = 'crm-theme'

export const useStoreTheme = defineStore('theme', () => {
  // State
  const isDark = ref(true)
  const errorBack = ref<Error | null>(null)
  const isInitialized = ref(false)

  // Handlers
  const applyThemeClass = (value: boolean) => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', value)
    }
  }

  // Setters
  const setTheme = (value: boolean) => {
    isDark.value = value
    applyThemeClass(value)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(THEME_KEY, value ? 'dark' : 'light')
    }
  }

  const toggleTheme = () => {
    setTheme(!isDark.value)
  }

  // Actions
  const initTheme = () => {
    try {
      if (isInitialized.value) {
        applyThemeClass(isDark.value)
        return
      }

      const storedTheme = typeof window !== 'undefined' ? window.localStorage.getItem(THEME_KEY) : null
      if (storedTheme === 'light') {
        isDark.value = false
      } else if (storedTheme === 'dark') {
        isDark.value = true
      } else if (typeof window !== 'undefined') {
        isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
      }

      applyThemeClass(isDark.value)
      isInitialized.value = true
    } catch (error) {
      if (error instanceof Error) {
        errorBack.value = error
      } else {
        errorBack.value = new Error('Unknown theme initialization error')
      }
    }
  }

  return {
    // State
    isDark,
    errorBack,
    // Actions
    initTheme,
    // Setters
    setTheme,
    toggleTheme,
  }
})
