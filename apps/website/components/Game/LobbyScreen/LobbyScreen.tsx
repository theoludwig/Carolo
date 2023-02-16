'use client'

import { useGame } from '@/stores/game'
import { Button } from '@/components/Button'
import { LobbyPlayer } from '@/components/Game/LobbyScreen/LobbyPlayer'

export const LobbyScreen = (): JSX.Element => {
  const { playersState, game } = useGame()

  return (
    <>
      <h1 className='mt-8 text-center text-3xl font-bold'>Lobby</h1>

      <section className='mt-8 space-y-10'>
        {playersState.map((playerState, playerIndex) => {
          return (
            <LobbyPlayer
              key={playerIndex}
              playerIndex={playerIndex}
              playerState={playerState}
            />
          )
        })}
      </section>
      <section className='mt-10 flex justify-center'>
        <Button
          type='button'
          onClick={() => {
            game.play()
          }}
        >
          Jouer
        </Button>
      </section>
    </>
  )
}
