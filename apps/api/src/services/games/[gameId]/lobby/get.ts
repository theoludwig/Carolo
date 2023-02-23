import type { FastifyPluginAsync, FastifySchema } from 'fastify'
import type { GameUser, Services } from '@carolo/models'
import { fastifyErrors, servicesSchema } from '@carolo/models'

import prisma from '#src/tools/database/prisma.js'
import { GameRepository } from '#src/tools/repositories/GameRepository.js'

const getServiceSchema: FastifySchema = {
  description: 'GET gameUsers information in a Game.',
  tags: ['games'] as string[],
  params: servicesSchema['/games/:gameId/lobby'].get.parameters,
  response: {
    200: servicesSchema['/games/:gameId/lobby'].get.response,
    400: fastifyErrors[400],
    401: fastifyErrors[401],
    403: fastifyErrors[403],
    404: fastifyErrors[404],
    500: fastifyErrors[500]
  }
} as const

export const getLobbyGames: FastifyPluginAsync = async (fastify) => {
  fastify.route<{
    Params: Services['/games/:gameId/lobby']['get']['parameters']
    Reply: Services['/games/:gameId/lobby']['get']['response']
  }>({
    method: 'GET',
    url: '/games/:gameId/lobby',
    schema: getServiceSchema,
    handler: async (request, reply) => {
      const { gameId } = request.params
      const games = GameRepository.getInstance()
      const gameMachine = games.getGameMachine(gameId)
      if (gameMachine == null) {
        throw fastify.httpErrors.notFound('Game not found.')
      }
      const players = games.getPlayers(gameId)
      const gameUsers: GameUser[] = await Promise.all(
        players.map(async (player) => {
          const user = await prisma.user.findUnique({
            where: {
              id: player.id
            }
          })
          if (user == null) {
            throw fastify.httpErrors.internalServerError('User not found.')
          }
          return {
            id: player.id,
            name: user.name,
            logo: user.logo,
            color: player.color
          }
        })
      )
      reply.statusCode = 200
      return gameUsers
    }
  })
}
