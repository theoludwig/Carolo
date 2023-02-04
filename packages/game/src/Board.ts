import type { Move } from './BoardBase.js'
import { BoardBase } from './BoardBase.js'
import type { PiecePosition } from './PiecePosition.js'
import type { PieceColor } from './pieces/Piece.js'
import { getOppositePieceColor } from './pieces/Piece.js'
import type { PositionString } from './Position.js'
import { Position } from './Position.js'

export type AvailablePiecePositions = Map<PositionString, PiecePosition>

export class Board extends BoardBase {
  public constructor() {
    super()
  }

  /**
   * Get all available positions for a piece.
   * @param fromPosition
   * @returns Map of available positions (key: `column-${column}-row-${row}`, value: PiecePosition).
   */
  public getAvailablePiecePositions(
    fromPosition: Position
  ): AvailablePiecePositions {
    const availablePiecePositions: AvailablePiecePositions = new Map()
    const from = this.getPiecePosition(fromPosition)
    if (from.isFree()) {
      return availablePiecePositions
    }
    const oppositeColor = getOppositePieceColor(from.piece.color)
    if (this.isCheck(from.piece.color) || this.isReconquest(oppositeColor)) {
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
          if (to.isOccupied() && to.piece.color === oppositeColor) {
            if (!to.piece.canBeCapturedBy(from.piece.getType())) {
              continue
            }
          }
          availablePiecePositions.set(toPosition.toString(), to)
        }
      }
      return availablePiecePositions
    }

    // TODO: Hubris `powerOfHubrisAttraction`: Opposing Ego must get as close as possible to the Hubris, if the diagonal of the Hubris is free (only needed to check if last move was from a Hubris)
    const positionsOffsets = from.piece.getPositionsOffsets(BoardBase.SIZE)
    // TODO: Carolo `shouldMoveUntilObstacle` only the last possible (until obstacle) position is available, get maximum possible offset for top, bottom, left, right
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
      if (
        this.isCaptureMove(fromPosition, toPosition) &&
        !to.piece.canBeCapturedBy(from.piece.getType())
      ) {
        continue
      }
      availablePiecePositions.set(toPosition.toString(), to)
    }
    for (const [key, to] of availablePiecePositions) {
      if (this.isCheckAfterMove(fromPosition, to.position)) {
        availablePiecePositions.delete(key)
      }
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
    return to.isOccupied() && from.piece.color !== to.piece.color
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
      // TODO: Carolo can move again after bounce (Border or Aymon)
      // TODO: Carolo automatically stop bouncing after 2 seconds
      isNextPlayerTurn: true
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
        piecePosition.piece.getType() === 'CAROLO'
      ) {
        return true
      }
    }
    return false
  }

  public isCheckAfterMove(
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
