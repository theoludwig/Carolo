'use client'

import { useMemo } from 'react'
import Image from 'next/image'

import { useGame } from '@/stores/game'
import { useAuthentication } from '@/stores/authentication'
import Resign from '@/public/icons/resign.svg'

export const ControlGame = (): JSX.Element => {
  const { authenticated, user } = useAuthentication()

  const gameUsers = useGame((state) => {
    return state.users
  })
  const game = useGame((state) => {
    return state.game
  })
  const gameId = useGame((state) => {
    return state.gameId
  })
  const gameState = useGame((state) => {
    return state.gameState
  })
  const playAction = useGame((state) => {
    return state.playAction
  })

  const gameUser = useMemo(() => {
    return gameUsers.find((gameUserMap) => {
      return user?.id === gameUserMap.id
    })
  }, [gameUsers, user])

  return (
    <>
      <div className='flex flex-col items-center'>
        {gameId == null || gameUser != null ? (
          <>
            <button
              className='rounded-md bg-[#8417DA] p-2 hover:bg-[#6514a6]'
              onClick={() => {
                const currentPlayer = game.getPlayer(
                  gameState.currentPlayerIndex
                )
                let color = currentPlayer.color
                if (authenticated && gameId != null && gameUser != null) {
                  color = gameUser.color
                }
                playAction({
                  type: 'RESIGN',
                  color
                })
              }}
            >
              <Image quality={100} src={Resign} alt='Resign' />
            </button>
            <h3 className='mt-2'>Abandonner</h3>
          </>
        ) : (
          <p>Partie en cours</p>
        )}
      </div>
    </>
  )
}
