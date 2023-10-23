import type { FastifyPluginAsync } from "fastify"

import { postActionsGames } from "#src/services/games/[gameId]/actions/post.js"
import { postJoinGames } from "#src/services/games/[gameId]/join/post.js"
import { getGameById } from "#src/services/games/[gameId]/get.js"
import { getCurrentGame } from "#src/services/games/current/get.js"
import { postGames } from "#src/services/games/post.js"

export const gamesService: FastifyPluginAsync = async (fastify) => {
  await fastify.register(postActionsGames)
  await fastify.register(postJoinGames)
  await fastify.register(getGameById)
  await fastify.register(getCurrentGame)
  await fastify.register(postGames)
}
