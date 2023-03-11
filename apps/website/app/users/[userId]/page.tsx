import { notFound } from 'next/navigation'
import classNames from 'clsx'

import { api } from '@/lib/configurations'
import type { UserPublicById } from '@/components/UserPublic'
import { UserPublic } from '@/components/UserPublic'
import type { Games } from '@/components/UserGames'
import { UserGames } from '@/components/UserGames'

export interface UsersProfilePageProps {
  params: {
    userId: string
  }
}

const UsersProfilePage = async (
  props: UsersProfilePageProps
): Promise<JSX.Element> => {
  const { userId } = props.params

  let userPublic: UserPublicById
  let games: Games
  try {
    const { data } = await api.get<UserPublicById>(`/users/${userId}`)
    userPublic = data
  } catch {
    return notFound()
  }

  try {
    const { data } = await api.get<Games>(`/users/${userId}/games?limit=100`)
    games = data
  } catch {
    return notFound()
  }

  const hasAlreadyPlayed = games.length > 0

  return (
    <main className='flex flex-1 flex-col items-start justify-start overflow-hidden'>
      <div
        className={classNames(
          'scrollbar-firefox-support my-10 flex w-full flex-col items-center justify-between space-y-4 overflow-y-auto px-14 lg:flex-row lg:items-start lg:space-x-10 lg:space-y-0',
          {
            '!h-full': !hasAlreadyPlayed,
            '!items-center': !hasAlreadyPlayed,
            '!justify-center': !hasAlreadyPlayed,
            '!my-0': !hasAlreadyPlayed
          }
        )}
      >
        <UserPublic userPublic={userPublic} />
        <UserGames games={games} userId={userPublic.user.id} />
      </div>
    </main>
  )
}

export default UsersProfilePage
