import type { Handler } from '@/cypress/fixtures/handler'

export const postUsersRefreshTokenHandler: Handler = {
  method: 'POST',
  url: '/users/refresh-token',
  response: {
    statusCode: 200,
    body: {
      accessToken: 'access-token',
      expiresIn: 3600000,
      type: 'Bearer'
    }
  }
}
