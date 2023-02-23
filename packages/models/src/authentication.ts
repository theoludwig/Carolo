import type { Static } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'

import type { AuthenticationStrategy } from './OAuth.js'
import { strategiesTypebox } from './OAuth.js'
import type { User } from './User.js'
import { userSchema } from './User.js'
import type { UserSettings } from './UserSetting.js'
import { userSettingsSchema } from './UserSetting.js'
import { date } from './utils.js'

export interface UserJWT {
  id: number
  currentStrategy: AuthenticationStrategy
}

export interface UserRefreshJWT extends UserJWT {
  tokenUUID: string
}

export const userPublicSchema = {
  id: userSchema.id,
  name: userSchema.name,
  logo: userSchema.logo,
  isConfirmed: userSchema.isConfirmed,
  createdAt: date.createdAt,
  updatedAt: date.updatedAt,
  settings: Type.Object(userSettingsSchema)
}

export const userPublicSchemaObject = Type.Object({
  user: Type.Object(userPublicSchema)
})

export const userCurrentSchemaObject = Type.Object({
  user: Type.Object({
    ...userPublicSchema,
    email: userSchema.email,
    currentStrategy: Type.Union([...strategiesTypebox]),
    strategies: Type.Array(Type.Union([...strategiesTypebox]))
  })
})

export type UserPublic = Static<typeof userPublicSchemaObject>
export type UserCurrent = Static<typeof userCurrentSchemaObject>

export const userExample: User = {
  id: 1,
  name: 'John DOE',
  email: 'contact@johndoe.com',
  password: 'somepassword',
  logo: null,
  isConfirmed: true,
  temporaryToken: 'e5dc4984-4339-4520-bcbd-c77a8fc137b6',
  temporaryExpirationToken: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

export const userExample2: User = {
  id: 2,
  name: 'Jane DOE',
  email: 'contact@janedoe.com',
  password: 'somepassword2',
  logo: null,
  isConfirmed: true,
  temporaryToken: '1e93b1e4-f46c-4af1-9bcd-f82100a317a3',
  temporaryExpirationToken: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

export const userSettingsExample: UserSettings = {
  id: 1,
  locale: 'fr-FR',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  userId: userExample.id
}

export const userCurrentExample: UserCurrent = {
  user: {
    ...userExample,
    settings: userSettingsExample,
    currentStrategy: 'Local',
    strategies: ['Local']
  }
}

export const userPublicExample: UserPublic['user'] = {
  ...userExample,
  settings: userSettingsExample
}
