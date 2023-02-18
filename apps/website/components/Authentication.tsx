'use client'

import { useMemo } from 'react'
import { Form, useForm } from 'react-component-form'
import type { HandleUseFormCallback } from 'react-component-form'
import axios from 'axios'
import { userSchema } from '@carolo/models'

import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Link } from '@/components/Link'
import { FormState } from '@/components/FormState'
import { useFormTranslation } from '@/hooks/useFormTranslation'
import { api } from '@/lib/configurations'

export interface AuthenticationProps {
  mode: 'signup' | 'signin'
}

export const Authentication = (props: AuthenticationProps): JSX.Element => {
  const { mode } = props

  const schema = useMemo(() => {
    return {
      ...(mode === 'signup' && { name: userSchema.name }),
      email: userSchema.email,
      password: userSchema.password
    }
  }, [mode])

  const { handleUseForm, errors, fetchState, message } = useForm(schema)
  const { getFirstErrorTranslation } = useFormTranslation()

  const onSubmit: HandleUseFormCallback<typeof schema> = async (
    formData,
    formElement
  ) => {
    if (mode === 'signup') {
      try {
        const searchParams = new URLSearchParams()
        searchParams.set(
          'redirectURI',
          `${window.location.origin}/authentication/signin`
        )
        await api.post(`/users/signup?${searchParams.toString()}`, {
          ...formData,
          language: 'fr'
        })
        formElement.reset()
        return {
          type: 'success',
          value:
            'Vous y êtes presque, veuillez vérifier vos emails pour confirmer votre inscription.'
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 400) {
          const message: string = error.response.data.message
          if (message.endsWith('already taken')) {
            return {
              type: 'error',
              value: 'Pseudo ou Adresse courriel est déjà utilisée.'
            }
          }
        }
        return {
          type: 'error',
          value: 'Erreur interne du serveur.'
        }
      }
    }

    return {
      type: 'error',
      value: 'Erreur interne du serveur.'
    }
  }

  return (
    <>
      <div className='mt-4'>
        <h2 className='text-2xl font-bold'>
          {mode === 'signup' ? 'Inscrivez-vous !' : 'Connectez-vous !'}
        </h2>
      </div>

      <div className='flex w-8/12 max-w-sm flex-col items-center justify-center sm:w-5/12'>
        <Form className='w-full' noValidate onSubmit={handleUseForm(onSubmit)}>
          {mode === 'signup' ? (
            <Input
              type='text'
              name='name'
              label='Pseudo'
              error={getFirstErrorTranslation(errors.name)}
            />
          ) : null}

          <Input
            type='email'
            name='email'
            label='Adresse courriel'
            error={getFirstErrorTranslation(errors.email)}
          />

          <Input
            type='password'
            name='password'
            label='Mot de passe'
            showForgotPassword={mode === 'signin'}
            error={getFirstErrorTranslation(errors.password)}
          />

          <div className='mt-4 flex flex-col items-center'>
            <Button type='submit' variant='secondary'>
              {mode === 'signup' ? 'Inscription' : 'Connexion'}
            </Button>
          </div>
        </Form>

        <FormState
          id='message'
          state={fetchState}
          message={message != null ? message : undefined}
        />
      </div>

      <hr className='mx-auto my-6 h-[2px] w-48 rounded border-0 bg-[#3D3B39] sm:w-96' />

      <div className='mb-4 text-center'>
        <h2 className='text-2xl font-bold'>
          {mode === 'signup'
            ? 'Vous avez déjà un compte ?'
            : 'Vous êtes nouveaux ?'}
        </h2>
        <div className='mt-4 flex flex-col items-center'>
          <Button
            href={
              mode === 'signup'
                ? '/authentication/signin'
                : '/authentication/signup'
            }
            variant='secondary'
          >
            {mode === 'signup' ? 'Connexion' : 'Inscription'}
          </Button>
        </div>

        <p className='mt-6 text-center text-xs'>
          <Link href='/'>Conditions générales d{"'"}utilisation</Link> et{' '}
          <Link href='/'>Politique de confidentialité</Link>
        </p>
      </div>
    </>
  )
}
