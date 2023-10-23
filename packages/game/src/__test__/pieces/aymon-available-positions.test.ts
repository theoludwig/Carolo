import test from "node:test"
import assert from "node:assert/strict"

import { createGame } from "../utils.js"
import type { GameMachine } from "../utils.js"
import { Aymon, Position } from "../../index.js"

await test("Aymon Available Positions", async () => {
  const createGameResult: GameMachine = createGame()
  const { game, board } = createGameResult
  assert.strictEqual(game.status, "LOBBY")
  game.play()
  assert.strictEqual(game.status, "PLAY")
  assert.strictEqual(game.getCurrentPlayer().color, "WHITE")

  assert.strictEqual(
    board.getPiecePosition(new Position({ column: 3, row: 6 })).piece.type,
    "AYMON",
  )
  assert.strictEqual(
    board.getPiecePosition(new Position({ column: 4, row: 4 })).isFree(),
    true,
  )
  assert.strictEqual(
    board.getAvailablePiecePositions(new Position({ column: 3, row: 6 })).size,
    44,
    "Aymon should be able to teleport to any position on the board",
  )
  assert.throws(() => {
    new Aymon("WHITE").getPositionsOffsets()
  })
})
