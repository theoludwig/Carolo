import { redirect } from 'next/navigation'
import type { GameUser, Services } from '@carolo/models'
import type { PieceColor } from '@carolo/game'

import { Game } from '@/components/Game/Game'
import type { GameStoreOptions } from '@/stores/game'
import { GameStoreInitializer } from '@/stores/GameStoreInitializer'
import { useAuthentication } from '@/stores/authentication'
import { api } from '@/lib/configurations'

export interface GameMultiplayerPageProps {
  params: {
    gameId: string
  }
}

const GameMultiplayerPage = async (
  props: GameMultiplayerPageProps
): Promise<JSX.Element> => {
  const { gameId } = props.params
  const { authenticated, user, authentication } = useAuthentication.getState()

  const gameUsers: GameUser[] = []
  try {
    const { data } = await api.get<
      Services['/games/:gameId/lobby']['get']['response']
    >(`/games/${gameId}/lobby`)
    gameUsers.push(...data)
  } catch {
    return redirect('/game')
  }

  if (gameUsers.length === 1 && authenticated) {
    const [gameUser] = gameUsers
    if (gameUser.id !== user.id) {
      try {
        const { data } = await authentication.api.post<
          Services['/games/:gameId/join']['post']['response']
        >(`/games/${gameId}/join`, {})
        gameUsers.push(data)
      } catch {
        return redirect('/game')
      }
    }
  }

  const playWithColors: PieceColor[] = []
  if (authenticated) {
    for (const gameUser of gameUsers) {
      if (gameUser.id === user.id) {
        playWithColors.push(gameUser.color)
        break
      }
    }
  }

  const options: GameStoreOptions = {
    playWithColors,
    gameId
  }

  return (
    <>
      <GameStoreInitializer options={options} users={gameUsers} />
      <Game />
    </>
  )
}

export default GameMultiplayerPage
