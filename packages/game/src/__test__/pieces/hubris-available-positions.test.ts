import tap from 'tap'

import { createGame } from '../utils.js'
import type { GameMachine } from '../utils.js'
import { Position } from '../../index.js'

await tap.test('Hubris Available Positions', async (t) => {
  const createGameResult: GameMachine = createGame()
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
    ['C3', 'E3', 'C5', 'E5', 'B2', 'B6', 'F6', 'A1', 'A7', 'G7', 'H8']
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
    ['F4', 'H4', 'F6', 'H6', 'E3']
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
      'C3',
      'E3',
      'C5',
      'E5',
      'B2',
      'F2',
      'B6',
      'F6',
      'A1',
      'G1',
      'A7',
      'G7',
      'H8'
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
    ['F4', 'H4', 'F6', 'H6', 'E3']
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
  const currentPlayer = game.getCurrentPlayer()
  t.same(currentPlayer.capturedPieces, [])
  game.playMove(
    new Position({ column: 6, row: 3 }),
    new Position({ column: 4, row: 5 })
  )
  t.same(currentPlayer.capturedPieces.length, 1)
  t.equal(currentPlayer.capturedPieces[0].type, 'BAYARD')
  t.equal(
    board.getPiecePosition(new Position({ column: 4, row: 5 })).piece.type,
    'HUBRIS'
  )
})
