import test from "node:test"
import assert from "node:assert/strict"

import { createGame } from "../utils.js"
import type { GameMachine } from "../utils.js"
import type { Piece } from "../../index.js"
import { Position } from "../../index.js"

await test("Hubris Available Positions", async () => {
  const createGameResult: GameMachine = createGame()
  const { game, board } = createGameResult
  assert.strictEqual(game.status, "LOBBY")
  game.play()
  assert.strictEqual(game.status, "PLAY")

  assert.strictEqual(game.getCurrentPlayer().color, "WHITE")
  assert.strictEqual(
    board.getPiecePosition(new Position({ column: 2, row: 5 })).piece.type,
    "HUBRIS",
  )
  game.playMove(
    new Position({ column: 2, row: 5 }),
    new Position({ column: 3, row: 4 }),
  )

  assert.strictEqual(game.getCurrentPlayer().color, "BLACK")
  game.playMove(
    new Position({ column: 5, row: 2 }),
    new Position({ column: 6, row: 3 }),
  )

  assert.strictEqual(game.getCurrentPlayer().color, "WHITE")
  assert.deepStrictEqual(
    [
      ...board
        .getAvailablePiecePositions(new Position({ column: 3, row: 4 }))
        .keys(),
    ],
    ["C3", "E3", "C5", "E5", "B2", "B6", "F6", "A1", "A7", "G7", "H8"],
  )
  game.playMove(
    new Position({ column: 5, row: 6 }),
    new Position({ column: 1, row: 7 }),
  )

  assert.strictEqual(game.getCurrentPlayer().color, "BLACK")
  assert.deepStrictEqual(
    [
      ...board
        .getAvailablePiecePositions(new Position({ column: 6, row: 3 }))
        .keys(),
    ],
    ["F4", "H4", "F6", "H6", "E3"],
  )
  game.playMove(
    new Position({ column: 2, row: 1 }),
    new Position({ column: 0, row: 0 }),
  )

  assert.strictEqual(game.getCurrentPlayer().color, "WHITE")
  assert.deepStrictEqual(
    [
      ...board
        .getAvailablePiecePositions(new Position({ column: 3, row: 4 }))
        .keys(),
    ],
    [
      "C3",
      "E3",
      "C5",
      "E5",
      "B2",
      "F2",
      "B6",
      "F6",
      "A1",
      "G1",
      "A7",
      "G7",
      "H8",
    ],
  )
  game.playMove(
    new Position({ column: 5, row: 7 }),
    new Position({ column: 4, row: 5 }),
  )

  assert.strictEqual(game.getCurrentPlayer().color, "BLACK")
  assert.deepStrictEqual(
    [
      ...board
        .getAvailablePiecePositions(new Position({ column: 6, row: 3 }))
        .keys(),
    ],
    ["F4", "H4", "F6", "H6", "E3"],
  )
  assert.strictEqual(
    board.isCaptureMove(
      new Position({ column: 4, row: 5 }),
      new Position({ column: 6, row: 3 }),
    ),
    true,
    "Black Hubris can capture White Bayard",
  )
  assert.strictEqual(
    board.isCaptureMove(
      new Position({ column: 7, row: 2 }),
      new Position({ column: 6, row: 3 }),
    ),
    false,
  )
  assert.strictEqual(
    board.getPiecePosition(new Position({ column: 4, row: 5 })).piece.type,
    "BAYARD",
  )
  const currentPlayer = game.getCurrentPlayer()
  assert.deepStrictEqual(currentPlayer.capturedPieces, [])
  game.playMove(
    new Position({ column: 6, row: 3 }),
    new Position({ column: 4, row: 5 }),
  )
  assert.deepStrictEqual(currentPlayer.capturedPieces.length, 1)
  assert.strictEqual(
    (currentPlayer.capturedPieces as Piece[])[0].type,
    "BAYARD",
  )
  assert.strictEqual(
    board.getPiecePosition(new Position({ column: 4, row: 5 })).piece.type,
    "HUBRIS",
  )
})
