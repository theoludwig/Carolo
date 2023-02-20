import type { Static } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import type { FastifyPluginAsync, FastifySchema } from 'fastify'
import { fastifyErrors, userPublicSchema } from '@carolo/models'

import prisma from '#src/tools/database/prisma.js'

const parametersGetUserSchema = Type.Object({
  userId: userPublicSchema.id
})

type ParametersGetUser = Static<typeof parametersGetUserSchema>

const getServiceSchema: FastifySchema = {
  description: 'GET the public user informations with its id.',
  tags: ['users'] as string[],
  params: parametersGetUserSchema,
  response: {
    200: Type.Object({
      user: Type.Object(userPublicSchema)
    }),
    400: fastifyErrors[400],
    404: fastifyErrors[404],
    500: fastifyErrors[500]
  }
} as const

export const getUserById: FastifyPluginAsync = async (fastify) => {
  fastify.route<{
    Params: ParametersGetUser
  }>({
    method: 'GET',
    url: '/users/:userId',
    schema: getServiceSchema,
    handler: async (request, reply) => {
      const { userId } = request.params
      const settings = await prisma.userSetting.findFirst({
        where: { userId }
      })
      if (settings == null) {
        throw fastify.httpErrors.notFound('User not found')
      }
      const user = await prisma.user.findUnique({
        where: {
          id: userId
        },
        select: {
          id: true,
          name: true,
          email: false,
          isConfirmed: true,
          logo: true,
          createdAt: true,
          updatedAt: true
        }
      })
      if (user == null) {
        throw fastify.httpErrors.notFound('User not found')
      }
      reply.statusCode = 200
      return {
        user: {
          ...user,
          settings
        }
      }
    }
  })
}
