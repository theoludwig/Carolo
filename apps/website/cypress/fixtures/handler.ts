import { getUsersCurrentHandler } from '@/cypress/fixtures/users/current/get'
import { postUsersRefreshTokenHandler } from '@/cypress/fixtures/users/refresh-token/post'

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'

export interface Handler {
  method: Method
  url: `/${string}`
  response: {
    body: any
    statusCode: number
  }
}

export type Handlers = Handler[]

export const authenticationHandlers = [
  getUsersCurrentHandler,
  postUsersRefreshTokenHandler
]
