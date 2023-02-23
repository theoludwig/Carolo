import { gamesServiceSchema } from './games.js'
import type { GamesServices } from './games.js'
import { usersServiceSchema } from './users.js'
import type { UsersServices } from './users.js'

export const servicesSchema = {
  ...gamesServiceSchema,
  ...usersServiceSchema
} as const

export interface Services extends GamesServices, UsersServices {}
