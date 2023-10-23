import test from "node:test"
import assert from "node:assert/strict"

import { createGame } from "./utils.js"
import type { GameMachine } from "./utils.js"
import type { PieceColor } from "../index.js"
import { Position, Board, Game, Player } from "../index.js"

await test("Game Initialization", async (t) => {
  let createGameResult: GameMachine

  t.beforeEach(async () => {
    createGameResult = createGame()
  })

  await t.test(
    "Lobby Initialization throws if there aren't 2 players",
    async () => {
      const board = new Board()
      const player1 = new Player("WHITE")
      const players = [player1]
      assert.throws(() => {
        new Game(board, players)
      })
    },
  )

  await t.test("Lobby Initialization", async () => {
    const { game } = createGameResult
    assert.strictEqual(game.status, "LOBBY")

    assert.strictEqual(game.getPlayer(0).color, "WHITE")
    assert.strictEqual(game.getPlayer(1).color, "BLACK")

    game.setPlayerColor(0, "BLACK")
    assert.strictEqual(game.getPlayer(0).color, "BLACK")
    assert.strictEqual(game.getPlayer(1).color, "WHITE")

    game.setPlayerColor(1, "BLACK")
    assert.strictEqual(game.getPlayer(0).color, "WHITE")
    assert.strictEqual(game.getPlayer(1).color, "BLACK")

    game.setPlayerColor(1, "WHITE")
    assert.strictEqual(game.getPlayer(0).color, "BLACK")
    assert.strictEqual(game.getPlayer(1).color, "WHITE")
  })

  await t.test("Play Initialization", async (t) => {
    const { game, board } = createGameResult
    assert.strictEqual(game.status, "LOBBY")
    game.play()
    assert.strictEqual(game.status, "PLAY")
    assert.strictEqual(game.getCurrentPlayer().color, "WHITE")

    const piecesInitialization = (color: PieceColor): void => {
      const lastRow = board.getLastRow(color)

      const egoPiecePosition = board.getEgoPiecePosition(color)
      assert.strictEqual(egoPiecePosition.isOccupied(), true)
      assert.strictEqual(egoPiecePosition.isFree(), false)
      assert.strictEqual(egoPiecePosition.piece.type, "EGO")
      assert.strictEqual(egoPiecePosition.piece.color, color)
      assert.strictEqual(egoPiecePosition.piece.hasMoved, false)
      const piecePosition = color === "WHITE" ? "D1" : "E8"
      assert.strictEqual(egoPiecePosition.position.toString(), piecePosition)

      const caroloColumn = color === "WHITE" ? 4 : 3
      const caroloPiecePosition = board.getPiecePosition(
        new Position({ row: lastRow, column: caroloColumn }),
      )
      assert.strictEqual(caroloPiecePosition.isOccupied(), true)
      assert.strictEqual(caroloPiecePosition.piece.type, "CAROLO")
      assert.strictEqual(caroloPiecePosition.piece.color, color)

      const bayardLeftPiecePosition = board.getPiecePosition(
        new Position({ row: lastRow, column: 2 }),
      )
      assert.strictEqual(bayardLeftPiecePosition.isOccupied(), true)
      assert.strictEqual(bayardLeftPiecePosition.piece.type, "BAYARD")
      assert.strictEqual(bayardLeftPiecePosition.piece.color, color)

      const bayardRightPiecePosition = board.getPiecePosition(
        new Position({ row: lastRow, column: 5 }),
      )
      assert.strictEqual(bayardRightPiecePosition.isOccupied(), true)
      assert.strictEqual(bayardRightPiecePosition.piece.type, "BAYARD")
      assert.strictEqual(bayardRightPiecePosition.piece.color, color)

      const aymonRow = board.getAymonInitialRow(color)
      for (let column = 2; column <= 5; column++) {
        const aymonPiecePosition = board.getPiecePosition(
          new Position({ row: aymonRow, column }),
        )
        assert.strictEqual(aymonPiecePosition.isOccupied(), true)
        assert.strictEqual(aymonPiecePosition.piece.type, "AYMON")
        assert.strictEqual(aymonPiecePosition.piece.color, color)
      }

      const hubrisRow = board.getHubrisInitialRow(color)
      const hubrisLeftPiecePosition = board.getPiecePosition(
        new Position({ row: hubrisRow, column: 2 }),
      )
      assert.strictEqual(hubrisLeftPiecePosition.isOccupied(), true)
      assert.strictEqual(hubrisLeftPiecePosition.piece.type, "HUBRIS")
      assert.strictEqual(hubrisLeftPiecePosition.piece.color, color)

      const hubrisRightPiecePosition = board.getPiecePosition(
        new Position({ row: hubrisRow, column: 5 }),
      )
      assert.strictEqual(hubrisRightPiecePosition.isOccupied(), true)
      assert.strictEqual(hubrisRightPiecePosition.piece.type, "HUBRIS")
      assert.strictEqual(hubrisRightPiecePosition.piece.color, color)
    }

    await t.test("Black Pieces", async () => {
      const color = "BLACK"
      assert.strictEqual(board.getLastRow(color), 0)
      assert.strictEqual(board.getAymonInitialRow(color), 1)
      assert.strictEqual(board.getHubrisInitialRow(color), 2)
      piecesInitialization(color)
    })

    await t.test("White Pieces", async () => {
      const color = "WHITE"
      assert.strictEqual(board.getLastRow(color), 7)
      assert.strictEqual(board.getAymonInitialRow(color), 6)
      assert.strictEqual(board.getHubrisInitialRow(color), 5)
      piecesInitialization(color)
    })
  })

  await t.test("Always the White Player starts", async () => {
    const { game } = createGameResult
    game.play()
    assert.strictEqual(game.getCurrentPlayer().color, "WHITE")
    assert.strictEqual(game.state.currentPlayerIndex, 0)
    game.restart()
    game.setPlayerColor(0, "BLACK")
    game.play()
    assert.strictEqual(game.getCurrentPlayer().color, "WHITE")
    assert.strictEqual(game.state.currentPlayerIndex, 1)
  })

  await t.test("PiecePosition.piece throws if position is free", async () => {
    const { board } = createGameResult
    const freePosition = board.getPiecePosition(
      new Position({ row: 0, column: 0 }),
    )
    assert.strictEqual(freePosition.isFree(), true)
    let piece = null
    assert.throws(() => {
      piece = freePosition.piece
    })
    assert.strictEqual(piece, null)
  })

  await t.test(
    "Game.playMove throws if game is not in PLAY status",
    async () => {
      const { game } = createGameResult
      assert.strictEqual(game.status, "LOBBY")
      assert.throws(() => {
        game.playMove(
          new Position({ row: 0, column: 0 }),
          new Position({ row: 0, column: 1 }),
        )
      })
    },
  )

  await t.test(
    "Game.playMove throws if there is no piece at the fromPosition",
    async () => {
      const { game } = createGameResult
      game.play()
      assert.strictEqual(game.status, "PLAY")
      assert.throws(() => {
        game.playMove(
          new Position({ row: 0, column: 0 }),
          new Position({ row: 0, column: 1 }),
        )
      })
    },
  )

  await t.test(
    "Game.playMove throws if piece is not the current player",
    async () => {
      const { game } = createGameResult
      game.play()
      assert.strictEqual(game.status, "PLAY")
      assert.throws(() => {
        game.playMove(
          new Position({ row: 1, column: 2 }),
          new Position({ row: 0, column: 0 }),
        )
      })
    },
  )

  await t.test("Game.playMove throws if move is not valid", async () => {
    const { game } = createGameResult
    game.play()
    assert.strictEqual(game.status, "PLAY")
    assert.throws(() => {
      game.playMove(
        new Position({ row: 7, column: 3 }),
        new Position({ row: 0, column: 1 }),
      )
    })
  })
})
