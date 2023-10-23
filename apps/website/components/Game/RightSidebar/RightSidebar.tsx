"use client"

import Image from "next/image"
import type { Services } from "@carolo/models"

import { useGame } from "@/stores/game"
import { useAuthentication } from "@/stores/authentication"
import { EndGame } from "@/components/Game/RightSidebar/EndGame"
import { ControlGame } from "@/components/Game/RightSidebar/ControlGame"
import { Button } from "@/components/Button"
import LinkIcon from "@/public/icons/link.png"

export const RightSidebar = (): JSX.Element => {
  const { authenticated, authentication, user } = useAuthentication()

  const gameState = useGame((state) => {
    return state.gameState
  })
  const gameId = useGame((state) => {
    return state.gameId
  })
  const users = useGame((state) => {
    return state.users
  })

  return (
    <div className="flex w-4/12 flex-col items-center justify-center text-center">
      {gameId != null ? (
        <div className="mb-4 flex px-4 py-2">
          <button
            className="flex items-center space-x-2 rounded-md bg-[#489723] px-2 py-2 hover:opacity-80"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(window.location.href)
              } catch (error) {
                console.error(error)
              }
            }}
          >
            <div>
              <Image
                className="h-5 w-5"
                src={LinkIcon}
                alt="Link"
                quality={100}
              />
            </div>

            <div className="font-bold">Copier le lien</div>
          </button>
        </div>
      ) : null}

      <div className="inline-flex min-w-[220px] flex-col items-center rounded-md bg-[#272522] px-4 py-2">
        {gameState.finalStatus === "PLAY" ? <ControlGame /> : <EndGame />}
      </div>

      {authenticated &&
      gameId != null &&
      gameState.status === "LOBBY" &&
      users.length === 1 &&
      users[0].id !== user.id ? (
        <div className="mt-4 flex flex-col">
          <Button
            variant="purple"
            onClick={async () => {
              try {
                await authentication.api.post<
                  Services["/games/:gameId/join"]["post"]["response"]
                >(`/games/${gameId}/join`, {})
              } catch (error) {
                console.error(error)
              }
            }}
          >
            Rejoindre la partie
          </Button>
        </div>
      ) : null}
    </div>
  )
}
