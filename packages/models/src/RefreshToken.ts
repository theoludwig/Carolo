import { Type } from '@sinclair/typebox'
import type { Static } from '@sinclair/typebox'

import { userExample } from './User.js'
import { date, id } from './utils.js'

export const tokensJWTSchema = {
  accessToken: Type.String(),
  refreshToken: Type.String(),
  expiresIn: Type.Integer({
    description:
      'expiresIn is how long, in milliseconds, until the accessToken expires'
  }),
  type: Type.Literal('Bearer')
}

export const tokensJWTSchemaObject = Type.Object(tokensJWTSchema)

export type TokensJWT = Static<typeof tokensJWTSchemaObject>

export const refreshTokensSchema = {
  id,
  token: Type.String({ format: 'uuid' }),
  createdAt: date.createdAt,
  updatedAt: date.updatedAt,
  userId: id
}

export const refreshTokenSchemaObject = Type.Object(refreshTokensSchema)

export type RefreshToken = Static<typeof refreshTokenSchemaObject>

export const refreshTokenExample: RefreshToken = {
  id: 1,
  userId: userExample.id,
  token: 'sometokenUUID',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}
