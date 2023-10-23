import type { Board, Game, Move, PositionString } from "@carolo/game"
import { Position } from "@carolo/game"

import type { GameActionBasic } from "../GameAction.js"

export interface PlayModelActionOptions {
  action: GameActionBasic
  board: Board
  game: Game
}

export const playModelAction = (
  options: PlayModelActionOptions,
): Move | null => {
  const { action, board, game } = options
  if (
    action.type === "MOVE" &&
    action.fromPosition != null &&
    action.toPosition != null
  ) {
    const fromPosition = Position.fromString(
      action.fromPosition as PositionString,
    )
    const toPosition = Position.fromString(action.toPosition as PositionString)

    const lastMove = board.getLastMove()
    if (
      lastMove != null &&
      lastMove.fromPosition.equals(fromPosition) &&
      lastMove.toPosition.equals(toPosition)
    ) {
      return null
    }

    try {
      const move = game.playMove(fromPosition, toPosition)
      return move
    } catch (error) {
      console.error(error)
      return null
    }
  }
  if (action.type === "SKIP_BOUNCING") {
    game.skipBouncing()
  }
  if (action.type === "RESIGN" && action.color != null) {
    game.resign(action.color)
  }
  return null
}
