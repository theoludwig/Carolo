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
      ['B3', 'D3', 'A2']
    )

    const bayardRightPiecePosition = board.getPiecePosition(
      new Position({ row: 7, column: 5 })
    )
    t.same(
      board
        .getAvailablePiecePositions(bayardRightPiecePosition.position)
        .keys(),
      ['H2', 'E3', 'G3']
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
      'B2',
      'B4',
      'D4',
      'A1',
      'A5',
      'E5'
    ])

    const rightHubris = board.getPiecePosition(
      new Position({ row: 5, column: 5 })
    )
    t.same(board.getAvailablePiecePositions(rightHubris.position).keys(), [
      'G2',
      'E4',
      'G4',
      'H1',
      'D5',
      'H5'
    ])
  })
})
