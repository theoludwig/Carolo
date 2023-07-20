import test from 'node:test'
import assert from 'node:assert/strict'

import { createGame } from './utils.js'
import type { GameMachine } from './utils.js'
import { Position } from '../index.js'

await test('Ego reconquest', async (t) => {
  let createGameResult: GameMachine

  t.beforeEach(async () => {
    createGameResult = createGame()
  })

  await t.test('Black Reconquest', async () => {
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
      new Position({ column: 4, row: 5 }),
      new Position({ column: 5, row: 7 })
    )
    game.playMove(
      new Position({ column: 4, row: 0 }),
      new Position({ column: 5, row: 0 })
    )
    game.playMove(
      new Position({ column: 5, row: 7 }),
      new Position({ column: 4, row: 5 })
    )
    game.playMove(
      new Position({ column: 5, row: 0 }),
      new Position({ column: 6, row: 0 })
    )
    game.playMove(
      new Position({ column: 4, row: 5 }),
      new Position({ column: 5, row: 7 })
    )
    game.playMove(
      new Position({ column: 6, row: 0 }),
      new Position({ column: 6, row: 1 })
    )
    game.playMove(
      new Position({ column: 5, row: 7 }),
      new Position({ column: 4, row: 5 })
    )
    game.playMove(
      new Position({ column: 6, row: 1 }),
      new Position({ column: 6, row: 2 })
    )
    game.playMove(
      new Position({ column: 4, row: 5 }),
      new Position({ column: 5, row: 7 })
    )
    game.playMove(
      new Position({ column: 6, row: 2 }),
      new Position({ column: 6, row: 3 })
    )
    game.playMove(
      new Position({ column: 5, row: 7 }),
      new Position({ column: 4, row: 5 })
    )
    game.playMove(
      new Position({ column: 6, row: 3 }),
      new Position({ column: 6, row: 4 })
    )
    game.playMove(
      new Position({ column: 4, row: 5 }),
      new Position({ column: 5, row: 7 })
    )
    game.playMove(
      new Position({ column: 6, row: 4 }),
      new Position({ column: 6, row: 5 })
    )
    game.playMove(
      new Position({ column: 5, row: 7 }),
      new Position({ column: 4, row: 5 })
    )
    game.playMove(
      new Position({ column: 6, row: 5 }),
      new Position({ column: 6, row: 6 })
    )
    game.playMove(
      new Position({ column: 4, row: 5 }),
      new Position({ column: 5, row: 7 })
    )
    game.playMove(
      new Position({ column: 6, row: 6 }),
      new Position({ column: 6, row: 7 })
    )
    assert.strictEqual(game.status, 'BLACK_WON')
    assert.strictEqual(board.isReconquest('WHITE'), false)
    assert.strictEqual(board.isReconquest('BLACK'), true)
    assert.strictEqual(board.isCheck('WHITE'), false)
    assert.strictEqual(board.isCheck('BLACK'), false)
    const egoPiecePosition = board.getEgoPiecePosition('BLACK')
    assert.strictEqual(egoPiecePosition.isOccupied(), true)
    assert.strictEqual(egoPiecePosition.piece.type, 'EGO')
    assert.strictEqual(egoPiecePosition.piece.color, 'BLACK')
    assert.strictEqual(egoPiecePosition.position.toString(), 'G1')
  })

  await t.test('White Reconquest', async () => {
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
      new Position({ column: 3, row: 7 }),
      new Position({ column: 2, row: 7 })
    )
    game.playMove(
      new Position({ column: 3, row: 2 }),
      new Position({ column: 2, row: 0 })
    )
    game.playMove(
      new Position({ column: 2, row: 7 }),
      new Position({ column: 1, row: 7 })
    )
    game.playMove(
      new Position({ column: 2, row: 0 }),
      new Position({ column: 3, row: 2 })
    )
    game.playMove(
      new Position({ column: 1, row: 7 }),
      new Position({ column: 1, row: 6 })
    )
    game.playMove(
      new Position({ column: 3, row: 2 }),
      new Position({ column: 2, row: 0 })
    )
    game.playMove(
      new Position({ column: 1, row: 6 }),
      new Position({ column: 1, row: 5 })
    )
    game.playMove(
      new Position({ column: 2, row: 0 }),
      new Position({ column: 3, row: 2 })
    )
    game.playMove(
      new Position({ column: 1, row: 5 }),
      new Position({ column: 1, row: 4 })
    )
    game.playMove(
      new Position({ column: 3, row: 2 }),
      new Position({ column: 2, row: 0 })
    )
    game.playMove(
      new Position({ column: 1, row: 4 }),
      new Position({ column: 1, row: 3 })
    )
    game.playMove(
      new Position({ column: 2, row: 0 }),
      new Position({ column: 3, row: 2 })
    )
    game.playMove(
      new Position({ column: 1, row: 3 }),
      new Position({ column: 1, row: 2 })
    )
    game.playMove(
      new Position({ column: 3, row: 2 }),
      new Position({ column: 2, row: 0 })
    )
    game.playMove(
      new Position({ column: 1, row: 2 }),
      new Position({ column: 1, row: 1 })
    )
    game.playMove(
      new Position({ column: 2, row: 0 }),
      new Position({ column: 3, row: 2 })
    )
    game.playMove(
      new Position({ column: 1, row: 1 }),
      new Position({ column: 1, row: 0 })
    )
    assert.strictEqual(game.status, 'WHITE_WON')
    assert.strictEqual(board.isReconquest('WHITE'), true)
    assert.strictEqual(board.isReconquest('BLACK'), false)
    assert.strictEqual(board.isCheck('WHITE'), false)
    assert.strictEqual(board.isCheck('BLACK'), false)
    const egoPiecePosition = board.getEgoPiecePosition('WHITE')
    assert.strictEqual(egoPiecePosition.isOccupied(), true)
    assert.strictEqual(egoPiecePosition.piece.type, 'EGO')
    assert.strictEqual(egoPiecePosition.piece.color, 'WHITE')
    assert.strictEqual(egoPiecePosition.position.toString(), 'B8')
  })

  await t.test('White Reconquest first but White Ego is check', async () => {
    const { game, board } = createGameResult
    game.play()
    game.playMove(
      new Position({ column: 3, row: 6 }),
      new Position({ column: 0, row: 6 })
    )
    game.playMove(
      new Position({ column: 4, row: 1 }),
      new Position({ column: 7, row: 0 })
    )
    game.playMove(
      new Position({ column: 3, row: 7 }),
      new Position({ column: 3, row: 6 })
    )
    game.playMove(
      new Position({ column: 3, row: 1 }),
      new Position({ column: 7, row: 2 })
    )
    game.playMove(
      new Position({ column: 3, row: 6 }),
      new Position({ column: 3, row: 5 })
    )
    game.playMove(
      new Position({ column: 4, row: 0 }),
      new Position({ column: 4, row: 1 })
    )
    game.playMove(
      new Position({ column: 3, row: 5 }),
      new Position({ column: 3, row: 4 })
    )
    game.playMove(
      new Position({ column: 5, row: 2 }),
      new Position({ column: 7, row: 4 })
    )
    game.playMove(
      new Position({ column: 3, row: 4 }),
      new Position({ column: 3, row: 3 })
    )
    game.playMove(
      new Position({ column: 2, row: 2 }),
      new Position({ column: 1, row: 3 })
    )
    game.playMove(
      new Position({ column: 3, row: 3 }),
      new Position({ column: 3, row: 2 })
    )
    game.playMove(
      new Position({ column: 1, row: 3 }),
      new Position({ column: 3, row: 5 })
    )
    game.playMove(
      new Position({ column: 5, row: 6 }),
      new Position({ column: 7, row: 6 })
    )
    game.playMove(
      new Position({ column: 3, row: 0 }),
      new Position({ column: 4, row: 0 })
    )
    game.playMove(
      new Position({ column: 3, row: 2 }),
      new Position({ column: 3, row: 1 })
    )
    game.playMove(
      new Position({ column: 2, row: 1 }),
      new Position({ column: 0, row: 1 })
    )
    const egoWhitePiecePosition = board.getEgoPiecePosition('WHITE')
    assert.strictEqual(egoWhitePiecePosition.isOccupied(), true)
    assert.strictEqual(egoWhitePiecePosition.piece.type, 'EGO')
    assert.strictEqual(egoWhitePiecePosition.piece.color, 'WHITE')
    assert.strictEqual(egoWhitePiecePosition.position.toString(), 'D7')
    assert.deepStrictEqual(
      [
        ...board
          .getAvailablePiecePositions(new Position({ column: 3, row: 1 }))
          .keys()
      ],
      ['D6', 'D8', 'C7']
    )
    assert.strictEqual(game.getCurrentPlayer().color, 'WHITE')
    game.playMove(
      new Position({ column: 3, row: 1 }),
      new Position({ column: 3, row: 0 })
    )
    assert.strictEqual(game.status, 'WHITE_WON')
    assert.strictEqual(board.isReconquest('WHITE'), true)
    assert.strictEqual(board.isReconquest('BLACK'), false)
    assert.strictEqual(board.isCheck('WHITE'), true)
    assert.strictEqual(board.isCheck('BLACK'), false)
  })
})
