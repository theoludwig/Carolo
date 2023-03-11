import type { FastifyPluginAsync, FastifySchema } from 'fastify'
import type { Services } from '@carolo/models'
import { fastifyErrors, servicesSchema } from '@carolo/models'
import type { GameStatus } from '@carolo/game'

import prisma from '#src/tools/database/prisma.js'
import { getPaginationOptions } from '#src/tools/database/pagination.js'

const getServiceSchema: FastifySchema = {
  description: 'GET all the games played by an user.',
  tags: ['games'] as string[],
  params: servicesSchema['/users/:userId/games'].get.parameters,
  querystring: servicesSchema['/users/:userId/games'].get.querystring,
  response: {
    200: servicesSchema['/users/:userId/games'].get.response,
    400: fastifyErrors[400],
    404: fastifyErrors[404],
    429: fastifyErrors[429],
    500: fastifyErrors[500]
  }
} as const

export const getGamesByUserId: FastifyPluginAsync = async (fastify) => {
  fastify.route<{
    Params: Services['/users/:userId/games']['get']['parameters']
    Querystring: Services['/users/:userId/games']['get']['querystring']
    Reply: Services['/users/:userId/games']['get']['response']
  }>({
    method: 'GET',
    url: '/users/:userId/games',
    schema: getServiceSchema,
    handler: async (request, reply) => {
      const { userId } = request.params
      const user = await prisma.user.findUnique({
        where: {
          id: userId
        }
      })
      if (user == null) {
        throw fastify.httpErrors.notFound('User not found.')
      }
      const games = await prisma.game.findMany({
        ...getPaginationOptions(request.query),
        orderBy: {
          createdAt: 'desc'
        },
        where: {
          OR: [
            {
              playerWhiteId: userId
            },
            {
              playerBlackId: userId
            }
          ]
        },
        include: {
          playerWhite: {
            select: {
              id: true,
              name: true,
              logo: true
            }
          },
          playerBlack: {
            select: {
              id: true,
              name: true,
              logo: true
            }
          }
        }
      })
      const response: Services['/users/:userId/games']['get']['response'] =
        await Promise.all(
          games.map((game) => {
            return {
              ...game,
              status: game.status as GameStatus,
              playerWhite: {
                ...game.playerWhite,
                color: 'WHITE'
              },
              playerBlack: {
                ...game.playerBlack,
                color: 'BLACK'
              },
              createdAt: game.createdAt.toISOString(),
              updatedAt: game.updatedAt.toISOString()
            }
          })
        )
      reply.statusCode = 200
      return response
    }
  })
}
