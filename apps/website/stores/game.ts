import { create } from 'zustand'
import type {
  GameState,
  PlayerState,
  BoardBaseState,
  Position,
  AvailablePiecePositions
} from '@carolo/game'
import { Game, Board, Player } from '@carolo/game'

import { NODE_ENV } from '@/lib/configurations'

export interface GameStore {
  board: Board
  boardState: BoardBaseState

  players: Player[]
  playersState: PlayerState[]

  game: Game
  gameState: GameState

  selectedPosition: Position | null
  availablePiecePositions: AvailablePiecePositions
  skipBouncing: () => void
  resetSelectedPosition: () => void
  selectPosition: (fromPosition: Position) => void
}

export const useGame = create<GameStore>()((set) => {
  const board = new Board()
  const player1 = new Player('Joueur 1', 'WHITE')
  const player2 = new Player('Joueur 2', 'BLACK')
  const players = [player1, player2]
  const logger = NODE_ENV !== 'production'
  const game = new Game(board, players, { logger })
  game.play()
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
    skipBouncing: () => {
      return set((state) => {
        if (state.gameState.status !== 'PLAY') {
          return {}
        }
        state.game.skipBouncing()
        return {
          availablePiecePositions: new Map(),
          selectedPosition: null
        }
      })
    },
    resetSelectedPosition: () => {
      return set(() => {
        return {
          availablePiecePositions: new Map(),
          selectedPosition: null
        }
      })
    },
    selectPosition: (fromPosition: Position) => {
      return set((state) => {
        if (state.gameState.status !== 'PLAY') {
          return {}
        }
        if (fromPosition.equals(state.selectedPosition)) {
          const from = state.board.getPiecePosition(fromPosition)
          if (
            from.isOccupied() &&
            from.piece.type === 'CAROLO' &&
            state.gameState.isBouncingOnGoing
          ) {
            state.game.skipBouncing()
          }
          return {
            availablePiecePositions: new Map(),
            selectedPosition: null
          }
        }
        const piecePosition = state.board.getPiecePosition(fromPosition)
        if (
          state.selectedPosition != null &&
          state.availablePiecePositions.has(fromPosition.toString())
        ) {
          try {
            const move = game.playMove(state.selectedPosition, fromPosition)
            if (move.isNextPlayerTurn) {
              return {
                availablePiecePositions: new Map(),
                selectedPosition: null
              }
            }
            return {
              availablePiecePositions: state.board.getAvailablePiecePositions(
                move.toPosition
              ),
              selectedPosition: fromPosition
            }
          } catch (error) {
            if (logger) {
              console.error(error)
            }
            return {
              availablePiecePositions: new Map(),
              selectedPosition: null
            }
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
