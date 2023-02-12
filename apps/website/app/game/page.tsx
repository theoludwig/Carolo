import { Game } from '@/components/Game/Game'
import { GameStoreInitializer } from '@/stores/GameStoreInitializer'

const GamePage = (): JSX.Element => {
  return (
    <>
      <GameStoreInitializer />
      <Game />
    </>
  )
}

export default GamePage
