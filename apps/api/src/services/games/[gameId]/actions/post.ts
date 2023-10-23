import type { FastifyPluginAsync, FastifySchema } from "fastify"
import type { Services } from "@carolo/models"
import { fastifyErrors, servicesSchema } from "@carolo/models"
import { Position } from "@carolo/game"
import type { PositionString } from "@carolo/game"

import prisma from "#src/tools/database/prisma.js"
import authenticateUser from "#src/tools/plugins/authenticateUser.js"
import { GameRepository } from "#src/tools/repositories/GameRepository.js"

const postServiceSchema: FastifySchema = {
  description: "Perform an action in a Game.",
  tags: ["games"] as string[],
  security: [
    {
      bearerAuth: [],
    },
  ] as Array<{ [key: string]: [] }>,
  params: servicesSchema["/games/:gameId/actions"].post.parameters,
  body: servicesSchema["/games/:gameId/actions"].post.body,
  response: {
    201: servicesSchema["/games/:gameId/actions"].post.response,
    400: fastifyErrors[400],
    401: fastifyErrors[401],
    403: fastifyErrors[403],
    404: fastifyErrors[404],
    429: fastifyErrors[429],
    500: fastifyErrors[500],
  },
} as const

export const postActionsGames: FastifyPluginAsync = async (fastify) => {
  await fastify.register(authenticateUser)

  fastify.route<{
    Params: Services["/games/:gameId/actions"]["post"]["parameters"]
    Body: Services["/games/:gameId/actions"]["post"]["body"]
    Reply: Services["/games/:gameId/actions"]["post"]["response"]
  }>({
    method: "POST",
    url: "/games/:gameId/actions",
    schema: postServiceSchema,
    handler: async (request, reply) => {
      if (request.user == null) {
        throw fastify.httpErrors.forbidden()
      }
      const { gameId } = request.params
      const action = request.body
      if (
        action.type === "MOVE" &&
        (action.fromPosition == null || action.toPosition == null)
      ) {
        throw fastify.httpErrors.badRequest("Invalid move.")
      }
      if (action.type === "RESIGN" && action.color == null) {
        throw fastify.httpErrors.badRequest("Invalid resign.")
      }

      const games = GameRepository.getInstance()
      const gameMachine = games.getGameMachine(gameId)
      if (gameMachine == null) {
        throw fastify.httpErrors.notFound("Game not found.")
      }
      const player = games.getPlayer(request.user.current.id)
      if (player == null) {
        throw fastify.httpErrors.badRequest("You are not in this game.")
      }

      if (action.type === "RESIGN" && action.color !== player.color) {
        throw fastify.httpErrors.badRequest(
          "You cannot resign for the other player.",
        )
      }

      if (
        gameMachine.game.state.status === "LOBBY" &&
        action.type === "RESIGN"
      ) {
        games.deleteGame(gameId)
        throw fastify.httpErrors.badRequest("Game is not in play.")
      }

      if (gameMachine.game.state.status !== "PLAY") {
        throw fastify.httpErrors.badRequest("Game is not in play.")
      }

      const currentPlayer = gameMachine.game.getCurrentPlayer()
      if (action.type !== "RESIGN" && currentPlayer.color !== player.color) {
        throw fastify.httpErrors.badRequest("It is not your turn.")
      }

      if (action.type === "MOVE") {
        const fromPosition = Position.fromString(
          action.fromPosition as PositionString,
        )
        const toPosition = Position.fromString(
          action.toPosition as PositionString,
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

      if (action.type === "SKIP_BOUNCING") {
        gameMachine.game.skipBouncing()
      }

      if (action.type === "RESIGN" && action.color === player.color) {
        gameMachine.game.resign(action.color)
      }

      let game = await prisma.game.findUnique({
        where: {
          id: gameId,
        },
      })
      if (game == null) {
        const playerBlack = games.getPlayerByColor(gameId, "BLACK")
        const playerWhite = games.getPlayerByColor(gameId, "WHITE")
        if (playerBlack == null || playerWhite == null) {
          throw fastify.httpErrors.internalServerError("Invalid game.")
        }
        game = await prisma.game.create({
          data: {
            id: gameId,
            status: gameMachine.game.state.status,
            playerBlackId: playerBlack.id,
            playerWhiteId: playerWhite.id,
          },
        })
      }

      const gameAction = await prisma.gameAction.create({
        data: {
          gameId: game.id,
          type: action.type,
          fromPosition: action.fromPosition,
          toPosition: action.toPosition,
          color: action.color,
        },
      })

      if (gameMachine.game.state.status !== "PLAY") {
        await prisma.game.update({
          where: {
            id: game.id,
          },
          data: {
            status: gameMachine.game.state.status,
          },
        })
        games.deleteGame(gameId)
      }

      fastify.io.instance.to(`game:${gameId}`).emit("game:action", gameAction)
      reply.statusCode = 201
      return {
        ...gameAction,
        type: action.type,
        color: action.color ?? null,
        createdAt: gameAction.createdAt.toISOString(),
        updatedAt: gameAction.updatedAt.toISOString(),
      }
    },
  })
}
