import { useGame } from '@/stores/game'
import { EndGame } from '@/components/Game/screens/PlayScreen/RightSidebar/EndGame'
import { ControlGame } from '@/components/Game/screens/PlayScreen/RightSidebar/ControlGame'

export const RightSidebar = (): JSX.Element => {
  const { gameState } = useGame()

  return (
    <div className='w-4/12 text-center'>
      <div className='mt-[72px] inline-flex min-w-[220px] flex-col rounded-md bg-[#272522] px-4 py-2'>
        {gameState.status === 'PLAY' ? <ControlGame /> : <EndGame />}
      </div>
    </div>
  )
}
