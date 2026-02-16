<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import QRCode from 'qrcode'
import { InputComponent, ButtonComponent, TabsComponent } from '@/components'
import { useFormValidation } from '@/composables'
import { initialUpdateAvatarForm, initialUpdateProfileForm } from '@/factories'
import { settingsUpdateProfileValidationRules } from '@/rules'
import { mapperSettingProfileForm, mapperUpdateProfilePayload } from '@/mappers'
import { useStoreAuth, useStoreSettings } from '@/stores'

const storeAuth = useStoreAuth()
const storeSettings = useStoreSettings()
const { user, updateProfileSubmitting, updateAvatarSubmitting } = storeToRefs(storeAuth)
const {
  mfaState,
  mfaSetupData,
  mfaVerificationCode,
  statusMessage,
  devices,
  mfaSetupSteps,
  tabs,
  activeTab,
  activeSessions,
  mfaStatusLabel,
  mfaStatusClass,
  loadingMfaAction,
  loadingSessions,
  loadingLogoutDevice,
} = storeToRefs(storeSettings)

const profile = ref({ ...initialUpdateProfileForm })
const avatarForm = ref({ ...initialUpdateAvatarForm })
const avatarError = ref<string | null>(null)
const avatarInputRef = ref<HTMLInputElement | null>(null)
const mfaQrImage = ref('')
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
const currentUsername = computed(() => user.value?.username || '')
const currentEmail = computed(() => user.value?.email || '')
const buildOtpAuthUriFromSecret = (secret: string, username: string) => {
  const issuer = 'CRM'
  const encodedIssuer = encodeURIComponent(issuer)
  const encodedUser = encodeURIComponent(username || 'user')
  return `otpauth://totp/${encodedIssuer}:${encodedUser}?secret=${encodeURIComponent(secret)}&issuer=${encodedIssuer}`
}

const resolveMfaQrValue = () => {
  const value = mfaSetupData.value.otpauthUri || mfaSetupData.value.qrCodeUrl
  if (value) return value
  const secret = mfaSetupData.value.secret
  if (secret) return buildOtpAuthUriFromSecret(secret, currentUsername.value)
  return value || ''
}

const buildMfaQrImage = async () => {
  const value = resolveMfaQrValue()
  if (!value) {
    mfaQrImage.value = ''
    return
  }

  if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:image/')) {
    mfaQrImage.value = value
    return
  }

  try {
    mfaQrImage.value = await QRCode.toDataURL(value, {
      width: 220,
      margin: 1,
      errorCorrectionLevel: 'M',
    })
  } catch {
    mfaQrImage.value = ''
  }
}

