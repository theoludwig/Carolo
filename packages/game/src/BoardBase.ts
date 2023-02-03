import { Observer } from './Observer.js'
import { PiecePosition } from './PiecePosition.js'
import { Aymon } from './pieces/Aymon.js'
import { Bayard } from './pieces/Bayard.js'
import { Carolo } from './pieces/Carolo.js'
import { Ego } from './pieces/Ego.js'
import { Hubris } from './pieces/Hubris.js'
import type { Piece, PieceColor } from './pieces/Piece.js'
import { Position } from './Position.js'

export interface Move {
  fromPosition: Position
  toPosition: Position
  capturedPiece?: Piece
  isNextPlayerTurn: boolean
}

export interface BoardBaseState {
  board: PiecePosition[][]
  moves: Move[]
}

export abstract class BoardBase extends Observer<BoardBaseState> {
  public static readonly SIZE = 8

  public constructor() {
    const board = new Array(BoardBase.SIZE)
    for (let row = 0; row < BoardBase.SIZE; row++) {
      board[row] = new Array(BoardBase.SIZE)
    }
    super({ board, moves: [] })
    this.reset()
  }

  public reset(): void {
    this.setState((state) => {
      for (let row = 0; row < BoardBase.SIZE; row++) {
        for (let column = 0; column < BoardBase.SIZE; column++) {
          state.board[row][column] = new PiecePosition({
            position: new Position({ row, column })
          })
        }
      }
      this.setupPieces(state.board, 'WHITE')
      this.setupPieces(state.board, 'BLACK')
      state.moves = []
    })
  }

  public getLastRow(color: PieceColor): number {
    return color === 'BLACK' ? 0 : BoardBase.SIZE - 1
  }

  public getAymonInitialRow(color: PieceColor): number {
    return color === 'BLACK' ? 1 : BoardBase.SIZE - 2
  }

  public getHubrisInitialRow(color: PieceColor): number {
    return color === 'BLACK' ? 2 : BoardBase.SIZE - 3
  }

  public getEgoPiecePosition(color: PieceColor): PiecePosition {
    for (let row = 0; row < BoardBase.SIZE; row++) {
      for (let column = 0; column < BoardBase.SIZE; column++) {
        const piecePosition = this.state.board[row][column]
        if (
          piecePosition.isOccupied() &&
          piecePosition.piece.color === color &&
          piecePosition.piece.getType() === 'EGO'
        ) {
          return piecePosition
        }
      }
    }
    throw new Error('Ego piece not found.')
  }

  public getPiecePosition(position: Position): PiecePosition {
    return this.state.board[position.row][position.column]
  }

  private setupPieces(board: BoardBaseState['board'], color: PieceColor): void {
    const lastRow = this.getLastRow(color)
    board[lastRow][2].piece = new Bayard(color)
    board[lastRow][5].piece = new Bayard(color)

    board[lastRow][color === 'WHITE' ? 3 : 4].piece = new Ego(color)
    board[lastRow][color === 'WHITE' ? 4 : 3].piece = new Carolo(color)

    const hubrisRow = this.getHubrisInitialRow(color)
    board[hubrisRow][2].piece = new Hubris(color)
    board[hubrisRow][5].piece = new Hubris(color)

    const aymonRow = this.getAymonInitialRow(color)
    for (let column = 2; column <= 5; column++) {
      board[aymonRow][column].piece = new Aymon(color)
    }
  }
}
