import type { Static } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'

import type { AuthenticationStrategy } from './OAuth.js'
import { strategiesTypebox } from './OAuth.js'
import { userSettingsSchema } from './UserSettings.js'
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
  logo: Type.String({ minLength: 1, format: 'uri-reference' }),
  isConfirmed: Type.Boolean({ default: false }),
  temporaryToken: Type.String(),
  temporaryExpirationToken: Type.String({ format: 'date-time' }),
  createdAt: date.createdAt,
  updatedAt: date.updatedAt
}

export const userPublicWithoutSettingsSchema = {
  id,
  name: userSchema.name,
  email: userSchema.email,
  logo: Type.Union([userSchema.logo, Type.Null()]),
  isConfirmed: userSchema.isConfirmed,
  createdAt: date.createdAt,
  updatedAt: date.updatedAt
}

export const userPublicSchema = {
  ...userPublicWithoutSettingsSchema,
  settings: Type.Object(userSettingsSchema)
}

export const userCurrentSchema = Type.Object({
  user: Type.Object({
    ...userPublicSchema,
    currentStrategy: Type.Union([...strategiesTypebox]),
    strategies: Type.Array(Type.Union([...strategiesTypebox]))
  })
})

export const bodyUserSchema = Type.Object({
  email: userSchema.email,
  name: userSchema.name,
  password: userSchema.password,
  language: userSettingsSchema.language
})

export type BodyUserSchemaType = Static<typeof bodyUserSchema>

export const userExample = {
  id: 1,
  name: 'John Doe',
  email: 'contact@johndoe.com',
  password: 'somepassword',
  logo: null,
  isConfirmed: true,
  temporaryToken: 'temporaryUUIDtoken',
  temporaryExpirationToken: new Date(),
  createdAt: new Date(),
  updatedAt: new Date()
}
