import type { Move } from "./BoardBase.js"
import { BoardBase } from "./BoardBase.js"
import type { PiecePosition } from "./PiecePosition.js"
import { HubrisEgoAttraction } from "./pieces/HubrisEgoAttraction.js"
import type { PieceColor } from "./pieces/Piece.js"
import { getOppositePieceColor } from "./pieces/Piece.js"
import type { PositionString } from "./Position.js"
import { Position } from "./Position.js"

export type AvailablePiecePositions = Map<PositionString, PiecePosition>

export interface HubrisAttractionResult {
  egoPiecePosition: PiecePosition
  egoIsAttractedToHubris: boolean
  hubrisPosition: Position | null
  hubrisOpponentAvailable: AvailablePiecePositions
}

export class Board extends BoardBase {
  private getAvailablePiecePositionsWithoutHubrisAttraction(
    fromPosition: Position,
  ): AvailablePiecePositions {
    const availablePiecePositions: AvailablePiecePositions = new Map()
    const from = this.getPiecePosition(fromPosition)
    if (from.isFree()) {
      return availablePiecePositions
    }

    if (from.piece.canMoveTeleportAnywhere()) {
      for (let row = 0; row < BoardBase.SIZE; row++) {
        for (let column = 0; column < BoardBase.SIZE; column++) {
          const toPosition = new Position({ row, column })
          const to = this.getPiecePosition(toPosition)
          if (to.isOccupied() && to.piece.color === from.piece.color) {
            continue
          }
          if (this.isCaptureMove(fromPosition, toPosition)) {
            continue
          }
          availablePiecePositions.set(toPosition.toString(), to)
        }
      }
      return availablePiecePositions
    }
    const positionsOffsets = from.piece.getPositionsOffsets(BoardBase.SIZE)

    for (const positionOffset of positionsOffsets) {
      const toPosition = fromPosition.add(positionOffset)
      if (!toPosition.isInsideSquare(BoardBase.SIZE)) {
        continue
      }
      const to = this.getPiecePosition(toPosition)
      if (to.isOccupied() && to.piece.color === from.piece.color) {
        continue
      }
      if (!from.piece.canJumpOverPieces()) {
        let isPathwayBlocked = false
        for (const intermediatePosition of fromPosition.getIntermediatePositions(
          toPosition,
        )) {
          if (this.getPiecePosition(intermediatePosition).isOccupied()) {
            isPathwayBlocked = true
            break
          }
        }
        if (isPathwayBlocked) {
          continue
        }
      }
      if (this.isCaptureMove(fromPosition, toPosition)) {
        continue
      }
      if (
        this.isCheckAfterMove(fromPosition, toPosition) &&
        !this.isReconquestAfterMove(fromPosition, toPosition)
      ) {
        continue
      }
      availablePiecePositions.set(toPosition.toString(), to)
    }

    if (from.piece.shouldMoveUntilObstacle()) {
      let maximumTop: PiecePosition | null = null
      let maximumBottom: PiecePosition | null = null
      let maximumLeft: PiecePosition | null = null
      let maximumRight: PiecePosition | null = null
      for (const [_toPositionString, to] of availablePiecePositions) {
        const toPosition = to.position
        if (toPosition.row > fromPosition.row) {
          if (maximumTop == null || toPosition.row > maximumTop.position.row) {
            maximumTop = to
          }
        }
        if (toPosition.row < fromPosition.row) {
          if (
            maximumBottom == null ||
            toPosition.row < maximumBottom.position.row
          ) {
            maximumBottom = to
          }
        }
        if (toPosition.column > fromPosition.column) {
          if (
            maximumLeft == null ||
            toPosition.column > maximumLeft.position.column
          ) {
            maximumLeft = to
          }
        }
        if (toPosition.column < fromPosition.column) {
          if (
            maximumRight == null ||
            toPosition.column < maximumRight.position.column
          ) {
            maximumRight = to
          }
        }
      }

      const availableOnlyPiecePositions: AvailablePiecePositions = new Map()
      if (maximumTop != null) {
        availableOnlyPiecePositions.set(
          maximumTop.position.toString(),
          maximumTop,
        )
      }
      if (maximumBottom != null) {
        availableOnlyPiecePositions.set(
          maximumBottom.position.toString(),
          maximumBottom,
        )
      }
      if (maximumLeft != null) {
        availableOnlyPiecePositions.set(
          maximumLeft.position.toString(),
          maximumLeft,
        )
      }
      if (maximumRight != null) {
        availableOnlyPiecePositions.set(
          maximumRight.position.toString(),
          maximumRight,
        )
      }
      return availableOnlyPiecePositions
    }

    return availablePiecePositions
  }

