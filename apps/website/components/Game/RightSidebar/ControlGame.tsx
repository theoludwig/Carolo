import Image from 'next/image'

import { useGame } from '@/stores/game'
import Resign from '@/public/icons/resign.svg'

export const ControlGame = (): JSX.Element => {
  const playAction = useGame((state) => {
    return state.playAction
  })

  return (
    <>
      <div className='flex flex-col items-center'>
        <button
          className='rounded-md bg-[#8417DA] p-2 hover:bg-[#6514a6]'
          onClick={() => {
            playAction({
              type: 'RESIGN'
            })
          }}
        >
          <Image quality={100} src={Resign} alt='Resign' />
        </button>
        <h3 className='mt-2'>Abandonner</h3>
      </div>
    </>
  )
}
