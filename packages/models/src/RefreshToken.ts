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

export const refreshTokenExample = {
  id: 1,
  userId: userExample.id,
  token: 'sometokenUUID',
  createdAt: new Date(),
  updatedAt: new Date()
}
