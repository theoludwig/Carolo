'use client'

import Image from 'next/image'
import classNames from 'clsx'
import { BoardBase, Position } from '@carolo/game'

import { useGame } from '@/stores/game'

export const Board = (): JSX.Element => {
  const selectPosition = useGame((state) => {
    return state.selectPosition
  })
  const selectedPosition = useGame((state) => {
    return state.selectedPosition
  })
  const board = useGame((state) => {
    return state.board
  })
  const boardState = useGame((state) => {
    return state.boardState
  })
  const availablePiecePositions = useGame((state) => {
    return state.availablePiecePositions
  })

  const lastMove = boardState.moves[boardState.currentMoveIndex]

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
              const isCapture = isAvailable && piecePosition.isOccupied()

              const egoIsThreatened =
                piecePosition.isOccupied() &&
                piecePosition.piece.type === 'EGO' &&
                (board.isCheck(piecePosition.piece.color) ||
                  board.powerOfHubrisAttraction(piecePosition.piece.color)
                    .egoIsAttractedToHubris)

              const pieceSelectedIsAymon =
                selectedPosition != null &&
                board.getPiecePosition(selectedPosition)?.piece?.type ===
                  'AYMON'

              const isLastRow = rowIndex === BoardBase.SIZE - 1
              const isLastColumn = columnIndex === BoardBase.SIZE - 1

              let backgroundColorClasses = isEven
                ? 'bg-[#EFEFEF]'
                : 'bg-[#8578B3]'

              if (lastMove != null) {
                if (lastMove.fromPosition.equals(piecePosition.position)) {
                  backgroundColorClasses = 'bg-[#6AA954]'
                }
                if (lastMove.toPosition.equals(piecePosition.position)) {
                  backgroundColorClasses = 'bg-[#8CC188]'
                }
              }

              if (egoIsThreatened) {
                backgroundColorClasses = 'bg-[#D05050]'
              }

              if (isSelected) {
                backgroundColorClasses = 'bg-[#F6A458]'
              }

              return (
                <div
                  id={`board-${positionString}`}
                  key={columnIndex}
                  className={classNames(
                    'relative flex h-16 w-16 cursor-pointer items-center justify-center p-[1px] hover:bg-opacity-80',
                    backgroundColorClasses
                  )}
                  onClick={() => {
                    selectPosition(piecePosition.position)
                  }}
                >
                  {piecePosition.isOccupied() ? (
                    <Image
                      style={
                        {
                          '--border-color': isEven ? '#939393' : '#D3D3D3'
                        } as React.CSSProperties
                      }
                      className={classNames('h-full w-full', {
                        'square-corners': isCapture
                      })}
                      quality={100}
                      priority
                      src={`/pieces/${piecePosition.piece.type}_${piecePosition.piece.color}.png`}
                      alt='Piece'
                      width={64}
                      height={64}
                    />
                  ) : null}
                  {isLastRow ? (
                    <span
                      className={classNames(
                        'absolute bottom-0 left-1 text-xs font-bold',
                        {
                          'text-[#8578B3]': isEven,
                          'text-[#EFEFEF]': !isEven
                        }
                      )}
                    >
                      {Position.columnToHumanCoordinates(columnIndex)}
                    </span>
                  ) : null}
                  {isLastColumn ? (
                    <span
                      className={classNames(
                        'absolute right-1 top-1 text-xs font-bold',
                        {
                          'text-[#8578B3]': isEven,
                          'text-[#EFEFEF]': !isEven
                        }
                      )}
                    >
                      {Position.rowToHumanCoordinates(rowIndex, BoardBase.SIZE)}
                    </span>
                  ) : null}
                  {isAvailable && piecePosition.isFree() ? (
                    <div
                      className={classNames('rounded-sm', {
                        'bg-[#939393]': isEven,
                        'bg-[#D3D3D3]': !isEven,
                        'h-2 w-2': pieceSelectedIsAymon,
                        'h-3 w-3': !pieceSelectedIsAymon
                      })}
                    ></div>
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
