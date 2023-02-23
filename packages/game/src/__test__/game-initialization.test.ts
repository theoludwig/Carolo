import tap from 'tap'

import { createGame } from './utils.js'
import type { GameMachine } from './utils.js'
import type { PieceColor } from '../index.js'
import { Position, Board, Game, Player } from '../index.js'

await tap.test('Game Initialization', async (t) => {
  let createGameResult: GameMachine

  t.beforeEach(async () => {
    createGameResult = createGame()
  })

  await t.test(
    "Lobby Initialization throws if there aren't 2 players",
    async (t) => {
      const board = new Board()
      const player1 = new Player('WHITE')
      const players = [player1]
      t.throws(() => {
        new Game(board, players)
      })
    }
  )

  await t.test('Lobby Initialization', async (t) => {
    const { game } = createGameResult
    t.equal(game.status, 'LOBBY')

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

  await t.test('Always the White Player starts', async (t) => {
    const { game } = createGameResult
    game.play()
    t.equal(game.getCurrentPlayer().color, 'WHITE')
    t.equal(game.state.currentPlayerIndex, 0)
    game.restart()
    game.setPlayerColor(0, 'BLACK')
    game.play()
    t.equal(game.getCurrentPlayer().color, 'WHITE')
    t.equal(game.state.currentPlayerIndex, 1)
  })

  await t.test('PiecePosition.piece throws if position is free', async (t) => {
    const { board } = createGameResult
    const freePosition = board.getPiecePosition(
      new Position({ row: 0, column: 0 })
    )
    t.equal(freePosition.isFree(), true)
    let piece = null
    t.throws(() => {
      piece = freePosition.piece
    })
    t.equal(piece, null)
  })

  await t.test(
    'Game.playMove throws if game is not in PLAY status',
    async (t) => {
      const { game } = createGameResult
      t.equal(game.status, 'LOBBY')
      t.throws(() => {
        game.playMove(
          new Position({ row: 0, column: 0 }),
          new Position({ row: 0, column: 1 })
        )
      }, 'Game Status not in play mode.')
    }
  )

  await t.test(
    'Game.playMove throws if there is no piece at the fromPosition',
    async (t) => {
      const { game } = createGameResult
      game.play()
      t.equal(game.status, 'PLAY')
      t.throws(() => {
        game.playMove(
          new Position({ row: 0, column: 0 }),
          new Position({ row: 0, column: 1 })
        )
      }, 'No piece at this position.')
    }
  )

  await t.test(
    'Game.playMove throws if piece is not the current player',
    async (t) => {
      const { game } = createGameResult
      game.play()
      t.equal(game.status, 'PLAY')
      t.throws(() => {
        game.playMove(
          new Position({ row: 1, column: 2 }),
          new Position({ row: 0, column: 0 })
        )
      }, 'Not your turn.')
    }
  )

  await t.test('Game.playMove throws if move is not valid', async (t) => {
    const { game } = createGameResult
    game.play()
    t.equal(game.status, 'PLAY')
    t.throws(() => {
      game.playMove(
        new Position({ row: 7, column: 3 }),
        new Position({ row: 0, column: 1 })
      )
    }, 'This move is not allowed.')
  })
})
