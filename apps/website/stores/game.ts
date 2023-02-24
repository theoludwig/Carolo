import { useContext } from 'react'
import type { StoreApi } from 'zustand'
import { createStore, useStore } from 'zustand'
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
  PositionString,
  Move
} from '@carolo/game'
import { Game, Board, Player, Position } from '@carolo/game'

import { GameContext } from '@/components/Game/GameContext'
import { useAuthentication } from '@/stores/authentication'

export interface GameStoreOptions {
  gameId?: GameModel['id']
  users: GameUser[]
  playWithColors: PieceColor[]
  status: GameModel['status']
  actions: GameActionBasic[]
}

export interface GameStore {
  gameId?: GameModel['id']
  users: GameUser[]
  playWithColors: PieceColor[]

  board: Board
  boardState: BoardBaseState

  players: Player[]
  playersState: PlayerState[]

  game: Game
  gameState: GameState

  selectedPosition: Position | null
  availablePiecePositions: AvailablePiecePositions

  canPlay: () => boolean
  playGlobalAction: (action: GameActionBasic) => Move | null
  playAction: (action: GameActionBasic) => Move | null
  resetSelectedPosition: () => void
  selectPosition: (fromPosition: Position) => void
}

type BoardSubscription = (boardState: BoardBaseState) => void
type PlayerSubscription = (playerState: PlayerState) => void
type GameSubscription = (gameState: GameState) => void

export const createGameStore = (
  options: GameStoreOptions
): StoreApi<GameStore> => {
  return createStore<GameStore>()((set, get) => {
    const { gameId, users, playWithColors, status, actions } = options
    const board = new Board()
    const player1 = new Player('WHITE')
    const player2 = new Player('BLACK')
    const players = [player1, player2]
    const game = new Game(board, players)

    const playGlobalAction = (action: GameActionBasic): Move | null => {
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
          return move
        } catch {
          return null
        }
      }
      if (action.type === 'SKIP_BOUNCING') {
        game.skipBouncing()
      }
      if (action.type === 'RESIGN') {
        const currentPlayer = game.getCurrentPlayer()
        game.resign(currentPlayer.color)
      }
      return null
    }

    if (status === 'PLAY') {
      game.restart()
      game.play()
      for (const action of actions) {
        playGlobalAction(action)
      }
    }

    const boardSubscription: BoardSubscription = (boardState) => {
      set({ boardState })
    }
    board.subscribe(boardSubscription)

    const playerSubscriptions: PlayerSubscription[] = []
    for (let playerIndex = 0; playerIndex < players.length; playerIndex++) {
      const playerSubscription: PlayerSubscription = (playerState) => {
        set((state) => {
          const playersState = [...state.playersState]
          playersState[playerIndex] = playerState
          return { playersState }
        })
      }
      players[playerIndex].subscribe(playerSubscription)
      playerSubscriptions.push(playerSubscription)
    }

    const gameSubscription: GameSubscription = (gameState) => {
      set({ gameState })
    }
    game.subscribe(gameSubscription)

    return {
      gameId,
      users,
      playWithColors,

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
        return store.playWithColors.includes(currentPlayer.color)
      },
      playGlobalAction,
      playAction: (action) => {
        const store = get()
        let move: Move | null = null
        if (store.canPlay()) {
          move = playGlobalAction(action)
          const { authenticated, authentication } = useAuthentication.getState()
          if (store.gameId != null && authenticated) {
            authentication.api
              .post(`/games/${store.gameId}/actions`, action)
              .catch((error) => {
                console.error(error)
              })
          }
        }
        return move
      },
      resetSelectedPosition: () => {
        return set(() => {
          return {
            availablePiecePositions: new Map(),
            selectedPosition: null
          }
        })
      },
      selectPosition: (fromPosition) => {
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
            try {
              const move = state.playAction({
                type: 'MOVE',
                fromPosition: state.selectedPosition.toString(),
                toPosition: fromPosition.toString()
              })
              if (move == null || move?.isNextPlayerTurn) {
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
}

export const useGame = <T>(
  selector: (state: GameStore) => T,
  equalityFn?: (left: T, right: T) => boolean
): T => {
  const store = useContext(GameContext)
  if (store == null) {
    throw new Error('`useGame` must be used within `GameContextProvider`')
  }
  return useStore(store, selector, equalityFn)
}
