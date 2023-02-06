import tap from 'tap'

import { Position } from '../index.js'

await tap.test('Position', async (t) => {
  await t.test('Initialization', async (t) => {
    const position = new Position({ row: 0, column: 0 })
    t.equal(position.row, 0)
    t.equal(position.column, 0)
    t.equal(position.toString(), 'column-0-row-0')

    const position2 = new Position({ row: 3, column: 6 })
    t.equal(position2.row, 3)
    t.equal(position2.column, 6)
    t.equal(position2.toString(), 'column-6-row-3')
  })

  await t.test('Equality', async (t) => {
    const position = new Position({ row: 0, column: 0 })
    const position2 = new Position({ row: 0, column: 0 })
    t.equal(position.equals(position2), true)

    const position3 = new Position({ row: 6, column: 3 })
    const position4 = new Position({ row: 6, column: 3 })
    t.equal(position3.equals(position4), true)

    const position5 = new Position({ row: 6, column: 3 })
    const position6 = new Position({ row: 3, column: 6 })
    t.equal(position5.equals(position6), false)
  })

  await t.test('isInsideSquare', async (t) => {
    const size = 8
    const position = new Position({ row: 0, column: 0 })
    t.equal(position.isInsideSquare(size), true)

    const position2 = new Position({ row: 7, column: 7 })
    t.equal(position2.isInsideSquare(size), true)

    const position3 = new Position({ row: 8, column: 8 })
    t.equal(position3.isInsideSquare(size), false)
  })

  await t.test('add', async (t) => {
    const position = new Position({ row: 0, column: 0 })
    const position2 = new Position({ row: 1, column: 1 })
    t.equal(position.add(position2).toString(), 'column-1-row-1')

    const position3 = new Position({ row: 6, column: 3 })
    const position4 = new Position({ row: 1, column: 1 })
    t.equal(position3.add(position4).toString(), 'column-4-row-7')
  })

  await t.test('getIntermediatePositions', async (t) => {
    const position1 = new Position({ row: 0, column: 0 })
    const position2 = new Position({ row: 0, column: 0 })
    t.equal(position1.getIntermediatePositions(position2).length, 0)

    const position3 = new Position({ row: 0, column: 0 })
    const position4 = new Position({ row: 0, column: 5 })
    t.same(
      position3.getIntermediatePositions(position4).map((position) => {
        return position.toString()
      }),
      ['column-1-row-0', 'column-2-row-0', 'column-3-row-0', 'column-4-row-0']
    )

    const position5 = new Position({ row: 0, column: 0 })
    const position6 = new Position({ row: 5, column: 0 })
    t.same(
      position5.getIntermediatePositions(position6).map((position) => {
        return position.toString()
      }),
      ['column-0-row-1', 'column-0-row-2', 'column-0-row-3', 'column-0-row-4']
    )

    const position7 = new Position({ row: 0, column: 0 })
    const position8 = new Position({ row: 5, column: 5 })
    t.same(
      position7.getIntermediatePositions(position8).map((position) => {
        return position.toString()
      }),
      ['column-1-row-1', 'column-2-row-2', 'column-3-row-3', 'column-4-row-4']
    )
  })
})
