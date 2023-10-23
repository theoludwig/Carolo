import { notFound, redirect } from "next/navigation"
import classNames from "clsx"

import { api } from "@/lib/configurations"
import type { UserPublicById } from "@/components/UserPublic"
import { UserPublic } from "@/components/UserPublic"
import type { Games } from "@/components/UserGames"
import { UserGames } from "@/components/UserGames"

export interface UsersProfilePageProps {
  params: {
    userId: string
  }
  searchParams: {
    before?: string
    after?: string
    originId?: string
  }
}

const ITEMS_PER_PAGE_LIMIT = 20

const UsersProfilePage = async (
  props: UsersProfilePageProps,
): Promise<JSX.Element> => {
  const { searchParams, params } = props
  const { userId } = params

  let userPublic: UserPublicById | null = null
  let games: Games | null = null
  try {
    const { data } = await api.get<UserPublicById>(`/users/${userId}`)
    userPublic = data
  } catch {
    return notFound()
  }

  let originId = searchParams.originId

  try {
    const urlSearchParams = new URLSearchParams(searchParams)
    urlSearchParams.set("limit", ITEMS_PER_PAGE_LIMIT.toString())
    const { data } = await api.get<Games>(
      `/users/${userId}/games?${urlSearchParams.toString()}`,
    )
    games = data
    if (
      games.length === 0 &&
      (searchParams.before != null || searchParams.after != null)
    ) {
      return redirect(`/users/${userId}`)
    }
    if (originId == null && games.length > 0) {
      originId = games[0].id.toString()
    }
  } catch {
    return notFound()
  }

  const hasAlreadyPlayed = games.length > 0
  const showPrevious =
    searchParams.after != null ||
    (searchParams.before != null &&
      games.length > 0 &&
      games[0].id.toString() !== originId)

  return (
    <main className="flex flex-1 flex-col items-start justify-start overflow-hidden">
      <div
        className={classNames(
          "scrollbar-firefox-support my-10 flex w-full flex-col items-center justify-between space-y-4 overflow-y-auto px-14 lg:flex-row lg:items-start lg:space-x-10 lg:space-y-0",
          {
            "!h-full": !hasAlreadyPlayed,
            "!items-center": !hasAlreadyPlayed,
            "!justify-center": !hasAlreadyPlayed,
            "!my-0": !hasAlreadyPlayed,
          },
        )}
      >
        <UserPublic userPublic={userPublic} />
        {originId != null ? (
          <UserGames
            games={games}
            userId={userPublic.user.id}
            showPrevious={showPrevious}
            showNext={games.length >= ITEMS_PER_PAGE_LIMIT}
            originId={originId}
          />
        ) : null}
      </div>
    </main>
  )
}

export default UsersProfilePage
