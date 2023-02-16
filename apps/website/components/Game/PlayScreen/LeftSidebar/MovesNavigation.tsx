import { useGame } from '@/stores/game'
import { MoveNavigationButton } from '@/components/Game/PlayScreen/LeftSidebar/MoveNavigationButton'

export const MovesNavigation = (): JSX.Element => {
  const { game, resetSelectedPosition } = useGame()

  return (
    <nav className='mt-4 flex w-52 justify-between'>
      <MoveNavigationButton
        onClick={() => {
          game.firstMove()
          resetSelectedPosition()
        }}
        icon='arrow-full'
        direction='left'
      />
      <MoveNavigationButton
        onClick={() => {
          game.previousMove()
          resetSelectedPosition()
        }}
        icon='arrow'
        direction='left'
      />
      <MoveNavigationButton
        onClick={() => {
          game.nextMove()
          resetSelectedPosition()
        }}
        icon='arrow'
        direction='right'
      />
      <MoveNavigationButton
        onClick={() => {
          game.lastMove()
          resetSelectedPosition()
        }}
        icon='arrow-full'
        direction='right'
      />
    </nav>
  )
}
