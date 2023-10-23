import type { Position } from "../Position.js"

export const PieceColors = ["WHITE", "BLACK"] as const
export type PieceColor = (typeof PieceColors)[number]

export const getOppositePieceColor = (color: PieceColor): PieceColor => {
  return color === "WHITE" ? "BLACK" : "WHITE"
}

export const PieceTypes = [
  "AYMON",
  "BAYARD",
  "CAROLO",
  "EGO",
  "HUBRIS",
] as const
export type PieceType = (typeof PieceTypes)[number]

export abstract class Piece {
  private moveCount = 0
  private readonly _color: PieceColor

  public constructor(color: PieceColor) {
    this._color = color
  }

  public static getDirection(color: PieceColor): number {
    return color === "WHITE" ? 1 : -1
  }

  public getDirection(): number {
    return Piece.getDirection(this._color)
  }

  public move(): void {
    this.moveCount++
  }

  public undoMove(): void {
    this.moveCount = Math.max(0, this.moveCount - 1)
  }

  public get hasMoved(): boolean {
    return this.moveCount > 0
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

  public canMoveTeleportAnywhere(): boolean {
    return false
  }

  public shouldMoveUntilObstacle(): boolean {
    return false
  }

  public canBounce(): boolean {
    return false
  }

  public abstract getPositionsOffsets(maximumOffset: number): Position[]

  public abstract getCapturablePiecesTypes(): PieceType[]

  public abstract get type(): PieceType
}
