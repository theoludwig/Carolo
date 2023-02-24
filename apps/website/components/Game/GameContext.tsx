'use client'

import { createContext, useRef, useEffect } from 'react'
import type { StoreApi } from 'zustand'
import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client'
import type { GameAction, GameUser } from '@carolo/models'

import type { GameStore, GameStoreOptions } from '@/stores/game'
import { createGameStore } from '@/stores/game'
import { API_URL } from '@/lib/configurations'

export const GameContext = createContext<StoreApi<GameStore> | null>(null)

export type GameContextProviderProps = React.PropsWithChildren<{
  options: GameStoreOptions
}>

export const GameContextProvider = (
  props: GameContextProviderProps
): JSX.Element => {
  const { children, options } = props

  const storeRef = useRef<StoreApi<GameStore>>(createGameStore(options))

  useEffect(() => {
    let socket: Socket | null = null
    const gameStore = storeRef.current
    const gameStoreState = gameStore.getState()

    if (options.gameId != null) {
      socket = io(API_URL)
      socket.emit('game:join', options.gameId)
      socket.on('connect', () => {
        console.log('socket.connect: ', {
          gameId: options.gameId,
          clientId: socket?.id
        })
      })

      socket.on('game:joinPlayer', (gameUser: GameUser) => {
        console.log('socket.game:joinPlayer: ', gameUser)
        gameStore.setState((state) => {
          return {
            users: [...state.users, gameUser]
          }
        })
        gameStoreState.game.restart()
        gameStoreState.game.play()
      })

      socket.on('game:action', (action: GameAction) => {
        console.log('socket.game:action: ', action)
        const player = gameStoreState.game.getCurrentPlayer()
        if (!options.playWithColors.includes(player.color)) {
          console.log('socket.game:action: applied: ', action)
          gameStoreState.playGlobalAction(action)
        }
      })
    }
  }, [options.gameId, options.playWithColors])

  return (
    <GameContext.Provider value={storeRef.current}>
      {children}
    </GameContext.Provider>
  )
}
