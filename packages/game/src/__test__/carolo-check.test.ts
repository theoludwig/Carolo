import test from 'node:test'
import assert from 'node:assert/strict'

import { createGame } from './utils.js'
import type { GameMachine } from './utils.js'
import { Position } from '../index.js'

await test('Carolo Check', async (t) => {
  let createGameResult: GameMachine

  t.beforeEach(async () => {
    createGameResult = createGame()
  })

  await t.test('White Carolo check Black Ego', async () => {
    const { game, board } = createGameResult
    game.play()
    game.playMove(
      new Position({ column: 5, row: 7 }),
      new Position({ column: 4, row: 5 })
    )
    game.playMove(
      new Position({ column: 5, row: 0 }),
      new Position({ column: 4, row: 2 })
    )
    game.playMove(
      new Position({ column: 4, row: 7 }),
      new Position({ column: 7, row: 7 })
    )
    game.skipBouncing()
    game.playMove(
      new Position({ column: 2, row: 1 }),
      new Position({ column: 0, row: 0 })
    )
    game.playMove(
      new Position({ column: 7, row: 7 }),
      new Position({ column: 7, row: 0 })
    )
    game.skipBouncing()
    game.playMove(
      new Position({ column: 0, row: 0 }),
      new Position({ column: 1, row: 0 })
    )
    game.playMove(
      new Position({ column: 7, row: 0 }),
      new Position({ column: 5, row: 0 })
    )
    assert.strictEqual(game.status, 'WHITE_WON')
    assert.strictEqual(board.isReconquest('WHITE'), false)
    assert.strictEqual(board.isReconquest('BLACK'), false)
    assert.strictEqual(board.isCheck('WHITE'), false)
    assert.strictEqual(board.isCheck('BLACK'), true)
    const egoPiecePosition = board.getEgoPiecePosition('BLACK')
    assert.strictEqual(egoPiecePosition.isOccupied(), true)
    assert.strictEqual(egoPiecePosition.piece.type, 'EGO')
    assert.strictEqual(egoPiecePosition.piece.color, 'BLACK')
    assert.strictEqual(egoPiecePosition.position.toString(), 'E8')
    const caroloPiecePosition = board.getPiecePosition(
      new Position({ column: 5, row: 0 })
    )
    assert.strictEqual(caroloPiecePosition.isOccupied(), true)
    assert.strictEqual(caroloPiecePosition.piece.type, 'CAROLO')
    assert.strictEqual(caroloPiecePosition.piece.color, 'WHITE')
    assert.strictEqual(caroloPiecePosition.piece.hasMoved, true)
  })

  await t.test('Black Carolo check White Ego with Bouncing', async () => {
    const { game, board } = createGameResult
    game.play()
    game.playMove(
      new Position({ column: 2, row: 7 }),
      new Position({ column: 3, row: 5 })
    )
    game.playMove(
      new Position({ column: 2, row: 0 }),
      new Position({ column: 3, row: 2 })
    )
    game.playMove(
      new Position({ column: 5, row: 7 }),
      new Position({ column: 4, row: 5 })
    )
    assert.strictEqual(game.getCurrentPlayer().color, 'BLACK')
    assert.strictEqual(game.state.isBouncingOnGoing, false)
    game.playMove(
      new Position({ column: 3, row: 0 }),
      new Position({ column: 0, row: 0 })
    )
    assert.strictEqual(game.getCurrentPlayer().color, 'BLACK')
    assert.strictEqual(game.state.isBouncingOnGoing, true)
    game.playMove(
      new Position({ column: 0, row: 0 }),
      new Position({ column: 0, row: 7 })
    )
    assert.strictEqual(game.getCurrentPlayer().color, 'BLACK')
    assert.strictEqual(game.state.isBouncingOnGoing, true)
    game.playMove(
      new Position({ column: 0, row: 7 }),
      new Position({ column: 2, row: 7 })
    )
    assert.strictEqual(game.status, 'BLACK_WON')
    assert.strictEqual(board.isReconquest('WHITE'), false)
    assert.strictEqual(board.isReconquest('BLACK'), false)
    assert.strictEqual(board.isCheck('WHITE'), true)
    assert.strictEqual(board.isCheck('BLACK'), false)
    const egoPiecePosition = board.getEgoPiecePosition('WHITE')
    assert.strictEqual(egoPiecePosition.isOccupied(), true)
    assert.strictEqual(egoPiecePosition.piece.type, 'EGO')
    assert.strictEqual(egoPiecePosition.piece.color, 'WHITE')
    assert.strictEqual(egoPiecePosition.position.toString(), 'D1')
    const caroloPiecePosition = board.getPiecePosition(
      new Position({ column: 2, row: 7 })
    )
    assert.strictEqual(caroloPiecePosition.isOccupied(), true)
    assert.strictEqual(caroloPiecePosition.piece.type, 'CAROLO')
    assert.strictEqual(caroloPiecePosition.piece.color, 'BLACK')
    assert.strictEqual(caroloPiecePosition.piece.hasMoved, true)
  })

  await t.test(
    'Black Ego can not be check by White Carolo by himself',
    async () => {
      const { game, board } = createGameResult
      game.play()
      game.playMove(
        new Position({ column: 4, row: 6 }),
        new Position({ column: 7, row: 7 })
      )
      game.playMove(
        new Position({ column: 4, row: 1 }),
        new Position({ column: 0, row: 0 })
      )
      game.playMove(
        new Position({ column: 3, row: 6 }),
        new Position({ column: 0, row: 6 })
      )
      game.playMove(
        new Position({ column: 4, row: 0 }),
        new Position({ column: 4, row: 1 })
      )
      game.playMove(
        new Position({ column: 2, row: 6 }),
        new Position({ column: 4, row: 4 })
      )
      game.playMove(
        new Position({ column: 4, row: 1 }),
        new Position({ column: 4, row: 2 })
      )
      game.playMove(
        new Position({ column: 4, row: 7 }),
        new Position({ column: 4, row: 5 })
      )
      game.playMove(
        new Position({ column: 4, row: 5 }),
        new Position({ column: 3, row: 5 })
      )
      game.playMove(
        new Position({ column: 4, row: 2 }),
        new Position({ column: 4, row: 3 })
      )
      game.playMove(
        new Position({ column: 2, row: 5 }),
        new Position({ column: 3, row: 6 })
      )
      game.playMove(
        new Position({ column: 5, row: 1 }),
        new Position({ column: 7, row: 0 })
      )
      game.playMove(
        new Position({ column: 4, row: 4 }),
        new Position({ column: 1, row: 6 })
      )
      game.playMove(
        new Position({ column: 4, row: 3 }),
        new Position({ column: 4, row: 4 })
      )
      game.playMove(
        new Position({ column: 5, row: 5 }),
        new Position({ column: 4, row: 6 })
      )
      const egoPiecePosition = board.getEgoPiecePosition('BLACK')
      assert.strictEqual(egoPiecePosition.isOccupied(), true)
      assert.strictEqual(egoPiecePosition.piece.type, 'EGO')
      assert.strictEqual(egoPiecePosition.piece.color, 'BLACK')
      assert.strictEqual(egoPiecePosition.position.toString(), 'E4')
      assert.deepStrictEqual(
        [
          ...board
            .getAvailablePiecePositions(new Position({ column: 4, row: 4 }))
            .keys()
        ],
        ['F4', 'E5']
      )
    }
  )
})
