import type { PieceType } from './Piece.js'
import { Piece } from './Piece.js'
import { Position } from '../Position.js'

export class Aymond extends Piece {
  public override canMoveTeleportAnywhere(): boolean {
    return true
  }

  /**
   * Can teleport to any position on the board.
   * @param maximumOffset
   * @returns
   */
  public getMovesOffsets(maximumOffset: number): Position[] {
    const movesOffsets: Position[] = []
    for (let row = 0; row < maximumOffset; row++) {
      for (let column = 0; column < maximumOffset; column++) {
        movesOffsets.push(
          new Position({
            column,
            row
          })
        )
      }
    }
    return movesOffsets
  }

  public getCapturablePiecesTypes(): PieceType[] {
    return []
  }

  public getType(): PieceType {
    return 'AYMOND'
  }
}
