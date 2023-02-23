import type { Static } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'

import { date, id } from './utils.js'

export const userSchema = {
  id,
  name: Type.String({ minLength: 1, maxLength: 30 }),
  email: Type.String({ minLength: 1, maxLength: 254, format: 'email' }),
  password: Type.String({ minLength: 1 }),
  logo: Type.Union([
    Type.String({ minLength: 1, format: 'uri-reference' }),
    Type.Null()
  ]),
  isConfirmed: Type.Boolean({ default: false }),
  temporaryToken: Type.Union([Type.String({ format: 'uuid' }), Type.Null()]),
  temporaryExpirationToken: Type.Union([
    Type.String({ format: 'date-time' }),
    Type.Null()
  ]),
  createdAt: date.createdAt,
  updatedAt: date.updatedAt
}

export const userSchemaObject = Type.Object(userSchema)

export type User = Static<typeof userSchemaObject>
