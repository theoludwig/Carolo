import tap from 'tap'

import { createGame } from '../utils.js'
import type { GameMachine } from '../utils.js'
import { Position } from '../../index.js'

await tap.test('Ego Available Positions', async (t) => {
  const createGameResult: GameMachine = createGame()
  const { game, board } = createGameResult
  t.equal(game.status, 'LOBBY')
  game.play()
  t.equal(game.status, 'PLAY')
  t.equal(game.getCurrentPlayer().color, 'WHITE')

  t.equal(game.getCurrentPlayer().color, 'WHITE')
  t.equal(
    board.getPiecePosition(new Position({ column: 3, row: 7 })).piece.type,
    'EGO'
  )
  t.equal(
    board.getAvailablePiecePositions(new Position({ column: 3, row: 7 })).size,
    0,
    'Ego should not be able to move (first move)'
  )
  game.playMove(
    new Position({ column: 2, row: 7 }),
    new Position({ column: 0, row: 6 })
  )

  t.equal(game.getCurrentPlayer().color, 'BLACK')
  game.playMove(
    new Position({ column: 4, row: 1 }),
    new Position({ column: 0, row: 0 })
  )

  t.same(
    board
      .getAvailablePiecePositions(new Position({ column: 3, row: 7 }))
      .keys(),
    ['C1']
  )
  t.equal(game.getCurrentPlayer().color, 'WHITE')
  game.playMove(
    new Position({ column: 3, row: 7 }),
    new Position({ column: 2, row: 7 })
  )

  t.same(
    board
      .getAvailablePiecePositions(new Position({ column: 4, row: 0 }))
      .keys(),
    ['E7']
  )
  t.equal(game.getCurrentPlayer().color, 'BLACK')
  game.playMove(
    new Position({ column: 4, row: 0 }),
    new Position({ column: 4, row: 1 })
  )

  t.same(
    board
      .getAvailablePiecePositions(new Position({ column: 2, row: 7 }))
      .keys(),
    ['D1', 'B1']
  )
  t.equal(game.getCurrentPlayer().color, 'WHITE')
  game.playMove(
    new Position({ column: 2, row: 7 }),
    new Position({ column: 1, row: 7 })
  )

  t.equal(game.getCurrentPlayer().color, 'BLACK')
  t.same(
    board
      .getAvailablePiecePositions(new Position({ column: 4, row: 1 }))
      .keys(),
    ['E6', 'E8']
  )
  game.playMove(
    new Position({ column: 4, row: 1 }),
    new Position({ column: 4, row: 2 })
  )

  t.equal(game.getCurrentPlayer().color, 'WHITE')
  t.same(
    board
      .getAvailablePiecePositions(new Position({ column: 1, row: 7 }))
      .keys(),
    ['C1', 'B2', 'A1']
  )
  game.playMove(
    new Position({ column: 1, row: 7 }),
    new Position({ column: 1, row: 6 })
  )

  t.equal(game.getCurrentPlayer().color, 'BLACK')
  game.playMove(
    new Position({ column: 2, row: 0 }),
    new Position({ column: 1, row: 2 })
  )

  t.equal(game.getCurrentPlayer().color, 'WHITE')
  game.playMove(
    new Position({ column: 1, row: 6 }),
    new Position({ column: 1, row: 5 })
  )

  t.equal(game.getCurrentPlayer().color, 'BLACK')
  game.playMove(
    new Position({ column: 4, row: 2 }),
    new Position({ column: 4, row: 3 })
  )

  t.equal(game.getCurrentPlayer().color, 'WHITE')
  game.playMove(
    new Position({ column: 2, row: 5 }),
    new Position({ column: 0, row: 3 })
  )

  t.equal(game.getCurrentPlayer().color, 'BLACK')
  t.same(
    board
      .getAvailablePiecePositions(new Position({ column: 4, row: 3 }))
      .keys(),
    ['E4', 'F5', 'E6', 'D5']
  )
  game.playMove(
    new Position({ column: 1, row: 2 }),
    new Position({ column: 2, row: 4 })
  )
  game.playMove(
    new Position({ column: 1, row: 5 }),
    new Position({ column: 2, row: 5 })
  )
  game.playMove(
    new Position({ column: 5, row: 1 }),
    new Position({ column: 7, row: 0 })
  )

  t.equal(game.getCurrentPlayer().color, 'WHITE')
  t.same(
    board
      .getAvailablePiecePositions(new Position({ column: 2, row: 5 }))
      .keys(),
    ['D3', 'C4', 'B3']
  )
  t.equal(
    board.isCaptureMove(
      new Position({ column: 2, row: 4 }),
      new Position({ column: 2, row: 5 })
    ),
    true
  )
  t.equal(
    board.getPiecePosition(new Position({ column: 2, row: 4 })).piece.type,
    'BAYARD'
  )
  game.playMove(
    new Position({ column: 2, row: 5 }),
    new Position({ column: 2, row: 4 })
  )
  t.equal(
    board.getPiecePosition(new Position({ column: 2, row: 4 })).piece.type,
    'EGO'
  )
})
