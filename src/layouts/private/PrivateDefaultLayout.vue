<script setup lang="ts">
import { ref } from 'vue'
import { useStoreTheme } from '@/stores'

const storeTheme = useStoreTheme()
const slideNotificaciones = ref(false)

const toggleNotificaciones = (event?: Event) => {
  slideNotificaciones.value = !slideNotificaciones.value
  event?.stopPropagation()
}

const handleCloseNotificaciones = () => {
  slideNotificaciones.value = false
}
</script>

<template>
  <main
    v-cloak
    id="layout-private-default"
    class="layout-private-default min-h-screen"
    :class="storeTheme.isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'"
  >
    <section class="mx-auto flex min-h-screen w-full max-w-7xl">
      <aside
        class="hidden w-72 border-r p-6 lg:block"
        :class="storeTheme.isDark ? 'border-white/10 bg-slate-900/60' : 'border-slate-200 bg-white'"
      >
        <p class="text-sm font-semibold uppercase tracking-wide opacity-70">Menu privado</p>
        <nav class="mt-6 space-y-2 text-sm">
          <RouterLink
            to="/"
            class="block rounded-lg px-3 py-2 hover:bg-slate-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2"
            :class="storeTheme.isDark ? 'focus-visible:ring-offset-slate-900' : 'focus-visible:ring-offset-white'"
          >
            Inicio
          </RouterLink>
          <RouterLink
            to="/dashboard"
            class="block rounded-lg px-3 py-2 hover:bg-slate-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2"
            :class="storeTheme.isDark ? 'focus-visible:ring-offset-slate-900' : 'focus-visible:ring-offset-white'"
          >
            Dashboard
          </RouterLink>
          <RouterLink
            to="/logout"
            class="block rounded-lg px-3 py-2 hover:bg-slate-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2"
            :class="storeTheme.isDark ? 'focus-visible:ring-offset-slate-900' : 'focus-visible:ring-offset-white'"
          >
            Salir
          </RouterLink>
        </nav>
      </aside>

      <section class="flex min-h-screen flex-1 flex-col">
        <header
          class="flex items-center justify-between border-b px-6 py-4"
          :class="storeTheme.isDark ? 'border-white/10 bg-slate-900/40' : 'border-slate-200 bg-white/80'"
        >
          <p class="text-sm font-semibold">Area privada</p>
          <button
            type="button"
            class="rounded-lg border px-3 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2"
            :class="
              storeTheme.isDark
                ? 'border-slate-700 bg-slate-900 hover:border-cyan-300/60 focus-visible:ring-offset-slate-950'
                : 'border-slate-300 bg-white hover:border-cyan-500 focus-visible:ring-offset-slate-50'
            "
            @click="toggleNotificaciones"
          >
            Notificaciones
          </button>
        </header>

        <section class="flex-1 p-6">
          <RouterView />
        </section>
      </section>
    </section>

    <aside
      v-if="slideNotificaciones"
      class="fixed right-4 top-20 w-80 rounded-xl border p-4 shadow-xl"
      :class="storeTheme.isDark ? 'border-white/10 bg-slate-900 text-slate-100' : 'border-slate-200 bg-white'"
    >
      <div class="mb-3 flex items-center justify-between">
        <p class="font-semibold">Notificaciones</p>
        <button
          type="button"
          class="text-sm opacity-70 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2"
          :class="storeTheme.isDark ? 'focus-visible:ring-offset-slate-900' : 'focus-visible:ring-offset-white'"
          @click="handleCloseNotificaciones"
        >
          Cerrar
        </button>
      </div>
      <p class="text-sm opacity-80">Aqui puedes conectar tu `storeNotification` y componente real.</p>
    </aside>
  </main>
</template>
