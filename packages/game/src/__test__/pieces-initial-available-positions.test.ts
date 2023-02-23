import tap from 'tap'

import { createGame } from './utils.js'
import type { GameMachine } from './utils.js'
import { Position } from '../index.js'

await tap.test('Pieces Initial Available Positions', async (t) => {
  let createGameResult: GameMachine

  t.beforeEach(async () => {
    createGameResult = createGame()
  })

  await t.test('White Pieces Initial Positions', async (t) => {
    const { game, board } = createGameResult
    t.equal(game.status, 'LOBBY')
    game.play()
    t.equal(game.status, 'PLAY')
    t.equal(game.getCurrentPlayer().color, 'WHITE')

    t.same(
      board.getAvailablePiecePositions(new Position({ row: 0, column: 0 })),
      new Map(),
      'No available positions for free position (with no piece)'
    )

    const egoPiecePosition = board.getEgoPiecePosition('WHITE')
    t.equal(egoPiecePosition.piece.type, 'EGO')
    t.same(
      board.getAvailablePiecePositions(egoPiecePosition.position),
      new Map()
    )

    const caroloPiecePosition = board.getPiecePosition(
      new Position({ row: 7, column: 4 })
    )
    t.same(
      board.getAvailablePiecePositions(caroloPiecePosition.position),
      new Map()
    )

    const bayardLeftPiecePosition = board.getPiecePosition(
      new Position({ row: 7, column: 2 })
    )
    t.same(
      board.getAvailablePiecePositions(bayardLeftPiecePosition.position).keys(),
      ['column-1-row-5', 'column-3-row-5', 'column-0-row-6']
    )

    const bayardRightPiecePosition = board.getPiecePosition(
      new Position({ row: 7, column: 5 })
    )
    t.same(
      board
        .getAvailablePiecePositions(bayardRightPiecePosition.position)
        .keys(),
      ['column-7-row-6', 'column-4-row-5', 'column-6-row-5']
    )

    const aymonRow = board.getAymonInitialRow('WHITE')
    for (let column = 2; column <= 5; column++) {
      const aymonPiecePosition = board.getPiecePosition(
        new Position({ row: aymonRow, column })
      )
      t.equal(
        board.getAvailablePiecePositions(aymonPiecePosition.position).size,
        44,
        'Aymon teleport to any free position on the board'
      )
    }

    const leftHubris = board.getPiecePosition(
      new Position({ row: 5, column: 2 })
    )
    t.same(board.getAvailablePiecePositions(leftHubris.position).keys(), [
      'column-1-row-6',
      'column-1-row-4',
      'column-3-row-4',
      'column-0-row-7',
      'column-0-row-3',
      'column-4-row-3'
    ])

    const rightHubris = board.getPiecePosition(
      new Position({ row: 5, column: 5 })
    )
    t.same(board.getAvailablePiecePositions(rightHubris.position).keys(), [
      'column-6-row-6',
      'column-4-row-4',
      'column-6-row-4',
      'column-7-row-7',
      'column-3-row-3',
      'column-7-row-3'
    ])
  })
})
