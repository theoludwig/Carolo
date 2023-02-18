import type { Static } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import type { FastifyPluginAsync, FastifySchema } from 'fastify'
import jwt from 'jsonwebtoken'
import { fastifyErrors, tokensJWTSchema } from '@carolo/models'
import type { UserRefreshJWT } from '@carolo/models'

import prisma from '#src/tools/database/prisma.js'
import { generateAccessToken, expiresIn } from '#src/tools/utils/jwtToken.js'
import { JWT_REFRESH_SECRET } from '#src/tools/configurations.js'

const bodyPostRefreshTokenSchema = Type.Object({
  refreshToken: tokensJWTSchema.refreshToken
})

type BodyPostRefreshTokenSchemaType = Static<typeof bodyPostRefreshTokenSchema>

const postRefreshTokenSchema: FastifySchema = {
  description: 'Refresh the accessToken of the user.',
  tags: ['users'] as string[],
  body: bodyPostRefreshTokenSchema,
  response: {
    200: Type.Object({
      accessToken: tokensJWTSchema.accessToken,
      expiresIn: tokensJWTSchema.expiresIn,
      type: tokensJWTSchema.type
    }),
    400: fastifyErrors[400],
    403: fastifyErrors[403],
    500: fastifyErrors[500]
  }
} as const

export const postRefreshTokenUser: FastifyPluginAsync = async (fastify) => {
  await fastify.route<{
    Body: BodyPostRefreshTokenSchemaType
  }>({
    method: 'POST',
    url: '/users/refresh-token',
    schema: postRefreshTokenSchema,
    handler: async (request, reply) => {
      const { refreshToken } = request.body
      try {
        const userRefreshJWT = jwt.verify(
          refreshToken,
          JWT_REFRESH_SECRET
        ) as UserRefreshJWT
        const foundRefreshToken = await prisma.refreshToken.findFirst({
          where: { token: userRefreshJWT.tokenUUID }
        })
        if (foundRefreshToken == null) {
          throw fastify.httpErrors.forbidden()
        }
        const accessToken = generateAccessToken({
          id: userRefreshJWT.id,
          currentStrategy: userRefreshJWT.currentStrategy
        })
        reply.statusCode = 200
        return {
          accessToken,
          expiresIn,
          type: 'Bearer'
        }
      } catch {
        throw fastify.httpErrors.forbidden()
      }
    }
  })
}