  public powerOfHubrisAttraction(color: PieceColor): HubrisAttractionResult {
    const oppositeColor = getOppositePieceColor(color)
    const egoPiecePosition = this.getEgoPiecePosition(color)
    let egoIsAttractedToHubris = false
    let hubrisPosition: Position | null = null
    let hubrisOpponentAvailable: AvailablePiecePositions = new Map()
    for (let row = 0; row < BoardBase.SIZE; row++) {
      for (let column = 0; column < BoardBase.SIZE; column++) {
        const piecePosition = this.getPiecePosition(
          new Position({ row, column }),
        )
        if (
          piecePosition.isOccupied() &&
          piecePosition.piece.type === "HUBRIS" &&
          piecePosition.piece.color === oppositeColor
        ) {
          const hubris = piecePosition.piece
          const hubrisEgoAttraction = new HubrisEgoAttraction(hubris.color)
          piecePosition.piece = hubrisEgoAttraction
          const available =
            this.getAvailablePiecePositionsWithoutHubrisAttraction(
              piecePosition.position,
            )
          piecePosition.piece = hubris
          if (
            egoPiecePosition.position.isOnlyOneSquareAway(
              piecePosition.position,
            )
          ) {
            continue
          }

          if (available.has(egoPiecePosition.position.toString())) {
            egoIsAttractedToHubris = true
            hubrisPosition = piecePosition.position
            hubrisOpponentAvailable = available
            break
          }
        }
      }
    }
    return {
      egoPiecePosition,
      egoIsAttractedToHubris,
      hubrisPosition,
      hubrisOpponentAvailable,
    }
  }

