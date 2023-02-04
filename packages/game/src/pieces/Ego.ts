import type { PieceType } from './Piece.js'
import { Piece } from './Piece.js'
import { Position } from '../Position.js'

export class Ego extends Piece {
  public getPositionsOffsets(): Position[] {
    const top = new Position({ column: 0, row: 1 })
    const right = new Position({ column: 1, row: 0 })
    const bottom = new Position({ column: 0, row: -1 })
    const left = new Position({ column: -1, row: 0 })
    return [top, right, bottom, left]
  }

  public getCapturablePiecesTypes(): PieceType[] {
    return ['BAYARD']
  }

  public getType(): PieceType {
    return 'EGO'
  }
}
