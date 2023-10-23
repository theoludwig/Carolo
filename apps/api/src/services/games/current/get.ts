import type { FastifyPluginAsync, FastifySchema } from "fastify"
import type { Services } from "@carolo/models"
import { fastifyErrors, servicesSchema } from "@carolo/models"

import { GameRepository } from "#src/tools/repositories/GameRepository.js"
import authenticateUser from "#src/tools/plugins/authenticateUser.js"

const getServiceSchema: FastifySchema = {
  description: "GET current playing gameId of the connected user.",
  tags: ["games"] as string[],
  security: [
    {
      bearerAuth: [],
    },
  ] as Array<{ [key: string]: [] }>,
  response: {
    200: servicesSchema["/games/current"].get.response,
    400: fastifyErrors[400],
    401: fastifyErrors[401],
    403: fastifyErrors[403],
    404: fastifyErrors[404],
    429: fastifyErrors[429],
    500: fastifyErrors[500],
  },
} as const

export const getCurrentGame: FastifyPluginAsync = async (fastify) => {
  await fastify.register(authenticateUser)

  fastify.route<{
    Reply: Services["/games/current"]["get"]["response"]
  }>({
    method: "GET",
    url: "/games/current",
    schema: getServiceSchema,
    handler: async (request, reply) => {
      if (request.user == null) {
        throw fastify.httpErrors.forbidden()
      }
      const games = GameRepository.getInstance()
      const player = games.getPlayer(request.user.current.id)
      let gameId: string | null = null
      if (player != null) {
        gameId = player.gameId
      }
      reply.statusCode = 200
      return { gameId }
    },
  })
}
