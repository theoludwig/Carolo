import { notFound } from 'next/navigation'

import { api } from '@/lib/configurations'
import type { UserPublicById } from '@/components/UserPublic'
import { UserPublic } from '@/components/UserPublic'
import type { Games } from '@/components/UserGames'
import { UserGames } from '@/components/UserGames'
import './styles.css'

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

  return (
    <div className='scrollbar-firefox-support mt-10 flex w-full items-start justify-between space-x-10 overflow-y-auto px-14'>
      <UserPublic userPublic={userPublic} />
      <UserGames games={games} userId={userPublic.user.id} />
    </div>
  )
}

export default UsersProfilePage
