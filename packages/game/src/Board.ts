import type { Move } from './BoardBase.js'
import { BoardBase } from './BoardBase.js'
import type { PiecePosition } from './PiecePosition.js'
import type { PieceColor } from './pieces/Piece.js'
import { getOppositePieceColor } from './pieces/Piece.js'
import type { PositionString } from './Position.js'
import { Position } from './Position.js'

export type AvailablePiecePositions = Map<PositionString, PiecePosition>

export class Board extends BoardBase {
  private getAvailablePiecePositionsWithoutHubrisAttraction(
    fromPosition: Position
  ): AvailablePiecePositions {
    const availablePiecePositions: AvailablePiecePositions = new Map()
    const from = this.getPiecePosition(fromPosition)
    if (from.isFree()) {
      return availablePiecePositions
    }

    if (from.piece.canMoveTeleportAnywhere()) {
      for (let row = 0; row < BoardBase.SIZE; row++) {
        for (let column = 0; column < BoardBase.SIZE; column++) {
          const toPosition = new Position({ row, column })
          const to = this.getPiecePosition(toPosition)
          if (to.isOccupied() && to.piece.color === from.piece.color) {
            continue
          }
          if (this.isCaptureMove(fromPosition, toPosition)) {
            continue
          }
          availablePiecePositions.set(toPosition.toString(), to)
        }
      }
      return availablePiecePositions
    }
    const positionsOffsets = from.piece.getPositionsOffsets(BoardBase.SIZE)

    for (const positionOffset of positionsOffsets) {
      const toPosition = fromPosition.add(positionOffset)
      if (!toPosition.isInsideSquare(BoardBase.SIZE)) {
        continue
      }
      const to = this.getPiecePosition(toPosition)
      if (to.isOccupied() && to.piece.color === from.piece.color) {
        continue
      }
      if (!from.piece.canJumpOverPieces()) {
        let isPathwayBlocked = false
        for (const intermediatePosition of fromPosition.getIntermediatePositions(
          toPosition
        )) {
          if (this.getPiecePosition(intermediatePosition).isOccupied()) {
            isPathwayBlocked = true
            break
          }
        }
        if (isPathwayBlocked) {
          continue
        }
      }
      if (this.isCaptureMove(fromPosition, toPosition)) {
        continue
      }
      if (this.isCheckAfterMove(fromPosition, toPosition)) {
        continue
      }
      availablePiecePositions.set(toPosition.toString(), to)
    }

    if (from.piece.shouldMoveUntilObstacle()) {
      let maximumTop: PiecePosition | null = null
      let maximumBottom: PiecePosition | null = null
      let maximumLeft: PiecePosition | null = null
      let maximumRight: PiecePosition | null = null
      for (const [_toPositionString, to] of availablePiecePositions) {
        const toPosition = to.position
        if (toPosition.row > fromPosition.row) {
          if (maximumTop == null || toPosition.row > maximumTop.position.row) {
            maximumTop = to
          }
        }
        if (toPosition.row < fromPosition.row) {
          if (
            maximumBottom == null ||
            toPosition.row < maximumBottom.position.row
          ) {
            maximumBottom = to
          }
        }
        if (toPosition.column > fromPosition.column) {
          if (
            maximumLeft == null ||
            toPosition.column > maximumLeft.position.column
          ) {
            maximumLeft = to
          }
        }
        if (toPosition.column < fromPosition.column) {
          if (
            maximumRight == null ||
            toPosition.column < maximumRight.position.column
          ) {
            maximumRight = to
          }
        }
      }

      const availableOnlyPiecePositions: AvailablePiecePositions = new Map()
      if (maximumTop != null) {
        availableOnlyPiecePositions.set(
          maximumTop.position.toString(),
          maximumTop
        )
      }
      if (maximumBottom != null) {
        availableOnlyPiecePositions.set(
          maximumBottom.position.toString(),
          maximumBottom
        )
      }
      if (maximumLeft != null) {
        availableOnlyPiecePositions.set(
          maximumLeft.position.toString(),
          maximumLeft
        )
      }
      if (maximumRight != null) {
        availableOnlyPiecePositions.set(
          maximumRight.position.toString(),
          maximumRight
        )
      }
      return availableOnlyPiecePositions
    }

    return availablePiecePositions
  }

