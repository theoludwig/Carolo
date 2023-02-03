'use client'

import type { BoardBaseState, GameState, PlayerState } from '@carolo/game'
import { useEffect } from 'react'

import { useGame } from './game'

export const GameStoreInitializer = (): JSX.Element => {
  const gameStore = useGame()

  useEffect(() => {
    const boardSubscription = (boardState: BoardBaseState): void => {
      useGame.setState({ boardState })
    }
    gameStore.board.subscribe(boardSubscription)

    const player1Subscription = (player1State: PlayerState): void => {
      useGame.setState({ player1State })
    }
    gameStore.player1.subscribe(player1Subscription)

    const player2Subscription = (player2State: PlayerState): void => {
      useGame.setState({ player2State })
    }
    gameStore.player2.subscribe(player2Subscription)

    const gameSubscription = (gameState: GameState): void => {
      useGame.setState({ gameState })
    }
    gameStore.game.subscribe(gameSubscription)

    return () => {
      gameStore.board.unsubscribe(boardSubscription)

      gameStore.player1.unsubscribe(player1Subscription)
      gameStore.player2.unsubscribe(player2Subscription)

      gameStore.game.unsubscribe(gameSubscription)
    }
  }, [gameStore.board, gameStore.player1, gameStore.player2, gameStore.game])

  return <></>
}
