import type { FastifyPluginAsync, FastifySchema } from 'fastify'
import type { Services } from '@carolo/models'
import { fastifyErrors, servicesSchema } from '@carolo/models'
import { Position } from '@carolo/game'
import type { PositionString } from '@carolo/game'

import prisma from '#src/tools/database/prisma.js'
import authenticateUser from '#src/tools/plugins/authenticateUser.js'
import { GameRepository } from '#src/tools/repositories/GameRepository.js'

const postServiceSchema: FastifySchema = {
  description: 'Perform an action in a Game.',
  tags: ['games'] as string[],
  security: [
    {
      bearerAuth: []
    }
  ] as Array<{ [key: string]: [] }>,
  params: servicesSchema['/games/:gameId/actions'].post.parameters,
  body: servicesSchema['/games/:gameId/actions'].post.body,
  response: {
    201: servicesSchema['/games/:gameId/actions'].post.response,
    400: fastifyErrors[400],
    401: fastifyErrors[401],
    403: fastifyErrors[403],
    404: fastifyErrors[404],
    500: fastifyErrors[500]
  }
} as const

export const postActionsGames: FastifyPluginAsync = async (fastify) => {
  await fastify.register(authenticateUser)

  fastify.route<{
    Params: Services['/games/:gameId/actions']['post']['parameters']
    Body: Services['/games/:gameId/actions']['post']['body']
    Reply: Services['/games/:gameId/actions']['post']['response']
  }>({
    method: 'POST',
    url: '/games/:gameId/actions',
    schema: postServiceSchema,
    handler: async (request, reply) => {
      if (request.user == null) {
        throw fastify.httpErrors.forbidden()
      }
      const { gameId } = request.params
      const action = request.body
      const games = GameRepository.getInstance()
      const gameMachine = games.getGameMachine(gameId)
      if (gameMachine == null) {
        throw fastify.httpErrors.notFound('Game not found.')
      }
      const player = games.getPlayer(request.user.current.id)
      if (player == null) {
        throw fastify.httpErrors.badRequest('You are not in this game.')
      }
      const isLobby = gameMachine.game.state.status === 'LOBBY'
      if (isLobby) {
        gameMachine.game.play()
      }
      const currentPlayer = gameMachine.game.getCurrentPlayer()
      if (currentPlayer.color !== player.color) {
        throw fastify.httpErrors.badRequest('It is not your turn.')
      }
      if (
        action.type === 'MOVE' &&
        (action.fromPosition == null || action.toPosition == null)
      ) {
        throw fastify.httpErrors.badRequest('Invalid move.')
      }

      if (action.type === 'MOVE') {
        const fromPosition = Position.fromString(
          action.fromPosition as PositionString
        )
        const toPosition = Position.fromString(
          action.toPosition as PositionString
        )
        try {
          gameMachine.game.playMove(fromPosition, toPosition)
        } catch (error) {
          if (error instanceof Error) {
            throw fastify.httpErrors.badRequest(error.message)
          }
          throw fastify.httpErrors.badRequest()
        }
      }

      if (action.type === 'SKIP_BOUNCING') {
        gameMachine.game.skipBouncing()
      }

      if (action.type === 'RESIGN') {
        gameMachine.game.resign(currentPlayer.color)
      }

      let game = await prisma.game.findUnique({
        where: {
          id: gameId
        }
      })
      if (isLobby || game == null) {
        const playerBlack = games.getPlayerByColor(gameId, 'BLACK')
        const playerWhite = games.getPlayerByColor(gameId, 'WHITE')
        if (playerBlack == null || playerWhite == null) {
          throw fastify.httpErrors.internalServerError('Invalid game.')
        }
        game = await prisma.game.create({
          data: {
            id: gameId,
            status: 'PLAY',
            playerBlackId: playerBlack.id,
            playerWhiteId: playerWhite.id
          }
        })
      }

      const gameAction = await prisma.gameAction.create({
        data: {
          gameId: game.id,
          type: action.type,
          fromPosition: action.fromPosition,
          toPosition: action.toPosition
        }
      })

      if (gameMachine.game.state.status !== 'PLAY') {
        await prisma.game.update({
          where: {
            id: game.id
          },
          data: {
            status: gameMachine.game.state.status
          }
        })
        games.deleteGame(gameId)
      }

      fastify.io.instance.to(`game:${gameId}`).emit('game:action', gameAction)
      reply.statusCode = 201
      return {
        ...gameAction,
        type: action.type,
        createdAt: gameAction.createdAt.toISOString(),
        updatedAt: gameAction.updatedAt.toISOString()
      }
    }
  })
}
