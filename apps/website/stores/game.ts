import { create } from 'zustand'
import type { GameState, PlayerState, BoardBaseState } from '@carolo/game'
import { Game, Board, Player } from '@carolo/game'

export interface GameStore {
  board: Board
  boardState: BoardBaseState

  players: Player[]
  playersState: PlayerState[]

  game: Game
  gameState: GameState
}

export const useGame = create<GameStore>()(() => {
  const board = new Board()
  const player1 = new Player('Joueur 1', 'WHITE')
  const player2 = new Player('Joueur 2', 'BLACK')
  const players = [player1, player2]
  const game = new Game(board, players)
  return {
    board,
    boardState: board.state,

    players,
    playersState: players.map((player) => {
      return player.state
    }),

    game,
    gameState: game.state
  }
})
