import { Game, Board, Player } from '../index.js'

export interface CreateGameResult {
  board: Board
  players: Player[]
  game: Game
}

export const createGame = (): CreateGameResult => {
  const board = new Board()
  const player1 = new Player('Player 1', 'WHITE')
  const player2 = new Player('Player 2', 'BLACK')
  const players = [player1, player2]
  const game = new Game(board, players)
  return {
    board,
    players,
    game
  }
}
