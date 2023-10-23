"use client"

import { useGame } from "@/stores/game"
import { Board } from "@/components/Game/Board"
import { Player } from "@/components/Game/Player"
import { RightSidebar } from "@/components/Game/RightSidebar/RightSidebar"
import { LeftSidebar } from "@/components/Game/LeftSidebar/LeftSidebar"

export const GameView = (): JSX.Element => {
  const playersState = useGame((state) => {
    return state.playersState
  })

  const player1 = playersState[0]
  const topPlayerIndex = player1.color === "BLACK" ? 0 : 1
  const bottomPlayerIndex = player1.color === "WHITE" ? 0 : 1

  return (
    <div className="my-2 flex w-full justify-center">
      <LeftSidebar />
      <div className="space-y-4">
        <Player
          playerState={playersState[topPlayerIndex]}
          playerIndex={topPlayerIndex}
        />
        <Board />
        <Player
          playerState={playersState[bottomPlayerIndex]}
          playerIndex={bottomPlayerIndex}
        />
      </div>
      <RightSidebar />
    </div>
  )
}
