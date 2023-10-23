import type { Board } from "./Board.js"
import type { Move } from "./BoardBase.js"
import { Observer } from "./Observer.js"
import type { PieceColor } from "./pieces/Piece.js"
import { getOppositePieceColor } from "./pieces/Piece.js"
import type { Player } from "./Player.js"
import type { Position } from "./Position.js"

export const GameStatuses = ["LOBBY", "PLAY", "WHITE_WON", "BLACK_WON"] as const
export type GameStatus = (typeof GameStatuses)[number]

export interface GameState {
  currentPlayerIndex: number
  status: GameStatus
  isBouncingOnGoing: boolean
  finalStatus: GameStatus
}

export class Game extends Observer<GameState> {
  private readonly _board: Board
  private readonly _players: Player[]

  public constructor(board: Board, players: Player[]) {
    super({
      currentPlayerIndex: 0,
      status: "LOBBY",
      isBouncingOnGoing: false,
      finalStatus: "PLAY",
    })
    if (players.length !== 2) {
      throw new Error("Game must have 2 players.")
    }
    this._board = board
    this._players = Array.from({ length: 2 })
    this._players[0] = players[0]
    this._players[1] = players[1]
  }

  public getCurrentPlayer(): Player {
    return this._players[this.state.currentPlayerIndex]
  }

  public getPlayer(index: number): Player {
    return this._players[index]
  }

  public getPlayerByColor(color: PieceColor): Player {
    return this._players[color === "WHITE" ? 0 : 1]
  }

  public setPlayerColor(index: number, color: PieceColor): void {
    this._players[index].color = color
    this._players[1 - index].color = getOppositePieceColor(color)
  }

  public resign(color: PieceColor): void {
    if (this.state.finalStatus !== "PLAY") {
      return
    }
    const oppositeColor = getOppositePieceColor(color)
    this.setState((state) => {
      state.status = `${oppositeColor}_WON`
      state.finalStatus = state.status
    })
  }

  public previousMove(): void {
    if (this.state.status !== "PLAY") {
      this.setState((state) => {
        state.status = "PLAY"
        state.currentPlayerIndex = 1 - state.currentPlayerIndex
      })
    }
    if (this._board.state.currentMoveIndex === -1) {
      return
    }
    const move = this._board.previousMove()
    if (move != null) {
      if (move.capturedPiece != null) {
        this.getPlayerByColor(move.piece.color).removeCapturedPiece(
          move.capturedPiece,
        )
      }
      this.verifyMove(move)
    }
  }

  public nextMove(): void {
    if (this.state.status !== "PLAY") {
      return
    }
    if (
      this._board.state.currentMoveIndex ===
      this._board.state.moves.length - 1
    ) {
      if (this.state.finalStatus !== "PLAY") {
        this.setState((state) => {
          state.status = state.finalStatus
        })
      }
      return
    }
    const move = this._board.nextMove()
    if (move != null) {
      if (move.capturedPiece != null) {
        this.getPlayerByColor(move.piece.color).addCapturedPiece(
          move.capturedPiece,
        )
      }
      this.verifyMove(move)
    }
    this.setState((state) => {
      if (
        state.finalStatus != null &&
        this._board.state.currentMoveIndex ===
          this._board.state.moves.length - 1
      ) {
        state.status = state.finalStatus
      }
    })
  }

  public firstMove(): void {
    while (this._board.state.currentMoveIndex !== -1) {
      this.previousMove()
    }
  }

  public lastMove(): void {
    while (
      this._board.state.currentMoveIndex !==
      this._board.state.moves.length - 1
    ) {
      this.nextMove()
    }
  }

  public play(): void {
    this._board.reset()
    for (const player of this._players) {
      player.removeAllCapturedPiece()
    }
    this.setState((state) => {
      state.status = "PLAY"
      state.isBouncingOnGoing = false
    })
    if (this._players[1].color === "WHITE") {
      this.setState((state) => {
        state.currentPlayerIndex = 1
      })
    }
  }

  public restart(): void {
    this.setState((state) => {
      state.status = "LOBBY"
      state.currentPlayerIndex = 0
      state.isBouncingOnGoing = false
      state.finalStatus = "PLAY"
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

  private verifyMove(move: Move): void {
    const currentPlayer = this.getCurrentPlayer()
    const oppositeColor = getOppositePieceColor(currentPlayer.color)
    if (
      this._board.isReconquest(currentPlayer.color) ||
      this._board.isCheck(oppositeColor)
    ) {
      this.setState((state) => {
        state.isBouncingOnGoing = false
        state.status = `${currentPlayer.color}_WON`
        state.finalStatus = state.status
      })
    } else if (this._board.isCheck(currentPlayer.color)) {
      this.setState((state) => {
        state.isBouncingOnGoing = false
        state.status = `${oppositeColor}_WON`
        state.finalStatus = state.status
      })
    } else if (move.isNextPlayerTurn) {
      this.nextPlayer()
    } else {
      this.setState((state) => {
        state.isBouncingOnGoing = true
      })
    }
  }

  public playMove(fromPosition: Position, toPosition: Position): Move {
    if (this.state.status !== "PLAY") {
      throw new Error("Game Status not in play mode.")
    }
    const from = this._board.getPiecePosition(fromPosition)
    if (from.isFree()) {
      throw new Error("No piece at this position.")
    }
    const currentPlayer = this.getCurrentPlayer()
    if (from.piece.color !== currentPlayer.color) {
      throw new Error("Not your turn.")
    }
    if (!this._board.canMove(fromPosition, toPosition)) {
      throw new Error("This move is not allowed.")
    }
    const move = this._board.move(fromPosition, toPosition)
    if (move.capturedPiece != null) {
      currentPlayer.addCapturedPiece(move.capturedPiece)
    }
    this.verifyMove(move)
    return move
  }

  public get status(): GameStatus {
    return this.state.status
  }

  private nextPlayer(): void {
    this.setState((state) => {
      state.currentPlayerIndex = 1 - state.currentPlayerIndex
      state.isBouncingOnGoing = false
    })
  }
}
