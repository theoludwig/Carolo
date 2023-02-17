import type { FastifyPluginAsync } from 'fastify'

import { usersService } from '#src/services/users/index.js'

export const services: FastifyPluginAsync = async (fastify) => {
  await fastify.register(usersService)
}
