'use client'

import Image from 'next/image'
import { useMemo } from 'react'
import classNames from 'clsx'
import type { PlayerState } from '@carolo/game'

import { useGame } from '@/stores/game'

export interface PlayerProps {
  playerState: PlayerState
  playerIndex: number
}

export const Player = (props: PlayerProps): JSX.Element => {
  const { playerState, playerIndex } = props
  const gameState = useGame((state) => {
    return state.gameState
  })
  const users = useGame((state) => {
    return state.users
  })

  const isPlayerTurn = useMemo(() => {
    return gameState.currentPlayerIndex === playerIndex
  }, [gameState.currentPlayerIndex, playerIndex])

  const user = useMemo(() => {
    return users.find((user) => {
      return user.color === playerState.color
    })
  }, [playerState.color, users])

  return (
    <section className='flex justify-between text-sm'>
      <div className='flex flex-row items-center justify-center space-x-2 rounded-md bg-[#272522] px-4 py-1'>
        {user == null ? (
          <h2>En attente d{"'"}adversaire</h2>
        ) : (
          <>
            <Image
              className={classNames('h-12 w-12 rounded-full', {
                'ring-2 ring-green-500': isPlayerTurn
              })}
              priority
              quality={100}
              src={user.logo ?? '/data/user-default.png'}
              alt='Player Picture'
              width={64}
              height={64}
            />
            <h2 className='text-lg font-semibold'>{user.name}</h2>
          </>
        )}
      </div>
      <div className='flex w-44 flex-wrap justify-center rounded-md bg-[#272522]'>
        {playerState.capturedPieces.map((piece, index) => {
          return (
            <Image
              quality={100}
              priority
              key={index}
              className='h-10 w-10'
              src={`/pieces/${piece.type}_${piece.color}.png`}
              alt='Piece'
              width={64}
              height={64}
            />
          )
        })}
      </div>
    </section>
  )
}
