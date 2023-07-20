import test from 'node:test'
import assert from 'node:assert/strict'

import { createGame } from '../utils.js'
import type { GameMachine } from '../utils.js'
import { Position } from '../../index.js'

await test('Carolo Available Positions', async (t) => {
  let createGameResult: GameMachine

  t.beforeEach(async () => {
    createGameResult = createGame()
  })

  await t.test('Positions (without bouncing)', async () => {
    const { game, board } = createGameResult
    assert.strictEqual(game.status, 'LOBBY')
    game.play()
    assert.strictEqual(game.status, 'PLAY')

    assert.strictEqual(game.getCurrentPlayer().color, 'WHITE')
    assert.strictEqual(
      board.getPiecePosition(new Position({ column: 4, row: 7 })).piece.type,
      'CAROLO'
    )
    assert.strictEqual(
      board.getAvailablePiecePositions(new Position({ column: 4, row: 7 }))
        .size,
      0,
      'Carolo should not be able to move (first move)'
    )
    game.playMove(
      new Position({ column: 4, row: 6 }),
      new Position({ column: 0, row: 7 })
    )

    assert.strictEqual(game.getCurrentPlayer().color, 'BLACK')
    game.playMove(
      new Position({ column: 2, row: 1 }),
      new Position({ column: 0, row: 0 })
    )

    assert.strictEqual(game.getCurrentPlayer().color, 'WHITE')
    assert.deepStrictEqual(
      [
        ...board
          .getAvailablePiecePositions(new Position({ column: 4, row: 7 }))
          .keys()
      ],
      ['E6']
    )
    game.playMove(
      new Position({ column: 0, row: 7 }),
      new Position({ column: 1, row: 7 })
    )

    assert.strictEqual(game.getCurrentPlayer().color, 'BLACK')
    assert.deepStrictEqual(
      [
        ...board
          .getAvailablePiecePositions(new Position({ column: 3, row: 0 }))
          .keys()
      ],
      []
    )
    game.playMove(
      new Position({ column: 2, row: 2 }),
      new Position({ column: 4, row: 4 })
    )

    assert.strictEqual(game.getCurrentPlayer().color, 'WHITE')
    assert.deepStrictEqual(
      [
        ...board
          .getAvailablePiecePositions(new Position({ column: 4, row: 7 }))
          .keys()
      ],
      ['E4']
    )
    assert.strictEqual(
      board.isCaptureMove(
        new Position({ column: 4, row: 4 }),
        new Position({ column: 4, row: 7 })
      ),
      true
    )
  })

  await t.test('Positions (with bouncing)', async () => {
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
    assert.strictEqual(game.state.isBouncingOnGoing, false)
    game.playMove(
      new Position({ column: 4, row: 7 }),
      new Position({ column: 7, row: 7 })
    )
    assert.strictEqual(game.state.isBouncingOnGoing, true)
    game.playMove(
      new Position({ column: 7, row: 7 }),
      new Position({ column: 7, row: 0 })
    )
    assert.strictEqual(game.state.isBouncingOnGoing, true)
    game.playMove(
      new Position({ column: 7, row: 0 }),
      new Position({ column: 6, row: 0 })
    )
    assert.strictEqual(game.state.isBouncingOnGoing, false)
  })

  await t.test(
    'Automatically stop bouncing when no more moves availables',
    async () => {
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

      assert.strictEqual(game.getCurrentPlayer().color, 'BLACK')
      game.playMove(
        new Position({ column: 0, row: 0 }),
        new Position({ column: 0, row: 7 })
      )
      assert.strictEqual(game.state.isBouncingOnGoing, true)
      game.playMove(
        new Position({ column: 0, row: 7 }),
        new Position({ column: 1, row: 7 })
      )
      assert.strictEqual(game.state.isBouncingOnGoing, false)

      assert.strictEqual(game.getCurrentPlayer().color, 'WHITE')
      game.playMove(
        new Position({ column: 4, row: 7 }),
        new Position({ column: 7, row: 7 })
      )
      assert.strictEqual(game.state.isBouncingOnGoing, true)
      game.playMove(
        new Position({ column: 7, row: 7 }),
        new Position({ column: 7, row: 6 })
      )
      assert.strictEqual(game.state.isBouncingOnGoing, true)
      game.playMove(
        new Position({ column: 7, row: 6 }),
        new Position({ column: 5, row: 6 })
      )
      assert.strictEqual(game.state.isBouncingOnGoing, true)
      game.playMove(
        new Position({ column: 5, row: 6 }),
        new Position({ column: 5, row: 7 })
      )
      assert.strictEqual(game.state.isBouncingOnGoing, false)
      assert.strictEqual(game.getCurrentPlayer().color, 'BLACK')
    }
  )
})
