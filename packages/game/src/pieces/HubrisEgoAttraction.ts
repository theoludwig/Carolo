import { Hubris } from "./Hubris.js"
import type { PieceType } from "./Piece.js"

export class HubrisEgoAttraction extends Hubris {
  public override getCapturablePiecesTypes(): PieceType[] {
    return ["EGO"]
  }
}
