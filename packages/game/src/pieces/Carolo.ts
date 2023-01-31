import { Position } from '../Position.js'
import type { PieceType } from './Piece.js'
import { Piece } from './Piece.js'

export class Carolo extends Piece {
  public override shouldMoveUntilObstacle(): boolean {
    return true
  }

  public getMovesOffsets(maximumOffset: number): Position[] {
    const movesOffsets: Position[] = []
    for (let iteration = 1; iteration < maximumOffset; iteration++) {
      const top = new Position({ column: 0, row: iteration })
      const bottom = new Position({ column: 0, row: -iteration })
      const left = new Position({ column: -iteration, row: 0 })
      const right = new Position({ column: iteration, row: 0 })
      movesOffsets.push(top)
      movesOffsets.push(bottom)
      movesOffsets.push(left)
      movesOffsets.push(right)
    }
    return movesOffsets
  }

  public getCapturablePiecesTypes(): PieceType[] {
    return ['HUBRIS']
  }

  public getType(): PieceType {
    return 'CAROLO'
  }
}
