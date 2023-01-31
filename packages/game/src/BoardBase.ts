import { PiecePosition } from './PiecePosition.js'
import { Aymond } from './pieces/Aymond.js'
import { Bayard } from './pieces/Bayard.js'
import { Carolo } from './pieces/Carolo.js'
import { Ego } from './pieces/Ego.js'
import { Hubris } from './pieces/Hubris.js'
import type { PieceColor } from './pieces/Piece.js'
import { Position } from './Position.js'

export abstract class BoardBase {
  public static readonly SIZE = 8
  private readonly _board: PiecePosition[][]

  constructor() {
    this._board = new Array(BoardBase.SIZE)
    this.reset()
  }

  public reset(): void {
    for (let row = 0; row < BoardBase.SIZE; row++) {
      for (let column = 0; column < BoardBase.SIZE; column++) {
        this._board[row][column] = new PiecePosition({
          position: new Position({ row, column })
        })
      }
    }
    this.setupPieces('WHITE')
    this.setupPieces('BLACK')
  }

  public getLastRow(color: PieceColor): number {
    return color === 'BLACK' ? 0 : BoardBase.SIZE - 1
  }

  public getAymondInitialRow(color: PieceColor): number {
    return color === 'BLACK' ? 1 : BoardBase.SIZE - 2
  }

  public getHubrisInitialRow(color: PieceColor): number {
    return color === 'BLACK' ? 2 : BoardBase.SIZE - 3
  }

  public getEgoPiecePosition(color: PieceColor): PiecePosition {
    for (let row = 0; row < BoardBase.SIZE; row++) {
      for (let column = 0; column < BoardBase.SIZE; column++) {
        const piecePosition = this._board[row][column]
        if (
          piecePosition.isOccupied() &&
          piecePosition?.piece?.color === color &&
          piecePosition.piece.getType() === 'EGO'
        ) {
          return piecePosition
        }
      }
    }
    throw new Error('Ego piece not found.')
  }

  public getPiecePosition(position: Position): PiecePosition {
    return this._board[position.row][position.column]
  }

  private setupPieces(color: PieceColor): void {
    const lastRow = this.getLastRow(color)
    this._board[lastRow][2].piece = new Bayard(color)
    this._board[lastRow][5].piece = new Bayard(color)

    this._board[lastRow][color === 'WHITE' ? 3 : 4].piece = new Ego(color)
    this._board[lastRow][color === 'WHITE' ? 4 : 3].piece = new Carolo(color)

    const hubrisRow = this.getHubrisInitialRow(color)
    this._board[hubrisRow][2].piece = new Hubris(color)
    this._board[hubrisRow][5].piece = new Hubris(color)

    const aymondRow = this.getAymondInitialRow(color)
    for (let column = 0; column < BoardBase.SIZE; column++) {
      this._board[aymondRow][column].piece = new Aymond(color)
    }
  }
}
