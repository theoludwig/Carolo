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
    // TODO: Replace this with Server Side redirect when Next.js supports it (ref: <https://github.com/vercel/next.js/issues/42556>)
    const redirectGame = async (): Promise<void> => {
      if (authenticated) {
        const { data } = await authentication.api.get<
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

  return <>{children}</>
}

export default GameLayout
