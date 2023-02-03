import type { Position } from '../Position'

export const PieceColors = ['WHITE', 'BLACK'] as const
export type PieceColor = (typeof PieceColors)[number]

export const getOppositePieceColor = (color: PieceColor): PieceColor => {
  return color === 'WHITE' ? 'BLACK' : 'WHITE'
}

export const PieceTypes = [
  'AYMON',
  'BAYARD',
  'CAROLO',
  'EGO',
  'HUBRIS'
] as const
export type PieceType = (typeof PieceTypes)[number]

export abstract class Piece {
  private _hasMoved: boolean
  private readonly _color: PieceColor

  public constructor(color: PieceColor) {
    this._hasMoved = false
    this._color = color
  }

  public static getDirection(color: PieceColor): number {
    return color === 'WHITE' ? 1 : -1
  }

  public getDirection(): number {
    return Piece.getDirection(this._color)
  }

  public setHasMoved(): void {
    this._hasMoved = true
  }

  public get hasMoved(): boolean {
    return this._hasMoved
  }

  public get color(): PieceColor {
    return this._color
  }

  public canBeCapturedBy(piece: PieceType): boolean {
    return this.getCapturablePiecesTypes().includes(piece)
  }

  public canJumpOverPieces(): boolean {
    return false
  }

  public shouldMoveUntilObstacle(): boolean {
    return false
  }

  public abstract getMovesOffsets(maximumOffset: number): Position[]

  public abstract getCapturablePiecesTypes(): PieceType[]

  public abstract getType(): PieceType
}
