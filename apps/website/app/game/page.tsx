'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import classNames from 'clsx'
import type { PieceColor } from '@carolo/game'
import type { Services } from '@carolo/models'
import { useFetchState } from 'react-component-form'

import AymonBlack from '@/public/pieces/AYMON_BLACK.png'
import AymonWhite from '@/public/pieces/AYMON_WHITE.png'
import { Button } from '@/components/Button'
import { useAuthentication } from '@/stores/authentication'
import { FormState } from '@/components/FormState'
import { Link } from '@/components/Link'

const GamePage = (): JSX.Element => {
  const [selectedColor, setSelectedColor] = useState<PieceColor>('WHITE')
  const [fetchState, setFetchState] = useFetchState()
  const [message, setMessage] = useState<string | null>(null)
  const { authenticated, authentication } = useAuthentication()
  const router = useRouter()

  return (
    <div className='flex flex-col items-center justify-center rounded-lg bg-[#272522] p-6'>
      <h2 className='mt-2 text-2xl font-bold'>Jouer une partie de Carolo</h2>

      <div className='mt-4 flex space-x-2'>
        <button
          disabled={fetchState === 'loading'}
          type='button'
          className={classNames(
            'h-16 w-16 hover:opacity-80 disabled:cursor-not-allowed',
            {
              'border-2 border-[#8417DA]': selectedColor === 'WHITE'
            }
          )}
          onClick={() => {
            setSelectedColor('WHITE')
          }}
        >
          <Image src={AymonWhite} quality={100} alt='Aymon White' />
        </button>
        <button
          disabled={fetchState === 'loading'}
          type='button'
          className={classNames(
            'h-16 w-16 hover:opacity-80 disabled:cursor-not-allowed',
            {
              'border-2 border-[#8417DA]': selectedColor === 'BLACK'
            }
          )}
          onClick={() => {
            setSelectedColor('BLACK')
          }}
        >
          <Image src={AymonBlack} quality={100} alt='Aymon Black' />
        </button>
      </div>

      <div className='mt-4 flex space-x-4'>
        <Button
          variant='purple'
          className='!px-6 !py-2 !text-base disabled:cursor-not-allowed disabled:opacity-50'
          disabled={fetchState === 'loading' || !authenticated}
          onClick={async () => {
            if (!authenticated) {
              return
            }
            setMessage(null)
            setFetchState('loading')
            const body: Services['/games']['post']['body'] = {
              color: selectedColor
            }
            try {
              const { data } = await authentication.api.post<
                Services['/games']['post']['response']
              >('/games', body)
              setFetchState('success')
              router.push(`/game/${data.gameId}`)
            } catch (error) {
              console.error(error)
              setFetchState('error')
              setMessage('interne du serveur.')
            }
          }}
        >
          Lancer en Multijoueur
        </Button>

        <Button
          variant='white'
          disabled={fetchState === 'loading'}
          className='!px-6 !py-2 !text-base disabled:cursor-not-allowed disabled:opacity-50'
          onClick={() => {
            router.push('/game/local')
          }}
        >
          Lancer en Local
        </Button>
      </div>

      <FormState
        id='message'
        state={fetchState}
        message={message != null ? message : undefined}
      />

      {!authenticated ? (
        <p className='mt-6'>
          Vous devez vous{' '}
          <Link href='/authentication/signup'>connecter/inscrire</Link> pour
          jouer en multijoueur.
        </p>
      ) : null}
    </div>
  )
}

export default GamePage
