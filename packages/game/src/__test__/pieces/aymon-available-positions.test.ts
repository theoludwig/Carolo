import tap from 'tap'

import { createGame } from '../utils.js'
import type { CreateGameResult } from '../utils.js'
import { Position } from '../../index.js'

await tap.test('Aymon Available Positions', async (t) => {
  const createGameResult: CreateGameResult = createGame()
  const { game, board } = createGameResult
  t.equal(game.status, 'LOBBY')
  game.play()
  t.equal(game.status, 'PLAY')
  t.equal(game.getCurrentPlayer().color, 'WHITE')

  t.equal(
    board.getPiecePosition(new Position({ column: 3, row: 6 })).piece.type,
    'AYMON'
  )
  t.equal(
    board.getPiecePosition(new Position({ column: 4, row: 4 })).isFree(),
    true
  )
  t.equal(
    board.getAvailablePiecePositions(new Position({ column: 3, row: 6 })).size,
    44,
    'Aymon should be able to teleport to any position on the board'
  )
})
