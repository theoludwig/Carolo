import crypto from 'node:crypto'

import type { PieceColor } from '@carolo/game'
import { getOppositePieceColor, Board, Game, Player } from '@carolo/game'
import type { User, Game as GameModel } from '@carolo/models'

export interface GameMachine {
  id: GameModel['id']
  board: Board
  players: Player[]
  game: Game
}

export interface PlayerState {
  id: User['id']
  gameId: GameModel['id']
  color: PieceColor
}

export class GameRepository {
  private static instance: GameRepository | null = null
  private readonly games = new Map<GameModel['id'], GameMachine>()
  private readonly players = new Map<User['id'], PlayerState>()

  private constructor() {}

  public static getInstance(): GameRepository {
    if (this.instance == null) {
      this.instance = new GameRepository()
    }
    return this.instance
  }

  public createGame(playerId: User['id'], color: PieceColor): GameModel['id'] {
    const board = new Board()
    const player1 = new Player('WHITE')
    const player2 = new Player('BLACK')
    const players = [player1, player2]
    const game = new Game(board, players)
    const gameId = crypto.randomUUID()
    this.games.set(gameId, {
      id: gameId,
      board,
      players,
      game
    })
    this.players.set(playerId, {
      id: playerId,
      gameId,
      color
    })
    return gameId
  }

  public getGameMachine(gameId: GameModel['id']): GameMachine | undefined {
    return this.games.get(gameId)
  }

  public getPlayer(playerId: User['id']): PlayerState | undefined {
    return this.players.get(playerId)
  }

  public getPlayerByColor(
    gameId: GameModel['id'],
    color: PieceColor
  ): PlayerState | undefined {
    const players = this.getPlayers(gameId)
    return players.find((player) => {
      return player.color === color
    })
  }

  public getPlayers(gameId: GameModel['id']): PlayerState[] {
    const players: PlayerState[] = []
    for (const [_playerId, playerState] of this.players) {
      if (playerState.gameId === gameId) {
        players.push(playerState)
      }
    }
    return players
  }

  public joinPlayer(gameId: GameModel['id'], playerId: User['id']): void {
    const gameMachine = this.games.get(gameId)
    const [player] = this.getPlayers(gameId)
    if (gameMachine != null && player != null) {
      const oppositeColor = getOppositePieceColor(player.color)
      this.players.set(playerId, {
        id: playerId,
        gameId,
        color: oppositeColor
      })
    }
  }

  public deleteGame(gameId: GameModel['id']): void {
    this.games.delete(gameId)
    const players = this.getPlayers(gameId)
    for (const player of players) {
      this.players.delete(player.id)
    }
  }
}
