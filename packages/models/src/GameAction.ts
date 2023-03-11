import type { Static } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'

import { gameExample, gameSchema, pieceColors } from './Game.js'
import { date, id } from './utils.js'

export type ActionType = Static<typeof gameActionSchema.type>

export const actionTypes = [
  Type.Literal('MOVE'),
  Type.Literal('SKIP_BOUNCING'),
  Type.Literal('RESIGN')
]

export const gameActionSchema = {
  id,
  type: Type.Union(actionTypes),
  fromPosition: Type.Union([
    Type.String({ minLength: 2, maxLength: 2, example: 'A1' }),
    Type.Null()
  ]),
  toPosition: Type.Union([
    Type.String({ minLength: 2, maxLength: 2, example: 'C2' }),
    Type.Null()
  ]),
  color: Type.Union([...pieceColors, Type.Null()]),
  createdAt: date.createdAt,
  updatedAt: date.updatedAt,
  gameId: gameSchema.id
}

export const gameActionSchemaObject = Type.Object(gameActionSchema)

const gameActionBasicSchema = {
  type: gameActionSchema.type,
  fromPosition: Type.Optional(gameActionSchema.fromPosition),
  toPosition: Type.Optional(gameActionSchema.toPosition),
  color: Type.Optional(gameActionSchema.color)
}

export const gameActionBasicSchemaObject = Type.Object(gameActionBasicSchema)

export type GameAction = Static<typeof gameActionSchemaObject>
export type GameActionBasic = Static<typeof gameActionBasicSchemaObject>

export const gameActionsExamples: GameAction[] = [
  {
    id: 1,
    type: 'MOVE',
    fromPosition: 'F1',
    toPosition: 'E3',
    color: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    gameId: gameExample.id
  },
  {
    id: 2,
    type: 'MOVE',
    fromPosition: 'F8',
    toPosition: 'E6',
    color: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    gameId: gameExample.id
  },
  {
    id: 3,
    type: 'MOVE',
    fromPosition: 'E1',
    toPosition: 'H1',
    color: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    gameId: gameExample.id
  },
  {
    id: 4,
    type: 'MOVE',
    fromPosition: 'H1',
    toPosition: 'H8',
    color: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    gameId: gameExample.id
  },
  {
    id: 5,
    type: 'MOVE',
    fromPosition: 'H8',
    toPosition: 'F8',
    color: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    gameId: gameExample.id
  }
]