  /**
   * Get all available positions for a piece.
   * @param fromPosition
   * @returns Map of available positions (key: `column-${column}-row-${row}`, value: PiecePosition).
   */
  public getAvailablePiecePositions(
    fromPosition: Position
  ): AvailablePiecePositions {
    let availablePiecePositions: AvailablePiecePositions = new Map()
    const from = this.getPiecePosition(fromPosition)
    if (from.isFree()) {
      return availablePiecePositions
    }
    const oppositeColor = getOppositePieceColor(from.piece.color)
    if (this.isCheck(from.piece.color) || this.isReconquest(oppositeColor)) {
      return availablePiecePositions
    }

    // Hubris Attraction Power
    const lastMove = this.getLastMove()
    if (
      lastMove != null &&
      lastMove.piece.type === 'HUBRIS' &&
      lastMove.piece.color === oppositeColor
    ) {
      const positionsOffsets = lastMove.piece.getPositionsOffsets(
        BoardBase.SIZE
      )
      const egoPiecePosition = this.getEgoPiecePosition(from.piece.color)
      const isEgoCloseToHubris = positionsOffsets.some((positionOffset) => {
        const toPosition = lastMove.toPosition.add(positionOffset)
        return toPosition.equals(egoPiecePosition.position)
      })

      let column = 0
      if (lastMove.toPosition.column < lastMove.fromPosition.column) {
        column = 1
      } else {
        column = -1
      }
      const positionToAdd = new Position({
        row: from.piece.getDirection(),
        column
      })
      const toPosition = lastMove.toPosition.add(positionToAdd)
      const to = this.getPiecePosition(toPosition)

      let isPathwayBlocked = false
      const positionsBetweenEgoAndHubris: Set<PositionString> = new Set()
      const egoColumn = egoPiecePosition.position.column
      const egoRow = egoPiecePosition.position.row
      const toColumn = toPosition.column
      const toRow = toPosition.row
      const minColumn = Math.min(egoColumn, toColumn)
      const maxColumn = Math.max(egoColumn, toColumn)
      const minRow = Math.min(egoRow, toRow)
      for (
        let column = minColumn + 1, row = minRow + 1;
        column < maxColumn;
        column++, row++
      ) {
        const position = new Position({ row, column })
        const piecePosition = this.getPiecePosition(position)
        if (piecePosition.isOccupied()) {
          isPathwayBlocked = true
          break
        } else {
          positionsBetweenEgoAndHubris.add(position.toString())
        }
      }
      positionsBetweenEgoAndHubris.add(toPosition.toString())

      if (isEgoCloseToHubris && !isPathwayBlocked) {
        if (from.piece.type === 'EGO') {
          availablePiecePositions.set(toPosition.toString(), to)
          return availablePiecePositions
        }
        if (from.piece.type === 'HUBRIS') {
          const hubrisAvailablePiecePositions =
            this.getAvailablePiecePositionsWithoutHubrisAttraction(fromPosition)
          for (const [key, piecePosition] of hubrisAvailablePiecePositions) {
            if (positionsBetweenEgoAndHubris.has(key)) {
              availablePiecePositions.set(key, piecePosition)
            }
          }
          return availablePiecePositions
        }
        return availablePiecePositions
      }
    }

    if (
      lastMove != null &&
      lastMove.piece.canBounce() &&
      !lastMove.isNextPlayerTurn &&
      !from.piece.canBounce()
    ) {
      return availablePiecePositions
    }

    availablePiecePositions =
      this.getAvailablePiecePositionsWithoutHubrisAttraction(fromPosition)

    if (from.piece.canBounce()) {
      const precedingMoves: Move[] = []
      for (let index = this.state.moves.length - 1; index >= 0; index--) {
        const move = this.state.moves[index]
        if (move.piece.type === from.piece.type) {
          precedingMoves.push(move)
        } else {
          break
        }
      }
      const initialMove = precedingMoves[precedingMoves.length - 1]
      const availablePiecePositionsFiltered: AvailablePiecePositions = new Map()
      for (const [key, piecePosition] of availablePiecePositions) {
        const isPositionInPrecedingMoves = precedingMoves.some((move) => {
          return move.toPosition.toString() === key
        })
        if (
          !isPositionInPrecedingMoves &&
          initialMove?.fromPosition?.toString() !== key
        ) {
          availablePiecePositionsFiltered.set(key, piecePosition)
        }
      }
      availablePiecePositions = availablePiecePositionsFiltered
    }

    return availablePiecePositions
  }

  public canMove(fromPosition: Position, toPosition: Position): boolean {
    return this.getAvailablePiecePositions(fromPosition).has(
      toPosition.toString()
    )
  }

  public isCaptureMove(fromPosition: Position, toPosition: Position): boolean {
    const from = this.getPiecePosition(fromPosition)
    const to = this.getPiecePosition(toPosition)
    return (
      to.isOccupied() &&
      from.isOccupied() &&
      from.piece.color !== to.piece.color &&
      !from.piece.canBeCapturedBy(to.piece.type)
    )
  }

