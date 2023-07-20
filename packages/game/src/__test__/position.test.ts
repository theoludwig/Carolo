import test from 'node:test'
import assert from 'node:assert/strict'

import { Position } from '../index.js'

await test('Position', async (t) => {
  await t.test('Initialization', async () => {
    const position = new Position({ row: 0, column: 0 })
    assert.strictEqual(position.row, 0)
    assert.strictEqual(position.column, 0)
    assert.strictEqual(position.toString(), 'A8')

    const position2 = new Position({ row: 3, column: 6 })
    assert.strictEqual(position2.row, 3)
    assert.strictEqual(position2.column, 6)
    assert.strictEqual(position2.toString(), 'G5')
  })

  await t.test('Equality', async () => {
    const position = new Position({ row: 0, column: 0 })
    const position2 = new Position({ row: 0, column: 0 })
    assert.strictEqual(position.equals(position2), true)
    assert.strictEqual(position.equals({}), false)

    const position3 = new Position({ row: 6, column: 3 })
    const position4 = new Position({ row: 6, column: 3 })
    assert.strictEqual(position3.equals(position4), true)

    const position5 = new Position({ row: 6, column: 3 })
    const position6 = new Position({ row: 3, column: 6 })
    assert.strictEqual(position5.equals(position6), false)
  })

  await t.test('isInsideSquare', async () => {
    const size = 8
    const position = new Position({ row: 0, column: 0 })
    assert.strictEqual(position.isInsideSquare(size), true)

    const position2 = new Position({ row: 7, column: 7 })
    assert.strictEqual(position2.isInsideSquare(size), true)

    const position3 = new Position({ row: 8, column: 8 })
    assert.strictEqual(position3.isInsideSquare(size), false)
  })

  await t.test('add', async () => {
    const position = new Position({ row: 0, column: 0 })
    const position2 = new Position({ row: 1, column: 1 })
    assert.strictEqual(position.add(position2).toString(), 'B7')

    const position3 = new Position({ row: 6, column: 3 })
    const position4 = new Position({ row: 1, column: 1 })
    assert.strictEqual(position3.add(position4).toString(), 'E1')
  })

  await t.test('getIntermediatePositions', async () => {
    const position1 = new Position({ row: 0, column: 0 })
    const position2 = new Position({ row: 0, column: 0 })
    assert.strictEqual(position1.getIntermediatePositions(position2).length, 0)

    const position3 = new Position({ row: 0, column: 0 })
    const position4 = new Position({ row: 0, column: 5 })
    assert.deepStrictEqual(
      position3.getIntermediatePositions(position4).map((position) => {
        return position.toString()
      }),
      ['B8', 'C8', 'D8', 'E8']
    )

    const position5 = new Position({ row: 0, column: 0 })
    const position6 = new Position({ row: 5, column: 0 })
    assert.deepStrictEqual(
      position5.getIntermediatePositions(position6).map((position) => {
        return position.toString()
      }),
      ['A7', 'A6', 'A5', 'A4']
    )

    const position7 = new Position({ row: 0, column: 0 })
    const position8 = new Position({ row: 5, column: 5 })
    assert.deepStrictEqual(
      position7.getIntermediatePositions(position8).map((position) => {
        return position.toString()
      }),
      ['B7', 'C6', 'D5', 'E4']
    )
  })

  await t.test('fromString', async () => {
    const position1 = Position.fromString('A8')
    assert.strictEqual(position1.row, 0)
    assert.strictEqual(position1.column, 0)

    const position2 = Position.fromString('G5')
    assert.strictEqual(position2.row, 3)
    assert.strictEqual(position2.column, 6)

    const position3 = Position.fromString('A1')
    assert.strictEqual(position3.row, 7)
    assert.strictEqual(position3.column, 0)

    const position4 = Position.fromString('H8')
    assert.strictEqual(position4.row, 0)
    assert.strictEqual(position4.column, 7)
  })
})
