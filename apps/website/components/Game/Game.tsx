'use client'

import { useGame } from '@/stores/game'
import { LobbyScreen } from '@/components/Game/LobbyScreen/LobbyScreen'
import { PlayScreen } from '@/components/Game/PlayScreen/PlayScreen'

export const Game = (): JSX.Element => {
  const gameState = useGame((state) => {
    return state.gameState
  })

  if (gameState.status === 'LOBBY') {
    return <LobbyScreen />
  }
  return <PlayScreen />
}
