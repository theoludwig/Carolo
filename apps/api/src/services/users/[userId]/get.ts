import type { FastifyPluginAsync, FastifySchema } from 'fastify'
import type { Locale, Services } from '@carolo/models'
import { fastifyErrors, servicesSchema } from '@carolo/models'

import prisma from '#src/tools/database/prisma.js'

const getServiceSchema: FastifySchema = {
  description: 'GET the public user informations with its id.',
  tags: ['users'] as string[],
  params: servicesSchema['/users/:userId'].get.parameters,
  response: {
    200: servicesSchema['/users/:userId'].get.response,
    400: fastifyErrors[400],
    404: fastifyErrors[404],
    429: fastifyErrors[429],
    500: fastifyErrors[500]
  }
} as const

export const getUserById: FastifyPluginAsync = async (fastify) => {
  fastify.route<{
    Params: Services['/users/:userId']['get']['parameters']
    Reply: Services['/users/:userId']['get']['response']
  }>({
    method: 'GET',
    url: '/users/:userId',
    schema: getServiceSchema,
    handler: async (request, reply) => {
      const { userId } = request.params
      const settings = await prisma.userSetting.findFirst({
        where: { userId }
      })
      if (settings == null) {
        throw fastify.httpErrors.notFound('User not found.')
      }
      const user = await prisma.user.findUnique({
        where: {
          id: userId
        },
        select: {
          id: true,
          name: true,
          email: false,
          isConfirmed: true,
          logo: true,
          createdAt: true,
          updatedAt: true
        }
      })
      if (user == null) {
        throw fastify.httpErrors.notFound('User not found.')
      }

      const numberOfVictory = await prisma.game.count({
        where: {
          status: {
            in: ['WHITE_WON', 'BLACK_WON']
          },
          OR: [
            {
              status: 'WHITE_WON',
              playerWhiteId: userId
            },
            {
              status: 'BLACK_WON',
              playerBlackId: userId
            }
          ]
        }
      })

      const numberOfDefeat = await prisma.game.count({
        where: {
          status: {
            in: ['WHITE_WON', 'BLACK_WON']
          },
          OR: [
            {
              status: 'WHITE_WON',
              playerBlackId: userId
            },
            {
              status: 'BLACK_WON',
              playerWhiteId: userId
            }
          ]
        }
      })

      reply.statusCode = 200
      return {
        user: {
          ...user,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
          settings: {
            ...settings,
            locale: settings.locale as Locale,
            createdAt: settings.createdAt.toISOString(),
            updatedAt: settings.updatedAt.toISOString()
          }
        },
        numberOfDefeat,
        numberOfVictory
      }
    }
  })
}
