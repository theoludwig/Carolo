'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import axios from 'axios'
import { Form, useForm } from 'react-component-form'
import type { HandleUseFormCallback } from 'react-component-form'
import type { UserCurrent } from '@carolo/models'
import { userSchema } from '@carolo/models'

import { useAuthentication } from '@/stores/authentication'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import { FormState } from '@/components/FormState'
import { useFormTranslation } from '@/hooks/useFormTranslation'

export const UserSettings = (): JSX.Element => {
  const { authenticated, user, authentication, updateUser } =
    useAuthentication()

  const [logo] = useState(user?.logo)

  const schema = useMemo(() => {
    return {
      name: userSchema.name,
      email: userSchema.email
    }
  }, [])

  const { handleUseForm, errors, fetchState, message } = useForm(schema)
  const { getFirstErrorTranslation } = useFormTranslation()

  const onSubmit: HandleUseFormCallback<typeof schema> = async (formData) => {
    if (!authenticated) {
      return null
    }
    try {
      const searchParams = new URLSearchParams()
      searchParams.set(
        'redirectURI',
        `${window.location.origin}/authentication/signin`
      )
      const { data } = await authentication.api.put<UserCurrent>(
        `/users/current?${searchParams.toString()}`,
        formData
      )

      const hasEmailChanged = data.user.email !== user.email
      if (hasEmailChanged) {
        authentication.signout()
        return {
          type: 'success',
          message:
            'Veuillez vérifier vos emails pour confirmer votre nouvelle adresse email. Vous êtes maintenant déconnecté.'
        }
      }

      updateUser(data.user)
      return {
        type: 'success',
        message: 'Vos informations ont été mises à jour.'
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        const message: string = error.response.data.message
        if (message.endsWith('already taken')) {
          return {
            type: 'error',
            message: 'Pseudo ou Email déjà utilisée.'
          }
        }
      }
      return {
        type: 'error',
        message: 'interne du serveur.'
      }
    }
  }

  return (
    <div className='flex w-8/12 max-w-sm flex-col items-center justify-center sm:w-5/12'>
      <Form noValidate onSubmit={handleUseForm(onSubmit)}>
        <a
          href='https://gravatar.com/'
          target='_blank'
          rel='noopener noreferrer'
          className='relative cursor-pointer'
        >
          <div className='absolute z-50 flex h-full w-full items-center justify-center hover:scale-110'>
            <Image
              className='h-8 w-8'
              quality={100}
              src='/icons/photo.svg'
              alt='Photo icon'
              height={40}
              width={40}
            />
          </div>
          <div className='flex items-center justify-center rounded-full'>
            <Image
              quality={100}
              className='rounded-full opacity-50'
              src={logo ?? '/data/user-default.png'}
              alt='Profil Picture'
              draggable='false'
              width={125}
              height={125}
            />
          </div>
        </a>

        <Input
          type='text'
          name='name'
          label='Pseudo'
          defaultValue={user?.name}
          error={getFirstErrorTranslation(errors.name)}
        />

        <Input
          type='email'
          name='email'
          label='Email'
          defaultValue={user?.email}
          error={getFirstErrorTranslation(errors.email)}
        />

        <div className='mt-4 flex flex-col items-center'>
          <Button type='submit' variant='purple'>
            Sauvegarder
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
