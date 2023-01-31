import type { Piece, PieceColor } from './pieces/Piece'

export class Player {
  private _name: string
  private _color: PieceColor
  private _capturedPieces: Piece[]

  constructor(name: string, color: PieceColor) {
    this._name = name
    this._color = color
    this._capturedPieces = []
  }

  public get name(): string {
    return this._name
  }

  public set name(name: string) {
    this._name = name
  }

  public get color(): PieceColor {
    return this._color
  }

  public set color(color: PieceColor) {
    this._color = color
  }

  public get capturedPieces(): Piece[] {
    return [...this._capturedPieces]
  }

  public addCapturedPiece(piece: Piece): void {
    this._capturedPieces.push(piece)
  }

  public removeAllCapturedPiece(): void {
    this._capturedPieces = []
  }
}
