import type { FastifyPluginAsync, FastifySchema } from 'fastify'
import type { Services } from '@carolo/models'
import { fastifyErrors, servicesSchema } from '@carolo/models'

import authenticateUser from '#src/tools/plugins/authenticateUser.js'
import { GameRepository } from '#src/tools/repositories/GameRepository.js'

const postServiceSchema: FastifySchema = {
  description: 'Join a Game.',
  tags: ['games'] as string[],
  security: [
    {
      bearerAuth: []
    }
  ] as Array<{ [key: string]: [] }>,
  params: servicesSchema['/games/:gameId/join'].post.parameters,
  response: {
    201: servicesSchema['/games/:gameId/join'].post.response,
    400: fastifyErrors[400],
    401: fastifyErrors[401],
    403: fastifyErrors[403],
    404: fastifyErrors[404],
    500: fastifyErrors[500]
  }
} as const

export const postJoinGames: FastifyPluginAsync = async (fastify) => {
  await fastify.register(authenticateUser)

  fastify.route<{
    Params: Services['/games/:gameId/join']['post']['parameters']
    Reply: Services['/games/:gameId/join']['post']['response']
  }>({
    method: 'POST',
    url: '/games/:gameId/join',
    schema: postServiceSchema,
    handler: async (request, reply) => {
      if (request.user == null) {
        throw fastify.httpErrors.forbidden()
      }
      const { gameId } = request.params
      const games = GameRepository.getInstance()
      if (games.getPlayer(request.user.current.id) != null) {
        throw fastify.httpErrors.badRequest('You are already in a game.')
      }
      const gameMachine = games.getGameMachine(gameId)
      if (gameMachine == null) {
        throw fastify.httpErrors.notFound('Game not found.')
      }
      const players = games.getPlayers(gameId)
      if (players.length === 2) {
        throw fastify.httpErrors.badRequest('Game is full.')
      }
      games.joinPlayer(gameId, request.user.current.id)
      const player = games.getPlayer(request.user.current.id)
      if (player == null) {
        throw fastify.httpErrors.internalServerError()
      }

      if (gameMachine.game.state.status === 'LOBBY') {
        gameMachine.game.restart()
        gameMachine.game.play()
      }

      const gameUser = {
        id: player.id,
        name: request.user.current.name,
        logo: request.user.current.logo,
        color: player.color
      }
      fastify.io.instance.to(`game:${gameId}`).emit('game:joinPlayer', gameUser)
      reply.statusCode = 201
      return gameUser
    }
  })
}
