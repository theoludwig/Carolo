import type { Board } from './Board.js'
import type { Move } from './BoardBase.js'
import { Observer } from './Observer.js'
import type { PieceColor } from './pieces/Piece.js'
import { getOppositePieceColor } from './pieces/Piece.js'
import type { Player } from './Player.js'
import type { Position } from './Position.js'

export const GameStatuses = ['LOBBY', 'PLAY', 'WHITE_WON', 'BLACK_WON'] as const
export type GameStatus = (typeof GameStatuses)[number]

export interface GameState {
  currentPlayerIndex: number
  status: GameStatus
  isBouncingOnGoing: boolean
}

export interface GameOptions {
  logger?: boolean
}

export class Game extends Observer<GameState> implements GameOptions {
  private readonly _board: Board
  private readonly _players: Player[]
  public readonly logger: boolean

  public constructor(
    board: Board,
    players: Player[],
    options: GameOptions = {}
  ) {
    super({ currentPlayerIndex: 0, status: 'LOBBY', isBouncingOnGoing: false })
    if (players.length !== 2) {
      throw new Error('Game must have 2 players.')
    }
    this.logger = options.logger ?? false
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

  public setPlayerColor(index: number, color: PieceColor): void {
    this._players[index].color = color
    this._players[1 - index].color = getOppositePieceColor(color)
  }

  public play(): void {
    this._board.reset()
    for (const player of this._players) {
      player.removeAllCapturedPiece()
    }
    this.setState((state) => {
      state.status = 'PLAY'
      state.isBouncingOnGoing = false
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
      state.isBouncingOnGoing = false
    })
  }

  public skipBouncing(): void {
    if (!this.state.isBouncingOnGoing) {
      return
    }
    this.setState((state) => {
      state.isBouncingOnGoing = false
    })
    this.nextPlayer()
    this._board.setLastMoveIsNextPlayerTurn()
  }

  public playMove(fromPosition: Position, toPosition: Position): Move {
    if (this.state.status !== 'PLAY') {
      throw new Error('Game Status not in play mode.')
    }
    const from = this._board.getPiecePosition(fromPosition)
    if (from.isFree()) {
      throw new Error('No piece at this position.')
    }
    const currentPlayer = this.getCurrentPlayer()
    if (from.piece.color !== currentPlayer.color) {
      throw new Error('Not your turn.')
    }
    if (!this._board.canMove(fromPosition, toPosition)) {
      throw new Error('This move is not allowed.')
    }
    const oppositeColor = getOppositePieceColor(currentPlayer.color)

    if (this.logger) {
      console.log(
        `game.playMove(new Position({ column: ${fromPosition.column}, row: ${fromPosition.row} }), new Position({ column: ${toPosition.column}, row: ${toPosition.row} }))`
      )
    }

    const move = this._board.move(fromPosition, toPosition)
    if (move.capturedPiece != null) {
      currentPlayer.addCapturedPiece(move.capturedPiece)
    }

    if (
      this._board.isReconquest(currentPlayer.color) ||
      this._board.isCheck(oppositeColor)
    ) {
      this.setState((state) => {
        state.isBouncingOnGoing = false
        state.status = `${currentPlayer.color}_WON`
      })
    } else if (move.isNextPlayerTurn) {
      this.nextPlayer()
    } else {
      this.setState((state) => {
        state.isBouncingOnGoing = true
      })
    }

    return move
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
