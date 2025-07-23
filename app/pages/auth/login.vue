<script setup lang="ts">
import type { FormError } from '#ui/types'
import { consola } from 'consola'
import { z } from 'zod'

// Page Layout
definePageMeta({
  layout: 'auth',
})

// Notifications
const toast = useToast()

// Router
const router = useRouter()
const route = useRoute()

const stage = ref<'send-code' | 'verify-code'>('send-code')

// Form
const form = useTemplateRef('form')

// Form Schema
const schema = z.object({
  email: z.string({
    required_error: 'Email is required',
  }).email({
    message: 'Invalid email address',
  }),
})

type Schema = z.infer<typeof schema> & { otp: [] }

const state = reactive<Schema>({
  email: '',
  otp: [],
})

const isLoading = ref(false)

const auth = useAuth()

// Add function to handle email change
function onEmailChange() {
  stage.value = 'send-code'
  state.otp = []
  router.replace({ query: {} })
}

async function onSendCode() {
  isLoading.value = true

  const sent = await auth.client.emailOtp.sendVerificationOtp({
    email: state.email,
    type: 'sign-in',
  })

  if (sent.error) {
    // TODO: Handle error
    toast.add({
      title: 'Hata',
      description: 'Lütfen daha sonra tekrar deneyiniz',
      color: 'error',
    })

    isLoading.value = false
    return
  }

  stage.value = 'verify-code'
  router.replace({ query: { email: state.email, type: stage.value } })
  isLoading.value = false
}

async function onVerifyCode(): Promise<FormError[] | undefined> {
  form.value?.clear()
  isLoading.value = true

  const user = await auth.signIn.emailOtp({
    email: state.email,
    otp: state.otp.join(''),
  })

  if (user.error) {
    // TODO: Handle error
    const errors: FormError[] = []

    consola.error(user)

    errors.push({
      name: 'otp',
      message: 'Invalid verification code',
    })

    form.value?.setErrors(errors)

    isLoading.value = false

    return errors
  }

  navigateTo('/')

  isLoading.value = false
}

onBeforeMount(() => {
  if (route.query.email && route.query.type) {
    state.email = route.query.email as string
    stage.value = route.query.type as 'send-code' | 'verify-code'

    if (stage.value === 'verify-code') {
      form.value?.clear()

      // Set state
      state.email = route.query.email as string
      state.otp = []
    }
  }
})
</script>

<template>
  <div class="max-w-md w-full border border-neutral-200 rounded-lg bg-white p-4 shadow-sm space-y-2 dark:border-neutral-800 dark:bg-neutral-900">
    <h1 class="text-2xl font-bold">
      Nexus
    </h1>
    <p class="text-sm text-neutral-500">
      Welcome to Nexus!
    </p>

    <UForm
      ref="form"
      :schema="schema"
      :state="state"
      :validate-on="['change']"
      class="space-y-4"
      @submit="stage === 'send-code' ? onSendCode() : onVerifyCode()"
    >
      <template v-if="stage === 'send-code'">
        <UFormField label="Email" name="email">
          <UInput
            v-model="state.email"
            type="email"
            placeholder="Enter your email address"
            autofocus
            autocomplete="off"
            class="w-full"
          />
        </UFormField>
      </template>

      <template v-if="stage === 'verify-code'">
        <div class="my-6 space-y-2">
          <UFormField label="Verification Code" name="otp">
            <UPinInput
              v-model="state.otp"
              otp
              autofocus
              required
              size="xl"
              placeholder="○"
              type="number"
              :length="6"
              @complete="() => onVerifyCode()"
            />
          </UFormField>

          <p class="text-sm text-neutral-500 font-normal">
            Verification code sent to <span class="text-neutral-900 font-semibold dark:text-neutral-400">{{ state.email }}</span>
          </p>
        </div>
      </template>

      <div class="flex flex-col justify-between gap-2 sm:flex-row">
        <div class="flex gap-2">
          <UButton
            type="submit"
            :label="stage === 'send-code' ? 'Send Code' : 'Login'"
            :loading="isLoading"
          />

          <UButton
            v-if="stage === 'verify-code'"
            type="button"
            variant="link"
            label="Resend Code"
            :loading="isLoading"
            @click="onSendCode()"
          />
        </div>

        <UButton
          v-if="stage === 'verify-code'"
          type="button"
          variant="ghost"
          color="neutral"
          label="Change Email"
          @click="onEmailChange()"
        />
      </div>
    </UForm>
  </div>
</template>
