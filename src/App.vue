<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { CookieConsentBanner } from '@/components'
import PrivateDefaultLayout from '@/layouts/private/PrivateDefaultLayout.vue'
import PublicDefaultLayout from '@/layouts/public/PublicDefaultLayout.vue'
import { useStoreTheme } from '@/stores'

const COOKIE_CONSENT_KEY = 'crm_cookie_consent'
const route = useRoute()
const themeStore = useStoreTheme()
const cookieConsentVisible = ref(false)

const currentLayout = computed(() => {
  if (route.meta.layout === 'LayoutPrivateDefault') {
    return PrivateDefaultLayout
  }
  return PublicDefaultLayout
})

onMounted(() => {
  themeStore.initTheme()
  const cookieString = document.cookie || ''
  cookieConsentVisible.value = !cookieString.split(';').some((rawCookie) => {
    const cookie = rawCookie.trim()
    return cookie === `${COOKIE_CONSENT_KEY}=accepted`
  })
})

const handleAcceptCookieConsent = () => {
  document.cookie = `${COOKIE_CONSENT_KEY}=accepted; Path=/; Max-Age=31536000; SameSite=Lax`
  cookieConsentVisible.value = false
}
</script>

<template>
  <component :is="currentLayout" />
  <CookieConsentBanner :is-visible="cookieConsentVisible" :on-accept="handleAcceptCookieConsent" />
</template>
