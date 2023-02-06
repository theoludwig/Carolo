import { create } from 'zustand'
import type {
  GameState,
  PlayerState,
  BoardBaseState,
  Position,
  AvailablePiecePositions
} from '@carolo/game'
import { Game, Board, Player } from '@carolo/game'

import { NODE_ENV } from '@/lib/configuration'

export interface GameStore {
  board: Board
  boardState: BoardBaseState

  players: Player[]
  playersState: PlayerState[]

  game: Game
  gameState: GameState

  selectedPosition: Position | null
  availablePiecePositions: AvailablePiecePositions
  selectPosition: (fromPosition: Position) => void
}

export const useGame = create<GameStore>()((set) => {
  const board = new Board()
  const player1 = new Player('Joueur 1', 'WHITE')
  const player2 = new Player('Joueur 2', 'BLACK')
  const players = [player1, player2]
  const game = new Game(board, players, {
    logger: NODE_ENV !== 'production'
  })
  return {
    board,
    boardState: board.state,

    players,
    playersState: players.map((player) => {
      return player.state
    }),

    game,
    gameState: game.state,

    selectedPosition: null,
    availablePiecePositions: new Map(),
    selectPosition: (fromPosition: Position) => {
      return set((state) => {
        const piecePosition = state.board.getPiecePosition(fromPosition)
        if (
          state.selectedPosition != null &&
          state.availablePiecePositions.has(fromPosition.toString())
        ) {
          game.playMove(state.selectedPosition, fromPosition)
          return {
            availablePiecePositions: new Map(),
            selectedPosition: null
          }
        }
        if (piecePosition.isFree()) {
          return {
            availablePiecePositions: new Map(),
            selectedPosition: null
          }
        }
        const currentPlayer = state.game.getCurrentPlayer()
        if (currentPlayer.color !== piecePosition.piece.color) {
          return {
            availablePiecePositions: new Map(),
            selectedPosition: null
          }
        }
        return {
          selectedPosition: fromPosition,
          availablePiecePositions:
            state.board.getAvailablePiecePositions(fromPosition)
        }
      })
    }
  }
})
