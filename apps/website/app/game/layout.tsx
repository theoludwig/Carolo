'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { Services } from '@carolo/models'

import { useAuthentication } from '@/stores/authentication'

export type GameLayoutProps = React.PropsWithChildren

const GameLayout = (props: GameLayoutProps): JSX.Element => {
  const { children } = props

  const router = useRouter()
  const { authenticated, authentication } = useAuthentication()

  useEffect(() => {
    const redirectGame = async (): Promise<void> => {
      if (authenticated) {
        const { data } =
          await authentication.api.get<
            Services['/games/current']['get']['response']
          >('/games/current')
        if (data.gameId != null) {
          return router.replace(`/game/${data.gameId}`)
        }
      }
    }

    redirectGame().catch((error) => {
      console.error(error)
    })
  }, [authenticated, authentication, router])

  return (
    <main className='flex flex-1 flex-col items-center justify-center'>
      {children}
    </main>
  )
}

export default GameLayout
