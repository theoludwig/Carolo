'use client'

import { useGame } from '@/stores/game'
import { EndGame } from '@/components/Game/RightSidebar/EndGame'
import { ControlGame } from '@/components/Game/RightSidebar/ControlGame'

export const RightSidebar = (): JSX.Element => {
  const gameState = useGame((state) => {
    return state.gameState
  })

  return (
    <div className='flex w-4/12 items-center justify-center text-center'>
      <div className='inline-flex min-w-[220px] flex-col items-center rounded-md bg-[#272522] px-4 py-2'>
        {gameState.finalStatus === 'PLAY' ? <ControlGame /> : <EndGame />}
      </div>
    </div>
  )
}
