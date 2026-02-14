<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { InputComponent, TabsComponent } from '@/components'
import { useFormValidation } from '@/composables'
import {
  initialUpdateAvatarForm,
  initialUpdateProfileForm,
  settingsUpdateProfileValidationRules,
} from '@/factories'
import { mapperSettingProfileForm, mapperUpdateProfilePayload } from '@/mappers'
import { useStoreAuth, useStoreSettings } from '@/stores'

const storeAuth = useStoreAuth()
const storeSettings = useStoreSettings()
const { user, updateProfileSubmitting, updateAvatarSubmitting } = storeToRefs(storeAuth)
const {
  mfaState,
  statusMessage,
  devices,
  mfaSetupSteps,
  tabs,
  activeTab,
  activeSessions,
  mfaStatusLabel,
  mfaStatusClass,
} = storeToRefs(storeSettings)

const profile = ref({ ...initialUpdateProfileForm })
const avatarForm = ref({ ...initialUpdateAvatarForm })
const avatarError = ref<string | null>(null)
const avatarInputRef = ref<HTMLInputElement | null>(null)
const {
  errors: profileErrors,
  validateAll: validateProfile,
  onValidation: onProfileValidation,
} = useFormValidation(profile, settingsUpdateProfileValidationRules)

const userAvatarUrl = computed(() => {
  if (!user.value) return ''
  return user.value.avatar_url || ''
})

const avatarDisplayUrl = computed(() => avatarForm.value.previewUrl || userAvatarUrl.value)
const avatarInitials = computed(() => {
  const first = profile.value.firstName.trim().charAt(0)
  const last = profile.value.lastName.trim().charAt(0)
  const value = `${first}${last}`.trim().toUpperCase()
  return value || 'U'
})
const showAccountTab = computed(() => activeTab.value === 'account')
const showMfaTab = computed(() => activeTab.value === 'mfa')
const handleEnableMfa = () => storeSettings.enableMfa()
const handleDisableMfa = () => storeSettings.disableMfa()
const handleVerifyMfa = () => storeSettings.verifyMfa()
const handleLogoutDevice = (id: string) => storeSettings.logoutDevice(id)
const handleLogoutAllOtherDevices = () => storeSettings.logoutAllOtherDevices()
const handleTabChange = (tab: 'account' | 'mfa') => {
  storeSettings.setActiveTab(tab)
}

const handleFirstNameValue = (value: string) => {
  profile.value.firstName = value
}

const handleLastNameValue = (value: string) => {
  profile.value.lastName = value
}

const handleEmailValue = (value: string) => {
  profile.value.email = value
}

const handlePhoneNumberValue = (value: string) => {
  profile.value.phoneNumber = value
}

const handleSaveProfile = async () => {
  if (!validateProfile()) {
    storeSettings.setStatusMessage('Corrige los campos marcados para continuar.')
    return
  }

  if (!user.value?.id) {
    storeSettings.setStatusMessage('No se encontro usuario autenticado para actualizar.')
    return
  }

  const payload = mapperUpdateProfilePayload(
    user.value.id,
    profile.value.email,
    profile.value.firstName,
    profile.value.lastName,
    profile.value.phoneNumber,
  )
  const success = await storeAuth.updateProfile(payload)
  if (success) {
    storeSettings.setStatusMessage('Informacion de cuenta actualizada correctamente.')
    return
  }
  storeSettings.setStatusMessage(storeAuth.errorMessage || 'No se pudo actualizar la informacion de la cuenta.')
}

const clearAvatarPreview = () => {
  if (!avatarForm.value.previewUrl) return
  URL.revokeObjectURL(avatarForm.value.previewUrl)
  avatarForm.value.previewUrl = ''
}

const handleAvatarFileChange = (event: Event) => {
  if (!(event.target instanceof HTMLInputElement)) return
  const file = event.target.files?.[0]

  avatarError.value = null
  if (!file) {
    avatarForm.value.file = null
    clearAvatarPreview()
    return
  }

  if (!file.type.startsWith('image/')) {
    avatarError.value = 'Selecciona un archivo de imagen valido.'
    avatarForm.value.file = null
    event.target.value = ''
    clearAvatarPreview()
    return
  }

  clearAvatarPreview()
  avatarForm.value.file = file
  avatarForm.value.previewUrl = URL.createObjectURL(file)
}

