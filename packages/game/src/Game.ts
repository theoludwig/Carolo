import type { Board } from './Board.js'
import type { PieceColor } from './pieces/Piece.js'
import { getOppositePieceColor } from './pieces/Piece.js'
import type { Player } from './Player.js'
import type { Position } from './Position.js'

export const GameStatuses = ['LOBBY', 'PLAY', 'WHITE_WON', 'BLACK_WON'] as const
export type GameStatus = (typeof GameStatuses)[number]

export class Game {
  private readonly _board: Board
  private readonly _players: Player[]
  private _currentPlayerIndex: number
  private _status: GameStatus

  public constructor(board: Board, players: Player[]) {
    if (players.length !== 2) {
      throw new Error('Game must have 2 players.')
    }
    this._board = board
    this._players = new Array(2)
    this._players[0] = players[0]
    this._players[1] = players[1]
    this._currentPlayerIndex = 0
    this._status = 'LOBBY'
  }

  public getCurrentPlayer(): Player {
    return this._players[this._currentPlayerIndex]
  }

  public getPlayer(index: number): Player {
    return this._players[index]
  }

  public setPlayerName(index: number, name: string): void {
    this._players[index].name = name
  }

  public setPlayerColor(index: number, color: PieceColor): void {
    const oppositeColor = getOppositePieceColor(color)
    this._players[index].color = color
    this._players[1 - index].color = oppositeColor
  }

  public get board(): Board {
    return this._board
  }

  public play(): void {
    this._board.reset()
    for (const player of this._players) {
      player.removeAllCapturedPiece()
    }
    this._status = 'PLAY'
    if (this._players[1].color === 'WHITE') {
      this._currentPlayerIndex = 1
    }
  }

  public restart(): void {
    this._status = 'LOBBY'
    this._currentPlayerIndex = 0
  }

  public playMove(fromPosition: Position, toPosition: Position): void {
    if (this._status !== 'PLAY') {
      return
    }
    const from = this._board.getPiecePosition(fromPosition)
    const to = this._board.getPiecePosition(toPosition)
    if (from.isFree()) {
      return
    }
    const currentPlayer = this.getCurrentPlayer()
    if (from.piece.color !== currentPlayer.color) {
      return
    }
    const isCaptureMove = this._board.isCaptureMove(fromPosition, toPosition)
    if (this._board.move(fromPosition, toPosition)) {
      if (isCaptureMove) {
        currentPlayer.addCapturedPiece(to.piece)
      }
      this.nextPlayer()
    }
  }

  public get status(): GameStatus {
    return this._status
  }

  private nextPlayer(): void {
    this._currentPlayerIndex = 1 - this._currentPlayerIndex
  }
}
