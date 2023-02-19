'use client'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/Button'
import { useAuthentication } from '@/stores/authentication'

export const HeaderAuthentication = (): JSX.Element => {
  const { authenticated, user, authentication } = useAuthentication()
  const router = useRouter()

  return (
    <div className='flex flex-col space-y-2'>
      {authenticated ? (
        <p
          onClick={() => {
            authentication.signout()
            router.replace('/')
          }}
        >
          {user.name}
        </p>
      ) : (
        <>
          <Button
            variant='primary'
            className='rounded-xl !py-[2px] !px-6 !text-base'
            href='/authentication/signin'
          >
            Connexion
          </Button>
          <Button
            variant='tertiary'
            className='rounded-xl !py-[2px] !px-6 !text-base'
            href='/authentication/signup'
          >
            Inscription
          </Button>
        </>
      )}
    </div>
  )
}
