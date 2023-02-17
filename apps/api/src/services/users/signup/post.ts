import { randomUUID } from 'node:crypto'

import type { Static } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import bcrypt from 'bcryptjs'
import type { FastifyPluginAsync, FastifySchema } from 'fastify'
import { fastifyErrors, bodyUserSchema, userPublicSchema } from '@carolo/models'
import type { BodyUserSchemaType } from '@carolo/models'

import prisma from '#src/tools/database/prisma.js'
import { sendEmail } from '#src/tools/email/sendEmail.js'
import { API_URL } from '#src/tools/configurations.js'

const queryPostSignupSchema = Type.Object({
  redirectURI: Type.Optional(Type.String({ format: 'uri-reference' }))
})

type QueryPostSignupSchemaType = Static<typeof queryPostSignupSchema>

const postSignupSchema: FastifySchema = {
  description:
    'Allows a new user to signup, if success he would need to confirm his email.',
  tags: ['users'] as string[],
  body: bodyUserSchema,
  querystring: queryPostSignupSchema,
  response: {
    201: Type.Object({ user: Type.Object(userPublicSchema) }),
    400: fastifyErrors[400],
    500: fastifyErrors[500]
  }
} as const

export const postSignupUser: FastifyPluginAsync = async (fastify) => {
  await fastify.route<{
    Body: BodyUserSchemaType
    Querystring: QueryPostSignupSchemaType
  }>({
    method: 'POST',
    url: '/users/signup',
    schema: postSignupSchema,
    handler: async (request, reply) => {
      const { name, email, password, language } = request.body
      const { redirectURI } = request.query
      const userValidation = await prisma.user.findFirst({
        where: {
          OR: [{ email }, { name }]
        }
      })
      if (userValidation != null) {
        throw fastify.httpErrors.badRequest(
          'body.email or body.name already taken.'
        )
      }
      const hashedPassword = await bcrypt.hash(password, 12)
      const temporaryToken = randomUUID()
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          temporaryToken
        }
      })
      const userSettings = await prisma.userSetting.create({
        data: {
          userId: user.id,
          language
        }
      })
      const url = new URL('/users/confirm-email', API_URL)
      url.searchParams.set('temporaryToken', temporaryToken)
      if (redirectURI != null) {
        url.searchParams.set('redirectURI', redirectURI)
      }
      await sendEmail({
        type: 'confirm-email',
        email,
        url: url.toString(),
        language
      })
      reply.statusCode = 201
      return {
        user: {
          ...user,
          settings: { ...userSettings }
        }
      }
    }
  })
}
