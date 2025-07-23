import type { Form, FormErrorEvent } from '#ui/types'
import type { z } from 'zod'
import consola from 'consola'

export type FieldType =
  | 'text' | 'textarea' | 'email' | 'tel' | 'date' | 'time'
  | 'select' | 'switch' | 'number' | 'radio' | 'button-group'
  | 'section' | 'divider' | 'custom'

export interface FormField {
  name?: string // Not required for 'section' or 'divider'
  label?: string
  description?: string
  help?: string
  hint?: string
  type: FieldType
  component?: string // For custom components
  placeholder?: string
  options?: Array<{ icon?: string, class?: string | string[], label: string, value: string | number | boolean, color?: string, size?: 'sm' | 'md' | 'lg' }>
  required?: boolean
  multiple?: boolean
  hidden?: boolean | ((state: any) => boolean)
  attrs?: Record<string, unknown>
  transform?: (value: unknown) => unknown
  validate?: (value: unknown) => string | true
  dependsOn?: string[] | ((state: any) => boolean)
  group?: string // Group/section name
  fields?: FormField[] // For 'section' type
  colSpan?: number // For grid layouts
  divider?: boolean // For visual dividers
}

export interface UseFormOptions<T extends z.ZodType> {
  schema: T
  fields: FormField[] | ComputedRef<FormField[]> | Ref<FormField[]>
  collapsedFields?: FormField[] | ComputedRef<FormField[]> | Ref<FormField[]>
  initialState?: Partial<z.infer<T>>
  onSubmit: (state: z.infer<T>) => Promise<void> | void
  onSuccess?: () => void
  showSuccessMessage?: boolean
  successMessage?: string
  transformBeforeSubmit?: (state: z.infer<T>) => unknown
  layout?: 'vertical' | 'horizontal' | 'inline'
  submitButtonText?: string
  submitButtonProps?: Record<string, unknown>
  showSubmitButton?: boolean
}

export interface FormContext<T extends z.ZodType> {
  schema: T
  form: Ref<Form<T> | undefined>
  state: z.infer<T> & { [key: string]: unknown }
  fields: ComputedRef<FormField[]>
  collapsedFields: ComputedRef<FormField[]>
  asyncStatus: Ref<'idle' | 'loading' | 'error'>
  handleSubmit: () => Promise<void>
  handleError: (event: FormErrorEvent) => void
  setFormErrors: (errors: Array<{ name: string, message: string }>) => void
  resetForm: (options?: { keepInitialState?: boolean }) => void
  setFieldValue: (name: string, value: unknown) => void
  layout: 'vertical' | 'horizontal' | 'inline'
  submitButtonText: string
  submitButtonProps: Record<string, unknown>
  showSubmitButton: boolean
}

interface FormError extends Error {
  statusMessage?: string
}

export function useForm<T extends z.ZodType>({
  schema,
  fields,
  collapsedFields,
  initialState = {},
  onSubmit,
  onSuccess,
  showSuccessMessage = true,
  successMessage = 'Başarıyla kaydedildi',
  transformBeforeSubmit,
  layout = 'vertical',
  submitButtonText = 'common.save',
  submitButtonProps = {},
  showSubmitButton = true,
}: UseFormOptions<T>): FormContext<T> {
  const toast = useToast()
  const form = ref<Form<T>>()
  const asyncStatus = ref<'idle' | 'loading' | 'error'>('idle')

  const state = reactive<z.infer<T> & { [key: string]: unknown }>(
    initialState as z.infer<T> & { [key: string]: unknown },
  )

  const fieldsRef = computed(() => {
    if (isRef(fields)) {
      return fields.value
    }
    return fields
  })

  const collapsedFieldsRef = computed(() => {
    if (isRef(collapsedFields)) {
      return collapsedFields.value ?? [] as FormField[]
    }
    return collapsedFields as FormField[]
  })

  // Watch for changes in fields with dependencies
  watch(
    () => ({ ...state }),
    () => {
      fieldsRef.value.forEach((field) => {
        if (field.dependsOn?.length && field.name) {
          const shouldClear = Array.isArray(field.dependsOn)
            ? field.dependsOn?.some((dependency) => {
              const dependencyValue = state[dependency]
              return dependencyValue === undefined
                || dependencyValue === null
                || dependencyValue === ''
                || dependencyValue === false
            })
            : field.dependsOn(state)

          if (shouldClear && field.name && state[field.name] !== undefined) {
            state[field.name] = undefined
          }
        }
      })
    },
    {
      deep: true,
      immediate: true,
    },
  )

  async function handleSubmit() {
    try {
      asyncStatus.value = 'loading'
      consola.log('HANDLE SUBMIT STATE', state)
      const data = transformBeforeSubmit && typeof transformBeforeSubmit === 'function' ? transformBeforeSubmit(state) : state
      await onSubmit(data)

      if (showSuccessMessage) {
        toast.add({
          description: successMessage,
          color: 'success',
          icon: 'i-lucide-circle-check',
        })
      }

      onSuccess?.()
      asyncStatus.value = 'idle'
    }
    catch (error) {
      asyncStatus.value = 'error'
      const errorMessage = (error as FormError)?.statusMessage || (error as FormError)?.message

      if (errorMessage === 'emailAlreadyTaken') {
        form.value?.setErrors([
          {
            name: 'email',
            message: 'E-posta zaten alınmış',
          },
        ])
      }

      toast.add({
        description: errorMessage,
        color: 'error',
        icon: 'i-lucide-shield-alert',
      })
    }
  }

  function handleError(event: FormErrorEvent) {
    const element = document.getElementById(event.errors[0]?.id as string)
    element?.focus()
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  function setFormErrors(errors: Array<{ name: string, message: string }>) {
    form.value?.setErrors(errors)
  }

  function resetForm(options?: { keepInitialState?: boolean }) {
    // Clear all existing values first
    Object.keys(state).forEach((key) => {
      state[key] = undefined
    })

    // Then set initial values
    if (options?.keepInitialState) {
      Object.entries(initialState).forEach(([key, value]) => {
        state[key] = value
      })
    }

    form.value?.clear()
  }

  function setFieldValue(name: string, value: unknown) {
    if (name) {
      state[name] = value
    }
  }

  return {
    schema,
    form,
    state,
    fields: fieldsRef,
    collapsedFields: collapsedFieldsRef,
    asyncStatus,
    handleSubmit,
    handleError,
    setFormErrors,
    resetForm,
    setFieldValue,
    layout,
    submitButtonText,
    submitButtonProps,
    showSubmitButton,
  }
}
