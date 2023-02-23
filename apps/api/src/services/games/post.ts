import type { FastifyPluginAsync, FastifySchema } from 'fastify'
import type { Services } from '@carolo/models'
import { fastifyErrors, servicesSchema } from '@carolo/models'

import authenticateUser from '#src/tools/plugins/authenticateUser.js'
import { GameRepository } from '#src/tools/repositories/GameRepository.js'

const postServiceSchema: FastifySchema = {
  description: 'Create a new Game Lobby.',
  tags: ['games'] as string[],
  security: [
    {
      bearerAuth: []
    }
  ] as Array<{ [key: string]: [] }>,
  body: servicesSchema['/games'].post.body,
  response: {
    201: servicesSchema['/games'].post.response,
    400: fastifyErrors[400],
    401: fastifyErrors[401],
    403: fastifyErrors[403],
    500: fastifyErrors[500]
  }
} as const

export const postGames: FastifyPluginAsync = async (fastify) => {
  await fastify.register(authenticateUser)

  fastify.route<{
    Body: Services['/games']['post']['body']
    Reply: Services['/games']['post']['response']
  }>({
    method: 'POST',
    url: '/games',
    schema: postServiceSchema,
    handler: async (request, reply) => {
      if (request.user == null) {
        throw fastify.httpErrors.forbidden()
      }
      const { color } = request.body
      const games = GameRepository.getInstance()
      const player = games.getPlayer(request.user.current.id)
      if (player != null) {
        throw fastify.httpErrors.badRequest('You are already in a game.')
      }
      const gameId = games.createGame(request.user.current.id, color)
      reply.statusCode = 201
      return { gameId }
    }
  })
}
