import { Type } from "@sinclair/typebox"
import type { FastifyPluginAsync, FastifySchema } from "fastify"
import { fastifyErrors } from "@carolo/models"

import prisma from "#src/tools/database/prisma.js"
import authenticateUser from "#src/tools/plugins/authenticateUser.js"

const deleteSignoutSchema: FastifySchema = {
  description: "Signout the user to every connected devices.",
  tags: ["users"] as string[],
  security: [
    {
      bearerAuth: [],
    },
  ] as Array<{ [key: string]: [] }>,
  response: {
    200: Type.Object({}),
    400: fastifyErrors[400],
    401: fastifyErrors[401],
    403: fastifyErrors[403],
    429: fastifyErrors[429],
    500: fastifyErrors[500],
  },
} as const

export const deleteSignoutUser: FastifyPluginAsync = async (fastify) => {
  await fastify.register(authenticateUser)

  fastify.route({
    method: "DELETE",
    url: "/users/signout",
    schema: deleteSignoutSchema,
    handler: async (request, reply) => {
      if (request.user == null) {
        throw fastify.httpErrors.forbidden()
      }
      await prisma.refreshToken.deleteMany({
        where: {
          userId: request.user.current.id,
        },
      })
      reply.statusCode = 200
      return {}
    },
  })
}
