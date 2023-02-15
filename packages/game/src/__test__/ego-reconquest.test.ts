import tap from 'tap'

import { createGame } from './utils.js'
import type { CreateGameResult } from './utils.js'
import { Position } from '../index.js'

await tap.test('Ego reconquest', async (t) => {
  let createGameResult: CreateGameResult

  t.beforeEach(async () => {
    createGameResult = createGame()
  })

  await t.test('Black Reconquest', async (t) => {
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
    t.equal(game.status, 'BLACK_WON')
    t.equal(board.isReconquest('WHITE'), false)
    t.equal(board.isReconquest('BLACK'), true)
    t.equal(board.isCheck('WHITE'), false)
    t.equal(board.isCheck('BLACK'), false)
    const egoPiecePosition = board.getEgoPiecePosition('BLACK')
    t.equal(egoPiecePosition.isOccupied(), true)
    t.equal(egoPiecePosition.piece.type, 'EGO')
    t.equal(egoPiecePosition.piece.color, 'BLACK')
    t.equal(egoPiecePosition.position.toString(), 'column-6-row-7')
  })

  await t.test('White Reconquest', async (t) => {
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
    t.equal(game.status, 'WHITE_WON')
    t.equal(board.isReconquest('WHITE'), true)
    t.equal(board.isReconquest('BLACK'), false)
    t.equal(board.isCheck('WHITE'), false)
    t.equal(board.isCheck('BLACK'), false)
    const egoPiecePosition = board.getEgoPiecePosition('WHITE')
    t.equal(egoPiecePosition.isOccupied(), true)
    t.equal(egoPiecePosition.piece.type, 'EGO')
    t.equal(egoPiecePosition.piece.color, 'WHITE')
    t.equal(egoPiecePosition.position.toString(), 'column-1-row-0')
  })

  await t.test('White Reconquest first but White Ego is check', async (t) => {
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
    t.equal(egoWhitePiecePosition.isOccupied(), true)
    t.equal(egoWhitePiecePosition.piece.type, 'EGO')
    t.equal(egoWhitePiecePosition.piece.color, 'WHITE')
    t.equal(egoWhitePiecePosition.position.toString(), 'column-3-row-1')
    t.same(
      board
        .getAvailablePiecePositions(new Position({ column: 3, row: 1 }))
        .keys(),
      ['column-3-row-2', 'column-3-row-0', 'column-2-row-1']
    )
    t.equal(game.getCurrentPlayer().color, 'WHITE')
    game.playMove(
      new Position({ column: 3, row: 1 }),
      new Position({ column: 3, row: 0 })
    )
    t.equal(game.status, 'WHITE_WON')
    t.equal(board.isReconquest('WHITE'), true)
    t.equal(board.isReconquest('BLACK'), false)
    t.equal(board.isCheck('WHITE'), true)
    t.equal(board.isCheck('BLACK'), false)
  })
})
