import { Observer } from './Observer.js'
import type { Piece, PieceColor } from './pieces/Piece'

export interface PlayerState {
  name: string
  color: PieceColor
  capturedPieces: Piece[]
}

export class Player extends Observer<PlayerState> {
  public constructor(name: string, color: PieceColor) {
    super({ name, color, capturedPieces: [] })
  }

  public get name(): string {
    return this.state.name
  }

  public set name(name: string) {
    this.setState((state) => {
      state.name = name
    })
  }

  public get color(): PieceColor {
    return this.state.color
  }

  public set color(color: PieceColor) {
    this.setState((state) => {
      state.color = color
    })
  }

  public get capturedPieces(): readonly Piece[] {
    return this.state.capturedPieces
  }

  public addCapturedPiece(piece: Piece): void {
    this.setState((state) => {
      state.capturedPieces.push(piece)
    })
  }

  public removeCapturedPiece(piece: Piece): void {
    this.setState((state) => {
      state.capturedPieces = state.capturedPieces.filter((capturedPiece) => {
        return capturedPiece !== piece
      })
    })
  }

  public removeAllCapturedPiece(): void {
    this.setState((state) => {
      state.capturedPieces = []
    })
  }
}
