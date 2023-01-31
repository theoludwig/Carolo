import type { PieceType } from './Piece.js'
import { Piece } from './Piece.js'
import { Position } from '../Position.js'

export class Hubris extends Piece {
  public getMovesOffsets(maximumOffset: number): Position[] {
    const movesOffsets: Position[] = []
    for (let iteration = 1; iteration < maximumOffset; iteration++) {
      const topLeft = new Position({ column: -iteration, row: iteration })
      const topRight = new Position({ column: iteration, row: iteration })
      const bottomLeft = new Position({ column: -iteration, row: -iteration })
      const bottomRight = new Position({ column: iteration, row: -iteration })
      movesOffsets.push(topLeft)
      movesOffsets.push(topRight)
      movesOffsets.push(bottomLeft)
      movesOffsets.push(bottomRight)
    }
    return movesOffsets
  }

  public getCapturablePiecesTypes(): PieceType[] {
    return ['BAYARD']
  }

  public getType(): PieceType {
    return 'HUBRIS'
  }
}
