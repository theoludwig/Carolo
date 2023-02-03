import Image from 'next/image'
import classNames from 'clsx'

import { useGame } from '@/stores/game'

export const PlayScreen = (): JSX.Element => {
  const { boardState } = useGame()

  return (
    <>
      <section id='board'>
        {boardState.board.map((row, rowIndex) => {
          return (
            <div id={`board-row-${rowIndex}`} className='flex' key={rowIndex}>
              {row.map((piecePosition, columnIndex) => {
                const isEven = (rowIndex + columnIndex) % 2 === 0

                return (
                  <div
                    id={`board-row-${rowIndex}-column-${columnIndex}`}
                    key={columnIndex}
                    className={classNames(
                      'h-16 w-16 cursor-pointer hover:bg-opacity-80',
                      {
                        'bg-[#8578B3]': !isEven,
                        'bg-[#EFEFEF]': isEven
                      }
                    )}
                  >
                    {piecePosition.isOccupied() ? (
                      <Image
                        className='h-full w-full object-contain'
                        quality={100}
                        src={`/pieces/${piecePosition.piece.getType()}_${
                          piecePosition.piece.color
                        }.png`}
                        alt='Piece'
                        width={64}
                        height={64}
                      />
                    ) : null}
                  </div>
                )
              })}
            </div>
          )
        })}
      </section>
    </>
  )
}
