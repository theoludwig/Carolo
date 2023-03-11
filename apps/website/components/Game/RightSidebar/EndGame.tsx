import { useMemo } from 'react'
import Image from 'next/image'
import { getOppositePieceColor } from '@carolo/game'

import { useGame } from '@/stores/game'
import { Button } from '@/components/Button'

export const EndGame = (): JSX.Element => {
  const board = useGame((state) => {
    return state.board
  })
  const gameState = useGame((state) => {
    return state.gameState
  })
  const users = useGame((state) => {
    return state.users
  })

  const winnerColor = useMemo(() => {
    if (gameState.status === 'WHITE_WON') {
      return 'WHITE'
    }
    if (gameState.status === 'BLACK_WON') {
      return 'BLACK'
    }
    return null
  }, [gameState])

  const winnerColorDisplay = useMemo(() => {
    if (winnerColor === 'WHITE') {
      return 'Blanc'
    }
    if (winnerColor === 'BLACK') {
      return 'Noir'
    }
    return null
  }, [winnerColor])

  const reason = useMemo(() => {
    if (winnerColor == null) {
      return 'Draw'
    }
    const isReconquest = board.isReconquest(winnerColor)
    if (isReconquest) {
      return 'Reconquest'
    }
    const oppositeColor = getOppositePieceColor(winnerColor)
    const isCheck = board.isCheck(oppositeColor)
    if (isCheck) {
      return 'Check'
    }
    return 'Resign'
  }, [winnerColor, board])

  const reasonDisplay = useMemo(() => {
    if (reason === 'Reconquest') {
      return 'Reconquête'
    }
    if (reason === 'Check') {
      return 'Mat'
    }
    if (reason === 'Resign') {
      return 'Abandon'
    }
    return 'Pas de vainqueur'
  }, [reason])

  const winner = useMemo(() => {
    return users.find((user) => {
      return user.color === winnerColor
    })
  }, [users, winnerColor])

  return (
    <>
      <h2 className='text-lg font-bold'>
        {reasonDisplay}{' '}
        {winnerColorDisplay != null ? `• Victoire ${winnerColorDisplay}` : null}
      </h2>
      {winner != null ? (
        <div className='flex flex-row items-center justify-center space-x-2 px-4 py-2'>
          <Image
            className='h-12 w-12 rounded-full ring-2 ring-green-500'
            priority
            quality={100}
            src={winner.logo ?? '/data/user-default.png'}
            alt='Player Picture'
            width={64}
            height={64}
          />
          <h2 className='text-lg font-semibold'>{winner.name}</h2>
        </div>
      ) : null}
      <div className='mt-2'>
        <Button variant='purple' href='/game'>
          Nouvelle partie
        </Button>
      </div>
    </>
  )
}
