import type { FastifyPluginAsync, FastifySchema } from 'fastify'
import { fastifyErrors, userCurrentSchemaObject } from '@carolo/models'

import prisma from '#src/tools/database/prisma.js'
import authenticateUser from '#src/tools/plugins/authenticateUser.js'

const getCurrentUserSchema: FastifySchema = {
  description: 'GET the current connected user.',
  tags: ['users'] as string[],
  security: [
    {
      bearerAuth: []
    }
  ] as Array<{ [key: string]: [] }>,
  response: {
    200: userCurrentSchemaObject,
    400: fastifyErrors[400],
    401: fastifyErrors[401],
    403: fastifyErrors[403],
    500: fastifyErrors[500]
  }
} as const

export const getCurrentUser: FastifyPluginAsync = async (fastify) => {
  await fastify.register(authenticateUser)

  fastify.route({
    method: 'GET',
    url: '/users/current',
    schema: getCurrentUserSchema,
    handler: async (request, reply) => {
      if (request.user == null) {
        throw fastify.httpErrors.forbidden()
      }
      const { user } = request
      const settings = await prisma.userSetting.findFirst({
        where: { userId: user.current.id }
      })
      if (settings == null) {
        throw fastify.httpErrors.internalServerError()
      }
      const strategies = ['Local'] as const
      reply.statusCode = 200
      return {
        user: {
          ...user.current,
          settings,
          currentStrategy: user.currentStrategy,
          strategies
        }
      }
    }
  })
}
