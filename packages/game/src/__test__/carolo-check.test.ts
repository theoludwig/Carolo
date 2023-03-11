import tap from 'tap'

import { createGame } from './utils.js'
import type { GameMachine } from './utils.js'
import { Position } from '../index.js'

await tap.test('Carolo Check', async (t) => {
  let createGameResult: GameMachine

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
    t.equal(game.status, 'WHITE_WON')
    t.equal(board.isReconquest('WHITE'), false)
    t.equal(board.isReconquest('BLACK'), false)
    t.equal(board.isCheck('WHITE'), false)
    t.equal(board.isCheck('BLACK'), true)
    const egoPiecePosition = board.getEgoPiecePosition('BLACK')
    t.equal(egoPiecePosition.isOccupied(), true)
    t.equal(egoPiecePosition.piece.type, 'EGO')
    t.equal(egoPiecePosition.piece.color, 'BLACK')
    t.equal(egoPiecePosition.position.toString(), 'E8')
    const caroloPiecePosition = board.getPiecePosition(
      new Position({ column: 5, row: 0 })
    )
    t.equal(caroloPiecePosition.isOccupied(), true)
    t.equal(caroloPiecePosition.piece.type, 'CAROLO')
    t.equal(caroloPiecePosition.piece.color, 'WHITE')
    t.equal(caroloPiecePosition.piece.hasMoved, true)
  })

  await t.test('Black Carolo check White Ego with Bouncing', async (t) => {
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
    t.equal(game.getCurrentPlayer().color, 'BLACK')
    t.equal(game.state.isBouncingOnGoing, false)
    game.playMove(
      new Position({ column: 3, row: 0 }),
      new Position({ column: 0, row: 0 })
    )
    t.equal(game.getCurrentPlayer().color, 'BLACK')
    t.equal(game.state.isBouncingOnGoing, true)
    game.playMove(
      new Position({ column: 0, row: 0 }),
      new Position({ column: 0, row: 7 })
    )
    t.equal(game.getCurrentPlayer().color, 'BLACK')
    t.equal(game.state.isBouncingOnGoing, true)
    game.playMove(
      new Position({ column: 0, row: 7 }),
      new Position({ column: 2, row: 7 })
    )
    t.equal(game.status, 'BLACK_WON')
    t.equal(board.isReconquest('WHITE'), false)
    t.equal(board.isReconquest('BLACK'), false)
    t.equal(board.isCheck('WHITE'), true)
    t.equal(board.isCheck('BLACK'), false)
    const egoPiecePosition = board.getEgoPiecePosition('WHITE')
    t.equal(egoPiecePosition.isOccupied(), true)
    t.equal(egoPiecePosition.piece.type, 'EGO')
    t.equal(egoPiecePosition.piece.color, 'WHITE')
    t.equal(egoPiecePosition.position.toString(), 'D1')
    const caroloPiecePosition = board.getPiecePosition(
      new Position({ column: 2, row: 7 })
    )
    t.equal(caroloPiecePosition.isOccupied(), true)
    t.equal(caroloPiecePosition.piece.type, 'CAROLO')
    t.equal(caroloPiecePosition.piece.color, 'BLACK')
    t.equal(caroloPiecePosition.piece.hasMoved, true)
  })

  await t.test(
    'Black Ego can not be check by White Carolo by himself',
    async (t) => {
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
      t.equal(egoPiecePosition.isOccupied(), true)
      t.equal(egoPiecePosition.piece.type, 'EGO')
      t.equal(egoPiecePosition.piece.color, 'BLACK')
      t.equal(egoPiecePosition.position.toString(), 'E4')
      t.same(
        board
          .getAvailablePiecePositions(new Position({ column: 4, row: 4 }))
          .keys(),
        ['F4', 'E5']
      )
    }
  )
})
