import Image from 'next/image'
import classNames from 'clsx'
import { BoardBase } from '@carolo/game'

import { useGame } from '@/stores/game'

export const LeftSidebar = (): JSX.Element => {
  const { boardState } = useGame()

  return (
    <div className='flex w-4/12 items-center justify-center'>
      <div className='scrollbar-firefox-support flex h-80 w-52 flex-col overflow-y-auto rounded-lg bg-[#272522]'>
        <ul>
          {boardState.moves.map((move, index) => {
            const isEven = index % 2 === 0
            return (
              <li
                key={index}
                className={classNames('flex justify-between py-2 px-4', {
                  'bg-[#272522]': !isEven,
                  'bg-[#2B2926]': isEven
                })}
              >
                <span className='flex items-center justify-center'>
                  {index + 1}.
                </span>
                <span className='flex items-center justify-center'>
                  <Image
                    className='h-8 w-8'
                    quality={100}
                    priority
                    src={`/pieces/${move.piece.type}_${move.piece.color}.png`}
                    alt='Piece'
                    width={64}
                    height={64}
                  />
                  {move.fromPosition.toHumanCoordinates(BoardBase.SIZE)}
                </span>
                <span className='flex items-center justify-center'>
                  {move.capturedPiece != null ? (
                    <Image
                      className='h-8 w-8'
                      quality={100}
                      priority
                      src={`/pieces/${move.capturedPiece.type}_${move.capturedPiece.color}.png`}
                      alt='Piece'
                      width={64}
                      height={64}
                    />
                  ) : null}
                  {move.toPosition.toHumanCoordinates(BoardBase.SIZE)}
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
