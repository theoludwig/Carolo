import { BoardBase } from './BoardBase.js'

export interface PositionOptions {
  column: number
  row: number
}

/**
 * A string representing a position in the board.
 *
 * @example 'A1' // column: 'A' (index: 0) - row: 1 (index: 7)
 * @example 'H8' // column: 'H' (index: 7) - row: 8 (index: 0)
 */
export type PositionString = `${string}${number}`

export class Position implements PositionOptions {
  private readonly _column: number
  private readonly _row: number

  public constructor(options: PositionOptions) {
    this._column = options.column
    this._row = options.row
  }

  public get column(): number {
    return this._column
  }

  public get row(): number {
    return this._row
  }

  public add(position: Position): Position {
    return new Position({
      column: this.column + position.column,
      row: this.row + position.row
    })
  }

  public isInsideSquare(squareSize: number): boolean {
    return (
      this.column >= 0 &&
      this.column < squareSize &&
      this.row >= 0 &&
      this.row < squareSize
    )
  }

  private getOffsetDirection(offset: number): number {
    if (offset === 0) {
      return 0
    }
    if (offset < 0) {
      return -1
    }
    return 1
  }

  public getIntermediatePositions(position: Position): Position[] {
    const intermediatePositions: Position[] = []
    const columnOffset = position.column - this.column
    const rowOffset = position.row - this.row
    const columnDirection = this.getOffsetDirection(columnOffset)
    const rowDirection = this.getOffsetDirection(rowOffset)
    let newColumn = this.column + columnDirection
    let newRow = this.row + rowDirection
    while (newColumn !== position.column || newRow !== position.row) {
      intermediatePositions.push(
        new Position({ column: newColumn, row: newRow })
      )
      newColumn += columnDirection
      newRow += rowDirection
    }
    return intermediatePositions
  }

  public equals(position: unknown): boolean {
    if (position instanceof Position) {
      return this.column === position.column && this.row === position.row
    }
    return false
  }

  public isOnSameDiagonal(position: Position): boolean {
    return (
      Math.abs(this.column - position.column) ===
      Math.abs(this.row - position.row)
    )
  }

  public isOnlyOneSquareAway(position: Position): boolean {
    return (
      Math.abs(this.column - position.column) <= 1 &&
      Math.abs(this.row - position.row) <= 1
    )
  }

  public static fromString(positionString: PositionString): Position {
    const column = positionString.charCodeAt(0) - 'A'.charCodeAt(0)
    const row = BoardBase.SIZE - Number.parseInt(positionString[1], 10)
    return new Position({ column, row })
  }

  public toString(): PositionString {
    const column = String.fromCharCode(this.column + 'A'.charCodeAt(0))
    const row = BoardBase.SIZE - this.row
    return `${column}${row}`
  }
}
