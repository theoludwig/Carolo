import { randomUUID } from 'node:crypto'

import type { Static } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import type { FastifyPluginAsync, FastifySchema } from 'fastify'
import {
  fastifyErrors,
  userCurrentSchemaObject,
  userSchema
} from '@carolo/models'
import type { Locale } from '@carolo/models'

import prisma from '#src/tools/database/prisma.js'
import authenticateUser from '#src/tools/plugins/authenticateUser.js'
import { sendEmail } from '#src/tools/email/sendEmail.js'
import { API_URL } from '#src/tools/configurations.js'

const bodyPutServiceSchema = Type.Object({
  name: Type.Optional(userSchema.name),
  email: Type.Optional(userSchema.email)
})

type BodyPutServiceSchemaType = Static<typeof bodyPutServiceSchema>

const queryPutCurrentUserSchema = Type.Object({
  redirectURI: Type.Optional(Type.String({ format: 'uri-reference' }))
})

type QueryPutCurrentUserSchemaType = Static<typeof queryPutCurrentUserSchema>

const putServiceSchema: FastifySchema = {
  description: 'Edit the current connected user information.',
  tags: ['users'] as string[],
  security: [
    {
      bearerAuth: []
    }
  ] as Array<{ [key: string]: [] }>,
  body: bodyPutServiceSchema,
  querystring: queryPutCurrentUserSchema,
  response: {
    200: userCurrentSchemaObject,
    400: fastifyErrors[400],
    401: fastifyErrors[401],
    403: fastifyErrors[403],
    500: fastifyErrors[500]
  }
} as const

export const putCurrentUser: FastifyPluginAsync = async (fastify) => {
  await fastify.register(authenticateUser)

  fastify.route<{
    Body: BodyPutServiceSchemaType
    Querystring: QueryPutCurrentUserSchemaType
  }>({
    method: 'PUT',
    url: '/users/current',
    schema: putServiceSchema,
    handler: async (request, reply) => {
      if (request.user == null) {
        throw fastify.httpErrors.forbidden()
      }
      const { name, email } = request.body
      const { redirectURI } = request.query
      const userValidation = await prisma.user.findFirst({
        where: {
          OR: [
            ...(email != null ? [{ email }] : [{}]),
            ...(name != null ? [{ name }] : [{}])
          ],
          AND: [{ id: { not: request.user.current.id } }]
        }
      })
      if (userValidation != null) {
        throw fastify.httpErrors.badRequest(
          'body.email or body.name already taken.'
        )
      }
      const settings = await prisma.userSetting.findFirst({
        where: { userId: request.user.current.id }
      })
      if (settings == null) {
        throw fastify.httpErrors.internalServerError()
      }
      const strategies = ['Local'] as const
      if (email != null && email !== request.user.current.email) {
        await prisma.refreshToken.deleteMany({
          where: {
            userId: request.user.current.id
          }
        })
        const temporaryToken = randomUUID()
        const url = new URL('/users/confirm-email', API_URL)
        url.searchParams.set('temporaryToken', temporaryToken)
        if (redirectURI != null) {
          url.searchParams.set('redirectURI', redirectURI)
        }
        await sendEmail({
          type: 'confirm-email',
          email,
          url: url.toString(),
          locale: settings.locale as Locale
        })
        await prisma.user.update({
          where: { id: request.user.current.id },
          data: {
            email,
            temporaryToken,
            isConfirmed: false
          }
        })
      }
      const user = await prisma.user.update({
        where: { id: request.user.current.id },
        data: {
          name: name ?? request.user.current.name
        }
      })
      reply.statusCode = 200
      return {
        user: {
          ...user,
          settings,
          currentStrategy: request.user.currentStrategy,
          strategies
        }
      }
    }
  })
}
