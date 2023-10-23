import test from "node:test"
import assert from "node:assert/strict"

import { createGame } from "../utils.js"
import type { GameMachine } from "../utils.js"
import { Position } from "../../index.js"

await test("Ego Available Positions", async () => {
  const createGameResult: GameMachine = createGame()
  const { game, board } = createGameResult
  assert.strictEqual(game.status, "LOBBY")
  game.play()
  assert.strictEqual(game.status, "PLAY")
  assert.strictEqual(game.getCurrentPlayer().color, "WHITE")

  assert.strictEqual(game.getCurrentPlayer().color, "WHITE")
  assert.strictEqual(
    board.getPiecePosition(new Position({ column: 3, row: 7 })).piece.type,
    "EGO",
  )
  assert.strictEqual(
    board.getAvailablePiecePositions(new Position({ column: 3, row: 7 })).size,
    0,
    "Ego should not be able to move (first move)",
  )
  game.playMove(
    new Position({ column: 2, row: 7 }),
    new Position({ column: 0, row: 6 }),
  )

  assert.strictEqual(game.getCurrentPlayer().color, "BLACK")
  game.playMove(
    new Position({ column: 4, row: 1 }),
    new Position({ column: 0, row: 0 }),
  )

  assert.deepStrictEqual(
    [
      ...board
        .getAvailablePiecePositions(new Position({ column: 3, row: 7 }))
        .keys(),
    ],
    ["C1"],
  )
  assert.strictEqual(game.getCurrentPlayer().color, "WHITE")
  game.playMove(
    new Position({ column: 3, row: 7 }),
    new Position({ column: 2, row: 7 }),
  )

  assert.deepStrictEqual(
    [
      ...board
        .getAvailablePiecePositions(new Position({ column: 4, row: 0 }))
        .keys(),
    ],
    ["E7"],
  )
  assert.strictEqual(game.getCurrentPlayer().color, "BLACK")
  game.playMove(
    new Position({ column: 4, row: 0 }),
    new Position({ column: 4, row: 1 }),
  )

  assert.deepStrictEqual(
    [
      ...board
        .getAvailablePiecePositions(new Position({ column: 2, row: 7 }))
        .keys(),
    ],
    ["D1", "B1"],
  )
  assert.strictEqual(game.getCurrentPlayer().color, "WHITE")
  game.playMove(
    new Position({ column: 2, row: 7 }),
    new Position({ column: 1, row: 7 }),
  )

  assert.strictEqual(game.getCurrentPlayer().color, "BLACK")
  assert.deepStrictEqual(
    [
      ...board
        .getAvailablePiecePositions(new Position({ column: 4, row: 1 }))
        .keys(),
    ],
    ["E6", "E8"],
  )
  game.playMove(
    new Position({ column: 4, row: 1 }),
    new Position({ column: 4, row: 2 }),
  )

  assert.strictEqual(game.getCurrentPlayer().color, "WHITE")
  assert.deepStrictEqual(
    [
      ...board
        .getAvailablePiecePositions(new Position({ column: 1, row: 7 }))
        .keys(),
    ],
    ["C1", "B2", "A1"],
  )
  game.playMove(
    new Position({ column: 1, row: 7 }),
    new Position({ column: 1, row: 6 }),
  )

  assert.strictEqual(game.getCurrentPlayer().color, "BLACK")
  game.playMove(
    new Position({ column: 2, row: 0 }),
    new Position({ column: 1, row: 2 }),
  )

  assert.strictEqual(game.getCurrentPlayer().color, "WHITE")
  game.playMove(
    new Position({ column: 1, row: 6 }),
    new Position({ column: 1, row: 5 }),
  )

  assert.strictEqual(game.getCurrentPlayer().color, "BLACK")
  game.playMove(
    new Position({ column: 4, row: 2 }),
    new Position({ column: 4, row: 3 }),
  )

  assert.strictEqual(game.getCurrentPlayer().color, "WHITE")
  game.playMove(
    new Position({ column: 2, row: 5 }),
    new Position({ column: 0, row: 3 }),
  )

  assert.strictEqual(game.getCurrentPlayer().color, "BLACK")
  assert.deepStrictEqual(
    [
      ...board
        .getAvailablePiecePositions(new Position({ column: 4, row: 3 }))
        .keys(),
    ],
    ["E4", "F5", "E6", "D5"],
  )
  game.playMove(
    new Position({ column: 1, row: 2 }),
    new Position({ column: 2, row: 4 }),
  )
  game.playMove(
    new Position({ column: 1, row: 5 }),
    new Position({ column: 2, row: 5 }),
  )
  game.playMove(
    new Position({ column: 5, row: 1 }),
    new Position({ column: 7, row: 0 }),
  )

  assert.strictEqual(game.getCurrentPlayer().color, "WHITE")
  assert.deepStrictEqual(
    [
      ...board
        .getAvailablePiecePositions(new Position({ column: 2, row: 5 }))
        .keys(),
    ],
    ["D3", "C4", "B3"],
  )
  assert.strictEqual(
    board.isCaptureMove(
      new Position({ column: 2, row: 4 }),
      new Position({ column: 2, row: 5 }),
    ),
    true,
  )
  assert.strictEqual(
    board.getPiecePosition(new Position({ column: 2, row: 4 })).piece.type,
    "BAYARD",
  )
  game.playMove(
    new Position({ column: 2, row: 5 }),
    new Position({ column: 2, row: 4 }),
  )
  assert.strictEqual(
    board.getPiecePosition(new Position({ column: 2, row: 4 })).piece.type,
    "EGO",
  )
})
