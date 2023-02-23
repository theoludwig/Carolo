'use client'

import type { BoardBaseState, GameState, PlayerState } from '@carolo/game'
import type { GameAction, GameUser } from '@carolo/models'
import { useEffect } from 'react'
import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client'

import { API_URL } from '@/lib/configurations'
import type { GameStoreOptions } from '@/stores/game'
import { useGame } from '@/stores/game'

type BoardSubscription = (boardState: BoardBaseState) => void
type PlayerSubscription = (playerState: PlayerState) => void
type GameSubscription = (gameState: GameState) => void

export interface GameStoreInitializerProps {
  options: GameStoreOptions
  users: GameUser[]
}

export const GameStoreInitializer = (
  props: GameStoreInitializerProps
): JSX.Element => {
  const { options, users } = props
  const gameStore = useGame()

  useEffect(() => {
    const boardSubscription: BoardSubscription = (boardState) => {
      useGame.setState({ boardState })
    }
    gameStore.board.subscribe(boardSubscription)

    const playerSubscriptions: PlayerSubscription[] = []
    for (
      let playerIndex = 0;
      playerIndex < gameStore.players.length;
      playerIndex++
    ) {
      const playerSubscription: PlayerSubscription = (playerState) => {
        useGame.setState((state) => {
          const playersState = [...state.playersState]
          playersState[playerIndex] = playerState
          return { playersState }
        })
      }
      gameStore.players[playerIndex].subscribe(playerSubscription)
      playerSubscriptions.push(playerSubscription)
    }

    const gameSubscription: GameSubscription = (gameState) => {
      useGame.setState({ gameState })
    }
    gameStore.game.subscribe(gameSubscription)

    gameStore.setOptions(options)
    gameStore.setUsers(users)
    gameStore.game.restart()
    gameStore.game.play()

    let socket: Socket | null = null
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
        gameStore.setUsers([gameUser])
      })

      socket.on('game:action', (action: GameAction) => {
        console.log('socket.game:action: ', action)
        const player = gameStore.game.getCurrentPlayer()
        if (!options.playWithColors.includes(player.color)) {
          console.log('apply action')
          gameStore.playGlobalAction(action)
        }
      })
    }

    return () => {
      socket?.removeAllListeners()

      gameStore.board.unsubscribe(boardSubscription)

      for (
        let playerIndex = 0;
        playerIndex < gameStore.players.length;
        playerIndex++
      ) {
        gameStore.players[playerIndex].unsubscribe(
          playerSubscriptions[playerIndex]
        )
      }

      gameStore.game.unsubscribe(gameSubscription)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps -- We want to run this effect only once
  }, [])

  return <></>
}
