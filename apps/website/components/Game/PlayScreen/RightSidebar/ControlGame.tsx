import Image from 'next/image'

import { useGame } from '@/stores/game'
import GiveUp from '@/public/icons/give-up.svg'

export const ControlGame = (): JSX.Element => {
  const { game, gameState, resetSelectedPosition } = useGame()

  return (
    <>
      <div className='flex flex-col items-center'>
        <button
          className='rounded-md bg-[#8417DA] p-2 hover:bg-[#6514a6]'
          onClick={() => {
            const currentPlayer = game.getPlayer(gameState.currentPlayerIndex)
            game.giveUp(currentPlayer.color)
            resetSelectedPosition()
          }}
        >
          <Image quality={100} src={GiveUp} alt='Give Up' />
        </button>
        <h3 className='mt-2'>Abandonner</h3>
      </div>
    </>
  )
}
