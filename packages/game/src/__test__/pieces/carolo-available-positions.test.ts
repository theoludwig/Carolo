import tap from 'tap'

import { createGame } from '../utils.js'
import type { GameMachine } from '../utils.js'
import { Position } from '../../index.js'

await tap.test('Carolo Available Positions', async (t) => {
  let createGameResult: GameMachine

  t.beforeEach(async () => {
    createGameResult = createGame()
  })

  await t.test('Positions (without bouncing)', async (t) => {
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
      board.getAvailablePiecePositions(new Position({ column: 4, row: 7 }))
        .size,
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
    t.same(
      board
        .getAvailablePiecePositions(new Position({ column: 4, row: 7 }))
        .keys(),
      ['column-4-row-2']
    )
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
    t.same(
      board
        .getAvailablePiecePositions(new Position({ column: 4, row: 7 }))
        .keys(),
      ['column-4-row-4']
    )
    t.equal(
      board.isCaptureMove(
        new Position({ column: 4, row: 4 }),
        new Position({ column: 4, row: 7 })
      ),
      true
    )
  })

  await t.test('Positions (with bouncing)', async (t) => {
    const { game } = createGameResult
    game.play()
    game.playMove(
      new Position({ column: 5, row: 7 }),
      new Position({ column: 6, row: 5 })
    )
    game.playMove(
      new Position({ column: 5, row: 1 }),
      new Position({ column: 6, row: 1 })
    )
    t.equal(game.state.isBouncingOnGoing, false)
    game.playMove(
      new Position({ column: 4, row: 7 }),
      new Position({ column: 7, row: 7 })
    )
    t.equal(game.state.isBouncingOnGoing, true)
    game.playMove(
      new Position({ column: 7, row: 7 }),
      new Position({ column: 7, row: 0 })
    )
    t.equal(game.state.isBouncingOnGoing, true)
    game.playMove(
      new Position({ column: 7, row: 0 }),
      new Position({ column: 6, row: 0 })
    )
    t.equal(game.state.isBouncingOnGoing, false)
  })

  await t.test(
    'Automatically stop bouncing when no more moves availables',
    async (t) => {
      const { game } = createGameResult
      game.play()
      game.playMove(
        new Position({ column: 5, row: 7 }),
        new Position({ column: 4, row: 5 })
      )
      game.playMove(
        new Position({ column: 2, row: 0 }),
        new Position({ column: 3, row: 2 })
      )
      game.playMove(
        new Position({ column: 5, row: 6 }),
        new Position({ column: 7, row: 5 })
      )
      game.playMove(
        new Position({ column: 3, row: 0 }),
        new Position({ column: 0, row: 0 })
      )

      t.equal(game.getCurrentPlayer().color, 'BLACK')
      game.playMove(
        new Position({ column: 0, row: 0 }),
        new Position({ column: 0, row: 7 })
      )
      t.equal(game.state.isBouncingOnGoing, true)
      game.playMove(
        new Position({ column: 0, row: 7 }),
        new Position({ column: 1, row: 7 })
      )
      t.equal(game.state.isBouncingOnGoing, false)

      t.equal(game.getCurrentPlayer().color, 'WHITE')
      game.playMove(
        new Position({ column: 4, row: 7 }),
        new Position({ column: 7, row: 7 })
      )
      t.equal(game.state.isBouncingOnGoing, true)
      game.playMove(
        new Position({ column: 7, row: 7 }),
        new Position({ column: 7, row: 6 })
      )
      t.equal(game.state.isBouncingOnGoing, true)
      game.playMove(
        new Position({ column: 7, row: 6 }),
        new Position({ column: 5, row: 6 })
      )
      t.equal(game.state.isBouncingOnGoing, true)
      game.playMove(
        new Position({ column: 5, row: 6 }),
        new Position({ column: 5, row: 7 })
      )
      t.equal(game.state.isBouncingOnGoing, false)
      t.equal(game.getCurrentPlayer().color, 'BLACK')
    }
  )
})
