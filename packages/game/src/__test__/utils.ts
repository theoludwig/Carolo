import { Game, Board, Player } from '../index.js'

export interface GameMachine {
  board: Board
  players: Player[]
  game: Game
}

export const createGame = (): GameMachine => {
  const board = new Board()
  const player1 = new Player('WHITE')
  const player2 = new Player('BLACK')
  const players = [player1, player2]
  const game = new Game(board, players)
  return {
    board,
    players,
    game
  }
}
