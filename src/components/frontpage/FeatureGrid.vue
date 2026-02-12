<script setup lang="ts">
import type { CrmFeature } from '@/interfaces'

defineProps<{
  features: CrmFeature[]
}>()
</script>

<template>
  <section class="mx-auto max-w-7xl px-6 py-14 lg:px-8">
    <div v-if="features.length > 0" class="grid gap-5 md:grid-cols-3">
      <article
        v-for="feature in features"
        :key="feature.title"
        class="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900/70"
      >
        <h2 class="text-lg font-semibold">{{ feature.title }}</h2>
        <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
          {{ feature.description }}
        </p>
      </article>
    </div>
    <article
      v-else
      class="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600 dark:border-white/20 dark:bg-slate-900/60 dark:text-slate-300"
    >
      No hay funcionalidades para mostrar por ahora.
    </article>
  </section>
</template>
