import { defineConfig } from 'cypress'
import { getLocal } from 'mockttp'
import type { Mockttp } from 'mockttp'

import { API_DEFAULT_PORT } from '@/lib/configurations'
import type { Handlers } from '@/cypress/fixtures/handler'

let server: Mockttp | null = null

export default defineConfig({
  fixturesFolder: false,
  video: false,
  screenshotOnRunFailure: false,
  e2e: {
    baseUrl: 'http://127.0.0.1:3000',
    supportFile: false,
    setupNodeEvents(on, config) {
      on('task', {
        async startMockServer(handlers: Handlers): Promise<null> {
          server = getLocal({ cors: true })
          await server.start(API_DEFAULT_PORT)
          for (const handler of handlers) {
            let requestBuilder = server.forGet(handler.url)
            switch (handler.method) {
              case 'GET':
                requestBuilder = server.forGet(handler.url)
                break
              case 'POST':
                requestBuilder = server.forPost(handler.url)
                break
              case 'PUT':
                requestBuilder = server.forPut(handler.url)
                break
              case 'DELETE':
                requestBuilder = server.forDelete(handler.url)
                break
            }
            await requestBuilder.thenJson(
              handler.response.statusCode,
              handler.response.body
            )
          }

          return null
        },

        async stopMockServer(): Promise<null> {
          if (server != null) {
            await server.stop()
            server = null
          }

          return null
        }
      })

      return config
    }
  }
})
