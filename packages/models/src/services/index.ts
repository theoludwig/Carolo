import { usersServiceSchema } from './users.js'
import type { UsersServices } from './users.js'

export const servicesSchema = {
  ...usersServiceSchema
} as const

export interface Services extends UsersServices {}
