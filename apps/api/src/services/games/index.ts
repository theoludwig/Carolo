import type { FastifyPluginAsync } from 'fastify'

import { postActionsGames } from '#src/services/games/[gameId]/actions/post.js'
import { postJoinGames } from '#src/services/games/[gameId]/join/post.js'
import { postGames } from '#src/services/games/post.js'
import { getLobbyGames } from '#src/services/games/[gameId]/lobby/get.js'

export const gamesService: FastifyPluginAsync = async (fastify) => {
  await fastify.register(postActionsGames)
  await fastify.register(postJoinGames)
  await fastify.register(getLobbyGames)
  await fastify.register(postGames)
}
