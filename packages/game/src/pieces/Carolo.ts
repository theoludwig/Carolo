import { Position } from '../Position.js'
import type { PieceType } from './Piece.js'
import { Piece } from './Piece.js'

export class Carolo extends Piece {
  public override shouldMoveUntilObstacle(): boolean {
    return true
  }

  public getPositionsOffsets(maximumOffset: number): Position[] {
    const positionsOffsets: Position[] = []
    for (let iteration = 1; iteration < maximumOffset; iteration++) {
      const top = new Position({ column: 0, row: iteration })
      const bottom = new Position({ column: 0, row: -iteration })
      const left = new Position({ column: -iteration, row: 0 })
      const right = new Position({ column: iteration, row: 0 })
      positionsOffsets.push(top)
      positionsOffsets.push(bottom)
      positionsOffsets.push(left)
      positionsOffsets.push(right)
    }
    return positionsOffsets
  }

  public getCapturablePiecesTypes(): PieceType[] {
    return ['HUBRIS']
  }

  public get type(): PieceType {
    return 'CAROLO'
  }
}
