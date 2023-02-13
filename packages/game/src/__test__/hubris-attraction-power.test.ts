import tap from 'tap'

import { createGame } from './utils.js'
import type { CreateGameResult } from './utils.js'
import { Position } from '../index.js'

await tap.test('Hubris Attraction Power', async (t) => {
  let createGameResult: CreateGameResult

  t.beforeEach(async () => {
    createGameResult = createGame()
  })

  await t.test(
    'White Ego attracted by Black Hubris (right side)',
    async (t) => {
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
      t.equal(game.getCurrentPlayer().color, 'WHITE')
      const egoPiecePosition = board.getEgoPiecePosition('WHITE')
      t.equal(egoPiecePosition.piece.type, 'EGO')
      t.equal(egoPiecePosition.piece.color, 'WHITE')
      t.equal(
        egoPiecePosition.position.equals(new Position({ column: 3, row: 7 })),
        true
      )
      t.same(
        board
          .getAvailablePiecePositions(new Position({ column: 3, row: 7 }))
          .keys(),
        ['column-5-row-5']
      )
      t.same(
        board
          .getAvailablePiecePositions(new Position({ column: 5, row: 6 }))
          .keys(),
        [],
        "White Aymon can't move"
      )
    }
  )

  await t.test('Black Ego attracted by White Hubris (left side)', async (t) => {
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
    t.equal(game.getCurrentPlayer().color, 'BLACK')
    const egoPiecePosition = board.getEgoPiecePosition('BLACK')
    t.equal(egoPiecePosition.piece.type, 'EGO')
    t.equal(egoPiecePosition.piece.color, 'BLACK')
    t.equal(
      egoPiecePosition.position.equals(new Position({ column: 4, row: 0 })),
      true
    )
    t.same(
      board
        .getAvailablePiecePositions(new Position({ column: 4, row: 0 }))
        .keys(),
      ['column-2-row-2']
    )
  })

  await t.test(
    'Black Ego attracted by White Hubris (left side) but can be intercepted by Black Hubris',
    async (t) => {
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
      t.equal(game.getCurrentPlayer().color, 'BLACK')
      const egoPiecePosition = board.getEgoPiecePosition('BLACK')
      t.equal(egoPiecePosition.piece.type, 'EGO')
      t.equal(egoPiecePosition.piece.color, 'BLACK')
      t.equal(
        egoPiecePosition.position.equals(new Position({ column: 4, row: 0 })),
        true
      )
      t.same(
        board
          .getAvailablePiecePositions(new Position({ column: 4, row: 0 }))
          .keys(),
        ['column-2-row-2']
      )
      t.same(
        board
          .getAvailablePiecePositions(new Position({ column: 4, row: 4 }))
          .keys(),
        ['column-2-row-2'],
        'Black Hubris can intercept White Hubris'
      )
      game.playMove(
        new Position({ column: 4, row: 4 }),
        new Position({ column: 2, row: 2 })
      )

      t.equal(game.getCurrentPlayer().color, 'WHITE')
      game.playMove(
        new Position({ column: 1, row: 3 }),
        new Position({ column: 0, row: 4 })
      )

      t.equal(game.getCurrentPlayer().color, 'BLACK')
      t.same(
        board
          .getAvailablePiecePositions(new Position({ column: 4, row: 0 }))
          .keys(),
        [],
        "Black Ego can't be attracted by White Hubris anymore"
      )
    }
  )

  await t.test(
    'Black Ego attracted by White Hubris (left side) but can be intercepted by Black Hubris (on another position than the Ego attracted position)',
    async (t) => {
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
      t.equal(game.getCurrentPlayer().color, 'BLACK')
      const egoPiecePosition = board.getEgoPiecePosition('BLACK')
      t.equal(egoPiecePosition.piece.type, 'EGO')
      t.equal(egoPiecePosition.piece.color, 'BLACK')
      t.equal(
        egoPiecePosition.position.equals(new Position({ column: 4, row: 0 })),
        true
      )
      t.same(
        board
          .getAvailablePiecePositions(new Position({ column: 4, row: 0 }))
          .keys(),
        ['column-2-row-2']
      )
      t.same(
        board
          .getAvailablePiecePositions(new Position({ column: 5, row: 3 }))
          .keys(),
        ['column-3-row-1'],
        'Black Hubris can intercept White Hubris on another position than the Ego attracted position'
      )
      t.same(
        board
          .getAvailablePiecePositions(new Position({ column: 5, row: 2 }))
          .keys(),
        [],
        "Black Hubris can't move if can't intercept White Hubris"
      )
      t.same(
        board
          .getAvailablePiecePositions(new Position({ column: 3, row: 0 }))
          .keys(),
        [],
        "Black Carolo can't move"
      )
      t.same(
        board
          .getAvailablePiecePositions(new Position({ column: 2, row: 0 }))
          .keys(),
        [],
        "Black Bayard can't move"
      )
      t.same(
        board
          .getAvailablePiecePositions(new Position({ column: 2, row: 1 }))
          .keys(),
        [],
        "Black Aymon can't move"
      )
    }
  )

  await t.test(
    'Black Ego attracted by White Hubris (right side) but can be intercepted by Black Hubris (on another position than the Ego attracted position)',
    async (t) => {
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
      t.equal(game.getCurrentPlayer().color, 'BLACK')
      const egoPiecePosition = board.getEgoPiecePosition('BLACK')
      t.equal(egoPiecePosition.piece.type, 'EGO')
      t.equal(egoPiecePosition.piece.color, 'BLACK')
      t.equal(
        egoPiecePosition.position.equals(new Position({ column: 4, row: 0 })),
        true
      )
      t.same(
        board
          .getAvailablePiecePositions(new Position({ column: 4, row: 0 }))
          .keys(),
        ['column-6-row-2']
      )
      t.same(
        board
          .getAvailablePiecePositions(new Position({ column: 3, row: 3 }))
          .keys(),
        ['column-5-row-1'],
        'Black Hubris can intercept White Hubris on another position than the Ego attracted position'
      )
      t.same(
        board
          .getAvailablePiecePositions(new Position({ column: 2, row: 1 }))
          .keys(),
        [],
        "Black Aymon can't move"
      )
    }
  )
})
