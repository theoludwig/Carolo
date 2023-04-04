import NextLink from 'next/link'
import classNames from 'clsx'
import date from 'date-and-time'
import Image from 'next/image'
import type { Services } from '@carolo/models'

import BoardInitialPositions from '@/public/board-initial-positions.png'
import { Button } from '@/components/Button'
import { User } from '@/components//User'

export type Games = Services['/users/:userId/games']['get']['response']

export interface UserGamesProps {
  userId: number
  games: Games
  originId: string
  showPrevious?: boolean
  showNext?: boolean
}

export const UserGames = (props: UserGamesProps): JSX.Element => {
  const {
    games,
    userId,
    originId,
    showPrevious = false,
    showNext = false
  } = props

  return (
    <div className='flex w-full flex-col space-y-6'>
      {games.length === 0 ? (
        <div className='flex flex-col items-center'>
          <h2 className='text-center text-lg font-bold'>
            L{"'"}historique des parties est vide. C{"'"}est l{"'"}
            occasion d{"'"}en lancer une !
          </h2>
          <div className='mt-2'>
            <Button variant='purple' href='/game'>
              Nouvelle partie
            </Button>
          </div>
        </div>
      ) : null}

      {games.map((game) => {
        const isPlayerBlack = game.playerBlack.id === userId
        const isPlayerWhite = game.playerWhite.id === userId
        const isWinner =
          (game.status === 'WHITE_WON' && isPlayerWhite) ||
          (game.status === 'BLACK_WON' && isPlayerBlack)
        return (
          <NextLink
            className='inline-flex hover:opacity-80'
            key={game.id}
            href={`/game/${game.id}`}
            id={`game-${game.id}`}
          >
            <div
              className={classNames('w-11 rounded-lg', {
                'bg-[#C82323]': !isWinner && game.status !== 'PLAY',
                'bg-[#43A53B]': isWinner && game.status !== 'PLAY',
                'bg-gray-500': game.status === 'PLAY'
              })}
            ></div>
            <div className='flex w-full justify-between rounded-md bg-[#272522]'>
              <div className='ml-3 flex py-3'>
                <Image
                  className='w-28'
                  src={BoardInitialPositions}
                  alt='Board'
                  quality={100}
                  priority
                />
                <div className='ml-2 flex flex-col justify-between'>
                  <div className='flex items-center space-x-1 font-bold'>
                    <User
                      className='h-10 w-10'
                      user={{
                        logo: game.playerBlack.logo,
                        name: game.playerBlack.name
                      }}
                    />
                  </div>
                  <div className='flex items-center space-x-1 font-bold'>
                    <User
                      className='h-10 w-10'
                      user={{
                        logo: game.playerWhite.logo,
                        name: game.playerWhite.name
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className='hidden items-center px-4 text-[#D1D1D1] sm:flex'>
                <div>{date.format(new Date(game.createdAt), 'DD/MM/YYYY')}</div>
              </div>
            </div>
          </NextLink>
        )
      })}

      {games.length > 0 && (showPrevious || showNext) ? (
        <div className='flex justify-center space-x-6'>
          {showPrevious ? (
            <Button
              variant='purple'
              className='w-28'
              href={`/users/${userId}?before=${games[0].id}&originId=${originId}`}
            >
              Précédent
            </Button>
          ) : null}

          {showNext ? (
            <Button
              variant='purple'
              className='w-28'
              href={`/users/${userId}?after=${
                games[games.length - 1].id
              }&originId=${originId}`}
            >
              Suivant
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
