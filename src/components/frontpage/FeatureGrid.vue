<script setup lang="ts">
import type { CrmFeature } from '@/interfaces'

defineProps<{
  isDark: boolean
  features: CrmFeature[]
}>()
</script>

<template>
  <section class="mx-auto max-w-7xl px-6 py-14 lg:px-8">
    <div v-if="features.length > 0" class="grid gap-5 md:grid-cols-3">
      <article
        v-for="feature in features"
        :key="feature.title"
        class="rounded-2xl border p-6"
        :class="isDark ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white'"
      >
        <h2 class="text-lg font-semibold">{{ feature.title }}</h2>
        <p class="mt-2 text-sm" :class="isDark ? 'text-slate-300' : 'text-slate-600'">
          {{ feature.description }}
        </p>
      </article>
    </div>
    <article
      v-else
      class="rounded-2xl border border-dashed p-6 text-sm"
      :class="isDark ? 'border-white/20 bg-slate-900/60 text-slate-300' : 'border-slate-300 bg-white text-slate-600'"
    >
      No hay funcionalidades para mostrar por ahora.
    </article>
  </section>
</template>
