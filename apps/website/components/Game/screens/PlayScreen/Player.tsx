import { useMemo } from 'react'
import type { PlayerState } from '@carolo/game'

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

  const playerStatus = useMemo(() => {
    if (gameState.status === 'PLAY') {
      return isPlayerTurn ? 'En train de jouer' : 'En attente'
    }
    return gameState.status === `${playerState.color}_WON` ? 'Gagné' : 'Perdu'
  }, [gameState.status, isPlayerTurn, playerState.color])

  return (
    <section className='flex justify-between text-sm'>
      <div className='flex flex-col items-center justify-center rounded-md bg-[#272522] px-8 py-2'>
        {playerState.name} ({playerStatus})
        <p>{playerState.color === 'WHITE' ? 'Blanc' : 'Noir'}</p>
      </div>
      <div className='flex items-center justify-center rounded-md bg-[#272522] px-8 py-3'>
        <p>Pièces capturées</p>
      </div>
    </section>
  )
}
