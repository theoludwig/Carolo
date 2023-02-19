import { PlayScreen } from '@/components/Game/PlayScreen/PlayScreen'
import { GameStoreInitializer } from '@/stores/GameStoreInitializer'

export const Game = (): JSX.Element => {
  return (
    <>
      <GameStoreInitializer />
      <PlayScreen />
    </>
  )
}
