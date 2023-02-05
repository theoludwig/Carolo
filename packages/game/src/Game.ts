import type { Board } from './Board.js'
import { Observer } from './Observer.js'
import { getOppositePieceColor } from './pieces/Piece.js'
import type { Player } from './Player.js'
import type { Position } from './Position.js'

export const GameStatuses = ['LOBBY', 'PLAY', 'WHITE_WON', 'BLACK_WON'] as const
export type GameStatus = (typeof GameStatuses)[number]

export interface GameState {
  currentPlayerIndex: number
  status: GameStatus
}

export class Game extends Observer<GameState> {
  private readonly _board: Board
  private readonly _players: Player[]

  public constructor(board: Board, players: Player[]) {
    super({ currentPlayerIndex: 0, status: 'LOBBY' })
    if (players.length !== 2) {
      throw new Error('Game must have 2 players.')
    }
    this._board = board
    this._players = new Array(2)
    this._players[0] = players[0]
    this._players[1] = players[1]
  }

  public getCurrentPlayer(): Player {
    return this._players[this.state.currentPlayerIndex]
  }

  public getPlayer(index: number): Player {
    return this._players[index]
  }

  public setPlayerName(index: number, name: string): void {
    this._players[index].name = name
  }

  public setPlayerColor(index: number): void {
    const color = this._players[index].color
    this._players[index].color = getOppositePieceColor(color)
    this._players[1 - index].color = color
  }

  public get board(): Board {
    return this._board
  }

  public play(): void {
    this._board.reset()
    for (const player of this._players) {
      player.removeAllCapturedPiece()
    }
    this.setState((state) => {
      state.status = 'PLAY'
    })
    if (this._players[1].color === 'WHITE') {
      this.setState((state) => {
        state.currentPlayerIndex = 1
      })
    }
  }

  public restart(): void {
    this.setState((state) => {
      state.status = 'LOBBY'
      state.currentPlayerIndex = 0
    })
  }

  public playMove(fromPosition: Position, toPosition: Position): void {
    if (this.state.status !== 'PLAY') {
      return
    }
    const from = this._board.getPiecePosition(fromPosition)
    if (from.isFree()) {
      return
    }
    const currentPlayer = this.getCurrentPlayer()
    if (from.piece.color !== currentPlayer.color) {
      return
    }
    if (!this._board.canMove(fromPosition, toPosition)) {
      return
    }
    const oppositeColor = getOppositePieceColor(currentPlayer.color)
    const move = this._board.move(fromPosition, toPosition)
    if (move.capturedPiece != null) {
      currentPlayer.addCapturedPiece(move.capturedPiece)
    }

    if (
      this._board.isReconquest(currentPlayer.color) ||
      this._board.isCheck(oppositeColor)
    ) {
      this.setState((state) => {
        state.status = `${currentPlayer.color}_WON`
      })
    } else if (move.isNextPlayerTurn) {
      this.nextPlayer()
    }
  }

  public get status(): GameStatus {
    return this.state.status
  }

  private nextPlayer(): void {
    this.setState((state) => {
      state.currentPlayerIndex = 1 - state.currentPlayerIndex
    })
  }
}
