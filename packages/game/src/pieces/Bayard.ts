import { Position } from '../Position.js'
import type { PieceType } from './Piece.js'
import { Piece } from './Piece.js'

export class Bayard extends Piece {
  public override canJumpOverPieces(): boolean {
    return true
  }

  public getPositionsOffsets(): Position[] {
    const shouldApplyNeyRule = !this.hasMoved
    const topOffsets = [
      new Position({
        column: 1,
        row: 2
      }),
      ...(shouldApplyNeyRule ? [] : [new Position({ column: 0, row: 3 })]),
      new Position({
        column: -1,
        row: 2
      })
    ]
    const rightOffsets = [
      new Position({
        column: 2,
        row: -1
      }),
      new Position({
        column: 3,
        row: 0
      }),
      new Position({
        column: 2,
        row: 1
      })
    ]
    const bottomOffsets = [
      new Position({
        column: -1,
        row: -2
      }),
      ...(shouldApplyNeyRule ? [] : [new Position({ column: 0, row: -3 })]),
      new Position({
        column: 1,
        row: -2
      })
    ]
    const leftOffsets = [
      new Position({
        column: -2,
        row: 1
      }),
      new Position({
        column: -3,
        row: 0
      }),
      new Position({
        column: -2,
        row: -1
      })
    ]
    return [...topOffsets, ...rightOffsets, ...bottomOffsets, ...leftOffsets]
  }

  public getCapturablePiecesTypes(): PieceType[] {
    return ['AYMON']
  }

  public get type(): PieceType {
    return 'BAYARD'
  }
}
