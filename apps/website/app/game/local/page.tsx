import type { GameUser } from '@carolo/models'

import { Game } from '@/components/Game/Game'
import type { GameStoreOptions } from '@/stores/game'
import { GameStoreInitializer } from '@/stores/GameStoreInitializer'

const GameLocalPage = (): JSX.Element => {
  const gameUsers: GameUser[] = [
    {
      id: 1,
      name: 'Joueur 1',
      color: 'WHITE',
      logo: null
    },
    {
      id: 2,
      name: 'Joueur 2',
      color: 'BLACK',
      logo: null
    }
  ]

  const options: GameStoreOptions = {
    playWithColors: ['WHITE', 'BLACK']
  }

  return (
    <>
      <GameStoreInitializer options={options} users={gameUsers} />
      <Game />
    </>
  )
}

export default GameLocalPage
