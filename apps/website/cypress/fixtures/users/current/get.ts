import { userCurrentExample } from '@carolo/models'

import type { Handler } from '@/cypress/fixtures/handler'

export const getUsersCurrentHandler: Handler = {
  method: 'GET',
  url: '/users/current',
  response: {
    statusCode: 200,
    body: userCurrentExample
  }
}
