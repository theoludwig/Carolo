import { Observer } from './Observer.js'
import type { Piece, PieceColor } from './pieces/Piece.js'

export interface PlayerState {
  color: PieceColor
  capturedPieces: Piece[]
}

export class Player extends Observer<PlayerState> {
  public constructor(color: PieceColor) {
    super({ color, capturedPieces: [] })
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
