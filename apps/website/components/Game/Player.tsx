'use client'

import Image from 'next/image'
import NextLink from 'next/link'
import { useMemo } from 'react'
import classNames from 'clsx'
import type { PlayerState } from '@carolo/game'
import type { GameUser } from '@carolo/models'

import { useGame } from '@/stores/game'
import { User } from '@/components/User'

export interface PlayerProps {
  playerState: PlayerState
  playerIndex: number
}

interface PlayerUserProps {
  user?: GameUser
  isPlayerTurn?: boolean
}

const PlayerUser = (props: PlayerUserProps): JSX.Element => {
  const { user, isPlayerTurn = false } = props

  return (
    <div className='flex flex-row items-center justify-center space-x-2 rounded-md bg-[#272522] px-4 py-1'>
      {user == null ? (
        <h2>En attente d{"'"}adversaire</h2>
      ) : (
        <User
          user={{
            name: user.name,
            logo: user.logo
          }}
          className={classNames('h-12 w-12', {
            'ring-2 ring-green-500': isPlayerTurn
          })}
        />
      )}
    </div>
  )
}

export const Player = (props: PlayerProps): JSX.Element => {
  const { playerState, playerIndex } = props
  const gameState = useGame((state) => {
    return state.gameState
  })
  const users = useGame((state) => {
    return state.users
  })
  const gameId = useGame((state) => {
    return state.gameId
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
      {gameId == null || user == null ? (
        <PlayerUser user={user} isPlayerTurn={isPlayerTurn} />
      ) : (
        <NextLink href={`/users/${user.id}`} className='hover:opacity-80'>
          <PlayerUser user={user} isPlayerTurn={isPlayerTurn} />
        </NextLink>
      )}
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
