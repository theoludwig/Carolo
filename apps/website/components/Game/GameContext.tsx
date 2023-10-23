"use client"

import { createContext, useRef, useEffect } from "react"
import type { StoreApi } from "zustand"
import { io } from "socket.io-client"
import type { Socket } from "socket.io-client"
import type { GameAction, GameUser } from "@carolo/models"

import { useAuthentication } from "@/stores/authentication"
import type { GameStore, GameStoreOptions } from "@/stores/game"
import { createGameStore } from "@/stores/game"
import { API_URL } from "@/lib/configurations"

export const GameContext = createContext<StoreApi<GameStore> | null>(null)

export type GameContextProviderProps = React.PropsWithChildren<{
  options: GameStoreOptions
}>

export const GameContextProvider = (
  props: GameContextProviderProps,
): JSX.Element => {
  const { children, options } = props

  const storeRef = useRef<StoreApi<GameStore>>(createGameStore(options))
  const { authenticated, user } = useAuthentication()

  useEffect(() => {
    const gameStore = storeRef.current
    const playWithColors = [...gameStore.getState().playWithColors]
    for (const gameUser of options.users) {
      if (
        authenticated &&
        gameUser.id === user.id &&
        !playWithColors.includes(gameUser.color)
      ) {
        playWithColors.push(gameUser.color)
      }
    }
    gameStore.setState({
      playWithColors,
    })
  }, [authenticated, options.users, user])

  useEffect(() => {
    let socket: Socket | null = null
    const gameStore = storeRef.current

    if (options.gameId != null) {
      socket = io(API_URL)
      socket.emit("game:join", options.gameId)
      socket.on("connect", () => {
        console.log("socket.connect: ", {
          gameId: options.gameId,
          clientId: socket?.id,
        })
      })

      socket.on("game:joinPlayer", (gameUser: GameUser) => {
        console.log("socket.game:joinPlayer: ", gameUser)
        gameStore.setState((state) => {
          const users = [...state.users, gameUser]
          const playWithColors = [...state.playWithColors]
          if (authenticated) {
            const gameUser = users.find((gameUser) => {
              return gameUser.id === user.id
            })
            if (gameUser != null && !playWithColors.includes(gameUser.color)) {
              playWithColors.push(gameUser.color)
            }
          }
          return {
            users,
            playWithColors,
          }
        })
        gameStore.getState().game.restart()
        gameStore.getState().game.play()
      })

      socket.on("game:action", (action: GameAction) => {
        console.log("socket.game:action: ", action)
        gameStore.getState().game.lastMove()
        gameStore.getState().playGlobalAction(action)
      })
    }

    return () => {
      if (socket != null) {
        socket.disconnect()
      }
    }
  }, [authenticated, options.gameId, user])

  return (
    <GameContext.Provider value={storeRef.current}>
      {children}
    </GameContext.Provider>
  )
}
