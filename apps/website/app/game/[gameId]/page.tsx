import { redirect } from "next/navigation"
import type { Services } from "@carolo/models"

import { Game } from "@/components/Game/Game"
import type { GameStoreOptions } from "@/stores/game"
import { api } from "@/lib/configurations"

export interface GameMultiplayerPageProps {
  params: {
    gameId: string
  }
}

const GameMultiplayerPage = async (
  props: GameMultiplayerPageProps,
): Promise<JSX.Element> => {
  const { gameId } = props.params

  const options: GameStoreOptions = {
    gameId,
    users: [],
    playWithColors: [],
    status: "LOBBY",
    actions: [],
  }

  try {
    const { data } = await api.get<
      Services["/games/:gameId"]["get"]["response"]
    >(`/games/${gameId}`)

    if (data.playerWhite != null) {
      options.users.push(data.playerWhite)
    }

    if (data.playerBlack != null) {
      options.users.push(data.playerBlack)
    }

    options.status = data.status
    options.actions = data.actions
  } catch {
    return redirect("/game")
  }

  return <Game options={options} />
}

export default GameMultiplayerPage
