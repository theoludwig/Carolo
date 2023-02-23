import type { Static } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'

import { gameExample, gameSchema } from './Game.js'
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
    Type.String({ minLength: 14, maxLength: 14, examples: ['column-0-row-0'] }),
    Type.Null()
  ]),
  toPosition: Type.Union([
    Type.String({ minLength: 14, maxLength: 14, examples: ['column-0-row-0'] }),
    Type.Null()
  ]),
  createdAt: date.createdAt,
  updatedAt: date.updatedAt,
  gameId: gameSchema.id
}

export const gameActionSchemaObject = Type.Object(gameActionSchema)

const gameActionBasicSchema = {
  type: gameActionSchema.type,
  fromPosition: Type.Optional(gameActionSchema.fromPosition),
  toPosition: Type.Optional(gameActionSchema.toPosition)
}

export const gameActionBasicSchemaObject = Type.Object(gameActionBasicSchema)

export type GameAction = Static<typeof gameActionSchemaObject>
export type GameActionBasic = Static<typeof gameActionBasicSchemaObject>

export const gameActionsExamples: GameAction[] = [
  {
    id: 1,
    type: 'MOVE',
    fromPosition: 'column-5-row-7',
    toPosition: 'column-4-row-5',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    gameId: gameExample.id
  },
  {
    id: 2,
    type: 'MOVE',
    fromPosition: 'column-5-row-0',
    toPosition: 'column-4-row-2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    gameId: gameExample.id
  },
  {
    id: 3,
    type: 'MOVE',
    fromPosition: 'column-4-row-7',
    toPosition: 'column-7-row-7',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    gameId: gameExample.id
  },
  {
    id: 4,
    type: 'MOVE',
    fromPosition: 'column-7-row-7',
    toPosition: 'column-7-row-0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    gameId: gameExample.id
  },
  {
    id: 5,
    type: 'MOVE',
    fromPosition: 'column-7-row-0',
    toPosition: 'column-5-row-0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    gameId: gameExample.id
  }
]