const handleOpenAvatarPicker = () => {
  avatarInputRef.value?.click()
}

const handleSaveAvatar = async () => {
  if (!user.value?.id) {
    storeSettings.setStatusMessage('No se encontro usuario autenticado para actualizar avatar.')
    return
  }

  if (!avatarForm.value.file) {
    avatarError.value = 'Selecciona una imagen antes de continuar.'
    return
  }

  const success = await storeAuth.updateAvatar(user.value.id, { file: avatarForm.value.file })
  if (success) {
    avatarError.value = null
    avatarForm.value.file = null
    clearAvatarPreview()
    storeSettings.setStatusMessage('Avatar actualizado correctamente.')
    return
  }

  storeSettings.setStatusMessage(storeAuth.errorMessage || 'No se pudo actualizar el avatar.')
}

onBeforeUnmount(() => {
  clearAvatarPreview()
})

const handleInitialProfile = () => {
  if (!user.value) return
  profile.value = mapperSettingProfileForm(user.value)
}

onMounted(() => {
  handleInitialProfile()
})
</script>

<template>
  <section class="space-y-6">
    <section class="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900/60">
      <h1 class="text-2xl font-bold">Configuracion de Seguridad</h1>
      <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
        Gestion de autenticacion de dos factores (2FA/MFA) y sesiones por dispositivo.
      </p>
      <p class="mt-2 text-xs text-cyan-700 dark:text-cyan-300">{{ statusMessage }}</p>
    </section>

    <TabsComponent
      :tabs="tabs"
      :active-tab="activeTab"
      :on-tab-change="handleTabChange"
    />

    <section v-if="showAccountTab" class="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900/60">
      <h2 class="text-lg font-semibold">Informacion de la cuenta</h2>
      <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
        Actualiza tus datos personales asociados a la cuenta.
      </p>

      <div class="mt-4 flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 p-4 dark:border-white/10">
        <div class="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-lg font-semibold text-slate-700 ring-2 ring-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:ring-slate-700">
          <img
            v-if="avatarDisplayUrl"
            :src="avatarDisplayUrl"
            alt="Vista previa del avatar"
            class="h-full w-full object-cover"
          >
          <span v-else>{{ avatarInitials }}</span>
        </div>

        <div class="min-w-[260px] flex-1">
          <p class="text-sm font-semibold text-slate-700 dark:text-slate-200">Avatar</p>
          <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            JPG, PNG o WEBP. Maximo recomendado: 2MB.
          </p>

          <input
            ref="avatarInputRef"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleAvatarFileChange"
          >

          <div class="mt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              class="rounded-lg border border-cyan-500 px-3 py-2 text-sm font-semibold text-cyan-700 hover:bg-cyan-50 dark:border-cyan-300/60 dark:text-cyan-300 dark:hover:bg-cyan-900/20"
              @click="handleOpenAvatarPicker"
            >
              Seleccionar imagen
            </button>
            <p class="truncate text-sm text-slate-600 dark:text-slate-300">
              {{ avatarForm.file?.name || 'Sin archivo seleccionado' }}
            </p>
          </div>

          <p v-if="avatarError" class="mt-1 text-xs text-rose-600 dark:text-rose-400">
            {{ avatarError }}
          </p>
        </div>

        <div class="ml-auto">
          <button
            type="button"
            class="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="updateAvatarSubmitting"
            @click="handleSaveAvatar"
          >
            {{ updateAvatarSubmitting ? 'Subiendo...' : 'Actualizar avatar' }}
          </button>
        </div>
      </div>

      <div class="mt-4 grid gap-4 md:grid-cols-2">
        <InputComponent
          :model-value="profile.firstName"
          label="Nombre"
          type="text"
          :error="profileErrors.firstName"
          :on-value-change="handleFirstNameValue"
          :on-validation="onProfileValidation('firstName')"
          required
        />

        <InputComponent
          :model-value="profile.lastName"
          label="Apellido"
          type="text"
          :error="profileErrors.lastName"
          :on-value-change="handleLastNameValue"
          :on-validation="onProfileValidation('lastName')"
          required
        />

        <InputComponent
          :model-value="profile.email"
          label="Email"
          type="email"
          :error="profileErrors.email"
          :on-value-change="handleEmailValue"
          :on-validation="onProfileValidation('email')"
          required
        />

        <InputComponent
          :model-value="profile.phoneNumber"
          label="Telefono"
          type="tel"
          placeholder="+56912345678"
          :error="profileErrors.phoneNumber"
          :on-value-change="handlePhoneNumberValue"
          :on-validation="onProfileValidation('phoneNumber')"
          required
        />
      </div>

      <div class="mt-4">
        <button
          type="button"
          class="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="updateProfileSubmitting"
          @click="handleSaveProfile"
        >
          {{ updateProfileSubmitting ? 'Guardando...' : 'Guardar cambios' }}
        </button>
      </div>
    </section>

    <section v-if="showMfaTab" class="grid gap-6 lg:grid-cols-2">
      <article class="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900/60">
        <h2 class="text-lg font-semibold">Estado de MFA</h2>
        <p class="mt-2 text-sm">
          Estado actual:
          <strong :class="mfaStatusClass">{{ mfaStatusLabel }}</strong>
        </p>
        <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">Metodo: {{ mfaState.method }}</p>
        <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Ultima verificacion: {{ mfaState.lastVerification }}
        </p>
        <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Verificado: {{ mfaState.verified ? 'Si' : 'No' }}
        </p>

        <div class="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            class="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            @click="handleEnableMfa"
          >
            Habilitar MFA
          </button>
          <button
            type="button"
            class="rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-700"
            @click="handleDisableMfa"
          >
            Deshabilitar MFA
          </button>
          <button
            type="button"
            class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold hover:border-cyan-500 dark:border-slate-700 dark:bg-slate-900"
            @click="handleVerifyMfa"
          >
            Verificar estado MFA
          </button>
        </div>
      </article>

      <article class="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900/60">
        <h2 class="text-lg font-semibold">Setup de 2FA</h2>
        <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Flujo recomendado para onboarding seguro de doble factor.
        </p>

        <ul class="mt-4 space-y-2 text-sm">
          <li v-for="step in mfaSetupSteps" :key="step" class="rounded-lg border border-slate-200 px-3 py-2 dark:border-white/10">
            {{ step }}
          </li>
        </ul>

        <div class="mt-4 rounded-lg border border-dashed border-cyan-300 bg-cyan-50 px-3 py-2 text-xs text-cyan-800 dark:border-cyan-400/30 dark:bg-cyan-900/20 dark:text-cyan-200">
          Mock: en integracion real aqui va QR secret, code input y endpoint de verificacion.
        </div>
      </article>
    </section>

    <section v-if="showMfaTab" class="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900/60">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 class="text-lg font-semibold">Sesiones por Dispositivo</h2>
          <p class="text-sm text-slate-600 dark:text-slate-300">
            Sesiones activas: {{ activeSessions }}
          </p>
        </div>
        <button
          type="button"
          class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold hover:border-cyan-500 dark:border-slate-700 dark:bg-slate-900"
          @click="handleLogoutAllOtherDevices"
        >
          Desloguear otros dispositivos
        </button>
      </div>

      <div class="mt-4 space-y-3">
        <article
          v-for="device in devices"
          :key="device.id"
          class="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 px-3 py-3 dark:border-white/10"
        >
          <div>
            <p class="text-sm font-semibold">{{ device.name }}</p>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              {{ device.location }} · {{ device.lastSeen }}
              <span v-if="device.current" class="ml-1 font-semibold text-emerald-600 dark:text-emerald-400">(Actual)</span>
            </p>
          </div>
          <button
            type="button"
            class="rounded-lg px-3 py-2 text-xs font-semibold"
            :class="device.current ? 'border border-slate-300 text-slate-500 dark:border-slate-700 dark:text-slate-400' : 'bg-rose-600 text-white hover:bg-rose-700'"
            @click="handleLogoutDevice(device.id)"
          >
            Desloguear dispositivo
          </button>
        </article>
      </div>
    </section>
  </section>
</template>
