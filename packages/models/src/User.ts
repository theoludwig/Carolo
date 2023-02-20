import type { Static } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'

import type { AuthenticationStrategy } from './OAuth.js'
import { strategiesTypebox } from './OAuth.js'
import { userSettingsExample, userSettingsSchema } from './UserSettings.js'
import { date, id } from './utils.js'

export interface UserJWT {
  id: number
  currentStrategy: AuthenticationStrategy
}

export interface UserRefreshJWT extends UserJWT {
  tokenUUID: string
}

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
  temporaryToken: Type.Union([Type.String(), Type.Null()]),
  temporaryExpirationToken: Type.Union([
    Type.String({ format: 'date-time' }),
    Type.Null()
  ]),
  createdAt: date.createdAt,
  updatedAt: date.updatedAt
}

export const userSchemaObject = Type.Object(userSchema)

export const userPublicSchema = {
  id,
  name: userSchema.name,
  logo: userSchema.logo,
  isConfirmed: userSchema.isConfirmed,
  createdAt: date.createdAt,
  updatedAt: date.updatedAt,
  settings: Type.Object(userSettingsSchema)
}

export const userPublicSchemaObject = Type.Object(userPublicSchema)

export const userCurrentSchemaObject = Type.Object({
  user: Type.Object({
    ...userPublicSchema,
    email: userSchema.email,
    currentStrategy: Type.Union([...strategiesTypebox]),
    strategies: Type.Array(Type.Union([...strategiesTypebox]))
  })
})

export type User = Static<typeof userSchemaObject>
export type UserPublic = Static<typeof userPublicSchemaObject>
export type UserCurrent = Static<typeof userCurrentSchemaObject>

export const userExample: User = {
  id: 1,
  name: 'John Doe',
  email: 'contact@johndoe.com',
  password: 'somepassword',
  logo: null,
  isConfirmed: true,
  temporaryToken: 'temporaryUUIDtoken',
  temporaryExpirationToken: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

export const userCurrentExample: UserCurrent = {
  user: {
    ...userExample,
    settings: userSettingsExample,
    currentStrategy: 'Local',
    strategies: ['Local']
  }
}

export const userPublicExample: UserPublic = {
  ...userExample,
  settings: userSettingsExample
}
