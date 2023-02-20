import type { Static } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'

import { userCurrentSchemaObject, userSchema } from '../User.js'
import { userSettingsSchema } from '../UserSettings.js'

export const usersServiceSchema = {
  '/users/signup': {
    post: {
      body: Type.Object({
        email: userSchema.email,
        name: userSchema.name,
        password: userSchema.password,
        language: userSettingsSchema.language
      }),
      querystring: Type.Object({
        redirectURI: Type.Optional(Type.String({ format: 'uri-reference' }))
      }),
      response: userCurrentSchemaObject
    }
  }
} as const

export interface UsersServices {
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
