import { useGame } from '@/stores/game'
import { Board } from '@/components/Game/screens/PlayScreen/Board'
import { Player } from '@/components/Game/screens/PlayScreen/Player'
import { Button } from '@/components/Button'

export const PlayScreen = (): JSX.Element => {
  const { playersState, skipBouncing, gameState } = useGame()

  const player1 = playersState[0]
  const topPlayerIndex = player1.color === 'BLACK' ? 0 : 1
  const bottomPlayerIndex = player1.color === 'WHITE' ? 0 : 1

  return (
    <>
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
        {gameState.isBouncingOnGoing ? (
          <Button
            onClick={() => {
              skipBouncing()
            }}
          >
            Passer le tour
          </Button>
        ) : null}
      </div>
    </>
  )
}
