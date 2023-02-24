'use client'

import type { GameStoreOptions } from '@/stores/game'
import { GameView } from '@/components/Game/GameView'
import { GameContextProvider } from '@/components/Game/GameContext'

export interface GameProps {
  options: GameStoreOptions
}

export const Game = (props: GameProps): JSX.Element => {
  const { options } = props

  return (
    <GameContextProvider options={options}>
      <GameView />
    </GameContextProvider>
  )
}
