import type { FastifyPluginAsync } from "fastify"

import { usersService } from "#src/services/users/index.js"
import { gamesService } from "#src/services/games/index.js"

export const services: FastifyPluginAsync = async (fastify) => {
  await fastify.register(usersService)
  await fastify.register(gamesService)
}
