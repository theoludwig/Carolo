import type { GameUser } from "@carolo/models"

import { Game } from "@/components/Game/Game"
import type { GameStoreOptions } from "@/stores/game"

const GameLocalPage = (): JSX.Element => {
  const users: GameUser[] = [
    {
      id: 1,
      name: "Joueur 1",
      color: "WHITE",
      logo: null,
    },
    {
      id: 2,
      name: "Joueur 2",
      color: "BLACK",
      logo: null,
    },
  ]
  const options: GameStoreOptions = {
    users,
    playWithColors: ["WHITE", "BLACK"],
    status: "PLAY",
    actions: [],
  }

  return <Game options={options} />
}

export default GameLocalPage
