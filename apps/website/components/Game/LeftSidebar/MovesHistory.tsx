import Image from 'next/image'
import classNames from 'clsx'

import { useGame } from '@/stores/game'

export const MovesHistory = (): JSX.Element => {
  const boardState = useGame((state) => {
    return state.boardState
  })

  return (
    <div className='scrollbar-firefox-support flex h-80 w-52 flex-col overflow-y-auto rounded-lg bg-[#272522]'>
      <ul>
        {boardState.moves.map((move, index) => {
          const isEven = index % 2 === 0
          const isCurrentMove = index === boardState.currentMoveIndex
          return (
            <li
              key={index}
              className={classNames('flex justify-between px-4 py-2', {
                'bg-[#272522]': !isEven,
                'bg-[#2B2926]': isEven
              })}
            >
              <span
                className={classNames('flex items-center justify-center', {
                  underline: isCurrentMove
                })}
              >
                {index + 1}.
              </span>
              <span className='flex h-8 w-8 items-center justify-center'>
                <Image
                  quality={100}
                  priority
                  src={`/pieces/${move.piece.type}_${move.piece.color}.png`}
                  alt='Piece'
                  width={64}
                  height={64}
                />
                {move.fromPosition.toString()}
              </span>
              <span className='flex h-8 w-8 items-center justify-center'>
                {move.capturedPiece != null ? (
                  <Image
                    quality={100}
                    priority
                    src={`/pieces/${move.capturedPiece.type}_${move.capturedPiece.color}.png`}
                    alt='Piece'
                    width={64}
                    height={64}
                  />
                ) : null}
                {move.toPosition.toString()}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