  /**
   * Get all available positions for a piece.
   * @param fromPosition
   * @returns Map of available positions (key: `column-${column}-row-${row}`, value: PiecePosition).
   */
  public getAvailablePiecePositions(
    fromPosition: Position,
  ): AvailablePiecePositions {
    let availablePiecePositions: AvailablePiecePositions = new Map()
    if (this.state.currentMoveIndex < this.state.moves.length - 1) {
      return availablePiecePositions
    }

    const from = this.getPiecePosition(fromPosition)
    if (from.isFree()) {
      return availablePiecePositions
    }
    const oppositeColor = getOppositePieceColor(from.piece.color)
    if (this.isCheck(from.piece.color) || this.isReconquest(oppositeColor)) {
      return availablePiecePositions
    }

    const {
      egoPiecePosition,
      egoIsAttractedToHubris,
      hubrisPosition,
      hubrisOpponentAvailable,
    } = this.powerOfHubrisAttraction(from.piece.color)
    if (egoIsAttractedToHubris && hubrisPosition != null) {
      if (from.piece.type === "EGO") {
        const x1 = hubrisPosition.column
        const y1 = hubrisPosition.row
        const x2 = egoPiecePosition.position.column
        const y2 = egoPiecePosition.position.row
        const positionAttracted = new Position({
          column: x1 + (x2 - x1) / Math.abs(x2 - x1),
          row: y1 + (y2 - y1) / Math.abs(y2 - y1),
        })
        availablePiecePositions.set(
          positionAttracted.toString(),
          this.getPiecePosition(positionAttracted),
        )
        return availablePiecePositions
      }
      if (from.piece.type === "HUBRIS") {
        const available =
          this.getAvailablePiecePositionsWithoutHubrisAttraction(fromPosition)
        for (const [key, value] of available) {
          const isSameDiagonalAsEgo = value.position.isOnSameDiagonal(
            egoPiecePosition.position,
          )
          if (hubrisOpponentAvailable.has(key) && isSameDiagonalAsEgo) {
            availablePiecePositions.set(key, value)
          }
        }
        return availablePiecePositions
      }
      return availablePiecePositions
    }

    const lastMove = this.getLastMove()
    if (
      lastMove != null &&
      lastMove.piece.canBounce() &&
      !lastMove.isNextPlayerTurn &&
      !from.piece.canBounce()
    ) {
      return availablePiecePositions
    }

    availablePiecePositions =
      this.getAvailablePiecePositionsWithoutHubrisAttraction(fromPosition)

    if (from.piece.canBounce()) {
      const precedingMoves: Move[] = []
      for (let index = this.state.currentMoveIndex; index >= 0; index--) {
        const move = this.state.moves[index]
        if (
          move.piece.type === from.piece.type &&
          move.piece.color === from.piece.color
        ) {
          precedingMoves.push(move)
        } else {
          break
        }
      }
      const initialMove = precedingMoves[precedingMoves.length - 1]
      const availablePiecePositionsFiltered: AvailablePiecePositions = new Map()
      for (const [key, piecePosition] of availablePiecePositions) {
        const isPositionInPrecedingMoves = precedingMoves.some((move) => {
          return move.toPosition.toString() === key
        })
        if (
          !isPositionInPrecedingMoves &&
          initialMove?.fromPosition?.toString() !== key
        ) {
          availablePiecePositionsFiltered.set(key, piecePosition)
        }
      }
      availablePiecePositions = availablePiecePositionsFiltered
    }

    return availablePiecePositions
  }

  public canMove(fromPosition: Position, toPosition: Position): boolean {
    return this.getAvailablePiecePositions(fromPosition).has(
      toPosition.toString(),
    )
  }

  public isCaptureMove(fromPosition: Position, toPosition: Position): boolean {
    const from = this.getPiecePosition(fromPosition)
    const to = this.getPiecePosition(toPosition)
    return (
      to.isOccupied() &&
      from.isOccupied() &&
      from.piece.color !== to.piece.color &&
      !from.piece.canBeCapturedBy(to.piece.type)
    )
  }

  private canBounceBorder(
    fromPosition: Position,
    toPosition: Position,
  ): boolean {
    const piecePosition = this.getPiecePosition(toPosition)
    const { position } = piecePosition
    const { column, row } = position
    const isOnTop = row === 0
    const isOnBottom = row === BoardBase.SIZE - 1
    const isOnLeft = column === 0
    const isOnRight = column === BoardBase.SIZE - 1
    if (isOnTop && fromPosition.row > toPosition.row) {
      return true
    }
    if (isOnBottom && fromPosition.row < toPosition.row) {
      return true
    }
    if (isOnLeft && fromPosition.column > toPosition.column) {
      return true
    }
    if (isOnRight && fromPosition.column < toPosition.column) {
      return true
    }
    return false
  }

