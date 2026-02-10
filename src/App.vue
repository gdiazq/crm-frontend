<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import PrivateDefaultLayout from '@/layouts/private/PrivateDefaultLayout.vue'
import PublicDefaultLayout from '@/layouts/public/PublicDefaultLayout.vue'

const route = useRoute()

const currentLayout = computed(() => {
  if (route.meta.layout === 'LayoutPrivateDefault') {
    return PrivateDefaultLayout
  }
  return PublicDefaultLayout
})
</script>

<template>
  <component :is="currentLayout" />
</template>
