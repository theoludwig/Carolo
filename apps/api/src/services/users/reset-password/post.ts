import crypto from "node:crypto"

import type { Static } from "@sinclair/typebox"
import { Type } from "@sinclair/typebox"
import type { FastifyPluginAsync, FastifySchema } from "fastify"
import ms from "ms"
import type { Locale } from "@carolo/models"
import { fastifyErrors, userSchema } from "@carolo/models"

import prisma from "#src/tools/database/prisma.js"
import { sendEmail } from "#src/tools/email/sendEmail.js"

const queryPostResetPasswordSchema = Type.Object({
  redirectURI: Type.String({ format: "uri-reference" }),
})

type QueryPostResetPasswordSchemaType = Static<
  typeof queryPostResetPasswordSchema
>

const bodyPostResetPasswordSchema = Type.Object({
  email: userSchema.email,
})

type BodyPostResetPasswordSchemaType = Static<
  typeof bodyPostResetPasswordSchema
>

const postResetPasswordSchema: FastifySchema = {
  description: "Request a password-reset change.",
  tags: ["users"] as string[],
  body: bodyPostResetPasswordSchema,
  querystring: queryPostResetPasswordSchema,
  response: {
    200: Type.String(),
    400: fastifyErrors[400],
    429: fastifyErrors[429],
    500: fastifyErrors[500],
  },
} as const

export const postResetPasswordUser: FastifyPluginAsync = async (fastify) => {
  fastify.route<{
    Body: BodyPostResetPasswordSchemaType
    Querystring: QueryPostResetPasswordSchemaType
  }>({
    method: "POST",
    url: "/users/reset-password",
    schema: postResetPasswordSchema,
    handler: async (request, reply) => {
      const { email } = request.body
      const { redirectURI } = request.query
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      })
      if (user == null) {
        throw fastify.httpErrors.badRequest("Email address doesn't exist")
      }
      if (!user.isConfirmed) {
        throw fastify.httpErrors.badRequest(
          "You should have a confirmed account, please check your email and follow the instructions to verify your account",
        )
      }
      const isValidTemporaryToken =
        user.temporaryExpirationToken != null &&
        user.temporaryExpirationToken.getTime() > Date.now()
      if (user.temporaryToken != null && isValidTemporaryToken) {
        throw fastify.httpErrors.badRequest(
          "A request to reset-password is already in progress",
        )
      }
      const userSettings = await prisma.userSetting.findFirst({
        where: { userId: user.id },
      })
      if (userSettings == null) {
        throw fastify.httpErrors.badRequest()
      }
      const temporaryToken = crypto.randomUUID()
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          temporaryExpirationToken: new Date(Date.now() + ms("1 hour")),
          temporaryToken,
        },
      })
      const url = new URL(redirectURI)
      url.searchParams.set("temporaryToken", temporaryToken)
      await sendEmail({
        type: "reset-password",
        email,
        url: url.toString(),
        locale: userSettings.locale as Locale,
      })
      reply.statusCode = 200
      return "Password-reset request successful, please check your emails!"
    },
  })
}
