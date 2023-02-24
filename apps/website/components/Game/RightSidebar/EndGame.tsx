import { useMemo } from 'react'
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

  return (
    <>
      <h2>
        {reasonDisplay}{' '}
        {winnerColorDisplay != null ? `• Victoire ${winnerColorDisplay}` : null}
      </h2>
      <div className='mt-2'>
        <Button variant='purple' href='/game'>
          Rejouer
        </Button>
      </div>
    </>
  )
}
