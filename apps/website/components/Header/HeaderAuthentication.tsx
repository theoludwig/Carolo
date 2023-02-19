'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

import { Button } from '@/components/Button'
import { useAuthentication } from '@/stores/authentication'
import { useClickOutsideAlerter } from '@/hooks/useClickOutsideAlerter'

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
          className='rounded-xl !py-[2px] !px-6 !text-base'
          href='/authentication/signin'
        >
          Connexion
        </Button>
        <Button
          variant='dark'
          className='rounded-xl !py-[2px] !px-6 !text-base'
          href='/authentication/signup'
        >
          Inscription
        </Button>
      </div>
    )
  }

  return (
    <div
      className='relative flex min-w-[150px] flex-col items-center rounded-md bg-[#272522] px-2 py-1'
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
        <Image
          className='h-12 w-12 rounded-full'
          quality={100}
          src={user.logo ?? '/data/user-default.png'}
          width={64}
          height={64}
          alt='User logo'
        />
        <h2 className='font-bold'>{user.name}</h2>
      </div>
      {isOpen ? (
        <div className='absolute top-[100%] right-0 flex w-full flex-col space-y-2 rounded-md bg-[#272522] p-3'>
          <Button
            href='/users/settings'
            className='!py-[2px] !px-0 !text-base'
            variant='white'
            onClick={() => {
              setIsOpen(false)
            }}
          >
            Paramètres
          </Button>
          <Button
            href={`/users/${user.id}`}
            className='!py-[2px] !px-0 !text-base'
            variant='purple'
            onClick={() => {
              setIsOpen(false)
            }}
          >
            Profil
          </Button>
          <Button
            className='!py-[2px] !px-0 !text-base'
            variant='red'
            onClick={async () => {
              setIsOpen(false)
              await authentication.signoutServerSide()
              router.refresh()
              router.replace('/')
            }}
          >
            Déconnexion
          </Button>
        </div>
      ) : null}
    </div>
  )
}
