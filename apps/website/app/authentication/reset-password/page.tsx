'use client'

import { useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Form, useForm } from 'react-component-form'
import type { HandleUseFormCallback } from 'react-component-form'
import axios from 'axios'
import { userSchema } from '@carolo/models'

import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { FormState } from '@/components/FormState'
import { errorsMessages, useFormTranslation } from '@/hooks/useFormTranslation'
import { api } from '@/lib/configurations'

const ResetPasswordPage = (): JSX.Element => {
  const router = useRouter()

  const searchParams = useSearchParams()
  const temporaryToken = searchParams?.get('temporaryToken')

  const schema = useMemo(() => {
    return {
      password: userSchema.password
    }
  }, [])

  const { handleUseForm, errors, fetchState, message } = useForm(schema)
  const { getFirstErrorTranslation } = useFormTranslation()

  const onSubmit: HandleUseFormCallback<typeof schema> = async (formData) => {
    try {
      await api.put('/users/reset-password', {
        ...formData,
        temporaryToken
      })
      router.push('/authentication/signin')
      return null
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        return {
          type: 'error',
          value: errorsMessages.invalid
        }
      }
      return {
        type: 'error',
        value: 'Erreur interne du serveur.'
      }
    }
  }

  return (
    <div className='flex w-8/12 max-w-sm flex-col items-center justify-center sm:w-5/12'>
      <Form className='w-full' noValidate onSubmit={handleUseForm(onSubmit)}>
        <Input
          type='password'
          name='password'
          label='Nouveau mot de passe'
          error={getFirstErrorTranslation(errors.password)}
        />

        <div className='mt-4'>
          <Button type='submit' variant='purple' className='w-full'>
            Envoyer
          </Button>
        </div>
      </Form>
      <FormState
        id='message'
        state={fetchState}
        message={message != null ? message : undefined}
      />
    </div>
  )
}

export default ResetPasswordPage
