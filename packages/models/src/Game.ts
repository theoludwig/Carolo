import type { Static } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { GameStatuses, PieceColors } from '@carolo/game'

import { userSchema } from './User.js'
import { date } from './utils.js'
import { userExample, userExample2 } from './authentication.js'

export const gameStatuses = GameStatuses.map((status) => {
  return Type.Literal(status)
})

export const pieceColors = PieceColors.map((color) => {
  return Type.Literal(color)
})

export const gameSchema = {
  id: Type.String({ format: 'uuid' }),
  status: Type.Union(gameStatuses),
  createdAt: date.createdAt,
  updatedAt: date.updatedAt,
  playerWhiteId: Type.Union([userSchema.id, Type.Null()]),
  playerBlackId: Type.Union([userSchema.id, Type.Null()])
}

export const gameSchemaObject = Type.Object(gameSchema)

export type Game = Static<typeof gameSchemaObject>

const gameUserSchema = {
  id: userSchema.id,
  name: userSchema.name,
  logo: userSchema.logo,
  color: Type.Union(pieceColors)
}

export const gameUserSchemaObject = Type.Object(gameUserSchema)

export type GameUser = Static<typeof gameUserSchemaObject>

export const gameExample: Game = {
  id: 'c7e14155-9fe1-4871-b645-32ccd131c460',
  status: 'WHITE_WON',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  playerWhiteId: userExample.id,
  playerBlackId: userExample2.id
}

export const gameUserExample: GameUser = {
  id: userExample.id,
  name: userExample.name,
  logo: userExample.logo,
  color: 'WHITE'
}

export const gameUserExample2: GameUser = {
  id: userExample2.id,
  name: userExample2.name,
  logo: userExample2.logo,
  color: 'BLACK'
}
