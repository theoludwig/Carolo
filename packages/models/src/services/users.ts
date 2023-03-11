import type { Static } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'

import {
  userCurrentSchemaObject,
  userPublicSchemaObject
} from '../authentication.js'
import { userSchema } from '../User.js'
import { userSettingsSchema } from '../UserSetting.js'
import { queryPaginationObjectSchema } from '../utils.js'
import { gameSchema, gameUserSchemaObject } from '../Game.js'

export const usersServiceSchema = {
  '/users/:userId': {
    get: {
      parameters: Type.Object({
        userId: userSchema.id
      }),
      response: userPublicSchemaObject
    }
  },
  '/users/:userId/games': {
    get: {
      parameters: Type.Object({
        userId: userSchema.id
      }),
      querystring: queryPaginationObjectSchema,
      response: Type.Array(
        Type.Object({
          id: gameSchema.id,
          status: gameSchema.status,
          playerWhiteId: userSchema.id,
          playerBlackId: userSchema.id,
          playerWhite: gameUserSchemaObject,
          playerBlack: gameUserSchemaObject,
          createdAt: gameSchema.createdAt,
          updatedAt: gameSchema.updatedAt
        })
      )
    }
  },
  '/users/signup': {
    post: {
      body: Type.Object({
        email: userSchema.email,
        name: userSchema.name,
        password: userSchema.password,
        locale: userSettingsSchema.locale
      }),
      querystring: Type.Object({
        redirectURI: Type.Optional(Type.String({ format: 'uri-reference' }))
      }),
      response: userCurrentSchemaObject
    }
  }
} as const

export interface UsersServices {
  '/users/:userId': {
    get: {
      parameters: Static<
        (typeof usersServiceSchema)['/users/:userId']['get']['parameters']
      >
      response: Static<
        (typeof usersServiceSchema)['/users/:userId']['get']['response']
      >
    }
  }
  '/users/:userId/games': {
    get: {
      parameters: Static<
        (typeof usersServiceSchema)['/users/:userId/games']['get']['parameters']
      >
      querystring: Static<
        (typeof usersServiceSchema)['/users/:userId/games']['get']['querystring']
      >
      response: Static<
        (typeof usersServiceSchema)['/users/:userId/games']['get']['response']
      >
    }
  }
  '/users/signup': {
    post: {
      body: Static<(typeof usersServiceSchema)['/users/signup']['post']['body']>
      querystring: Static<
        (typeof usersServiceSchema)['/users/signup']['post']['querystring']
      >
      response: Static<
        (typeof usersServiceSchema)['/users/signup']['post']['response']
      >
    }
  }
}
