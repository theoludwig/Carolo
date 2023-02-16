import Image from 'next/image'
import classNames from 'clsx'
import { BoardBase } from '@carolo/game'

import Arrow from '@/public/icons/arrow.svg'
import ArrowFull from '@/public/icons/arrow-full.svg'
import { useGame } from '@/stores/game'

export const LeftSidebar = (): JSX.Element => {
  const { game, boardState, resetSelectedPosition } = useGame()

  return (
    <div className='flex w-4/12 flex-col items-center justify-center'>
      <div className='scrollbar-firefox-support flex h-80 w-52 flex-col overflow-y-auto rounded-lg bg-[#272522]'>
        <ul>
          {boardState.moves
            .slice(0, boardState.currentMoveIndex + 1)
            .map((move, index) => {
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

      <div className='mt-4 flex w-52 justify-between'>
        <button
          className='rounded-md bg-[#272522] py-1 px-4 hover:opacity-70'
          onClick={() => {
            game.firstMove()
            resetSelectedPosition()
          }}
        >
          <Image
            className='h-4 w-4 rotate-180'
            quality={100}
            src={ArrowFull}
            alt='Arrow Full'
          />
        </button>
        <button
          className='rounded-md bg-[#272522] py-1 px-4 hover:opacity-70'
          onClick={() => {
            game.previousMove()
            resetSelectedPosition()
          }}
        >
          <Image
            className='h-4 w-4 rotate-180'
            quality={100}
            src={Arrow}
            alt='Arrow'
          />
        </button>
        <button
          className='rounded-md bg-[#272522] py-1 px-4 hover:opacity-70'
          onClick={() => {
            game.nextMove()
            resetSelectedPosition()
          }}
        >
          <Image className='h-4 w-4' quality={100} src={Arrow} alt='Arrow' />
        </button>
        <button
          className='rounded-md bg-[#272522] py-1 px-4 hover:opacity-70'
          onClick={() => {
            game.lastMove()
          }}
        >
          <Image
            className='h-4 w-4'
            quality={100}
            src={ArrowFull}
            alt='Arrow Full'
          />
        </button>
      </div>
    </div>
  )
}
