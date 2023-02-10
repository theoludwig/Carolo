import tap from 'tap'

import { createGame } from './utils.js'
import type { CreateGameResult } from './utils.js'
import { Position } from '../index.js'

await tap.test('Carolo Check', async (t) => {
  let createGameResult: CreateGameResult

  t.beforeEach(async () => {
    createGameResult = createGame()
  })

  await t.test('White Carolo check Black Ego', async (t) => {
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
    game.playMove(
      new Position({ column: 2, row: 1 }),
      new Position({ column: 0, row: 0 })
    )
    game.playMove(
      new Position({ column: 7, row: 7 }),
      new Position({ column: 7, row: 0 })
    )
    game.playMove(
      new Position({ column: 0, row: 0 }),
      new Position({ column: 1, row: 0 })
    )
    game.playMove(
      new Position({ column: 7, row: 0 }),
      new Position({ column: 5, row: 0 })
    )
    t.equal(game.status, 'WHITE_WON')
    t.equal(board.isReconquest('WHITE'), false)
    t.equal(board.isReconquest('BLACK'), false)
    t.equal(board.isCheck('WHITE'), false)
    t.equal(board.isCheck('BLACK'), true)
    const egoPiecePosition = board.getEgoPiecePosition('BLACK')
    t.equal(egoPiecePosition.isOccupied(), true)
    t.equal(egoPiecePosition.piece.type, 'EGO')
    t.equal(egoPiecePosition.piece.color, 'BLACK')
    t.equal(egoPiecePosition.position.toString(), 'column-4-row-0')
    const caroloPiecePosition = board.getPiecePosition(
      new Position({ column: 5, row: 0 })
    )
    t.equal(caroloPiecePosition.isOccupied(), true)
    t.equal(caroloPiecePosition.piece.type, 'CAROLO')
    t.equal(caroloPiecePosition.piece.color, 'WHITE')
    t.equal(caroloPiecePosition.piece.hasMoved, true)
  })
})
