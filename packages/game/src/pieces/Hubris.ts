import type { PieceType } from './Piece.js'
import { Piece } from './Piece.js'
import { Position } from '../Position.js'

export class Hubris extends Piece {
  public getPositionsOffsets(maximumOffset: number): Position[] {
    const positionsOffsets: Position[] = []
    for (let iteration = 1; iteration < maximumOffset; iteration++) {
      const topLeft = new Position({ column: -iteration, row: iteration })
      const topRight = new Position({ column: iteration, row: iteration })
      const bottomLeft = new Position({ column: -iteration, row: -iteration })
      const bottomRight = new Position({ column: iteration, row: -iteration })
      positionsOffsets.push(topLeft, topRight, bottomLeft, bottomRight)
    }
    return positionsOffsets
  }

  public getCapturablePiecesTypes(): PieceType[] {
    return ['BAYARD']
  }

  public get type(): PieceType {
    return 'HUBRIS'
  }
}
