import { create } from 'zustand'
import type {
  GameActionBasic,
  GameUser,
  Game as GameModel
} from '@carolo/models'
import type {
  GameState,
  PlayerState,
  BoardBaseState,
  AvailablePiecePositions,
  PieceColor,
  PositionString
} from '@carolo/game'
import { Game, Board, Player, Position } from '@carolo/game'

import { useAuthentication } from '@/stores/authentication'

export interface GameStoreOptions {
  playWithColors: PieceColor[]
  gameId?: GameModel['id']
}

export interface GameStore {
  options: GameStoreOptions
  users: GameUser[]

  board: Board
  boardState: BoardBaseState

  players: Player[]
  playersState: PlayerState[]

  game: Game
  gameState: GameState

  selectedPosition: Position | null
  availablePiecePositions: AvailablePiecePositions

  canPlay: () => boolean
  setOptions: (options: GameStoreOptions) => void
  setUsers: (users: GameUser[]) => void
  playGlobalAction: (action: GameActionBasic) => void
  playAction: (action: GameActionBasic) => void
  resetSelectedPosition: () => void
  selectPosition: (fromPosition: Position) => void
}

export const useGame = create<GameStore>()((set, get) => {
  const board = new Board()
  const player1 = new Player('WHITE')
  const player2 = new Player('BLACK')
  const players = [player1, player2]
  const game = new Game(board, players)
  return {
    options: {
      playWithColors: []
    },
    users: [],

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

    canPlay: () => {
      const store = get()
      const currentPlayer = store.game.getCurrentPlayer()
      return store.options.playWithColors.includes(currentPlayer.color)
    },
    setOptions: (options: GameStoreOptions) => {
      return set(() => {
        return { options }
      })
    },
    setUsers: (users: GameUser[]) => {
      return set((state) => {
        const newUsers = [...state.users, ...users]
        return { users: newUsers }
      })
    },
    playGlobalAction: (action: GameActionBasic) => {
      return set((state) => {
        if (state.gameState.status !== 'PLAY') {
          return {
            availablePiecePositions: new Map(),
            selectedPosition: null
          }
        }
        if (
          action.type === 'MOVE' &&
          action.fromPosition != null &&
          action.toPosition != null
        ) {
          const fromPosition = Position.fromString(
            action.fromPosition as PositionString
          )
          const toPosition = Position.fromString(
            action.toPosition as PositionString
          )
          try {
            const move = game.playMove(fromPosition, toPosition)
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
          } catch {
            return {
              availablePiecePositions: new Map(),
              selectedPosition: null
            }
          }
        }

        if (action.type === 'SKIP_BOUNCING') {
          state.game.skipBouncing()
        }

        if (action.type === 'RESIGN') {
          const currentPlayer = state.game.getPlayer(
            state.gameState.currentPlayerIndex
          )
          state.game.resign(currentPlayer.color)
        }

        return {
          availablePiecePositions: new Map(),
          selectedPosition: null
        }
      })
    },
    playAction: (action: GameActionBasic) => {
      const store = get()
      if (store.canPlay()) {
        store.playGlobalAction(action)
        const { authenticated, authentication } = useAuthentication.getState()
        if (store.options.gameId != null && authenticated) {
          authentication.api
            .post(`/games/${store.options.gameId}/actions`, action)
            .catch((error) => {
              console.error(error)
            })
        }
      }
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
          return {
            availablePiecePositions: new Map(),
            selectedPosition: null
          }
        }
        if (!state.canPlay()) {
          return {
            availablePiecePositions: new Map(),
            selectedPosition: null
          }
        }
        if (fromPosition.equals(state.selectedPosition)) {
          const from = state.board.getPiecePosition(fromPosition)
          if (
            from.isOccupied() &&
            from.piece.type === 'CAROLO' &&
            state.gameState.isBouncingOnGoing
          ) {
            state.playAction({
              type: 'SKIP_BOUNCING'
            })
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
          state.playAction({
            type: 'MOVE',
            fromPosition: state.selectedPosition.toString(),
            toPosition: fromPosition.toString()
          })
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
