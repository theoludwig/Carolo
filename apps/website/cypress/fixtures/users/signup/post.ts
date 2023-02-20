import { userCurrentExample } from '@carolo/models'

import type { Handler } from '@/cypress/fixtures/handler'

export const postUsersSignupHandler: Handler = {
  method: 'POST',
  url: '/users/signup',
  response: {
    statusCode: 201,
    body: userCurrentExample
  }
}

export const postUsersSignupAlreadyUsedHandler: Handler = {
  method: 'POST',
  url: '/users/signup',
  response: {
    statusCode: 400,
    body: {
      statusCode: 400,
      error: 'Bad Request',
      message: 'body.email or body.name already taken'
    }
  }
}
