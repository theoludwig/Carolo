import type { FastifyPluginAsync, FastifySchema } from 'fastify'
import type { GameUser, Services, GameActionBasic } from '@carolo/models'
import { fastifyErrors, servicesSchema } from '@carolo/models'
import type { GameStatus } from '@carolo/game'

import prisma from '#src/tools/database/prisma.js'
import { GameRepository } from '#src/tools/repositories/GameRepository.js'

const getServiceSchema: FastifySchema = {
  description: 'GET information about a Game.',
  tags: ['games'] as string[],
  params: servicesSchema['/games/:gameId'].get.parameters,
  response: {
    200: servicesSchema['/games/:gameId'].get.response,
    400: fastifyErrors[400],
    401: fastifyErrors[401],
    403: fastifyErrors[403],
    404: fastifyErrors[404],
    500: fastifyErrors[500]
  }
} as const

export const getGameById: FastifyPluginAsync = async (fastify) => {
  fastify.route<{
    Params: Services['/games/:gameId']['get']['parameters']
    Reply: Services['/games/:gameId']['get']['response']
  }>({
    method: 'GET',
    url: '/games/:gameId',
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
            id: user.id,
            name: user.name,
            logo: user.logo,
            color: player.color
          }
        })
      )
      const playerBlack = gameUsers.find((gameUser) => {
        return gameUser.color === 'BLACK'
      })
      const playerWhite = gameUsers.find((gameUser) => {
        return gameUser.color === 'WHITE'
      })

      let status: GameStatus = gameMachine.game.state.status
      const game = await prisma.game.findUnique({
        where: {
          id: gameId
        }
      })
      if (game != null) {
        status = game.status as GameStatus
      }

      const actions = (
        await prisma.gameAction.findMany({
          where: {
            gameId
          }
        })
      ).map((gameAction) => {
        return {
          type: gameAction.type,
          fromPosition: gameAction.fromPosition,
          toPosition: gameAction.toPosition
        }
      }) as GameActionBasic[]

      reply.statusCode = 200
      return {
        id: gameMachine.id,
        status,
        actions,
        playerBlackId: playerBlack?.id ?? null,
        playerBlack: playerBlack ?? null,
        playerWhiteId: playerWhite?.id ?? null,
        playerWhite: playerWhite ?? null
      }
    }
  })
}
