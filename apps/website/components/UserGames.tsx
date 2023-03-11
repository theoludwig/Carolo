import NextLink from 'next/link'
import classNames from 'clsx'
import date from 'date-and-time'
import Image from 'next/image'
import type { Services } from '@carolo/models'

import BoardInitialPositions from '@/public/board-initial-positions.png'

export type Games = Services['/users/:userId/games']['get']['response']

export interface UserGamesProps {
  userId: number
  games: Games
}

export const UserGames = (props: UserGamesProps): JSX.Element => {
  const { games, userId } = props

  return (
    <div className='flex w-full flex-col space-y-6'>
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
                    <Image
                      priority
                      className='h-10 w-10 rounded-full'
                      quality={100}
                      src={game.playerBlack.logo ?? '/data/user-default.png'}
                      width={64}
                      height={64}
                      alt='User logo'
                    />
                    <p>{game.playerBlack.name}</p>
                  </div>
                  <div className='flex items-center space-x-1 font-bold'>
                    <Image
                      priority
                      className='h-10 w-10 rounded-full'
                      quality={100}
                      src={game.playerWhite.logo ?? '/data/user-default.png'}
                      width={64}
                      height={64}
                      alt='User logo'
                    />
                    <p>{game.playerWhite.name}</p>
                  </div>
                </div>
              </div>
              <div className='flex items-center px-4 text-[#D1D1D1]'>
                <div>{date.format(new Date(game.createdAt), 'DD/MM/YYYY')}</div>
              </div>
            </div>
          </NextLink>
        )
      })}
    </div>
  )
}
