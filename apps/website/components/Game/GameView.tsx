'use client'

import type { Services } from '@carolo/models'

import { useGame } from '@/stores/game'
import { useAuthentication } from '@/stores/authentication'
import { Board } from '@/components/Game/Board'
import { Player } from '@/components/Game/Player'
import { RightSidebar } from '@/components/Game/RightSidebar/RightSidebar'
import { LeftSidebar } from '@/components/Game/LeftSidebar/LeftSidebar'
import { Button } from '@/components/Button'

export const GameView = (): JSX.Element => {
  const { authenticated, authentication, user } = useAuthentication()

  const playersState = useGame((state) => {
    return state.playersState
  })
  const gameId = useGame((state) => {
    return state.gameId
  })
  const gameState = useGame((state) => {
    return state.gameState
  })
  const users = useGame((state) => {
    return state.users
  })

  const player1 = playersState[0]
  const topPlayerIndex = player1.color === 'BLACK' ? 0 : 1
  const bottomPlayerIndex = player1.color === 'WHITE' ? 0 : 1

  return (
    <div className='my-2 flex w-full justify-center'>
      {authenticated &&
      gameId != null &&
      gameState.status === 'LOBBY' &&
      users.length === 1 &&
      users[0].id !== user.id ? (
        <div className='flex flex-col'>
          <Button
            onClick={async () => {
              try {
                await authentication.api.post<
                  Services['/games/:gameId/join']['post']['response']
                >(`/games/${gameId}/join`, {})
              } catch {}
            }}
          >
            Rejoindre
          </Button>
        </div>
      ) : null}
      <LeftSidebar />
      <div className='space-y-4'>
        <Player
          playerState={playersState[topPlayerIndex]}
          playerIndex={topPlayerIndex}
        />
        <Board />
        <Player
          playerState={playersState[bottomPlayerIndex]}
          playerIndex={bottomPlayerIndex}
        />
      </div>
      <RightSidebar />
    </div>
  )
}
