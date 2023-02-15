import { useGame } from '@/stores/game'
import { Board } from '@/components/Game/screens/PlayScreen/Board'
import { Player } from '@/components/Game/screens/PlayScreen/Player'
import { RightSidebar } from '@/components/Game/screens/PlayScreen/RightSidebar/RightSidebar'
import { LeftSidebar } from '@/components/Game/screens/PlayScreen/LeftSidebar/LeftSidebar'

export const PlayScreen = (): JSX.Element => {
  const { playersState } = useGame()

  const player1 = playersState[0]
  const topPlayerIndex = player1.color === 'BLACK' ? 0 : 1
  const bottomPlayerIndex = player1.color === 'WHITE' ? 0 : 1

  return (
    <div className='flex w-full justify-center'>
      <LeftSidebar />
      <div className='space-y-4'>
        <Player
          playerState={playersState[topPlayerIndex]}
          playerIndex={topPlayerIndex}
        />
        <Board />
        <Player
          playerState={playersState[bottomPlayerIndex]}
          playerIndex={bottomPlayerIndex}
        />
      </div>
      <RightSidebar />
    </div>
  )
}