  private canBounceBorder(
    fromPosition: Position,
    toPosition: Position
  ): boolean {
    const piecePosition = this.getPiecePosition(toPosition)
    const { position } = piecePosition
    const { column, row } = position
    const isOnTop = row === 0
    const isOnBottom = row === BoardBase.SIZE - 1
    const isOnLeft = column === 0
    const isOnRight = column === BoardBase.SIZE - 1
    if (isOnTop && fromPosition.row > toPosition.row) {
      return true
    }
    if (isOnBottom && fromPosition.row < toPosition.row) {
      return true
    }
    if (isOnLeft && fromPosition.column > toPosition.column) {
      return true
    }
    if (isOnRight && fromPosition.column < toPosition.column) {
      return true
    }
    return false
  }

  private canBounceAymon(
    fromPosition: Position,
    toPosition: Position
  ): boolean {
    const piecePosition = this.getPiecePosition(toPosition)
    const topPosition = piecePosition.position.add(
      new Position({ row: -1, column: 0 })
    )
    const bottomPosition = piecePosition.position.add(
      new Position({ row: 1, column: 0 })
    )
    const leftPosition = piecePosition.position.add(
      new Position({ row: 0, column: -1 })
    )
    const rightPosition = piecePosition.position.add(
      new Position({ row: 0, column: 1 })
    )
    if (fromPosition.row > toPosition.row) {
      return (
        this.getPiecePosition(topPosition).isOccupied() &&
        this.getPiecePosition(topPosition).piece.type === 'AYMON'
      )
    }
    if (fromPosition.row < toPosition.row) {
      return (
        this.getPiecePosition(bottomPosition).isOccupied() &&
        this.getPiecePosition(bottomPosition).piece.type === 'AYMON'
      )
    }
    if (fromPosition.column > toPosition.column) {
      return (
        this.getPiecePosition(leftPosition).isOccupied() &&
        this.getPiecePosition(leftPosition).piece.type === 'AYMON'
      )
    }
    if (fromPosition.column < toPosition.column) {
      return (
        this.getPiecePosition(rightPosition).isOccupied() &&
        this.getPiecePosition(rightPosition).piece.type === 'AYMON'
      )
    }
    return false
  }

  public move(fromPosition: Position, toPosition: Position): Move {
    const from = this.getPiecePosition(fromPosition)
    const to = this.getPiecePosition(toPosition)
    const capturedPiece = to.isOccupied() ? to.piece : undefined
    to.piece = from.piece
    from.piece = null
    to.piece.setHasMoved()
    const move: Move = {
      fromPosition,
      toPosition,
      capturedPiece,
      piece: to.piece,
      isNextPlayerTurn:
        !to.piece.canBounce() ||
        (to.piece.canBounce() &&
          !this.canBounceBorder(fromPosition, toPosition) &&
          !this.canBounceAymon(fromPosition, toPosition))
    }
    this.setState((state) => {
      state.moves.push(move)
    })
    return move
  }

  public isReconquest(color: PieceColor): boolean {
    const egoPiecePosition = this.getEgoPiecePosition(color)
    const oppositeColor = getOppositePieceColor(color)
    const lastOppositeRow = this.getLastRow(oppositeColor)
    return egoPiecePosition.position.row === lastOppositeRow
  }

  public isCheck(color: PieceColor): boolean {
    const egoPiecePosition = this.getEgoPiecePosition(color)
    const fromPosition = egoPiecePosition.position
    const oppositeColor = getOppositePieceColor(color)
    const positionsOffsets = egoPiecePosition.piece.getPositionsOffsets(
      BoardBase.SIZE
    )
    for (const positionOffset of positionsOffsets) {
      const position = fromPosition.add(positionOffset)
      if (!position.isInsideSquare(BoardBase.SIZE)) {
        continue
      }
      const piecePosition = this.getPiecePosition(position)
      if (
        piecePosition.isOccupied() &&
        piecePosition.piece.color === oppositeColor &&
        piecePosition.piece.type === 'CAROLO'
      ) {
        return true
      }
    }
    return false
  }

  private isCheckAfterMove(
    fromPosition: Position,
    toPosition: Position
  ): boolean {
    const from = this.getPiecePosition(fromPosition)
    const to = this.getPiecePosition(toPosition)
    if (from.isFree()) {
      return false
    }
    const fromPiece = from.piece
    const toPiece = to.isOccupied() ? to.piece : null
    from.piece = null
    to.piece = fromPiece
    const isCheck = this.isCheck(fromPiece.color)
    from.piece = fromPiece
    to.piece = toPiece
    return isCheck
  }
}
