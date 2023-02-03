import { BoardBase } from './BoardBase.js'
import type { PiecePosition } from './PiecePosition.js'
import type { Piece, PieceColor } from './pieces/Piece.js'
import { getOppositePieceColor } from './pieces/Piece.js'
import type { Position } from './Position.js'

export interface Move {
  fromPosition: Position
  toPosition: Position
  capturedPiece?: Piece
  isNextPlayerTurn: boolean
}

export class Board extends BoardBase {
  private _moves: Move[]

  public constructor() {
    super()
    this._moves = []
  }

  public get moves(): Move[] {
    return this._moves
  }

  public override reset(): void {
    super.reset()
    this._moves = []
  }

  public getAvailablePiecePositions(fromPosition: Position): PiecePosition[] {
    const from = this.getPiecePosition(fromPosition)
    if (from.isFree()) {
      return []
    }
    const oppositeColor = getOppositePieceColor(from.piece.color)
    if (this.isCheck(from.piece.color) || this.isReconquest(oppositeColor)) {
      return []
    }
    // TODO: Hubris `powerOfHubrisAttraction`: Opposing Ego must get as close as possible to the Hubris, if the diagonal of the Hubris is free (only needed to check if last move was from a Hubris)
    let availableMoves: PiecePosition[] = []
    const movesOffsets = from.piece.getMovesOffsets(BoardBase.SIZE)
    // TODO: Carolo `shouldMoveUntilObstacle` only the last possible (until obstacle) position is available, get maximum possible offset for top, bottom, left, right
    for (const moveOffset of movesOffsets) {
      const toPosition = fromPosition.add(moveOffset)
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
      availableMoves.push(to)
    }
    availableMoves = availableMoves.filter((to) => {
      return !this.isCheckAfterMove(fromPosition, to.position)
    })
    return availableMoves
  }

  public canMove(fromPosition: Position, toPosition: Position): boolean {
    return this.getAvailablePiecePositions(fromPosition).includes(
      this.getPiecePosition(toPosition)
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
      // TODO: Carolo can move again after bounce (Border or Aymond)
      // TODO: Carolo automatically stop bouncing after 2 seconds
      isNextPlayerTurn: true
    }
    this._moves.push(move)
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
