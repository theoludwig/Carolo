import type { Piece } from './pieces/Piece'
import type { Position } from './Position'

export interface PiecePositionOptions {
  position: Position
  piece?: Piece | null
}

export class PiecePosition implements PiecePositionOptions {
  private readonly _position: Position
  private _piece: Piece | null
  private readonly _initialPiece: Piece | null

  public constructor(options: PiecePositionOptions) {
    this._piece = options.piece ?? null
    this._initialPiece = this._piece
    this._position = options.position
  }

  public get position(): Position {
    return this._position
  }

  public get piece(): Piece {
    if (this._piece === null) {
      throw new Error('Position must be occupied.')
    }
    return this._piece
  }

  public set piece(piece: Piece | null) {
    this._piece = piece
  }

  public get initialPiece(): Piece | null {
    return this._initialPiece
  }

  public isFree(): boolean {
    return this._piece === null
  }

  public isOccupied(): boolean {
    return !this.isFree()
  }
}
