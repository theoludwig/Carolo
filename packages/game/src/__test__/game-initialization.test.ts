import tap from 'tap'

import { createGame } from './utils.js'
import type { CreateGameResult } from './utils.js'
import type { PieceColor } from '../index.js'
import { Position, Board, Game, Player } from '../index.js'

await tap.test('Game Initialization', async (t) => {
  let createGameResult: CreateGameResult

  t.beforeEach(async () => {
    createGameResult = createGame()
  })

  await t.test(
    "Lobby Initialization throws if there aren't 2 players",
    async (t) => {
      const board = new Board()
      const player1 = new Player('Player 1', 'WHITE')
      const players = [player1]
      t.throws(() => {
        new Game(board, players)
      })
    }
  )

  await t.test('Lobby Initialization', async (t) => {
    const { game } = createGameResult
    t.equal(game.status, 'LOBBY')
    game.setPlayerName(0, 'Bobby')
    game.setPlayerName(1, 'Alice')
    t.equal(game.getPlayer(0).name, 'Bobby')
    t.equal(game.getPlayer(1).name, 'Alice')

    t.equal(game.getPlayer(0).color, 'WHITE')
    t.equal(game.getPlayer(1).color, 'BLACK')

    game.setPlayerColor(0, 'BLACK')
    t.equal(game.getPlayer(0).color, 'BLACK')
    t.equal(game.getPlayer(1).color, 'WHITE')

    game.setPlayerColor(1, 'BLACK')
    t.equal(game.getPlayer(0).color, 'WHITE')
    t.equal(game.getPlayer(1).color, 'BLACK')

    game.setPlayerColor(1, 'WHITE')
    t.equal(game.getPlayer(0).color, 'BLACK')
    t.equal(game.getPlayer(1).color, 'WHITE')
  })

  await t.test('Play Initialization', async (t) => {
    const { game, board } = createGameResult
    t.equal(game.status, 'LOBBY')
    game.play()
    t.equal(game.status, 'PLAY')
    t.equal(game.getCurrentPlayer().color, 'WHITE')

    const piecesInitialization = (t: Tap.Test, color: PieceColor): void => {
      const lastRow = board.getLastRow(color)

      const egoPiecePosition = board.getEgoPiecePosition(color)
      t.equal(egoPiecePosition.isOccupied(), true)
      t.equal(egoPiecePosition.isFree(), false)
      t.equal(egoPiecePosition.piece.type, 'EGO')
      t.equal(egoPiecePosition.piece.color, color)
      t.equal(egoPiecePosition.piece.hasMoved, false)
      const piecePosition =
        color === 'WHITE' ? 'column-3-row-7' : 'column-4-row-0'
      t.equal(egoPiecePosition.position.toString(), piecePosition)

      const caroloColumn = color === 'WHITE' ? 4 : 3
      const caroloPiecePosition = board.getPiecePosition(
        new Position({ row: lastRow, column: caroloColumn })
      )
      t.equal(caroloPiecePosition.isOccupied(), true)
      t.equal(caroloPiecePosition.piece.type, 'CAROLO')
      t.equal(caroloPiecePosition.piece.color, color)

      const bayardLeftPiecePosition = board.getPiecePosition(
        new Position({ row: lastRow, column: 2 })
      )
      t.equal(bayardLeftPiecePosition.isOccupied(), true)
      t.equal(bayardLeftPiecePosition.piece.type, 'BAYARD')
      t.equal(bayardLeftPiecePosition.piece.color, color)

      const bayardRightPiecePosition = board.getPiecePosition(
        new Position({ row: lastRow, column: 5 })
      )
      t.equal(bayardRightPiecePosition.isOccupied(), true)
      t.equal(bayardRightPiecePosition.piece.type, 'BAYARD')
      t.equal(bayardRightPiecePosition.piece.color, color)

      const aymonRow = board.getAymonInitialRow(color)
      for (let column = 2; column <= 5; column++) {
        const aymonPiecePosition = board.getPiecePosition(
          new Position({ row: aymonRow, column })
        )
        t.equal(aymonPiecePosition.isOccupied(), true)
        t.equal(aymonPiecePosition.piece.type, 'AYMON')
        t.equal(aymonPiecePosition.piece.color, color)
      }

      const hubrisRow = board.getHubrisInitialRow(color)
      const hubrisLeftPiecePosition = board.getPiecePosition(
        new Position({ row: hubrisRow, column: 2 })
      )
      t.equal(hubrisLeftPiecePosition.isOccupied(), true)
      t.equal(hubrisLeftPiecePosition.piece.type, 'HUBRIS')
      t.equal(hubrisLeftPiecePosition.piece.color, color)

      const hubrisRightPiecePosition = board.getPiecePosition(
        new Position({ row: hubrisRow, column: 5 })
      )
      t.equal(hubrisRightPiecePosition.isOccupied(), true)
      t.equal(hubrisRightPiecePosition.piece.type, 'HUBRIS')
      t.equal(hubrisRightPiecePosition.piece.color, color)
    }

    await t.test('Black Pieces', async (t) => {
      const color = 'BLACK'
      t.equal(board.getLastRow(color), 0)
      t.equal(board.getAymonInitialRow(color), 1)
      t.equal(board.getHubrisInitialRow(color), 2)
      piecesInitialization(t, color)
    })

    await t.test('White Pieces', async (t) => {
      const color = 'WHITE'
      t.equal(board.getLastRow(color), 7)
      t.equal(board.getAymonInitialRow(color), 6)
      t.equal(board.getHubrisInitialRow(color), 5)
      piecesInitialization(t, color)
    })
  })
})
