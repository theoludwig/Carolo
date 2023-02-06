import tap from 'tap'

import { createGame } from '../utils.js'
import type { CreateGameResult } from '../utils.js'
import { Position } from '../../index.js'

await tap.test('Bayard Available Positions', async (t) => {
  const createGameResult: CreateGameResult = createGame()
  const { game, board } = createGameResult
  t.equal(game.status, 'LOBBY')
  game.play()
  t.equal(game.status, 'PLAY')
  t.equal(game.getCurrentPlayer().color, 'WHITE')

  t.same(
    board
      .getAvailablePiecePositions(new Position({ column: 2, row: 7 }))
      .keys(),
    ['column-1-row-5', 'column-3-row-5', 'column-0-row-6']
  )
  t.equal(
    board.getPiecePosition(new Position({ column: 2, row: 7 })).piece.getType(),
    'BAYARD'
  )
  t.equal(
    board.getPiecePosition(new Position({ column: 1, row: 5 })).isFree(),
    true
  )
  game.playMove(
    new Position({ column: 2, row: 7 }),
    new Position({ column: 1, row: 5 })
  )
  t.equal(
    board.getPiecePosition(new Position({ column: 2, row: 7 })).isFree(),
    true
  )
  t.equal(
    board.getPiecePosition(new Position({ column: 1, row: 5 })).piece.getType(),
    'BAYARD'
  )
  t.equal(game.getCurrentPlayer().color, 'BLACK')

  t.same(
    board
      .getAvailablePiecePositions(new Position({ column: 2, row: 0 }))
      .keys(),
    ['column-3-row-2', 'column-1-row-2', 'column-0-row-1']
  )
  game.playMove(
    new Position({ column: 2, row: 0 }),
    new Position({ column: 3, row: 2 })
  )
  t.equal(game.getCurrentPlayer().color, 'WHITE')

  t.same(
    board
      .getAvailablePiecePositions(new Position({ column: 1, row: 5 }))
      .keys(),
    [
      'column-2-row-7',
      'column-0-row-7',
      'column-3-row-4',
      'column-4-row-5',
      'column-0-row-3',
      'column-1-row-2',
      'column-2-row-3'
    ]
  )
  game.playMove(
    new Position({ column: 1, row: 5 }),
    new Position({ column: 3, row: 4 })
  )
  t.equal(game.getCurrentPlayer().color, 'BLACK')

  game.playMove(
    new Position({ column: 3, row: 2 }),
    new Position({ column: 4, row: 4 })
  )
  t.equal(game.getCurrentPlayer().color, 'WHITE')

  t.same(
    board
      .getAvailablePiecePositions(new Position({ column: 3, row: 4 }))
      .keys(),
    [
      'column-5-row-3',
      'column-6-row-4',
      'column-3-row-1',
      'column-4-row-2',
      'column-1-row-5',
      'column-0-row-4',
      'column-1-row-3'
    ]
  )
  t.equal(
    board.isCaptureMove(
      new Position({ column: 3, row: 1 }),
      new Position({ column: 3, row: 4 })
    ),
    true,
    'White Bayard can capture Black Aymon'
  )
  t.equal(
    board.isCaptureMove(
      new Position({ column: 5, row: 3 }),
      new Position({ column: 3, row: 4 })
    ),
    false
  )
})
