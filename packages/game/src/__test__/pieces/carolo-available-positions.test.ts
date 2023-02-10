import tap from 'tap'

import { createGame } from '../utils.js'
import type { CreateGameResult } from '../utils.js'
import { Position } from '../../index.js'

await tap.test('Carolo Available Positions', async (t) => {
  const createGameResult: CreateGameResult = createGame()
  const { game, board } = createGameResult
  t.equal(game.status, 'LOBBY')
  game.play()
  t.equal(game.status, 'PLAY')

  t.equal(game.getCurrentPlayer().color, 'WHITE')
  t.equal(
    board.getPiecePosition(new Position({ column: 4, row: 7 })).piece.type,
    'CAROLO'
  )
  t.equal(
    board.getAvailablePiecePositions(new Position({ column: 4, row: 7 })).size,
    0,
    'Carolo should not be able to move (first move)'
  )
  game.playMove(
    new Position({ column: 4, row: 6 }),
    new Position({ column: 0, row: 7 })
  )

  t.equal(game.getCurrentPlayer().color, 'BLACK')
  game.playMove(
    new Position({ column: 2, row: 1 }),
    new Position({ column: 0, row: 0 })
  )

  t.equal(game.getCurrentPlayer().color, 'WHITE')
  // TODO: Fix this test
  // t.same(
  //   board
  //     .getAvailablePiecePositions(new Position({ column: 4, row: 7 }))
  //     .keys(),
  //   ['column-4-row-2']
  // )
  game.playMove(
    new Position({ column: 0, row: 7 }),
    new Position({ column: 1, row: 7 })
  )

  t.equal(game.getCurrentPlayer().color, 'BLACK')
  t.same(
    board
      .getAvailablePiecePositions(new Position({ column: 3, row: 0 }))
      .keys(),
    []
  )
  game.playMove(
    new Position({ column: 2, row: 2 }),
    new Position({ column: 4, row: 4 })
  )

  t.equal(game.getCurrentPlayer().color, 'WHITE')
  // TODO: Fix this test
  // t.same(
  //   board
  //     .getAvailablePiecePositions(new Position({ column: 4, row: 7 }))
  //     .keys(),
  //   ['column-4-row-4']
  // )
  t.equal(
    board.isCaptureMove(
      new Position({ column: 4, row: 4 }),
      new Position({ column: 4, row: 7 })
    ),
    true
  )
})
