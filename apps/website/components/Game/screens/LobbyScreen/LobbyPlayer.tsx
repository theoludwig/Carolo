'use client'

import { useMemo } from 'react'
import Image from 'next/image'
import type { PlayerState } from '@carolo/game'

import { useGame } from '@/stores/game'
import CaroloBlack from '@/public/pieces/CAROLO_BLACK.png'
import CaroloWhite from '@/public/pieces/CAROLO_WHITE.png'

export interface LobbyPlayerProps {
  playerIndex: number
  playerState: PlayerState
}

export const LobbyPlayer = (props: LobbyPlayerProps): JSX.Element => {
  const { playerIndex, playerState } = props

  const game = useGame((state) => {
    return state.game
  })

  const playerColorId = useMemo(() => {
    return `player-${playerIndex}-color`
  }, [playerIndex])

  const playerNameId = useMemo(() => {
    return `player-${playerIndex}-name`
  }, [playerIndex])

  return (
    <section className='flex flex-col items-center justify-center space-x-8 sm:flex-row'>
      <button
        type='button'
        id={playerColorId}
        onClick={() => {
          game.setPlayerColor(playerIndex)
        }}
      >
        <Image
          className='w-28'
          quality={100}
          src={playerState.color === 'BLACK' ? CaroloBlack : CaroloWhite}
          alt={playerState.color}
        />
      </button>
      <input
        className='rounded-lg px-3 py-3 text-lg'
        type='text'
        name={playerNameId}
        id={playerNameId}
        value={playerState.name}
        onChange={(event) => {
          game.setPlayerName(playerIndex, event.target.value)
        }}
      />
    </section>
  )
}
