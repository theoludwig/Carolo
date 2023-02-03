'use client'

import type { BoardBaseState, GameState, PlayerState } from '@carolo/game'
import { useEffect } from 'react'

import { useGame } from './game'

type PlayerSubscription = (playerState: PlayerState) => void

export const GameStoreInitializer = (): JSX.Element => {
  const gameStore = useGame()

  useEffect(() => {
    const boardSubscription = (boardState: BoardBaseState): void => {
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

    const gameSubscription = (gameState: GameState): void => {
      useGame.setState({ gameState })
    }
    gameStore.game.subscribe(gameSubscription)

    return () => {
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
  }, [gameStore.board, gameStore.players, gameStore.game])

  return <></>
}
