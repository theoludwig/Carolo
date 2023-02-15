import Image from 'next/image'
import { useMemo } from 'react'
import classNames from 'clsx'
import type { PlayerState } from '@carolo/game'

import UserDefault from '@/public/data/user-default.png'
import { useGame } from '@/stores/game'

export interface PlayerProps {
  playerState: PlayerState
  playerIndex: number
}

export const Player = (props: PlayerProps): JSX.Element => {
  const { playerState, playerIndex } = props
  const { gameState } = useGame()

  const isPlayerTurn = useMemo(() => {
    return gameState.currentPlayerIndex === playerIndex
  }, [gameState.currentPlayerIndex, playerIndex])

  return (
    <section className='flex justify-between text-sm'>
      <div className='flex flex-row items-center justify-center space-x-2 rounded-md bg-[#272522] px-4 py-1'>
        <Image
          className={classNames('h-12 w-12 rounded-full', {
            'ring-2 ring-green-500': isPlayerTurn
          })}
          quality={100}
          src={UserDefault}
          alt='Player Picture'
        />
        <h2 className='text-lg font-semibold'>{playerState.name}</h2>
      </div>
      <div className='flex w-44 flex-wrap justify-center rounded-md bg-[#272522]'>
        {playerState.capturedPieces.map((piece, index) => {
          return (
            <Image
              key={index}
              className='h-10 w-10'
              quality={100}
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
