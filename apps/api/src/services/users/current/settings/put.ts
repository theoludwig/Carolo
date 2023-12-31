import type { Static } from "@sinclair/typebox"
import { Type } from "@sinclair/typebox"
import type { FastifyPluginAsync, FastifySchema } from "fastify"
import { fastifyErrors, userSettingsSchema } from "@carolo/models"

import prisma from "#src/tools/database/prisma.js"
import authenticateUser from "#src/tools/plugins/authenticateUser.js"

const bodyPutServiceSchema = Type.Object({
  locale: Type.Optional(userSettingsSchema.locale),
})

type BodyPutServiceSchemaType = Static<typeof bodyPutServiceSchema>

const putServiceSchema: FastifySchema = {
  description: "Edit the current connected user settings.",
  tags: ["users"] as string[],
  security: [
    {
      bearerAuth: [],
    },
  ] as Array<{ [key: string]: [] }>,
  body: bodyPutServiceSchema,
  response: {
    200: Type.Object({
      settings: Type.Object(userSettingsSchema),
    }),
    400: fastifyErrors[400],
    401: fastifyErrors[401],
    403: fastifyErrors[403],
    429: fastifyErrors[429],
    500: fastifyErrors[500],
  },
} as const

export const putCurrentUserSettings: FastifyPluginAsync = async (fastify) => {
  await fastify.register(authenticateUser)

  fastify.route<{
    Body: BodyPutServiceSchemaType
  }>({
    method: "PUT",
    url: "/users/current/settings",
    schema: putServiceSchema,
    handler: async (request, reply) => {
      if (request.user == null) {
        throw fastify.httpErrors.forbidden()
      }
      const { locale } = request.body
      let settings = await prisma.userSetting.findFirst({
        where: { userId: request.user.current.id },
      })
      if (settings == null) {
        settings = await prisma.userSetting.create({
          data: {},
        })
      }
      const newSettings = await prisma.userSetting.update({
        where: { id: request.user.current.id },
        data: {
          locale: locale ?? settings.locale,
        },
      })
      reply.statusCode = 200
      return { settings: newSettings }
    },
  })
}
