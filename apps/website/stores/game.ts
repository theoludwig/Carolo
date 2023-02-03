import { create } from 'zustand'
import type { GameState, PlayerState, BoardBaseState } from '@carolo/game'
import { Game, Board, Player } from '@carolo/game'

export interface GameStore {
  board: Board
  boardState: BoardBaseState

  player1: Player
  player1State: PlayerState

  player2: Player
  player2State: PlayerState

  game: Game
  gameState: GameState
}

export const useGame = create<GameStore>()(() => {
  const board = new Board()
  const player1 = new Player('Player 1', 'WHITE')
  const player2 = new Player('Player 2', 'BLACK')
  const players = [player1, player2]
  const game = new Game(board, players)
  return {
    board,
    boardState: board.state,

    player1,
    player1State: player1.state,

    player2,
    player2State: player2.state,

    game,
    gameState: game.state
  }
})
