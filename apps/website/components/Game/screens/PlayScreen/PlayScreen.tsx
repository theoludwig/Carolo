import Image from 'next/image'
import classNames from 'clsx'

import { useGame } from '@/stores/game'
import AvailablePosition from '@/public/pieces/AVAILABLE_POSITION.png'

export const PlayScreen = (): JSX.Element => {
  const { getAvailablePiecePositions, boardState, availablePiecePositions } =
    useGame()

  return (
    <>
      <section id='board'>
        {boardState.board.map((row, rowIndex) => {
          return (
            <div className='flex' key={rowIndex}>
              {row.map((piecePosition, columnIndex) => {
                const positionString = piecePosition.position.toString()
                const isEven = (rowIndex + columnIndex) % 2 === 0
                const isAvailable = availablePiecePositions.has(positionString)

                return (
                  <div
                    id={`board-${positionString}}`}
                    key={columnIndex}
                    className={classNames(
                      'h-16 w-16 cursor-pointer hover:bg-opacity-80',
                      {
                        'bg-[#8578B3]': !isEven,
                        'bg-[#EFEFEF]': isEven
                      }
                    )}
                    onClick={() => {
                      getAvailablePiecePositions(piecePosition.position)
                    }}
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
                    {isAvailable ? (
                      <Image
                        className='h-full w-full object-contain'
                        quality={100}
                        src={AvailablePosition}
                        alt='Available'
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
