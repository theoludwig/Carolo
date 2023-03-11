'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/Button'
import { useAuthentication } from '@/stores/authentication'
import { useClickOutsideAlerter } from '@/hooks/useClickOutsideAlerter'
import { User } from '@/components/User'

export const HeaderAuthentication = (): JSX.Element => {
  const { authenticated, user, authentication } = useAuthentication()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const popupClickRef = useRef<HTMLDivElement | null>(null)

  useClickOutsideAlerter(popupClickRef, () => {
    return setIsOpen(false)
  })

  if (!authenticated) {
    return (
      <div className='flex flex-col space-y-2'>
        <Button
          variant='white'
          className='rounded-xl !px-6 !py-[2px] !text-base'
          href='/authentication/signin'
        >
          Connexion
        </Button>
        <Button
          variant='dark'
          className='rounded-xl !px-6 !py-[2px] !text-base'
          href='/authentication/signup'
        >
          Inscription
        </Button>
      </div>
    )
  }

  return (
    <div
      className='relative flex min-w-[160px] flex-col items-center rounded-md bg-[#272522] px-2 py-1'
      ref={popupClickRef}
    >
      <div
        className='flex cursor-pointer items-center space-x-2 hover:opacity-80'
        onClick={() => {
          setIsOpen((oldIsOpen) => {
            return !oldIsOpen
          })
        }}
      >
        <User
          className='h-12 w-12'
          user={{
            name: user.name,
            logo: user.logo
          }}
        />
      </div>
      {isOpen ? (
        <div className='absolute right-0 top-[100%] flex w-full flex-col space-y-2 rounded-md bg-[#272522] p-3'>
          <Button
            href='/users/settings'
            icon='/icons/settings.png'
            className='!px-0 !py-[2px] !text-sm'
            variant='white'
            onClick={() => {
              setIsOpen(false)
            }}
          >
            Paramètres
          </Button>
          <Button
            href={`/users/${user.id}`}
            icon='/icons/profile.png'
            className='!px-0 !py-[2px] !text-sm'
            variant='purple'
            onClick={() => {
              setIsOpen(false)
            }}
          >
            Profil
          </Button>
          <Button
            icon='/icons/signout.png'
            className='!px-0 !py-[2px] !text-sm'
            variant='red'
            onClick={async () => {
              setIsOpen(false)
              await authentication.signoutServerSide()
              router.replace('/api/hard-refresh')
            }}
          >
            Déconnexion
          </Button>
        </div>
      ) : null}
    </div>
  )
}