  private canBounceAymon(
    fromPosition: Position,
    toPosition: Position,
  ): boolean {
    const piecePosition = this.getPiecePosition(toPosition)
    const topPosition = piecePosition.position.add(
      new Position({ row: -1, column: 0 }),
    )
    const bottomPosition = piecePosition.position.add(
      new Position({ row: 1, column: 0 }),
    )
    const leftPosition = piecePosition.position.add(
      new Position({ row: 0, column: -1 }),
    )
    const rightPosition = piecePosition.position.add(
      new Position({ row: 0, column: 1 }),
    )
    if (fromPosition.row > toPosition.row) {
      return (
        this.getPiecePosition(topPosition).isOccupied() &&
        this.getPiecePosition(topPosition).piece.type === "AYMON"
      )
    }
    if (fromPosition.row < toPosition.row) {
      return (
        this.getPiecePosition(bottomPosition).isOccupied() &&
        this.getPiecePosition(bottomPosition).piece.type === "AYMON"
      )
    }
    if (fromPosition.column > toPosition.column) {
      return (
        this.getPiecePosition(leftPosition).isOccupied() &&
        this.getPiecePosition(leftPosition).piece.type === "AYMON"
      )
    }
    if (fromPosition.column < toPosition.column) {
      return (
        this.getPiecePosition(rightPosition).isOccupied() &&
        this.getPiecePosition(rightPosition).piece.type === "AYMON"
      )
    }
    return false
  }

  public move(fromPosition: Position, toPosition: Position): Move {
    const to = this.getPiecePosition(toPosition)
    const capturedPiece = to.isOccupied() ? to.piece : undefined
    this.movePiece(fromPosition, toPosition)
    to.piece.move()
    const move: Move = {
      fromPosition,
      toPosition,
      capturedPiece,
      piece: to.piece,
      isNextPlayerTurn:
        !to.piece.canBounce() ||
        (to.piece.canBounce() &&
          !this.canBounceBorder(fromPosition, toPosition) &&
          !this.canBounceAymon(fromPosition, toPosition)) ||
        (to.piece.canBounce() && capturedPiece != null) ||
        this.getAvailablePiecePositions(toPosition).size === 0,
    }
    this.setState((state) => {
      state.currentMoveIndex += 1
      state.moves[state.currentMoveIndex] = move
    })
    return move
  }

  public isReconquest(color: PieceColor): boolean {
    const egoPiecePosition = this.getEgoPiecePosition(color)
    const oppositeColor = getOppositePieceColor(color)
    const lastOppositeRow = this.getLastRow(oppositeColor)
    return egoPiecePosition.position.row === lastOppositeRow
  }

  private isReconquestAfterMove(
    fromPosition: Position,
    toPosition: Position,
  ): boolean {
    const from = this.getPiecePosition(fromPosition)
    const to = this.getPiecePosition(toPosition)
    if (from.isFree()) {
      return false
    }
    const fromPiece = from.piece
    const toPiece = to.isOccupied() ? to.piece : null
    this.movePiece(fromPosition, toPosition)
    const isReconquest = this.isReconquest(fromPiece.color)
    from.piece = fromPiece
    to.piece = toPiece
    return isReconquest
  }

  public isCheck(color: PieceColor): boolean {
    const egoPiecePosition = this.getEgoPiecePosition(color)
    const fromPosition = egoPiecePosition.position
    const oppositeColor = getOppositePieceColor(color)
    const positionsOffsets = egoPiecePosition.piece.getPositionsOffsets(
      BoardBase.SIZE,
    )
    for (const positionOffset of positionsOffsets) {
      const position = fromPosition.add(positionOffset)
      if (!position.isInsideSquare(BoardBase.SIZE)) {
        continue
      }
      const piecePosition = this.getPiecePosition(position)
      if (
        piecePosition.isOccupied() &&
        piecePosition.piece.color === oppositeColor &&
        piecePosition.piece.type === "CAROLO"
      ) {
        return true
      }
    }
    return false
  }

  private isCheckAfterMove(
    fromPosition: Position,
    toPosition: Position,
  ): boolean {
    const from = this.getPiecePosition(fromPosition)
    const to = this.getPiecePosition(toPosition)
    if (from.isFree()) {
      return false
    }
    const fromPiece = from.piece
    const toPiece = to.isOccupied() ? to.piece : null
    this.movePiece(fromPosition, toPosition)
    const isCheck = this.isCheck(fromPiece.color)
    from.piece = fromPiece
    to.piece = toPiece
    return isCheck
  }
}