const handleEnableMfa = async () => {
  const success = await storeSettings.enableMfa(currentUsername.value)
  if (!success) return
  await buildMfaQrImage()
}
const handleDisableMfa = async () => storeSettings.disableMfa(currentUsername.value)
const handleVerifyMfa = async () => storeSettings.verifyMfa(currentUsername.value)
const handleLogoutDevice = async (id: string) => storeSettings.logoutDevice(currentUsername.value, id)
const handleLogoutAllOtherDevices = async () => storeSettings.logoutAllOtherDevices(currentUsername.value)
const handleTabChange = (tab: 'account' | 'mfa') => {
  storeSettings.setActiveTab(tab)
}
const handleMfaCodeValue = (value: string) => storeSettings.setMfaVerificationCode(value)
const handleCopySecret = async () => {
  if (!mfaSetupData.value.secret) return
  try {
    await navigator.clipboard.writeText(mfaSetupData.value.secret)
    storeSettings.setStatusMessage('Secret copiado al portapapeles.')
  } catch {
    storeSettings.setStatusMessage('No se pudo copiar el secret.')
  }
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

  const payload = mapperUpdateProfilePayload(user.value.id, profile.value)
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

onMounted(async () => {
  await storeAuth.getCurrentUser()
  handleInitialProfile()
  await storeSettings.loadMfaAndSessions(currentUsername.value, currentEmail.value)
  await buildMfaQrImage()
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
            <ButtonComponent
              variant="outline"
              size="md"
              label="Seleccionar imagen"
              class-name="border-cyan-500 text-cyan-700 dark:border-cyan-300/60 dark:text-cyan-300 dark:hover:bg-cyan-900/20"
              :on-click="handleOpenAvatarPicker"
            />
            <p class="truncate text-sm text-slate-600 dark:text-slate-300">
              {{ avatarForm.file?.name || 'Sin archivo seleccionado' }}
            </p>
          </div>

          <p v-if="avatarError" class="mt-1 text-xs text-rose-600 dark:text-rose-400">
            {{ avatarError }}
          </p>
        </div>

        <div class="ml-auto">
          <ButtonComponent
            variant="primary"
            :disabled="updateAvatarSubmitting"
            :label="updateAvatarSubmitting ? 'Subiendo...' : 'Actualizar avatar'"
            :on-click="handleSaveAvatar"
          />
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
        <ButtonComponent
          variant="primary"
          :disabled="updateProfileSubmitting"
          :label="updateProfileSubmitting ? 'Guardando...' : 'Guardar cambios'"
          :on-click="handleSaveProfile"
        />
      </div>
    </section>

    <section v-if="showMfaTab" class="grid items-start gap-6 lg:grid-cols-2">
      <article class="self-start overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900/60">
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
          <ButtonComponent
            v-if="!mfaState.enabled"
            variant="success"
            :disabled="loadingMfaAction"
            :label="loadingMfaAction ? 'Procesando...' : 'Iniciar setup MFA'"
            :on-click="handleEnableMfa"
          />
          <ButtonComponent
            v-if="mfaState.enabled"
            variant="danger"
            :disabled="loadingMfaAction"
            label="Deshabilitar MFA"
            :on-click="handleDisableMfa"
          />
        </div>

        <div v-if="!mfaState.enabled" class="mt-4">
          <InputComponent
            :model-value="mfaVerificationCode"
            label="Codigo MFA"
            type="text"
            placeholder="123456"
            :on-value-change="handleMfaCodeValue"
          />
        </div>

        <div v-if="!mfaState.enabled" class="mt-3 flex flex-wrap gap-2">
          <ButtonComponent
            variant="outline"
            :disabled="loadingMfaAction"
            label="Verificar codigo MFA"
            :on-click="handleVerifyMfa"
          />
        </div>
      </article>

      <article class="self-start rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900/60">
        <h2 class="text-lg font-semibold">Setup de 2FA</h2>
        <div class="mt-2 flex flex-col gap-3 lg:flex-nowrap lg:flex-row lg:items-start lg:gap-4">
          <div class="min-w-0 flex-1">
            <p class="text-sm text-slate-600 dark:text-slate-300">
              Flujo recomendado para onboarding seguro de doble factor.
            </p>

            <ol class="mt-1 list-none space-y-2.5 text-sm text-slate-300">
              <li class="rounded-lg border border-slate-700/70 px-3 py-2">
                <span class="mr-2 font-semibold text-slate-200">1.</span>
                <span>Instala Google Authenticator, Microsoft Authenticator o Authy.</span>
              </li>
              <li class="rounded-lg border border-slate-700/70 px-3 py-2">
                <span class="mr-2 font-semibold text-slate-200">2.</span>
                <span>Escanea el QR de configuracion de 2FA.</span>
              </li>
              <li class="rounded-lg border border-slate-700/70 px-3 py-2">
                <span class="mr-2 font-semibold text-slate-200">3.</span>
                <span>Ingresa el codigo de 6 digitos para confirmar setup.</span>
              </li>
            </ol>
          </div>

          <div class="w-full max-w-[12.5rem] lg:shrink-0">
              <div v-if="mfaQrImage" class="rounded-xl border border-cyan-300/40 bg-cyan-50/70 p-3 dark:border-cyan-400/30 dark:bg-cyan-900/20">
                <img
                  :src="mfaQrImage"
                  alt="QR de configuracion MFA"
                  class="mx-auto h-44 w-44 rounded-lg border border-slate-200 bg-white p-2 shadow-sm dark:border-white/10 dark:bg-slate-900"
                >
              </div>
              <div v-else class="rounded-xl border border-dashed border-slate-300 px-3 py-10 text-center text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
                Inicia setup MFA para generar QR
              </div>

              <div v-if="mfaSetupData.secret" class="mt-3">
                <p class="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">Secret</p>
                <code class="block break-all rounded-md bg-slate-900 px-2 py-1 text-xs text-cyan-300">{{ mfaSetupData.secret }}</code>
              </div>
          </div>
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
        <ButtonComponent
          variant="outline"
          :disabled="loadingSessions || loadingLogoutDevice"
          label="Desloguear otros dispositivos"
          :on-click="handleLogoutAllOtherDevices"
        />
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
          <ButtonComponent
            :variant="device.current ? 'subtle' : 'danger'"
            size="sm"
            :disabled="loadingLogoutDevice"
            label="Desloguear dispositivo"
            :on-click="() => handleLogoutDevice(device.id)"
          />
        </article>
      </div>
    </section>
  </section>
</template>
