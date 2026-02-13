<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { CookieConsentBanner } from '@/components'
import PrivateDefaultLayout from '@/layouts/private/PrivateDefaultLayout.vue'
import PublicDefaultLayout from '@/layouts/public/PublicDefaultLayout.vue'
import { useStoreTheme } from '@/stores'

const route = useRoute()
const themeStore = useStoreTheme()

const currentLayout = computed(() => {
  if (route.meta.layout === 'LayoutPrivateDefault') {
    return PrivateDefaultLayout
  }
  return PublicDefaultLayout
})

onMounted(() => {
  themeStore.initTheme()
})
</script>

<template>
  <component :is="currentLayout" />
  <CookieConsentBanner />
</template>
