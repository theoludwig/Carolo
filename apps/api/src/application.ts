import fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import fastifyHelmet from '@fastify/helmet'
import fastifyRateLimit from '@fastify/rate-limit'
import fastifySensible from '@fastify/sensible'
import { readPackage } from 'read-pkg'

import { services } from '#src/services/index.js'
import { NODE_ENV } from '#src/tools/configurations.js'
import fastifySocketIo from '#src/tools/plugins/socket-io.js'

const packageJSON = await readPackage()
export const application = fastify({
  logger: NODE_ENV === 'development',
  ajv: {
    customOptions: {
      strict: 'log',
      keywords: ['kind', 'modifier', 'example'],
      formats: {
        full: true
      }
    }
  }
})

await application.register(fastifyCors)
await application.register(fastifySensible)
await application.register(fastifySocketIo, {
  cors: {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204
  }
})
await application.register(fastifyHelmet)
await application.register(fastifyRateLimit, {
  max: 100,
  timeWindow: '1 minute'
})
await application.register(fastifySwagger, {
  openapi: {
    info: {
      title: packageJSON.name,
      description: packageJSON.description,
      version: packageJSON.version
    },
    tags: [{ name: 'users' }, { name: 'games' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  hideUntagged: true
})
await application.register(fastifySwaggerUI, {
  routePrefix: '/documentation',
  staticCSP: true
})
await application.register(services)
