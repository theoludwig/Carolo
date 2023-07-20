import test from 'node:test'
import assert from 'node:assert/strict'

import { createGame } from './utils.js'
import type { GameMachine } from './utils.js'
import { Position } from '../index.js'

await test('Hubris Attraction Power', async (t) => {
  let createGameResult: GameMachine

  t.beforeEach(async () => {
    createGameResult = createGame()
  })

  await t.test('White Ego attracted by Black Hubris (right side)', async () => {
    const { game, board } = createGameResult
    game.play()
    game.playMove(
      new Position({ column: 5, row: 5 }),
      new Position({ column: 7, row: 3 })
    )
    game.playMove(
      new Position({ column: 2, row: 2 }),
      new Position({ column: 4, row: 4 })
    )
    game.playMove(
      new Position({ column: 4, row: 6 }),
      new Position({ column: 0, row: 0 })
    )
    game.playMove(
      new Position({ column: 4, row: 4 }),
      new Position({ column: 5, row: 3 })
    )
    game.playMove(
      new Position({ column: 0, row: 0 }),
      new Position({ column: 0, row: 1 })
    )
    game.playMove(
      new Position({ column: 5, row: 3 }),
      new Position({ column: 6, row: 4 })
    )
    assert.strictEqual(game.getCurrentPlayer().color, 'WHITE')
    const egoPiecePosition = board.getEgoPiecePosition('WHITE')
    assert.strictEqual(egoPiecePosition.piece.type, 'EGO')
    assert.strictEqual(egoPiecePosition.piece.color, 'WHITE')
    assert.strictEqual(
      egoPiecePosition.position.equals(new Position({ column: 3, row: 7 })),
      true
    )
    assert.deepStrictEqual(
      [
        ...board
          .getAvailablePiecePositions(new Position({ column: 3, row: 7 }))
          .keys()
      ],
      ['F3']
    )
    assert.deepStrictEqual(
      [
        ...board
          .getAvailablePiecePositions(new Position({ column: 5, row: 6 }))
          .keys()
      ],
      [],
      "White Aymon can't move"
    )
  })

  await t.test('Black Ego attracted by White Hubris (left side)', async () => {
    const { game, board } = createGameResult
    game.play()
    game.playMove(
      new Position({ column: 5, row: 5 }),
      new Position({ column: 4, row: 4 })
    )
    game.playMove(
      new Position({ column: 3, row: 1 }),
      new Position({ column: 7, row: 0 })
    )
    game.playMove(
      new Position({ column: 4, row: 4 }),
      new Position({ column: 3, row: 5 })
    )
    game.playMove(
      new Position({ column: 2, row: 2 }),
      new Position({ column: 0, row: 4 })
    )
    game.playMove(
      new Position({ column: 3, row: 5 }),
      new Position({ column: 1, row: 3 })
    )
    assert.strictEqual(game.getCurrentPlayer().color, 'BLACK')
    const egoPiecePosition = board.getEgoPiecePosition('BLACK')
    assert.strictEqual(egoPiecePosition.piece.type, 'EGO')
    assert.strictEqual(egoPiecePosition.piece.color, 'BLACK')
    assert.strictEqual(
      egoPiecePosition.position.equals(new Position({ column: 4, row: 0 })),
      true
    )
    assert.deepStrictEqual(
      [
        ...board
          .getAvailablePiecePositions(new Position({ column: 4, row: 0 }))
          .keys()
      ],
      ['C6']
    )
  })

  await t.test(
    'Black Ego attracted by White Hubris (left side) but can be intercepted by Black Hubris',
    async () => {
      const { game, board } = createGameResult
      game.play()
      game.playMove(
        new Position({ column: 5, row: 5 }),
        new Position({ column: 4, row: 4 })
      )
      game.playMove(
        new Position({ column: 3, row: 1 }),
        new Position({ column: 7, row: 0 })
      )
      game.playMove(
        new Position({ column: 4, row: 4 }),
        new Position({ column: 3, row: 5 })
      )
      game.playMove(
        new Position({ column: 2, row: 2 }),
        new Position({ column: 4, row: 4 })
      )
      game.playMove(
        new Position({ column: 3, row: 5 }),
        new Position({ column: 1, row: 3 })
      )
      assert.strictEqual(game.getCurrentPlayer().color, 'BLACK')
      const egoPiecePosition = board.getEgoPiecePosition('BLACK')
      assert.strictEqual(egoPiecePosition.piece.type, 'EGO')
      assert.strictEqual(egoPiecePosition.piece.color, 'BLACK')
      assert.strictEqual(
        egoPiecePosition.position.equals(new Position({ column: 4, row: 0 })),
        true
      )
      assert.deepStrictEqual(
        [
          ...board
            .getAvailablePiecePositions(new Position({ column: 4, row: 0 }))
            .keys()
        ],
        ['C6']
      )
      assert.deepStrictEqual(
        [
          ...board
            .getAvailablePiecePositions(new Position({ column: 4, row: 4 }))
            .keys()
        ],
        ['C6'],
        'Black Hubris can intercept White Hubris'
      )
      game.playMove(
        new Position({ column: 4, row: 4 }),
        new Position({ column: 2, row: 2 })
      )

      assert.strictEqual(game.getCurrentPlayer().color, 'WHITE')
      game.playMove(
        new Position({ column: 1, row: 3 }),
        new Position({ column: 0, row: 4 })
      )

      assert.strictEqual(game.getCurrentPlayer().color, 'BLACK')
      assert.deepStrictEqual(
        [
          ...board
            .getAvailablePiecePositions(new Position({ column: 4, row: 0 }))
            .keys()
        ],
        [],
        "Black Ego can't be attracted by White Hubris anymore"
      )
    }
  )

  await t.test(
    'Black Ego attracted by White Hubris (left side) but can be intercepted by Black Hubris (on another position than the Ego attracted position)',
    async () => {
      const { game, board } = createGameResult
      game.play()
      game.playMove(
        new Position({ column: 5, row: 5 }),
        new Position({ column: 4, row: 4 })
      )
      game.playMove(
        new Position({ column: 3, row: 1 }),
        new Position({ column: 7, row: 0 })
      )
      game.playMove(
        new Position({ column: 4, row: 4 }),
        new Position({ column: 3, row: 5 })
      )
      game.playMove(
        new Position({ column: 2, row: 2 }),
        new Position({ column: 4, row: 4 })
      )
      game.playMove(
        new Position({ column: 2, row: 6 }),
        new Position({ column: 0, row: 7 })
      )
      game.playMove(
        new Position({ column: 4, row: 4 }),
        new Position({ column: 5, row: 3 })
      )
      game.playMove(
        new Position({ column: 3, row: 5 }),
        new Position({ column: 1, row: 3 })
      )
      assert.strictEqual(game.getCurrentPlayer().color, 'BLACK')
      const egoPiecePosition = board.getEgoPiecePosition('BLACK')
      assert.strictEqual(egoPiecePosition.piece.type, 'EGO')
      assert.strictEqual(egoPiecePosition.piece.color, 'BLACK')
      assert.strictEqual(
        egoPiecePosition.position.equals(new Position({ column: 4, row: 0 })),
        true
      )
      assert.deepStrictEqual(
        [
          ...board
            .getAvailablePiecePositions(new Position({ column: 4, row: 0 }))
            .keys()
        ],
        ['C6']
      )
      assert.deepStrictEqual(
        [
          ...board
            .getAvailablePiecePositions(new Position({ column: 5, row: 3 }))
            .keys()
        ],
        ['D7'],
        'Black Hubris can intercept White Hubris on another position than the Ego attracted position'
      )
      assert.deepStrictEqual(
        [
          ...board
            .getAvailablePiecePositions(new Position({ column: 5, row: 2 }))
            .keys()
        ],
        [],
        "Black Hubris can't move if can't intercept White Hubris"
      )
      assert.deepStrictEqual(
        [
          ...board
            .getAvailablePiecePositions(new Position({ column: 3, row: 0 }))
            .keys()
        ],
        [],
        "Black Carolo can't move"
      )
      assert.deepStrictEqual(
        [
          ...board
            .getAvailablePiecePositions(new Position({ column: 2, row: 0 }))
            .keys()
        ],
        [],
        "Black Bayard can't move"
      )
      assert.deepStrictEqual(
        [
          ...board
            .getAvailablePiecePositions(new Position({ column: 2, row: 1 }))
            .keys()
        ],
        [],
        "Black Aymon can't move"
      )
    }
  )

  await t.test(
    'Black Ego attracted by White Hubris (right side) but can be intercepted by Black Hubris (on another position than the Ego attracted position)',
    async () => {
      const { game, board } = createGameResult
      game.play()
      game.playMove(
        new Position({ column: 5, row: 5 }),
        new Position({ column: 4, row: 4 })
      )
      game.playMove(
        new Position({ column: 3, row: 1 }),
        new Position({ column: 7, row: 0 })
      )
      game.playMove(
        new Position({ column: 4, row: 4 }),
        new Position({ column: 3, row: 5 })
      )
      game.playMove(
        new Position({ column: 5, row: 1 }),
        new Position({ column: 0, row: 0 })
      )
      game.playMove(
        new Position({ column: 3, row: 5 }),
        new Position({ column: 4, row: 4 })
      )
      game.playMove(
        new Position({ column: 0, row: 0 }),
        new Position({ column: 0, row: 1 })
      )
      game.playMove(
        new Position({ column: 4, row: 4 }),
        new Position({ column: 5, row: 5 })
      )
      game.playMove(
        new Position({ column: 2, row: 2 }),
        new Position({ column: 3, row: 3 })
      )
      game.playMove(
        new Position({ column: 5, row: 5 }),
        new Position({ column: 7, row: 3 })
      )
      assert.strictEqual(game.getCurrentPlayer().color, 'BLACK')
      const egoPiecePosition = board.getEgoPiecePosition('BLACK')
      assert.strictEqual(egoPiecePosition.piece.type, 'EGO')
      assert.strictEqual(egoPiecePosition.piece.color, 'BLACK')
      assert.strictEqual(
        egoPiecePosition.position.equals(new Position({ column: 4, row: 0 })),
        true
      )
      assert.deepStrictEqual(
        [
          ...board
            .getAvailablePiecePositions(new Position({ column: 4, row: 0 }))
            .keys()
        ],
        ['G6']
      )
      assert.deepStrictEqual(
        [
          ...board
            .getAvailablePiecePositions(new Position({ column: 3, row: 3 }))
            .keys()
        ],
        ['F7'],
        'Black Hubris can intercept White Hubris on another position than the Ego attracted position'
      )
      assert.deepStrictEqual(
        [
          ...board
            .getAvailablePiecePositions(new Position({ column: 2, row: 1 }))
            .keys()
        ],
        [],
        "Black Aymon can't move"
      )
    }
  )
})
