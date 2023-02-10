import tap from 'tap'

import { createGame } from '../utils.js'
import type { CreateGameResult } from '../utils.js'
import { Position } from '../../index.js'

await tap.test('Hubris Available Positions', async (t) => {
  const createGameResult: CreateGameResult = createGame()
  const { game, board } = createGameResult
  t.equal(game.status, 'LOBBY')
  game.play()
  t.equal(game.status, 'PLAY')

  t.equal(game.getCurrentPlayer().color, 'WHITE')
  t.equal(
    board.getPiecePosition(new Position({ column: 2, row: 5 })).piece.type,
    'HUBRIS'
  )
  game.playMove(
    new Position({ column: 2, row: 5 }),
    new Position({ column: 3, row: 4 })
  )

  t.equal(game.getCurrentPlayer().color, 'BLACK')
  game.playMove(
    new Position({ column: 5, row: 2 }),
    new Position({ column: 6, row: 3 })
  )

  t.equal(game.getCurrentPlayer().color, 'WHITE')
  t.same(
    board
      .getAvailablePiecePositions(new Position({ column: 3, row: 4 }))
      .keys(),
    [
      'column-2-row-5',
      'column-4-row-5',
      'column-2-row-3',
      'column-4-row-3',
      'column-1-row-6',
      'column-1-row-2',
      'column-5-row-2',
      'column-0-row-7',
      'column-0-row-1',
      'column-6-row-1',
      'column-7-row-0'
    ]
  )
  game.playMove(
    new Position({ column: 5, row: 6 }),
    new Position({ column: 1, row: 7 })
  )

  t.equal(game.getCurrentPlayer().color, 'BLACK')
  t.same(
    board
      .getAvailablePiecePositions(new Position({ column: 6, row: 3 }))
      .keys(),
    [
      'column-5-row-4',
      'column-7-row-4',
      'column-5-row-2',
      'column-7-row-2',
      'column-4-row-5'
    ]
  )
  game.playMove(
    new Position({ column: 2, row: 1 }),
    new Position({ column: 0, row: 0 })
  )

  t.equal(game.getCurrentPlayer().color, 'WHITE')
  t.same(
    board
      .getAvailablePiecePositions(new Position({ column: 3, row: 4 }))
      .keys(),
    [
      'column-2-row-5',
      'column-4-row-5',
      'column-2-row-3',
      'column-4-row-3',
      'column-1-row-6',
      'column-5-row-6',
      'column-1-row-2',
      'column-5-row-2',
      'column-0-row-7',
      'column-6-row-7',
      'column-0-row-1',
      'column-6-row-1',
      'column-7-row-0'
    ]
  )
  game.playMove(
    new Position({ column: 5, row: 7 }),
    new Position({ column: 4, row: 5 })
  )

  t.equal(game.getCurrentPlayer().color, 'BLACK')
  t.same(
    board
      .getAvailablePiecePositions(new Position({ column: 6, row: 3 }))
      .keys(),
    [
      'column-5-row-4',
      'column-7-row-4',
      'column-5-row-2',
      'column-7-row-2',
      'column-4-row-5'
    ]
  )
  t.equal(
    board.isCaptureMove(
      new Position({ column: 4, row: 5 }),
      new Position({ column: 6, row: 3 })
    ),
    true,
    'Black Hubris can capture White Bayard'
  )
  t.equal(
    board.isCaptureMove(
      new Position({ column: 7, row: 2 }),
      new Position({ column: 6, row: 3 })
    ),
    false
  )
  t.equal(
    board.getPiecePosition(new Position({ column: 4, row: 5 })).piece.type,
    'BAYARD'
  )
  game.playMove(
    new Position({ column: 6, row: 3 }),
    new Position({ column: 4, row: 5 })
  )
  t.equal(
    board.getPiecePosition(new Position({ column: 4, row: 5 })).piece.type,
    'HUBRIS'
  )
})
