import { BoardBase } from './BoardBase.js'
import type { PiecePosition } from './PiecePosition.js'
import type { PieceColor } from './pieces/Piece.js'
import { getOppositePieceColor } from './pieces/Piece.js'
import type { Position } from './Position.js'

export class Board extends BoardBase {
  public getAvailableMoves(fromPosition: Position): PiecePosition[] {
    const from = this.getPiecePosition(fromPosition)
    if (from.isFree()) {
      return []
    }
    const oppositeColor = getOppositePieceColor(from.piece.color)
    if (this.isCheck(from.piece.color) || this.isReconquest(oppositeColor)) {
      return []
    }
    let availableMoves: PiecePosition[] = []
    availableMoves = availableMoves.filter((to) => {
      return !this.isCheckAfterMove(fromPosition, to.position)
    })
    return availableMoves
  }

  public canMove(fromPosition: Position, toPosition: Position): boolean {
    return this.getAvailableMoves(fromPosition).includes(
      this.getPiecePosition(toPosition)
    )
  }

  public isCaptureMove(fromPosition: Position, toPosition: Position): boolean {
    const from = this.getPiecePosition(fromPosition)
    const to = this.getPiecePosition(toPosition)
    return to.isOccupied() && from.piece.color !== to.piece.color
  }

  public move(fromPosition: Position, toPosition: Position): boolean {
    if (!this.canMove(fromPosition, toPosition)) {
      return false
    }
    const from = this.getPiecePosition(fromPosition)
    const to = this.getPiecePosition(toPosition)
    to.piece = from.piece
    from.piece = null
    to.piece.setHasMoved()
    return true
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
    const movesOffsets = egoPiecePosition.piece.getMovesOffsets(BoardBase.SIZE)
    for (const moveOffset of movesOffsets) {
      const position = fromPosition.add(moveOffset)
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
    const fromPiece = from.piece
    const toPiece = to.piece
    from.piece = null
    to.piece = fromPiece
    const isCheck = this.isCheck(fromPiece.color)
    from.piece = fromPiece
    to.piece = toPiece
    return isCheck
  }
}
