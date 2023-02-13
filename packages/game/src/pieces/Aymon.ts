import type { PieceType } from './Piece.js'
import { Piece } from './Piece.js'
import type { Position } from '../Position.js'

export class Aymon extends Piece {
  public override canMoveTeleportAnywhere(): boolean {
    return true
  }

  /**
   * Can teleport to any position on the board. (not implemented)
   * @param maximumOffset
   * @returns
   */
  public getPositionsOffsets(): Position[] {
    throw new Error('Not implemented')
  }

  public getCapturablePiecesTypes(): PieceType[] {
    return []
  }

  public get type(): PieceType {
    return 'AYMON'
  }
}
