import { Header } from '@/components/Header'
import { Game } from '@/components/Game/Game'
import { GameStoreInitializer } from '@/stores/GameStoreInitializer'

const GamePage = (): JSX.Element => {
  return (
    <div className='flex h-screen flex-col pt-0'>
      <Header />
      <main className='flex flex-1 flex-col items-center justify-center'>
        <GameStoreInitializer />
        <Game />
      </main>
    </div>
  )
}

export default GamePage
