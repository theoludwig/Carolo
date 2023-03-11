import tap from 'tap'

import { createGame } from '../utils.js'
import type { GameMachine } from '../utils.js'
import { Position } from '../../index.js'

await tap.test('Bayard Available Positions', async (t) => {
  const createGameResult: GameMachine = createGame()
  const { game, board } = createGameResult
  t.equal(game.status, 'LOBBY')
  game.play()
  t.equal(game.status, 'PLAY')
  t.equal(game.getCurrentPlayer().color, 'WHITE')

  t.equal(
    board.getPiecePosition(new Position({ column: 2, row: 7 })).piece.type,
    'BAYARD'
  )
  t.equal(
    board.getPiecePosition(new Position({ column: 1, row: 5 })).isFree(),
    true
  )
  t.same(
    board
      .getAvailablePiecePositions(new Position({ column: 2, row: 7 }))
      .keys(),
    ['B3', 'D3', 'A2']
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
    board.getPiecePosition(new Position({ column: 1, row: 5 })).piece.type,
    'BAYARD'
  )
  t.equal(game.getCurrentPlayer().color, 'BLACK')

  t.same(
    board
      .getAvailablePiecePositions(new Position({ column: 2, row: 0 }))
      .keys(),
    ['D6', 'B6', 'A7']
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
    ['C1', 'A1', 'D4', 'E3', 'A5', 'B6', 'C5']
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
    ['F5', 'G4', 'D7', 'E6', 'B3', 'A4', 'B5']
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

  game.playMove(
    new Position({ column: 3, row: 4 }),
    new Position({ column: 5, row: 3 })
  )
  t.same(
    board
      .getAvailablePiecePositions(new Position({ column: 5, row: 3 }))
      .keys(),
    ['G3', 'E3', 'H6', 'H4', 'E7', 'G7', 'D4', 'C5', 'D6']
  )
})
