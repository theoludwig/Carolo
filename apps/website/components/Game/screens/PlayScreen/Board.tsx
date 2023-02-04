import Image from 'next/image'
import classNames from 'clsx'

import { useGame } from '@/stores/game'

export const Board = (): JSX.Element => {
  const {
    selectPosition,
    selectedPosition,
    boardState,
    availablePiecePositions
  } = useGame()

  return (
    <section id='board' className='flex flex-col items-center'>
      {boardState.board.map((row, rowIndex) => {
        return (
          <div className='flex' key={rowIndex}>
            {row.map((piecePosition, columnIndex) => {
              const positionString = piecePosition.position.toString()
              const isEven = (rowIndex + columnIndex) % 2 === 0
              const isAvailable = availablePiecePositions.has(positionString)
              const isSelected =
                selectedPosition?.equals(piecePosition.position) ?? false

              return (
                <div
                  id={`board-${positionString}`}
                  key={columnIndex}
                  className={classNames(
                    'flex h-16 w-16 cursor-pointer items-center justify-center hover:bg-opacity-80',
                    {
                      'bg-[#8578B3]': !isEven && !isSelected,
                      'bg-[#EFEFEF]': isEven && !isSelected,
                      'bg-[#F6A458]': isSelected
                    }
                  )}
                  onClick={() => {
                    selectPosition(piecePosition.position)
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
                    <div className='h-3 w-3 rounded-sm bg-[#939393]'></div>
                  ) : null}
                </div>
              )
            })}
          </div>
        )
      })}
    </section>
  )
}
